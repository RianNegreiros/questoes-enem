'use client'

import { UserAnswer } from '@/app/services/user-answers'
import { Question } from '@/app/types/question'
import { QuestionCard } from '@/components/question-card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface QuestionListProps {
  questions: Question[]
  userAnswers: Record<string, UserAnswer>
  onAnswerUpdate: (questionId: string, answer: UserAnswer) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function QuestionList({
  questions,
  userAnswers,
  onAnswerUpdate,
  currentPage,
  totalPages,
  onPageChange,
}: QuestionListProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {questions.map((question) => {
          const questionId = `${question.year}-${question.index}`
          return (
            <QuestionCard
              key={questionId}
              question={question}
              initialUserAnswer={userAnswers[questionId]}
              onAnswerUpdate={(answer) => onAnswerUpdate(questionId, answer)}
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : 0}
                style={{
                  pointerEvents: currentPage === 1 ? 'none' : undefined,
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1
              if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => onPageChange(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              if ((page === currentPage - 2 && page > 1) || (page === currentPage + 2 && page < totalPages)) {
                return (
                  <PaginationItem key={`ellipsis-${page}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : 0}
                style={{
                  pointerEvents: currentPage === totalPages ? 'none' : undefined,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
