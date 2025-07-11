import useSWR from 'swr'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useExams() {
  return useSWR(`${API_BASE_URL}/exams`, fetcher)
}

export function useExamByYear(year: string) {
  return useSWR(year ? `${API_BASE_URL}/exams/${year}` : null, fetcher)
}

export function useQuestions(
  year: string,
  limit: number = 10,
  offset: number = 0,
  discipline?: string,
  language?: string
) {
  let url = year ? `${API_BASE_URL}/exams/${year}/questions?limit=${limit}&offset=${offset}` : null
  if (url && discipline) {
    url += `&discipline=${discipline}`
  }
  if (url && language) {
    url += `&language=${language}`
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
    throw new Error('Falha ao buscar exames')
  }
}

export async function getExamByYear(year: string) {
  const response = await fetch(`${API_BASE_URL}/exams/${year}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch exam for year ${year}`)
  }
  return response.json()
}

export async function getQuestions(
  year: string,
  limit: number = 10,
  offset: number = 0,
  discipline?: string,
  language?: string
) {
  try {
    let url = `${API_BASE_URL}/exams/${year}/questions?limit=${limit}&offset=${offset}`
    if (discipline) {
      url += `&discipline=${discipline}`
    }
    if (language) {
      url += `&language=${language}`
    }
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch questions')
    }
    return response.json()
  } catch (error) {
    throw new Error('Falha ao buscar questões')
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
    throw new Error('Falha ao buscar questão')
  }
}

export function useQuestionById(year: string, index: string) {
  const shouldFetch = Boolean(year && index)
  const { data, error, isLoading } = useSWR(
    shouldFetch ? `${API_BASE_URL}/exams/${year}/questions/${index}` : null,
    fetcher
  )
  return { data, error, isLoading }
}

export async function getQuestionsByIndices(year: string, indices: number[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/exams/${year}/questions?limit=${indices.length}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ indices }),
    })
    if (!response.ok) {
      throw new Error('Failed to fetch questions by indices')
    }
    return response.json()
  } catch (error) {
    throw new Error('Falha ao buscar questões por índices')
  }
}
