export type ReadingTestSummary = {
  description: string
  durationMinutes: number
  id: string
  questionCount: number
  title: string
}

export const mockReadingTests: ReadingTestSummary[] = [
  {
    description: 'Academic passage practice với dạng True/False/Not Given.',
    durationMinutes: 60,
    id: 'academic-reading-14',
    questionCount: 40,
    title: 'Academic Reading Practice Test 14',
  },
  {
    description: 'Luyện matching headings và sentence completion.',
    durationMinutes: 60,
    id: 'academic-reading-15',
    questionCount: 40,
    title: 'Academic Reading Practice Test 15',
  },
]
