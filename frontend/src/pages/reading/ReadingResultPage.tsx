import { ArrowRight, Check, ChevronDown, ChevronUp, RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import Badge from '../../components/common/Badge'
import { TOKEN_KEY } from '../../services/api'
import { getReadingAttempt } from '../../services/readingService'
import type { ReadingAttempt, ReadingAttemptAnswer } from '../../services/readingService'

function ReadingResultPage() {
  const { testId } = useParams()
  const [searchParams] = useSearchParams()
  const attemptId = searchParams.get('attemptId')
  const [attempt, setAttempt] = useState<ReadingAttempt | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(attemptId))
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!attemptId) {
      setIsLoading(false)
      setError('Không tìm thấy mã bài làm Reading.')
      return
    }

    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      setIsLoading(false)
      setError('Bạn cần đăng nhập để xem kết quả Reading.')
      return
    }

    void getReadingAttempt(attemptId, token)
      .then(setAttempt)
      .catch((caughtError) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Không tải được kết quả Reading.',
        )
      })
      .finally(() => setIsLoading(false))
  }, [attemptId])

  const toggleQuestion = (questionNumber: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(questionNumber)) {
        next.delete(questionNumber)
      } else {
        next.add(questionNumber)
      }
      return next
    })
  }

  const expandAll = () => {
    if (!attempt) return
    setExpandedQuestions(new Set(attempt.answers.map((a) => a.number)))
  }

  const collapseAll = () => {
    setExpandedQuestions(new Set())
  }

  return (
    <main className="result-page">
      <section className="result-card reading-result-card">
        <Badge tone="red">Reading result</Badge>
        {isLoading && <p>Đang tải kết quả Reading...</p>}
        {error && <p className="result-error">{error}</p>}
        {attempt && (
          <>
            <div className="reading-result-hero">
              <div className="reading-band-display">
                <span className="reading-band-label">Band Score</span>
                <h1>{attempt.bandScore.toFixed(1)}</h1>
                <span className="reading-band-description">
                  {getBandDescription(attempt.bandScore)}
                </span>
              </div>
              <div className="reading-result-stats">
                <div className="reading-stat">
                  <strong>{attempt.correctAnswers}</strong>
                  <span>/{attempt.questionCount} câu đúng</span>
                </div>
                <div className="reading-stat">
                  <strong>{Math.round((attempt.correctAnswers / attempt.questionCount) * 100)}%</strong>
                  <span>chính xác</span>
                </div>
                <div className="reading-stat">
                  <strong>{formatTime(attempt.timeSpentSeconds)}</strong>
                  <span>thời gian</span>
                </div>
              </div>
            </div>

            <div className="answer-review">
              {attempt.answers.map((answer) => (
                <span
                  className={answer.isCorrect ? 'correct' : 'incorrect'}
                  key={answer.number}
                >
                  {answer.number}
                </span>
              ))}
            </div>

            <div className="reading-detail-header">
              <h2>Chi tiết đáp án</h2>
              <div className="reading-detail-actions">
                <button onClick={expandAll} type="button">Mở tất cả</button>
                <button onClick={collapseAll} type="button">Thu gọn</button>
              </div>
            </div>

            <div className="reading-answer-detail-list">
              {attempt.answers.map((answer) => (
                <AnswerDetailItem
                  answer={answer}
                  expanded={expandedQuestions.has(answer.number)}
                  key={answer.number}
                  onToggle={() => toggleQuestion(answer.number)}
                />
              ))}
            </div>
          </>
        )}
        <div className="reading-result-actions">
          {testId && (
            <Link className="reading-result-retry" to={`/reading/${testId}`}>
              <RefreshCw size={15} />
              Làm lại bài này
            </Link>
          )}
          <Link to="/reading">
            Quay lại Reading
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}

type AnswerDetailItemProps = {
  answer: ReadingAttemptAnswer
  expanded: boolean
  onToggle: () => void
}

function AnswerDetailItem({ answer, expanded, onToggle }: AnswerDetailItemProps) {
  return (
    <div className={`reading-answer-detail ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
      <button className="reading-answer-detail-toggle" onClick={onToggle} type="button">
        <span className="reading-answer-number">
          {answer.isCorrect ? <Check size={14} /> : <X size={14} />}
          Câu {answer.number}
        </span>
        <span className="reading-answer-preview">
          {answer.isCorrect ? (
            <span className="reading-answer-correct-tag">Đúng</span>
          ) : (
            <>
              <span className="reading-your-answer">{formatAnswerValue(answer.value) || '(bỏ trống)'}</span>
              <span className="reading-answer-arrow">→</span>
              <span className="reading-correct-value">{formatCorrectAnswer(answer.correctAnswer)}</span>
            </>
          )}
        </span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expanded && (
        <div className="reading-answer-detail-body">
          <div className="reading-answer-comparison">
            <div>
              <span>Câu trả lời của bạn</span>
              <strong className={answer.isCorrect ? 'correct' : 'incorrect'}>
                {formatAnswerValue(answer.value) || '(bỏ trống)'}
              </strong>
            </div>
            <div>
              <span>Đáp án đúng</span>
              <strong className="correct">
                {formatCorrectAnswer(answer.correctAnswer)}
              </strong>
            </div>
          </div>
          {answer.explanation && (
            <div className="reading-explanation">
              <strong>Giải thích:</strong>
              <p>{answer.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatTime(timeSpentSeconds?: number) {
  if (timeSpentSeconds === undefined) {
    return '--:--'
  }

  const minutes = Math.floor(timeSpentSeconds / 60)
  const seconds = timeSpentSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatAnswerValue(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return value
}

function formatCorrectAnswer(answer: string | string[]) {
  return Array.isArray(answer) ? answer.join(', ') : answer
}

function getBandDescription(band: number) {
  if (band >= 8.5) return 'Expert User'
  if (band >= 7.5) return 'Very Good User'
  if (band >= 6.5) return 'Competent User'
  if (band >= 5.5) return 'Modest User'
  if (band >= 4.5) return 'Limited User'
  if (band >= 3.5) return 'Extremely Limited User'
  return 'Intermittent User'
}

export default ReadingResultPage
