import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}))
    const { recommendation_id, liked } = payload as { recommendation_id?: string; liked?: boolean }
    if (!recommendation_id || typeof liked !== "boolean") {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 200 })
    }
    const admin = createAdminClient()
    const { error } = await admin.from("recommendation_feedback").insert([{ recommendation_id, liked }])
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 200 })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Unknown error" }, { status: 200 })
  }
}
