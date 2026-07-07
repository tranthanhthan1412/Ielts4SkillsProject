import { ArrowRight, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import QuestionNavigator from '../../components/exam/QuestionNavigator'
import ExamLayout from '../../layouts/ExamLayout'
import { getListeningTest } from '../../services/listeningService'
import type { ListeningTestSummary } from '../../data/mockListeningTests'

function ListeningTestPage() {
  const { testId = 'listening-cambridge-01' } = useParams()
  const [test, setTest] = useState<ListeningTestSummary | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(1)

  useEffect(() => {
    void getListeningTest(testId).then(setTest)
  }, [testId])

  return (
    <ExamLayout
      durationSeconds={(test?.durationMinutes ?? 30) * 60}
      progress={25}
      skill="Listening"
      title={test?.title ?? 'Listening Practice'}
    >
      <div className="exam-grid">
        <article className="exam-panel">
          <span>Audio player placeholder</span>
          <h1>Section audio workspace</h1>
          <div className="audio-placeholder">
            <Volume2 size={28} />
            <span>Audio sẽ được nối trong bước chức năng Listening.</span>
          </div>
        </article>

        <aside className="exam-panel">
          <span>Câu {currentQuestion}</span>
          <h2>Question workspace</h2>
          <p>Vùng form trả lời, auto-save và transcript hint sẽ nằm tại đây.</p>
          <QuestionNavigator
            answered={[1, 3, 5, 6, 8]}
            current={currentQuestion}
            onSelect={setCurrentQuestion}
            total={test?.questionCount ?? 40}
          />
          <Link className="exam-submit-link" to={`/listening/${testId}/result`}>
            Xem kết quả mẫu
            <ArrowRight size={17} />
          </Link>
        </aside>
      </div>
    </ExamLayout>
  )
}

export default ListeningTestPage
