import { ArrowRight, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/common/Badge'
import { listReadingTests } from '../../services/readingService'
import type { ReadingTestSummary } from '../../data/mockReadingTests'

function ReadingListPage() {
  const [tests, setTests] = useState<ReadingTestSummary[]>([])

  useEffect(() => {
    void listReadingTests().then(setTests)
  }, [])

  return (
    <section className="module-page">
      <header className="module-hero">
        <div>
          <Badge tone="red">Reading</Badge>
          <h1>Luyện Reading theo bài thi học thuật</h1>
          <p>
            Khung màn đã sẵn sàng để nối passage, câu hỏi, đáp án và tính điểm.
          </p>
        </div>
        <BookOpen size={42} />
      </header>

      <div className="module-grid">
        {tests.map((test) => (
          <article className="module-card" key={test.id}>
            <span>{test.durationMinutes} phút</span>
            <h2>{test.title}</h2>
            <p>{test.description}</p>
            <div className="module-meta">
              <Badge>{test.questionCount} câu</Badge>
              <Link to={`/reading/${test.id}`}>
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
