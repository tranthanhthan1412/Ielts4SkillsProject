import { useCallback, useEffect, useState } from 'react'
import { formatTime } from '../utils/formatTime'

export function useTimer(initialSeconds: number, autoStart = true) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isRunning, remainingSeconds])

  const reset = useCallback(() => {
    setRemainingSeconds(initialSeconds)
    setIsRunning(autoStart)
  }, [autoStart, initialSeconds])

  return {
    formattedTime: formatTime(remainingSeconds),
    isRunning,
    pause: () => setIsRunning(false),
    remainingSeconds,
    reset,
    resume: () => setIsRunning(true),
  }
}
