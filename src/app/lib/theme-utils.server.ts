import { createCookieSessionStorage } from "react-router"
import { createThemeSessionResolver } from "remix-themes"
import { isProduction, isStaging } from "@/app/constants/env"

export function createThemeSessionResolverWithSecret(secret: string) {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "theme",
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secrets: [secret],
      secure: isProduction || isStaging,
    },
  })

  return createThemeSessionResolver(sessionStorage)
}

export function getThemeSecret() {
  const secret = process.env.THEME_COOKIE_SECRET

  if (!secret) {
    if (isProduction) {
      throw new Error("THEME_COOKIE_SECRET is required in production")
    }
    return "s3cr3t"
  }

  return secret
}
