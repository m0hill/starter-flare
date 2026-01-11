import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { tryGetContext } from "hono/context-storage"
import { APP_BASE_URL } from "@/api/constants/env"
import { EMAIL_FROM } from "@/api/constants/services"
import { createDB } from "@/api/db"
import { sendEmail } from "@/api/lib/email"
import type { BaseEnv } from "@/api/types/hono"

export const getAuth = (env: Env) => {
  const db = createDB(env)
  const context = tryGetContext<BaseEnv>()
  const baseUrl = context ? new URL(context.req.url).origin : APP_BASE_URL

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    baseURL: baseUrl,
    trustedOrigins: [baseUrl],
    plugins: [admin()],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, token }) => {
        const resetPasswordUrl = `${baseUrl}/reset-password?token=${token}`
        await sendEmail({
          from: EMAIL_FROM,
          to: user.email,
          subject: "Reset your password",
          html: `<p>Click <a href="${resetPasswordUrl}">here</a> to reset your password.</p>`,
        })
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, token }) => {
        const verificationUrl = `${baseUrl}/verify-email?token=${token}`
        await sendEmail({
          from: EMAIL_FROM,
          to: user.email,
          subject: "Verify your email",
          html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
        })
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
  })
}
