'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, ExternalLink, XCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { Question } from '@/app/types/question'
import { ShareButton } from '@/components/share-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface QuestionCardProps {
  question: Question
  userAnswer?: number
  showResult?: boolean
  onAnswer?: (answerIndex: number) => void
  onCheckAnswer?: () => void
}

interface AlternativeButtonProps {
  letter: string
  text: string
  isSelected: boolean
  isCorrect?: boolean
  showResult: boolean
  onClick: () => void
}

function AlternativeButton({ letter, text, isSelected, isCorrect, showResult, onClick }: AlternativeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={showResult}
      className={`w-full flex items-center gap-2 p-3 rounded-lg border transition-colors ${
        isSelected ? 'border-info bg-info/10' : 'border-input hover:border-info'
      }`}
    >
      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-input">{letter}</div>
      <span className="flex-1 text-left">{text}</span>
      {showResult && (
        <>
          {isCorrect ? (
            <CheckCircle className="h-5 w-5 text-success" />
          ) : isSelected ? (
            <XCircle className="h-5 w-5 text-error" />
          ) : null}
        </>
      )}
    </button>
  )
}

interface ResultDisplayProps {
  isCorrect: boolean
}

function ResultDisplay({ isCorrect }: ResultDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      {isCorrect ? (
        <span className="text-success">Resposta correta!</span>
      ) : (
        <span className="text-error">Resposta incorreta</span>
      )}
    </div>
  )
}

export function QuestionCard({ question, userAnswer, showResult, onAnswer, onCheckAnswer }: QuestionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{question.discipline}</Badge>
          <Badge variant="outline">{question.year}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/question/${question.year}-${question.index}`}>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
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
            <Image key={`file-${index}`} src={file} alt={`Imagem ${index + 1}`} className="max-w-full rounded-lg" />
          ))}
          <p className="text-sm text-muted-foreground">{question.alternativesIntroduction}</p>
          <div className="space-y-2">
            {question.alternatives.map((alternative, index) => (
              <AlternativeButton
                key={`${question.year}-${question.index}-alternative-${alternative.letter}`}
                letter={alternative.letter}
                text={alternative.text}
                isSelected={userAnswer === index}
                isCorrect={alternative.isCorrect}
                showResult={showResult ?? false}
                onClick={() => onAnswer?.(index)}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onCheckAnswer && (
          <Button variant="outline" onClick={onCheckAnswer} disabled={userAnswer === undefined || showResult}>
            Verificar Resposta
          </Button>
        )}
        {showResult && userAnswer !== undefined && (
          <ResultDisplay isCorrect={!!question.alternatives[userAnswer]?.isCorrect} />
        )}
      </CardFooter>
    </Card>
  )
}
