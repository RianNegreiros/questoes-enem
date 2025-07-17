'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, CheckCircle, Filter, TrendingUp, XCircle } from 'lucide-react'
import useSWRImmutable from 'swr/immutable'

import { getQuestionsByIndices, useExamByYear, useExams } from '@/app/services/enem-api'
import { getUserAnswers, type UserAnswer } from '@/app/services/user-answers'
import type { Discipline, Exam } from '@/app/types/exam'
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
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function useUserAnswers() {
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({})
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    async function loadUserAnswers() {
      if (isPending) return

      if (!session) return

      setIsLoading(true)
      try {
        const answers = await getUserAnswers()
        setUserAnswers(answers)
        setAnsweredQuestionIds(Object.keys(answers))
      } catch {
        setUserAnswers({})
        setAnsweredQuestionIds([])
      } finally {
        setIsLoading(false)
      }
    }
    loadUserAnswers()
  }, [session, isPending])

  return { userAnswers, answeredQuestionIds, isLoading, isPending, session }
}

function useQuestionsData(answeredQuestionIds: string[], userAnswers: Record<string, UserAnswer>) {
  return useSWRImmutable(
    answeredQuestionIds.length > 0 ? ['questions-history', ...answeredQuestionIds] : null,
    async () => {
      if (answeredQuestionIds.length === 0) {
        return []
      }

      const yearToIndices = answeredQuestionIds.reduce(
        (acc, questionId) => {
          const [year, index] = questionId.split('-')
          if (!acc[year]) acc[year] = []
          acc[year].push(Number(index))
          return acc
        },
        {} as Record<string, number[]>
      )

      const allQuestions: QuestionWithAnswer[] = []

      for (const [year, indices] of Object.entries(yearToIndices)) {
        try {
          const data = await getQuestionsByIndices(year, indices)
          if (data?.questions) {
            allQuestions.push(
              ...data.questions.map((question: Question) => ({
                ...question,
                userAnswer: userAnswers[`${question.year}-${question.index}`],
              }))
            )
          }
        } catch {}
      }

      return allQuestions
        .filter(Boolean)
        .sort((a, b) => new Date(b.userAnswer.answeredAt).getTime() - new Date(a.userAnswer.answeredAt).getTime())
    },
    { revalidateOnFocus: false }
  )
}

function useDisciplines(): Discipline[] {
  const { data: examsData } = useExams()

  return examsData
    ? Array.from(
        examsData
          .flatMap((exam: Exam) => exam.disciplines)
          .reduce(
            (map: Map<string, Discipline>, discipline: Discipline) => map.set(discipline.value, discipline),
            new Map<string, Discipline>()
          )
          .values()
      )
    : []
}

function useFilteredQuestions(
  questions: QuestionWithAnswer[],
  status: string,
  discipline: string,
  currentPage: number,
  questionsPerPage: number
) {
  const debouncedStatus = useDebounce(status, 300)
  const debouncedDiscipline = useDebounce(discipline, 300)

  const filteredQuestions = questions.filter((question) => {
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

  return { filteredQuestions, paginatedQuestions, totalPages }
}

const getAlternativeLetter = (index: number) => String.fromCharCode(65 + index)

function LoadingSkeleton() {
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

function FiltersSection({
  selectedStatus,
  setSelectedStatus,
  selectedDiscipline,
  setSelectedDiscipline,
  allDisciplines,
}: {
  selectedStatus: string
  setSelectedStatus: (value: string) => void
  selectedDiscipline: string
  setSelectedDiscipline: (value: string) => void
  allDisciplines: Discipline[]
}) {
  return (
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
  )
}

function QuestionCard({ question }: { question: QuestionWithAnswer }) {
  return (
    <Link
      href={`/question/${question.year}-${question.index}`}
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
  )
}

function PaginationSection({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
  )
}

export default function QuestionsHistory() {
  const [selectedStatus, setSelectedStatus] = useState('Todas')
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const { userAnswers, answeredQuestionIds, isLoading, isPending } = useUserAnswers()
  const { data: questionsData, isLoading: isQuestionsLoading } = useQuestionsData(answeredQuestionIds, userAnswers)
  const allDisciplines = useDisciplines()
  const { filteredQuestions, paginatedQuestions, totalPages } = useFilteredQuestions(
    questionsData || [],
    selectedStatus,
    selectedDiscipline,
    currentPage,
    10
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus, selectedDiscipline])

  if (isLoading || isQuestionsLoading || isPending) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Histórico de Questões ENEM</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso e desempenho nas questões respondidas</p>
        </div>

        <FiltersSection
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDiscipline={selectedDiscipline}
          setSelectedDiscipline={setSelectedDiscipline}
          allDisciplines={allDisciplines}
        />

        <Card>
          <CardHeader>
            <CardTitle>Questões Respondidas ({filteredQuestions.length})</CardTitle>
            <CardDescription>Histórico detalhado das suas respostas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedQuestions.map((question) => (
                <QuestionCard key={`${question.year}-${question.index}`} question={question} />
              ))}

              {paginatedQuestions.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {answeredQuestionIds.length === 0
                      ? 'Você ainda não respondeu nenhuma questão. Comece a praticar para ver seu histórico aqui!'
                      : 'Nenhuma questão encontrada com os filtros aplicados.'}
                  </p>
                </div>
              )}
            </div>

            <PaginationSection currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
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
