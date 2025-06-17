export interface Question {
  id: string
  title: string
  index: number
  discipline: string
  language?: string
  year: number
  context?: string
  files?: string[]
  correctAlternative: string
  alternativesIntroduction?: string
  alternatives: {
    letter: string
    text: string
    file?: string
    isCorrect: boolean
  }[]
} 