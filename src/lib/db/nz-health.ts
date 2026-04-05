// src/lib/db/nz-health.ts
// NZ Health Database — Supabase queries for medicines, conditions, wellbeing

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// ─── MEDICINES ────────────────────────────────────────────────────────────────

/**
 * Search medicines by name (autocomplete)
 * Matches on generic name, display name, and brand names
 */
export async function searchMedicines(query: string, limit = 10) {
  if (!query || query.length < 1) return []

  const { data, error } = await supabase
    .rpc('search_medicines', { query, max_results: limit })

  if (error) {
    console.error('Medicine search error:', error)
    // Fallback: simple ilike search
    const { data: fallback } = await supabase
      .from('medicines')
      .select('id, slug, display_name, generic_name, brand_names, category, meta_description')
      .or(`display_name.ilike.%${query}%,generic_name.ilike.%${query}%`)
      .limit(limit)
    return fallback || []
  }

  return data || []
}

/**
 * Get a single medicine by slug
 * Returns all fields for the Drug Info Card
 */
export async function getMedicineBySlug(slug: string) {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Get medicine error:', error)
    return null
  }
  return data
}

/**
 * Get medicine by generic name (exact match)
 */
export async function getMedicineByName(name: string) {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('generic_name', name.toLowerCase().trim())
    .single()

  if (error) {
    // Try display_name match
    const { data: d2 } = await supabase
      .from('medicines')
      .select('*')
      .ilike('display_name', name.trim())
      .single()
    return d2 || null
  }
  return data
}

/**
 * Get multiple medicines by their slugs (for medication list)
 */
export async function getMedicinesBySlugs(slugs: string[]) {
  if (!slugs.length) return []
  const { data, error } = await supabase
    .from('medicines')
    .select('id, slug, display_name, generic_name, brand_names, category, meta_description, forms_available, funded_subsidised, source_healthify, source_medsafe')
    .in('slug', slugs)

  if (error) {
    console.error('Get medicines error:', error)
    return []
  }
  return data || []
}

/**
 * Get medicines by therapeutic group / category
 */
export async function getMedicinesByCategory(category: string, limit = 20) {
  const { data } = await supabase
    .from('medicines')
    .select('id, slug, display_name, generic_name, brand_names, category, meta_description')
    .ilike('category', `%${category}%`)
    .limit(limit)
  return data || []
}

/**
 * Get safety data for a medicine (for Drug Info Card side effects tab)
 */
export async function getMedicineSafety(slug: string) {
  const { data } = await supabase
    .from('medicines_safety')  // Uses the view defined in schema
    .select('*')
    .eq('slug', slug)
    .single()
  return data || null
}


// ─── HEALTH CONDITIONS ────────────────────────────────────────────────────────

/**
 * Search health conditions by name
 */
export async function searchConditions(query: string, limit = 10) {
  if (!query || query.length < 1) return []

  const { data } = await supabase
    .from('health_conditions')
    .select('*')
    .textSearch('search_vector', query, { type: 'plain', config: 'english' })
    .limit(limit)

  if (!data || data.length === 0) {
    // Fallback ilike
    const { data: d2 } = await supabase
      .from('health_conditions')
      .select('*')
      .ilike('condition_name', `%${query}%`)
      .limit(limit)
    return d2 || []
  }
  return data
}

/**
 * Get a single condition by slug
 */
export async function getConditionBySlug(slug: string) {
  const { data } = await supabase
    .from('health_conditions')
    .select('*')
    .eq('slug', slug)
    .single()
  return data || null
}

/**
 * Get conditions list (for the conditions picker in Add Medication flow)
 */
export async function getConditionsList(limit = 200) {
  const { data } = await supabase
    .from('health_conditions')
    .select('id, slug, condition_name, meta_description')
    .not('overview', 'is', null)
    .order('condition_name')
    .limit(limit)
  return data || []
}


// ─── WELLBEING TOPICS ─────────────────────────────────────────────────────────

/**
 * Search wellbeing topics
 */
export async function searchWellbeing(query: string, limit = 10) {
  if (!query || query.length < 1) return []

  const { data } = await supabase
    .from('wellbeing_topics')
    .select('id, slug, topic_name, meta_description, overview')
    .ilike('topic_name', `%${query}%`)
    .limit(limit)
  return data || []
}

/**
 * Get a single wellbeing topic by slug
 */
export async function getWellbeingBySlug(slug: string) {
  const { data } = await supabase
    .from('wellbeing_topics')
    .select('*')
    .eq('slug', slug)
    .single()
  return data || null
}

/**
 * Get wellbeing topics for a category (e.g. diabetes self-management)
 */
export async function getWellbeingByKeyword(keyword: string, limit = 10) {
  const { data } = await supabase
    .from('wellbeing_topics')
    .select('id, slug, topic_name, meta_description, overview')
    .or(`topic_name.ilike.%${keyword}%,main_content.ilike.%${keyword}%`)
    .limit(limit)
  return data || []
}

/**
 * Get all medicine slugs for pre-rendering
 */
export async function getAllMedicineSlugs() {
  const { data } = await supabase
    .from('medicines')
    .select('slug')
  return data || []
}
