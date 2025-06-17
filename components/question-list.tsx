"use client"

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Circle, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Question {
  id: number
  subject: string
  year: number
  topic: string
  question: string
  options: string[]
  correctAnswer: number
}

interface QuestionListProps {
  questions: Question[]
  answers: Record<number, number>
  showResults: Record<number, boolean>
  onAnswer: (questionId: number, answerIndex: number) => void
  onCheckAnswer: (questionId: number) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function QuestionList({
  questions,
  answers,
  showResults,
  onAnswer,
  onCheckAnswer,
  currentPage,
  totalPages,
  onPageChange,
}: QuestionListProps) {
  const getQuestionStatus = (questionId: number) => {
    const userAnswer = answers[questionId]
    const showResult = showResults[questionId]

    if (userAnswer === undefined) return "unanswered"
    if (!showResult) return "answered"

    const question = questions.find((q) => q.id === questionId)
    if (!question) return "unanswered"

    return userAnswer === question.correctAnswer ? "correct" : "incorrect"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "incorrect":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "answered":
        return <Circle className="h-5 w-5 text-blue-600 fill-current" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "border-green-200 bg-green-50"
      case "incorrect":
        return "border-red-200 bg-red-50"
      case "answered":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-white hover:bg-gray-50"
    }
  }

  return (
    <div className="space-y-4">
      {/* Questions Grid */}
      <div className="grid gap-4">
        {questions.map((question) => {
          const status = getQuestionStatus(question.id)
          const userAnswer = answers[question.id]
          const showResult = showResults[question.id]

          return (
            <Card key={question.id} className={`transition-all duration-200 ${getStatusColor(status)}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <div>
                      <h3 className="font-semibold text-lg">Questão {question.id}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">ENEM {question.year}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-gray-900 leading-relaxed">{question.question}</div>

                <div className="grid gap-2">
                  {question.options.map((option, index) => {
                    const isSelected = userAnswer === index
                    const isCorrect = index === question.correctAnswer

                    let buttonStyle = "justify-start text-left h-auto p-3 "

                    if (!showResult) {
                      buttonStyle += isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    } else {
                      if (isCorrect) {
                        buttonStyle += "border-green-500 bg-green-50 text-green-900"
                      } else if (isSelected && !isCorrect) {
                        buttonStyle += "border-red-500 bg-red-50 text-red-900"
                      } else {
                        buttonStyle += "border-gray-200 bg-gray-50 text-gray-700"
                      }
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => !showResult && onAnswer(question.id, index)}
                        disabled={showResult}
                        className={buttonStyle}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm">{String.fromCharCode(65 + index)})</span>
                            <span className="text-sm">{option}</span>
                          </div>
                          {showResult && isCorrect && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
                        </div>
                      </Button>
                    )
                  })}
                </div>

                {/* Check Answer Button */}
                {userAnswer !== undefined && !showResult && (
                  <div className="flex justify-center">
                    <Button onClick={() => onCheckAnswer(question.id)} className="px-8">
                      Verificar Resposta
                    </Button>
                  </div>
                )}

                {/* Result */}
                {showResult && (
                  <div className="mt-3 flex items-center gap-2 justify-center">
                    {userAnswer === question.correctAnswer ? (
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

              <CardFooter className="flex justify-end border-t p-4">
                <Link href={`/questao/${question.id}`} passHref>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver página completa
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className="w-8 h-8"
                      >
                        {page}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <Button
                        variant={totalPages === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        className="w-8 h-8"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
