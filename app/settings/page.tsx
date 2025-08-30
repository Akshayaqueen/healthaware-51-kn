"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { SettingsIcon, User, Bell, Shield, Palette, Moon, Sun, Monitor, Save, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useLocalStorage("user_notifications", {
    email: true,
    push: true,
    community: true,
    health: true,
  })
  const [privacy, setPrivacy] = useLocalStorage("user_privacy", {
    profileVisible: true,
    postsVisible: true,
    activityVisible: false,
  })
  const [theme, setTheme] = useLocalStorage("user_theme", "light")

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Simulate saving settings
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      const tempDiv = document.createElement("div")
      tempDiv.textContent = t("settingsSaved")
      tempDiv.style.cssText =
        "position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:1000;"
      document.body.appendChild(tempDiv)
      setTimeout(() => document.body.removeChild(tempDiv), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <SettingsIcon className="h-5 w-5 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("settings")}
              </h1>
            </div>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    <a
                      href="#account"
                      className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">{t("accountSettings")}</span>
                    </a>
                    <a
                      href="#appearance"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <Palette className="h-5 w-5" />
                      <span className="font-medium">Appearance</span>
                    </a>
                    <a
                      href="#notifications"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="font-medium">{t("notifications")}</span>
                    </a>
                    <a
                      href="#privacy"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">{t("privacy")}</span>
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                id="account"
              >
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{t("accountSettings")}</span>
                    </CardTitle>
                    <CardDescription>Update your account information and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          defaultValue={user?.displayName || ""}
                          placeholder="Enter your display name"
                          className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user?.email || ""}
                          disabled
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Appearance Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                id="appearance"
              >
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Appearance</span>
                    </CardTitle>
                    <CardDescription>Customize how the app looks and feels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">{t("theme")}</Label>
                      <div className="flex space-x-2">
                        {[
                          { value: "light", label: t("lightMode"), icon: Sun },
                          { value: "dark", label: t("darkMode"), icon: Moon },
                          { value: "system", label: t("systemMode"), icon: Monitor },
                        ].map((themeOption) => (
                          <motion.button
                            key={themeOption.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTheme(themeOption.value)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                              theme === themeOption.value
                                ? "bg-blue-50 border-blue-200 text-blue-600"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <themeOption.icon className="h-4 w-4" />
                            <span className="text-sm">{themeOption.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notification Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                id="notifications"
              >
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>{t("notifications")}</span>
                    </CardTitle>
                    <CardDescription>Choose what notifications you want to receive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-gray-500">Receive push notifications</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="community-notifications">Community Updates</Label>
                          <p className="text-sm text-gray-500">New posts and comments</p>
                        </div>
                        <Switch
                          id="community-notifications"
                          checked={notifications.community}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, community: checked })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="health-notifications">Health Tips</Label>
                          <p className="text-sm text-gray-500">Daily health awareness content</p>
                        </div>
                        <Switch
                          id="health-notifications"
                          checked={notifications.health}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, health: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Privacy Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                id="privacy"
              >
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>{t("privacy")}</span>
                    </CardTitle>
                    <CardDescription>Control who can see your information and activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="profile-visible">Public Profile</Label>
                          <p className="text-sm text-gray-500">Make your profile visible to others</p>
                        </div>
                        <Switch
                          id="profile-visible"
                          checked={privacy.profileVisible}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="posts-visible">Public Posts</Label>
                          <p className="text-sm text-gray-500">Allow others to see your posts</p>
                        </div>
                        <Switch
                          id="posts-visible"
                          checked={privacy.postsVisible}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, postsVisible: checked })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="activity-visible">Activity Status</Label>
                          <p className="text-sm text-gray-500">Show when you're active</p>
                        </div>
                        <Switch
                          id="activity-visible"
                          checked={privacy.activityVisible}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, activityVisible: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Save Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-between"
              >
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Reset to Default</span>
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : t("save")}</span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
