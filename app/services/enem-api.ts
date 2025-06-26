import useSWR from 'swr'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useExams() {
  return useSWR(`${API_BASE_URL}/exams`, fetcher)
}

export function useExamByYear(year: string) {
  return useSWR(year ? `${API_BASE_URL}/exams/${year}` : null, fetcher)
}

export function useQuestions(year: string, limit: number = 10, offset: number = 0, discipline?: string) {
  let url = year ? `${API_BASE_URL}/exams/${year}/questions?limit=${limit}&offset=${offset}` : null
  if (url && discipline) {
    url += `&discipline=${discipline}`
  }
  return useSWR(url, fetcher)
}

export async function getExams() {
  try {
    const response = await fetch(`${API_BASE_URL}/exams`)
    if (!response.ok) {
      throw new Error('Failed to fetch exams')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching exams:', error)
    throw error
  }
}

export async function getExamByYear(year: string) {
  const response = await fetch(`${API_BASE_URL}/exams/${year}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch exam for year ${year}`)
  }
  return response.json()
}

export async function getQuestions(year: string, limit: number = 10, offset: number = 0, discipline?: string) {
  try {
    let url = `${API_BASE_URL}/exams/${year}/questions?limit=${limit}&offset=${offset}`
    if (discipline) {
      url += `&discipline=${discipline}`
    }
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch questions')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw error
  }
}

export async function getQuestionById(year: string, index: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/exams/${year}/questions/${index}`)
    if (!response.ok) {
      throw new Error('Failed to fetch question')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching question:', error)
    throw error
  }
}
