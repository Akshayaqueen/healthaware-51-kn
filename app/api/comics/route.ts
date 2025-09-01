import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = await createServerClient()
  const { data: comics, error } = await supabase
    .from("comics")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ comics: [], error: error.message }, { status: 200 })

  const ids = (comics || []).map((c: any) => c.id)
  const firstPanelMap = new Map<string, string | null>()
  if (ids.length) {
    const { data: panels } = await supabase
      .from("comic_panels")
      .select("comic_id, panel_text, panel_index")
      .in("comic_id", ids)
      .order("panel_index", { ascending: true })

    if (Array.isArray(panels)) {
      for (const p of panels as any[]) {
        if (!firstPanelMap.has(p.comic_id)) {
          firstPanelMap.set(p.comic_id, p.panel_text || null)
        }
      }
    }
  }

  const enriched = (comics || []).map((c: any) => ({
    ...c,
    first_panel_text: firstPanelMap.get(c.id) ?? null,
  }))

  return NextResponse.json({ comics: enriched }, { status: 200 })
}

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } as any }))

  const body = await request.json().catch(() => ({}))
  const baseTitle = (body?.title as string) || "Healthy Habits in Daily Life"
  const suffix = `${Math.random().toString(36).slice(2, 6)}-${Date.now().toString().slice(-4)}`
  const title = `${baseTitle} (${suffix})`

  try {
    const admin = createAdminClient()
    const { data: comic, error } = await admin
      .from("comics")
      .insert({ user_id: user?.id ?? null, title })
      .select("*")
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 200 })

    const openings = [
      `Episode 1: ${title} — In the village, Asha learns how clean water and handwashing keep families healthy.`,
      `Episode 1: ${title} — Ravi starts a 20‑minute sunset walk, noticing better sleep and mood.`,
      `Episode 1: ${title} — Meera builds a simple plate: half veggies, some grains, and lentils for strength.`,
      `Episode 1: ${title} — During harvest, Sunil protects his skin with shade and water breaks.`,
    ]
    const firstPanelText = openings[Math.floor(Math.random() * openings.length)]

    await admin.from("comic_panels").insert({
      comic_id: comic.id,
      panel_index: 0,
      panel_text: firstPanelText,
      image_url: null,
    })

    return NextResponse.json({ comic }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create comic" }, { status: 200 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = (await request.json().catch(() => ({}))) as { id?: string }
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 200 })

    const admin = createAdminClient()
    const { error } = await admin.from("comics").delete().eq("id", id)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 200 })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Failed to delete" }, { status: 200 })
  }
}
