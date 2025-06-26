import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const [year, index] = id.split('-')
  return {
    title: `Questão ${index} do ENEM ${year}`,
    description: `Resolva gratuitamente a questão ${index} do ENEM ${year} e acompanhe seu progresso na plataforma Questões ENEM.`,
    icons: [{ rel: 'icon', url: '/logo.png' }],
    openGraph: {
      title: `Questão ${index} do ENEM ${year}`,
      description: `Resolva gratuitamente a questão ${index} do ENEM ${year} e acompanhe seu progresso na plataforma Questões ENEM.`,
      url: `${process.env.BETTER_AUTH_URL}/question/${id}`,
      siteName: 'Questões ENEM',
      locale: 'pt_BR',
      type: 'website',
    },
  }
}

export default function QuestionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
