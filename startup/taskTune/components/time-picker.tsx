"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TimePickerDemoProps {
  date: Date
  setDate: (date: Date) => void
}

export function TimePickerDemo({ date, setDate }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)

  const [hour, setHour] = React.useState<number>(date.getHours())
  const [minute, setMinute] = React.useState<number>(date.getMinutes())
  const [second, setSecond] = React.useState<number>(date.getSeconds())

  // Update the date when the hour, minute, or second changes
  React.useEffect(() => {
    const newDate = new Date(date)
    newDate.setHours(hour)
    newDate.setMinutes(minute)
    newDate.setSeconds(second)
    setDate(newDate)
  }, [hour, minute, second, setDate, date])

  // Handle the hour input
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (isNaN(value)) {
      setHour(0)
    } else {
      setHour(Math.max(0, Math.min(23, value)))
    }
  }

  // Handle the minute input
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (isNaN(value)) {
      setMinute(0)
    } else {
      setMinute(Math.max(0, Math.min(59, value)))
    }
  }

  // Handle the second input
  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (isNaN(value)) {
      setSecond(0)
    } else {
      setSecond(Math.max(0, Math.min(59, value)))
    }
  }

  // Handle the hour input key down
  const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setHour((prevHour) => (prevHour === 23 ? 0 : prevHour + 1))
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setHour((prevHour) => (prevHour === 0 ? 23 : prevHour - 1))
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      minuteRef.current?.focus()
    }
  }

  // Handle the minute input key down
  const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setMinute((prevMinute) => (prevMinute === 59 ? 0 : prevMinute + 1))
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setMinute((prevMinute) => (prevMinute === 0 ? 59 : prevMinute - 1))
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      secondRef.current?.focus()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      hourRef.current?.focus()
    }
  }

  // Handle the second input key down
  const handleSecondKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setSecond((prevSecond) => (prevSecond === 59 ? 0 : prevSecond + 1))
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setSecond((prevSecond) => (prevSecond === 0 ? 59 : prevSecond - 1))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      minuteRef.current?.focus()
    }
  }

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <Input
          ref={hourRef}
          id="hours"
          className="w-16 text-center"
          value={hour.toString().padStart(2, "0")}
          onChange={handleHourChange}
          onKeyDown={handleHourKeyDown}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <Input
          ref={minuteRef}
          id="minutes"
          className="w-16 text-center"
          value={minute.toString().padStart(2, "0")}
          onChange={handleMinuteChange}
          onKeyDown={handleMinuteKeyDown}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <Input
          ref={secondRef}
          id="seconds"
          className="w-16 text-center"
          value={second.toString().padStart(2, "0")}
          onChange={handleSecondChange}
          onKeyDown={handleSecondKeyDown}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  )
}

