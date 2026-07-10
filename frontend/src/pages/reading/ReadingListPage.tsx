import { ArrowRight, BookOpen, Clock3, History, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/common/Badge'
import { TOKEN_KEY } from '../../services/api'
import { listReadingTests, listUserAttempts } from '../../services/readingService'
import type { ReadingAttemptSummary, ReadingTestSummary } from '../../services/readingService'

const levelTone: Record<string, 'success' | 'neutral' | 'red'> = {
  easy: 'success',
  hard: 'red',
  medium: 'neutral',
}

const levelLabel: Record<string, string> = {
  easy: 'Dễ',
  hard: 'Khó',
  medium: 'Trung bình',
}

function ReadingListPage() {
  const [tests, setTests] = useState<ReadingTestSummary[]>([])
  const [attempts, setAttempts] = useState<ReadingAttemptSummary[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    void Promise.all([
      listReadingTests(),
      token ? listUserAttempts(token).catch(() => []) : Promise.resolve([]),
    ])
      .then(([nextTests, nextAttempts]) => {
        setTests(nextTests)
        setAttempts(nextAttempts)
      })
      .catch((caughtError) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Không tải được danh sách đề Reading.',
        )
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="module-page">
      <header className="module-hero reading-hero">
        <div>
          <Badge tone="red">Reading</Badge>
          <h1>Luyện Reading theo bài thi học thuật</h1>
          <p>
            Luyện tập với các bài thi Reading Academic đầy đủ 40 câu hỏi, 3 passages.
            Chấm điểm tự động theo thang band score IELTS chuẩn.
          </p>
        </div>
        <BookOpen size={42} />
      </header>

      {attempts.length > 0 && (
        <section className="reading-history-section">
          <div className="reading-history-header">
            <History size={18} />
            <h2>Lịch sử làm bài</h2>
          </div>
          <div className="reading-history-list">
            {attempts.slice(0, 6).map((attempt) => (
              <Link
                className="reading-history-item"
                key={attempt.id}
                to={`/reading/${attempt.testSlug}/result?attemptId=${attempt.id}`}
              >
                <div className="reading-history-score">
                  <Trophy size={14} />
                  <strong>Band {attempt.bandScore.toFixed(1)}</strong>
                </div>
                <span className="reading-history-title">{attempt.testTitle}</span>
                <div className="reading-history-meta">
                  <span>
                    {attempt.correctAnswers}/{attempt.questionCount} câu đúng
                  </span>
                  <span>
                    <Clock3 size={12} />
                    {formatDate(attempt.submittedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="module-grid">
        {isLoading && <p className="module-message">Đang tải danh sách đề...</p>}
        {error && <p className="module-message error">{error}</p>}
        {!isLoading && !error && tests.length === 0 && (
          <p className="module-message">Chưa có đề Reading nào được publish.</p>
        )}
        {tests.map((test) => (
          <article className="module-card reading-card" key={test.id}>
            <div className="reading-card-top">
              <span>{test.durationMinutes} phút</span>
              {test.level && (
                <Badge tone={levelTone[test.level] ?? 'neutral'}>
                  {levelLabel[test.level] ?? test.level}
                </Badge>
              )}
            </div>
            <h2>{test.title}</h2>
            <p>{test.description}</p>
            <div className="module-meta">
              <Badge>{test.questionCount} câu</Badge>
              <Link to={`/reading/${test.slug}`}>
                Bắt đầu
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function formatDate(isoString: string) {
  try {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return isoString
  }
}

export default ReadingListPage
