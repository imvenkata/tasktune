"use client"

import { useState } from "react"
import { Clock, Plus, BellRing } from "lucide-react"

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDialog, setActiveDialog] = useState<string | null>(null)

  const openDialog = (type: string) => {
    setActiveDialog(type)
    setIsOpen(true)
  }

  return (
    <>
      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        <button
          onClick={() => openDialog("reminder")}
          className="h-12 w-12 rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center"
        >
          <BellRing className="h-5 w-5" />
        </button>

        <button
          onClick={() => openDialog("timer")}
          className="h-12 w-12 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
        >
          <Clock className="h-5 w-5" />
        </button>

        <button
          onClick={() => openDialog("task")}
          className="h-14 w-14 rounded-full shadow-lg bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </>
  )
}

