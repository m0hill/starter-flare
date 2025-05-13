import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Spinner } from '@/app/components/ui/spinner'
import { authClient } from '@/app/lib/auth'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

export default function VerifyEmail() {
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const verificationEmail = localStorage.getItem('verification_email')
    const verificationTimestamp = localStorage.getItem('verification_timestamp')

    if (!verificationEmail || !verificationTimestamp) {
      navigate('/login')
      return
    }

    const timestamp = Number.parseInt(verificationTimestamp, 10)
    const now = Date.now()
    const thirtyMinutes = 30 * 60 * 1000

    if (now - timestamp > thirtyMinutes) {
      localStorage.removeItem('verification_email')
      localStorage.removeItem('verification_timestamp')
      navigate('/login')
      return
    }

    setEmail(verificationEmail)
  }, [navigate])

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timerId)
    }
  }, [timeLeft])

  useEffect(() => {
    return () => {
      if (success) {
        localStorage.removeItem('verification_email')
        localStorage.removeItem('verification_timestamp')
      }
    }
  }, [success])

  const handleResendEmail = async () => {
    if (timeLeft > 0) {
      return
    }

    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      await authClient.sendVerificationEmail({
        email,
      })

      localStorage.setItem('verification_timestamp', Date.now().toString())

      setSuccess('Verification email has been resent successfully!')
      setTimeLeft(60)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred while sending the verification email')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          A verification email has been sent to {email}. Please check your inbox and verify your
          email to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-md">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-100 text-green-800 rounded-md">
            <p>{success}</p>
          </div>
        )}
        <div className="text-center">
          <p className="mb-4">Didn't receive the email?</p>
          <Button
            onClick={handleResendEmail}
            disabled={timeLeft > 0 || isLoading}
            className="w-full"
          >
            {timeLeft > 0 ? `Resend Email (${timeLeft}s)` : 'Resend Verification Email'}
            {isLoading && <Spinner variant="white" size="sm" className="ml-2" />}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          <Link to="../login" className="text-primary hover:underline">
            Return to Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
