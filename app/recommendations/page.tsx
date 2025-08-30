"use client"

import type React from "react"
import { useState } from "react"
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

  const fetchRecs = async () => {
    setError(null)
    try {
      const res = await fetch("/api/recommendations", { cache: "no-store" })
      const isJson = res.headers.get("content-type")?.includes("application/json")
      if (!res.ok) {
        const j = isJson ? await res.json().catch(() => ({})) : {}
        throw new Error(j.error || "Failed to load recommendations")
      }
      const j = isJson ? await res.json() : { recommendations: [] }
      setItems(j.recommendations || [])
    } catch (e: any) {
      setError(e.message || "Something went wrong while loading recommendations")
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setLatestMessage(null)
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      })
      const isJson = res.headers.get("content-type")?.includes("application/json")
      const j = isJson ? await res.json().catch(() => ({})) : {}
      if (!res.ok) {
        throw new Error(j.error || "Failed to create recommendation")
      }
      if (j?.recommendation?.message) {
        setLatestMessage(j.recommendation.message as string)
      }
      // refresh history after creating
      await fetchRecs()
    } catch (err: any) {
      setError(err.message || "Unable to create recommendation. Please try again.")
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
              {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
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
              {items.length === 0 && <p className="text-sm text-gray-500">No recommendations yet.</p>}
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
