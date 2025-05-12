import { useRedirectIfAuthenticated } from '@/app/lib/auth'
import { Outlet } from 'react-router'

export default function AuthLayout() {
  const isChecking = useRedirectIfAuthenticated()

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div
          className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"
          aria-label="Loading"
          role="status"
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12">
        <Outlet />
      </main>
    </div>
  )
}
