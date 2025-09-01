"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type ApiResponse =
  | { ok: true; tips?: string[]; message?: string; recommendations?: any[] }
  | { recommendations?: Array<{ title?: string; action?: string }> }

export default function SuggestionsPopup() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [tips, setTips] = useState<string[]>([])

  useEffect(() => {
    if (pathname !== "/") return
    if (typeof window === "undefined") return
    const dismissed = sessionStorage.getItem("suggestionsDismissed") === "true"
    if (dismissed) return

    const lastInputRaw = localStorage.getItem("lastRecommendationInput")
    let lastInput: any = undefined
    try {
      lastInput = lastInputRaw ? JSON.parse(lastInputRaw) : undefined
    } catch {}
    ;(async () => {
      try {
        const res = await fetch("/api/recommendations/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-no-persist": "true" },
          body: JSON.stringify(lastInput || {}),
        })
        const json: ApiResponse = await res.json().catch(() => ({}) as any)

        let derived: string[] = []
        if ("ok" in (json as any) && (json as any).ok && Array.isArray((json as any).tips)) {
          derived = ((json as any).tips || []).slice(0, 3)
        } else if (Array.isArray((json as any).recommendations)) {
          const recs = (json as any).recommendations as Array<{ title?: string; action?: string }>
          derived = recs
            .map((r) => r.title || r.action || "")
            .filter(Boolean)
            .slice(0, 3)
        }

        if (derived.length === 0) {
          derived = ["Hydration baseline", "Regular meals", "Daily movement"]
        }
        setTips(derived)
        setVisible(true)
      } catch {
        setTips(["Hydration baseline", "Regular meals", "Daily movement"])
        setVisible(true)
      }
    })()
  }, [pathname])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs pointer-events-auto">
      <Card className="p-4 shadow-lg border bg-background">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm">Personalized Suggestions</h3>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close suggestions"
            onClick={() => {
              sessionStorage.setItem("suggestionsDismissed", "true")
              setVisible(false)
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
          {tips.slice(0, 3).map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
