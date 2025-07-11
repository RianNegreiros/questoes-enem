'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { getQuestionById } from '@/app/services/enem-api'
import { getUserAnswers, type UserAnswer } from '@/app/services/user-answers'
import type { Question } from '@/app/types/question'
import { QuestionCard } from '@/components/question-card'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export default function QuestionPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<{ question: Question | null; userAnswer?: UserAnswer }>({ question: null })
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    async function loadQuestionAndAnswer() {
      try {
        setIsLoading(true)
        const [year, index] = (params.id as string).split('-')
        const questionData = await getQuestionById(year, index)
        let userAnswer: UserAnswer | undefined = undefined

        const userAnswers = await getUserAnswers()
        const questionId = `${questionData.year}-${questionData.index}`
        if (userAnswers[questionId]) {
          userAnswer = userAnswers[questionId]
        }

        setData({ question: questionData, userAnswer })
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }
    loadQuestionAndAnswer()
  }, [params.id, session])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando questão...</div>
      </div>
    )
  }

  if (!data.question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Questão não encontrada</h1>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        <QuestionCard
          question={data.question}
          initialUserAnswer={data.userAnswer}
          onAnswerUpdate={(answer) => setData((prev) => ({ ...prev, userAnswer: answer }))}
        />
      </div>
    </div>
  )
}
