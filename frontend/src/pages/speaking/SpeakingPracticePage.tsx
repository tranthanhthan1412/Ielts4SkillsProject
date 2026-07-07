import { ArrowRight, Mic2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import Badge from '../../components/common/Badge'
import ExamLayout from '../../layouts/ExamLayout'
import { getSpeakingTopic } from '../../services/speakingService'
import type { SpeakingTopicSummary } from '../../services/speakingService'

function SpeakingPracticePage() {
  const { topicId = 'part-1-work-study' } = useParams()
  const [topic, setTopic] = useState<SpeakingTopicSummary | null>(null)

  useEffect(() => {
    void getSpeakingTopic(topicId).then(setTopic)
  }, [topicId])

  return (
    <ExamLayout
      durationSeconds={120}
      progress={20}
      skill="Speaking"
      title={topic?.title ?? 'Speaking Practice'}
    >
      <div className="speaking-workspace">
        <article className="exam-panel">
          <Badge tone="blue">{topic?.part ?? 'Part'}</Badge>
          <h1>{topic?.title ?? 'Speaking topic'}</h1>
          <p>
            Câu hỏi, cue card và gợi ý brainstorm sẽ được nối trong bước chức
            năng Speaking.
          </p>
        </article>

        <article className="exam-panel recorder-panel">
          <span>Recorder placeholder</span>
          <button type="button">
            <Mic2 size={24} />
            Ghi âm câu trả lời
          </button>
          <Link className="exam-submit-link" to={`/speaking/${topicId}/feedback`}>
            Xem feedback mẫu
            <ArrowRight size={17} />
          </Link>
        </article>
      </div>
    </ExamLayout>
  )
}

export default SpeakingPracticePage
