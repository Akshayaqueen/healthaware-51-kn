"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useRealTime, formatTimeAgo } from "@/hooks/use-real-time"
import {
  Users,
  MessageCircle,
  Share2,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Pin,
  MoreHorizontal,
  ThumbsUp,
  ImageIcon,
  X,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import Image from "next/image"

interface ForumThread {
  id: string
  title: string
  content: string
  image?: string
  author: {
    name: string
    avatar: string
    role: string
    initials: string
    userId: string
  }
  category: string
  replies: number
  likes: number
  timestamp: number
  isPinned: boolean
  isTrending: boolean
  tags: string[]
  likedBy: string[]
  savedBy: string[]
  reactions: { [emoji: string]: string[] }
}

const initialThreads: ForumThread[] = [
  {
    id: "1",
    title: "Tips for staying hydrated during summer work",
    content:
      "Working outdoors in rural areas during summer can be challenging. What are your best tips for staying properly hydrated?",
    author: {
      name: "Sarah M.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Community Health Worker",
      initials: "SM",
      userId: "demo-user-1",
    },
    category: "General Health",
    replies: 23,
    likes: 45,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    isPinned: true,
    isTrending: true,
    tags: ["hydration", "summer", "outdoor-work"],
    likedBy: [],
    savedBy: [],
    reactions: { "👍": [], "❤️": [], "😊": [], "😢": [], "😠": [], "😂": [] },
  },
]

const forumCategories = [
  { name: "All", count: 0, color: "bg-gray-100 text-gray-800" },
  { name: "General Health", count: 0, color: "bg-blue-100 text-blue-800" },
  { name: "Mental Wellness", count: 0, color: "bg-purple-100 text-purple-800" },
  { name: "Nutrition", count: 0, color: "bg-green-100 text-green-800" },
  { name: "Exercise & Fitness", count: 0, color: "bg-orange-100 text-orange-800" },
  { name: "Family Health", count: 0, color: "bg-pink-100 text-pink-800" },
  { name: "Rural Healthcare", count: 0, color: "bg-indigo-100 text-indigo-800" },
]

const reactionEmojis = ["👍", "❤️", "😊", "😢", "😠", "😂"]

// Email notification service (simulate backend)
const sendEmailNotification = async (userEmail: string, threadTitle: string, threadContent: string, brand: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const notification = document.createElement("div")
    notification.textContent = `${brand}: ${threadTitle} — ${userEmail}`
    notification.style.cssText =
      "position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:1000;"
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 2600)
  } catch (error) {
    console.error("Failed to send email notification:", error)
  }
}

