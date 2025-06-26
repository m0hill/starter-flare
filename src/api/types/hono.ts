import type { RequestIdVariables } from 'hono/request-id'
import type { Session, User } from '@/api/types/auth'

export interface BaseEnv {
  Bindings: Env
  Variables: RequestIdVariables & {
    user: User | null
    session: Session | null
  }
}
