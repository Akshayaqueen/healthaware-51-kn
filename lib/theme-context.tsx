"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("light")

  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setThemeState(savedTheme)
    } else {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setThemeState(systemTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Save to localStorage
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"))
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
