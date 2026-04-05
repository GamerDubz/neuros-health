'use client'

import { useState } from 'react'
import type { DrugDetail } from '@/lib/db/drug-detail'

const ICON_MAP: Record<string, string> = {
  clock: '🕒', sun: '🌅', moon: '🌙', food: '🍽️', stomach: '🫙',
  water: '💧', repeat: '🔁', pill: '💊', no_alcohol: '🚫',
  warning: '⚠️', doctor: '👨‍⚕️', emergency: '🚨',
}

function renderIcon(name: string) {
  return ICON_MAP[name] || '💊'
}

// ─────────────────────────────────────────────────────────────
// Hero Banner
// ─────────────────────────────────────────────────────────────
function DrugHeroBanner({
  name, brandNames, drugClass, fundedNz, fundedNote,
}: {
  name: string
  brandNames: string[]
  drugClass: string | null
  fundedNz: boolean
  fundedNote: string | null
}) {
  return (
    <div className="bg-gradient-to-br from-[#00685d] to-[#008376] px-6 pt-8 pb-6 rounded-[2rem]">
      {drugClass && (
        <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
          {drugClass}
        </span>
      )}
      <h1 className="text-3xl font-extrabold text-white tracking-tight">{name}</h1>
      {brandNames.length > 0 && (
        <p className="text-white/70 text-sm mt-1">
          Also known as: {brandNames.join(', ')}
        </p>
      )}
      {fundedNz && (
        <div className="mt-3 inline-flex items-center gap-2 bg-[#ffd87c] text-[#765a05] px-4 py-1.5 rounded-full text-sm font-bold">
          ✓ Funded by PHARMAC in NZ
          {fundedNote && <span className="font-normal"> · {fundedNote}</span>}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Big 3 Row
// ─────────────────────────────────────────────────────────────
function BigThreeRow({ items }: { items: { icon: string; label: string }[] }) {
  if (!items?.length) return null
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.slice(0, 3).map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-[0_10px_40px_rgba(21,28,39,0.04)] min-h-[88px]"
        >
          <span className="text-3xl" aria-hidden>{renderIcon(item.icon)}</span>
          <span className="text-xs font-bold text-[#151c27] text-center leading-tight">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Vibe Summary
// ─────────────────────────────────────────────────────────────
function VibeSummary({ text }: { text: string | null }) {
  if (!text) return null
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#00685d] mb-2">
        What this medicine does
      </p>
      <p className="text-[#151c27] text-base leading-relaxed">{text}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Accordion Shell
// ─────────────────────────────────────────────────────────────
function Accordion({
  icon, title, count, children, onCollapse,
}: {
  icon: string
  title: string
  count?: number
  children: React.ReactNode
  onCollapse?: () => void
}) {
  const [open, setOpen] = useState(false)
  function toggle() {
    if (open && onCollapse) onCollapse()
    setOpen(!open)
  }
  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-4 min-h-[56px] text-left active:bg-[#f0f3ff] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-bold text-[#151c27]">
            {title}
            {count !== undefined && count > 0 && (
              <span className="ml-2 text-xs font-normal text-[#6d7a77]">({count})</span>
            )}
          </span>
        </div>
        <span className={`text-[#6d7a77] transition-transform duration-200 text-sm ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="border-t border-[#f0f3ff]">{children}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Side Effects — Traffic Light
// ─────────────────────────────────────────────────────────────
const TIERS = [
  { key: 'green' as const, label: 'Common & Mild', headerBg: 'bg-[#dcfce7]', headerText: 'text-[#166534]', dot: 'bg-[#22c55e]', icon: '🟢' },
  { key: 'yellow' as const, label: 'Tell Your Pharmacist', headerBg: 'bg-[#fef9c3]', headerText: 'text-[#854d0e]', dot: 'bg-[#f59e0b]', icon: '🟡' },
  { key: 'red' as const, label: 'Emergency — Act Now', headerBg: 'bg-[#fee2e2]', headerText: 'text-[#991b1b]', dot: 'bg-[#ef4444]', icon: '🔴' },
]

function SideEffectsContent({ sideEffects }: { sideEffects: DrugDetail['side_effects'] }) {
  const hasAny = TIERS.some(t => (sideEffects?.[t.key] || []).length > 0)
  if (!hasAny) {
    return (
      <p className="text-sm text-[#6d7a77] text-center py-6">
        No specific side effects recorded. Always tell your pharmacist if something feels wrong.
      </p>
    )
  }
  return (
    <>
      {TIERS.map(tier => {
        const items = sideEffects?.[tier.key] || []
        if (!items.length) return null
        return (
          <div key={tier.key}>
            <div className={`px-5 py-2 ${tier.headerBg} flex items-center gap-2`}>
              <span>{tier.icon}</span>
              <span className={`text-sm font-bold ${tier.headerText}`}>{tier.label}</span>
            </div>
            <div className="px-5 py-3 space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${tier.dot}`} />
                  <div>
                    <span className="font-semibold text-[#151c27] text-sm">{item.effect}</span>
                    <p className="text-[#3d4947] text-sm mt-0.5">{item.note}</p>
                  </div>
                </div>
              ))}
              {tier.key === 'red' && (
                <a
                  href="tel:111"
                  className="flex items-center justify-center gap-2 bg-[#ba1a1a] text-white rounded-full h-12 font-bold text-sm mt-2 w-full"
                >
                  📞 Call 111 Now
                </a>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Interactions
// ─────────────────────────────────────────────────────────────
const SEV: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-[#e2e8f8]', text: 'text-[#3d4947]', label: 'Low' },
  moderate: { bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]', label: 'Moderate' },
  high: { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]', label: 'High' },
}

function InteractionsContent({ interactions }: { interactions: DrugDetail['interactions'] }) {
  const [search, setSearch] = useState('')
  const filtered = interactions.filter(i =>
    i.interactant?.toLowerCase().includes(search.toLowerCase())
  )
  if (!interactions.length) {
    return <p className="text-sm text-[#6d7a77] text-center py-6 px-5">No interactions recorded.</p>
  }
  return (
    <div className="px-5 pb-5">
      <input
        type="text"
        placeholder="Search interactions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full h-11 bg-[#e2e8f8] rounded-xl px-4 text-sm mt-4 mb-3 text-[#151c27] placeholder:text-[#6d7a77] outline-none focus:ring-2 focus:ring-[#00685d]"
      />
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const s = SEV[item.severity] || SEV.low
          return (
            <div key={i} className="flex items-start gap-3 py-1">
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 mt-0.5 ${s.bg} ${s.text}`}>
                {s.label}
              </span>
              <div>
                <span className="font-semibold text-[#151c27] text-sm">{item.interactant}</span>
                <p className="text-[#3d4947] text-sm mt-0.5">{item.note}</p>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-[#6d7a77] text-center py-3">No interactions found</p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// How To Take
// ─────────────────────────────────────────────────────────────
function HowToTakeContent({ items }: { items: DrugDetail['how_to_take'] }) {
  return (
    <div className="px-5 pb-5 space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 py-2">
          <span className="text-xl flex-shrink-0 mt-0.5">{renderIcon(item.icon)}</span>
          <div>
            <span className="font-semibold text-[#151c27] text-sm">{item.label}: </span>
            <span className="text-[#3d4947] text-sm">{item.detail}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Red Zone — Always visible
// ─────────────────────────────────────────────────────────────
function RedZoneBox({ redZone }: { redZone: DrugDetail['red_zone'] }) {
  if (!redZone) return null
  return (
    <div className="rounded-2xl bg-[#fef2f2] border-l-4 border-[#ba1a1a] p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🚨</span>
        <h3 className="font-bold text-[#991b1b] text-sm uppercase tracking-wider">
          Overdose / Emergency
        </h3>
      </div>
      {redZone.overdose_signs?.length > 0 && (
        <>
          <p className="text-xs font-bold text-[#991b1b] uppercase mb-1">Warning signs</p>
          <ul className="text-sm text-[#3d4947] mb-4 space-y-1">
            {redZone.overdose_signs.map((sign, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#ba1a1a] mt-0.5">•</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="text-sm font-semibold text-[#151c27] mb-3">{redZone.action}</p>
      <div className="flex gap-2">
        {redZone.phone_111 && (
          <a
            href="tel:111"
            className="flex-1 flex items-center justify-center gap-2 bg-[#ba1a1a] text-white rounded-full h-12 font-bold text-sm"
          >
            📞 Call 111
          </a>
        )}
        {redZone.phone_poisons && (
          <a
            href={`tel:${redZone.phone_poisons.replace(/\s+/g, '')}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#ba1a1a] text-[#ba1a1a] rounded-full h-12 font-bold text-sm"
          >
            Poisons: {redZone.phone_poisons}
          </a>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Teach Back Quiz
// ─────────────────────────────────────────────────────────────
function TeachBackQuizModal({
  quiz, onClose,
}: {
  quiz: NonNullable<DrugDetail['teach_back_quiz']>
  onClose: () => void
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = picked === quiz.correct_index

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#00685d]">Quick Check</p>
        <p className="text-lg font-bold text-[#151c27] leading-snug">{quiz.question}</p>
        <div className="space-y-2">
          {quiz.options.map((opt, i) => {
            const isCorrect = i === quiz.correct_index
            const isPicked = i === picked
            const base = 'w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-colors'
            const color = !answered
              ? 'border-[#e2e8f8] text-[#151c27] hover:border-[#00685d]'
              : isCorrect
                ? 'border-[#22c55e] bg-[#dcfce7] text-[#166534]'
                : isPicked
                  ? 'border-[#ef4444] bg-[#fee2e2] text-[#991b1b]'
                  : 'border-[#e2e8f8] text-[#6d7a77] opacity-60'
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => setPicked(i)}
                className={`${base} ${color}`}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {answered && (
          <div className={`rounded-xl p-4 ${correct ? 'bg-[#dcfce7]' : 'bg-[#fef9c3]'}`}>
            <p className="text-sm font-bold mb-1">{correct ? '✓ Nice one!' : 'Good try!'}</p>
            <p className="text-sm text-[#3d4947]">{quiz.explanation}</p>
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full h-12 bg-[#00685d] text-white rounded-full font-bold text-sm"
        >
          {answered ? 'Done' : 'Skip'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Card
// ─────────────────────────────────────────────────────────────
export default function NeurosHealthCard({ drug }: { drug: DrugDetail }) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizShown, setQuizShown] = useState(false)

  function handleHowToTakeCollapse() {
    if (drug.teach_back_quiz && !quizShown) {
      setShowQuiz(true)
      setQuizShown(true)
    }
  }

  return (
    <div className="space-y-4">
      <DrugHeroBanner
        name={drug.drug_name}
        brandNames={drug.brand_names || []}
        drugClass={drug.drug_class}
        fundedNz={drug.funded_nz}
        fundedNote={drug.funded_note}
      />

      <BigThreeRow items={drug.big3 || []} />
      <VibeSummary text={drug.vibe_summary} />

      <div className="space-y-3">
        <Accordion icon="💊" title="How to Take" onCollapse={handleHowToTakeCollapse}>
          <HowToTakeContent items={drug.how_to_take || []} />
        </Accordion>
        <Accordion icon="⚠️" title="Side Effects">
          <SideEffectsContent sideEffects={drug.side_effects} />
        </Accordion>
        <Accordion icon="🔄" title="Interactions" count={drug.interactions?.length || 0}>
          <InteractionsContent interactions={drug.interactions || []} />
        </Accordion>
      </div>

      <RedZoneBox redZone={drug.red_zone} />

      <div className="text-xs text-[#6d7a77] text-center pt-2 pb-4">
        {drug.last_reviewed_date && <>Reviewed {drug.last_reviewed_date} · </>}
        Information from Healthify He Puna Waiora &amp; Medsafe NZ
        {drug.medsafe_cmi_url && (
          <>
            {' · '}
            <a
              href={drug.medsafe_cmi_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Download official CMI PDF
            </a>
          </>
        )}
      </div>

      {showQuiz && drug.teach_back_quiz && (
        <TeachBackQuizModal
          quiz={drug.teach_back_quiz}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  )
}
