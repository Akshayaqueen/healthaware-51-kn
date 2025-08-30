"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || null
  }

  return <>{children}</>
}
