import { ActionStep } from '@/lib/db/ailments'

export default function WhatToDoNow({ steps }: { steps: ActionStep[] }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4 p-5 bg-[#F5F7FF] rounded-2xl items-center">
          <div className="w-8 h-8 rounded-full bg-[#115E41] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
            {i + 1}
          </div>
          <p className="text-[#101828] text-[15px] leading-relaxed">
            {step.detail || step.action}
          </p>
        </div>
      ))}
    </div>
  )
}
