type ProgressBarProps = {
  label?: string
  value: number
}

function ProgressBar({ label, value }: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value))

  return (
    <div className="exam-progress" aria-label={label}>
      <span style={{ width: `${normalizedValue}%` }} />
    </div>
  )
}

export default ProgressBar
