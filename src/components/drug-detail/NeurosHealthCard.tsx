"use client";

import { useState } from "react";
import type { DrugDetail } from "@/lib/db/drug-detail";
import { DrugHeroBanner } from "@/components/drug-detail/DrugHeroBanner";
import { BigThreeRow } from "@/components/drug-detail/BigThreeRow";
import { VibeSummary } from "@/components/drug-detail/VibeSummary";
import { MaterialIcon } from "@/components/drug-detail/MaterialIcon";

// ─── Tab content components (all inline, no modals) ─────────────────────────

function HowToTakeTab({ drug }: { drug: DrugDetail }) {
  const items = drug.how_to_take || [];
  return (
    <div className="space-y-4">
      {(drug.big3 || []).length > 0 && <BigThreeRow items={drug.big3} />}
      {items.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-container-low">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Steps</p>
          </div>
          <div className="px-5 pb-4 space-y-0 divide-y divide-surface-container-low">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-4">
                <MaterialIcon name={item.icon} className="text-[24px] text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-on-surface text-sm">{item.label}</p>
                  {item.detail && (
                    <p className="text-on-surface-variant text-sm mt-0.5 leading-relaxed">{item.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SideEffectsTab({ drug }: { drug: DrugDetail }) {
  const TIERS = [
    {
      key: "green" as const,
      label: "Common & Mild",
      sub: "Usually settle on their own",
      headerBg: "bg-[#dcfce7]",
      headerText: "text-[#166534]",
      dot: "bg-[#22c55e]",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.2" />
          <path d="M7 12l3.5 3.5L17 8" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: "yellow" as const,
      label: "Tell Your Pharmacist",
      sub: "Worth mentioning at your next visit",
      headerBg: "bg-[#fef9c3]",
      headerText: "text-[#854d0e]",
      dot: "bg-[#f59e0b]",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#f59e0b" opacity="0.2" />
          <path d="M12 7v5" stroke="#854d0e" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1.2" fill="#854d0e" />
        </svg>
      ),
    },
    {
      key: "red" as const,
      label: "Emergency — Act Now",
      sub: "Stop the medicine and seek help immediately",
      headerBg: "bg-error-container",
      headerText: "text-on-error-container",
      dot: "bg-error",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#ba1a1a" opacity="0.15" />
          <path d="M12 7v5" stroke="#ba1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1.2" fill="#ba1a1a" />
        </svg>
      ),
    },
  ];

  const se = drug.side_effects || { green: [], yellow: [], red: [] };

  return (
    <div className="space-y-3">
      {TIERS.map((tier) => {
        const items = se[tier.key] || [];
        if (!items.length) return null;
        return (
          <div key={tier.key} className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
            <div className={`px-5 py-3 flex items-center gap-3 ${tier.headerBg}`}>
              {tier.icon}
              <div>
                <p className={`text-sm font-bold ${tier.headerText}`}>{tier.label}</p>
                <p className={`text-xs ${tier.headerText} opacity-70`}>{tier.sub}</p>
              </div>
            </div>
            <div className="px-5 py-3 space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${tier.dot}`} />
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{item.effect}</p>
                    {item.note && (
                      <p className="text-on-surface-variant text-sm mt-0.5">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
              {tier.key === "red" && (
                <a
                  href="tel:111"
                  className="flex items-center justify-center gap-2 bg-error text-white rounded-full h-12 font-bold text-sm mt-2 w-full"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden>call</span>
                  Call 111 Now
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InteractionsTab({ drug }: { drug: DrugDetail }) {
  const [search, setSearch] = useState("");
  const interactions = drug.interactions || [];
  const filtered = interactions.filter((i) =>
    i.interactant?.toLowerCase().includes(search.toLowerCase())
  );

  const SEVERITY = {
    low:      { bg: "bg-[#dcfce7]", text: "text-[#166534]", label: "Low",      dot: "bg-[#22c55e]" },
    moderate: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]", label: "Moderate", dot: "bg-[#f59e0b]" },
    high:     { bg: "bg-error-container", text: "text-on-error-container", label: "High", dot: "bg-error" },
  };

  return (
    <div className="space-y-3">
      {interactions.length > 4 && (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search interactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-surface-container-lowest rounded-xl pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-surface-container-low">
          {filtered.map((item, i) => {
            const sev = SEVERITY[item.severity as keyof typeof SEVERITY] || SEVERITY.low;
            return (
              <div key={i} className="px-5 py-4 flex items-start gap-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 mt-0.5 ${sev.bg} ${sev.text}`}>
                  {sev.label}
                </span>
                <div>
                  <p className="font-bold text-on-surface text-sm">{item.interactant}</p>
                  {item.note && (
                    <p className="text-on-surface-variant text-sm mt-0.5 leading-relaxed">{item.note}</p>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-on-surface-variant text-center py-8">No matches found</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RedZoneTab({ drug }: { drug: DrugDetail }) {
  const rz = drug.red_zone;
  if (!rz) return null;
  const hasSigns = (rz.overdose_signs || []).length > 0;
  const hasAction = Boolean(rz.action?.trim());

  return (
    <div className="space-y-4">
      <div className="bg-error-container rounded-2xl border-l-4 border-error p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="#ba1a1a" opacity="0.15" />
            <path d="M12 7v5" stroke="#ba1a1a" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1.3" fill="#ba1a1a" />
          </svg>
          <h3 className="font-extrabold text-on-error-container text-base uppercase tracking-wider">
            Overdose / Emergency
          </h3>
        </div>

        {hasSigns && (
          <div className="mb-4">
            <p className="text-xs font-bold text-on-error-container uppercase tracking-wider mb-2">
              Warning signs
            </p>
            <ul className="space-y-1.5">
              {rz.overdose_signs.map((sign, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-error-container">
                  <span className="text-error mt-0.5 font-bold">•</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasAction && (
          <p className="text-sm font-semibold text-on-surface mb-4 leading-relaxed">{rz.action}</p>
        )}

        <div className="flex gap-2">
          {rz.phone_111 && (
            <a
              href="tel:111"
              className="flex-1 flex items-center justify-center gap-2 bg-error text-white rounded-full h-12 font-bold text-sm"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden>call</span>
              Call 111
            </a>
          )}
          {rz.phone_poisons?.trim() && (
            <a
              href={`tel:${rz.phone_poisons.replace(/\s+/g, "")}`}
              className="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border-2 border-error text-error rounded-full h-12 font-bold text-sm"
            >
              Poisons: {rz.phone_poisons}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizTab({ drug }: { drug: DrugDetail }) {
  const [picked, setPicked] = useState<number | null>(null);
  const quiz = drug.teach_back_quiz;
  if (!quiz?.question || !quiz.options?.length) return null;

  const answered = picked !== null;
  const correctIndex = typeof quiz.correct_index === "number" ? quiz.correct_index : -1;
  const isCorrect = answered && picked === correctIndex;

  return (
    <div className="space-y-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Quick Check</p>
        <p className="text-base font-bold text-on-surface leading-snug">{quiz.question}</p>

        <div className="space-y-2">
          {quiz.options.map((option, i) => {
            const isThisCorrect = i === correctIndex;
            const isThisPicked = i === picked;
            let cls = "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ";
            if (!answered) {
              cls += "border-surface-container-high text-on-surface hover:border-primary";
            } else if (isThisCorrect) {
              cls += "border-[#22c55e] bg-[#dcfce7] text-[#166534]";
            } else if (isThisPicked) {
              cls += "border-error bg-error-container text-on-error-container";
            } else {
              cls += "border-surface-container-high text-on-surface-variant opacity-50";
            }
            return (
              <button key={i} disabled={answered} onClick={() => setPicked(i)} className={cls}>
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`rounded-xl p-4 ${isCorrect ? "bg-[#dcfce7]" : "bg-[#fef9c3]"}`}>
            <p className="text-sm font-bold mb-1">
              {isCorrect ? "✓ Nice one!" : "Good try!"}
            </p>
            {quiz.explanation && (
              <p className="text-sm text-on-surface-variant">{quiz.explanation}</p>
            )}
          </div>
        )}

        {answered && (
          <button
            onClick={() => setPicked(null)}
            className="w-full h-11 bg-surface-container-high text-on-surface rounded-full font-bold text-sm"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

function InfoTab({ drug }: { drug: DrugDetail }) {
  const rows: { icon: React.ReactNode; label: string; text: string }[] = [];

  if (drug.funded_nz && drug.funded_note?.trim()) {
    rows.push({
      icon: <SvgFunded />,
      label: "PHARMAC Funding",
      text: drug.funded_note,
    });
  }

  if (drug.pregnancy_note?.trim()) {
    rows.push({ icon: <SvgPregnancy />, label: "Pregnancy & Breastfeeding", text: drug.pregnancy_note });
  }

  if (drug.storage_instructions?.trim()) {
    rows.push({ icon: <SvgStorage />, label: "Storage", text: drug.storage_instructions });
  }

  if (drug.contraindications?.trim()) {
    rows.push({ icon: <SvgContra />, label: "Who Should Not Take This", text: drug.contraindications });
  }

  const hasMedsafe = Boolean(drug.medsafe_cmi_url?.trim());
  const hasHealthify = Boolean(drug.healthify_url?.trim());

  return (
    <div className="space-y-3">
      {rows.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden divide-y divide-surface-container-low">
          {rows.map((row, i) => (
            <div key={i} className="px-5 py-4 flex items-start gap-4">
              <div className="mt-0.5 shrink-0">{row.icon}</div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  {row.label}
                </p>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">{row.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {(hasMedsafe || hasHealthify) && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 space-y-3">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Official Sources</p>
          {hasMedsafe && (
            <a
              href={drug.medsafe_cmi_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-primary font-semibold hover:underline"
            >
              <SvgLink />
              Download Medsafe CMI PDF
            </a>
          )}
          {hasHealthify && (
            <a
              href={drug.healthify_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-primary font-semibold hover:underline"
            >
              <SvgLink />
              View on Healthify He Puna Waiora
            </a>
          )}
        </div>
      )}

      {drug.last_reviewed_date && (
        <p className="text-xs text-on-surface-variant text-center py-2">
          Reviewed {drug.last_reviewed_date} · Information from Healthify &amp; Medsafe NZ
        </p>
      )}
    </div>
  );
}

// ─── Premium SVGs ────────────────────────────────────────────────────────────
function SvgFunded() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="text-primary" opacity="0.3" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
    </svg>
  );
}
function SvgPregnancy() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-primary">
      <circle cx="12" cy="4.5" r="2.5" fill="currentColor" opacity="0.8" />
      <path d="M10 9c0-1.1.9-2 2-2s2 .9 2 2v4c1.5.5 2.5 2 2.5 3.5 0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4 0-1.5 1-3 2.5-3.5V9z" fill="currentColor" />
    </svg>
  );
}
function SvgStorage() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-primary">
      <rect x="3" y="6" width="18" height="4" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="3" y="12" width="18" height="4" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="3" y="18" width="18" height="2.5" rx="1.25" fill="currentColor" opacity="0.25" />
      <circle cx="6" cy="8" r="1" fill="white" />
      <circle cx="6" cy="14" r="1" fill="white" />
    </svg>
  );
}
function SvgContra() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-primary">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <line x1="7.5" y1="7.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function SvgLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-primary shrink-0">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
type TabKey = "how_to_take" | "side_effects" | "interactions" | "red_zone" | "quiz" | "info";

function hasContent(key: TabKey, drug: DrugDetail): boolean {
  switch (key) {
    case "how_to_take":
      return (drug.how_to_take || []).length > 0 || (drug.big3 || []).length > 0;
    case "side_effects": {
      const se = drug.side_effects || { green: [], yellow: [], red: [] };
      return (se.green?.length || 0) + (se.yellow?.length || 0) + (se.red?.length || 0) > 0;
    }
    case "interactions":
      return (drug.interactions || []).length > 0;
    case "red_zone": {
      const rz = drug.red_zone;
      if (!rz) return false;
      return (
        (rz.overdose_signs || []).length > 0 ||
        Boolean(rz.action?.trim()) ||
        Boolean(rz.phone_111) ||
        Boolean(rz.phone_poisons?.trim())
      );
    }
    case "quiz":
      return Boolean(drug.teach_back_quiz?.question && drug.teach_back_quiz?.options?.length);
    case "info":
      return (
        Boolean(drug.pregnancy_note?.trim()) ||
        Boolean(drug.storage_instructions?.trim()) ||
        Boolean(drug.contraindications?.trim()) ||
        Boolean(drug.medsafe_cmi_url?.trim()) ||
        Boolean(drug.healthify_url?.trim()) ||
        (drug.funded_nz && Boolean(drug.funded_note?.trim())) ||
        Boolean(drug.last_reviewed_date?.trim())
      );
  }
}

const ALL_TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "how_to_take",  label: "How to Take",  icon: "medication" },
  { key: "side_effects", label: "Side Effects",  icon: "warning" },
  { key: "interactions", label: "Interactions",  icon: "sync_alt" },
  { key: "red_zone",     label: "Red Zone",      icon: "emergency" },
  { key: "quiz",         label: "Quiz",          icon: "quiz" },
  { key: "info",         label: "Info",          icon: "info" },
];

// ─── Main card ────────────────────────────────────────────────────────────────
export default function NeurosHealthCard({ drug }: { drug: DrugDetail }) {
  const visibleTabs = ALL_TABS.filter((t) => hasContent(t.key, drug));
  const [activeTab, setActiveTab] = useState<TabKey | null>(
    visibleTabs.length > 0 ? visibleTabs[0].key : null
  );

  return (
    <div className="space-y-4">
      {/* Hero always shown */}
      <DrugHeroBanner
        name={drug.drug_name}
        brandNames={drug.brand_names || []}
        drugClass={drug.drug_class}
        fundedNz={drug.funded_nz}
        fundedNote={drug.funded_note}
      />

      {/* Plain-English summary */}
      {drug.vibe_summary?.trim() && <VibeSummary text={drug.vibe_summary} />}

      {/* Tab bar — only shows tabs with content */}
      {visibleTabs.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
          {/* Scrollable tab strip */}
          <div className="overflow-x-auto">
            <div className="flex min-w-max border-b border-surface-container-low px-2">
              {visibleTabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                      aria-hidden
                    >
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-4">
            {activeTab === "how_to_take"  && <HowToTakeTab drug={drug} />}
            {activeTab === "side_effects" && <SideEffectsTab drug={drug} />}
            {activeTab === "interactions" && <InteractionsTab drug={drug} />}
            {activeTab === "red_zone"     && <RedZoneTab drug={drug} />}
            {activeTab === "quiz"         && <QuizTab drug={drug} />}
            {activeTab === "info"         && <InfoTab drug={drug} />}
          </div>
        </div>
      )}
    </div>
  );
}
