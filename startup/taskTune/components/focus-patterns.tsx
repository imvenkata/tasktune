"use client"

export default function FocusPatterns() {
  // Mock data for focus patterns throughout the day
  const focusData = [
    { time: "6AM", energy: 40, focus: 30 },
    { time: "8AM", energy: 65, focus: 55 },
    { time: "10AM", energy: 85, focus: 90 },
    { time: "12PM", energy: 60, focus: 50 },
    { time: "2PM", energy: 45, focus: 40 },
    { time: "4PM", energy: 70, focus: 75 },
    { time: "6PM", energy: 55, focus: 60 },
    { time: "8PM", energy: 30, focus: 25 },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        Your focus and energy patterns help identify optimal times for different types of tasks.
      </p>

      <div className="h-64 w-full p-4 rounded-lg bg-[#222222]">
        <div className="h-full w-full flex items-end justify-between">
          {focusData.map((data, index) => (
            <div key={index} className="flex flex-col items-center h-full">
              <div className="flex flex-col h-[80%] space-y-1 justify-end">
                <div className="w-6 bg-purple-500 rounded-t-sm" style={{ height: `${data.focus}%` }}></div>
                <div className="w-6 bg-blue-500 rounded-t-sm" style={{ height: `${data.energy}%` }}></div>
              </div>
              <div className="text-xs mt-1 text-gray-400">{data.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 bg-[#222222] rounded-lg">
          <h3 className="text-sm font-medium text-purple-400">Peak Focus Time</h3>
          <p className="text-lg font-bold text-white">10:00 AM - 11:30 AM</p>
          <p className="text-xs text-gray-400 mt-1">Best for deep work and complex tasks</p>
        </div>

        <div className="p-3 bg-[#222222] rounded-lg">
          <h3 className="text-sm font-medium text-blue-400">Secondary Peak</h3>
          <p className="text-lg font-bold text-white">4:00 PM - 5:30 PM</p>
          <p className="text-xs text-gray-400 mt-1">Good for creative work and planning</p>
        </div>
      </div>
    </div>
  )
}

