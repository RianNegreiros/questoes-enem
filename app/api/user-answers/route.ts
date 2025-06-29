import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Não autorizado',
  MISSING_FIELDS: 'Campos obrigatórios ausentes',
  INTERNAL_ERROR: 'Erro interno do servidor',
} as const

const createErrorResponse = (message: string, status: number) => NextResponse.json({ error: message }, { status })

const validateSession = async (request: NextRequest) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
  }
  return session
}

const validateRequiredFields = (data: any) => {
  const { questionId, answerIndex, isCorrect } = data
  if (!questionId || answerIndex === undefined || isCorrect === undefined) {
    throw new Error(ERROR_MESSAGES.MISSING_FIELDS)
  }
  return { questionId, answerIndex, isCorrect }
}

export async function POST(request: NextRequest) {
  try {
    const session = await validateSession(request)
    const { questionId, answerIndex, isCorrect } = validateRequiredFields(await request.json())

    const userAnswer = await prisma.userAnswer.upsert({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
      update: {
        answerIndex,
        isCorrect,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        questionId,
        answerIndex,
        isCorrect,
      },
    })

    return NextResponse.json(userAnswer)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ERROR_MESSAGES.UNAUTHORIZED) {
        return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401)
      }
      if (error.message === ERROR_MESSAGES.MISSING_FIELDS) {
        return createErrorResponse(ERROR_MESSAGES.MISSING_FIELDS, 400)
      }
    }

    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500)
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await validateSession(request)

    const userAnswers = await prisma.userAnswer.findMany({
      where: { userId: session.user.id },
      select: {
        questionId: true,
        answerIndex: true,
        isCorrect: true,
        updatedAt: true,
      },
    })

    const answersMap = userAnswers.reduce(
      (acc, answer) => {
        acc[answer.questionId] = {
          answerIndex: answer.answerIndex,
          isCorrect: answer.isCorrect,
          answeredAt: answer.updatedAt,
        }
        return acc
      },
      {} as Record<string, { answerIndex: number; isCorrect: boolean; answeredAt: Date }>
    )

    return NextResponse.json(answersMap)
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_MESSAGES.UNAUTHORIZED) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401)
    }

    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500)
  }
}
