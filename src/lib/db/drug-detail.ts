// src/lib/db/drug-detail.ts
// Queries for the structured drug_detail table (Neuros Health Card data).

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export type Big3Item = { icon: string; label: string }
export type HowToTakeItem = { icon: string; label: string; detail: string }
export type SideEffectItem = { effect: string; note: string }
export type SideEffects = {
  green: SideEffectItem[]
  yellow: SideEffectItem[]
  red: SideEffectItem[]
}
export type Interaction = { interactant: string; severity: 'low' | 'moderate' | 'high'; note: string }
export type RedZone = {
  overdose_signs: string[]
  action: string
  phone_111: boolean
  phone_poisons: string
}
export type TeachBackQuiz = {
  question: string
  options: string[]
  correct_index: number
  explanation: string
}

export type DrugDetail = {
  id: string
  medicines_id: number | null
  slug: string
  drug_name: string
  brand_names: string[]
  drug_class: string | null
  vibe_summary: string | null
  big3: Big3Item[]
  how_to_take: HowToTakeItem[]
  side_effects: SideEffects
  interactions: Interaction[]
  red_zone: RedZone | null
  teach_back_quiz: TeachBackQuiz | null
  funded_nz: boolean
  funded_note: string | null
  healthify_url: string | null
  medsafe_cmi_url: string | null
  last_reviewed_date: string | null
  created_at: string
  updated_at: string
}

/**
 * Get a structured drug detail by slug.
 * Returns null if no row exists (page can fall back to raw medicines data).
 */
export async function getDrugDetailBySlug(slug: string): Promise<DrugDetail | null> {
  const { data, error } = await supabase
    .from('drug_detail')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('getDrugDetailBySlug error:', error)
    return null
  }
  if (!data) return null

  // Defensive sanitise: strip ATC codes / noise that slipped in from upstream parser
  const cleaned = { ...data } as DrugDetail
  if (cleaned.drug_class) {
    cleaned.drug_class = cleaned.drug_class
      .replace(/^ATC\s*code\s*/i, '')
      .replace(/[A-Z]\d{2}[A-Z]{2}\d{2}/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (cleaned.drug_class.length > 60) {
      const comma = cleaned.drug_class.indexOf(',')
      cleaned.drug_class = comma > 5 && comma < 60
        ? cleaned.drug_class.slice(0, comma).trim()
        : cleaned.drug_class.slice(0, 60).trim()
    }
    if (!cleaned.drug_class) cleaned.drug_class = null
  }
  return cleaned
}

/**
 * Search drug_detail by drug_name or brand_names (simple ilike).
 */
export async function searchDrugDetail(query: string, limit = 10) {
  if (!query) return []
  const { data, error } = await supabase
    .from('drug_detail')
    .select('id, slug, drug_name, brand_names, drug_class, vibe_summary, funded_nz')
    .ilike('drug_name', `%${query}%`)
    .limit(limit)

  if (error) {
    console.error('searchDrugDetail error:', error)
    return []
  }
  return data || []
}

/** All slugs (for generateStaticParams if ever needed). */
export async function getAllDrugDetailSlugs() {
  const { data } = await supabase
    .from('drug_detail')
    .select('slug, drug_name')
    .order('drug_name')
  return data || []
}

// ─────────────────────────────────────────────────────────────
// Synthesizer: build a minimal DrugDetail from a raw medicines row
// Used when no structured drug_detail row exists yet.
// ─────────────────────────────────────────────────────────────

function firstSentences(text: string, n: number): string {
  if (!text) return ''
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  return sentences.slice(0, n).join(' ').trim()
}

function cleanText(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/\(external link\)/gi, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/Read more about[^.]+\./gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function hasAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some(k => lower.includes(k))
}

/**
 * Build a NeurosHealthCard-compatible DrugDetail shape from a raw medicines row.
 * Used as a fallback so every drug gets the punchy card layout.
 */
