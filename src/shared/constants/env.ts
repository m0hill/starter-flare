export const NODE_ENV = import.meta.env.MODE || 'development'
export const isDevelopment = NODE_ENV === 'development'
export const isProduction = NODE_ENV === 'production'
export const isStaging = NODE_ENV === 'staging'

export const APP_BASE_URL = import.meta.env.APP_BASE_URL || 'http://localhost:5173'
