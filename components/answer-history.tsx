'use client'

import { CheckCircle, XCircle } from 'lucide-react'

import { Question } from '@/app/types/question'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AnswerCardProps {
  question: Question
  userAnswer: number
}

function AnswerCard({ question, userAnswer }: AnswerCardProps) {
  const isCorrect = question.alternatives[userAnswer]?.isCorrect

  const getAlternativeStyle = (index: number, isCorrect: boolean) => {
    if (index === userAnswer) {
      return isCorrect ? 'border-success bg-success/10' : 'border-error bg-error/10'
    }
    return isCorrect ? 'border-success/50 bg-success/5' : 'border-input'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCorrect ? <CheckCircle className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-error" />}
            <CardTitle className="text-lg">{question.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{question.discipline}</Badge>
            <Badge variant="outline">{question.year}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {question.context && <p className="text-muted-foreground">{question.context}</p>}
          {question.files?.map((file, index) => (
            <img key={index} src={file} alt={`Imagem ${index + 1}`} className="max-w-full rounded-lg" />
          ))}
          <div className="space-y-2">
            {question.alternatives.map((alternative, index) => (
              <div
                key={alternative.letter}
                className={`p-3 rounded-lg border ${getAlternativeStyle(index, alternative.isCorrect)}`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-input">
                    {alternative.letter}
                  </div>
                  <span>{alternative.text}</span>
                  {alternative.isCorrect && <CheckCircle className="h-4 w-4 text-success ml-auto" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AnswerHistoryProps {
  answers: Record<string, number>
  questions: Question[]
}

export function AnswerHistory({ answers, questions }: AnswerHistoryProps) {
  const answeredQuestions = questions.filter((q) => answers[`${q.year}-${q.index}`] !== undefined)

  if (answeredQuestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Você ainda não respondeu nenhuma questão.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {answeredQuestions.map((question) => (
        <AnswerCard
          key={`${question.year}-${question.index}`}
          question={question}
          userAnswer={answers[`${question.year}-${question.index}`]}
        />
      ))}
    </div>
  )
}
