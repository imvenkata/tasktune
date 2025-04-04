"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  LayoutGrid,
  FileText,
  Settings,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  Play,
  ChevronUpIcon,
  BarChart2,
  Sun,
  Moon,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import TaskModal from "@/components/task-modal"
import type { Task } from "@/lib/types"
import TaskDetailView from "@/components/task-detail-view"
import { ICON_COLLECTION } from "@/components/icons"
import SettingsPage from "@/components/settings/settings-page"
import GentleNudge from "@/components/gentle-nudge"
import { useTheme } from "@/components/theme-provider"

// Update the renderIcon function in the tasktune-app component
const renderIcon = (iconId: string | null | undefined, size = "h-6 w-6") => {
  if (!iconId) return null
  const IconComponent = ICON_COLLECTION[iconId as keyof typeof ICON_COLLECTION]
  return IconComponent ? <IconComponent className={size} /> : null
}

export default function TaskTuneApp() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [activeView, setActiveView] = useState<"calendar" | "kanban" | "spatial" | "timeline">("calendar")
  const [showAiPlanner, setShowAiPlanner] = useState(false)
  const [showSmartScheduler, setShowSmartScheduler] = useState(false)
  const [showFocusPatterns, setShowFocusPatterns] = useState(true)
  const [currentMonth, setCurrentMonth] = useState("March 2025")
  const [currentDay, setCurrentDay] = useState("Today")
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("todoLists")
  const [showSettings, setShowSettings] = useState(false)

  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [showTaskDetail, setShowTaskDetail] = useState(false)

  const [showListInput, setShowListInput] = useState(false)
  const [newListTitle, setNewListTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [todoLists, setTodoLists] = useState<{ id: string; title: string }[]>([
    { id: "list-1", title: "Work Tasks" },
    { id: "list-2", title: "Personal Errands" },
    { id: "list-3", title: "Project Ideas" },
  ])

  // Add state for controlling the gentle nudge visibility
  // Add this after the other useState declarations
  const [showGentleNudge, setShowGentleNudge] = useState(false)
  const [currentNudgeTask, setCurrentNudgeTask] = useState<Task | null>(null)
  const [nextNudgeTask, setNextNudgeTask] = useState<Task | null>(null)

  // Also update the initial tasks to include more colorful icons
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Longpress to complete",
      project: "Tutorial",
      date: "2025-03-26",
      startTime: "09:00",
      endTime: "09:01",
      color: "purple",
      completed: false,
      priority: "medium",
      icon: "computer",
    },
    {
      id: "2",
      title: "Discover taskTune",
      project: "Tutorial",
      date: "2025-03-27",
      startTime: "10:00",
      endTime: "10:01",
      color: "blue",
      completed: false,
      priority: "medium",
      icon: "lightning",
    },
    {
      id: "3",
      title: "Click on checkmark to complete",
      project: "Tutorial",
      date: "2025-03-26",
      startTime: "13:00",
      endTime: "13:01",
      color: "orange",
      completed: false,
      priority: "medium",
      icon: "smile",
    },
    {
      id: "4",
      title: "Try adding a task",
      project: "Tutorial",
      date: "2025-03-27",
      startTime: "14:00",
      endTime: "14:01",
      color: "blue",
      completed: false,
      priority: "medium",
      icon: "heart",
    },
  ])

  // Log tasks whenever they change
  useEffect(() => {
    console.log("Current tasks:", tasks)
  }, [tasks])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1
          } else {
            if (timerMinutes > 0) {
              setTimerMinutes((prevMinutes) => prevMinutes - 1)
              return 59
            } else {
              // Timer is complete
              setIsTimerRunning(false)
              return 0
            }
          }
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timerMinutes])

  // Replace the parseTaskDate function with this simpler version
  const parseTaskDate = (dateString: string) => {
    if (!dateString) {
      console.error("Empty date string provided")
      return null
    }

    try {
      // For YYYY-MM-DD format (from input type="date")
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Extract day directly from the string
        const day = Number.parseInt(dateString.split("-")[2], 10)
        return day
      }

      // If it's not in the expected format, try to parse it as a Date
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.getDate()
      }
    } catch (error) {
      console.error("Error parsing date:", dateString, error)
    }

    console.error("Failed to parse date:", dateString)
    return null
  }

  // Replace the handleAddTask function with this version
  const handleAddTask = (newTask: Task) => {
    console.log("Adding new task:", newTask)
    console.log("Task date:", newTask.date)

    // Create a new array with the new task
    const updatedTasks = [...tasks, newTask]

    // Update the state with the new array
    setTasks(updatedTasks)

    // Close the modal
    setIsTaskModalOpen(false)
  }

  // Add a function to handle the gentle nudge visibility
  // Add this with the other handler functions
  const handleDismissNudge = () => {
    setShowGentleNudge(false)
  }

  const handleAcceptNudge = () => {
    // In a real app, this would implement the suggested action
    console.log("Nudge accepted")
    setShowGentleNudge(false)
  }

  const handleDeclineNudge = () => {
    // In a real app, this would log the decline and adjust future suggestions
    console.log("Nudge declined")
    setShowGentleNudge(false)
  }

  const handleAddList = () => {
    if (newListTitle.trim()) {
      setTodoLists([...todoLists, { id: `list-${Date.now()}`, title: newListTitle.trim() }])
      setNewListTitle("")
      setShowListInput(false)
    }
  }

  const toggleFeature = (feature: string) => {
    switch (feature) {
      case "aiPlanner":
        setShowAiPlanner(!showAiPlanner)
        setShowSmartScheduler(false)
        break
      case "smartScheduler":
        setShowSmartScheduler(!showSmartScheduler)
        setShowAiPlanner(false)
        break
      case "focusPatterns":
        setShowFocusPatterns(!showFocusPatterns)
        break
      default:
        break
    }
  }

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const formatTimer = () => {
    return `${timerMinutes.toString().padStart(2, "0")}:${timerSeconds.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    // If timer is at 0:00, reset it to 25:00 when starting again
    if (timerMinutes === 0 && timerSeconds === 0) {
      setTimerMinutes(25)
      setTimerSeconds(0)
    }
    setIsTimerRunning(!isTimerRunning)
  }

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }

  const closeTaskDetail = () => {
    setShowTaskDetail(false)
    setSelectedTask(undefined)
  }

  // Replace the handleDateClick function with this simplified version:
  const handleDateClick = (dayNumber: number) => {
    // Format the day with leading zero if needed
    const day = dayNumber < 10 ? "0" + dayNumber : String(dayNumber)

    // Create a date string in YYYY-MM-DD format for the clicked day
    const dateString = "2025-03-" + day

    // Open the task modal with the selected date pre-filled
    setSelectedTask({
      id: "new-" + Date.now(),
      title: "",
      project: "",
      date: dateString,
      startTime: "09:00",
      endTime: "10:00",
      color: "purple",
      completed: false,
      priority: "medium",
      icon: "",
    })
    setIsTaskModalOpen(true)
  }

  // Helper function to get background color for task
  const getColorForTask = (color: string) => {
    switch (color) {
      case "purple":
        return "#e2d8f3" // light purple
      case "blue":
        return "#dbeafe" // light blue
      case "green":
        return "#dcfce7" // light green
      case "orange":
        return "#ffedd5" // light orange
      case "red":
        return "#fee2e2" // light red
      case "pink":
        return "#fce7f3" // light pink
      default:
        return "#e2d8f3" // default light purple
    }
  }

  // Helper function to get darker color for the dot
  const getDarkerColor = (color: string) => {
    switch (color) {
      case "purple":
        return "#8a63d2" // darker purple
      case "blue":
        return "#3b82f6" // darker blue
      case "green":
        return "#22c55e" // darker green
      case "orange":
        return "#f97316" // darker orange
      case "red":
        return "#ef4444" // darker red
      case "pink":
        return "#ec4899" // darker pink
      default:
        return "#8a63d2" // default darker purple
    }
  }

  // Replace the days array with this version that doesn't include numbers in the display
  const days = [
    { number: 24, name: "Monday", current: false },
    { number: 25, name: "Tuesday", current: false },
    { number: 26, name: "Wednesday", current: true },
    { number: 27, name: "Thursday", current: false },
    { number: 28, name: "Friday", current: false },
    { number: 29, name: "Saturday", current: false },
    { number: 30, name: "Sunday", current: false },
  ]

  const timeSlots = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"]

  const [activeCalendarView, setActiveCalendarView] = useState<"month" | "week" | "day">("month")

  // First, add a new state to track the active tab:
  const [activeTab, setActiveTab] = useState<"home" | "calendar" | "grid">("calendar")

  // Calculate task completion percentage
  const calculateCompletionPercentage = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.completed).length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  // Get upcoming reminders (tasks for today)
  const getUpcomingReminders = () => {
    const today = new Date()
    const todayString = today.toISOString().split("T")[0] // YYYY-MM-DD format

    // For demo purposes, we'll use the current tasks and filter for today's date
    return tasks
      .filter((task) => task.date === "2025-03-26")
      .sort((a, b) => {
        return a.startTime.localeCompare(b.startTime)
      })
  }

  // Add a useEffect to simulate the appearance of gentle nudges
  // Add this with the other useEffect hooks
  useEffect(() => {
    // Simulate a gentle nudge appearing after 5 seconds
    const nudgeTimer = setTimeout(() => {
      // Only show if not in settings and not showing a modal
      if (!showSettings && !isTaskModalOpen && !showTaskDetail) {
        // Find a current and next task for the nudge
        const currentTask = tasks.find((t) => t.id === "3") // "Click on checkmark to complete"
        const nextTask = tasks.find((t) => t.id === "4") // "Try adding a task"

        setCurrentNudgeTask(currentTask || null)
        setNextNudgeTask(nextTask || null)
        setShowGentleNudge(true)
      }
    }, 5000)

    return () => clearTimeout(nudgeTimer)
  }, [showSettings, isTaskModalOpen, showTaskDetail, tasks])

  const { setTheme, theme } = useTheme()

  // If settings is active, show the settings page
  if (showSettings) {
    return (
      <div className="flex h-screen bg-white text-gray-900">
        {/* Left Icon Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
          <div className="mb-8">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Logo"
                width={24}
                height={24}
                className="object-cover rounded-full"
              />
            </div>
          </div>

          <nav className="flex flex-col items-center space-y-6 flex-1">
            <button
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              onClick={() => setShowSettings(false)}
            >
              <Home className="h-5 w-5 text-gray-500" />
            </button>
            <button
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              onClick={() => setShowSettings(false)}
            >
              <Calendar className="h-5 w-5 text-gray-500" />
            </button>
            <button
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              onClick={() => setShowSettings(false)}
            >
              <LayoutGrid className="h-5 w-5 text-gray-500" />
            </button>
          </nav>

          <div className="mt-auto">
            <button className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600" />
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto">
          <SettingsPage />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Left Icon Sidebar - make it smaller on mobile */}
        <div className="w-12 sm:w-16 md:w-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4">
          <div className="mb-8">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Logo"
                width={24}
                height={24}
                className="object-cover rounded-full"
              />
            </div>
          </div>

          <nav className="flex flex-col items-center space-y-6 flex-1">
            <button className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center">
              <Home className="h-5 w-5 text-gray-500" />
            </button>
            <button
              className={`w-10 h-10 rounded-lg ${activeTab === "calendar" ? "bg-purple-100" : "hover:bg-gray-100"} flex items-center justify-center`}
              onClick={() => setActiveTab("calendar")}
            >
              <Calendar className={`h-5 w-5 ${activeTab === "calendar" ? "text-purple-600" : "text-gray-500"}`} />
            </button>
            <div className="relative group">
              <button
                className={`w-10 h-10 rounded-lg ${activeTab === "grid" ? "bg-purple-100" : "hover:bg-gray-100"} flex items-center justify-center`}
                onClick={() => setActiveTab("grid")}
              >
                <LayoutGrid className={`h-5 w-5 ${activeTab === "grid" ? "text-purple-600" : "text-gray-500"}`} />
              </button>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                <h4 className="font-medium text-sm mb-1">Calendar Integration:</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="h-3 w-3 mr-1 text-purple-500" />
                    <span>Google Calendar</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                    <span>Outlook Calendar</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                    <span>Apple Calendar</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="mt-auto">
            <button
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Left Side Panel - hide on small screens, show on medium and up */}
        <div className="hidden md:flex w-64 md:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col overflow-auto">
          {/* Quick Timer */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              QUICK TIMER
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-6 py-2">
                <span className="text-xl md:text-2xl font-medium">{formatTimer()}</span>
              </div>
              <button
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                onClick={toggleTimer}
              >
                <Play className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleSection("progress")}
            >
              <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                <BarChart2 className="h-4 w-4 mr-1" />
                PROGRESS TRACKING
              </div>
              <button className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
                <ChevronUpIcon
                  className={`h-4 w-4 transition-transform ${expandedSection === "progress" ? "" : "transform rotate-180"}`}
                />
              </button>
            </div>

            {expandedSection === "progress" && (
              <div className="px-4 pb-4">
                <h3 className="font-medium mb-3">Task Completion</h3>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${calculateCompletionPercentage()}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs md:text-sm text-gray-500">
                  <span>{calculateCompletionPercentage()}% Complete</span>
                  <span>
                    {tasks.filter((task) => task.completed).length}/{tasks.length} Tasks
                  </span>
                </div>

                {/* Task completion by category */}
                <div className="mt-4">
                  <h4 className="text-xs font-medium mb-2">BY PRIORITY</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-xs">High</span>
                      <div className="ml-auto text-xs">0/0</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-xs">Medium</span>
                      <div className="ml-auto text-xs">0/4</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs">Low</span>
                      <div className="ml-auto text-xs">0/0</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Todo Lists */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleSection("todoLists")}
            >
              <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                <FileText className="h-4 w-4 mr-1" />
                TODO LISTS
              </div>
              <button className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
                <ChevronUpIcon
                  className={`h-4 w-4 transition-transform ${expandedSection === "todoLists" ? "" : "transform rotate-180"}`}
                />
              </button>
            </div>

            {expandedSection === "todoLists" && (
              <div className="px-4 pb-4">
                <h3 className="font-medium mb-2">My Todo Lists</h3>

                {/* Search box */}
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search lists..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Add list button or input */}
                {showListInput ? (
                  <div className="flex mb-3">
                    <input
                      type="text"
                      placeholder="List name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddList()
                        }
                      }}
                      autoFocus
                    />
                    <button
                      className="px-3 py-2 bg-purple-100 text-purple-600 rounded-r-md text-sm"
                      onClick={handleAddList}
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full flex items-center justify-between text-gray-500 hover:bg-gray-100 p-2 rounded-md mb-3"
                    onClick={() => setShowListInput(true)}
                  >
                    <span>Create new todo list</span>
                    <Plus className="h-4 w-4" />
                  </button>
                )}

                {/* List of todo lists */}
                <div className="space-y-2">
                  {todoLists
                    .filter((list) => list.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((list) => (
                      <div
                        key={list.id}
                        className="p-2 rounded-md bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                        onClick={() => {
                          setSelectedTask({
                            id: list.id,
                            title: list.title,
                            project: "",
                            date: "",
                            startTime: "",
                            endTime: "",
                            color: "purple",
                            completed: false,
                            priority: "medium",
                            icon: "",
                          })
                          setIsTaskModalOpen(true)
                        }}
                      >
                        <span className="text-sm">{list.title}</span>
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                </div>

                {todoLists.length === 0 && !showListInput && (
                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>No todo lists yet.</p>
                    <p className="mt-1">Click the button above to create one.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content - take full width on small screens */}
        <div className="flex-1 overflow-auto">
          {/* Add responsive padding */}
          <header className="h-16 border-b border-gray-200 flex items-center px-3 sm:px-4 md:px-6 justify-between">
            {/* Make text smaller on mobile */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium">Dashboard</h1>

            {/* Hide less important elements on small screens */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark")
                }}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-700" />
                )}
              </button>
              <button className="hidden sm:block px-2 md:px-4 py-1 rounded-full text-gray-800 dark:text-gray-200 text-xs md:text-sm">
                Today
              </button>

              {/* Keep essential buttons visible */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="px-2 sm:px-3 md:px-4 py-1 rounded-full text-gray-800 dark:text-gray-200 text-xs">
                  Month
                </button>
                <button className="px-2 sm:px-3 md:px-4 py-1 rounded-full text-gray-800 dark:text-gray-200 text-xs">
                  Week
                </button>
                <button className="px-2 sm:px-3 md:px-4 py-1 rounded-full text-gray-800 dark:text-gray-200 text-xs">
                  Day
                </button>
              </div>
            </div>
          </header>

          {/* Add responsive padding to content */}
          <div className="p-2 sm:p-4 md:p-6">
            {/* Calendar View */}
            {activeTab === "calendar" ? (
              <div className="flex-1 overflow-auto">
                {/* Calendar Header */}
                <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between">
                  <button className="mr-2 p-1 rounded-full hover:bg-gray-100" onClick={() => setIsTaskModalOpen(true)}>
                    <Plus className="h-5 w-5 text-purple-600" />
                  </button>
                  <span className="font-medium mr-1">Add task</span>

                  <div className="mx-4 flex items-center">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="mx-2 font-medium">{currentDay}</span>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="text-xl font-semibold">{currentMonth}</div>

                  <div className="flex items-center space-x-2">
                    <button
                      className={cn(
                        "px-2 md:px-4 py-1 rounded-full text-gray-800 text-xs md:text-sm",
                        activeCalendarView === "month" ? "bg-purple-200" : "bg-gray-200",
                      )}
                      onClick={() => setActiveCalendarView("month")}
                    >
                      Month
                    </button>
                    <button
                      className={cn(
                        "px-2 md:px-4 py-1 rounded-full text-gray-800 text-xs md:text-sm",
                        activeCalendarView === "week" ? "bg-purple-200" : "bg-gray-200",
                      )}
                      onClick={() => setActiveCalendarView("week")}
                    >
                      Week
                    </button>
                    <button
                      className={cn(
                        "px-2 md:px-4 py-1 rounded-full text-gray-800 text-xs md:text-sm",
                        activeCalendarView === "day" ? "bg-purple-200" : "bg-gray-200",
                      )}
                      onClick={() => setActiveCalendarView("day")}
                    >
                      Day
                    </button>
                  </div>
                </header>

                {/* Calendar View */}
                <div className="flex flex-col h-full">
                  {activeCalendarView === "month" && (
                    <>
                      {/* Days of Week - Month View */}
                      <div className="grid grid-cols-7 border-b border-gray-200">
                        {days.map((day) => (
                          <div
                            key={day.number}
                            className={cn(
                              "p-2 text-center border-r border-gray-200 last:border-r-0",
                              day.current && "bg-purple-50",
                            )}
                          >
                            <div className={cn("text-sm md:text-base font-medium", day.current && "text-purple-600")}>
                              {day.name}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Month Grid */}
                      <div className="flex-1 overflow-auto">
                        {Array.from({ length: 5 }, (_, weekIndex) => (
                          <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-200">
                            {Array.from({ length: 7 }, (_, dayIndex) => {
                              const dayNumber = weekIndex * 7 + dayIndex + 1
                              const currentDate = new Date(2025, 2, dayNumber) // March 2025
                              const dateString = currentDate.toISOString().split('T')[0] // YYYY-MM-DD format

                              return (
                                <div
                                  key={dayIndex}
                                  className="p-2 min-h-[100px] border-r last:border-r-0 cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleDateClick(dayNumber)}
                                >
                                  {dayNumber <= 31 ? (
                                    <>
                                      <div className="text-sm font-medium mb-1">
                                        <span>{dayNumber}</span>
                                      </div>

                                      {/* Display tasks for this day */}
                                      {tasks.map((task, idx) => {
                                        if (task.date === dateString) {
                                          return (
                                            <div
                                              key={`task-${task.id}-${idx}`}
                                              className="mb-1 p-2 rounded-md text-xs cursor-pointer"
                                              style={{ backgroundColor: getColorForTask(task.color) }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openTaskDetail(task);
                                              }}
                                            >
                                              <div className="flex items-center">
                                                {task.icon ? (
                                                  renderIcon(task.icon, "h-3 w-3 mr-1 text-gray-700")
                                                ) : (
                                                  <div
                                                    className="w-2 h-2 rounded-full mr-1"
                                                    style={{ backgroundColor: getDarkerColor(task.color) }}
                                                  ></div>
                                                )}
                                                <span className="truncate">{task.title}</span>
                                              </div>
                                            </div>
                                          )
                                        }
                                        return null
                                      })}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeCalendarView === "week" && (
                    <>
                      {/* Days of Week - Week View */}
                      <div className="grid grid-cols-7 border-b border-gray-200">
                        {days.map((day) => (
                          <div
                            key={day.number}
                            className={cn(
                              "p-2 text-center border-r border-gray-200 last:border-r-0",
                              day.current && "bg-purple-50",
                            )}
                          >
                            <div className={cn("text-sm md:text-base font-medium", day.current && "text-purple-600")}>
                              {day.name}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Time Slots and Tasks */}
                      <div className="flex-1 overflow-auto">
                        {timeSlots.map((time, index) => (
                          <div key={time} className="grid grid-cols-7 border-b border-gray-200">
                            <div className="p-2 text-center text-xs text-gray-500 border-r border-gray-200">{time}</div>

                            {days.map((day, dayIndex) => (
                              <div
                                key={dayIndex}
                                className={cn(
                                  "p-2 border-r border-gray-200 last:border-r-0 min-h-[60px] cursor-pointer hover:bg-gray-50",
                                  day.current && "bg-purple-50",
                                )}
                                onClick={() => {
                                  // Extract hour from time slot
                                  const hourNum = Number.parseInt(time.split(":")[0])
                                  const hour = hourNum < 10 ? "0" + hourNum : String(hourNum)
                                  const nextHour = hourNum + 1 < 10 ? "0" + (hourNum + 1) : String(hourNum + 1)

                                  // Format the day with leading zero if needed
                                  const dayNum = day.number
                                  const dayStr = dayNum < 10 ? "0" + dayNum : String(dayNum)

                                  // Create a date string in YYYY-MM-DD format
                                  const dateString = "2025-03-" + dayStr

                                  // Open task modal with the selected date and time pre-filled
                                  setSelectedTask({
                                    id: "new-" + Date.now(),
                                    title: "",
                                    project: "",
                                    date: dateString,
                                    startTime: hour + ":00",
                                    endTime: nextHour + ":00",
                                    color: "purple",
                                    completed: false,
                                    priority: "medium",
                                    icon: "",
                                  })
                                  setIsTaskModalOpen(true)
                                }}
                              >
                                {/* Display tasks for this day and time slot */}
                                {tasks.map((task, taskIdx) => {
                                  // Extract day directly from the date string
                                  let taskDay: number | null = null

                                  if (task.date && task.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                    // Extract day directly from the string format YYYY-MM-DD
                                    taskDay = Number.parseInt(task.date.split("-")[2], 10)
                                  } else {
                                    return null
                                  }

                                  const taskHour = Number.parseInt(task.startTime.split(":")[0])

                                  if (taskDay === day.number && taskHour === Number.parseInt(time.split(":")[0])) {
                                    return (
                                      <div
                                        key={`task-${task.id}-${taskIdx}`}
                                        className="mb-1 p-2 rounded-md text-sm cursor-pointer"
                                        style={{ backgroundColor: getColorForTask(task.color) }}
                                        onClick={() => openTaskDetail(task)}
                                      >
                                        <div className="flex items-center">
                                          <div
                                            className="w-2 h-2 rounded-full mr-2"
                                            style={{ backgroundColor: getDarkerColor(task.color) }}
                                          ></div>
                                          <span>{task.title}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          {task.startTime} - {task.endTime}
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                })}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeCalendarView === "day" && (
                    <>
                      {/* Day View Header */}
                      <div className="p-4 text-center border-b border-gray-200">
                        <h3 className="font-medium">Wednesday, March 26, 2025</h3>
                      </div>

                      {/* Day Timeline */}
                      <div className="flex-1 overflow-auto">
                        {Array.from({ length: 12 }, (_, i) => {
                          const hour = i + 7 // Start from 7 AM
                          const hourFormatted = hour % 12 === 0 ? 12 : hour % 12
                          const ampm = hour < 12 ? "AM" : "PM"

                          return (
                            <div key={i} className="flex border-b border-gray-200 last:border-b-0">
                              <div className="w-20 p-2 text-xs text-gray-500 border-r border-gray-200 flex-shrink-0">
                                {hourFormatted}:00 {ampm}
                              </div>
                              <div
                                className="flex-1 p-2 min-h-[80px] cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                  // Format the hour with leading zero if needed
                                  const hourStr = hour < 10 ? "0" + hour : String(hour)
                                  const nextHourStr = hour + 1 < 10 ? "0" + (hour + 1) : String(hour + 1)

                                  // Create a date string for today (day 26)
                                  const dateString = "2025-03-26"

                                  // Open task modal with the selected date and time pre-filled
                                  setSelectedTask({
                                    id: "new-" + Date.now(),
                                    title: "",
                                    project: "",
                                    date: dateString,
                                    startTime: hourStr + ":00",
                                    endTime: nextHourStr + ":00",
                                    color: "purple",
                                    completed: false,
                                    priority: "medium",
                                    icon: "",
                                  })
                                  setIsTaskModalOpen(true)
                                }}
                              >
                                {/* Display tasks for this hour */}
                                {tasks.map((task, idx) => {
                                  // Extract day directly from the date string
                                  let taskDay: number | null = null

                                  if (task.date && task.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                    // Extract day directly from the string format YYYY-MM-DD
                                    taskDay = Number.parseInt(task.date.split("-")[2], 10)
                                  } else {
                                    return null
                                  }

                                  const taskHour = Number.parseInt(task.startTime.split(":")[0])

                                  // Check if task is for today (day 26) and this hour
                                  if (taskDay === 26 && taskHour === hour) {
                                    return (
                                      <div
                                        key={`task-${task.id}-${idx}`}
                                        className="mb-1 p-2 rounded-md text-sm cursor-pointer"
                                        style={{ backgroundColor: getColorForTask(task.color) }}
                                        onClick={() => openTaskDetail(task)}
                                      >
                                        <div className="flex items-center">
                                          <div
                                            className="w-2 h-2 rounded-full mr-2"
                                            style={{ backgroundColor: getDarkerColor(task.color) }}
                                          ></div>
                                          <span>{task.title}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          {task.startTime} - {task.endTime}
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : activeTab === "grid" ? (
              <div className="flex-1 overflow-auto p-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dashboard content */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-2">Quick Stats</h3>
                    <p className="text-gray-500">View your productivity metrics</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-2">Recent Tasks</h3>
                    <p className="text-gray-500">See your latest activities</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-2">Focus Time</h3>
                    <p className="text-gray-500">Track your deep work sessions</p>
                  </div>

                  {/* App Download Card - Added here */}
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow p-6">
                    <div className="text-sm font-semibold mb-1">DOWNLOAD TASKTUNE APP</div>
                    <div className="text-base font-medium mb-4">Your go-to kit for planning and productivity</div>
                    <button className="bg-purple-500 text-white rounded-full px-4 py-2 text-sm hover:bg-purple-600 transition-colors">
                      Get the app
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-6">
                <h2 className="text-2xl font-bold mb-6">Home</h2>
                {/* Home content */}
              </div>
            )}
          </div>
        </div>
        {isTaskModalOpen && (
          <TaskModal
            onClose={() => setIsTaskModalOpen(false)}
            onSave={handleAddTask}
            onDelete={(taskId) => {
              // Remove the task from the tasks array
              setTasks(tasks.filter((t) => t.id !== taskId))
              setIsTaskModalOpen(false)
            }}
            task={selectedTask}
          />
        )}
        {showTaskDetail && selectedTask && (
          <TaskDetailView
            task={selectedTask}
            onClose={closeTaskDetail}
            onUpdate={(updatedTask) => {
              // Update the task in the tasks array
              setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
              setShowTaskDetail(false)
            }}
            onDelete={(taskId) => {
              // Remove the task from the tasks array
              setTasks(tasks.filter((t) => t.id !== taskId))
              setShowTaskDetail(false)
            }}
          />
        )}
        {showGentleNudge && (
          <GentleNudge
            currentTask={currentNudgeTask}
            nextTask={nextNudgeTask}
            energyLevel="medium"
            onDismiss={handleDismissNudge}
            onAccept={handleAcceptNudge}
            onDecline={handleDeclineNudge}
          />
        )}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around py-2">
        <button className="flex flex-col items-center justify-center p-2">
          <Home className="h-5 w-5 text-gray-500" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          className={`flex flex-col items-center justify-center p-2 ${activeTab === "calendar" ? "text-purple-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("calendar")}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Calendar</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <LayoutGrid className="h-5 w-5 text-gray-500" />
          <span className="text-xs mt-1">Grid</span>
        </button>
        <button
          className={`flex flex-col items-center justify-center p-2 ${showSettings ? "text-purple-600" : "text-gray-500"}`}
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </>
  )
}

