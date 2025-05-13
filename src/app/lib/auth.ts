import { logError } from '@/app/lib/error-utils'
import { APP_BASE_URL } from '@/shared/constants/env'
import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const authClient = createAuthClient({
  baseURL: APP_BASE_URL,
  plugins: [adminClient()],
})

export function useRedirectIfAuthenticated(redirectTo = '/dashboard') {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: session } = await authClient.getSession()
        if (session) {
          navigate(redirectTo)
        }
      } catch (error) {
        logError(error, 'auth:session-check')
      } finally {
        setIsChecking(false)
      }
    }

    checkSession()
  }, [navigate, redirectTo])

  return isChecking
}
