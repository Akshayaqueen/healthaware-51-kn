"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useTheme } from "@/lib/theme-context"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { formatTimeAgo, useRealTime } from "@/hooks/use-real-time"
import {
  Edit,
  Grid3X3,
  Heart,
  Bookmark,
  Trash2,
  Share2,
  MessageCircle,
  MoreHorizontal,
  Camera,
  MapPin,
  Calendar,
  LinkIcon,
  Bell,
  Moon,
  Sun,
  Settings,
  Mail,
} from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const currentTime = useRealTime(30000)
  const [activeTab, setActiveTab] = useState("posts")

  const [threads] = useLocalStorage<any[]>("forum_threads", [])
  const [savedPosts] = useLocalStorage<string[]>("saved_posts", [])
  const [emailNotifications, setEmailNotifications] = useLocalStorage<boolean>("email_notifications", true)
  const [pushNotifications, setPushNotifications] = useLocalStorage<boolean>("push_notifications", true)

  const [userProfile, setUserProfile] = useLocalStorage("user_profile", {
    displayName: (user as any)?.displayName || "User",
    bio: "Health awareness enthusiast committed to improving rural healthcare access",
    location: "Rural Community",
    website: "",
    joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    postsCount: 0,
  })

  const userId = (user as any)?.uid
  const userPosts = threads.filter((thread) => thread.author?.userId === userId)
  const likedPosts = threads.filter((thread) => (thread.likedBy || []).includes(userId || ""))
  const savedPostsData = threads.filter((thread) => savedPosts.includes(thread.id))
  const deletedPosts = userPosts.filter((post: any) => post.isDeleted)

  if (userProfile.postsCount !== userPosts.length) {
    setUserProfile({ ...userProfile, postsCount: userPosts.length })
  }

  const getUserInitials = () => {
    const name = (user as any)?.displayName || (user as any)?.email?.split("@")[0] || "User"
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
  }

  const dataByTab = () => {
    switch (activeTab) {
      case "posts":
        return userPosts.filter((post: any) => !post.isDeleted)
      case "liked":
        return likedPosts
      case "saved":
        return savedPostsData
      case "deleted":
        return deletedPosts
      default:
        return []
    }
  }

  const handleShare = async (post: any) => {
    const brand = t("brandName")
    const shareData = {
      title: `${brand}: ${post.title}`,
      text: `${post.content}\n\n${brand}`,
      url: window.location.href,
    }

    try {
      if ((navigator as any).share && (navigator as any).canShare && (navigator as any).canShare(shareData)) {
        await (navigator as any).share(shareData)
      } else {
        const shareText = `${post.title}\n\n${post.content}\n\n${brand}: ${window.location.href}`
        await navigator.clipboard.writeText(shareText)
        const tempDiv = document.createElement("div")
        tempDiv.textContent = t("postShared")
        tempDiv.style.cssText =
          "position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:1000;"
        document.body.appendChild(tempDiv)
        setTimeout(() => document.body.removeChild(tempDiv), 3000)
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const PostCard = ({ post }: { post: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`mb-4 shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 ${post.isDeleted ? "opacity-60" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10 shadow-md">
              <AvatarImage src={(user as any)?.photoURL || ""} />
              <AvatarFallback className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-600">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{userProfile.displayName}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(post.timestamp, currentTime)}
                </span>
                {post.isDeleted && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
                  >
                    {"Deleted"}
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 hover:text-indigo-600 transition-colors cursor-pointer">
                {post.title}
              </h3>
              <p className="text-gray-800 dark:text-gray-300 mb-3 leading-relaxed">{post.content}</p>

              {post.image && (
                <div className="mb-3 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post image"
                    width={500}
                    height={300}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes || 0}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.replies || 0}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{t("share")}</span>
                  </motion.button>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="mb-8 shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-32 w-32 shadow-xl">
                      <AvatarImage src={(user as any)?.photoURL || ""} />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-600">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-lg"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.displayName}</h1>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {t("editProfile")}
                        </Button>
                      </motion.div>
                    </div>

                    <div className="flex justify-center md:justify-start space-x-8 mb-4">
                      <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                        <div className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
                          {userProfile.postsCount}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{t("postsCount")}</div>
                      </motion.div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{userProfile.bio}</p>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {userProfile.location && (
                        <div className="flex items-center justify-center md:justify-start space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{userProfile.location}</span>
                        </div>
                      )}
                      {userProfile.website && (
                        <div className="flex items-center justify-center md:justify-start space-x-1">
                          <LinkIcon className="h-4 w-4" />
                          <a
                            href={userProfile.website}
                            className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                          >
                            {userProfile.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center justify-center md:justify-start space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{"Joined " + new Date(userProfile.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{"Settings & Preferences"}</h2>
                </div>

                <div className="space-y-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {theme === "dark" ? (
                        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t("darkMode")}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {"Toggle between light and dark themes"}
                        </p>
                      </div>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t("notifications")}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {"Receive email alerts for new community posts"}
                          {(user as any)?.email && (
                            <span className="block text-xs text-blue-600 dark:text-blue-400">
                              ({(user as any).email})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{"Push Notifications"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {"Get instant notifications for community activity"}
                        </p>
                      </div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Posts Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="posts"
                  className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("myPosts")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="liked"
                  className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("likedPosts")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-yellow-600 dark:data-[state=active]:text-yellow-400"
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("savedPosts")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="deleted"
                  className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-600 dark:data-[state=active]:text-gray-400"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("deletedPosts")}</span>
                </TabsTrigger>
              </TabsList>

              {(["posts", "liked", "saved", "deleted"] as const).map((tabKey) => (
                <TabsContent key={tabKey} value={tabKey} className="mt-6">
                  <div className="space-y-4">
                    {dataByTab().map((post: any) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                    {dataByTab().length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        {tabKey === "posts" && <Grid3X3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
                        {tabKey === "liked" && <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
                        {tabKey === "saved" && <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
                        {tabKey === "deleted" && <Trash2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
                        <p className="text-gray-500 dark:text-gray-400">{"Nothing here yet"}</p>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
