import { createRequestHandler } from "react-router"
import apiApp from "../src/api"
import { getLoadContext } from "./load-context"

const reactRouterHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
)

const applySecurityHeaders = (response: Response, request: Request): Response => {
  const requestUrl = new URL(request.url)
  const headers = new Headers(response.headers)

  if (!headers.has("X-Content-Type-Options")) {
    headers.set("X-Content-Type-Options", "nosniff")
  }
  if (!headers.has("X-Frame-Options")) {
    headers.set("X-Frame-Options", "DENY")
  }
  if (!headers.has("Referrer-Policy")) {
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  }

  const isDevelopment = import.meta.env.MODE === "development"
  if (
    !headers.has("Strict-Transport-Security") &&
    !isDevelopment &&
    requestUrl.protocol === "https:"
  ) {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  })
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    try {
      if (url.pathname.startsWith("/api")) {
        const response = await apiApp.fetch(request, env, ctx)
        return applySecurityHeaders(response, request)
      }

      const loadContext = getLoadContext({ cloudflare: { env, ctx } })
      const response = await reactRouterHandler(request, loadContext)
      return applySecurityHeaders(response, request)
    } catch (error) {
      globalThis["console"]?.error("Worker fetch error:", error)
      return applySecurityHeaders(new Response("Internal Server Error", { status: 500 }), request)
    }
  },
} satisfies ExportedHandler<Env>
