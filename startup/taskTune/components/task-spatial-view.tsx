"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { CheckCircle2, Pencil, Plus, X, Save, Flag, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// Type for spatial task
type SpatialTask = {
  id: number
  title: string
  description?: string
  color: string
  priority: "low" | "medium" | "high"
  completed: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export default function TaskSpatialView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [spatialTasks, setSpatialTasks] = useState<SpatialTask[]>([
    {
      id: 1,
      title: "Project Ideas",
      description: "Brainstorm new app features\n- Visual planning\n- Task relationships\n- Energy tracking",
      color: "bg-purple-100 text-purple-900",
      priority: "high",
      completed: false,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
    },
    {
      id: 2,
      title: "Daily Routines",
      description: "Morning and evening routines to maintain consistency",
      color: "bg-blue-100 text-blue-900",
      priority: "medium",
      completed: false,
      position: { x: 400, y: 150 },
      size: { width: 180, height: 120 },
    },
    {
      id: 3,
      title: "Weekly Goals",
      description: "Track progress on main goals for this week",
      color: "bg-green-100 text-green-900",
      priority: "medium",
      completed: false,
      position: { x: 250, y: 300 },
      size: { width: 220, height: 130 },
    },
  ])

  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    color: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [draggedTask, setDraggedTask] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizingTask, setResizingTask] = useState<number | null>(null)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const colorOptions = [
    { value: "bg-purple-100 text-purple-900", label: "Purple" },
    { value: "bg-blue-100 text-blue-900", label: "Blue" },
    { value: "bg-green-100 text-green-900", label: "Green" },
    { value: "bg-yellow-100 text-yellow-900", label: "Yellow" },
    { value: "bg-red-100 text-red-900", label: "Red" },
    { value: "bg-pink-100 text-pink-900", label: "Pink" },
  ]

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, taskId: number) => {
    e.preventDefault()
    const task = spatialTasks.find((t) => t.id === taskId)
    if (!task) return

    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setDraggedTask(taskId)
  }

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedTask === null && resizingTask === null) return

      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()

        if (draggedTask !== null) {
          // Handle dragging
          setSpatialTasks((prev) =>
            prev.map((task) => {
              if (task.id === draggedTask) {
                const newX = e.clientX - containerRect.left - dragOffset.x
                const newY = e.clientY - containerRect.top - dragOffset.y

                // Constrain to container
                const constrainedX = Math.max(0, Math.min(newX, containerRect.width - task.size.width))
                const constrainedY = Math.max(0, Math.min(newY, containerRect.height - task.size.height))

                return {
                  ...task,
                  position: { x: constrainedX, y: constrainedY },
                }
              }
              return task
            }),
          )
        } else if (resizingTask !== null) {
          // Handle resizing
          setSpatialTasks((prev) =>
            prev.map((task) => {
              if (task.id === resizingTask) {
                const diffX = e.clientX - resizeStart.x
                const diffY = e.clientY - resizeStart.y

                const newWidth = Math.max(150, resizeStart.width + diffX)
                const newHeight = Math.max(100, resizeStart.height + diffY)

                // Constrain to container and minimum size
                const maxWidth = containerRect.width - task.position.x
                const maxHeight = containerRect.height - task.position.y

                return {
                  ...task,
                  size: {
                    width: Math.min(newWidth, maxWidth),
                    height: Math.min(newHeight, maxHeight),
                  },
                }
              }
              return task
            }),
          )
        }
      }
    }

    const handleMouseUp = () => {
      setDraggedTask(null)
      setResizingTask(null)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [draggedTask, dragOffset, resizingTask, resizeStart])

  // Start resize
  const handleResizeStart = (e: React.MouseEvent, taskId: number) => {
    e.preventDefault()
    e.stopPropagation()

    const task = spatialTasks.find((t) => t.id === taskId)
    if (!task) return

    setResizingTask(taskId)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: task.size.width,
      height: task.size.height,
    })
  }

  // Handle task completion toggle
  const toggleTaskCompletion = (taskId: number) => {
    setSpatialTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  // Handle task edit mode
  const startEditingTask = (taskId: number) => {
    const task = spatialTasks.find((t) => t.id === taskId)
    if (!task) return

    setEditForm({
      title: task.title,
      description: task.description || "",
      color: task.color,
      priority: task.priority,
    })
    setEditingTask(taskId)
  }

  // Save edited task
  const saveTaskEdit = () => {
    if (!editingTask) return

    setSpatialTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask
          ? {
              ...task,
              title: editForm.title,
              description: editForm.description,
              color: editForm.color,
              priority: editForm.priority,
            }
          : task,
      ),
    )

    setEditingTask(null)
  }

  // Delete a task
  const deleteTask = (taskId: number) => {
    setSpatialTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  // Create a new task
  const createNewTask = () => {
    const newId = Math.max(0, ...spatialTasks.map((t) => t.id)) + 1

    setSpatialTasks((prev) => [
      ...prev,
      {
        id: newId,
        title: "New Task",
        description: "",
        color: "bg-purple-100 text-purple-900",
        priority: "medium",
        completed: false,
        position: { x: 150, y: 150 },
        size: { width: 200, height: 150 },
      },
    ])

    // Start editing the new task
    startEditingTask(newId)
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Spatial Organization</h2>
        <button
          onClick={createNewTask}
          className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-full"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      <div ref={containerRef} className="relative flex-1 bg-gray-50 border rounded-md min-h-[500px] overflow-auto">
        {spatialTasks.map((task) => (
          <div
            key={task.id}
            className={cn("absolute rounded-md shadow-md", task.completed ? "opacity-60" : "opacity-100", task.color)}
            style={{
              left: `${task.position.x}px`,
              top: `${task.position.y}px`,
              width: `${task.size.width}px`,
              height: `${task.size.height}px`,
              cursor: draggedTask === task.id ? "grabbing" : "grab",
              zIndex: editingTask === task.id ? 10 : draggedTask === task.id ? 5 : 1,
            }}
          >
            {editingTask === task.id ? (
              <div className="h-full p-3 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-sm font-medium border-none p-0 h-7 bg-transparent"
                    placeholder="Task title"
                  />
                  <div className="flex items-center">
                    <button
                      className="h-6 w-6 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center"
                      onClick={saveTaskEdit}
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      className="h-6 w-6 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center"
                      onClick={() => setEditingTask(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="flex-1 text-sm resize-none border-none p-0 bg-transparent"
                  placeholder="Add description here..."
                />

                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={editForm.color}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, color: e.target.value }))}
                    className="h-7 w-20 text-xs bg-white bg-opacity-50 rounded border-none"
                  >
                    {colorOptions.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        priority: e.target.value as "low" | "medium" | "high",
                      }))
                    }
                    className="h-7 w-24 text-xs bg-white bg-opacity-50 rounded border-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 h-full flex flex-col" onMouseDown={(e) => handleDragStart(e, task.id)}>
                  <div className="flex items-start justify-between">
                    <h3 className={cn("text-sm font-medium", task.completed && "line-through opacity-70")}>
                      {task.title}
                    </h3>

                    <div className="flex items-center">
                      <button
                        className="h-6 w-6 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTaskCompletion(task.id)
                        }}
                      >
                        <CheckCircle2 className={cn("h-4 w-4", task.completed ? "text-green-600" : "text-gray-400")} />
                      </button>

                      <div className="relative">
                        <button
                          className="h-6 w-6 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <div className="dropdown-menu hidden absolute right-0 mt-1 bg-white shadow-lg rounded-md p-1 z-10">
                          <button
                            className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditingTask(task.id)
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2 inline" />
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTask(task.id)
                            }}
                          >
                            <X className="h-4 w-4 mr-2 inline" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-sm whitespace-pre-line mt-2">{task.description}</div>

                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <div
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full border",
                        task.priority === "high"
                          ? "border-red-200 text-red-600"
                          : task.priority === "medium"
                            ? "border-orange-200 text-orange-600"
                            : "border-green-200 text-green-600",
                      )}
                    >
                      <Flag className="h-3 w-3 mr-1 inline" />
                      {task.priority}
                    </div>
                  </div>
                </div>

                {/* Resize handle */}
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                  onMouseDown={(e) => handleResizeStart(e, task.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 8L14 14M14 8L14 14L8 14" />
                  </svg>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

