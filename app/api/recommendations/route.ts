import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateText } from "ai"
import { github } from "@ai-sdk/github"

export async function GET() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("recommendations").select("*").order("created_at", { ascending: false })
  if (error) {
    return NextResponse.json({ recommendations: [], error: error.message }, { status: 200 })
  }
  return NextResponse.json({ recommendations: data || [] }, { status: 200 })
}

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } as any }))

  const body = await request.json().catch(() => ({}))
  const { age, lifestyle, symptoms, goals } = (body || {}) as {
    age?: number | null
    lifestyle?: string
    symptoms?: string[]
    goals?: string[]
  }

  let suggestionsArr: { text: string }[] = []
  try {
    const prompt = `You are a healthcare coach for rural communities. Generate concise, actionable recommendations that explain WHY the habit matters in daily life (exercise, diet, sleep, hygiene, etc).
Inputs:
- Age: ${age ?? "unspecified"}
- Lifestyle: ${lifestyle || "unspecified"}
- Symptoms: ${(symptoms || []).join(", ") || "none"}
- Goals: ${(goals || []).join(", ") || "none"}

Return JSON array: [{ "title": string, "reason": string, "action": string }]`
    const { text } = await generateText({ model: github("gpt-4o-mini"), prompt })
    let parsed: Array<{ title: string; reason: string; action: string }> = []
    try {
      parsed = JSON.parse(text)
    } catch {
      const s = text.indexOf("[")
      const e = text.lastIndexOf("]")
      if (s >= 0 && e > s) parsed = JSON.parse(text.slice(s, e + 1))
    }
    if (Array.isArray(parsed) && parsed.length) {
      suggestionsArr = parsed.map((r) => ({ text: `${r.title}: ${r.action} — Why it matters: ${r.reason}` }))
    }
  } catch {
    // fallback below
  }

  if (!suggestionsArr.length) {
    const rules: string[] = []
    if ((age ?? 0) >= 45) rules.push("Annual BP and cholesterol checks — early detection prevents complications.")
    if ((symptoms || []).includes("fatigue")) rules.push("Prioritize 7–8 hours sleep and hydration — boosts energy.")
    if ((goals || []).includes("weight loss"))
      rules.push("Daily 30-minute walk and cut sugary drinks — simple habits, lasting impact.")
    if ((lifestyle || "").toLowerCase().includes("farmer"))
      rules.push("Use sunscreen and clean water during fieldwork — protect skin and prevent heat stress.")
    if ((symptoms || []).includes("stress"))
      rules.push("Try 5-minute breathing twice daily — reduces stress and improves focus.")
    rules.push("Wash hands for 20 seconds — prevents common infections in families.")
    suggestionsArr = rules.map((s) => ({ text: s }))
  }

  const input = { age: age ?? null, lifestyle: lifestyle || "", symptoms: symptoms || [], goals: goals || [] }

  const inputSummary = `Age: ${input.age ?? "unspecified"}, Lifestyle: ${input.lifestyle || "unspecified"}, Symptoms: ${(input.symptoms || []).join(", ") || "none"}, Goals: ${(input.goals || []).join(", ") || "none"}`
  let message = ""
  try {
    const { text: msg } = await generateText({
      model: github("gpt-4o-mini"),
      prompt:
        `Write a 3–5 sentence personalized recommendation for this person.\n` +
        `${inputSummary}\n` +
        `Focus on specific, low-cost steps and why they matter in daily rural life. Respond as plain text only.`,
    })
    message = (msg || "").trim()
  } catch {
    message = suggestionsArr
      .map((s) => s.text)
      .slice(0, 3)
      .join(" ")
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("recommendations")
      .insert({ user_id: user?.id ?? null, input, suggestions: suggestionsArr, message })
      .select("*")
      .single()

    if (!error && data) {
      return NextResponse.json({ recommendation: data }, { status: 200 })
    }
    if (error) {
      return NextResponse.json(
        {
          recommendation: {
            id: `temp-${Date.now()}`,
            input,
            suggestions: suggestionsArr,
            message,
            created_at: new Date().toISOString(),
          },
          warning: error.message,
        },
        { status: 200 },
      )
    }
  } catch (e: any) {
    // continue to fallback
  }

  return NextResponse.json(
    {
      recommendation: {
        id: `temp-${Date.now()}`,
        input,
        suggestions: suggestionsArr,
        message,
        created_at: new Date().toISOString(),
      },
    },
    { status: 200 },
  )
}
