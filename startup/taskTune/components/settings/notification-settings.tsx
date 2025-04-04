"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function NotificationSettings() {
  // Task notifications
  const [taskNotifications, setTaskNotifications] = useState({
    upcoming: true,
    starting: true,
    reminders: true,
    completed: true,
  })

  // Other notifications
  const [otherNotifications, setOtherNotifications] = useState({
    motivational: false,
    morning: false,
    evening: false,
  })

  const toggleTaskNotification = (key: string, value: boolean) => {
    setTaskNotifications({
      ...taskNotifications,
      [key]: value,
    })
  }

  const toggleOtherNotification = (key: string, value: boolean) => {
    setOtherNotifications({
      ...otherNotifications,
      [key]: value,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Task notifications</h2>
          <p className="text-gray-600 mb-6">Control which notifications you receive about your tasks</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Upcoming tasks</p>
                <p className="text-sm text-gray-500">Get notified about tasks coming up in your schedule</p>
              </div>
              <Switch
                checked={taskNotifications.upcoming}
                onCheckedChange={(checked) => toggleTaskNotification("upcoming", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Starting now</p>
                <p className="text-sm text-gray-500">Get notified when a task is about to start</p>
              </div>
              <Switch
                checked={taskNotifications.starting}
                onCheckedChange={(checked) => toggleTaskNotification("starting", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Custom reminders</p>
                <p className="text-sm text-gray-500">Get notified for any custom reminders you've set</p>
              </div>
              <Switch
                checked={taskNotifications.reminders}
                onCheckedChange={(checked) => toggleTaskNotification("reminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Task completed</p>
                <p className="text-sm text-gray-500">Get notified when you complete a task</p>
              </div>
              <Switch
                checked={taskNotifications.completed}
                onCheckedChange={(checked) => toggleTaskNotification("completed", checked)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Other</h2>
          <p className="text-gray-600 mb-6">Additional notifications to help you stay on track</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Motivational updates</p>
                <p className="text-sm text-gray-500">Receive motivational messages and productivity tips</p>
              </div>
              <Switch
                checked={otherNotifications.motivational}
                onCheckedChange={(checked) => toggleOtherNotification("motivational", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Morning reminder</p>
                <p className="text-sm text-gray-500">Get a summary of your day each morning</p>
              </div>
              <Switch
                checked={otherNotifications.morning}
                onCheckedChange={(checked) => toggleOtherNotification("morning", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Evening reminder</p>
                <p className="text-sm text-gray-500">Get a summary of tomorrow's schedule each evening</p>
              </div>
              <Switch
                checked={otherNotifications.evening}
                onCheckedChange={(checked) => toggleOtherNotification("evening", checked)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

