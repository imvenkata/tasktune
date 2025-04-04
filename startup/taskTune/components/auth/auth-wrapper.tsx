"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Check if token is expired (in a real app, you'd verify the JWT)
        const tokenExpiry = localStorage.getItem("tokenExpiry")
        if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
          // Token expired, log out the user
          logout()
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Demo login - in a real app, this would be an API call
      if (email === "demo@example.com" && password === "password") {
        const user = {
          id: "user-1",
          name: "Demo User",
          email: "demo@example.com",
        }

        // Set token expiry to 7 days from now
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 7)

        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("tokenExpiry", expiryDate.toISOString())
        router.push("/dashboard")
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Demo signup - in a real app, this would be an API call
      const user = {
        id: "user-" + Date.now(),
        name,
        email,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("tokenExpiry")
    router.push("/auth")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

