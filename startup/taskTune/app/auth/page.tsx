"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Login from "@/components/auth/login"
import SignUp from "@/components/auth/sign-up"
import Link from "next/link"
import Image from "next/image"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Left Section with Illustration and Welcome Text */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
        <div className="max-w-md">
          <Link
            href="/"
            className="inline-flex items-center text-purple-900 mb-8 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>GO BACK</span>
          </Link>

          <div className="mb-8 relative w-64 h-64 mx-auto">
            <Image
              src="/placeholder.svg?height=256&width=256"
              alt="Welcome illustration"
              width={256}
              height={256}
              className="animate-pulse"
            />
          </div>

          <h2 className="text-3xl font-bold text-purple-900 mb-4">
            {activeTab === "login" ? "Welcome back to taskTune!" : "Join taskTune today!"}
          </h2>
          <p className="text-lg text-purple-700">
            {activeTab === "login"
              ? "Ready to dive in and continue where you left off? Your productivity journey awaits."
              : "Start organizing your time, tracking your energy, and boosting your productivity with our intuitive tools."}
          </p>
        </div>
      </div>

      {/* Right Section with Auth Forms */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <h1 className="text-3xl font-bold text-center mb-6 text-purple-900">
            {activeTab === "login" ? "Sign in to taskTune" : "Create your account"}
          </h1>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 border-gray-200 text-black font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22C6.486 22 2 17.514 2 12C2 6.486 6.486 2 12 2ZM10 16.5L16 12L10 7.5V16.5Z"
                  fill="currentColor"
                />
              </svg>
              Sign in with Google
            </Button>
            <Button variant="outline" className="w-full bg-black hover:bg-gray-900 text-white font-medium">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="white">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22C6.486 22 2 17.514 2 12C2 6.486 6.486 2 12 2ZM10 16.5L16 12L10 7.5V16.5Z"
                  fill="currentColor"
                />
              </svg>
              Sign in with Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-3 text-sm text-gray-500 absolute">Or continue with email</span>
          </div>

          {/* Auth Tabs */}
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Login />
              <div className="mt-4 text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Create one now
                </button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <SignUp />
              <div className="mt-4 text-center">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Sign in
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

