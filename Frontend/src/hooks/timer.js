import { useState, useEffect } from "react"

export function useTimer() {
  const [inputMinutes, setInputMinutes] = useState(5)
  const [inputSeconds, setInputSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(300)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, totalSeconds])

  const toggle = () => {
    setIsRunning((prev) => !prev)
  }

  const reset = () => {
    setTotalSeconds(inputMinutes * 60 + inputSeconds)
    setIsRunning(false)
  }

  const displayMinutes = Math.floor(totalSeconds / 60)
  const displaySeconds = totalSeconds % 60

  return {
    minutes: inputMinutes,
    seconds: inputSeconds,
    displayMinutes,
    displaySeconds,
    isRunning,
    totalSeconds,
    setMinutes: setInputMinutes,
    setSeconds: setInputSeconds,
    toggle,
    reset,
  }
}
