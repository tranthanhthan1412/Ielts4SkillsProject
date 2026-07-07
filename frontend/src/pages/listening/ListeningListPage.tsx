import { ArrowRight, Headphones } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/common/Badge'
import { listListeningTests } from '../../services/listeningService'
import type { ListeningTestSummary } from '../../data/mockListeningTests'

function ListeningListPage() {
  const [tests, setTests] = useState<ListeningTestSummary[]>([])

  useEffect(() => {
    void listListeningTests().then(setTests)
  }, [])

  return (
    <section className="module-page">
      <header className="module-hero">
        <div>
          <Badge tone="blue">Listening</Badge>
          <h1>Luyện Listening theo 4 sections</h1>
          <p>
            Sẵn khung để nối audio player, transcript, câu hỏi và chấm điểm.
          </p>
        </div>
        <Headphones size={42} />
      </header>

      <div className="module-grid">
        {tests.map((test) => (
          <article className="module-card" key={test.id}>
            <span>{test.durationMinutes} phút</span>
            <h2>{test.title}</h2>
            <p>{test.description}</p>
            <div className="module-meta">
              <Badge>{test.questionCount} câu</Badge>
              <Link to={`/listening/${test.id}`}>
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

export default ListeningListPage
