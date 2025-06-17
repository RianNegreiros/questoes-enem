"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"

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

export default function QuestionPage() {
  const params = useParams()
  const router = useRouter()
  const [question, setQuestion] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined)
  const [showResult, setShowResult] = useState(false)
  const [pageUrl, setPageUrl] = useState("")

  useEffect(() => {
    // Encontrar a questão pelo ID
    const questionId = Number(params.id)
    const foundQuestion = mockQuestions.find((q) => q.id === questionId)

    if (foundQuestion) {
      setQuestion(foundQuestion)
    } else {
      // Redirecionar para a página principal se a questão não for encontrada
      router.push("/")
    }

    // Definir a URL da página para compartilhamento
    setPageUrl(window.location.href)
  }, [params.id, router])

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleCheckAnswer = () => {
    setShowResult(true)
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Carregando questão...</h3>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToHome}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para lista
          </Button>
          <ShareButton url={pageUrl} title={`Questão ${question.id} - ENEM ${question.year} - ${question.subject}`} />
        </div>

        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-2">Questão {question.id}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{question.subject}</Badge>
                  <Badge variant="outline">ENEM {question.year}</Badge>
                  <Badge variant="outline">{question.topic}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-lg leading-relaxed">{question.question}</div>

            <div className="space-y-3">
              {question.options.map((option: string, index: number) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === question.correctAnswer
                const showResultStyle = showResult
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : isSelected && !isCorrect
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  : isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(question.id, index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${showResultStyle} ${!showResult ? "cursor-pointer" : "cursor-default"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700">{String.fromCharCode(65 + index)})</span>
                        <span>{option}</span>
                      </div>
                      {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Check Answer Button */}
            {selectedAnswer !== undefined && !showResult && (
              <div className="flex justify-center">
                <Button onClick={handleCheckAnswer} className="px-8">
                  Verificar Resposta
                </Button>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="mt-3 flex items-center gap-2 justify-center">
                {selectedAnswer === question.correctAnswer ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-medium">Resposta correta!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-700 font-medium">
                      Resposta incorreta. A resposta correta é a alternativa{" "}
                      {String.fromCharCode(65 + question.correctAnswer)}.
                    </span>
                  </>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t p-4">
            {question.id > 1 && (
              <Button variant="outline" onClick={() => router.push(`/questao/${question.id - 1}`)}>
                Questão Anterior
              </Button>
            )}
            {question.id < mockQuestions.length && (
              <Button onClick={() => router.push(`/questao/${question.id + 1}`)}>Próxima Questão</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
