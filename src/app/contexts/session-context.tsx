import { authClient } from '@/app/lib/auth'
import { logError } from '@/app/lib/error-utils'
import type { User } from '@/shared/types'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type SessionContextType = {
  user: User | null
  isLoading: boolean
  error: Error | null
  refetchSession: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSessionData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data: session } = await authClient.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      logError(err, 'auth:session-fetch')
      setError(err instanceof Error ? err : new Error('Failed to fetch session'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSessionData()
  }, [fetchSessionData])

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoading,
        error,
        refetchSession: fetchSessionData,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
