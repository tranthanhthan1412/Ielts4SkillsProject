import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import Badge from '../../components/common/Badge'
import ExamLayout from '../../layouts/ExamLayout'
import { getWritingTask } from '../../services/writingService'
import type { WritingTaskSummary } from '../../services/writingService'

function WritingTaskPage() {
  const { taskId = 'task-2-opinion-essay' } = useParams()
  const [task, setTask] = useState<WritingTaskSummary | null>(null)

  useEffect(() => {
    void getWritingTask(taskId).then(setTask)
  }, [taskId])

  return (
    <ExamLayout
      durationSeconds={task?.taskType === 'Task 1' ? 1200 : 2400}
      progress={10}
      skill="Writing"
      title={task?.title ?? 'Writing Task'}
    >
      <div className="writing-workspace">
        <article className="exam-panel">
          <Badge tone="red">{task?.taskType ?? 'Task'}</Badge>
          <h1>{task?.title ?? 'Writing prompt'}</h1>
          <p>
            Đề bài chi tiết, dữ liệu biểu đồ hoặc topic essay sẽ được nối tại
            đây trong bước chức năng Writing.
          </p>
        </article>

        <article className="exam-panel">
          <span>Answer editor</span>
          <textarea
            aria-label="Bài viết"
            placeholder="Viết bài của bạn tại đây..."
            rows={12}
          />
          <Link className="exam-submit-link" to={`/writing/${taskId}/feedback`}>
            Nhận feedback mẫu
            <ArrowRight size={17} />
          </Link>
        </article>
      </div>
    </ExamLayout>
  )
}

export default WritingTaskPage
