"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Create a mock user for when auth is not available
const mockUser = {
  email: "user@example.com",
  name: "Demo User",
}

export default function AccountSettings() {
  const [user, setUser] = useState(mockUser)
  const [logoutFunc, setLogoutFunc] = useState(() => console.log("Logout clicked"))

  // Initialize authData outside useEffect to avoid conditional hook call
  let authData = null
  try {
    const authWrapper = require("@/components/auth/auth-wrapper")
    authData = authWrapper.useAuth()
  } catch (error) {
    console.log("Auth provider not available, using mock data")
  }

  useEffect(() => {
    if (authData) {
      setUser(authData.user || mockUser)
      setLogoutFunc(authData.logout || (() => console.log("Logout clicked")))
    }
  }, [authData])

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isChangeEmailDialogOpen, setIsChangeEmailDialogOpen] = useState(false)
  const [newEmail, setNewEmail] = useState("")

  // Message preferences
  const [messagePreferences, setMessagePreferences] = useState({
    enabled: false,
    appUpdates: false,
    newsletter: false,
    offers: false,
  })

  const toggleMessages = (enabled: boolean) => {
    setMessagePreferences({
      ...messagePreferences,
      enabled,
    })
  }

  const togglePreference = (key: string, value: boolean) => {
    setMessagePreferences({
      ...messagePreferences,
      [key]: value,
    })
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    logoutFunc()
    setIsDeleteDialogOpen(false)
  }

  const handleChangeEmail = () => {
    // In a real app, this would call an API to change the email
    setIsChangeEmailDialogOpen(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Account</h1>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Email</h2>
          <div className="flex items-center justify-between">
            <span>{user?.email || "user@example.com"}</span>
            <Button variant="outline" onClick={() => setIsChangeEmailDialogOpen(true)}>
              Change email
            </Button>
          </div>
          <div className="mt-4">
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-0"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete account
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Subscription</h2>
          <div className="flex items-center justify-between">
            <span>Free plan</span>
            <Button variant="outline">Manage subscriptions</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Send messages</h2>
          <p className="text-gray-600 mb-4">
            We would love to share when we have exciting news, new content, app updates or relevant offers ready for
            you. Remember you can always change it as it fits you.
          </p>

          <div className="flex items-center justify-between mb-6">
            <span className="font-medium">Toggle to activate messages</span>
            <Switch checked={messagePreferences.enabled} onCheckedChange={toggleMessages} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">App updates</p>
                <p className="text-sm text-gray-500">
                  Get a heads up when updates are coming, news, and exclusive offers.
                </p>
              </div>
              <Switch
                checked={messagePreferences.appUpdates}
                onCheckedChange={(checked) => togglePreference("appUpdates", checked)}
                disabled={!messagePreferences.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-gray-500">Receive relevant content and exciting news from us</p>
              </div>
              <Switch
                checked={messagePreferences.newsletter}
                onCheckedChange={(checked) => togglePreference("newsletter", checked)}
                disabled={!messagePreferences.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Offers</p>
                <p className="text-sm text-gray-500">Receive personal offers and campaigns</p>
              </div>
              <Switch
                checked={messagePreferences.offers}
                onCheckedChange={(checked) => togglePreference("offers", checked)}
                disabled={!messagePreferences.enabled}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-100 text-red-600 hover:bg-red-200" onClick={handleDeleteAccount}>
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Email Dialog */}
      <AlertDialog open={isChangeEmailDialogOpen} onOpenChange={setIsChangeEmailDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Email Address</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your new email address below. You'll need to verify this email before the change takes effect.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New email address"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeEmail}>Change Email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

