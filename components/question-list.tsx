"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card"
import { Question } from "@/app/types/question"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface QuestionListProps {
  questions: Question[]
  answers: Record<string, number>
  showResults: Record<string, boolean>
  onAnswer: (questionId: string, answerIndex: number) => void
  onCheckAnswer: (questionId: string) => void
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((question) => (
          <QuestionCard
            key={`${question.year}-${question.index}`}
            question={question}
            userAnswer={answers[`${question.year}-${question.index}`]}
            showResult={showResults[`${question.year}-${question.index}`]}
            onAnswer={(index) => onAnswer(`${question.year}-${question.index}`, index)}
            onCheckAnswer={() => onCheckAnswer(`${question.year}-${question.index}`)}
          />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
