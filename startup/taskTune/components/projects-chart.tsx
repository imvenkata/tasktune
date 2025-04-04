"use client"

interface ProjectsData {
  total: number
  trend: string
  projects: {
    name: string
    percentage: number
  }[]
}

interface ProjectsChartProps {
  data: ProjectsData
}

export default function ProjectsChart({ data }: ProjectsChartProps) {
  // Generate colors for the chart segments
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]

  return (
    <div className="h-full flex flex-col">
      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2A2A2A" strokeWidth="10" />

          {/* Create the colored segments */}
          {data.projects.map((project, index) => {
            const previousPercentages = data.projects.slice(0, index).reduce((sum, p) => sum + p.percentage, 0)

            const offset = 251.2 * (1 - previousPercentages / 100)
            const dashArray = 251.2 * (project.percentage / 100)

            return (
              <circle
                key={project.name}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="10"
                strokeDasharray={`${dashArray} ${251.2 - dashArray}`}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
              />
            )
          })}

          <text x="50" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">
            {data.total}
          </text>
          <text x="50" y="60" textAnchor="middle" fontSize="10" fill="#9CA3AF">
            projects
          </text>
        </svg>
      </div>

      <div className="space-y-2 mt-auto">
        {data.projects.map((project, index) => (
          <div key={project.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm">{project.name}</span>
            </div>
            <span className="text-sm">{project.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

