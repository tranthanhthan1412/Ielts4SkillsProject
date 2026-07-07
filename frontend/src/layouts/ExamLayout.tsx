import { ArrowLeft, ClipboardCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import ExamTimer from '../components/exam/ExamTimer'
import ProgressBar from '../components/exam/ProgressBar'

type ExamLayoutProps = {
  children: ReactNode
  durationSeconds?: number
  progress?: number
  skill: string
  title: string
}

function ExamLayout({
  children,
  durationSeconds = 3600,
  progress = 0,
  skill,
  title,
}: ExamLayoutProps) {
  return (
    <main className="exam-shell">
      <header className="exam-topbar">
        <Link className="exam-back-link" to={`/${skill.toLowerCase()}`}>
          <ArrowLeft size={18} />
          <span>Quay lại</span>
        </Link>
        <div>
          <span>{skill}</span>
          <strong>{title}</strong>
        </div>
        <ExamTimer initialSeconds={durationSeconds} />
      </header>

      <ProgressBar label="Tiến độ bài làm" value={progress} />

      <section className="exam-content">
        <div className="exam-status-label">
          <ClipboardCheck size={16} />
          <span>Exam workspace</span>
        </div>
        {children}
      </section>
    </main>
  )
}

export default ExamLayout
