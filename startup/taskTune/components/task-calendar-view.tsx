"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useTaskStore } from "@/lib/task-store"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function TaskCalendarView() {
  const { tasks } = useTaskStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate())

  // Add a state for the current view
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month")

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDay(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDay(null)
  }

  // Update the goToToday function to also set the current day
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDay(today.getDate())
  }

  // Get month data
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  // Prepare calendar grid
  const dayElements = []
  const today = new Date()
  const isCurrentMonth =
    today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()
  const currentDay = today.getDate()

  // Calculate previous month's days to show
  const previousMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  const previousMonthLength = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

  for (let i = 0; i < previousMonthDays; i++) {
    const day = previousMonthLength - previousMonthDays + i + 1
    dayElements.push(
      <div
        key={`prev-${i}`}
        className="h-24 border border-gray-100 dark:border-gray-800 p-1 text-gray-400 dark:text-gray-600"
      >
        <span className="text-xs">{day}</span>
      </div>,
    )
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = isCurrentMonth && i === currentDay
    const isSelected = i === selectedDay

    // Check for tasks on this day
    const dayStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`
    const tasksForDay = tasks.filter((task) => {
      // This is a simple check - in a real app, you'd use a proper date parsing library
      const taskDateMatch = task.time?.match(/(\d+):(\d+) ([AP]M)/) || []
      if (!taskDateMatch.length) return false

      // For this demo, we'll just check if the day matches
      return task.dueDate?.includes(dayStr) || i % 3 === 0 // For demo, we'll add some artificial tasks
    })

    const hasTasks = tasksForDay.length > 0

    dayElements.push(
      <div
        key={i}
        className={cn(
          "h-24 border relative overflow-hidden cursor-pointer transition-colors",
          isToday ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10" : "border-gray-100 dark:border-gray-800",
          isSelected ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20" : "",
        )}
        onClick={() => setSelectedDay(i)}
      >
        <div className="p-1">
          <span
            className={cn(
              "inline-block rounded-full h-6 w-6 text-xs flex items-center justify-center",
              isToday ? "bg-purple-500 text-white" : "",
            )}
          >
            {i}
          </span>
        </div>

        <div className="px-1 overflow-hidden space-y-1">
          {hasTasks && (
            <>
              {tasksForDay.slice(0, 2).map((task, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "text-xs px-1 py-0.5 rounded truncate flex items-center",
                    task.completed
                      ? "line-through text-gray-500"
                      : task.color?.replace("bg-", "text-").replace("100", "700"),
                  )}
                >
                  {task.completed && <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />}
                  {task.title}
                </div>
              ))}

              {tasksForDay.length > 2 && (
                <div className="text-xs text-gray-500 px-1">+{tasksForDay.length - 2} more</div>
              )}
            </>
          )}
        </div>
      </div>,
    )
  }

  // Calculate next month's days to show
  const totalCells = 42 // 6 rows of 7 days
  const nextMonthDays = totalCells - dayElements.length

  for (let i = 1; i <= nextMonthDays; i++) {
    dayElements.push(
      <div
        key={`next-${i}`}
        className="h-24 border border-gray-100 dark:border-gray-800 p-1 text-gray-400 dark:text-gray-600"
      >
        <span className="text-xs">{i}</span>
      </div>,
    )
  }

  // Add a function to handle view changes
  const changeView = (view: "month" | "week" | "day") => {
    setCurrentView(view)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {monthName} {year}
          </h2>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Add to calendar</h4>
                  <p className="text-sm text-muted-foreground">Create a new task or event on this day.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">New Task</Button>
                  <Button>New Event</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => changeView("month")}
            >
              Month
            </Button>
            <Button
              variant={currentView === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => changeView("week")}
            >
              Week
            </Button>
            <Button variant={currentView === "day" ? "default" : "outline"} size="sm" onClick={() => changeView("day")}>
              Day
            </Button>
          </div>
        </div>
      </div>

      {currentView === "month" && (
        <>
          <div className="grid grid-cols-7 text-center py-2 bg-gray-50 dark:bg-gray-800/50 rounded-t-md">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-800 rounded-b-md overflow-hidden">
            {dayElements}
          </div>
        </>
      )}

      {currentView === "week" && (
        <div className="mt-4">
          <div className="grid grid-cols-7 text-center py-2 bg-gray-50 dark:bg-gray-800/50 rounded-t-md">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
              const date = new Date(currentDate)
              const dayOfWeek = date.getDay()
              const diff = index - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) // Adjust for Monday start
              date.setDate(date.getDate() + diff)

              return (
                <div key={day} className="text-sm font-medium">
                  <div>{day}</div>
                  <div className="text-xs text-gray-500">{date.getDate()}</div>
                </div>
              )
            })}
          </div>

          <div className="border rounded-b-md overflow-hidden">
            {Array.from({ length: 12 }, (_, i) => {
              const hour = i + 8 // Start from 8 AM
              return (
                <div key={i} className="grid grid-cols-7 border-b last:border-b-0">
                  <div className="p-2 text-xs text-gray-500 border-r">
                    {hour % 12 === 0 ? 12 : hour % 12}:00 {hour < 12 ? "AM" : "PM"}
                  </div>
                  {Array.from({ length: 7 }, (_, j) => (
                    <div key={j} className="p-2 border-r last:border-r-0 min-h-[60px]">
                      {/* Here you would render tasks for this time slot */}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {currentView === "day" && (
        <div className="mt-4">
          <div className="text-center py-2 bg-gray-50 dark:bg-gray-800/50 rounded-t-md">
            <div className="text-sm font-medium">{format(currentDate, "EEEE, MMMM d, yyyy")}</div>
          </div>

          <div className="border rounded-b-md overflow-hidden">
            {Array.from({ length: 14 }, (_, i) => {
              const hour = i + 7 // Start from 7 AM
              return (
                <div key={i} className="flex border-b last:border-b-0">
                  <div className="p-2 text-xs text-gray-500 border-r w-20">
                    {hour % 12 === 0 ? 12 : hour % 12}:00 {hour < 12 ? "AM" : "PM"}
                  </div>
                  <div className="flex-1 p-2 min-h-[60px]">
                    {/* Here you would render tasks for this time slot */}
                    {tasks
                      .filter((task) => {
                        // This is a simplified check - in a real app, you'd use proper date and time comparison
                        const taskDate = task.date ? new Date(task.date) : null
                        if (!taskDate) return false

                        return (
                          taskDate.getDate() === currentDate.getDate() &&
                          taskDate.getMonth() === currentDate.getMonth() &&
                          taskDate.getFullYear() === currentDate.getFullYear()
                        )
                      })
                      .map((task) => (
                        <div key={task.id} className="mb-1 p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span>{task.title}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{task.duration}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedDay && (
        <Card className="mt-4 p-4">
          <h3 className="font-medium mb-2">
            Selected: {monthName} {selectedDay}, {year}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tasks for this day</span>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Plus className="h-3 w-3" />
                Add Task
              </Button>
            </div>

            <div className="border rounded-md p-2">
              {tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.slice(0, 3).map((task, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <div
                        className={cn("w-2 h-2 rounded-full", task.color?.replace("bg-", "bg-").replace("100", "500"))}
                      />
                      <span className={cn("text-sm", task.completed && "line-through text-gray-500")}>
                        {task.title}
                      </span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {task.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No tasks for this day</p>
                  <p className="text-sm mt-1">Click "Add Task" to create one</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

