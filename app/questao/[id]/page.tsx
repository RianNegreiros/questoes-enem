"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { getQuestionById } from "@/app/services/enem-api"
import { Question } from "@/app/types/question"

export default function QuestionPage() {
  const params = useParams()
  const router = useRouter()
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>()
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadQuestion() {
      try {
        const [year, index] = (params.id as string).split("-")
        const data = await getQuestionById(year, index)
        setQuestion(data)
      } catch (error) {
        console.error("Failed to load question:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadQuestion()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando questão...</div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Questão não encontrada</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{question.discipline}</Badge>
              <Badge variant="outline">{question.year}</Badge>
            </div>
            <ShareButton url={`/questao/${question.id}`} title={question.title} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg font-medium">{question.title}</p>
              {question.context && <p className="text-gray-600">{question.context}</p>}
              {question.files?.map((file: string, index: number) => (
                <img key={index} src={file} alt={`Imagem ${index + 1}`} className="max-w-full rounded-lg" />
              ))}
              <p className="text-sm text-gray-500">{question.alternativesIntroduction}</p>
              <div className="space-y-2">
                {question.alternatives.map((alternative: { letter: string; text: string; isCorrect: boolean }, index: number) => (
                  <button
                    key={`${question.id}-alternative-${alternative.letter}`}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                    className={`w-full flex items-center gap-2 p-3 rounded-lg border transition-colors ${selectedAnswer === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                      }`}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300">
                      {alternative.letter}
                    </div>
                    <span className="flex-1 text-left">{alternative.text}</span>
                    {showResult && (
                      <>
                        {alternative.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : null}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowResult(true)}
              disabled={selectedAnswer === undefined || showResult}
            >
              Verificar Resposta
            </Button>
            {showResult && (
              <div className="flex items-center gap-2">
                {question.alternatives[selectedAnswer!]?.isCorrect ? (
                  <span className="text-green-600">Resposta correta!</span>
                ) : (
                  <span className="text-red-600">Resposta incorreta</span>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
