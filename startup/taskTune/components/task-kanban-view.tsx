"use client"

import { useState } from "react"
import { MoreHorizontal, Trash, CheckCircle2, AlarmClock, Flag, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type KanbanColumn = {
  id: string
  title: string
  color: string
}

type KanbanTask = {
  id: number
  title: string
  time: string
  duration: string
  category: string
  color: string
  completed: boolean
  priority: "low" | "medium" | "high"
  progress?: number
}

export default function TaskKanbanView() {
  const [tasks, setTasks] = useState<KanbanTask[]>([
    {
      id: 1,
      title: "Morning Routine",
      time: "7:00 AM",
      duration: "30 min",
      category: "Self-care",
      color: "bg-blue-100",
      completed: true,
      priority: "high",
      progress: 100,
    },
    {
      id: 2,
      title: "Team Meeting",
      time: "9:00 AM",
      duration: "45 min",
      category: "Work",
      color: "bg-purple-100",
      completed: true,
      priority: "high",
      progress: 100,
    },
    {
      id: 3,
      title: "Coffee Break",
      time: "10:30 AM",
      duration: "15 min",
      category: "Break",
      color: "bg-amber-100",
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
      color: "bg-purple-100",
      completed: false,
      priority: "medium",
      progress: 25,
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [activeColumn, setActiveColumn] = useState<string | null>(null)

  const columns: KanbanColumn[] = [
    { id: "todo", title: "To Do", color: "bg-gray-100" },
    { id: "inProgress", title: "In Progress", color: "bg-blue-100" },
    { id: "completed", title: "Completed", color: "bg-green-100" },
  ]

  const getTasksForColumn = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return tasks.filter((task) => !task.completed && task.progress === 0)
      case "inProgress":
        return tasks.filter((task) => !task.completed && task.progress && task.progress > 0 && task.progress < 100)
      case "completed":
        return tasks.filter((task) => task.completed || (task.progress && task.progress === 100))
      default:
        return []
    }
  }

  const handleAddTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return

    const newTask = {
      id: Math.random(),
      title: newTaskTitle,
      time: "12:00 PM",
      duration: "30 min",
      category: "Task",
      color: "bg-purple-100",
      completed: columnId === "completed",
      priority: "medium" as "low" | "medium" | "high",
      progress: columnId === "inProgress" ? 50 : columnId === "completed" ? 100 : 0,
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle("")
    setActiveColumn(null)
  }

  const handleMoveTask = (taskId: number, targetColumnId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updatedTask = {
      ...task,
      completed: targetColumnId === "completed",
      progress: targetColumnId === "inProgress" ? 50 : targetColumnId === "completed" ? 100 : 0,
    }

    setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)))
  }

  const getCardColorClass = (task: KanbanTask) => {
    if (task.priority === "high") return "border-l-red-500"
    if (task.priority === "medium") return "border-l-orange-500"
    if (task.priority === "low") return "border-l-green-500"
    return "border-l-gray-500"
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col h-full">
            <div className={cn("rounded-t-md p-3 font-medium flex items-center justify-between", column.color)}>
              <div className="flex items-center">
                <span>{column.title}</span>
                <div className="ml-2 px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-xs">
                  {getTasksForColumn(column.id).length}
                </div>
              </div>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20"
                onClick={() => setActiveColumn(activeColumn === column.id ? null : column.id)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {activeColumn === column.id && (
              <div className="p-2 bg-white border border-t-0 border-dashed">
                <div className="flex gap-2">
                  <input
                    placeholder="Task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="h-8 text-sm flex-1 border rounded px-2"
                  />
                  <button
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleAddTask(column.id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 min-h-[200px] bg-gray-50 border border-t-0 rounded-b-md p-2 overflow-auto flex flex-col gap-2">
              {getTasksForColumn(column.id).length > 0 ? (
                getTasksForColumn(column.id).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "shadow-sm border-l-4 cursor-move group bg-white rounded-md",
                      getCardColorClass(task),
                    )}
                  >
                    <div className="p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <AlarmClock className="h-3 w-3 mr-1" />
                            {task.time} · {task.duration}
                          </div>
                        </div>

                        <div className="dropdown relative">
                          <button className="h-7 w-7 opacity-0 group-hover:opacity-100 rounded-full hover:bg-gray-100 flex items-center justify-center">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          <div className="dropdown-menu hidden absolute right-0 mt-1 bg-white shadow-lg rounded-md p-1 z-10">
                            {columns.map(
                              (col) =>
                                column.id !== col.id && (
                                  <button
                                    key={col.id}
                                    className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                                    onClick={() => handleMoveTask(task.id, col.id)}
                                  >
                                    Move to {col.title}
                                  </button>
                                ),
                            )}
                            <button className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded text-red-500">
                              <Trash className="h-4 w-4 mr-2 inline" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <Flag
                            className={cn(
                              "h-3 w-3 mr-1",
                              task.priority === "high"
                                ? "text-red-500"
                                : task.priority === "medium"
                                  ? "text-orange-500"
                                  : "text-green-500",
                            )}
                          />
                          <span className="capitalize">{task.priority}</span>
                        </div>

                        {task.progress !== undefined && task.progress > 0 && task.progress < 100 && (
                          <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                            {task.progress}%
                          </div>
                        )}

                        {task.completed && (
                          <div className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Done
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

