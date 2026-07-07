import { mockListeningTests } from '../data/mockListeningTests'
import type { ListeningTestSummary } from '../data/mockListeningTests'

export async function listListeningTests(): Promise<ListeningTestSummary[]> {
  return mockListeningTests
}

export async function getListeningTest(testId: string) {
  return mockListeningTests.find(({ id }) => id === testId) ?? mockListeningTests[0]
}
