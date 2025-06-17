"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ShareButton } from "@/components/share-button"

interface Question {
  id: number
  subject: string
  year: number
  topic: string
  question: string
  options: string[]
  correctAnswer: number
}

interface QuestionCardProps {
  question: Question
  selectedAnswer?: number
  showResult: boolean
  onAnswer: (questionId: number, answerIndex: number) => void
  onCheckAnswer: (questionId: number) => void
}

export function QuestionCard({ question, selectedAnswer, showResult, onAnswer, onCheckAnswer }: QuestionCardProps) {
  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
    }

    if (index === question.correctAnswer) {
      return "border-green-500 bg-green-50"
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return "border-red-500 bg-red-50"
    }

    return "border-gray-200"
  }

  const getOptionIcon = (index: number) => {
    if (!showResult) return null

    if (index === question.correctAnswer) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return <XCircle className="h-5 w-5 text-red-600" />
    }

    return null
  }

  // URL para compartilhamento
  const questionUrl = typeof window !== "undefined" ? `${window.location.origin}/questao/${question.id}` : ""

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">Questão {question.id}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">ENEM {question.year}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-lg leading-relaxed">{question.question}</div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && onAnswer(question.id, index)}
              disabled={showResult}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${getOptionStyle(index)} ${!showResult ? "cursor-pointer" : "cursor-default"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-700">{String.fromCharCode(65 + index)})</span>
                  <span>{option}</span>
                </div>
                {getOptionIcon(index)}
              </div>
            </button>
          ))}
        </div>

        {/* Check Answer Button */}
        {selectedAnswer !== undefined && !showResult && (
          <div className="flex justify-center">
            <Button onClick={() => onCheckAnswer(question.id)} className="px-8">
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
        <Link href={`/questao/${question.id}`} passHref>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver página completa
          </Button>
        </Link>
        <ShareButton url={questionUrl} title={`Questão ${question.id} - ENEM ${question.year}`} />
      </CardFooter>
    </Card>
  )
}