export default function CommunityPage() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const brand = t("brandName")
  const currentTime = useRealTime(30000)
  const [threads, setThreads] = useLocalStorage<ForumThread[]>("forum_threads", initialThreads)
  const [savedPosts, setSavedPosts] = useLocalStorage<string[]>("saved_posts", [])
  const [emailNotifications, setEmailNotifications] = useLocalStorage<boolean>("email_notifications", true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [newThreadContent, setNewThreadContent] = useState("")
  const [newThreadCategory, setNewThreadCategory] = useState("General Health")
  const [newThreadTags, setNewThreadTags] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updatedCategories = forumCategories.map((category) => ({
    ...category,
    count: category.name === "All" ? threads.length : threads.filter((t) => t.category === category.name).length,
  }))

  const filteredThreads = threads.filter((thread) => {
    const matchesCategory = selectedCategory === "All" || thread.category === selectedCategory
    const matchesSearch =
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedThreads = filteredThreads.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.timestamp - a.timestamp
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateThread = async () => {
    if (!user) return

    if (newThreadTitle.trim() && newThreadContent.trim()) {
      const newThread: ForumThread = {
        id: Date.now().toString(),
        title: newThreadTitle.trim(),
        content: newThreadContent.trim(),
        image: selectedImage || undefined,
        author: {
          name: (user as any).displayName || (user as any).email?.split("@")[0] || "User",
          avatar: (user as any).photoURL || "/placeholder.svg?height=40&width=40",
          role: "Community Member",
          initials: ((user as any).displayName || (user as any).email?.split("@")[0] || "U")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
          userId: (user as any).uid,
        },
        category: newThreadCategory,
        replies: 0,
        likes: 0,
        timestamp: Date.now(),
        isPinned: false,
        isTrending: false,
        tags: newThreadTags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0),
        likedBy: [],
        savedBy: [],
        reactions: { "👍": [], "❤️": [], "😊": [], "😢": [], "😠": [], "😂": [] },
      }

      setThreads([newThread, ...threads])
      setShowNewThread(false)
      setNewThreadTitle("")
      setNewThreadContent("")
      setNewThreadTags("")
      setSelectedImage(null)

      if (emailNotifications && (user as any).email) {
        await sendEmailNotification((user as any).email, newThread.title, newThread.content, brand)
      }
    }
  }

  const handleLikeThread = (threadId: string) => {
    if (!user) return

    setThreads(
      threads.map((thread) => {
        if (thread.id === threadId) {
          const isLiked = thread.likedBy?.includes((user as any).uid) || false
          const updatedLikedBy = thread.likedBy || []
          return {
            ...thread,
            likes: isLiked ? thread.likes - 1 : thread.likes + 1,
            likedBy: isLiked
              ? updatedLikedBy.filter((id) => id !== (user as any).uid)
              : [...updatedLikedBy, (user as any).uid],
          }
        }
        return thread
      }),
    )
  }

  const handleSaveThread = (threadId: string) => {
    if (!user) return

    const isSaved = savedPosts.includes(threadId)
    setSavedPosts(isSaved ? savedPosts.filter((id) => id !== threadId) : [...savedPosts, threadId])

    setThreads(
      threads.map((thread) => {
        if (thread.id === threadId) {
          const updatedSavedBy = thread.savedBy || []
          return {
            ...thread,
            savedBy: isSaved
              ? updatedSavedBy.filter((id) => id !== (user as any).uid)
              : [...updatedSavedBy, (user as any).uid],
          }
        }
        return thread
      }),
    )
  }

  const handleReaction = (threadId: string, emoji: string) => {
    if (!user) return

    setThreads(
      threads.map((thread) => {
        if (thread.id === threadId) {
          const currentReactions = { ...thread.reactions }
          const userReacted = currentReactions[emoji]?.includes((user as any).uid) || false

          if (userReacted) {
            currentReactions[emoji] = (currentReactions[emoji] || []).filter((id) => id !== (user as any).uid)
          } else {
            if (!currentReactions[emoji]) currentReactions[emoji] = []
            currentReactions[emoji].push((user as any).uid)
          }

          return { ...thread, reactions: currentReactions }
        }
        return thread
      }),
    )
    setShowReactions(null)
  }

  const handleShare = async (thread: ForumThread) => {
    const shareData = {
      title: `${brand}: ${thread.title}`,
      text: `${thread.content}\n\n${brand} ${t("community")}`,
      url: `${window.location.origin}/community`,
    }

    try {
      if ((navigator as any).share && (navigator as any).canShare && (navigator as any).canShare(shareData)) {
        await (navigator as any).share(shareData)
      } else {
        const shareText = `${thread.title}\n\n${thread.content}\n\n${brand} ${t("community")}: ${window.location.origin}/community`
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

  const totalMembers = 2847 + threads.length * 3
  const activeToday = 156 + Math.floor(threads.length * 1.5)
  const totalReplies = threads.reduce((sum, thread) => sum + thread.replies, 0) + 8567

  return (
    <div className="min-h-screen py-8 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full mb-6 shadow-2xl"
          >
            <Users className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t("communityForum")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("connectCommunity")}</p>
        </motion.div>

        {/* Search and Create Thread */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`${t("search")} ${t("discussions")}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={() => setShowNewThread(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("createPost")}</span>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {updatedCategories.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedCategory === category.name
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary" className="text-xs bg-white/20 text-current">
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Forum Content */}
          <div className="lg:col-span-3">
            {/* New Thread Form */}
            <AnimatePresence>
              {showNewThread && user && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="dark:text-white">{t("createPost")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Input
                          placeholder={t("threadTitlePlaceholder")}
                          value={newThreadTitle}
                          onChange={(e) => setNewThreadTitle(e.target.value)}
                          className="border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-indigo-300 focus:ring-indigo-200"
                        />
                      </div>
                      <div>
                        <select
                          value={newThreadCategory}
                          onChange={(e) => setNewThreadCategory(e.target.value)}
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:border-indigo-300 focus:ring-indigo-200"
                        >
                          {forumCategories.slice(1).map((cat) => (
                            <option key={cat.name} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Input
                          placeholder={t("tagsPlaceholder")}
                          value={newThreadTags}
                          onChange={(e) => setNewThreadTags(e.target.value)}
                          className="border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-indigo-300 focus:ring-indigo-200"
                        />
                      </div>
                      <div>
                        <Textarea
                          placeholder={t("whatsOnYourMind")}
                          value={newThreadContent}
                          onChange={(e) => setNewThreadContent(e.target.value)}
                          rows={4}
                          className="border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-indigo-300 focus:ring-indigo-200"
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <ImageIcon className="h-4 w-4" />
                            <span>{t("addImage")}</span>
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>

                        {selectedImage && (
                          <div className="relative inline-block">
                            <Image
                              src={selectedImage || "/placeholder.svg"}
                              alt="Selected image"
                              width={200}
                              height={150}
                              className="rounded-lg object-cover shadow-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                              onClick={() => setSelectedImage(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Button
                            onClick={handleCreateThread}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                          >
                            {t("post")}
                          </Button>
                        </motion.div>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewThread(false)}
                          className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          {t("cancel")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign-in prompt */}
            {!user && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-lg">
                  <CardContent className="pt-6 text-center">
                    <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      {t("joinConversation")}
                    </h3>
                    <p className="text-blue-700 dark:text-blue-200 mb-4">{t("signInToEngage")}</p>
                    <div className="flex justify-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          asChild
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <a href="/sign-in">{t("signIn")}</a>
                        </Button>
                      </motion.div>
                      <Button
                        variant="outline"
                        asChild
                        className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-transparent"
                      >
                        <a href="/sign-up">{t("signUp")}</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Forum Threads */}
            <div className="space-y-4">
              {sortedThreads.map((thread, index) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 shadow-md">
                          <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
                          <AvatarFallback className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600">
                            {thread.author.initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {thread.isPinned && <Pin className="h-4 w-4 text-green-600" />}
                              {thread.isTrending && <TrendingUp className="h-4 w-4 text-orange-500" />}
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 cursor-pointer transition-colors">
                                {thread.title}
                              </h3>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {thread.author.name}
                            </span>
                            <Badge variant="outline" className="text-xs border-gray-200 dark:border-gray-700">
                              {thread.author.role}
                            </Badge>
                            <Badge className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0">
                              {thread.category}
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(thread.timestamp, currentTime)}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{thread.content}</p>

                          {thread.image && (
                            <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                              <Image
                                src={thread.image || "/placeholder.svg"}
                                alt="Thread image"
                                width={500}
                                height={300}
                                className="w-full h-auto max-h-64 object-cover"
                              />
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mb-4">
                            {thread.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Reactions */}
                          <div className="flex items-center space-x-2 mb-4">
                            {reactionEmojis.map((emoji) => {
                              const count = thread.reactions[emoji]?.length || 0
                              const userReacted = user && thread.reactions[emoji]?.includes((user as any).uid)
                              return count > 0 ? (
                                <motion.button
                                  key={emoji}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleReaction(thread.id, emoji)}
                                  disabled={!user}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all ${
                                    userReacted
                                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                                  } ${!user ? "cursor-not-allowed opacity-50" : ""}`}
                                >
                                  <span>{emoji}</span>
                                  <span>{count}</span>
                                </motion.button>
                              ) : null
                            })}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleLikeThread(thread.id)}
                                disabled={!user}
                                className={`flex items-center space-x-1 text-sm transition-colors ${
                                  user && thread.likedBy?.includes((user as any).uid)
                                    ? "text-red-600"
                                    : "text-gray-500 dark:text-gray-400 hover:text-red-600"
                                } ${!user ? "cursor-not-allowed opacity-50" : ""}`}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span>{thread.likes}</span>
                              </motion.button>
                              <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                <span>{thread.replies}</span>
                              </button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleShare(thread)}
                                className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors"
                              >
                                <Share2 className="h-4 w-4" />
                                <span>{t("share")}</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleSaveThread(thread.id)}
                                disabled={!user}
                                className={`flex items-center space-x-1 text-sm transition-colors ${
                                  user && savedPosts.includes(thread.id)
                                    ? "text-yellow-600"
                                    : "text-gray-500 dark:text-gray-400 hover:text-yellow-600"
                                } ${!user ? "cursor-not-allowed opacity-50" : ""}`}
                              >
                                {user && savedPosts.includes(thread.id) ? (
                                  <BookmarkCheck className="h-4 w-4" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                                <span>{user && savedPosts.includes(thread.id) ? t("unsavePost") : t("savePost")}</span>
                              </motion.button>
                            </div>

                            {/* Emoji Reactions Popup */}
                            <div className="relative">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowReactions(showReactions === thread.id ? null : thread.id)}
                                disabled={!user}
                                className={`flex items-center space-x-1 text-sm transition-colors ${
                                  !user
                                    ? "cursor-not-allowed opacity-50"
                                    : "text-gray-500 dark:text-gray-400 hover:text-indigo-600"
                                }`}
                              >
                                <span>😊</span>
                                <span>{t("reactions")}</span>
                              </motion.button>

                              <AnimatePresence>
                                {showReactions === thread.id && user && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                    className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 flex space-x-1 z-10"
                                  >
                                    {reactionEmojis.map((emoji) => (
                                      <motion.button
                                        key={emoji}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleReaction(thread.id, emoji)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                      >
                                        <span className="text-lg">{emoji}</span>
                                      </motion.button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {sortedThreads.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  {t("noDiscussionsTitle")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{t("tryAdjustingFilters")}</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">{t("communityStats")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t("totalMembers")}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {totalMembers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t("activeToday")}</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{activeToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t("totalThreads")}</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {threads.length.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t("totalReplies")}</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {totalReplies.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">{t("communityGuidelines")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p className="mb-2">{t("guideline1")}</p>
                    <p className="mb-2">{t("guideline2")}</p>
                    <p className="mb-2">{t("guideline3")}</p>
                    <p className="mb-2">{t("guideline4")}</p>
                    <p>{t("guideline5")}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">{t("popularTags")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "nutrition",
                      "exercise",
                      "mental-health",
                      "rural-care",
                      "family",
                      "prevention",
                      "wellness",
                      "community",
                    ].map((tag) => (
                      <motion.div key={tag} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors border-0 bg-gray-100 dark:bg-gray-700"
                        >
                          #{tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
