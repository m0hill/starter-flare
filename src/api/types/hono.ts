import type { Session, User } from '@/shared/types'
import type { RequestIdVariables } from 'hono/request-id'

export interface BaseEnv {
  Bindings: Env
  Variables: RequestIdVariables & {
    user: User | null
    session: Session | null
  }
}
