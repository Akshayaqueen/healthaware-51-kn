"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  sendEmailVerification,
} from "firebase/auth"
import { auth } from "./firebase"
export { auth }

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInAsGuest: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error("Firebase not initialized")
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      await sendEmailVerification(result.user)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase not initialized")
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signInAsGuest = async () => {
    if (!auth) throw new Error("Firebase not initialized")
    try {
      await signInAnonymously(auth)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    if (!auth) throw new Error("Firebase not initialized")
    try {
      await signOut(auth)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Firebase not initialized")
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const updateUserProfile = async (displayName: string) => {
    if (!auth) throw new Error("Firebase not initialized")
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName })
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const sendVerificationEmail = async () => {
    if (!auth) throw new Error("Firebase not initialized")
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser)
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInAsGuest,
    logout,
    resetPassword,
    updateUserProfile,
    sendVerificationEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
