"use client"

import { useState, useEffect } from "react"

export function useRealTime(interval = 30000) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  return currentTime
}

export function formatTimeAgo(timestamp: number, currentTime: Date) {
  const now = currentTime.getTime()
  const past = timestamp
  const diffInSeconds = Math.floor((now - past) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months > 1 ? "s" : ""} ago`
  }
}
