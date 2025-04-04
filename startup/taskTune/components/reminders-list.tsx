"use client"

import { cn } from "@/lib/utils"

interface Reminder {
  id: string
  time: string
  period: string
  title: string
  priority: string
}

interface RemindersListProps {
  reminders: Reminder[]
}

export default function RemindersList({ reminders }: RemindersListProps) {
  return (
    <div className="space-y-3">
      {reminders.map((reminder) => (
        <div key={reminder.id} className="p-3 rounded-lg bg-[#222222] hover:bg-[#2A2A2A]">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-medium">
              {reminder.time} <span className="text-sm text-gray-400">{reminder.period}</span>
            </h3>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                reminder.priority === "high" && "bg-red-500",
                reminder.priority === "medium" && "bg-orange-500",
                reminder.priority === "low" && "bg-green-500",
              )}
            ></div>
          </div>
          <p className="text-sm">{reminder.title}</p>
        </div>
      ))}
    </div>
  )
}

