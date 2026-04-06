import { CATEGORY_COLOURS } from '@/lib/db/ailments'

export default function AilmentHeroBanner({
  name,
  summary,
  primaryTag,
}: {
  name: string
  summary: string
  primaryTag: string
}) {
  const colours = CATEGORY_COLOURS[primaryTag] || CATEGORY_COLOURS.general

  return (
    <div
      className="px-6 pt-10 pb-8"
      style={{
        background: `linear-gradient(135deg, ${colours.from} 0%, ${colours.to} 100%)`,
      }}
    >
      <h1
        className="text-3xl font-extrabold tracking-tight mb-2"
        style={{ color: colours.text }}
      >
        {name}
      </h1>
      <p
        className="text-base leading-relaxed"
        style={{ color: colours.text, opacity: 0.9 }}
      >
        {summary}
      </p>
    </div>
  )
}
