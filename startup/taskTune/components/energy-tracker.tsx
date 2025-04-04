"use client"

import { useState } from "react"
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EnergyTracker() {
  const [energyLevel, setEnergyLevel] = useState(70)

  const getEnergyIcon = () => {
    if (energyLevel < 25) return <BatteryLow className="h-5 w-5 text-red-500" />
    if (energyLevel < 50) return <Battery className="h-5 w-5 text-orange-500" />
    if (energyLevel < 75) return <BatteryMedium className="h-5 w-5 text-yellow-500" />
    if (energyLevel < 90) return <BatteryCharging className="h-5 w-5 text-green-500" />
    return <BatteryFull className="h-5 w-5 text-green-500" />
  }

  const getEnergyText = () => {
    if (energyLevel < 25) return "Low energy"
    if (energyLevel < 50) return "Moderate energy"
    if (energyLevel < 75) return "Good energy"
    if (energyLevel < 90) return "High energy"
    return "Peak energy"
  }

  const getEnergyColor = () => {
    if (energyLevel < 25) return "text-red-500"
    if (energyLevel < 50) return "text-orange-500"
    if (energyLevel < 75) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">Current Energy Level</h2>
        <div className="flex items-center">
          {getEnergyIcon()}
          <span className={cn("ml-2 text-sm", getEnergyColor())}>{getEnergyText()}</span>
        </div>
      </div>

      <div className="px-1 mt-4">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(Number.parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  )
}

