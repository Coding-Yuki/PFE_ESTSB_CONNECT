"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "student" | "teacher"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  bio?: string
  followers: number
  following: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = "http://localhost/est-connect/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("est-connect-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (e) {
        console.error("[v0] Error parsing stored user:", e)
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem("est-connect-user", JSON.stringify(data.user))
        return true
      }
      console.error("[v0] Login error:", data.message)
      return false
    } catch (error) {
      console.error("[v0] Login request failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem("est-connect-user", JSON.stringify(data.user))
        return true
      }
      console.error("[v0] Register error:", data.message)
      return false
    } catch (error) {
      console.error("[v0] Register request failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("est-connect-user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
