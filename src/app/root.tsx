import { logError } from '@/app/lib/error-utils'
import { createThemeSessionResolverWithSecret, getThemeSecret } from '@/app/lib/theme-utils.server'
import { cn } from '@/app/lib/utils'
import { useEffect } from 'react'
import type { LinksFunction, LoaderFunctionArgs } from 'react-router'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from 'react-router'
import { scan } from 'react-scan'
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes'

import styles from './tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: styles },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const secret = getThemeSecret()

  const resolver = createThemeSessionResolverWithSecret(secret)

  const { getTheme } = await resolver(request)

  return {
    theme: getTheme(),
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}

export function App() {
  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()

  useEffect(() => {
    scan({
      enabled: false,
    })
  }, [])

  return (
    <html lang="en" className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const theme = 'dark'

  logError(error, 'root-error-boundary')

  return (
    <html lang="en" className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          {isRouteErrorResponse(error) ? (
            <>
              <h1 className="text-4xl font-bold mb-4">
                {error.status} {error.statusText}
              </h1>
              <p className="text-lg mb-8">
                {error.data ||
                  "The page you're looking for doesn't exist or is still under development."}
              </p>
            </>
          ) : error instanceof Error ? (
            <>
              <h1 className="text-4xl font-bold mb-4">Error</h1>
              <p className="text-lg mb-8">{error.message}</p>
            </>
          ) : (
            <h1 className="text-4xl font-bold mb-4">Unknown Error</h1>
          )}
          <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Go Home
          </a>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
