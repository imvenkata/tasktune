"use client"

import { Star, Play } from "lucide-react"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center p-3 rounded-lg bg-[#222222] hover:bg-[#2A2A2A]">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mr-3",
              task.color === "orange" && "bg-orange-500",
              task.color === "blue" && "bg-blue-500",
              task.color === "green" && "bg-green-500",
              task.color === "red" && "bg-red-500",
              task.color === "purple" && "bg-purple-500",
            )}
          >
            <Play className="h-4 w-4 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-xs text-gray-400">{task.project}</p>
          </div>

          <button className="text-gray-400 hover:text-yellow-400">
            <Star className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}

