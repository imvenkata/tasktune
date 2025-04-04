"use client"

import { useState } from "react"
import { Play, Pause } from "lucide-react"
import Image from "next/image"
import { Clock } from "lucide-react"

export default function Sidebar() {
  const [currentTime, setCurrentTime] = useState("25:00")
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerProgress, setTimerProgress] = useState(0)
  const [currentFocus, setCurrentFocus] = useState("Welcome to Tiimo")
  const [focusTimeRange, setFocusTimeRange] = useState("16:36 → 17:06")
  const [remainingTime, setRemainingTime] = useState("23:21")

  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Tiimo"
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Quick Timer */}
        <div className="mb-6">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Clock className="h-4 w-4 mr-1" />
            QUICK TIMER
          </div>
          <div className="flex items-center justify-between bg-gray-100 rounded-md p-2">
            <span className="text-2xl font-medium">{currentTime}</span>
            <button
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              onClick={() => {
                setIsTimerRunning(!isTimerRunning)
                // Start the timer if it's not running
                if (!isTimerRunning) {
                  const interval = setInterval(() => {
                    setTimerProgress((prev) => {
                      if (prev >= 100) {
                        clearInterval(interval)
                        setIsTimerRunning(false)
                        return 0
                      }
                      return prev + 1
                    })

                    // Update the remaining time
                    const [minutes, seconds] = currentTime.split(":").map(Number)
                    let newMinutes = minutes
                    let newSeconds = seconds - 1

                    if (newSeconds < 0) {
                      newSeconds = 59
                      newMinutes -= 1
                    }

                    if (newMinutes < 0) {
                      newMinutes = 0
                      newSeconds = 0
                      setIsTimerRunning(false)
                      clearInterval(interval)
                    }

                    setCurrentTime(`${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`)
                  }, 1000)
                }
              }}
            >
              {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        </div>

        {/* Focus */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              <span className="material-icons text-sm mr-1">center_focus_strong</span>
              FOCUS
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <span className="material-icons text-sm">expand_less</span>
            </button>
          </div>
          <div className="mb-2">
            <h3 className="font-medium">{currentFocus}</h3>
            <div className="text-xs text-gray-500">{focusTimeRange}</div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              {/* Circle progress */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={(283 * (100 - 75)) / 100}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <div className="w-10 h-10">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Focus icon"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <div className="text-3xl font-medium">{remainingTime}</div>
            <div className="text-xs text-gray-600 flex items-center justify-center mt-1">
              We&apos;re happy to have you here! <span className="ml-1">⭐</span>
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <span>+1 min</span>
            </button>
            <button className="ml-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">||</button>
          </div>
        </div>

        {/* Inbox */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              <span className="material-icons text-sm mr-1">inbox</span>
              INBOX (0)
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <span className="material-icons text-sm">expand_less</span>
            </button>
          </div>
          <h3 className="font-medium mb-2">My inbox</h3>
          <button className="w-full flex items-center justify-between text-gray-500 hover:bg-gray-100 p-2 rounded-md">
            <span>Add task</span>
            <span className="material-icons text-sm">add</span>
          </button>
        </div>

        {/* Music Player */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              <span className="material-icons text-sm mr-1">music_note</span>
              MUSIC PLAYER
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <span className="material-icons text-sm">expand_less</span>
            </button>
          </div>
          <h3 className="font-medium mb-2 flex items-center">
            Care for some tunes? <span className="ml-1">🎵</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              <span className="text-sm">Low-fi beats</span>
              <button className="p-1 rounded-full hover:bg-purple-200">
                <Play size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <span className="text-sm">Celestial</span>
              <button className="p-1 rounded-full hover:bg-blue-200">
                <Play size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
              <span className="text-sm">Groovy tunes</span>
              <button className="p-1 rounded-full hover:bg-pink-200">
                <Play size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

