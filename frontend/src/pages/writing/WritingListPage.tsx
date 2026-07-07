import { ArrowRight, PenLine } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/common/Badge'
import { listWritingTasks } from '../../services/writingService'
import type { WritingTaskSummary } from '../../services/writingService'

function WritingListPage() {
  const [tasks, setTasks] = useState<WritingTaskSummary[]>([])

  useEffect(() => {
    void listWritingTasks().then(setTasks)
  }, [])

  return (
    <section className="module-page">
      <header className="module-hero">
        <div>
          <Badge tone="red">Writing</Badge>
          <h1>Luyện Writing theo từng task</h1>
          <p>
            Khung sẵn cho đề bài, editor, timer và feedback theo tiêu chí IELTS.
          </p>
        </div>
        <PenLine size={42} />
      </header>

      <div className="module-grid">
        {tasks.map((task) => (
          <article className="module-card" key={task.id}>
            <span>{task.taskType}</span>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <div className="module-meta">
              <Badge>{task.taskType}</Badge>
              <Link to={`/writing/${task.id}`}>
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

export default WritingListPage
