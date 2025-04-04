"use client"

import { useState, useEffect } from "react"
import { X, Clock, Battery, Calendar, Check, Coffee } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface GentleNudgeProps {
  currentTask?: Task | null
  nextTask?: Task | null
  energyLevel?: "low" | "medium" | "high"
  onDismiss: () => void
  onAccept?: () => void
  onDecline?: () => void
}

export default function GentleNudge({
  currentTask,
  nextTask,
  energyLevel = "medium",
  onDismiss,
  onAccept,
  onDecline,
}: GentleNudgeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [nudgeType, setNudgeType] = useState<
    "transition" | "gap-opportunity" | "break-reminder" | "energy-suggestion" | "focus-check"
  >("transition")
  const [timeLeft, setTimeLeft] = useState(10)
  const [showTimer, setShowTimer] = useState(false)

  // Simulate the appearance of the nudge
  useEffect(() => {
    // Animate in
    setIsVisible(true)

    // If this is a transition nudge with a timer, start the countdown
    if (nudgeType === "transition" && currentTask && nextTask) {
      setShowTimer(true)
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [nudgeType, currentTask, nextTask])

  // Generate the appropriate message based on the nudge type
  const getNudgeMessage = () => {
    switch (nudgeType) {
      case "transition":
        return (
          <div>
            <p className="font-medium">
              Your {currentTask?.title || "current task"} ends in {timeLeft} mins.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your next task is <span className="font-medium">{nextTask?.title || "Write Report"}</span>. Would you like
              a 5-min buffer time before starting?
            </p>
          </div>
        )
      case "gap-opportunity":
        return (
          <div>
            <p className="font-medium">You have a 15-minute gap now.</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You reported {energyLevel} energy. <span className="font-medium">"Quick Email Reply"</span> is on your
              list. Feel like tackling it?
            </p>
          </div>
        )
      case "break-reminder":
        return (
          <div>
            <p className="font-medium">It's nearly lunchtime!</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You've been working for 2.5 hours. Remember to take a break!
            </p>
          </div>
        )
      case "energy-suggestion":
        return (
          <div>
            <p className="font-medium">Your energy seems to be dropping.</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Would you like to switch to a lower-energy task like{" "}
              <span className="font-medium">"Review Documents"</span>?
            </p>
          </div>
        )
      case "focus-check":
        return (
          <div>
            <p className="font-medium">You've been focused for 45 minutes!</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Great work! Take a quick stretch or continue your momentum?
            </p>
          </div>
        )
      default:
        return <p>Time to check your schedule!</p>
    }
  }

  // Get the appropriate icon for the nudge type
  const getNudgeIcon = () => {
    switch (nudgeType) {
      case "transition":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "gap-opportunity":
        return <Clock className="h-5 w-5 text-green-500" />
      case "break-reminder":
        return <Coffee className="h-5 w-5 text-amber-500" />
      case "energy-suggestion":
        return <Battery className="h-5 w-5 text-red-500" />
      case "focus-check":
        return <Check className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  // Get the appropriate action buttons based on the nudge type
  const getNudgeActions = () => {
    switch (nudgeType) {
      case "transition":
        return (
          <>
            <button
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm flex items-center"
              onClick={onAccept}
            >
              Add buffer time
            </button>
            <button
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center"
              onClick={onDecline}
            >
              No thanks
            </button>
          </>
        )
      case "gap-opportunity":
        return (
          <>
            <button
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm flex items-center"
              onClick={onAccept}
            >
              Start task
            </button>
            <button
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center"
              onClick={onDecline}
            >
              Not now
            </button>
          </>
        )
      case "break-reminder":
        return (
          <>
            <button
              className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-md text-sm flex items-center"
              onClick={onAccept}
            >
              Take a break
            </button>
            <button
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center"
              onClick={onDecline}
            >
              Remind me later
            </button>
          </>
        )
      case "energy-suggestion":
        return (
          <>
            <button
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm flex items-center"
              onClick={onAccept}
            >
              Switch task
            </button>
            <button
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center"
              onClick={onDecline}
            >
              Continue current
            </button>
          </>
        )
      case "focus-check":
        return (
          <>
            <button
              className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md text-sm flex items-center"
              onClick={onAccept}
            >
              Take a stretch
            </button>
            <button
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center"
              onClick={onDecline}
            >
              Keep going
            </button>
          </>
        )
      default:
        return (
          <button
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center"
            onClick={onDismiss}
          >
            Dismiss
          </button>
        )
    }
  }

  // Cycle through different nudge types for demo purposes
  const cycleNudgeType = () => {
    const types: Array<typeof nudgeType> = [
      "transition",
      "gap-opportunity",
      "break-reminder",
      "energy-suggestion",
      "focus-check",
    ]
    const currentIndex = types.indexOf(nudgeType)
    const nextIndex = (currentIndex + 1) % types.length
    setNudgeType(types[nextIndex])
    setTimeLeft(10) // Reset timer when changing nudge type
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            {getNudgeIcon()}
            <h3 className="ml-2 font-medium">Gentle Nudge</h3>
          </div>
          <div className="flex items-center">
            {/* For demo purposes, add a button to cycle through nudge types */}
            <button className="text-xs text-gray-500 mr-2 px-2 py-0.5 bg-gray-100 rounded" onClick={cycleNudgeType}>
              Demo: Change Type
            </button>
            <button
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-3">{getNudgeMessage()}</div>

        {showTimer && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Transition in</span>
              <span>{timeLeft} minutes</span>
            </div>
            <Progress value={(timeLeft / 10) * 100} className="h-1.5" />
          </div>
        )}

        <div className="flex justify-end space-x-2">{getNudgeActions()}</div>
      </div>
    </div>
  )
}

