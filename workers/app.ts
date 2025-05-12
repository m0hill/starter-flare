import { createRequestHandler } from 'react-router'
import apiApp from '../src/api'
import { getLoadContext } from './load-context'

const reactRouterHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    try {
      if (url.pathname.startsWith('/api')) {
        return await apiApp.fetch(request, env, ctx)
      }

      const loadContext = getLoadContext({ cloudflare: { env, ctx } })
      return await reactRouterHandler(request, loadContext)
    } catch (error) {
      console.error('Worker fetch error:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  },
} satisfies ExportedHandler<Env>
