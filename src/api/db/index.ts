import * as schema from '@/api/db/schema'
import { isDevelopment } from '@/shared/constants/env'
import { drizzle } from 'drizzle-orm/d1'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export const createDB = (env: Env) => {
  return drizzle(env.DB, {
    schema,
    logger: isDevelopment,
  })
}

export type DBType = DrizzleD1Database<typeof schema>
