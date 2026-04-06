'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllAilments, getAilmentsByCategory, CATEGORY_COLOURS, AilmentSummary } from '@/lib/db/ailments'

const CATEGORIES = [
  { key: 'all',          label: 'All',          icon: 'grid_view' },
  { key: 'respiratory',  label: 'Respiratory',  icon: 'air' },
  { key: 'digestive',    label: 'Digestive',    icon: 'restaurant' },
  { key: 'pain',         label: 'Pain',         icon: 'accessibility' },
  { key: 'skin',         label: 'Skin',         icon: 'face' },
  { key: 'fever',        label: 'Fever',        icon: 'thermostat' },
  { key: 'allergy',      label: 'Allergy',      icon: 'allergy' },
  { key: 'mental_health',label: 'Mental Health',icon: 'psychology' },
  { key: 'eye_ear',      label: 'Eye & Ear',    icon: 'visibility' },
]

export default function HealthLibraryPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [ailments, setAilments] = useState<AilmentSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
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
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-4 text-outline" aria-hidden>search</span>
            <input
              type="text"
              placeholder="Search ailments..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full h-14 bg-surface-container-high rounded-full pl-12 pr-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>
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
              Common Ailments
            </h1>
            <p className="text-on-surface-variant text-base">
              General guidance for everyday health concerns.
            </p>
          </div>

          {/* Mobile Search */}
          <div className="relative h-14 w-full mb-4 lg:hidden">
            <span className="material-symbols-outlined absolute left-4 top-4 text-outline" aria-hidden>search</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search conditions..."
              className="w-full h-full bg-surface-container-high rounded-xl pl-12 pr-4 text-on-surface text-base placeholder:text-outline/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 mb-6 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-all flex-shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-lowest text-on-surface shadow-sm'
                }`}
              >
                <span className="material-symbols-outlined text-base" aria-hidden>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl" aria-hidden>
                progress_activity
              </span>
              <p className="text-on-surface-variant font-bold">Accessing NZ Health Database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-surface-container-low p-8 rounded-3xl text-center mt-4">
              <span className="material-symbols-outlined text-[48px] text-outline/50 mb-4" aria-hidden>
                search_off
              </span>
              <h3 className="font-bold text-lg text-on-surface">No ailments found</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Try searching for a different symptom or condition.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(ailment => {
                const primaryTag = ailment.condition_tags?.[0] || 'general'
                const colours = CATEGORY_COLOURS[primaryTag] || CATEGORY_COLOURS.general
                return (
                  <Link
                    key={ailment.id}
                    href={`/health/ailments/${ailment.slug}`}
                    className="bg-surface-container-lowest p-5 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] active:bg-surface-container-low text-left active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary group block"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                      style={{
                        background: `linear-gradient(135deg, ${colours.from}, ${colours.to})`,
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ color: colours.text }}
                        aria-hidden
                      >
                        health_and_safety
                      </span>
                    </div>
                    <h3 className="font-bold text-on-surface text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
                      {ailment.common_name}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-snug line-clamp-2">
                      {ailment.two_line_summary}
                    </p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
