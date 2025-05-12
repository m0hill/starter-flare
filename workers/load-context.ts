import type { AppLoadContext } from 'react-router'

type CloudflareContext = {
  env: Env
  ctx: ExecutionContext
}

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: CloudflareContext
  }
}

type GetLoadContextArgs = {
  cloudflare: CloudflareContext
}

export function getLoadContext(args: GetLoadContextArgs): AppLoadContext {
  return {
    cloudflare: args.cloudflare,
  }
}
