import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import QuestionNavigator from '../../components/exam/QuestionNavigator'
import ExamLayout from '../../layouts/ExamLayout'
import { getReadingTest } from '../../services/readingService'
import type { ReadingTestSummary } from '../../data/mockReadingTests'

function ReadingTestPage() {
  const { testId = 'academic-reading-14' } = useParams()
  const [test, setTest] = useState<ReadingTestSummary | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const answeredQuestions = [1, 2, 4, 7, 12, 14]

  useEffect(() => {
    void getReadingTest(testId).then(setTest)
  }, [testId])

  return (
    <ExamLayout
      durationSeconds={(test?.durationMinutes ?? 60) * 60}
      progress={35}
      skill="Reading"
      title={test?.title ?? 'Reading Practice'}
    >
      <div className="exam-grid">
        <article className="exam-panel">
          <span>Passage placeholder</span>
          <h1>The History of the Tortoise</h1>
          <p>
            Nội dung passage sẽ được nối ở bước chức năng Reading. Màn này đã
            giữ sẵn vùng đọc, vùng câu hỏi và điều hướng câu hỏi.
          </p>
        </article>

        <aside className="exam-panel">
          <span>Câu {currentQuestion}</span>
          <h2>Question workspace</h2>
          <p>Form trả lời và logic lưu đáp án sẽ được đặt ở đây.</p>
          <QuestionNavigator
            answered={answeredQuestions}
            current={currentQuestion}
            onSelect={setCurrentQuestion}
            total={test?.questionCount ?? 40}
          />
          <Link className="exam-submit-link" to={`/reading/${testId}/result`}>
            Xem kết quả mẫu
            <ArrowRight size={17} />
          </Link>
        </aside>
      </div>
    </ExamLayout>
  )
}

export default ReadingTestPage
