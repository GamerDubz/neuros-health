'use client'
import { useState, useEffect } from 'react'
import { getAllAilments, getAilmentsByCategory, AilmentSummary } from '@/lib/db/ailments'
import { AilmentEmptyState } from '@/components/health/AilmentEmptyState'
import { AilmentGrid } from '@/components/health/AilmentGrid'
import { AilmentLoadingState } from '@/components/health/AilmentLoadingState'
import { HealthCategoryFilters } from '@/components/health/HealthCategoryFilters'
import { HealthLibrarySearchField } from '@/components/health/HealthLibrarySearchField'

export default function HealthLibraryPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [ailments, setAilments] = useState<AilmentSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // We already set loading to true when the category is selected via the filter
    const load = async () => {
      const data = selectedCategory === 'all'
        ? await getAllAilments(500)
        : await getAilmentsByCategory(selectedCategory, 200)
      setAilments(data)
      setLoading(false)
    }
    load()
  }, [selectedCategory])

  const filtered = ailments.filter(a => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      a.common_name.toLowerCase().includes(q) ||
      a.two_line_summary?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-5xl">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-24">
          <HealthLibrarySearchField
            query={query}
            placeholder="Search conditions..."
            onQueryChange={setQuery}
            className="mb-6"
            inputClassName="rounded-full text-sm"
          />
          <div className="p-6 bg-primary-container/30 rounded-3xl">
            <h3 className="text-xs font-black uppercase tracking-tighter text-primary mb-2">
              NZ Health Library
            </h3>
            <p className="text-xs text-on-primary-container/70 leading-relaxed font-medium">
              Browse over 1,000 conditions reviewed by New Zealand clinical experts.
            </p>
          </div>
        </div>

        <div className="pt-20 lg:pt-0 pb-36 px-6 lg:px-0">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
              Health Conditions
            </h1>
            <p className="text-on-surface-variant text-base">
              General guidance for everyday health concerns.
            </p>
          </div>

          {/* Mobile Search */}
          <HealthLibrarySearchField
            query={query}
            placeholder="Search conditions..."
            onQueryChange={setQuery}
            className="mb-4 lg:hidden"
            inputClassName="rounded-xl text-base placeholder:text-outline/60 duration-200"
          />

          {/* Category chips */}
          <HealthCategoryFilters
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setLoading(true);
            }}
          />

          {/* Grid */}
          {loading ? (
            <AilmentLoadingState />
          ) : filtered.length === 0 ? (
            <AilmentEmptyState />
          ) : (
            <AilmentGrid ailments={filtered} />
          )}
        </div>
      </div>
    </div>
  )
}
