"use client"

export default function WeeklyCalendar() {
  const days = [
    { day: "MON", date: "18" },
    { day: "TUE", date: "19" },
    { day: "WED", date: "20" },
    { day: "THU", date: "21" },
    { day: "FRI", date: "22" },
  ]

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "01:00", "02:00"]

  const tasks = [
    {
      id: "1",
      day: "MON",
      time: "09:00",
      title: "Design Brief Review",
      description: "Review project goals and objectives",
      status: "done",
      priority: "medium",
    },
    {
      id: "2",
      day: "TUE",
      time: "09:00",
      title: "Typography & Layout Design",
      description: "Help with choose fonts and layout elements for the design",
      status: "done",
      priority: "medium",
    },
    {
      id: "3",
      day: "WED",
      time: "09:00",
      title: "Color Palette Selection",
      description: "Create a harmonious color scheme",
      status: "medium",
      priority: "medium",
    },
    {
      id: "4",
      day: "THU",
      time: "09:00",
      title: "User Interface (UI) Design",
      description: "Create an appealing and visually engaging interface",
      status: "high",
      priority: "high",
    },
    {
      id: "5",
      day: "FRI",
      time: "09:00",
      title: "Conduct User Testing",
      description: "Test with real users to gather feedback",
      status: "low",
      priority: "low",
    },
    {
      id: "6",
      day: "MON",
      time: "11:00",
      title: "Moodboard Creation",
      description: "Define the visual direction",
      status: "done",
      priority: "medium",
    },
    {
      id: "7",
      day: "TUE",
      time: "11:00",
      title: "Sketching & Ideation",
      description: "Brainstorm and explore creative solutions",
      status: "done",
      priority: "medium",
    },
    {
      id: "8",
      day: "WED",
      time: "11:00",
      title: "User Experience (UX) Design",
      description: "Design an intuitive and user-friendly interface",
      status: "high",
      priority: "high",
    },
    {
      id: "9",
      day: "THU",
      time: "11:00",
      title: "Prototype Creation",
      description: "Review a prototype to showcase the design functionality",
      status: "low",
      priority: "low",
    },
    {
      id: "10",
      day: "FRI",
      time: "11:00",
      title: "Client Presentation",
      description: "Present the project and gather feedback from the client",
      status: "high",
      priority: "high",
    },
  ]

  const getTasksForDayAndTime = (day: string, time: string) => {
    return tasks.filter((task) => task.day === day && task.time === time)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-orange-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">Done</span>
      case "high":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-500">High</span>
      case "medium":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-900/30 text-orange-500">Medium</span>
      case "low":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-500">Low</span>
      default:
        return null
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="grid grid-cols-6 border-b border-[#2A2A2A]">
          <div className="p-2 text-center"></div>
          {days.map((day) => (
            <div key={day.day} className="p-2 text-center border-l border-[#2A2A2A]">
              <div className="text-sm text-gray-400">
                {day.day} {day.date}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots and tasks */}
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-6 border-b border-[#2A2A2A]">
            <div className="p-2 text-center text-sm text-gray-400">{time}</div>

            {days.map((day) => {
              const dayTasks = getTasksForDayAndTime(day.day, time)

              return (
                <div key={`${day.day}-${time}`} className="p-2 border-l border-[#2A2A2A] min-h-[100px]">
                  {dayTasks.map((task) => (
                    <div key={task.id} className="p-2 bg-[#222222] rounded-md mb-2">
                      <div className="flex justify-between items-start mb-1">{getStatusBadge(task.status)}</div>
                      <h4 className="font-medium mb-1">{task.title}</h4>
                      <p className="text-xs text-gray-400">{task.description}</p>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

