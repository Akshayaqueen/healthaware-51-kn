"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showInstallPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="shadow-lg border-0 bg-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Install HealthAware</h3>
              <p className="text-xs text-emerald-100 mb-3">Get quick access to health resources offline</p>
              <div className="flex space-x-2">
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="bg-white text-emerald-600 hover:bg-gray-100 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Install
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-emerald-700 text-xs"
                >
                  Later
                </Button>
              </div>
            </div>
            <button onClick={handleDismiss} className="text-emerald-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
