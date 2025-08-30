"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("healthaware_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple demo authentication
    if (email && password.length >= 6) {
      const user = {
        id: "1",
        email,
        name: email.split("@")[0],
      }
      setUser(user)
      localStorage.setItem("healthaware_user", JSON.stringify(user))
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simple demo registration
    if (name && email && password.length >= 6) {
      const user = {
        id: "1",
        email,
        name,
      }
      setUser(user)
      localStorage.setItem("healthaware_user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("healthaware_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
