"use client"

interface ActivityData {
  overall: number
  trend: string
  daily: {
    day: string
    value: number
  }[]
}

interface ActivityChartProps {
  data: ActivityData
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-6">
        <h3 className="text-4xl font-bold">{data.overall}%</h3>
      </div>

      <div className="flex-1 flex items-end justify-between mt-auto">
        {data.daily.map((day) => (
          <div key={day.day} className="flex flex-col items-center">
            <div className="w-8 bg-blue-500 rounded-t-sm" style={{ height: `${day.value}px` }}></div>
            <p className="text-xs mt-2">{day.day}</p>
            <p className="text-xs text-gray-400">{day.value}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

