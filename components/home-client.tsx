'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { History, LogIn, LogOut, Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { useExamByYear, useExams, useQuestions } from '@/app/services/enem-api'
import { clearLocalAnswers } from '@/app/services/local-answers'
import { getUserAnswers, type UserAnswer } from '@/app/services/user-answers'
import type { Discipline, Exam } from '@/app/types/exam'
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
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'
import PrivacyBanner from './privacy-banner'

const QUESTIONS_PER_PAGE = 10

export default function HomeClient() {
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [questions, setQuestions] = useState<Question[]>([])
  const [years, setYears] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const { theme, setTheme } = useTheme()
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')

  const { data: examsData } = useExams()
  const { data: examData } = useExamByYear(selectedYear)
  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestions(
    selectedYear,
    QUESTIONS_PER_PAGE,
    currentPage ? (currentPage - 1) * QUESTIONS_PER_PAGE : 0,
    selectedDiscipline || undefined,
    selectedLanguage !== 'all' ? selectedLanguage : undefined
  )

  useEffect(() => {
    async function loadUserAnswers() {
      try {
        const answers = await getUserAnswers()
        setUserAnswers(answers)
      } catch (error) {
        setError('Falha ao carregar respostas salvas.')
        console.error('Failed to load saved answers:', error)
      }
    }
    loadUserAnswers()
  }, [session])

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setUserAnswers({})
          clearLocalAnswers()
          router.refresh()
          toast.success('Saiu da conta com sucesso')
        },
      },
    })
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    if (examsData) {
      const availableYears = examsData
        .map((exam: Exam) => exam.year.toString())
        .sort((a: string, b: string) => Number(b) - Number(a))
      setYears(availableYears)
      if (availableYears.length > 0 && !selectedYear) {
        setSelectedYear(availableYears[0])
      }
    }
  }, [examsData, selectedYear])

  useEffect(() => {
    if (examData) {
      setDisciplines(examData.disciplines)
      setSelectedDiscipline('')
    }
  }, [examData, selectedYear])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedYear, selectedDiscipline, selectedLanguage])

  useEffect(() => {
    if (questionsError) {
      setError('Erro ao carregar as questões. Tente novamente.')
    } else {
      setError(null)
    }
    if (questionsData) {
      setQuestions(questionsData.questions)
      setTotalQuestions(questionsData.metadata?.total || 0)
      const totalPages = Math.max(1, Math.ceil((questionsData.metadata?.total || 0) / QUESTIONS_PER_PAGE))
      if (questionsData.questions.length === 0 && totalQuestions > 0 && currentPage > totalPages) {
        setCurrentPage(totalPages)
      }
    }
  }, [questionsData, questionsError, currentPage, totalQuestions])

  useEffect(() => {
    const isLinguagens = selectedDiscipline === 'linguagens'
    if (selectedDiscipline && selectedDiscipline !== 'all' && !isLinguagens && selectedLanguage !== 'all') {
      setSelectedLanguage('all')
    }
  }, [selectedDiscipline, disciplines, selectedLanguage])

  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE)

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
            {disciplines.length > 0 && (
              <Select
                value={selectedDiscipline || 'all'}
                onValueChange={(value) => setSelectedDiscipline(value === 'all' ? '' : value)}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as disciplinas</SelectItem>
                  {disciplines.map((discipline) => (
                    <SelectItem key={discipline.value} value={discipline.value}>
                      {discipline.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {(selectedDiscipline === '' || selectedDiscipline === 'all' || selectedDiscipline === 'linguagens') && (
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os idiomas</SelectItem>
                  <SelectItem value="ingles">Inglês</SelectItem>
                  <SelectItem value="espanhol">Espanhol</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {error && <div className="text-red-500 text-center py-2">{error}</div>}

          {isQuestionsLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 py-8">
              {Array.from({ length: QUESTIONS_PER_PAGE }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : (
            <QuestionList
              key={`${selectedYear}-${selectedDiscipline}-${selectedLanguage}`}
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
      <PrivacyBanner />
    </div>
  )
}
