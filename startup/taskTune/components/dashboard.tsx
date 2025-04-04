"use client"

import { useState } from "react"
import {
  Bell,
  Calendar,
  LayoutGrid,
  FileText,
  Settings,
  Home,
  Headphones,
  Plus,
  ChevronRight,
  MoreVertical,
} from "lucide-react"
import Image from "next/image"
import TaskList from "@/components/task-list"
import MeetingList from "@/components/meeting-list"
import ActivityChart from "@/components/activity-chart"
import ProjectsChart from "@/components/projects-chart"
import RemindersList from "@/components/reminders-list"
import WeeklyCalendar from "@/components/weekly-calendar"
import FocusTimer from "@/components/focus-timer"
import TaskModal from "@/components/task-modal"
import type { Task } from "@/lib/types"

export default function Dashboard() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [currentFocusTask, setCurrentFocusTask] = useState({
    title: "Color Palette Selection",
    project: "OverOk Games App",
    timeElapsed: "00:57:56",
    timeLimit: "06:00:00",
  })

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Color Palette Selection",
      project: "OverOk Games App",
      date: "2025-03-26",
      startTime: "09:00",
      endTime: "10:00",
      color: "orange",
      completed: false,
      priority: "medium",
    },
    {
      id: "2",
      title: "Creating Landing page for website",
      project: "Guitar Tuner",
      date: "2025-03-26",
      startTime: "10:30",
      endTime: "12:00",
      color: "blue",
      completed: false,
      priority: "medium",
    },
    {
      id: "3",
      title: "Competitive & functional analysis",
      project: "Doctor+",
      date: "2025-03-26",
      startTime: "13:00",
      endTime: "15:00",
      color: "blue",
      completed: false,
      priority: "high",
    },
  ])

  const meetings = [
    {
      id: "1",
      title: "Present the project and gather feedback",
      time: "10:00",
      period: "AM",
      color: "red",
    },
    {
      id: "2",
      title: "Meeting with UX team",
      time: "01:00",
      period: "PM",
      color: "blue",
    },
    {
      id: "3",
      title: "Onboarding of the project",
      time: "03:00",
      period: "PM",
      color: "orange",
    },
  ]

  const reminders = [
    {
      id: "1",
      time: "09:30",
      period: "AM",
      title: "Check test results",
      priority: "low",
    },
    {
      id: "2",
      time: "10:00",
      period: "AM",
      title: "Client Presentation",
      priority: "high",
    },
    {
      id: "3",
      time: "04:15",
      period: "PM",
      title: "Add new subtask to Doctor+ analysis",
      priority: "high",
    },
  ]

  const activityData = {
    overall: 83,
    trend: "+12%",
    daily: [
      { day: "Mon", value: 92 },
      { day: "Tue", value: 41 },
      { day: "Wed", value: 78 },
      { day: "Thu", value: 0 },
      { day: "Fri", value: 0 },
    ],
  }

  const projectsData = {
    total: 4,
    trend: "-5%",
    projects: [
      { name: "OverOk", percentage: 44 },
      { name: "MagnumShop", percentage: 24 },
      { name: "Doctor+", percentage: 18 },
      { name: "AfterMidnight", percentage: 14 },
    ],
  }

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task])
    setIsTaskModalOpen(false)
  }

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Left Sidebar */}
      <div className="w-16 bg-[#121212] border-r border-[#2A2A2A] flex flex-col items-center py-4">
        <div className="mb-8">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded">
            <Image
              src="/placeholder.svg?height=24&width=24"
              alt="Logo"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <button className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center">
            <Home className="h-5 w-5" />
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-[#2A2A2A] flex items-center justify-center">
            <LayoutGrid className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-[#2A2A2A] flex items-center justify-center">
            <FileText className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-[#2A2A2A] flex items-center justify-center">
            <Calendar className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-[#2A2A2A] flex items-center justify-center relative">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </nav>

        <div className="mt-auto flex flex-col items-center space-y-6 mb-4">
          <button className="w-10 h-10 rounded-lg hover:bg-[#2A2A2A] flex items-center justify-center">
            <Headphones className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-[#2A2A2A] flex items-center justify-center">
            <Settings className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 border-b border-[#2A2A2A] flex items-center px-6 justify-between">
          <h1 className="text-2xl font-medium">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-[#2A2A2A] rounded-full p-1 flex items-center">
              <button className="w-6 h-6 rounded-full flex items-center justify-center">
                <Moon className="h-4 w-4" />
              </button>
              <button className="w-6 h-6 rounded-full bg-[#3A3A3A] flex items-center justify-center">
                <Sun className="h-4 w-4" />
              </button>
            </div>
            <button className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <button className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Profile"
                width={32}
                height={32}
                className="object-cover"
              />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 grid grid-cols-12 gap-6">
          {/* Focus Timer */}
          <div className="col-span-3 bg-[#1A1A1A] rounded-xl p-4">
            <FocusTimer
              title={currentFocusTask.title}
              project={currentFocusTask.project}
              timeElapsed={currentFocusTask.timeElapsed}
              timeLimit={currentFocusTask.timeLimit}
            />
          </div>

          {/* Today's Tasks */}
          <div className="col-span-5 bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Today's tasks <span className="text-sm text-gray-400 ml-2">{tasks.length}</span>
              </h2>
              <button className="text-blue-500 hover:text-blue-400 flex items-center text-sm">
                Manage <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <TaskList tasks={tasks} />
          </div>

          {/* Today's Meetings */}
          <div className="col-span-4 bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Today's meetings <span className="text-sm text-gray-400 ml-2">{meetings.length}</span>
              </h2>
              <button className="text-blue-500 hover:text-blue-400 flex items-center text-sm">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <MeetingList meetings={meetings} />
            <button className="mt-4 w-full py-2 rounded-lg border border-[#2A2A2A] text-sm flex items-center justify-center text-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Schedule meeting
            </button>
          </div>

          {/* Activity Chart */}
          <div className="col-span-4 bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Activity <span className="text-sm text-green-500 ml-2">+12%</span>
              </h2>
              <button>
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <ActivityChart data={activityData} />
          </div>

          {/* Projects Chart */}
          <div className="col-span-4 bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Projects worked <span className="text-sm text-red-500 ml-2">-5%</span>
              </h2>
              <button>
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <ProjectsChart data={projectsData} />
          </div>

          {/* Reminders */}
          <div className="col-span-4 bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Reminders</h2>
              <button className="text-blue-500 hover:text-blue-400 flex items-center text-sm">
                Manage <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <RemindersList reminders={reminders} />
            <button className="mt-4 w-full py-2 rounded-lg border border-[#2A2A2A] text-sm flex items-center justify-center text-blue-500">
              Add reminder
            </button>
          </div>

          {/* Projects Weekly Calendar */}
          <div className="col-span-12 bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Projects</h2>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-lg bg-[#2A2A2A] text-sm">
                  <Filter className="h-4 w-4 inline mr-1" />
                  Filter
                </button>
              </div>
            </div>
            <WeeklyCalendar />
          </div>
        </div>
      </div>

      {isTaskModalOpen && <TaskModal onClose={() => setIsTaskModalOpen(false)} onSave={handleAddTask} />}
    </div>
  )
}

function Moon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function Sun({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function Filter({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

