import { ActionStep } from '@/lib/db/ailments'

export default function WhatToDoNow({ steps }: { steps: ActionStep[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          What to do right now
        </p>
      </div>
      <div className="divide-y divide-surface-container-low">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-4">
            <span
              className="material-symbols-outlined text-2xl text-primary shrink-0 mt-0.5"
              aria-hidden
            >
              {step.icon}
            </span>
            <div>
              <span className="font-bold text-on-surface text-sm">{step.action}: </span>
              <span className="text-on-surface-variant text-sm">{step.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
