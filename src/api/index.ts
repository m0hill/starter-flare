import { Hono } from "hono"
import { contextStorage } from "hono/context-storage"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { requestId } from "hono/request-id"
import { secureHeaders } from "hono/secure-headers"
import { NODE_ENV, isDevelopment } from "@/api/constants/env"
import { getAuth } from "@/api/lib/auth"
import rpcRouter from "@/api/routes"
import type { BaseEnv } from "@/api/types/hono"

const app = new Hono<BaseEnv>()

const publicRoutes: string[] = ["/api/auth/*", "/api/health", "/api/dashboard", "/api/"]

const apiSecurityHeaders = secureHeaders({
  strictTransportSecurity: isDevelopment ? false : "max-age=31536000; includeSubDomains; preload",
  xContentTypeOptions: true,
  xDnsPrefetchControl: true,
  xDownloadOptions: true,
  xFrameOptions: "DENY",
  xPermittedCrossDomainPolicies: true,
  referrerPolicy: "strict-origin-when-cross-origin",
})

app.use(contextStorage())

app.use("*", logger())
app.use("*", requestId())

app.get("/favicon.ico", (c) => c.body(null, 204))

app.use("/api/*", async (c, next) => {
  if (c.req.path.startsWith("/api/auth/") || c.req.path === "/api/dashboard") {
    return next()
  }
  return apiSecurityHeaders(c, next)
})

app.use("/api/*", async (c, next) => {
  const requestOrigin = new URL(c.req.url).origin
  return cors({
    origin: requestOrigin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  })(c, next)
})

app.use("*", async (c, next) => {
  if (isDevelopment) {
    return prettyJSON()(c, next)
  }
  await next()
})

app.use("*", async (c, next) => {
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.endsWith("*")) {
      return c.req.path.startsWith(route.slice(0, -1))
    }
    return c.req.path === route
  })

  if (isPublicRoute) {
    return next()
  }

  try {
    const auth = getAuth(c.env)
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session) {
      c.set("user", null)
      c.set("session", null)
      return next()
    }

    c.set("user", session.user)
    c.set("session", session.session)
    return next()
  } catch {
    c.set("user", null)
    c.set("session", null)
    return next()
  }
})

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})

app.get("/api/", (c) => {
  return c.text("Hello, Universe!")
})

app.get("/api/dashboard", (c) => {
  return c.redirect("/dashboard")
})

app.route("/api", rpcRouter)

app.get("/api/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
  })
)

app.onError((error, c) => {
  const requestId = c.get("requestId")
  globalThis["console"]?.error("API error", { requestId, error })
  return c.json(
    {
      message: "Internal Server Error",
      requestId,
      status: 500,
    },
    500
  )
})

app.notFound((c) => {
  return c.json(
    {
      message: "Not Found",
      status: 404,
    },
    404
  )
})

export default app
