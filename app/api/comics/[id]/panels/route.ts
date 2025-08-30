import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"

const ParamsSchema = z.object({ id: z.string().uuid() })

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const admin = createAdminClient()
  const parse = ParamsSchema.safeParse(params)
  if (!parse.success) return NextResponse.json({ panels: [], error: "Invalid comic id" }, { status: 200 })

  const { data, error } = await admin
    .from("comic_panels")
    .select("*")
    .eq("comic_id", params.id)
    .order("panel_index", { ascending: true })

  if (error) return NextResponse.json({ panels: [], error: error.message }, { status: 200 })
  return NextResponse.json({ panels: data || [] }, { status: 200 })
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const admin = createAdminClient()
  const parse = ParamsSchema.safeParse(params)
  if (!parse.success) return NextResponse.json({ error: "Invalid comic id" }, { status: 200 })

  const { data: existing, error: selErr } = await admin
    .from("comic_panels")
    .select("panel_index")
    .eq("comic_id", params.id)
    .order("panel_index", { ascending: false })
    .limit(1)
  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 200 })

  const nextIndex = existing && existing.length ? existing[0].panel_index + 1 : 0
  const panelText =
    `Episode ${nextIndex + 1}: Practical tip — choose clean water, wash hands for 20 seconds, eat simple ` +
    `home meals, and keep a steady sleep time. These habits reduce infections and keep energy for daily work.`

  const { data, error } = await admin
    .from("comic_panels")
    .insert({
      comic_id: params.id,
      panel_index: nextIndex,
      panel_text: panelText,
      image_url: null,
    })
    .select("*")

  if (error) return NextResponse.json({ error: error.message }, { status: 200 })
  return NextResponse.json({ panel: Array.isArray(data) ? data[0] : data }, { status: 200 })
}
