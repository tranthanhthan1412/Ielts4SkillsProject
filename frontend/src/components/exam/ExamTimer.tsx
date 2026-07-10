import { Clock3 } from 'lucide-react'
import { useTimer } from '../../hooks/useTimer'

type ExamTimerProps = {
  initialSeconds: number
  onTimeUp?: () => void
}

function ExamTimer({ initialSeconds, onTimeUp }: ExamTimerProps) {
  const { formattedTime, remainingSeconds } = useTimer(initialSeconds, true, onTimeUp)
  const isWarning = remainingSeconds <= 300
  const isCritical = remainingSeconds <= 60

  return (
    <div className={`exam-timer ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
      <Clock3 size={17} />
      <span>{formattedTime}</span>
    </div>
  )
}

export default ExamTimer
