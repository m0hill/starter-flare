import { DashboardSidebar } from '@/app/components/dashboard-sidebar'
import { SessionProvider, useSession } from '@/app/contexts/session-context'
import { logError } from '@/app/lib/error-utils'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import type { LoaderFunction } from 'react-router'

export const loader: LoaderFunction = async ({ request }) => {
  return {
    timestamp: Date.now(),
    url: request.url,
  }
}

function ProtectedLayoutContent() {
  const navigate = useNavigate()
  const { isLoading, user, error } = useSession()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login')
    }
  }, [isLoading, user, navigate])

  if (error) {
    logError(error, 'auth:session-check')
    navigate('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="border-b border-border px-6 py-3">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ProtectedLayout() {
  return (
    <SessionProvider>
      <ProtectedLayoutContent />
    </SessionProvider>
  )
}
