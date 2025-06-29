export interface LocalUserAnswer {
  answerIndex: number
  isCorrect: boolean
  answeredAt: string
}

const LOCAL_ANSWERS_KEY = 'local_user_answers'

export function getLocalAnswers(): Record<string, LocalUserAnswer> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = localStorage.getItem(LOCAL_ANSWERS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    return {}
  }
}

export function saveLocalAnswer(questionId: string, answerIndex: number, isCorrect: boolean): LocalUserAnswer {
  const answers = getLocalAnswers()

  const answer: LocalUserAnswer = {
    answerIndex,
    isCorrect,
    answeredAt: new Date().toISOString(),
  }

  answers[questionId] = answer
  localStorage.setItem(LOCAL_ANSWERS_KEY, JSON.stringify(answers))

  return answer
}

export function clearLocalAnswers(): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(LOCAL_ANSWERS_KEY)
}

export function getLocalAnswer(questionId: string): LocalUserAnswer | undefined {
  const answers = getLocalAnswers()
  return answers[questionId]
}