export function synthesizeDrugDetail(medicine: any): DrugDetail {
  const dosage = cleanText(medicine?.dosage_how_to_take || '').toLowerCase()
  const what = cleanText(medicine?.what_it_is || medicine?.meta_description || '')
  const combined = dosage + ' ' + what.toLowerCase()

  // Big 3
  const big3: Big3Item[] = []
  if (hasAny(combined, ['morning', 'breakfast'])) big3.push({ icon: 'sun', label: 'Morning' })
  else if (hasAny(combined, ['night', 'bedtime', 'evening'])) big3.push({ icon: 'moon', label: 'Night-time' })
  else if (hasAny(combined, ['twice', '2 times', 'two times'])) big3.push({ icon: 'clock', label: 'Twice Daily' })
  else if (hasAny(combined, ['once', 'daily'])) big3.push({ icon: 'clock', label: 'Once Daily' })
  else big3.push({ icon: 'clock', label: 'As Directed' })

  if (hasAny(combined, ['empty stomach', 'before meals', 'before food'])) big3.push({ icon: 'stomach', label: 'Empty Stomach' })
  else if (hasAny(combined, ['with food', 'with meals', 'after food'])) big3.push({ icon: 'food', label: 'With Food' })
  else big3.push({ icon: 'pill', label: 'Follow Label' })

  if (hasAny(combined, ['glass of water', 'plenty of water', 'full glass'])) big3.push({ icon: 'water', label: 'Full Glass of Water' })
  else if (hasAny(combined, ['swallow whole', 'do not crush'])) big3.push({ icon: 'pill', label: 'Swallow Whole' })
  else big3.push({ icon: 'water', label: 'With Water' })

  // How to take
  const howToTake: HowToTakeItem[] = []
  const dosageRaw = cleanText(medicine?.dosage_how_to_take || '')
  if (dosageRaw) {
    howToTake.push({ icon: 'pill', label: 'Instructions', detail: firstSentences(dosageRaw, 3) })
  } else {
    howToTake.push({ icon: 'pill', label: 'Instructions', detail: 'Take as directed by your doctor or pharmacist.' })
  }
  const missed = cleanText(medicine?.missed_dose || '')
  if (missed) howToTake.push({ icon: 'warning', label: 'Missed Dose', detail: firstSentences(missed, 2) })

  // Vibe summary
  const vibeSummary = what ? firstSentences(what, 2) : `This medicine is prescribed for specific conditions. Follow your doctor's instructions.`

  // Side effects — minimal: pull serious into red, common into green
  const serious = cleanText(medicine?.serious_side_effects || '')
  const common = cleanText(medicine?.common_side_effects || medicine?.side_effects_combined || medicine?.side_effects || '')
  const sideEffects: SideEffects = { green: [], yellow: [], red: [] }

  if (common) {
    const line = firstSentences(common, 2)
    sideEffects.green.push({ effect: 'Common side effects', note: line || 'Usually mild and settle with time.' })
  }
  if (serious) {
    sideEffects.red.push({ effect: 'Serious reactions', note: firstSentences(serious, 2) || 'Stop and call 111 immediately.' })
  } else {
    sideEffects.red.push({
      effect: 'Severe allergic reaction',
      note: 'Stop and call 111 immediately if you get rash, swelling, or trouble breathing.',
    })
  }

  // Red zone
  const overdose = cleanText(medicine?.overdose || '')
  const redZone: RedZone = {
    overdose_signs: overdose ? [firstSentences(overdose, 1)] : ['Feeling very unwell', 'Unusual symptoms'],
    action: 'Call 111 or the NZ Poisons Centre: 0800 764 766 immediately.',
    phone_111: true,
    phone_poisons: '0800 764 766',
  }

  // Interactions — keep simple
  const interactions: Interaction[] = []
  const drugInt = cleanText(medicine?.drug_interactions || '')
  const foodInt = cleanText(medicine?.food_alcohol_interactions || '')
  if (drugInt) {
    interactions.push({ interactant: 'Other medicines', severity: 'moderate', note: firstSentences(drugInt, 1) })
  }
  if (foodInt.toLowerCase().includes('alcohol')) {
    interactions.push({ interactant: 'Alcohol', severity: 'moderate', note: firstSentences(foodInt, 1) })
  }

  // Drug class — sanitise ATC codes
  let drugClass: string | null = medicine?.therapeutic_group || medicine?.category || null
  if (drugClass) {
    drugClass = drugClass
      .replace(/^ATC\s*code\s*/i, '')
      .replace(/[A-Z]\d{2}[A-Z]{2}\d{2}/g, '')
      .replace(/CAS\s*Number[:\s]*[\d\-()a-z\s]*/gi, '')
      .trim()
    if (drugClass.length > 60) {
      const comma = drugClass.indexOf(',')
      drugClass = comma > 5 && comma < 60 ? drugClass.slice(0, comma).trim() : drugClass.slice(0, 60).trim()
    }
    if (!drugClass) drugClass = null
  }

  return {
    id: `synthetic-${medicine?.slug || medicine?.id || 'unknown'}`,
    medicines_id: medicine?.id || null,
    slug: medicine?.slug || '',
    drug_name: medicine?.display_name || medicine?.generic_name || 'Medicine',
    brand_names: Array.isArray(medicine?.brand_names) ? medicine.brand_names.slice(0, 6) : [],
    drug_class: drugClass,
    vibe_summary: vibeSummary,
    big3,
    how_to_take: howToTake,
    side_effects: sideEffects,
    interactions,
    red_zone: redZone,
    teach_back_quiz: null,
    funded_nz: Boolean(medicine?.funded_subsidised),
    funded_note: null,
    healthify_url: medicine?.healthify_url || null,
    medsafe_cmi_url: medicine?.cmi_pdf_url || null,
    last_reviewed_date: medicine?.last_reviewed || null,
    created_at: '',
    updated_at: '',
  }
}

/** PHARMAC-funded medicines. */
export async function getFundedMedicines(limit = 100) {
  const { data } = await supabase
    .from('drug_detail')
    .select('slug, drug_name, brand_names, drug_class, funded_note')
    .eq('funded_nz', true)
    .limit(limit)
  return data || []
}
