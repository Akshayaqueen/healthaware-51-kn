"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Rec = {
  id: string
  input: { age: number; lifestyle: string; symptoms: string[]; goals: string[] }
  suggestions: { text: string }[]
  created_at: string
}

export default function RecommendationsPage() {
  const [age, setAge] = useState<number | undefined>()
  const [lifestyle, setLifestyle] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [goals, setGoals] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Rec[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false) // advanced panel toggle
  const [latestMessage, setLatestMessage] = useState<string | null>(null)

  const buildFallbackMessage = (
    ageVal?: number,
    lifestyleVal?: string,
    symptomsStr?: string,
    goalsStr?: string,
  ): string => {
    const symptomsArr = (symptomsStr || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const goalsArr = (goalsStr || "")
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean)

    const lines: string[] = []
    lines.push(
      "Focus on the basics today: drink clean water regularly, wash hands with soap for 20 seconds before meals, and aim for 7–8 hours of sleep.",
    )

    if (ageVal && ageVal >= 45) {
      lines.push("Schedule annual blood pressure and cholesterol checks to catch problems early.")
    }
    if (symptomsArr.includes("fatigue")) {
      lines.push("Prioritize a consistent sleep time and include iron-rich foods like lentils and leafy greens.")
    }
    if (symptomsArr.includes("stress")) {
      lines.push("Try a simple breathing routine: inhale 4s, hold 4s, exhale 6s, twice daily.")
    }
    if (goalsArr.includes("weight loss")) {
      lines.push("Walk briskly 30 minutes most days and replace sugary drinks with water or unsweetened tea.")
    }
    if ((lifestyleVal || "").toLowerCase().includes("farmer")) {
      lines.push("During field work, rest in shade and carry safe drinking water to prevent heat stress.")
    }
    if (lines.length < 3) {
      lines.push("Build a simple plate: half vegetables, some whole grains, and a palm-sized protein.")
    }
    return lines.join(" ")
  }

  const fetchRecs = async () => {
    setError(null)
    try {
      const res = await fetch("/api/recommendations", { cache: "no-store" })
      const isJson = res.headers.get("content-type")?.includes("application/json")
      if (!res.ok) {
        const j = isJson ? await res.json().catch(() => ({})) : {}
        setItems([])
        setError(null)
        return
      }
      const j = isJson ? await res.json() : { recommendations: [] }
      setItems(j.recommendations || [])
    } catch (e: any) {
      setItems([])
      setError(null)
    }
  }

  useEffect(() => {
    fetchRecs()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setLatestMessage(null)

    const payload = {
      age: age ? Number(age) : null,
      lifestyle,
      symptoms: symptoms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      goals: goals
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
    }

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("lastRecommendationInput", JSON.stringify(payload))
      }
    } catch {}

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const isJson = res.headers.get("content-type")?.includes("application/json")
      const j = isJson ? await res.json().catch(() => ({})) : {}
      if (!res.ok) {
        const fallback = buildFallbackMessage(age, lifestyle, symptoms, goals)
        setLatestMessage(fallback)
        await fetchRecs()
        return
      }
      if (j?.recommendation?.message) {
        setLatestMessage(j.recommendation.message as string)
      } else {
        const fallback = buildFallbackMessage(age, lifestyle, symptoms, goals)
        setLatestMessage(fallback)
      }
      await fetchRecs()
    } catch {
      const fallback = buildFallbackMessage(age, lifestyle, symptoms, goals)
      setLatestMessage(fallback)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-balance">Personalized Health Recommendations</h1>
          <p className="text-gray-600">Enter a few details and get tailored advice and podcast suggestions.</p>
        </motion.div>

        <Card className="accent-card mb-8">
          <CardHeader>
            <CardTitle>Tell us about you</CardTitle>
            <CardDescription>We store your inputs securely and only you can access them.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Select value={age !== undefined ? String(age) : undefined} onValueChange={(v) => setAge(Number(v))}>
                  <SelectTrigger id="age">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 73 }, (_, i) => 13 + i).map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="lifestyle">Lifestyle</Label>
                <div className="flex gap-2">
                  <Input
                    id="lifestyle"
                    value={lifestyle}
                    onChange={(e) => setLifestyle(e.target.value)}
                    placeholder="e.g. Farmer, office worker"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdvanced((s) => !s)}
                    aria-expanded={showAdvanced}
                    className="whitespace-nowrap"
                  >
                    Advanced Options
                  </Button>
                </div>
                {showAdvanced && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {["Sedentary", "Lightly Active", "Active", "Very Active"].map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        variant={lifestyle === opt ? "default" : "outline"}
                        onClick={() => setLifestyle(opt)}
                        className={lifestyle === opt ? "" : "bg-white"}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                <Input
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. fatigue, stress"
                />
              </div>
              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="goals">Goals (comma-separated)</Label>
                <Input
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. weight loss, better sleep"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Generating..." : "Get Recommendations"}
                </Button>
                <Button type="button" variant="outline" onClick={fetchRecs}>
                  Refresh History
                </Button>
              </div>
              {latestMessage && (
                <div className="md:col-span-2 border rounded-md p-3 bg-green-50 text-sm text-gray-800">
                  <strong>Recommended Plan:</strong>
                  <p className="mt-1 whitespace-pre-line">{latestMessage}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="accent-card">
          <CardHeader>
            <CardTitle>Your Recommendation History</CardTitle>
            <CardDescription>Newest first</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.length === 0 && <p className="text-sm text-gray-500">No recommendations available yet.</p>}
              {items.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {rec.input.symptoms?.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        #{s}
                      </Badge>
                    ))}
                    {rec.input.goals?.map((g, i) => (
                      <Badge key={`g-${i}`} variant="outline" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {rec.suggestions.map((s, i) => (
                      <li key={i}>{s.text}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">{new Date(rec.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
