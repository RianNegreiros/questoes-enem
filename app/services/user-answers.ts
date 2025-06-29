import { authClient } from '@/lib/auth-client'
import { getLocalAnswers, saveLocalAnswer } from './local-answers'

const ERROR_MESSAGES = {
  SAVE_FAILED: 'Falha ao salvar resposta do usuário',
  FETCH_FAILED: 'Falha ao buscar respostas do usuário',
  SERVER_SAVE_FAILED: 'Falha no salvamento no servidor, usando armazenamento local:',
  SERVER_FETCH_FAILED: 'Falha na busca no servidor, usando armazenamento local:',
} as const

const isUserLoggedIn = (session: any): boolean => {
  return !!session?.user?.id
}

const createLocalAnswerResponse = (localAnswer: any) => ({
  answerIndex: localAnswer.answerIndex,
  isCorrect: localAnswer.isCorrect,
  updatedAt: localAnswer.answeredAt,
})

export async function saveUserAnswer(questionId: string, answerIndex: number, isCorrect: boolean) {
  try {
    const { data: session } = await authClient.getSession()

    if (!isUserLoggedIn(session)) {
      const localAnswer = saveLocalAnswer(questionId, answerIndex, isCorrect)
      return createLocalAnswerResponse(localAnswer)
    }

    const response = await fetch('/api/user-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, answerIndex, isCorrect }),
    })

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.SAVE_FAILED)
    }

    return response.json()
  } catch {
    const localAnswer = saveLocalAnswer(questionId, answerIndex, isCorrect)
    return createLocalAnswerResponse(localAnswer)
  }
}

export interface UserAnswer {
  answerIndex: number
  isCorrect: boolean
  answeredAt: string
}

export async function getUserAnswers(): Promise<Record<string, UserAnswer>> {
  try {
    const { data: session } = await authClient.getSession()

    if (!isUserLoggedIn(session)) {
      return getLocalAnswers()
    }

    const response = await fetch('/api/user-answers', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }

    return response.json()
  } catch {
    return getLocalAnswers()
  }
}
