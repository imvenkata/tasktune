"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Coffee,
  Edit3,
  Flag,
  Laptop,
  MoreHorizontal,
  ShowerHead,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type SubTask = {
  id: number | string
  title: string
  completed: boolean
}

type Task = {
  id: number | string
  title: string
  time: string
  duration: string
  category: string
  color: string
  icon: React.ReactNode
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  progress?: number
  subtasks?: SubTask[]
}

export default function TaskTimeline() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Morning Routine",
      time: "7:00 AM",
      duration: "30 min",
      category: "Self-care",
      color: "bg-blue-100 dark:bg-blue-900",
      icon: <ShowerHead className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      completed: true,
      priority: "high",
      progress: 100,
      subtasks: [
        { id: 101, title: "Shower", completed: true },
        { id: 102, title: "Breakfast", completed: true },
        { id: 103, title: "Medication", completed: true },
      ],
    },
    {
      id: 2,
      title: "Team Meeting",
      time: "9:00 AM",
      duration: "45 min",
      category: "Work",
      color: "bg-purple-100 dark:bg-purple-900",
      icon: <Laptop className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
      completed: true,
      priority: "high",
      dueDate: "Today, 9:00 AM",
      progress: 100,
    },
    {
      id: 3,
      title: "Coffee Break",
      time: "10:30 AM",
      duration: "15 min",
      category: "Break",
      color: "bg-amber-100 dark:bg-amber-900",
      icon: <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      completed: false,
      priority: "low",
      progress: 0,
    },
    {
      id: 4,
      title: "Project Work",
      time: "11:00 AM",
      duration: "2 hours",
      category: "Work",
      color: "bg-purple-100 dark:bg-purple-900",
      icon: <Edit3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
      completed: false,
      priority: "medium",
      dueDate: "Today, 5:00 PM",
      progress: 25,
      subtasks: [
        { id: 401, title: "Research", completed: true },
        { id: 402, title: "Draft outline", completed: false },
        { id: 403, title: "Create presentation", completed: false },
        { id: 404, title: "Review with team", completed: false },
      ],
    },
  ])

  const [expandedTasks, setExpandedTasks] = useState<(number | string)[]>([])

  const toggleExpand = (taskId: number | string) => {
    setExpandedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const toggleSubtask = (taskId: number | string, subtaskId: number | string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.subtasks) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
          )

          // Calculate new progress
          const completedCount = updatedSubtasks.filter((st) => st.completed).length
          const progress = Math.round((completedCount / updatedSubtasks.length) * 100)

          return {
            ...task,
            subtasks: updatedSubtasks,
            progress,
            completed: progress === 100,
          }
        }
        return task
      }),
    )
  }

  const toggleTaskCompletion = (taskId: number | string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const completed = !task.completed

          // If task has subtasks, update them all
          let updatedSubtasks = task.subtasks
          if (updatedSubtasks) {
            updatedSubtasks = updatedSubtasks.map((st) => ({
              ...st,
              completed,
            }))
          }

          return {
            ...task,
            completed,
            progress: completed ? 100 : 0,
            subtasks: updatedSubtasks,
          }
        }
        return task
      }),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 dark:text-red-400"
      case "medium":
        return "text-orange-500 dark:text-orange-400"
      case "low":
        return "text-green-500 dark:text-green-400"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  const getBorderColor = (task: Task) => {
    if (task.completed) return "border-l-green-500"

    // Extract the color from the task.color string (e.g., "bg-blue-100" -> "blue")
    const colorMatch = task.color.match(/bg-([a-z]+)-\d+/)
    if (colorMatch && colorMatch[1]) {
      return `border-l-${colorMatch[1]}-500`
    }

    return "border-l-gray-500"
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="space-y-1">
          <Card
            className={cn("p-3 border-l-4", task.completed ? "border-l-green-500 opacity-70" : getBorderColor(task))}
          >
            <div className="flex items-center">
              <button className={cn("p-2 rounded-full mr-3", task.color)} onClick={() => toggleTaskCompletion(task.id)}>
                {task.completed ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> : task.icon}
              </button>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <h3 className={cn("font-medium", task.completed && "line-through text-gray-500")}>{task.title}</h3>
                    {task.priority && <Flag className={cn("h-3 w-3 ml-2", getPriorityColor(task.priority))} />}
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {task.duration}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{task.time}</span>
                  <span className="mx-2">•</span>
                  <span>{task.category}</span>
                  {task.dueDate && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Due: {task.dueDate}</span>
                    </>
                  )}
                </div>

                {task.progress !== undefined && task.progress < 100 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                )}
              </div>

              <div className="flex items-center ml-2">
                {task.subtasks && task.subtasks.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => toggleExpand(task.id)}
                  >
                    {expandedTasks.includes(task.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit task</DropdownMenuItem>
                    <DropdownMenuItem>Add subtask</DropdownMenuItem>
                    <DropdownMenuItem>Delete task</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>

          {/* Subtasks */}
          {task.subtasks && expandedTasks.includes(task.id) && (
            <div className="pl-8 space-y-1 mt-1">
              {task.subtasks.map((subtask) => (
                <Card key={subtask.id} className="p-2 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full mr-2"
                    onClick={() => toggleSubtask(task.id, subtask.id)}
                  >
                    {subtask.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                    )}
                  </Button>
                  <span className={cn("text-sm", subtask.completed && "line-through text-gray-500")}>
                    {subtask.title}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

