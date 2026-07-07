const rawScoreBands = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 32, band: 7.5 },
  { min: 30, band: 7 },
  { min: 26, band: 6.5 },
  { min: 23, band: 6 },
  { min: 18, band: 5.5 },
  { min: 16, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 4, band: 2.5 },
  { min: 2, band: 2 },
  { min: 1, band: 1 },
]

export function calculateBand(correctAnswers: number, totalQuestions = 40) {
  const normalizedScore = Math.round((correctAnswers / totalQuestions) * 40)
  return rawScoreBands.find(({ min }) => normalizedScore >= min)?.band ?? 0
}
