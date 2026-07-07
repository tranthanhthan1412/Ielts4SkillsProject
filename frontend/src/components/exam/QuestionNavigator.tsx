type QuestionNavigatorProps = {
  answered: number[]
  current: number
  onSelect: (questionNumber: number) => void
  total: number
}

function QuestionNavigator({
  answered,
  current,
  onSelect,
  total,
}: QuestionNavigatorProps) {
  const answeredSet = new Set(answered)

  return (
    <nav className="question-navigator" aria-label="Danh sách câu hỏi">
      {Array.from({ length: total }, (_, index) => {
        const questionNumber = index + 1
        const isCurrent = questionNumber === current
        const isAnswered = answeredSet.has(questionNumber)

        return (
          <button
            aria-current={isCurrent ? 'step' : undefined}
            className={`${isCurrent ? 'current' : ''} ${
              isAnswered ? 'answered' : ''
            }`}
            key={questionNumber}
            onClick={() => onSelect(questionNumber)}
            type="button"
          >
            {questionNumber}
          </button>
        )
      })}
    </nav>
  )
}

export default QuestionNavigator
