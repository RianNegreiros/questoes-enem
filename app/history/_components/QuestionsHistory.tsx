'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, CheckCircle, Filter, TrendingUp, XCircle } from 'lucide-react'
import useSWRImmutable from 'swr/immutable'

import { getQuestionById } from '@/app/services/enem-api'
import { getUserAnswers, type UserAnswer } from '@/app/services/user-answers'
import type { Question } from '@/app/types/question'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

interface QuestionWithAnswer extends Question {
  userAnswer: UserAnswer
}

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function QuestionsHistory() {
  const [selectedStatus, setSelectedStatus] = useState('Todas')
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const getAlternativeLetter = useCallback((index: number) => {
    return String.fromCharCode(65 + index)
  }, [])

  const debouncedStatus = useDebounce(selectedStatus, 300)
  const debouncedDiscipline = useDebounce(selectedDiscipline, 300)

  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({})
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([])

  useEffect(() => {
    async function loadUserAnswers() {
      if (!session) {
        router.push('/login')
        return
      }
      setIsLoading(true)
      try {
        const answers = await getUserAnswers()
        setUserAnswers(answers)
        setAnsweredQuestionIds(Object.keys(answers))
      } catch (error) {
        console.error(error)
        setUserAnswers({})
        setAnsweredQuestionIds([])
      } finally {
        setIsLoading(false)
      }
    }
    loadUserAnswers()
  }, [session, router])

  const { data: questionsData, isLoading: isQuestionsLoading } = useSWRImmutable(
    answeredQuestionIds.length > 0 ? ['questions-history', ...answeredQuestionIds] : null,
    async () => {
      const results = await Promise.all(
        answeredQuestionIds.map(async (questionId) => {
          const [year, index] = questionId.split('-')
          try {
            const question = await getQuestionById(year, index)
            return {
              ...question,
              userAnswer: userAnswers[questionId],
            }
          } catch {
            return null
          }
        })
      )
      return results
        .filter((q): q is QuestionWithAnswer => !!q)
        .sort((a, b) => new Date(b.userAnswer.answeredAt).getTime() - new Date(a.userAnswer.answeredAt).getTime())
    },
    { revalidateOnFocus: false }
  )

  useEffect(() => {
    if (questionsData) {
      setQuestionsWithAnswers(questionsData)
    }
  }, [questionsData])

  const allDisciplines = Array.from(new Map(questionsWithAnswers.map((q) => [q.discipline, q])).values()).map((q) => ({
    value: q.discipline,
    label: q.discipline,
  }))

  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10

  const filteredQuestions = questionsWithAnswers.filter((question) => {
    const matchesStatus =
      debouncedStatus === 'Todas' ||
      (debouncedStatus === 'Corretas' && question.userAnswer.isCorrect) ||
      (debouncedStatus === 'Incorretas' && !question.userAnswer.isCorrect)
    const matchesDiscipline = debouncedDiscipline === 'all' || question.discipline === debouncedDiscipline
    return matchesStatus && matchesDiscipline
  })

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  )

  if (isLoading || isQuestionsLoading || !questionsData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 py-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Disciplina</label>
                <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as disciplinas</SelectItem>
                    {allDisciplines.map((discipline) => (
                      <SelectItem key={discipline.value} value={discipline.value}>
                        {discipline.label}
                      </SelectItem>
                    ))}
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
              {paginatedQuestions.map((question) => (
                <Link
                  href={`/question/${question.year}-${question.index}`}
                  key={`${question.year}-${question.index}`}
                  className={cn(
                    'block rounded-lg border p-4 transition-colors',
                    question.userAnswer.isCorrect
                      ? 'border-green-200 bg-green-50 hover:bg-green-100/50 dark:border-green-800 dark:bg-green-950/20 dark:hover:bg-green-900/50'
                      : 'border-red-200 bg-red-50 hover:bg-red-100/50 dark:border-red-800 dark:bg-red-950/20 dark:hover:bg-red-900/50'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{question.discipline}</Badge>
                        <Badge variant="outline">{question.year}</Badge>

                        {question.userAnswer.isCorrect ? (
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

                      <p className="font-medium text-foreground">{question.title}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-foreground">
                          <strong>Sua resposta:</strong> {getAlternativeLetter(question.userAnswer.answerIndex)}
                        </span>
                        {!question.userAnswer.isCorrect && (
                          <span className="text-green-600 dark:text-green-400">
                            <strong>Resposta correta:</strong> {question.correctAlternative}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {paginatedQuestions.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma questão encontrada com os filtros aplicados.</p>
                </div>
              )}
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        aria-disabled={currentPage === 1}
                        tabIndex={currentPage === 1 ? -1 : 0}
                        style={{
                          pointerEvents: currentPage === 1 ? 'none' : undefined,
                          opacity: currentPage === 1 ? 0.5 : 1,
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const page = idx + 1
                      if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                              aria-current={page === currentPage ? 'page' : undefined}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }
                      if ((page === currentPage - 2 && page > 1) || (page === currentPage + 2 && page < totalPages)) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }
                      return null
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        aria-disabled={currentPage === totalPages}
                        tabIndex={currentPage === totalPages ? -1 : 0}
                        style={{
                          pointerEvents: currentPage === totalPages ? 'none' : undefined,
                          opacity: currentPage === totalPages ? 0.5 : 1,
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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
