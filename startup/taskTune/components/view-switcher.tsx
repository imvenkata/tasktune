"use client"

import type React from "react"

import { Calendar, Columns, LayoutGrid, List, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewOption = "list" | "calendar" | "kanban" | "spatial" | "timeline"

interface ViewSwitcherProps {
  activeView: ViewOption
  onViewChange: (view: ViewOption) => void
  className?: string
}

export default function ViewSwitcher({ activeView, onViewChange, className }: ViewSwitcherProps) {
  const viewOptions: { id: ViewOption; icon: React.ReactNode; label: string }[] = [
    { id: "list", icon: <List className="h-4 w-4" />, label: "List" },
    { id: "timeline", icon: <Clock className="h-4 w-4" />, label: "Timeline" },
    { id: "calendar", icon: <Calendar className="h-4 w-4" />, label: "Calendar" },
    { id: "kanban", icon: <Columns className="h-4 w-4" />, label: "Kanban" },
    { id: "spatial", icon: <LayoutGrid className="h-4 w-4" />, label: "Spatial" },
  ]

  return (
    <div className={cn("flex bg-[#2A2A2A] rounded-lg p-1", className)}>
      {viewOptions.map((option) => (
        <button
          key={option.id}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 px-3 py-1 rounded-md text-sm",
            activeView === option.id ? "bg-[#3A3A3A] text-white" : "text-gray-400 hover:text-gray-300",
          )}
          onClick={() => onViewChange(option.id)}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  )
}

