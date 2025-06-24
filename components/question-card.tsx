'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, ExternalLink, Loader2, RefreshCw, XCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'

import { saveUserAnswer, type UserAnswer } from '@/app/services/user-answers'
import type { Question } from '@/app/types/question'
import { ShareButton } from '@/components/share-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: Question
  initialUserAnswer?: UserAnswer
  onAnswerUpdate?: (answer: UserAnswer) => void
}

interface AlternativeButtonProps {
  letter: string
  text: string
  isSelected: boolean
  isCorrect?: boolean
  showResult: boolean
  onClick: () => void
  disabled: boolean
}

function AlternativeButton({
  letter,
  text,
  isSelected,
  isCorrect,
  showResult,
  onClick,
  disabled,
}: AlternativeButtonProps) {
  const isCorrectAnswer = isCorrect === true
  const isWrongAnswer = isCorrect === false

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg border p-3 text-left transition-colors',
        !showResult && 'hover:border-primary',
        isSelected && !showResult && 'border-primary bg-primary/10',
        showResult &&
          isCorrectAnswer &&
          'border-green-300 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-900/30 dark:text-green-100',
        showResult &&
          isWrongAnswer &&
          isSelected &&
          'border-red-300 bg-red-100 text-red-900 dark:border-red-700 dark:bg-red-900/30 dark:text-red-100'
      )}
    >
      <div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full border',
          !showResult && isSelected ? 'border-primary' : 'border-input',
          showResult && isCorrectAnswer && 'border-green-500 bg-green-500 text-white',
          showResult && isWrongAnswer && isSelected && 'border-red-500 bg-red-500 text-white'
        )}
      >
        {letter}
      </div>
      <span className="flex-1">{text}</span>
      {showResult && (
        <>
          {isCorrectAnswer ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : isSelected ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : null}
        </>
      )}
    </button>
  )
}

export function QuestionCard({ question, initialUserAnswer, onAnswerUpdate }: QuestionCardProps) {
  const [userAnswer, setUserAnswer] = useState(initialUserAnswer)
  const [selectedAlternative, setSelectedAlternative] = useState<number | undefined>(initialUserAnswer?.answerIndex)
  const [showResult, setShowResult] = useState(initialUserAnswer !== undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setUserAnswer(initialUserAnswer)
    setSelectedAlternative(initialUserAnswer?.answerIndex)
    setShowResult(initialUserAnswer !== undefined)
  }, [initialUserAnswer])

  const handleCheckAnswer = async () => {
    if (selectedAlternative === undefined) return

    setIsSubmitting(true)
    const isCorrect = question.alternatives[selectedAlternative]?.isCorrect === true
    try {
      const savedAnswer = await saveUserAnswer(`${question.year}-${question.index}`, selectedAlternative, isCorrect)
      const userAnswerResult = {
        answerIndex: savedAnswer.answerIndex,
        isCorrect: savedAnswer.isCorrect,
        answeredAt: savedAnswer.updatedAt,
      }
      setUserAnswer(userAnswerResult)
      setShowResult(true)
      onAnswerUpdate?.(userAnswerResult)
    } catch {
      toast.error('Erro ao salvar resposta', {
        description: 'Não foi possível salvar sua resposta. Tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setUserAnswer(undefined)
    setSelectedAlternative(undefined)
    setShowResult(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{question.discipline}</Badge>
          <Badge variant="outline">{question.year}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/question/${question.year}-${question.index}`} legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </Link>
          <ShareButton url={`/question/${question.year}-${question.index}`} title={question.title} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-lg font-medium">{question.title}</div>
          {question.context && (
            <div className="text-muted-foreground">
              <ReactMarkdown>{question.context}</ReactMarkdown>
            </div>
          )}
          {question.files?.map((file, index) => (
            <Image
              key={`file-${index}`}
              src={file}
              alt={`Imagem ${index + 1}`}
              className="max-w-full rounded-lg"
              width={500}
              height={500}
            />
          ))}
          <p className="text-sm text-muted-foreground">{question.alternativesIntroduction}</p>
          <div className="space-y-2">
            {question.alternatives.map((alternative, index) => (
              <AlternativeButton
                key={`${question.year}-${question.index}-alternative-${alternative.letter}`}
                letter={alternative.letter}
                text={alternative.text}
                isSelected={selectedAlternative === index}
                isCorrect={userAnswer ? question.alternatives[index].isCorrect : undefined}
                showResult={showResult}
                onClick={() => setSelectedAlternative(index)}
                disabled={showResult || isSubmitting}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showResult ? (
          <Button
            variant="outline"
            onClick={handleCheckAnswer}
            disabled={selectedAlternative === undefined || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verificar Resposta
          </Button>
        ) : (
          <Button variant="outline" onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        )}

        {showResult && userAnswer && (
          <div className="flex items-center gap-2">
            {userAnswer.isCorrect ? (
              <span className="text-green-600 dark:text-green-400">Resposta correta!</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">Resposta incorreta</span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
