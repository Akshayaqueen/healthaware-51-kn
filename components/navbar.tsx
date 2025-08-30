"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { languages } from "@/lib/i18n"
import {
  Heart,
  Menu,
  X,
  BookOpen,
  AlertTriangle,
  Building2,
  Users,
  LogOut,
  User,
  Settings,
  Mic,
  Globe,
} from "lucide-react"

const navItems = [
  { href: "/", label: "home", icon: Heart, public: true },
  { href: "/ai-podcast", label: "aiPodcast", icon: Mic, public: false },
  { href: "/comics", label: "comics", icon: BookOpen, public: true },
  { href: "/myth-buster", label: "mythBuster", icon: AlertTriangle, public: true },
  { href: "/healthcare-info", label: "healthcareInfo", icon: Building2, public: true },
  { href: "/community", label: "community", icon: Users, public: true },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getUserDisplayName = () => {
    if ((user as any)?.isAnonymous) return "Guest"
    return (user as any)?.displayName || (user as any)?.email?.split("@")[0] || "User"
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.charAt(0).toUpperCase()
  }

  const visibleItems = navItems.filter((item) => item.public || user)

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {t("brandName")}
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-emerald-600 bg-emerald-50 shadow-sm"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t(item.label as any)}</span>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Language Switcher & User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{languages[language]}</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {Object.entries(languages).map(([code, name]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLanguage(code as any)}
                    className={`cursor-pointer ${language === code ? "bg-emerald-50 text-emerald-600" : ""}`}
                  >
                    <span>{name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user as any)?.photoURL || undefined} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-600 text-sm font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{getUserDisplayName()}</p>
                      {!(user as any).isAnonymous && (user as any).email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{(user as any).email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("signOut")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" asChild>
                    <Link href="/sign-in">{t("signIn")}</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-lg"
                  >
                    <Link href="/sign-up">{t("signUp")}</Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button + language */}
          <div className="md:hidden flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {Object.entries(languages).map(([code, name]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLanguage(code as any)}
                    className={`cursor-pointer text-xs ${language === code ? "bg-emerald-50 text-emerald-600" : ""}`}
                  >
                    <span>{name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-emerald-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{t(item.label as any)}</span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile User Menu */}
            <div className="pt-4 pb-3 border-t border-gray-100">
              {loading ? (
                <div className="px-4">
                  <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : user ? (
                <div className="px-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={(user as any)?.photoURL || undefined} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-600">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-base font-medium text-gray-800">{getUserDisplayName()}</div>
                      {!(user as any).isAnonymous && <div className="text-sm text-gray-500">{(user as any).email}</div>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                    >
                      <User className="mr-3 h-5 w-5" />
                      {t("profile")}
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      {t("settings")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      {t("signOut")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      <User className="mr-3 h-4 w-4" />
                      {t("signIn")}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                  >
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      {t("signUp")}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
