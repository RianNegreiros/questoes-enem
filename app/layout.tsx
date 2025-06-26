import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Questões ENEM',
  description:
    'Pratique questões do ENEM gratuitamente, acompanhe seu progresso e prepare-se para o exame nacional. Plataforma 100% grátis, sem pegadinhas ou cobranças.',
  keywords: [
    'ENEM',
    'questões ENEM',
    'plataforma gratuita',
    'estudo ENEM',
    'provas ENEM',
    'educação',
    'vestibular',
    'preparação ENEM',
    'histórico de respostas',
    'ENEM grátis',
    'questões grátis',
  ],
  openGraph: {
    title: 'Questões ENEM',
    description:
      'Pratique questões do ENEM gratuitamente, acompanhe seu progresso e prepare-se para o exame nacional. Plataforma 100% grátis, sem pegadinhas ou cobranças.',
    url: process.env.BETTER_AUTH_URL,
    siteName: 'Questões ENEM',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
