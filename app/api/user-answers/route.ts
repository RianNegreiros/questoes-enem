import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { questionId, answerIndex, isCorrect } = await request.json()

    if (!questionId || answerIndex === undefined || isCorrect === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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
    console.error('Error saving user answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userAnswers = await prisma.userAnswer.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        questionId: true,
        answerIndex: true,
        isCorrect: true,
        updatedAt: true,
      },
    })

    const answersMap: Record<string, { answerIndex: number; isCorrect: boolean; answeredAt: Date }> = {}
    userAnswers.forEach((answer) => {
      answersMap[answer.questionId] = {
        answerIndex: answer.answerIndex,
        isCorrect: answer.isCorrect,
        answeredAt: answer.updatedAt,
      }
    })

    return NextResponse.json(answersMap)
  } catch (error) {
    console.error('Error fetching user answers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
