import { NextResponse } from "next/server"

export async function POST() {
  const ts = new Date()
  const stamp = ts.toISOString().replace(/[:.]/g, "-")
  const title = `AI Health Podcast ${ts.toLocaleDateString()}`
  const filename = `podcast-${stamp}.mp3`
  // Note: The generation pipeline should create this file at public/audio/${filename}
  return NextResponse.json({ title, filename })
}
