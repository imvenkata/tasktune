"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import AccountSettings from "@/components/settings/account-settings"
import ConnectedCalendars from "@/components/settings/connected-calendars"
import CalendarSettings from "@/components/settings/calendar-settings"
import NotificationSettings from "@/components/settings/notification-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("account")

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-64 pr-6">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">A</span>
              </div>
              <h2 className="text-xl font-semibold">Aashu</h2>
            </div>

            <nav className="space-y-1">
              <button
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${activeTab === "account" ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("account")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Account
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${activeTab === "connected-calendars" ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("connected-calendars")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Connected calendars
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${activeTab === "calendar-settings" ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("calendar-settings")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Calendar settings
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${activeTab === "notifications" ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("notifications")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Notifications
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "connected-calendars" && <ConnectedCalendars />}
          {activeTab === "calendar-settings" && <CalendarSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
        </div>
      </div>
    </div>
  )
}

