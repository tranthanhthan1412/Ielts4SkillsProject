import { Link, useParams } from 'react-router'
import Badge from '../../components/common/Badge'

function SpeakingFeedbackPage() {
  const { topicId } = useParams()

  return (
    <main className="result-page">
      <section className="result-card">
        <Badge tone="blue">Speaking feedback</Badge>
        <h1>Feedback mẫu</h1>
        <p>
          Chủ đề {topicId} sẽ có transcript, nhận xét Fluency, Vocabulary,
          Grammar và Pronunciation sau khi nối recorder/AI feedback.
        </p>
        <div className="result-stats">
          <span>Fluency: 6.5</span>
          <span>Pronunciation: 7.0</span>
        </div>
        <Link to="/speaking">Quay lại Speaking</Link>
      </section>
    </main>
  )
}

export default SpeakingFeedbackPage
