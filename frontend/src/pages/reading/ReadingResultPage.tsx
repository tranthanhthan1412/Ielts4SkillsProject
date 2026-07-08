import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import Badge from '../../components/common/Badge'
import { TOKEN_KEY } from '../../services/api'
import { getReadingAttempt } from '../../services/readingService'
import type { ReadingAttempt } from '../../services/readingService'

function ReadingResultPage() {
  const [searchParams] = useSearchParams()
  const attemptId = searchParams.get('attemptId')
  const [attempt, setAttempt] = useState<ReadingAttempt | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(attemptId))

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

  return (
    <main className="result-page">
      <section className="result-card">
        <Badge tone="red">Reading result</Badge>
        {isLoading && <p>Đang tải kết quả Reading...</p>}
        {error && <p className="result-error">{error}</p>}
        {attempt && (
          <>
            <h1>Band {attempt.bandScore.toFixed(1)}</h1>
            <p>
              Kết quả cho bài {attempt.testTitle}. Backend đã chấm theo answer
              key trong đề JSON và lưu attempt vào MongoDB.
            </p>
            <div className="result-stats">
              <span>
                {attempt.correctAnswers}/{attempt.questionCount} câu đúng
              </span>
              <span>{formatTime(attempt.timeSpentSeconds)}</span>
            </div>
            <div className="answer-review">
              {attempt.answers.map((answer) => (
                <span
                  className={answer.isCorrect ? 'correct' : 'incorrect'}
                  key={answer.number}
                  title={`Correct answer: ${formatCorrectAnswer(answer.correctAnswer)}`}
                >
                  {answer.number}
                </span>
              ))}
            </div>
          </>
        )}
        <Link to="/reading">Quay lại Reading</Link>
      </section>
    </main>
  )
}

function formatTime(timeSpentSeconds?: number) {
  if (timeSpentSeconds === undefined) {
    return 'Chưa có thời gian'
  }

  const minutes = Math.floor(timeSpentSeconds / 60)
  const seconds = timeSpentSeconds % 60

  return `${minutes} phút ${seconds.toString().padStart(2, '0')} giây`
}

function formatCorrectAnswer(answer: string | string[]) {
  return Array.isArray(answer) ? answer.join(', ') : answer
}

export default ReadingResultPage
