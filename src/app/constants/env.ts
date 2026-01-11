type Mode = "development" | "staging" | "production"

export const MODE: Mode = (import.meta.env.MODE as Mode) || "development"

export const isDevelopment = MODE === "development"
export const isProduction = MODE === "production"
export const isStaging = MODE === "staging"
