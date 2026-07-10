import { useCallback, useEffect, useRef, useState } from 'react'
import { formatTime } from '../utils/formatTime'

export function useTimer(initialSeconds: number, autoStart = true, onTimeUp?: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const onTimeUpRef = useRef(onTimeUp)

  onTimeUpRef.current = onTimeUp

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isRunning, remainingSeconds])

  useEffect(() => {
    if (remainingSeconds === 0 && onTimeUpRef.current) {
      onTimeUpRef.current()
    }
  }, [remainingSeconds])

  const reset = useCallback(() => {
    setRemainingSeconds(initialSeconds)
    setIsRunning(autoStart)
  }, [autoStart, initialSeconds])

  return {
    formattedTime: formatTime(remainingSeconds),
    isExpired: remainingSeconds === 0,
    isRunning,
    pause: () => setIsRunning(false),
    remainingSeconds,
    reset,
    resume: () => setIsRunning(true),
  }
}
