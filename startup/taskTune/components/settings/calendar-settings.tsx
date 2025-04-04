"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalendarSettings() {
  const [dateFormat, setDateFormat] = useState("24-hour")
  const [language, setLanguage] = useState("en-US")
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("monday")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Calendar settings</h1>
        <p className="text-gray-600 mb-6">Setup your calendar for your preferences</p>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Language and region</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date format</label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger className="w-full md:w-72">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24-hour">24-hour (13:00)</SelectItem>
                  <SelectItem value="12-hour">12-hour (1:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full md:w-72">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First day of week</label>
              <Select value={firstDayOfWeek} onValueChange={setFirstDayOfWeek}>
                <SelectTrigger className="w-full md:w-72">
                  <SelectValue placeholder="Select first day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Calendar appearance</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default view</label>
              <Select defaultValue="week">
                <SelectTrigger className="w-full md:w-72">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time increments</label>
              <Select defaultValue="30">
                <SelectTrigger className="w-full md:w-72">
                  <SelectValue placeholder="Select time increments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

