import { Hono } from 'hono'
import userRouter from '@/api/routes/user'
import type { BaseEnv } from '@/api/types/hono'

const rpcRouter = new Hono<BaseEnv>()

const router = rpcRouter.route('/user', userRouter)

export default router

export type AppType = typeof router
