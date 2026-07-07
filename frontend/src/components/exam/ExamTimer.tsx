import { Clock3 } from 'lucide-react'
import { useTimer } from '../../hooks/useTimer'

type ExamTimerProps = {
  initialSeconds: number
}

function ExamTimer({ initialSeconds }: ExamTimerProps) {
  const { formattedTime, remainingSeconds } = useTimer(initialSeconds)
  const isWarning = remainingSeconds <= 300

  return (
    <div className={`exam-timer ${isWarning ? 'warning' : ''}`}>
      <Clock3 size={17} />
      <span>{formattedTime}</span>
    </div>
  )
}

export default ExamTimer
