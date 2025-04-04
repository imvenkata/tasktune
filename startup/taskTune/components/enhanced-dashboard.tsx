"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Home, Settings, User, Sparkles, BrainCircuit } from "lucide-react"
import TaskTimeline from "@/components/task-timeline"
import EnergyTracker from "@/components/energy-tracker"
import TodaysFocus from "@/components/todays-focus"
import UpcomingReminders from "@/components/upcoming-reminders"
import FocusPatterns from "@/components/focus-patterns"
import QuickActions from "@/components/quick-actions"
import UserProfile from "@/components/user-profile"
import { useAuth } from "@/components/auth/auth-wrapper"
import NextImage from "next/image"
import ViewSwitcher from "@/components/view-switcher"
import TaskCalendarView from "@/components/task-calendar-view"
import TaskKanbanView from "@/components/task-kanban-view"
import TaskSpatialView from "@/components/task-spatial-view"
import VisualTimer from "@/components/visual-timer"
import AiPlanner from "@/components/ai-planner"
import AiSmartScheduler from "@/components/ai-smart-scheduler"

type ViewOption = "list" | "calendar" | "kanban" | "spatial" | "timeline"

export default function EnhancedDashboard() {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState<ViewOption>("list")
  const [showAiPlanner, setShowAiPlanner] = useState(false)
  const [showSmartScheduler, setShowSmartScheduler] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-[#f5f0ff] dark:bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#e2d8f3] flex items-center justify-center">
            <NextImage
              src="/placeholder.svg?height=24&width=24"
              width={24}
              height={24}
              alt="Aashu logo"
              className="rounded-full"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">aashu</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Hi, {user?.name}</span>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {/* AI Features Controls */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Today's Plan</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowAiPlanner(!showAiPlanner)
                    setShowSmartScheduler(false)
                  }}
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  {showAiPlanner ? "Hide AI Planner" : "AI Planner"}
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowSmartScheduler(!showSmartScheduler)
                    setShowAiPlanner(false)
                  }}
                >
                  <BrainCircuit className="h-4 w-4 text-purple-500" />
                  {showSmartScheduler ? "Hide Smart Scheduler" : "Smart Scheduler"}
                </Button>
              </div>
            </div>

            {/* AI Planner (conditionally shown) */}
            {showAiPlanner && <AiPlanner />}

            {/* Smart Scheduler (conditionally shown) */}
            {showSmartScheduler && <AiSmartScheduler />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Energy Level Tracker */}
              <EnergyTracker />

              {/* Today's Focus */}
              <TodaysFocus />
            </div>

            {/* View Switcher */}
            <div className="mt-6 mb-4">
              <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
            </div>

            {/* Task View Based on Selected View */}
            <Card className="p-4 bg-white dark:bg-gray-900">
              <h2 className="text-lg font-medium mb-4">
                {activeView === "list" && "Today's Tasks"}
                {activeView === "timeline" && "Today's Timeline"}
                {activeView === "calendar" && "Calendar View"}
                {activeView === "kanban" && "Kanban Board"}
                {activeView === "spatial" && "Spatial Organization"}
              </h2>

              {activeView === "list" && <TaskTimeline />}
              {activeView === "timeline" && <TaskTimeline />}
              {activeView === "calendar" && <TaskCalendarView />}
              {activeView === "kanban" && <TaskKanbanView />}
              {activeView === "spatial" && <TaskSpatialView />}
            </Card>

            {/* Current Task Timer */}
            <Card className="p-4 bg-white dark:bg-gray-900">
              <h2 className="text-lg font-medium mb-2">Visual Timer</h2>
              <VisualTimer />
            </Card>

            {/* Upcoming Reminders */}
            <h2 className="text-lg font-medium mt-6 mb-2">Upcoming Reminders</h2>
            <UpcomingReminders />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card className="p-4 bg-white dark:bg-gray-900">
              <h2 className="text-lg font-medium mb-4">Calendar Planning</h2>
              <TaskCalendarView />
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card className="p-4 bg-white dark:bg-gray-900">
              <h2 className="text-lg font-medium mb-4">Focus Patterns</h2>
              <FocusPatterns />
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </main>

      {/* Quick Actions */}
      <QuickActions />

      {/* Bottom Navigation */}
      <nav className="grid grid-cols-4 bg-white dark:bg-gray-900 p-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <Button variant="ghost" className="flex flex-col items-center justify-center rounded-lg py-2">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center justify-center rounded-lg py-2">
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Calendar</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center justify-center rounded-lg py-2">
          <Clock className="h-5 w-5" />
          <span className="text-xs mt-1">Timers</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center justify-center rounded-lg py-2">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </nav>
    </div>
  )
}

