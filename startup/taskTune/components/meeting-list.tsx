"use client"

import { cn } from "@/lib/utils"

interface Meeting {
  id: string
  title: string
  time: string
  period: string
  color: string
}

interface MeetingListProps {
  meetings: Meeting[]
}

export default function MeetingList({ meetings }: MeetingListProps) {
  return (
    <div className="space-y-2">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="flex p-3 rounded-lg bg-[#222222] hover:bg-[#2A2A2A]">
          <div className="mr-3 text-center">
            <p className="text-xs text-gray-400">{meeting.period}</p>
            <p className="text-lg font-medium">{meeting.time}</p>
          </div>

          <div className="flex-1">
            <p className="text-sm">{meeting.title}</p>
          </div>

          <div
            className={cn(
              "w-6 h-6 rounded flex items-center justify-center self-center",
              meeting.color === "red" && "bg-red-500",
              meeting.color === "blue" && "bg-blue-500",
              meeting.color === "orange" && "bg-orange-500",
              meeting.color === "green" && "bg-green-500",
              meeting.color === "purple" && "bg-purple-500",
            )}
          >
            <VideoIcon className="h-3 w-3 text-white" />
          </div>
        </div>
      ))}
    </div>
  )
}

function VideoIcon({ className }: { className?: string }) {
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
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  )
}

