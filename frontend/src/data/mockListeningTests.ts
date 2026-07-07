export type ListeningTestSummary = {
  description: string
  durationMinutes: number
  id: string
  questionCount: number
  title: string
}

export const mockListeningTests: ListeningTestSummary[] = [
  {
    description: 'Luyện Section 1-4 với form completion và multiple choice.',
    durationMinutes: 30,
    id: 'listening-cambridge-01',
    questionCount: 40,
    title: 'Listening Practice Test 01',
  },
  {
    description: 'Tập trung nhận diện keyword, distractor và spelling.',
    durationMinutes: 30,
    id: 'listening-cambridge-02',
    questionCount: 40,
    title: 'Listening Practice Test 02',
  },
]
