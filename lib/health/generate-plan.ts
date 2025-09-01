export type RecommendationInput = {
  age?: number | string | null
  lifestyle?: string | null
  symptoms?: string | string[] | null
  goals?: string | string[] | null
}

export type RecommendationPlan = {
  message: string
  tips: string[] // short tips for popup
  suggestions: { title: string; detail: string }[]
  caution?: string
}

function norm(v?: string | null) {
  return (v || "").toLowerCase().trim()
}

function toNum(v?: number | string | null) {
  if (v === null || v === undefined) return undefined
  const n = typeof v === "number" ? v : Number.parseInt((v as string).replace(/[^0-9]/g, ""), 10)
  return isNaN(n) ? undefined : n
}

function toCsv(arrish?: string | string[] | null) {
  if (Array.isArray(arrish)) return arrish.join(", ")
  return arrish || ""
}

export function generateRecommendationPlan(input: RecommendationInput): RecommendationPlan {
  const age = toNum(input.age)
  const lifestyle = norm(input.lifestyle)
  const symptomsStr = toCsv(input.symptoms)
  const goalsStr = toCsv(input.goals)
  const symptoms = norm(symptomsStr)
  const goals = norm(goalsStr)

  const has = (k: string) => symptoms.includes(k)
  const wants = (k: string) => goals.includes(k)
  const lifeHas = (k: string) => lifestyle.includes(k)

  const suggestions: { title: string; detail: string }[] = []

  // Lifestyle
  if (lifeHas("smok")) {
    suggestions.push({
      title: "Smoking reduction",
      detail: "Set a quit date, consider nicotine replacement, avoid triggers, and seek support if available.",
    })
  }
  if (lifeHas("sedent") || lifeHas("desk") || lifeHas("inactive")) {
    suggestions.push({
      title: "Gentle daily movement",
      detail: "Start with 20–30 minutes of brisk walking most days; add light strength 2–3×/week.",
    })
  }
  if (lifeHas("active") || lifeHas("sport")) {
    suggestions.push({
      title: "Recovery and hydration",
      detail: "Prioritize 7–9h sleep, 2–3L fluids/day, and 20–30g protein post‑workout.",
    })
  }
  if (lifeHas("stress") || lifeHas("anxiety")) {
    suggestions.push({
      title: "Stress hygiene",
      detail: "Practice 5 minutes of diaphragmatic breathing 2–3×/day and a 10‑minute wind‑down routine.",
    })
  }

  // Symptoms
  if (has("fatigue") || has("tired") || has("low energy")) {
    suggestions.push(
      {
        title: "Hydration and protein",
        detail: "Target 2–3L water/day; include protein each meal to stabilize energy.",
      },
      { title: "Sleep routine", detail: "Fixed sleep/wake times; no screens 60 minutes before bed; cool, dark room." },
    )
  }
  if (has("headache") || has("migraine")) {
    suggestions.push(
      { title: "Trigger audit", detail: "Track caffeine, dehydration, missed meals, and screen time as triggers." },
      { title: "Hydration & breaks", detail: "Sip water hourly; use 20‑20‑20 screen breaks for eye strain relief." },
    )
  }
  if (has("cough") || has("sore throat")) {
    suggestions.push(
      { title: "Humidification & fluids", detail: "Humidifier, warm fluids, honey/lemon if not contraindicated." },
      { title: "Irritant avoidance", detail: "Avoid smoke, strong fragrances; rest voice as needed." },
    )
  }
  if (has("fever") || has("chills")) {
    suggestions.push(
      { title: "Rest & fluids", detail: "Rest, hydrate; consider acetaminophen/ibuprofen per label if appropriate." },
      {
        title: "Monitor progression",
        detail: "Seek care if >3 days, >39°C/102.2°F, severe headache, stiff neck, confusion, or dehydration.",
      },
    )
  }
  if (has("nausea") || has("vomit") || has("diarrhea") || has("stomach")) {
    suggestions.push(
      { title: "Electrolyte support", detail: "Use oral rehydration; small frequent sips." },
      { title: "Gentle foods", detail: "BRAT‑style (bananas, rice, applesauce, toast) until symptoms ease." },
    )
  }
  if (has("shortness of breath") || has("breathless")) {
    suggestions.push(
      { title: "Breathing pacing", detail: "Pursed‑lip breathing and slow activities; avoid overexertion." },
      {
        title: "Urgent care flags",
        detail: "If chest pain, bluish lips, confusion, or worsening breathlessness, seek urgent care immediately.",
      },
    )
  }
  if (has("chest pain")) {
    suggestions.push({
      title: "Immediate attention",
      detail: "If new/worsening chest pain with sweating, nausea, or radiating pain—seek emergency care now.",
    })
  }

  // Goals
  if (wants("sleep") || wants("better sleep") || wants("insomnia")) {
    suggestions.push(
      { title: "Bedtime routine", detail: "Consistent schedule; dim lights; no screens 60 minutes before bed." },
      { title: "Caffeine timing", detail: "Avoid caffeine after early afternoon; finish dinner 2–3 hours before bed." },
    )
  }
  if (wants("weight") || wants("lose") || wants("fat")) {
    suggestions.push(
      { title: "Plate method", detail: "Half vegetables, quarter protein, quarter whole grains; limit sugary drinks." },
      { title: "Activity target", detail: "150 min/week moderate cardio and 2 strength sessions as tolerated." },
    )
  }
  if (wants("energy")) {
    suggestions.push(
      { title: "Meal rhythm", detail: "3 meals + optional snack; pair complex carbs with protein to avoid crashes." },
      { title: "Light exposure", detail: "10–20 minutes morning daylight to anchor circadian rhythm." },
    )
  }
  if (wants("stress") || wants("calm") || wants("anxiety")) {
    suggestions.push(
      { title: "Breathing micro‑breaks", detail: "4‑7‑8 or box breathing 2–3×/day for 3–5 minutes." },
      { title: "Boundaries", detail: "Daily 10‑minute buffer to offload tasks and reduce overwhelm." },
    )
  }
  if (wants("heart") || wants("blood pressure")) {
    suggestions.push(
      { title: "Sodium audit", detail: "Limit highly processed foods; target <2,300mg sodium/day unless advised." },
      { title: "Cardio habit", detail: "Regular walking, cycling, or swimming most days." },
    )
  }
  if (wants("sugar") || wants("glucose") || wants("diabetes")) {
    suggestions.push(
      { title: "Fiber first", detail: "Prioritize fiber (vegetables, legumes) and pair carbs with protein." },
      { title: "Walk after meals", detail: "10–15 minute post‑meal walks improve glucose handling." },
    )
  }

  // Age-informed safety
  if (age && age >= 65) {
    suggestions.push({
      title: "Balance & strength",
      detail: "Light resistance training and balance exercises 2–3×/week as tolerated.",
    })
  }

  // Ensure non-empty/static
  const baseFallback = [
    { title: "Hydration baseline", detail: "Aim for pale-yellow urine; ~2–3L/day unless restricted." },
    { title: "Regular meals", detail: "Protein, fiber, and healthy fats in each meal to sustain energy." },
    { title: "Daily movement", detail: "Accumulate 7000–10000 steps/day or 150 min/week moderate activity." },
  ]
  const merged = [...suggestions]
  baseFallback.forEach((s) => {
    if (!merged.find((m) => m.title === s.title)) merged.push(s)
  })

  const seen = new Set<string>()
  const deduped = merged.filter((s) => {
    const k = s.title.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  const final = deduped.slice(0, 8)

  const msgParts = []
  if (symptoms) msgParts.push(`Based on the symptoms you shared (${symptoms})`)
  if (goals) msgParts.push(`and your goals (${goals})`)
  if (lifestyle) msgParts.push(`with your lifestyle (${lifestyle})`)
  const message =
    (msgParts.length ? `${msgParts.join(" ")}.` : "Here is a practical health plan tailored to your inputs.") +
    " Use these as starting points and adjust with your clinician if needed."

  const tips = final.slice(0, 3).map((s) => s.title)
  const caution =
    "Seek urgent care for red‑flag symptoms: severe or worsening pain, chest pain, trouble breathing, fainting, confusion, high fever >3 days, or signs of dehydration."

  return { message, tips, suggestions: final, caution }
}
