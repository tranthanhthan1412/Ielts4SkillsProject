import { ArrowRight, Mic2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/common/Badge'
import { listSpeakingTopics } from '../../services/speakingService'
import type { SpeakingTopicSummary } from '../../services/speakingService'

function SpeakingListPage() {
  const [topics, setTopics] = useState<SpeakingTopicSummary[]>([])

  useEffect(() => {
    void listSpeakingTopics().then(setTopics)
  }, [])

  return (
    <section className="module-page">
      <header className="module-hero">
        <div>
          <Badge tone="blue">Speaking</Badge>
          <h1>Luyện Speaking theo part</h1>
          <p>
            Sẵn khung để nối recorder, câu hỏi, transcript và feedback phát âm.
          </p>
        </div>
        <Mic2 size={42} />
      </header>

      <div className="module-grid">
        {topics.map((topic) => (
          <article className="module-card" key={topic.id}>
            <span>{topic.part}</span>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <div className="module-meta">
              <Badge>{topic.part}</Badge>
              <Link to={`/speaking/${topic.id}`}>
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

export default SpeakingListPage
