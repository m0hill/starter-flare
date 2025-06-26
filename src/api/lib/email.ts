import { RESEND_API_URL } from '@/api/constants/services'
import type { EmailResponse, ResendError, SendEmailParams } from '@/api/types/email'

export const sendEmail = async (params: SendEmailParams): Promise<EmailResponse> => {
  const response = await fetch(`${RESEND_API_URL}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  const data = (await response.json()) as EmailResponse | ResendError

  if (!response.ok) {
    throw data as ResendError
  }

  return data as EmailResponse
}
