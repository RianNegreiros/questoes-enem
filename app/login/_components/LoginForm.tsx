'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Chrome, Loader, Send } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

export function LoginForm() {
  const [googlePending, startGoogleTransation] = useTransition()
  const [emailPending, startEmailTransation] = useTransition()
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleEmailAuth = async () => {
    startEmailTransation(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: 'sign-in',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Email enviado')
            router.push(`/verify-request?email=${email}`)
          },
          onError: (error) => {
            toast.error(error.error.message)
          },
        },
      })
    })
  }

  const handleGoogleAuth = async () => {
    startGoogleTransation(async () => {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Autenticado com successo usando uma conta Google, você será redirecionado')
          },
          onError: (error) => {
            toast.error(error.error.message)
          },
        },
      })
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-md relative">
        <Button variant="ghost" className="absolute left-4 top-4 flex items-center" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para a página principal
        </Button>
        <h1 className="text-2xl font-bold mb-2 text-center mt-8">Acesse sua conta</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Entre ou crie uma conta para acessar todas as funcionalidades
        </p>
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={googlePending}
          >
            {googlePending ? (
              <>
                <Loader className="size-4 animate-spin">
                  <span>Carregando...</span>
                </Loader>
              </>
            ) : (
              <>
                <Chrome className="h-4 w-4 mr-2" />
                Continuar com Google
              </>
            )}
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card p-2 text-muted-foreground">Ou continue com email</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button onClick={handleEmailAuth} className="w-full mt-2" disabled={emailPending}>
          {emailPending ? (
            <>
              <Loader className="size-4 animate-spin">
                <span>Carregando...</span>
              </Loader>
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Continuar com Email
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
