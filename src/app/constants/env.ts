type Mode = 'development' | 'staging' | 'production'

const BASE_URLS: Record<Mode, string> = {
  development: 'http://localhost:5173',
  staging: 'https://staging.upresume.io',
  production: 'https://upresume.io',
}

export const MODE: Mode = (import.meta.env.MODE as Mode) || 'development'

export const isDevelopment = MODE === 'development'
export const isProduction = MODE === 'production'
export const isStaging = MODE === 'staging'

export const APP_BASE_URL = BASE_URLS[MODE]
