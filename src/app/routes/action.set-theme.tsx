import { createThemeSessionResolverWithSecret, getThemeSecret } from '@/app/lib/theme-utils.server'
import type { ActionFunctionArgs } from 'react-router'
import { createThemeAction } from 'remix-themes'

export const action = async ({ request, context, params }: ActionFunctionArgs) => {
  const secret = getThemeSecret()

  const resolver = createThemeSessionResolverWithSecret(secret)

  const themeAction = createThemeAction(resolver)
  return themeAction({ request, context, params })
}
