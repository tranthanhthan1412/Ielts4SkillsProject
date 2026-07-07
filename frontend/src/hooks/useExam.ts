import { useMemo, useState } from 'react'

export function useExam<TAnswer>(questionCount: number) {
  const [answers, setAnswers] = useState<Record<number, TAnswer>>({})

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const progress = questionCount === 0 ? 0 : (answeredCount / questionCount) * 100

  const setAnswer = (questionIndex: number, answer: TAnswer) => {
    setAnswers((current) => ({
      ...current,
      [questionIndex]: answer,
    }))
  }

  const clearAnswer = (questionIndex: number) => {
    setAnswers((current) => {
      const nextAnswers = { ...current }
      delete nextAnswers[questionIndex]
      return nextAnswers
    })
  }

  return {
    answeredCount,
    answers,
    clearAnswer,
    progress,
    setAnswer,
  }
}
