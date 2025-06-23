import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Questões ENEM',
  description: 'Pratique questões do ENEM e acompanhe seu progresso',
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
