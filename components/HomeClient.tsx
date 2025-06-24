'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { History, LogIn, LogOut, Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { getExams, getQuestions } from '@/app/services/enem-api'
import { getUserAnswers, type UserAnswer } from '@/app/services/user-answers'
import type { Exam } from '@/app/types/exam'
import type { Question } from '@/app/types/question'
import { QuestionList } from '@/components/question-list'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authClient } from '@/lib/auth-client'

export default function HomeClient() {
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10
  const [questions, setQuestions] = useState<Question[]>([])
  const [years, setYears] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    async function loadUserAnswers() {
      if (session) {
        try {
          const answers = await getUserAnswers()
          setUserAnswers(answers)
        } catch (error) {
          console.error('Failed to load saved answers:', error)
        }
      }
    }
    loadUserAnswers()
  }, [session])

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
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

  const handleAnswerUpdate = (questionId: string, answer: UserAnswer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Questões ENEM</h1>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={session.user.image || '/placeholder-user.jpg?height=36&width=36'}
                        alt={session.user.name || 'User avatar'}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {session.user.name ? getUserInitials(session.user.name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && <p className="font-medium">{session.user.name}</p>}
                      {session.user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/history')} className="cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    <span>Histórico</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push('/login')}>
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
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
              userAnswers={userAnswers}
              onAnswerUpdate={handleAnswerUpdate}
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
