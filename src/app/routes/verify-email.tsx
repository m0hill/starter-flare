import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { authClient } from '@/app/lib/auth'

interface VerificationState {
  status: 'loading' | 'success' | 'error'
  message?: string
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
  })

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setVerificationState({
          status: 'error',
          message: 'Verification token is missing. Please check your email link.',
        })
        return
      }

      try {
        const result = await authClient.verifyEmail({
          query: { token },
        })

        if (result.error) {
          setVerificationState({
            status: 'error',
            message:
              result.error.message || 'Failed to verify email. The link may be expired or invalid.',
          })
          return
        }

        setVerificationState({
          status: 'success',
        })

        localStorage.removeItem('verification_email')
        localStorage.removeItem('verification_timestamp')
      } catch (_error) {
        setVerificationState({
          status: 'error',
          message: 'An unexpected error occurred during email verification. Please try again.',
        })
      }
    }

    verifyEmail()
  }, [searchParams])

  if (verificationState.status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center py-12">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Verifying your email...</CardTitle>
              <CardDescription>Please wait while we verify your email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex justify-center py-6">
              <div
                className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"
                aria-label="Loading"
                role="status"
              />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {verificationState.status === 'success' ? 'Email Verified!' : 'Verification Failed'}
            </CardTitle>
            <CardDescription>
              {verificationState.status === 'success'
                ? 'Your email has been successfully verified. You can now login to your account.'
                : verificationState.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex justify-center">
            {verificationState.status === 'success' ? (
              <div className="space-y-4 w-full">
                <div className="flex justify-center">
                  <svg
                    className="h-16 w-16 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Success</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <Button asChild className="w-full">
                  <Link to="/login">Continue to Login</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <div className="flex justify-center">
                  <svg
                    className="h-16 w-16 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Error</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="../">Return to Home</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
