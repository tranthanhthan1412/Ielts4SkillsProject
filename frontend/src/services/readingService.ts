import { apiRequest } from './api'

export type ReadingQuestionType =
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'matching-headings'
  | 'matching-information'
  | 'sentence-completion'
  | 'summary-completion'
  | 'short-answer'

export type ReadingOption = {
  key: string
  text: string
}

export type ReadingQuestion = {
  number: number
  options?: ReadingOption[]
  paragraph?: string
  text?: string
}

export type ReadingQuestionGroup = {
  instruction: string
  options?: ReadingOption[]
  questions: ReadingQuestion[]
  type: ReadingQuestionType
}

export type ReadingPassage = {
  content: string
  order: number
  questionGroups: ReadingQuestionGroup[]
  title: string
}

export type ReadingTestSummary = {
  description: string
  durationMinutes: number
  id: string
  level?: 'easy' | 'medium' | 'hard'
  questionCount: number
  slug: string
  title: string
}

export type ReadingTest = ReadingTestSummary & {
  passages: ReadingPassage[]
}

export type ReadingAnswerPayload = {
  number: number
  value: string
}

export type ReadingAttemptAnswer = ReadingAnswerPayload & {
  correctAnswer: string | string[]
  isCorrect: boolean
}

export type ReadingAttempt = {
  id: string
  answers: ReadingAttemptAnswer[]
  bandScore: number
  correctAnswers: number
  questionCount: number
  submittedAt: string
  testSlug: string
  testTitle: string
  timeSpentSeconds?: number
}

type ReadingTestListResponse = {
  tests: ReadingTestSummary[]
}

type ReadingTestResponse = {
  test: ReadingTest
}

type ReadingAttemptResponse = {
  attempt: ReadingAttempt
}

export async function listReadingTests(): Promise<ReadingTestSummary[]> {
  const { tests } = await apiRequest<ReadingTestListResponse>('/reading/tests')
  return tests
}

export async function getReadingTest(testId: string) {
  const { test } = await apiRequest<ReadingTestResponse>(
    `/reading/tests/${encodeURIComponent(testId)}`,
  )
  return test
}

export async function submitReadingAttempt(
  testId: string,
  payload: { answers: ReadingAnswerPayload[]; timeSpentSeconds?: number },
  token: string,
) {
  const { attempt } = await apiRequest<ReadingAttemptResponse>(
    `/reading/tests/${encodeURIComponent(testId)}/attempts`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  )
  return attempt
}

export async function getReadingAttempt(attemptId: string, token: string) {
  const { attempt } = await apiRequest<ReadingAttemptResponse>(
    `/reading/attempts/${encodeURIComponent(attemptId)}`,
    {},
    token,
  )
  return attempt
}
