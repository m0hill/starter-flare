import { APP_BASE_URL, isProduction } from '@/shared/constants/env'
import { createCookieSessionStorage } from 'react-router'
import { createThemeSessionResolver } from 'remix-themes'

export function createThemeSessionResolverWithSecret(secret: string) {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: 'theme',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secrets: [secret],
      domain: new URL(APP_BASE_URL).hostname,
      secure: APP_BASE_URL.startsWith('https'),
    },
  })

  return createThemeSessionResolver(sessionStorage)
}

export function getThemeSecret() {
  const secret = process.env.THEME_COOKIE_SECRET

  if (!secret) {
    if (isProduction) {
      throw new Error('THEME_COOKIE_SECRET is required in production')
    }
    return 's3cr3t'
  }

  return secret
}
