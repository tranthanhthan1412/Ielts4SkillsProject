import { ArrowRight, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/common/Badge'
import { listReadingTests } from '../../services/readingService'
import type { ReadingTestSummary } from '../../services/readingService'

function ReadingListPage() {
  const [tests, setTests] = useState<ReadingTestSummary[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void listReadingTests()
      .then(setTests)
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
      <header className="module-hero">
        <div>
          <Badge tone="red">Reading</Badge>
          <h1>Luyện Reading theo bài thi học thuật</h1>
          <p>
            Đề Reading đã được đọc từ MongoDB, sẵn sàng nối với màn làm bài và chấm điểm.
          </p>
        </div>
        <BookOpen size={42} />
      </header>

      <div className="module-grid">
        {isLoading && <p className="module-message">Đang tải danh sách đề...</p>}
        {error && <p className="module-message error">{error}</p>}
        {!isLoading && !error && tests.length === 0 && (
          <p className="module-message">Chưa có đề Reading nào được publish.</p>
        )}
        {tests.map((test) => (
          <article className="module-card" key={test.id}>
            <span>{test.durationMinutes} phút</span>
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

export default ReadingListPage
