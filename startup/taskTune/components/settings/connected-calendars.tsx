"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function ConnectedCalendars() {
  // In a real app, this would be fetched from an API
  const connectedCalendars: any[] = []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Connected calendars</h1>
        <p className="text-gray-600 mb-6">Manage third-party accounts and connect your favorite tools to taskTune</p>

        <div className="flex justify-end space-x-4 mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.5 22.5H4.5C3.12 22.5 2 21.38 2 20V6C2 4.62 3.12 3.5 4.5 3.5H19.5C20.88 3.5 22 4.62 22 6V20C22 21.38 20.88 22.5 19.5 22.5ZM4.5 5.5C4.22 5.5 4 5.72 4 6V20C4 20.28 4.22 20.5 4.5 20.5H19.5C19.78 20.5 20 20.28 20 20V6C20 5.72 19.78 5.5 19.5 5.5H4.5Z" />
              <path d="M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
            Add iCloud calendar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" fill="#4285F4" />
              <path d="M13,3.5V9H18.5L13,3.5Z" fill="#A1C2FA" />
            </svg>
            Add Google calendar
          </Button>
        </div>

        <Card className="p-6 border-dashed">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 mb-4">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt="Calendar icon"
                width={64}
                height={64}
                className="opacity-50"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">You have no connected calendars.</h3>
            <p className="text-gray-500 text-center max-w-md">
              Set yourself up for success and import your calendar to have all your tasks one place.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

