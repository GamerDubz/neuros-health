import { TriageItem } from '@/lib/db/ailments'

const TRIAGE_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  home_care: { border: '#22c55e', bg: '#f0fdf4', text: '#166534' },
  see_gp:    { border: '#f59e0b', bg: '#fffbeb', text: '#92400e' },
  emergency: { border: '#ba1a1a', bg: '#fef2f2', text: '#991b1b' },
}

export default function SafetyCheckRow({ triage }: { triage: TriageItem[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
        What level of care do I need?
      </p>
      <div className="grid grid-cols-3 gap-3">
        {triage.map((item, i) => {
          const style = TRIAGE_STYLES[item.level] || TRIAGE_STYLES.home_care
          return (
            <div
              key={i}
              className="rounded-xl p-3 border-l-4 flex flex-col gap-1"
              style={{ borderColor: style.border, backgroundColor: style.bg }}
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={{ color: style.border }}
                aria-hidden
              >
                {item.icon}
              </span>
              <span className="font-bold text-xs" style={{ color: style.text }}>
                {item.label}
              </span>
              <span
                className="text-xs leading-snug"
                style={{ color: style.text, opacity: 0.8 }}
              >
                {item.detail}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
