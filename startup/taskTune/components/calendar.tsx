"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import type { Task } from "@/lib/types"
import { format, addDays, isSameDay, parseISO } from "date-fns"

interface CalendarProps {
  tasks: Task[]
  onAddTask: () => void
}

export default function Calendar({ tasks, onAddTask }: CalendarProps) {
  const [currentDate] = useState(new Date(2025, 2, 26)) // March 26, 2025

  // Generate 7 days starting from the current date
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentDate, i))

  // Time slots from 7am to 11pm
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7
    return `${hour.toString().padStart(2, "0")}:00`
  })

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = parseISO(task.date)
      return isSameDay(taskDate, date)
    })
  }

  const taskToTimeMap = (task: Task): number => {
    const [hours, minutes] = task.startTime.split(":").map(Number)
    return hours + minutes / 60
  }

  const getTaskPosition = (task: Task): { top: number; height: number } => {
    const startTime = taskToTimeMap(task)

    // Calculate end time or default to 1 hour later
    let endTime
    if (task.endTime) {
      const [hours, minutes] = task.endTime.split(":").map(Number)
      endTime = hours + minutes / 60
    } else {
      endTime = startTime + 1
    }

    // Convert to position (assuming each hour is 60px in height)
    const top = (startTime - 7) * 60 // 7am is our starting point
    const height = (endTime - startTime) * 60

    return { top, height }
  }

  const getTaskColor = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 border-blue-300",
      purple: "bg-purple-100 border-purple-300",
      pink: "bg-pink-100 border-pink-300",
      green: "bg-green-100 border-green-300",
      orange: "bg-orange-100 border-orange-300",
      yellow: "bg-yellow-100 border-yellow-300",
    }
    return colorMap[color as keyof typeof colorMap] || "bg-gray-100 border-gray-300"
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <button className="bg-purple-600 text-white rounded-full p-2 flex items-center" onClick={onAddTask}>
          <Plus size={16} className="mr-1" />
          <span>Add task</span>
        </button>

        <div className="flex items-center space-x-4">
          <button className="p-1 rounded hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">Today</span>
          <button className="p-1 rounded hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex space-x-4">
          <button className="bg-gray-200 px-3 py-1 rounded-full text-sm">Month</button>
          <button className="bg-gray-200 px-3 py-1 rounded-full text-sm">Week</button>
          <button className="bg-gray-200 px-3 py-1 rounded-full text-sm">Day</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="text-center p-4 font-medium text-xl">March 2025</div>

        <div className="flex border-b">
          <div className="w-16 border-r"></div>

          {days.map((day, index) => (
            <div key={index} className="flex-1 p-2 text-center border-r">
              <div className="text-xs md:text-sm text-gray-600">{format(day, "dd")}</div>
              <div
                className={`text-xs md:text-sm font-medium ${isSameDay(day, new Date(2025, 2, 26)) ? "text-purple-600" : ""}`}
              >
                {format(day, "EEEE")}
              </div>
            </div>
          ))}
        </div>

        <div className="flex relative">
          <div className="w-16 flex-shrink-0">
            {timeSlots.map((time, index) => (
              <div key={index} className="h-[60px] border-b border-r flex items-center justify-center">
                <span className="text-xs md:text-sm text-gray-500">{time}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-1">
            {days.map((day, dayIndex) => {
              const dayTasks = getTasksForDay(day)

              return (
                <div key={dayIndex} className="flex-1 relative border-r">
                  {timeSlots.map((_, timeIndex) => (
                    <div key={timeIndex} className="h-[60px] border-b"></div>
                  ))}

                  {dayTasks.map((task, taskIndex) => {
                    const { top, height } = getTaskPosition(task)

                    return (
                      <div
                        key={taskIndex}
                        className={`absolute rounded-md border px-2 py-1 ${getTaskColor(task.color)}`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          left: "4px",
                          right: "4px",
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border border-gray-400 mr-2"></div>
                          <div className="text-xs md:text-sm">{task.title}</div>
                        </div>
                        <div className="text-xs mt-1">{task.startTime}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

