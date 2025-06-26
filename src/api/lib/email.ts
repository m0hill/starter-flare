import type { CreateEmailOptions, CreateEmailResponseSuccess } from 'resend'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (
  params: CreateEmailOptions
): Promise<CreateEmailResponseSuccess> => {
  const { data, error } = await resend.emails.send(params)

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('No data returned from Resend API')
  }

  return data
}
