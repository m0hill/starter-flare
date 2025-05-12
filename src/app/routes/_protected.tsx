import { DashboardSidebar } from '@/app/components/dashboard-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar'
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
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ProtectedLayout() {
  return (
    <SessionProvider>
      <ProtectedLayoutContent />
    </SessionProvider>
  )
}
