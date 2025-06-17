"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuestionList } from "@/components/question-list"
import { BookOpen, BarChart3, History, Trophy, Filter, LogIn } from "lucide-react"
import { getExams, getQuestions } from "@/app/services/enem-api"
import { Question } from "@/app/types/question"

export default function EnemPractice() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("practice")
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10
  const [questions, setQuestions] = useState<Question[]>([])
  const [years, setYears] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadExams() {
      try {
        const exams = await getExams()
        const availableYears = exams.map((exam: any) => exam.year.toString()).sort((a: string, b: string) => Number(b) - Number(a))
        setYears(availableYears)
        if (availableYears.length > 0) {
          setSelectedYear(availableYears[0])
        }
      } catch (error) {
        console.error("Failed to load exams:", error)
      }
    }
    loadExams()
  }, [])

  useEffect(() => {
    async function loadQuestions() {
      if (!selectedYear) return

      setIsLoading(true)
      try {
        const data = await getQuestions(selectedYear)
        setQuestions(data.questions)
      } catch (error) {
        console.error("Failed to load questions:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadQuestions()
  }, [selectedYear])

  // Pagination
  const totalPages = Math.ceil(questions.length / questionsPerPage)
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  )

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
          <Button>
            <LogIn className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="practice">
              <BookOpen className="h-4 w-4 mr-2" />
              Praticar
            </TabsTrigger>
            <TabsTrigger value="progress">
              <BarChart3 className="h-4 w-4 mr-2" />
              Progresso
            </TabsTrigger>
            <TabsTrigger value="ranking">
              <Trophy className="h-4 w-4 mr-2" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice">
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
                  questions={paginatedQuestions}
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
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Restrito</h3>
                <p className="text-gray-600 mb-4">Faça login para acessar seu progresso e histórico de respostas.</p>
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking">
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ranking em Desenvolvimento</h3>
                <p className="text-gray-600">
                  Em breve você poderá ver o ranking dos melhores estudantes!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Restrito</h3>
                <p className="text-gray-600 mb-4">Faça login para acessar seu progresso e histórico de respostas.</p>
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
