"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewComicPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/comics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Community Health Journey" }),
        })
        const j = await res.json()
        if (!res.ok) throw new Error(j.error || "Failed to create comic")
        router.replace(`/comics/${j.comic.id}/preview`)
      } catch (err: any) {
        setError(err.message)
      }
    })()
  }, [router])

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Creating your storyline…</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? <p className="text-red-600">{error}</p> : <p>Please wait, setting things up.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
