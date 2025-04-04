"use client"

import { useState } from "react"
import { CheckCircle2, Flag, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type FocusTask = {
  id: number
  title: string
  priority: "low" | "medium" | "high"
  completed: boolean
}

export default function TodaysFocus() {
  const [focusTasks, setFocusTasks] = useState<FocusTask[]>([
    { id: 1, title: "Complete project presentation", priority: "high", completed: false },
    { id: 2, title: "Schedule doctor appointment", priority: "medium", completed: false },
    { id: 3, title: "Review meeting notes", priority: "low", completed: true },
  ])

  const toggleTask = (id: number) => {
    setFocusTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-orange-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div>
      <div className="flex items-center mb-3">
        <Star className="h-5 w-5 text-yellow-500 mr-2" />
        <h2 className="text-sm font-medium">Today's Focus</h2>
      </div>

      <div className="space-y-2 mt-4">
        {focusTasks.map((task) => (
          <div
            key={task.id}
            className={cn("flex items-center p-2 rounded-md bg-gray-100", task.completed ? "opacity-70" : "")}
          >
            <button className="h-6 w-6 rounded-full mr-2" onClick={() => toggleTask(task.id)}>
              {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center">
                <span className={cn("text-sm", task.completed && "line-through text-gray-500")}>{task.title}</span>
                <Flag className={cn("h-3 w-3 ml-2", getPriorityColor(task.priority))} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

