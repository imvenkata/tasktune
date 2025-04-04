"use client"

import { useState, useEffect } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"

export default function VisualTimer() {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [time, setTime] = useState(1500) // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(1500)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time > 0) {
            setProgress((time / initialTime) * 100)
            return time - 1
          } else {
            setIsActive(false)
            setIsPaused(true)
            return 0
          }
        })
      }, 1000)
    } else {
      interval && clearInterval(interval)
    }

    return () => {
      interval && clearInterval(interval)
    }
  }, [isActive, isPaused, initialTime])

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleReset = () => {
    setIsActive(false)
    setIsPaused(true)
    setTime(initialTime)
    setProgress(100)
  }

  const formatTime = () => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate the stroke dash offset for the circle
  const calculateCircleDashOffset = () => {
    const circumference = 2 * Math.PI * 42 // 2πr where r=42
    return circumference - (progress / 100) * circumference
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-[#2A2A2A]"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className="text-orange-500"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            strokeDasharray={2 * Math.PI * 42}
            strokeDashoffset={calculateCircleDashOffset()}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{formatTime()}</span>
          <span className="text-sm text-gray-400 mt-1">Project Work</span>
        </div>
      </div>

      <div className="flex space-x-2">
        {isPaused ? (
          <button onClick={handleStart} className="rounded-full px-6 py-1 bg-orange-500 text-white flex items-center">
            <Play className="h-4 w-4 mr-1" /> Start
          </button>
        ) : (
          <button onClick={handlePause} className="rounded-full px-6 py-1 border border-[#2A2A2A] flex items-center">
            <Pause className="h-4 w-4 mr-1" /> Pause
          </button>
        )}
        <button onClick={handleReset} className="rounded-full p-1 border border-[#2A2A2A]">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

