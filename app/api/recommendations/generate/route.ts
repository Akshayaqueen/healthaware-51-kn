import { NextResponse } from "next/server"
import { generateRecommendationPlan } from "@/lib/health/generate-plan"

type GenBody = {
  age?: number | string | null
  lifestyle?: string | null
  symptoms?: string[] | string | null
  goals?: string[] | string | null
  count?: number | string
}

export async function POST(req: Request) {
  const noPersistHeader = req.headers.get("x-no-persist")
  // default to no-persist to avoid polluting history from popup
  const noPersist = noPersistHeader === "true" || noPersistHeader === null

  const body = (await req.json().catch(() => ({}))) as GenBody
  const plan = generateRecommendationPlan(body)

  const count =
    typeof body?.count === "number" ? body.count : typeof body?.count === "string" ? Number(body.count) : undefined

  const limit = (arr: any[]) =>
    typeof count === "number" && isFinite(count) && count > 0
      ? arr.slice(0, Math.min(arr.length, Math.max(1, Math.floor(count))))
      : arr

  const limitedSuggestions = limit(plan.suggestions)
  const limitedTips = limit(plan.tips)

  // Backward compatibility: also provide "recommendations" array similar to previous shape
  const recommendations = limitedSuggestions.map((s) => ({
    title: s.title,
    reason: s.detail,
    action: s.detail,
  }))

  if (noPersist) {
    return NextResponse.json(
      {
        ok: true,
        tips: limitedTips,
        message: plan.message,
        suggestions: limitedSuggestions,
        recommendations,
      },
      { status: 200 },
    )
  }

  // If persistence is explicitly requested in the future, respond similarly (storage handled by main POST /api/recommendations).
  return NextResponse.json(
    {
      ok: true,
      tips: limitedTips,
      message: plan.message,
      suggestions: limitedSuggestions,
      recommendations,
    },
    { status: 200 },
  )
}
