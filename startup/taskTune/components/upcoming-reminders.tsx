import { Bell, Calendar, Clock } from "lucide-react"

type Reminder = {
  id: number
  title: string
  time: string
  date: string
  type: "appointment" | "task" | "medication" | "other"
}

export default function UpcomingReminders() {
  const reminders: Reminder[] = [
    {
      id: 1,
      title: "Take medication",
      time: "12:30 PM",
      date: "Today",
      type: "medication",
    },
    {
      id: 2,
      title: "Team check-in call",
      time: "2:00 PM",
      date: "Today",
      type: "appointment",
    },
    {
      id: 3,
      title: "Submit expense report",
      time: "5:00 PM",
      date: "Today",
      type: "task",
    },
    {
      id: 4,
      title: "Dentist appointment",
      time: "10:00 AM",
      date: "Tomorrow",
      type: "appointment",
    },
  ]

  const getIconForType = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "task":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="space-y-2">
      {reminders.map((reminder) => (
        <div key={reminder.id} className="p-3 flex items-center bg-white rounded-lg">
          <div className="p-2 rounded-full bg-gray-100 mr-3">{getIconForType(reminder.type)}</div>
          <div className="flex-1">
            <h3 className="font-medium">{reminder.title}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span>{reminder.date}</span>
              <span className="mx-2">•</span>
              <span>{reminder.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

