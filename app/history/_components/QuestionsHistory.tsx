'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Calendar, CheckCircle, Filter, TrendingUp, XCircle } from 'lucide-react'

import { getQuestionById } from '@/app/services/enem-api'
import { getUserAnswers } from '@/app/services/user-answers'
import type { Question } from '@/app/types/question'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authClient } from '@/lib/auth-client'

interface QuestionWithAnswer extends Question {
  userAnswer: number
  isCorrect: boolean
  answeredAt: string
}

export default function QuestionsHistory() {
  const [selectedStatus, setSelectedStatus] = useState('Todas')
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { data: session } = authClient.useSession()

  useEffect(() => {
    async function loadUserData() {
      if (!session) {
        router.push('/login')
        return
      }

      try {
        setIsLoading(true)

        const [userAnswers] = await Promise.all([getUserAnswers()])

        const answeredQuestionIds = Object.keys(userAnswers)

        if (answeredQuestionIds.length === 0) {
          setQuestionsWithAnswers([])
          return
        }

        const questionsData: QuestionWithAnswer[] = []

        for (const questionId of answeredQuestionIds) {
          const [year, index] = questionId.split('-')
          try {
            const question = await getQuestionById(year, index)
            questionsData.push({
              ...question,
              userAnswer: userAnswers[questionId],
              isCorrect: question.alternatives[userAnswers[questionId]]?.isCorrect || false,
            })
          } catch (error) {
            console.error(`Failed to load question ${questionId}:`, error)
          }
        }

        questionsData.sort((a, b) => new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime())

        setQuestionsWithAnswers(questionsData)
      } catch (error) {
        console.error('Failed to load user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [session, router])

  const filteredQuestions = questionsWithAnswers.filter((question) => {
    const matchesStatus =
      selectedStatus === 'Todas' ||
      (selectedStatus === 'Corretas' && question.isCorrect) ||
      (selectedStatus === 'Incorretas' && !question.isCorrect)

    return matchesStatus
  })

  const getAlternativeLetter = (index: number) => {
    return String.fromCharCode(65 + index)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando histórico...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Histórico de Questões ENEM</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso e desempenho nas questões respondidas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas</SelectItem>
                    <SelectItem value="Corretas">Corretas</SelectItem>
                    <SelectItem value="Incorretas">Incorretas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questões Respondidas ({filteredQuestions.length})</CardTitle>
            <CardDescription>Histórico detalhado das suas respostas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <div
                  key={`${question.year}-${question.index}`}
                  className={`border rounded-lg p-4 transition-colors ${question.isCorrect
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">{question.discipline}</Badge>
                        <Badge variant="outline">{question.year}</Badge>

                        {question.isCorrect ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-900">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correta
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-900">
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorreta
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-foreground font-medium">{question.title}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-foreground">
                          <strong>Sua resposta:</strong> {getAlternativeLetter(question.userAnswer)}
                        </span>
                        {!question.isCorrect && (
                          <span className="text-green-600 dark:text-green-400">
                            <strong>Resposta correta:</strong> {question.correctAlternative}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredQuestions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma questão encontrada com os filtros aplicados.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" onClick={() => router.push('/')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Continuar Praticando
          </Button>
        </div>
      </div>
    </div>
  )
}
