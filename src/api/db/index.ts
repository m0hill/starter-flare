import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'
import { isDevelopment } from '@/api/constants/env'
import * as schema from '@/api/db/schema'

export const createDB = (env: Env) => {
  return drizzle(env.DB, {
    schema,
    logger: isDevelopment,
  })
}

export type DBType = DrizzleD1Database<typeof schema>
