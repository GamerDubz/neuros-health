import { AilmentDetailClient } from '@/components/ailments/AilmentDetailClient'
import { createClient } from '@supabase/supabase-js'

// Pre-render every ailment slug at build time so GitHub Pages
// doesn't return 404 for slugs that weren't statically generated.
export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return [
      { slug: 'acute-hives' },
      { slug: 'common-cold' },
      { slug: 'hay-fever' },
      { slug: 'headache' },
    ]
  }

  const supabase = createClient(url, anonKey)
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

  if (slugs.length === 0) {
    return [
      { slug: 'acute-hives' },
      { slug: 'common-cold' },
      { slug: 'hay-fever' },
      { slug: 'headache' },
    ]
  }

  return slugs.map(slug => ({ slug }))
}

export default function AilmentDetailPage({ params }: { params: { slug: string } }) {
  return <AilmentDetailClient slug={params.slug} />
}
