import { Link, useParams } from 'react-router'
import Badge from '../../components/common/Badge'

function WritingFeedbackPage() {
  const { taskId } = useParams()

  return (
    <main className="result-page">
      <section className="result-card">
        <Badge tone="red">Writing feedback</Badge>
        <h1>Feedback mẫu</h1>
        <p>
          Bài {taskId} sẽ được chấm theo Task Achievement, Coherence and
          Cohesion, Lexical Resource và Grammar khi nối chức năng chính.
        </p>
        <div className="result-stats">
          <span>Task response: 7.0</span>
          <span>Vocabulary: 6.5</span>
        </div>
        <Link to="/writing">Quay lại Writing</Link>
      </section>
    </main>
  )
}

export default WritingFeedbackPage
