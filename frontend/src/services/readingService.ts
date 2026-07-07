import { mockReadingTests } from '../data/mockReadingTests'
import type { ReadingTestSummary } from '../data/mockReadingTests'

export async function listReadingTests(): Promise<ReadingTestSummary[]> {
  return mockReadingTests
}

export async function getReadingTest(testId: string) {
  return mockReadingTests.find(({ id }) => id === testId) ?? mockReadingTests[0]
}
