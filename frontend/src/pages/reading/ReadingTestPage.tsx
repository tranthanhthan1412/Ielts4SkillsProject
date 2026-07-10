import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import QuestionNavigator from '../../components/exam/QuestionNavigator'
import SubmitConfirmModal from '../../components/exam/SubmitConfirmModal'
import ExamLayout from '../../layouts/ExamLayout'
import { TOKEN_KEY } from '../../services/api'
import {
  getReadingTest,
  submitReadingAttempt,
} from '../../services/readingService'
import type {
  ReadingOption,
  ReadingQuestion,
  ReadingQuestionGroup,
  ReadingTest,
} from '../../services/readingService'

type AnswerMap = Record<number, string>

function ReadingTestPage() {
  const navigate = useNavigate()
  const { testId = 'academic-reading-14' } = useParams()
  const [test, setTest] = useState<ReadingTest | null>(null)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const hasAutoSubmitted = useRef(false)

  useEffect(() => {
    void getReadingTest(testId)
      .then((nextTest) => {
        setTest(nextTest)
        setAnswers({})
        setCurrentQuestion(1)
        setError('')
        setStartedAt(Date.now())
        hasAutoSubmitted.current = false
      })
      .catch((caughtError) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Không tải được đề Reading.',
        )
      })
  }, [testId])

  const passages = test?.passages ?? []
  const totalQuestions = test?.questionCount ?? 0
  const answeredQuestions = useMemo(() => {
    return Object.entries(answers)
      .filter(([, value]) => value.trim())
      .map(([number]) => Number(number))
  }, [answers])

  const updateAnswer = (questionNumber: number, value: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionNumber]: value,
    }))
  }

  const handleSelectQuestion = (questionNumber: number) => {
    setCurrentQuestion(questionNumber)
    const ref = questionRefs.current[questionNumber]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const doSubmit = useCallback(async () => {
    if (!test || isSubmitting) {
      return
    }

    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      navigate('/auth')
      return
    }

    setError('')
    setIsSubmitting(true)
    setShowModal(false)

    try {
      const attempt = await submitReadingAttempt(
        test.slug,
        {
          answers: Object.entries(answers).map(([number, value]) => ({
            number: Number(number),
            value,
          })),
          timeSpentSeconds: Math.min(
            test.durationMinutes * 60,
            Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
          ),
        },
        token,
      )

      navigate(`/reading/${test.slug}/result?attemptId=${attempt.id}`)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Không nộp được bài Reading.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [answers, isSubmitting, navigate, startedAt, test])

  const handleTimeUp = useCallback(() => {
    if (hasAutoSubmitted.current) {
      return
    }
    hasAutoSubmitted.current = true
    void doSubmit()
  }, [doSubmit])

  const handleSubmitClick = () => {
    setShowModal(true)
  }

  return (
    <ExamLayout
      durationSeconds={(test?.durationMinutes ?? 60) * 60}
      onTimeUp={handleTimeUp}
      progress={totalQuestions ? (answeredQuestions.length / totalQuestions) * 100 : 0}
      skill="Reading"
      title={test?.title ?? 'Reading Practice'}
    >
      {error && <p className="module-message error">{error}</p>}
      <div className="exam-grid">
        <article className="exam-panel reading-passage-panel">
          <span>Reading passage</span>
          {passages.map((passage) => (
            <section className="reading-passage" key={passage.order}>
              <h1>{passage.title}</h1>
              <div className="reading-passage-content">
                {passage.content.split(/\n{2,}/).map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          {!test && !error && <p>Đang tải nội dung đề Reading...</p>}
        </article>

        <aside className="exam-panel reading-questions-panel">
          <span>Câu {currentQuestion}</span>
          <h2>Questions</h2>
          <div className="reading-question-groups">
            {passages.map((passage) =>
              passage.questionGroups.map((group) => (
                <section
                  className="reading-question-group"
                  key={`${passage.order}-${group.type}-${group.instruction}`}
                >
                  <span>{formatQuestionType(group.type)}</span>
                  <p>{group.instruction}</p>
                  {group.options && <OptionList options={group.options} />}
                  <div className="reading-question-list">
                    {group.questions.map((question) => (
                      <QuestionItem
                        current={currentQuestion === question.number}
                        group={group}
                        key={question.number}
                        question={question}
                        ref={(el) => {
                          questionRefs.current[question.number] = el
                        }}
                        value={answers[question.number] ?? ''}
                        onAnswer={updateAnswer}
                        onSelect={handleSelectQuestion}
                      />
                    ))}
                  </div>
                </section>
              )),
            )}
          </div>
          <QuestionNavigator
            answered={answeredQuestions}
            current={currentQuestion}
            onSelect={handleSelectQuestion}
            total={totalQuestions || 1}
          />
          <button
            className="exam-submit-link"
            type="button"
            disabled={!test || isSubmitting}
            onClick={handleSubmitClick}
          >
            {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài Reading'}
            <ArrowRight size={17} />
          </button>
        </aside>
      </div>

      <SubmitConfirmModal
        answeredCount={answeredQuestions.length}
        onCancel={() => setShowModal(false)}
        onConfirm={doSubmit}
        open={showModal}
        totalQuestions={totalQuestions}
      />
    </ExamLayout>
  )
}

type QuestionItemProps = {
  current: boolean
  group: ReadingQuestionGroup
  onAnswer: (questionNumber: number, value: string) => void
  onSelect: (questionNumber: number) => void
  question: ReadingQuestion
  value: string
}

import { forwardRef } from 'react'

const QuestionItem = forwardRef<HTMLDivElement, QuestionItemProps>(
  function QuestionItem(
    { current, group, onAnswer, onSelect, question, value },
    ref,
  ) {
    return (
      <div
        className={current ? 'reading-question current' : 'reading-question'}
        ref={ref}
      >
        <button type="button" onClick={() => onSelect(question.number)}>
          <strong>{question.number}</strong>
          <span>{question.text || question.paragraph || `Question ${question.number}`}</span>
        </button>
        <AnswerInput
          group={group}
          question={question}
          value={value}
          onChange={(nextValue) => onAnswer(question.number, nextValue)}
        />
      </div>
    )
  },
)

type AnswerInputProps = {
  group: ReadingQuestionGroup
  onChange: (value: string) => void
  question: ReadingQuestion
  value: string
}

function AnswerInput({ group, onChange, question, value }: AnswerInputProps) {
  if (group.type === 'true-false-not-given') {
    return (
      <RadioAnswer
        name={`question-${question.number}`}
        options={['TRUE', 'FALSE', 'NOT GIVEN']}
        value={value}
        onChange={onChange}
      />
    )
  }

  if (group.type === 'yes-no-not-given') {
    return (
      <RadioAnswer
        name={`question-${question.number}`}
        options={['YES', 'NO', 'NOT GIVEN']}
        value={value}
        onChange={onChange}
      />
    )
  }

  if (
    group.type === 'matching-headings' ||
    group.type === 'matching-information' ||
    group.type === 'multiple-choice'
  ) {
    const options = question.options ?? group.options ?? []

    return (
      <select
        aria-label={`Answer question ${question.number}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Chọn đáp án</option>
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.key}. {option.text}
          </option>
        ))}
      </select>
    )
  }

  return (
    <input
      aria-label={`Answer question ${question.number}`}
      placeholder="Nhập đáp án"
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

type RadioAnswerProps = {
  name: string
  onChange: (value: string) => void
  options: string[]
  value: string
}

function RadioAnswer({ name, onChange, options, value }: RadioAnswerProps) {
  return (
    <div className="reading-radio-group">
      {options.map((option) => (
        <label key={option}>
          <input
            checked={value === option}
            name={name}
            type="radio"
            value={option}
            onChange={(event) => onChange(event.target.value)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  )
}

function OptionList({ options }: { options: ReadingOption[] }) {
  return (
    <ul className="reading-options">
      {options.map((option) => (
        <li key={option.key}>
          <strong>{option.key}</strong>
          {option.text}
        </li>
      ))}
    </ul>
  )
}

function formatQuestionType(type: string) {
  return type
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default ReadingTestPage
