// src/lib/db/search.ts

import { searchMedicines, searchConditions, searchWellbeing } from './nz-health'

export interface SearchResult {
  type: 'medicine' | 'condition' | 'wellbeing'
  slug: string
  title: string
  description: string | null
  href: string
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  const [medicines, conditions, wellbeing] = await Promise.all([
    searchMedicines(query, 5),
    searchConditions(query, 5),
    searchWellbeing(query, 3),
  ])

  const results: SearchResult[] = [
    ...medicines.map((m: any) => ({
      type: 'medicine' as const,
      slug: m.slug,
      title: m.display_name,
      description: m.meta_description,
      href: `/medications/${m.slug}`,
    })),
    ...conditions.map((c: any) => ({
      type: 'condition' as const,
      slug: c.slug,
      title: c.condition_name,
      description: c.meta_description,
      href: `/health/conditions/${c.slug}`,
    })),
    ...wellbeing.map((w: any) => ({
      type: 'wellbeing' as const,
      slug: w.slug,
      title: w.topic_name,
      description: w.meta_description,
      href: `/health/wellbeing/${w.slug}`,
    })),
  ]

  return results
}
