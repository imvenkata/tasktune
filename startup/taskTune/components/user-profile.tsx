"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth/auth-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Moon, Sun, LogOut, UserIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"

export default function UserProfile() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
            <AvatarFallback className="text-lg">{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>

            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <UserIcon className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-gray-900">
        <h3 className="text-lg font-medium mb-4">Account Settings</h3>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input id="display-name" defaultValue={user?.name} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>Dark Mode</span>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
          </div>
        </div>

        <div className="mt-6">
          <Button>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-gray-900">
        <h3 className="text-lg font-medium mb-4">App Preferences</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Default Focus Timer Duration</span>
            <span className="font-medium">25 minutes</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Default Break Duration</span>
            <span className="font-medium">5 minutes</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Task Categories</span>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span>Widget Settings</span>
            <Button variant="outline" size="sm">
              Customize
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

