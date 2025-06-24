'use client'

import type React from 'react'
import { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

export function VerifyOTPForm() {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [emailPending, startEmailTransation] = useTransition()
  const params = useSearchParams()
  const email = params.get('email') as string
  const isOTPCompleted = otp.length === 6

  useEffect(() => {
    if (email === null) {
      router.push('/')
    }
  }, [email, router])

  const verifyOTP = async () => {
    startEmailTransation(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Email verificado com sucesso')
            router.push('/')
          },
          onError: () => {
            toast.error('Erro verificando seu Email ou código')
          },
        },
      })
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-info" />
          </div>
          <CardTitle className="text-2xl">Verifique seu e-mail</CardTitle>
          <CardDescription>
            Enviamos um código de verificação de 6 dígitos para o seu endereço de e-mail. Digite-o abaixo para verificar
            sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-2">
            <Label htmlFor="otp">Código de verificação</Label>
            <InputOTP value={otp} maxLength={6} className="gap-2" onChange={(e) => setOtp(e)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground text-center p-2">
              Digite o código de 6 dígitos enviado para o seu e-mail
            </p>
          </div>

          <Button onClick={verifyOTP} disabled={emailPending || !isOTPCompleted} className="w-full">
            {emailPending ? (
              <>
                <Loader className="size-4 animate-spin">
                  <span>Carregando...</span>
                </Loader>
              </>
            ) : (
              'Verificar Email'
            )}
          </Button>

          <div className="mt-6 text-center">
            <Button variant="ghost" className="text-sm" onClick={() => router.push('/login')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
