import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { generateText } from "ai"
import { github } from "@ai-sdk/github"

type GenBody = {
  age?: string
  lifestyle?: string
  count?: number
}

export async function POST(req: Request) {
  const { age, lifestyle, count = 3 } = (await req.json().catch(() => ({}))) as GenBody

  try {
    // Generate with GitHub Models (requires GITHUB_TOKEN env)
    const prompt = `You are a healthcare coach for a rural audience. Generate ${count} concise, actionable, healthcare-focused recommendations that explain why each habit matters in daily life (exercise, diet, sleep, hygiene, etc).
Context:
- Age: ${age || "unspecified"}
- Lifestyle: ${lifestyle || "unspecified"}

Output JSON array with objects: [{ title: string, reason: string, action: string }]. Keep titles short and clear.`

    const { text } = await generateText({
      model: github("gpt-4o-mini"),
      prompt,
    })

    // Parse JSON from model output
    let recs: Array<{ title: string; reason: string; action: string }> = []
    try {
      recs = JSON.parse(text)
    } catch {
      // Fallback naive parse: attempt to extract JSON substring
      const start = text.indexOf("[")
      const end = text.lastIndexOf("]")
      if (start >= 0 && end > start) {
        recs = JSON.parse(text.slice(start, end + 1))
      }
    }

    // Persist to Supabase (anon client; policy or RLS bypass via admin is optional)
    const cookieStore = cookies()
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ recommendations: recs || [] }, { status: 200 })
    const supabase = createServerClient(url, key, { cookies: () => cookieStore })

    const inserts = (recs || []).map((r) => ({
      text: `${r.title}: ${r.action}`,
      meta: { reason: r.reason, age, lifestyle },
    }))
    if (inserts.length) {
      await supabase.from("recommendations").insert(inserts)
    }

    return NextResponse.json({ recommendations: inserts.length ? inserts : recs })
  } catch (e: any) {
    // Return 200 with fallback empty list to avoid blocking UX
    return NextResponse.json({ recommendations: [], error: e.message }, { status: 200 })
  }
}
