'use client'
import { useState } from 'react'

interface Props {
  overview: string | null
  causes: string | null
  symptomsDetail: string | null
  whenToSeekHelp: string | null
  sourceUrl: string | null
  lastReviewed: string | null
}

function SubSection({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-surface-container-low">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-surface-container-low transition-colors"
      >
        <span className="font-semibold text-on-surface text-sm">{title}</span>
        <span
          className={`material-symbols-outlined text-outline text-xl transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-on-surface-variant leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  )
}

export default function DeepDiveAccordion({
  overview,
  causes,
  symptomsDetail,
  whenToSeekHelp,
  sourceUrl,
  lastReviewed,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-surface-container-low transition-colors min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-outline" aria-hidden>
            menu_book
          </span>
          <span className="font-bold text-on-surface">Read more about this condition</span>
        </div>
        <span
          className={`material-symbols-outlined text-outline text-xl transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          expand_more
        </span>
      </button>

      {open && (
        <>
          {overview      && <SubSection title="What is it?"               content={overview} />}
          {causes        && <SubSection title="What causes it"            content={causes} />}
          {symptomsDetail && <SubSection title="Symptoms in detail"       content={symptomsDetail} />}
          {whenToSeekHelp && <SubSection title="When to get medical help" content={whenToSeekHelp} />}

          {(sourceUrl || lastReviewed) && (
            <div className="px-5 py-4 border-t border-surface-container-low">
              <p className="text-xs text-outline">
                {lastReviewed && `Reviewed: ${lastReviewed} · `}
                Source: Healthify He Puna Waiora
                {sourceUrl && (
                  <>
                    {' · '}
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View source
                    </a>
                  </>
                )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
