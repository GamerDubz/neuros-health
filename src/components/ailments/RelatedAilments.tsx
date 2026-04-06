import Link from 'next/link'

export default function RelatedAilments({ names }: { names: string[] }) {
  if (!names?.length) return null

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-outline mb-3">
        You might also want to check
      </p>
      <div className="flex gap-2 flex-wrap">
        {names.slice(0, 5).map((name, i) => (
          <Link
            key={i}
            href={`/health/ailments/${name.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center px-4 py-2 bg-surface-container-lowest rounded-full
                       text-sm font-semibold text-primary
                       shadow-[0_10px_40px_rgba(21,28,39,0.04)]
                       hover:bg-surface-container-low active:scale-95 transition-all"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  )
}
