"use client"

import type React from "react"

import { create } from "zustand"

type SubTask = {
  id: number | string
  title: string
  completed: boolean
}

export type Task = {
  id: number | string
  title: string
  time: string
  duration: string
  category: string
  color: string
  icon?: React.ReactNode
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  progress?: number
  subtasks?: SubTask[]
  notes?: string
  date?: string
  startTime?: string
  endTime?: string
  project?: string
  subTasks?: SubTask[]
}

type TaskStore = {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: number | string, updatedTask: Partial<Task>) => void
  deleteTask: (id: number | string) => void
  moveTask: (id: number | string, updatedTask: Partial<Task>) => void
  toggleTaskCompletion: (id: number | string) => void
  updateSubtask: (taskId: number | string, subtaskId: number | string, completed: boolean) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [
    {
      id: 1,
      title: "Morning Routine",
      time: "7:00 AM",
      duration: "30 min",
      category: "Self-care",
      color: "bg-blue-100 dark:bg-blue-900",
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
      completed: true,
      priority: "high",
      dueDate: "2023-10-15",
      progress: 100,
    },
    {
      id: 3,
      title: "Coffee Break",
      time: "10:30 AM",
      duration: "15 min",
      category: "Break",
      color: "bg-amber-100 dark:bg-amber-900",
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
      completed: false,
      priority: "medium",
      dueDate: "2023-10-18",
      progress: 25,
      subtasks: [
        { id: 401, title: "Research", completed: true },
        { id: 402, title: "Draft outline", completed: false },
        { id: 403, title: "Create presentation", completed: false },
        { id: 404, title: "Review with team", completed: false },
      ],
    },
  ],

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  moveTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    })),

  toggleTaskCompletion: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === id) {
          const completed = !task.completed
          return {
            ...task,
            completed,
            progress: completed
              ? 100
              : task.subtasks && task.subtasks.length > 0
                ? Math.round((task.subtasks.filter((st) => st.completed).length / task.subtasks.length) * 100)
                : task.progress || 0,
          }
        }
        return task
      }),
    })),

  updateSubtask: (taskId, subtaskId, completed) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === taskId && task.subtasks) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed } : subtask,
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
    })),
}))

