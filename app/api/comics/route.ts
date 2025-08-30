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
  const title = body?.title || "Healthy Habits in Daily Life"

  try {
    const admin = createAdminClient()
    const { data: comic, error } = await admin
      .from("comics")
      .insert({ user_id: user?.id ?? null, title })
      .select("*")
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 200 })

    // Seed first narrative "panel" (novel-style storyline)
    const firstPanelText =
      `Episode 1: ${title} — why it matters: clean water, 20-second handwashing, regular sleep, and daily movement ` +
      `prevent common infections and keep energy high for work and family.`
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
