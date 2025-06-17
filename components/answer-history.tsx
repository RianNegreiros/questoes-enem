"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: number
  subject: string
  year: number
  topic: string
  question: string
  options: string[]
  correctAnswer: number
}

interface AnswerHistoryProps {
  answers: Record<number, number>
  questions: Question[]
}

export function AnswerHistory({ answers, questions }: AnswerHistoryProps) {
  const answeredQuestions = questions.filter((q) => answers[q.id] !== undefined)

  if (answeredQuestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma questão respondida ainda</h3>
          <p className="text-gray-600">Comece a praticar para ver seu histórico de respostas aqui.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Respostas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-4">{answeredQuestions.length} questão(ões) respondida(s)</div>
        </CardContent>
      </Card>

      {answeredQuestions.map((question) => {
        const userAnswer = answers[question.id]
        const isCorrect = userAnswer === question.correctAnswer

        return (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Questão {question.id}</span>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">ENEM {question.year}</Badge>
                    <Badge variant={isCorrect ? "default" : "destructive"}>{isCorrect ? "Correto" : "Incorreto"}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-gray-900">{question.question}</div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Sua resposta:</div>
                <div
                  className={`p-3 rounded-lg border-2 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + userAnswer)})</span>
                  {question.options[userAnswer]}
                </div>
              </div>

              {!isCorrect && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Resposta correta:</div>
                  <div className="p-3 rounded-lg border-2 border-green-200 bg-green-50">
                    <span className="font-medium">{String.fromCharCode(65 + question.correctAnswer)})</span>
                    {question.options[question.correctAnswer]}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
