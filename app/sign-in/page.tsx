"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Chrome, UserCheck, Heart } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithGoogle, signInAsGuest } = useAuth()
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signIn(email, password)
      router.push("/")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)

    try {
      await signInWithGoogle()
      router.push("/")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestSignIn = async () => {
    setError("")
    setLoading(true)

    try {
      await signInAsGuest()
      router.push("/")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your health awareness platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-11 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={handleGuestSignIn}
                disabled={loading}
                className="w-full h-11 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Guest
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/sign-up" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
