import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { APP_BASE_URL } from '@/api/constants/env'
import { EMAIL_FROM } from '@/api/constants/services'
import { createDB } from '@/api/db'
import { sendEmail } from '@/api/lib/email'

export const getAuth = (env: Env) => {
  const db = createDB(env)
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    baseURL: APP_BASE_URL,
    trustedOrigins: [APP_BASE_URL],
    secondaryStorage: {
      get: async key => {
        const value = await env.KV.get(key)
        return value ? value.toString() : null
      },
      set: async (key, value, ttl) => {
        if (ttl) {
          await env.KV.put(key, value, { expirationTtl: ttl })
        } else {
          await env.KV.put(key, value)
        }
      },
      delete: async key => {
        await env.KV.delete(key)
      },
    },
    plugins: [admin()],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, token }) => {
        const resetPasswordUrl = `${APP_BASE_URL}/reset-password?token=${token}`
        await sendEmail({
          from: EMAIL_FROM,
          to: user.email,
          subject: 'Reset your password',
          html: `<p>Click <a href="${resetPasswordUrl}">here</a> to reset your password.</p>`,
        })
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, token }) => {
        const verificationUrl = `${APP_BASE_URL}/verify-email?token=${token}`
        await sendEmail({
          from: EMAIL_FROM,
          to: user.email,
          subject: 'Verify your email',
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
