"use client"

import { useState, useEffect, useCallback } from "react"
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
  Loader2,
  AlertCircle,
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
import { useAuth } from "@/components/auth/auth-wrapper"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import TaskCalendarView from "./task-calendar-view"
import { useTaskStore } from "@/lib/task-store"

// Update the renderIcon function in the tasktune-app component
const renderIcon = (iconId: string | null | undefined, size = "h-6 w-6") => {
  if (!iconId) return null
  const IconComponent = ICON_COLLECTION[iconId as keyof typeof ICON_COLLECTION]
  return IconComponent ? <IconComponent className={size} /> : null
}

export default function TaskTuneApp() {
  const { token, fetchWithAuth, isLoading: isAuthLoading, user } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [tasksError, setTasksError] = useState<string | null>(null)
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
  const [showGentleNudge, setShowGentleNudge] = useState(false)
  const [currentNudgeTask, setCurrentNudgeTask] = useState<Task | null>(null)
  const [nextNudgeTask, setNextNudgeTask] = useState<Task | null>(null)

  const [activeCalendarView, setActiveCalendarView] = useState<"month" | "week" | "day">("month")
  const [activeTab, setActiveTab] = useState<"home" | "calendar" | "grid">("calendar")

  const addTaskToStore = useTaskStore((state) => state.addTask)

  // Redirect to login if auth is done loading and there's no user
  useEffect(() => {
    if (!isAuthLoading && !user) {
      console.log("[TaskTuneApp] No user found after auth load, redirecting to /auth");
      router.push('/auth');
    }
  }, [isAuthLoading, user, router]);

  // Fetch tasks from the backend
  const fetchTasks = useCallback(async () => {
    // This check might be redundant now due to the redirect effect, but safe to keep
    if (!token || isAuthLoading) return

    setIsLoadingTasks(true)
    setTasksError(null)
    console.log("[TaskTuneApp] Fetching tasks...") // Added component prefix
    try {
      const response = await fetchWithAuth("/tasks")
      if (!response.ok) {
         let errorDetail = "Failed to fetch tasks.";
         try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
         } catch(e) {}
         throw new Error(errorDetail);
      }
      const fetchedTasks: Task[] = await response.json()
      console.log("[TaskTuneApp] Fetched tasks:", fetchedTasks)
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("[TaskTuneApp] Error fetching tasks:", error)
      setTasksError(error instanceof Error ? error.message : "An unknown error occurred while fetching tasks.")
    } finally {
      console.log("[TaskTuneApp] Task fetching finished."); // Added log
      setIsLoadingTasks(false)
    }
  }, [token, fetchWithAuth, isAuthLoading])

  // Fetch tasks when the component mounts and the user is authenticated
  useEffect(() => {
    console.log("[TaskTuneApp] Task fetching useEffect triggered - token:", !!token, "isAuthLoading:", isAuthLoading); // Added log
    if (token && !isAuthLoading) {
      fetchTasks()
    } else if (!isAuthLoading) { // Handle the case where auth finished but there's no token
       console.log("[TaskTuneApp] No token or auth loading, setting isLoadingTasks to false."); // Added log
       setIsLoadingTasks(false); // Stop task loading indicator if not fetching
    }
    // If isAuthLoading is true, we wait for the auth state to resolve.
  }, [token, isAuthLoading, fetchTasks])

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

  // Rename handleAddTask to handleSaveNewTask and adjust signature
  const handleSaveNewTask = async (newTaskFromModal: Task) => {
    if (!token) {
      setTasksError("You must be logged in to add tasks");
      return;
    }

    const { id, completed, subTasks, ...payload } = newTaskFromModal;

    console.log("[TaskTuneApp] Attempting to save new task via API:", payload);
    try {
      setIsLoadingTasks(true);
      
      const response = await fetchWithAuth('/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to add task (${response.status})`);
      }

      const savedTask = await response.json();
      console.log("[TaskTuneApp] Task saved successfully:", savedTask);
      
      // Add task to local state
      if (savedTask) {
        addTaskToStore(savedTask);
        
        // Refresh tasks to ensure consistency with server
        fetchTasks();
      }
      
      setIsLoadingTasks(false);
      return savedTask;
    } catch (error) {
      console.error("[TaskTuneApp] Error saving task:", error);
      setTasksError(error instanceof Error ? error.message : "An unknown error occurred while saving the task");
      setIsLoadingTasks(false);
      throw error; // Re-throw to allow the calling component to handle it
    }
  }

  // Update handleUpdateTask function to match expected prop signature
  const handleUpdateTask = async (updatedTask: Task) => {
    if (!token || !updatedTask || !updatedTask.id) return;
    const taskId = updatedTask.id;
    // Extract only the fields allowed by TaskUpdate schema for the PUT request
    // Assuming TaskUpdate schema includes title, notes, date, startTime, endTime, completed, priority, category, icon
    // Removed subtasks from destructuring as it's likely not part of Task type used here
    const { id, ...updatePayload } = updatedTask;

    console.log(`Attempting to update task ${taskId} via API:`, updatePayload)
    try {
      const response = await fetchWithAuth(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload), // Send only the updatable fields
      });
      if (!response.ok) {
        let errorDetail = "Failed to update task.";
        try {
           const errorData = await response.json();
           errorDetail = errorData.detail || errorDetail;
        } catch(e) {}
        throw new Error(errorDetail);
      }
      const updatedTaskFromServer: Task = await response.json();
      console.log("Task updated successfully:", updatedTaskFromServer);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? updatedTaskFromServer : task
        )
      );
      closeTaskDetail(); // Close detail view after update
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      alert(`Error updating task: ${error instanceof Error ? error.message : "Unknown error"}`) // Simple alert for now
    }
  };

  // Corrected handleDeleteTask function with proper try...catch
  const handleDeleteTask = async (taskId: string | number) => {
     if (!token) return;
     console.log(`Attempting to delete task ${taskId} via API`)

     // Optional: Add confirmation dialog here
     // if (!confirm('Are you sure you want to delete this task?')) {
     //   return;
     // }

     try { // Restore the try block
       const response = await fetchWithAuth(`/tasks/${taskId}`, {
         method: 'DELETE',
       });
       if (!response.ok) {
          let errorDetail = "Failed to delete task.";
          // Handle potential non-JSON response for successful delete (status 204 No Content)
          if (response.status !== 204) { 
             try {
                 const errorData = await response.json();
                 errorDetail = errorData.detail || errorDetail;
             } catch(e) {
                errorDetail = `Server responded with status ${response.status}`; 
             }
          }
         throw new Error(errorDetail);
       }
       console.log("Task deleted successfully:", taskId);
       setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
       closeTaskDetail(); // Close detail view after deleting the task
     } catch (error) { // Correctly placed catch block
       console.error(`Error deleting task ${taskId}:`, error);
       alert(`Error deleting task: ${error instanceof Error ? error.message : "Unknown error"}`) // Simple alert for now
     }
   };

  // Add a function to handle the gentle nudge visibility
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
    setSelectedTask(undefined)
    setShowTaskDetail(false)
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

  // Update Loading Check: Only show loader while auth OR task fetching is truly active
  // AND if a user is potentially going to be loaded (or tasks fetched)
  if (isAuthLoading) {
    // Show loader if auth is loading (simplified condition)
    console.log("[TaskTuneApp] Rendering Loader - isAuthLoading:", isAuthLoading, "isLoadingTasks:", isLoadingTasks, "user:", !!user); // Added log
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <span className="ml-4 text-xl">Loading...</span> {/* Generic loading message */}
      </div>
    );
  }

  // If auth is done loading and there's no user, render nothing and redirect
  if (!user) {
    console.log("[TaskTuneApp] No user found, redirecting to /auth"); 
    router.push('/auth');
    return null; // Don't render anything while redirecting
  }

  // Show error state if tasks failed to load (only if a user exists)
  if (tasksError && user) {
    console.log("[TaskTuneApp] Rendering Task Error State"); // Added log
    return (
       <div className="flex items-center justify-center min-h-screen p-4">
         <Alert variant="destructive" className="max-w-md">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Error Loading Tasks</AlertTitle>
           <AlertDescription>
             {tasksError}
             <Button onClick={fetchTasks} variant="outline" size="sm" className="ml-4">
               Retry
             </Button>
           </AlertDescription>
         </Alert>
       </div>
    );
  }

  // Render the main application UI only if loading is done and user exists
  console.log("[TaskTuneApp] Rendering main app UI");
  return (
    <>
      <div className="flex h-screen bg-background text-foreground">
        {/* Left Icon Sidebar - Refined styles */}
        <div className="w-16 bg-card border-r border-border flex flex-col items-center py-6"> {/* Increased py, use card bg */}
          <div className="mb-10"> {/* Increased mb */}
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"> {/* Use primary subtle bg, rounded-lg */}
              <Image
                src="/placeholder.svg?height=24&width=24" // Placeholder, replace if actual logo exists
                alt="Logo"
                width={24}
                height={24}
                className="object-cover" // Removed rounded-full if logo isn't circular
              />
            </div>
          </div>

          <nav className="flex flex-col items-center space-y-4 flex-1"> {/* Reduced space-y */}
            <button
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150",
                activeTab === "home" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              onClick={() => setActiveTab("home")}
              title="Home" // Added title tooltip
            >
              <Home className="h-5 w-5" />
            </button>
            <button
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150",
                activeTab === "calendar" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              onClick={() => setActiveTab("calendar")}
               title="Calendar" // Added title tooltip
            >
              <Calendar className="h-5 w-5" />
            </button>
            {/* Removed tooltip div wrapper, added title attribute */}
            <button
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150",
                 activeTab === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
               )}
              onClick={() => setActiveTab("grid")}
              title="Grid View & Integrations" // Added title tooltip
            >
              <LayoutGrid className="h-5 w-5" />
            </button>

          </nav>

          <div className="mt-auto">
            <button
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150",
                 showSettings ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
               )}
              onClick={() => setShowSettings(true)}
               title="Settings" // Added title tooltip
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Left Side Panel - Refined styles */}
        <div className="hidden md:flex w-72 bg-card border-r border-border flex-col overflow-y-auto"> {/* Use card bg */}
          {/* Quick Timer - Refined */}
          <div className="p-5 border-b border-border"> {/* Increased padding */}
            <div className="flex items-center text-xs font-medium text-muted-foreground mb-3"> {/* Adjusted spacing, font weight */}
              <Clock className="h-4 w-4 mr-1.5" /> {/* Adjusted margin */}
              QUICK TIMER
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-secondary rounded-lg px-5 py-2"> {/* Use secondary, slightly more padding, rounded-lg */}
                <span className="text-2xl font-medium text-foreground">{formatTimer()}</span>
              </div>
              <button
                className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/10 text-foreground hover:text-primary flex items-center justify-center transition-colors" // Use secondary, add hover, rounded-lg
                onClick={toggleTimer}
                title={isTimerRunning ? "Pause Timer" : "Start Timer"} // Added title
              >
                <Play className={cn("h-5 w-5", isTimerRunning && "fill-current")} /> {/* Fill icon when running */}
              </button>
            </div>
          </div>

          {/* Progress Tracking - Refined */}
          <div className="border-b border-border">
            <div
              className="flex items-center justify-between p-5 cursor-pointer group" // Increased padding
              onClick={() => toggleSection("progress")}
            >
              <div className="flex items-center text-xs font-medium text-muted-foreground"> {/* Adjusted font weight */}
                <BarChart2 className="h-4 w-4 mr-1.5" /> {/* Adjusted margin */}
                PROGRESS TRACKING
              </div>
              <button className="h-6 w-6 rounded-full group-hover:bg-secondary flex items-center justify-center transition-colors"> {/* Use secondary on hover */}
                <ChevronUpIcon
                  className={cn(
                     "h-4 w-4 text-muted-foreground transition-transform duration-200",
                     expandedSection === "progress" ? "" : "transform rotate-180"
                   )} // Smoother transition
                />
              </button>
            </div>

            {expandedSection === "progress" && (
              <div className="px-5 pb-5 space-y-4"> {/* Increased padding, added space-y */}
                <div> {/* Wrap in div for spacing */}
                   <h3 className="text-sm font-medium mb-2 text-foreground">Task Completion</h3> {/* Adjusted size, color */}

                   <div className="flex justify-between text-xs text-muted-foreground mb-1">
                     <span>{calculateCompletionPercentage()}%</span>
                     <span>
                       {tasks.filter((task) => task.completed).length}/{tasks.length} Tasks
                     </span>
                   </div>
                   {/* Progress bar */}
                   <div className="w-full bg-secondary rounded-full h-2"> {/* Adjusted height, color */}
                     <div
                       className="bg-primary h-2 rounded-full" // Use primary color
                       style={{ width: `${calculateCompletionPercentage()}%` }}
                     ></div>
                   </div>
                </div>

                {/* Task completion by priority - Refined */}
                <div> {/* Wrap in div for spacing */}
                  <h4 className="text-xs font-medium mb-2 text-muted-foreground">BY PRIORITY</h4> {/* Use muted-foreground */}
                  <div className="space-y-1.5"> {/* Adjusted spacing */}
                    <div className="flex items-center text-xs text-foreground"> {/* Use foreground */}
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="flex-1">High</span>
                      <span className="text-muted-foreground">0/0</span>
                    </div>
                    <div className="flex items-center text-xs text-foreground"> {/* Use foreground */}
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="flex-1">Medium</span>
                      <span className="text-muted-foreground">0/4</span>
                    </div>
                    <div className="flex items-center text-xs text-foreground"> {/* Use foreground */}
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="flex-1">Low</span>
                      <span className="text-muted-foreground">0/0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Todo Lists - Refined */}
          <div className="border-b border-border">
            <div
              className="flex items-center justify-between p-5 cursor-pointer group" // Increased padding
              onClick={() => toggleSection("todoLists")}
            >
              <div className="flex items-center text-xs font-medium text-muted-foreground"> {/* Adjusted font weight */}
                <FileText className="h-4 w-4 mr-1.5" /> {/* Adjusted margin */}
                TODO LISTS
              </div>
              <button className="h-6 w-6 rounded-full group-hover:bg-secondary flex items-center justify-center transition-colors"> {/* Use secondary on hover */}
                 <ChevronUpIcon
                   className={cn(
                     "h-4 w-4 text-muted-foreground transition-transform duration-200",
                     expandedSection === "todoLists" ? "" : "transform rotate-180"
                   )} // Smoother transition
                 />
              </button>
            </div>

            {expandedSection === "todoLists" && (
              <div className="px-5 pb-5 space-y-3"> {/* Increased padding, adjusted spacing */}
                {/* Search box - Refined */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search lists..."
                    className="w-full pl-3 pr-8 py-1.5 border border-border rounded-md text-sm bg-secondary focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" // Refined styles, use theme colors
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                   {/* Add search icon inside input if desired */}
                </div>

                {/* Add list button or input - Refined */}
                {showListInput ? (
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="New list name..."
                      className="flex-1 px-3 py-1.5 border border-border rounded-l-md text-sm bg-secondary focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" // Refined styles
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddList(); }}
                      autoFocus
                    />
                    <button
                      className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-r-md text-sm font-medium transition-colors" // Refined styles
                      onClick={handleAddList}
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md transition-colors text-sm" // Refined styles
                    onClick={() => setShowListInput(true)}
                  >
                    <span>Create new list</span>
                    <Plus className="h-4 w-4" />
                  </button>
                )}

                {/* List of todo lists - Refined */}
                <div className="space-y-1.5"> {/* Adjusted spacing */}
                  {todoLists
                    .filter((list) => list.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((list) => (
                      <div
                        key={list.id}
                        className="p-2 rounded-md bg-secondary border border-transparent hover:border-border cursor-pointer flex items-center justify-between transition-colors" // Refined styles
                        onClick={() => { /* Keep existing logic */ }}
                      >
                        <span className="text-sm text-foreground">{list.title}</span>
                        {/* Keep icon or replace if needed */}
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                </div>

                {/* Empty State - Refined */}
                {todoLists.length === 0 && !showListInput && (
                  <div className="text-center text-sm text-muted-foreground pt-4">
                    <p>No todo lists yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Add more sections here if needed, following the same refined style */}
        </div>

        {/* Main Content - Refined */}
        <div className="flex-1 flex flex-col overflow-hidden"> {/* Added flex flex-col */}
          {/* Header - Minimal, clean */}
          <header className="h-16 border-b border-border flex items-center px-4 md:px-6 justify-between flex-shrink-0"> {/* Use theme border, adjusted padding */}
              {/* Left side: Can add breadcrumbs or view title later */}
              <div>
                 {/* Example: <span className="text-lg font-semibold">Calendar</span> */}
              </div>

              {/* Right side: Actions */}
              <div className="flex items-center space-x-2 md:space-x-3">
                 {/* Search Button (optional) */}
                 {/* <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                     <Search className="h-5 w-5" />
                 </button> */}

                 {/* Theme Toggle */}
                 <button
                   className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                   title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} // Added title
                 >
                   {theme === "dark" ? (
                     <Sun className="h-5 w-5" /> // Slightly larger icons
                   ) : (
                     <Moon className="h-5 w-5" />
                   )}
                 </button>

                 {/* Add Task Button */}
                 <button
                   className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors" // Adjusted padding/size
                   onClick={() => setIsTaskModalOpen(true)}
                 >
                   <Plus className="h-4 w-4 mr-1 -ml-0.5" /> {/* Adjusted icon size/margin */}
                   Add Task
                 </button>
              </div>
          </header>

          {/* Main scrollable area */}
          <div className="flex-1 overflow-y-auto"> {/* Make this div scrollable */}
            {/* Content Area Padding */}
            <div className="p-4 md:p-6"> {/* Moved padding here */}
              {/* Calendar View - Render TaskCalendarView here */}
              {activeTab === "calendar" && (
                <TaskCalendarView /> // <<< Render the component directly
              )}

              {/* Grid View Placeholder */}
              {activeTab === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dashboard content - Refined Card Style */}
                  <div className="bg-card rounded-lg shadow p-6 border border-border"> {/* Use card, add border */}
                    <h3 className="font-medium mb-2 text-foreground">Quick Stats</h3>
                    <p className="text-sm text-muted-foreground">View your productivity metrics</p>
                  </div>
                  <div className="bg-card rounded-lg shadow p-6 border border-border">
                    <h3 className="font-medium mb-2 text-foreground">Recent Tasks</h3>
                    <p className="text-sm text-muted-foreground">See your latest activities</p>
                  </div>
                  <div className="bg-card rounded-lg shadow p-6 border border-border">
                    <h3 className="font-medium mb-2 text-foreground">Focus Time</h3>
                    <p className="text-sm text-muted-foreground">Track your deep work sessions</p>
                  </div>
                  <div className="bg-gradient-to-br from-primary/10 to-secondary rounded-lg shadow p-6 border border-border"> {/* Adjusted gradient */}
                    <div className="text-sm font-semibold mb-1 text-primary">DOWNLOAD TASKTUNE APP</div> {/* Use primary text */}
                    <div className="text-base font-medium mb-4 text-foreground">Your go-to kit for planning and productivity</div>
                    <button className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-sm hover:bg-primary/90 transition-colors"> {/* Adjusted size */}
                      Get the app
                    </button>
                  </div>
                </div>
              )}

              {/* Home View Placeholder */}
              {activeTab === "home" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Home</h2>
                  {/* Home content */}
                  <p className="text-muted-foreground">Welcome to your dashboard.</p>
                </div>
              )}
            </div> {/* End Content Area Padding */}
          </div> {/* End Main scrollable area */}
        </div>

        {/* Modals & Detail Views (Keep existing logic) */}
        {isTaskModalOpen && (
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onSave={handleSaveNewTask}
            task={selectedTask}
          />
        )}
        {showTaskDetail && selectedTask && (
          <TaskDetailView
            task={selectedTask}
            onClose={closeTaskDetail}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            fetchWithAuth={fetchWithAuth}
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

      {/* Mobile Bottom Nav - Refined */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-1.5 shadow-up"> {/* Use card, add subtle shadow */}
        <button
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md w-16 transition-colors", // Fixed width, rounded
            activeTab === "home" ? "text-primary" : "text-muted-foreground hover:bg-secondary"
          )}
           onClick={() => setActiveTab("home")}
        >
          <Home className="h-5 w-5 mb-0.5" /> {/* Adjusted spacing */}
          <span className="text-xs">Home</span>
        </button>
        <button
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md w-16 transition-colors",
            activeTab === "calendar" ? "text-primary" : "text-muted-foreground hover:bg-secondary"
          )}
          onClick={() => setActiveTab("calendar")}
        >
          <Calendar className="h-5 w-5 mb-0.5" />
          <span className="text-xs">Calendar</span>
        </button>
        <button
           className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md w-16 transition-colors",
            activeTab === "grid" ? "text-primary" : "text-muted-foreground hover:bg-secondary"
          )}
          onClick={() => setActiveTab("grid")}
        >
          <LayoutGrid className="h-5 w-5 mb-0.5" />
          <span className="text-xs">Grid</span>
        </button>
        <button
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md w-16 transition-colors",
            showSettings ? "text-primary" : "text-muted-foreground hover:bg-secondary"
          )}
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-5 w-5 mb-0.5" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </>
  )
}

