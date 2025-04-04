"use client"

import { useState } from "react"
import { Pause } from "lucide-react"

interface FocusTimerProps {
  title: string
  project: string
  timeElapsed: string
  timeLimit: string
}

export default function FocusTimer({ title, project, timeElapsed, timeLimit }: FocusTimerProps) {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-medium mb-1">{title}</h2>
      <p className="text-sm text-gray-400 mb-6">{project}</p>

      <div className="flex-1 flex flex-col items-center justify-center">
        <button
          className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center mb-6"
          onClick={() => setIsPaused(!isPaused)}
        >
          <Pause className="h-8 w-8 text-white" />
        </button>

        <div className="grid grid-cols-2 w-full gap-4 mt-auto">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Today</p>
            <p className="text-xl font-medium">{timeElapsed}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Limits</p>
            <p className="text-xl font-medium">{timeLimit}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

