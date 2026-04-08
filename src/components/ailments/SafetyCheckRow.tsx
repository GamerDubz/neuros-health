import { TriageItem } from '@/lib/db/ailments'

const TRIAGE_UI: Record<string, { bg: string; text: string; icon: string; title: string }> = {
  home_care: { bg: '#E6F4EA', text: '#137333', icon: 'home_health', title: 'Home care advice' },
  see_gp:    { bg: '#F8DE82', text: '#5c4d1f', icon: 'medical_services', title: 'When to see a doctor or pharmacist' },
  emergency: { bg: '#FFEAEA', text: '#B3261E', icon: 'warning', title: 'Emergency guidance' },
}

export default function SafetyCheckRow({ triage, whenToSeekHelp }: { triage: TriageItem[], whenToSeekHelp?: string | null }) {
  // Group triage items by level
  const grouped = triage.reduce((acc, item) => {
    const level = item.level || 'home_care'
    if (!acc[level]) acc[level] = []
    acc[level].push(item)
    return acc
  }, {} as Record<string, TriageItem[]>)

  const levelsRendered = Object.keys(grouped).map(level => {
    const items = grouped[level]
    const style = TRIAGE_UI[level] || TRIAGE_UI.home_care

    return (
      <div key={level} className="rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]" style={{ backgroundColor: style.bg }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined" style={{ color: style.text }} aria-hidden>{style.icon}</span>
          <h3 className="font-bold tracking-wider text-[13px] uppercase" style={{ color: style.text }}>
            {style.title}
          </h3>
        </div>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-[20px] mt-0.5" style={{ color: style.text }} aria-hidden>
                info
              </span>
              <p className="text-[15px] font-medium leading-snug" style={{ color: style.text }}>
                {item.detail || item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  })

  return (
    <div className="space-y-6">
      {levelsRendered}
      
      {whenToSeekHelp && (
        <div className="rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-[#F8DE82]">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#5c4d1f]" aria-hidden>medical_services</span>
            <h3 className="font-bold text-[#5c4d1f] tracking-wider text-[13px] uppercase">Additional Guidance</h3>
          </div>
          <div className="flex gap-3 items-start">
            <span className="material-symbols-outlined text-[#5c4d1f] text-[20px] mt-0.5" aria-hidden>info</span>
            <p className="text-[#5c4d1f] text-[15px] font-medium leading-snug">{whenToSeekHelp}</p>
          </div>
        </div>
      )}
    </div>
  )
}
