export async function saveUserAnswer(questionId: string, answerIndex: number, isCorrect: boolean) {
  const response = await fetch('/api/user-answers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questionId,
      answerIndex,
      isCorrect,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to save user answer')
  }

  return response.json()
}

export interface UserAnswer {
  answerIndex: number
  isCorrect: boolean
  answeredAt: string
}

export async function getUserAnswers(): Promise<Record<string, UserAnswer>> {
  const response = await fetch('/api/user-answers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user answers')
  }

  return response.json()
}
