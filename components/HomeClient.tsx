'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, LogOut } from 'lucide-react'
import { toast } from 'sonner'

import { getExams, getQuestions } from '@/app/services/enem-api'
import type { Exam } from '@/app/types/exam'
import type { Question } from '@/app/types/question'
import { QuestionList } from '@/components/question-list'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authClient } from '@/lib/auth-client'

export default function HomeClient() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState<Record<string, boolean>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10
  const [questions, setQuestions] = useState<Question[]>([])
  const [years, setYears] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
          toast.success('Saiu da conta com successo')
        },
      },
    })
  }

  useEffect(() => {
    async function loadExams() {
      try {
        const exams = await getExams()
        const availableYears = exams
          .map((exam: Exam) => exam.year.toString())
          .sort((a: string, b: string) => Number(b) - Number(a))
        setYears(availableYears)
        if (availableYears.length > 0) {
          setSelectedYear(availableYears[0])
        }
      } catch (error) {
        console.error('Failed to load exams:', error)
      }
    }
    loadExams()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedYear])

  useEffect(() => {
    async function loadQuestions() {
      if (!selectedYear) return

      setIsLoading(true)
      try {
        const offset = (currentPage - 1) * questionsPerPage
        const data = await getQuestions(selectedYear, questionsPerPage, offset)
        setQuestions(data.questions)
        setTotalQuestions(data.metadata?.total || 0)
      } catch (error) {
        console.error('Failed to load questions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadQuestions()
  }, [selectedYear, currentPage])

  const totalPages = Math.ceil(totalQuestions / questionsPerPage)

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleCheckAnswer = (questionId: string) => {
    setShowResult((prev) => ({ ...prev, [questionId]: true }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Questões ENEM</h1>
          {session ? (
            <div>
              <p>{session.user.name}</p>
              <Button onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          ) : (
            <Button onClick={() => router.push('/login')}>
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Carregando questões...</div>
          ) : (
            <QuestionList
              questions={questions}
              answers={answers}
              showResults={showResult}
              onAnswer={handleAnswer}
              onCheckAnswer={handleCheckAnswer}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  )
}
