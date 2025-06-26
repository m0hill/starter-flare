export const NODE_ENV = process.env.NODE_ENV || 'development'
export const isDevelopment = NODE_ENV === 'development'
export const isProduction = NODE_ENV === 'production'
export const isStaging = NODE_ENV === 'staging'

export const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5173'
