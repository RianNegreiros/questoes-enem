import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { VerifyOTPForm } from './_components/VeirifyOTPForm'

export default async function EmailOTPVerify() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return redirect('/')
  }
  return <VerifyOTPForm />
}
