import { Question } from './question'

export interface Exam {
  title: string
  year: number
  disciplines: Discipline[]
  languages: Language[]
  questions: Question[]
}

export interface Discipline {
  label: string
  value: string
}

interface Language {
  label: string
  value: string
}
