'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAilmentBySlug, AilmentDetail } from '@/lib/db/ailments'
import AilmentScaffold from '@/components/ailments/AilmentScaffold'

export function AilmentDetailClient({ slug }: { slug: string }) {
  const router = useRouter()
  const [ailment, setAilment] = useState<AilmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getAilmentBySlug(slug).then(data => {
      if (!data) setNotFound(true)
      else setAilment(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl" aria-hidden>
          progress_activity
        </span>
      </div>
    )
  }

  if (notFound || !ailment) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="material-symbols-outlined text-5xl text-outline" aria-hidden>
          search_off
        </span>
        <h1 className="text-xl font-bold text-on-surface">Condition not found</h1>
        <p className="text-on-surface-variant text-sm">
          We couldn&apos;t find information for this condition yet.
        </p>
        <button
          onClick={() => router.push('/health')}
          className="mt-2 px-6 py-3 bg-primary text-on-primary rounded-full font-bold text-sm active:scale-95 transition-transform"
        >
          Back to Health Library
        </button>
      </div>
    )
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-6 py-4 flex items-center gap-4 h-16 shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => router.push('/health')}
          className="p-1 -ml-1 rounded-full text-[#115E41] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[24px]" aria-hidden>arrow_back</span>
        </button>
        <h2 className="font-bold text-[19px] text-[#101828] tracking-tight truncate">
          {ailment.common_name}
        </h2>
      </header>

      <div className="pt-16 pb-4 bg-[#F9FAFF]">
        <AilmentScaffold ailment={ailment} />
      </div>
    </>
  )
}
