import { createClient } from '@/lib/supabase/client'

// Category gradient colours — used for hero banners and grid card icons
export const CATEGORY_COLOURS: Record<string, { from: string; to: string; text: string }> = {
  skin:          { from: '#f9a8d4', to: '#fb7185', text: '#ffffff' },
  respiratory:   { from: '#93c5fd', to: '#60a5fa', text: '#ffffff' },
  digestive:     { from: '#86efac', to: '#4ade80', text: '#166534' },
  pain:          { from: '#d8b4fe', to: '#a78bfa', text: '#ffffff' },
  fever:         { from: '#fca5a5', to: '#f87171', text: '#ffffff' },
  allergy:       { from: '#fdba74', to: '#fb923c', text: '#ffffff' },
  mental_health: { from: '#c4b5fd', to: '#8b5cf6', text: '#ffffff' },
  eye_ear:       { from: '#a5f3fc', to: '#22d3ee', text: '#164e63' },
  general:       { from: '#8cf5e4', to: '#00685d', text: '#ffffff' },
}

export interface AilmentSummary {
  id: string
  slug: string
  common_name: string
  two_line_summary: string
  condition_tags: string[]
}

export interface AilmentDetail extends AilmentSummary {
  health_conditions_id: number | null
  triage: TriageItem[]
  what_to_do_now: ActionStep[]
  overview: string | null
  causes: string | null
  symptoms_detail: string | null
  when_to_seek_help: string | null
  related_ailments: string[]
  emergency_numbers: EmergencyNumbers
  healthify_url: string | null
  last_reviewed_date: string | null
  parse_quality: string
}

export interface TriageItem {
  level: 'home_care' | 'see_gp' | 'emergency'
  icon: string
  label: string
  detail: string
}

export interface ActionStep {
  icon: string
  action: string
  detail: string
}

export interface EmergencyNumbers {
  phone_111: boolean
  healthline: string
  poisons_centre: string
}

export async function getAilmentBySlug(slug: string): Promise<AilmentDetail | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('ailment_detail')
    .select('*')
    .eq('slug', slug)
    .single()
  return data || null
}

export async function searchAilments(query: string, limit = 15): Promise<AilmentSummary[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('ailment_detail')
    .select('id, slug, common_name, two_line_summary, condition_tags')
    .or(`common_name.ilike.%${query}%,two_line_summary.ilike.%${query}%`)
    .limit(limit)
  return data || []
}

export async function getAilmentsByCategory(tag: string, limit = 30): Promise<AilmentSummary[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('ailment_detail')
    .select('id, slug, common_name, two_line_summary, condition_tags')
    .contains('condition_tags', [tag])
    .order('common_name')
    .limit(limit)
  return data || []
}

export async function getAllAilments(limit = 500): Promise<AilmentSummary[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('ailment_detail')
    .select('id, slug, common_name, two_line_summary, condition_tags')
    .order('common_name')
    .limit(limit)
  return data || []
}

export async function getAllAilmentSlugs(): Promise<string[]> {
  const supabase = createClient()
  const slugs: string[] = []

  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('ailment_detail')
      .select('slug')
      .range(from, from + 999)
    if (error || !data || data.length === 0) break
    for (const row of data) {
      if (row.slug) slugs.push(row.slug)
    }
    if (data.length < 1000) break
  }

  return slugs
}

export async function getRelatedAilments(slugs: string[]): Promise<AilmentSummary[]> {
  if (!slugs.length) return []
  const supabase = createClient()
  const { data } = await supabase
    .from('ailment_detail')
    .select('id, slug, common_name, two_line_summary, condition_tags')
    .in('slug', slugs.map(s => s.toLowerCase().replace(/\s+/g, '-')))
    .limit(5)
  return data || []
}
