"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuestionCard } from "@/components/question-card"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { AnswerHistory } from "@/components/answer-history"
import { QuestionList } from "@/components/question-list"
import { BookOpen, BarChart3, History, Trophy, Filter, LogIn, UserPlus, Lock } from "lucide-react"
import { AuthDialog } from "@/components/auth-dialog"
import { UserMenu } from "@/components/user-menu"

// Dados mockados expandidos com mais questões do ENEM
const mockQuestions = [
  // Matemática
  {
    id: 1,
    subject: "Matemática",
    year: 2023,
    topic: "Geometria",
    question:
      "Uma empresa produz peças em formato cilíndrico. Se o raio da base é 3 cm e a altura é 8 cm, qual é o volume aproximado da peça?",
    options: ["72π cm³", "226π cm³", "144π cm³", "288π cm³", "96π cm³"],
    correctAnswer: 0,
  },
  {
    id: 2,
    subject: "Matemática",
    year: 2022,
    topic: "Álgebra",
    question: "Se x + 2y = 10 e x - y = 1, qual é o valor de x?",
    options: ["3", "4", "5", "6", "7"],
    correctAnswer: 1,
  },
  {
    id: 3,
    subject: "Matemática",
    year: 2021,
    topic: "Estatística",
    question:
      "Em uma pesquisa com 100 pessoas, 60 gostam de futebol, 40 gostam de basquete e 20 gostam de ambos. Quantas pessoas não gostam de nenhum dos dois esportes?",
    options: ["10", "15", "20", "25", "30"],
    correctAnswer: 2,
  },

  // Português
  {
    id: 4,
    subject: "Português",
    year: 2023,
    topic: "Figuras de Linguagem",
    question:
      "Analise o texto: 'O vento sussurrava segredos entre as folhas, enquanto a lua sorria timidamente no céu estrelado.' A figura de linguagem predominante é:",
    options: ["Metáfora", "Personificação", "Hipérbole", "Ironia", "Antítese"],
    correctAnswer: 1,
  },
  {
    id: 5,
    subject: "Português",
    year: 2022,
    topic: "Gramática",
    question: "Na frase 'Os meninos estudaram muito para a prova', a palavra 'muito' é classificada como:",
    options: ["Adjetivo", "Advérbio", "Substantivo", "Pronome", "Artigo"],
    correctAnswer: 1,
  },
  {
    id: 6,
    subject: "Português",
    year: 2021,
    topic: "Interpretação",
    question:
      "No texto 'A ironia do destino fez com que o bombeiro perdesse sua casa em um incêndio', o recurso estilístico empregado é:",
    options: ["Paradoxo", "Ironia", "Metáfora", "Metonímia", "Sinestesia"],
    correctAnswer: 1,
  },

  // História
  {
    id: 7,
    subject: "História",
    year: 2023,
    topic: "Brasil República",
    question:
      "A Era Vargas (1930-1945) foi marcada por diversas transformações. Uma das principais características foi:",
    options: [
      "Consolidação democrática",
      "Fortalecimento do legislativo",
      "Centralização do poder executivo",
      "Descentralização administrativa",
      "Fim do coronelismo",
    ],
    correctAnswer: 2,
  },
  {
    id: 8,
    subject: "História",
    year: 2022,
    topic: "Brasil Colônia",
    question: "O sistema de capitanias hereditárias no Brasil colonial tinha como objetivo principal:",
    options: [
      "Democratizar a terra",
      "Facilitar a colonização",
      "Acabar com a escravidão",
      "Promover a industrialização",
      "Criar universidades",
    ],
    correctAnswer: 1,
  },

  // Geografia
  {
    id: 9,
    subject: "Geografia",
    year: 2023,
    topic: "Climatologia",
    question: "O fenômeno El Niño é caracterizado por:",
    options: [
      "Resfriamento das águas do Pacífico",
      "Aquecimento das águas do Atlântico",
      "Aquecimento das águas do Pacífico",
      "Resfriamento das águas do Índico",
      "Mudanças no Ártico",
    ],
    correctAnswer: 2,
  },
  {
    id: 10,
    subject: "Geografia",
    year: 2021,
    topic: "Cartografia",
    question: "Em um mapa com escala 1:100.000, uma distância de 2 cm representa na realidade:",
    options: ["2 km", "20 km", "200 km", "2000 km", "20000 km"],
    correctAnswer: 0,
  },

  // Biologia
  {
    id: 11,
    subject: "Biologia",
    year: 2023,
    topic: "Genética",
    question: "Na primeira lei de Mendel, o cruzamento entre dois indivíduos heterozigotos (Aa x Aa) resulta em:",
    options: [
      "100% dominantes",
      "75% dominantes, 25% recessivos",
      "50% dominantes, 50% recessivos",
      "25% dominantes, 75% recessivos",
      "100% recessivos",
    ],
    correctAnswer: 1,
  },
  {
    id: 12,
    subject: "Biologia",
    year: 2022,
    topic: "Citologia",
    question: "A organela responsável pela respiração celular é:",
    options: ["Núcleo", "Mitocôndria", "Ribossomo", "Retículo endoplasmático", "Complexo de Golgi"],
    correctAnswer: 1,
  },

  // Química
  {
    id: 13,
    subject: "Química",
    year: 2023,
    topic: "Química Orgânica",
    question: "O composto CH₃-CH₂-OH é classificado como:",
    options: ["Éter", "Álcool", "Aldeído", "Cetona", "Ácido carboxílico"],
    correctAnswer: 1,
  },
  {
    id: 14,
    subject: "Química",
    year: 2021,
    topic: "Química Geral",
    question: "O número de prótons no átomo de carbono (C) é:",
    options: ["4", "6", "8", "12", "14"],
    correctAnswer: 1,
  },

  // Física
  {
    id: 15,
    subject: "Física",
    year: 2023,
    topic: "Mecânica",
    question: "Um objeto em movimento retilíneo uniforme possui:",
    options: [
      "Velocidade variável",
      "Aceleração constante",
      "Velocidade constante",
      "Aceleração variável",
      "Velocidade nula",
    ],
    correctAnswer: 2,
  },
  {
    id: 16,
    subject: "Física",
    year: 2022,
    topic: "Eletricidade",
    question: "A potência elétrica dissipada por um resistor de 10Ω percorrido por uma corrente de 2A é:",
    options: ["20W", "40W", "5W", "10W", "80W"],
    correctAnswer: 1,
  },

  // Sociologia
  {
    id: 17,
    subject: "Sociologia",
    year: 2023,
    topic: "Teorias Sociológicas",
    question: "Para Émile Durkheim, a solidariedade mecânica é característica de:",
    options: [
      "Sociedades industriais",
      "Sociedades tradicionais",
      "Sociedades pós-modernas",
      "Sociedades capitalistas",
      "Sociedades socialistas",
    ],
    correctAnswer: 1,
  },

  // Filosofia
  {
    id: 18,
    subject: "Filosofia",
    year: 2022,
    topic: "Filosofia Antiga",
    question: "Para Platão, o mundo das ideias é:",
    options: ["Ilusório", "Imperfeito", "Perfeito e imutável", "Temporário", "Material"],
    correctAnswer: 2,
  },

  // Inglês
  {
    id: 19,
    subject: "Inglês",
    year: 2023,
    topic: "Grammar",
    question: "Choose the correct sentence:",
    options: [
      "She don't like coffee",
      "She doesn't likes coffee",
      "She doesn't like coffee",
      "She not like coffee",
      "She no likes coffee",
    ],
    correctAnswer: 2,
  },

  // Espanhol
  {
    id: 20,
    subject: "Espanhol",
    year: 2021,
    topic: "Gramática",
    question: "La forma correcta del verbo 'ser' en primera persona del singular es:",
    options: ["eres", "es", "soy", "somos", "son"],
    correctAnswer: 2,
  },
]

export default function EnemPractice() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState<Record<number, boolean>>({})
  const [activeTab, setActiveTab] = useState("practice")
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  // Get unique years and set the most recent as default
  const years = Array.from(new Set(mockQuestions.map((q) => q.year))).sort((a, b) => b - a)
  const mostRecentYear = years[0]
  const [selectedYear, setSelectedYear] = useState<string>(mostRecentYear.toString())

  // Filter questions by year
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter((question) => question.year.toString() === selectedYear)
  }, [selectedYear])

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  )

  const subjects = Array.from(new Set(mockQuestions.map((q) => q.subject)))

  const handleLogin = (email: string, password: string) => {
    setUser({
      name: "João Silva",
      email: email,
      avatar: undefined,
    })
  }

  const handleSignup = (name: string, email: string, password: string) => {
    setUser({
      name: name,
      email: email,
      avatar: undefined,
    })
  }

  const handleSignOut = () => {
    setUser(null)
    setAnswers({})
    setShowResult({})
    setActiveTab("practice")
    setStats({
      totalQuestions: mockQuestions.length,
      answeredQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      streak: 0,
      subjects: subjects.reduce(
        (acc, subject) => {
          acc[subject] = { total: 0, correct: 0, accuracy: 0 }
          return acc
        },
        {} as Record<string, { total: number; correct: number; accuracy: number }>,
      ),
    })
  }

  // Estatísticas atualizadas
  const [stats, setStats] = useState({
    totalQuestions: mockQuestions.length,
    answeredQuestions: Object.keys(answers).length,
    correctAnswers: Object.entries(answers).filter(
      ([id, answer]) => mockQuestions.find((q) => q.id === Number.parseInt(id))?.correctAnswer === answer,
    ).length,
    accuracy:
      Object.keys(answers).length > 0
        ? Math.round(
          (Object.entries(answers).filter(
            ([id, answer]) => mockQuestions.find((q) => q.id === Number.parseInt(id))?.correctAnswer === answer,
          ).length /
            Object.keys(answers).length) *
          100,
        )
        : 0,
    streak: 5,
    subjects: subjects.reduce(
      (acc, subject) => {
        const subjectQuestions = mockQuestions.filter((q) => q.subject === subject)
        const subjectAnswers = subjectQuestions.filter((q) => answers[q.id] !== undefined)
        const correctSubjectAnswers = subjectAnswers.filter((q) => answers[q.id] === q.correctAnswer)

        acc[subject] = {
          total: subjectAnswers.length,
          correct: correctSubjectAnswers.length,
          accuracy:
            subjectAnswers.length > 0 ? Math.round((correctSubjectAnswers.length / subjectAnswers.length) * 100) : 0,
        }
        return acc
      },
      {} as Record<string, { total: number; correct: number; accuracy: number }>,
    ),
  })

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleCheckAnswer = (questionId: number) => {
    setShowResult((prev) => ({ ...prev, [questionId]: true }))

    // Update statistics
    const isCorrect = answers[questionId] === mockQuestions.find((q) => q.id === questionId)?.correctAnswer
    setStats((prev) => ({
      ...prev,
      answeredQuestions: Object.keys(answers).length,
      correctAnswers: Object.entries(answers).filter(
        ([id, answer]) => mockQuestions.find((q) => q.id === Number.parseInt(id))?.correctAnswer === answer,
      ).length,
      accuracy:
        Object.keys(answers).length > 0
          ? Math.round(
            (Object.entries(answers).filter(
              ([id, answer]) => mockQuestions.find((q) => q.id === Number.parseInt(id))?.correctAnswer === answer,
            ).length /
              Object.keys(answers).length) *
            100,
          )
          : 0,
      streak: isCorrect ? prev.streak + 1 : 0,
    }))
  }

  const resetFilters = () => {
    setSelectedYear(mostRecentYear.toString())
    setCurrentPage(1)
  }

  // Componente para abas restritas
  const RestrictedTabContent = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-4">Faça login para acessar seu progresso e histórico de respostas.</p>
            <Button onClick={() => setShowAuthDialog(true)}>
              <LogIn className="h-4 w-4 mr-2" />
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      )
    }
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">ENEM Practice</h1>
            <p className="text-gray-600">Pratique questões do ENEM e acompanhe seu progresso</p>
            <div className="mt-4 text-sm text-gray-500">
              {mockQuestions.length} questões disponíveis • {filteredQuestions.length} questões filtradas
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Olá, {user.name.split(" ")[0]}!</span>
                <UserMenu user={user} onSignOut={handleSignOut} />
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAuthDialog(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
                <Button onClick={() => setShowAuthDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview - Apenas para usuários logados */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.answeredQuestions}</div>
                <div className="text-sm text-gray-600">Questões Respondidas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.accuracy}%</div>
                <div className="text-sm text-gray-600">Taxa de Acerto</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.streak}</div>
                <div className="text-sm text-gray-600">Sequência Atual</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <History className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.correctAnswers}</div>
                <div className="text-sm text-gray-600">Acertos Totais</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="practice">Praticar</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="space-y-6">
            {/* Year Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

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
          </TabsContent>

          <TabsContent value="progress">
            <RestrictedTabContent>
              <ProgressDashboard stats={stats} />
            </RestrictedTabContent>
          </TabsContent>

          <TabsContent value="history">
            <RestrictedTabContent>
              <AnswerHistory answers={answers} questions={mockQuestions} />
            </RestrictedTabContent>
          </TabsContent>
        </Tabs>
        <AuthDialog
          isOpen={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      </div>
    </div>
  )
}
