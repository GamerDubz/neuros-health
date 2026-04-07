import type { DrugDetail } from "@/lib/db/drug-detail";
import { Accordion } from "@/components/drug-detail/Accordion";

const TIERS = [
  { key: "green" as const, label: "Common & Mild", headerBg: "bg-[#dcfce7]", headerText: "text-[#166534]", dot: "bg-[#22c55e]" },
  { key: "yellow" as const, label: "Tell Your Pharmacist", headerBg: "bg-[#fef9c3]", headerText: "text-[#854d0e]", dot: "bg-[#f59e0b]" },
  { key: "red" as const, label: "Emergency — Act Now", headerBg: "bg-[#fee2e2]", headerText: "text-[#991b1b]", dot: "bg-[#ef4444]" },
];

export function SideEffectsAccordion({ sideEffects }: { sideEffects: DrugDetail["side_effects"] }) {
  const hasAny = TIERS.some((tier) => (sideEffects?.[tier.key] || []).length > 0);

  return (
    <Accordion icon="warning" title="Side Effects">
      {!hasAny ? (
        <p className="text-sm text-[#6d7a77] text-center py-6">
          No specific side effects recorded. Always tell your pharmacist if something feels wrong.
        </p>
      ) : (
        <>
          {TIERS.map((tier) => {
            const items = sideEffects?.[tier.key] || [];
            if (!items.length) return null;

            return (
              <div key={tier.key}>
                <div className={`px-5 py-2 ${tier.headerBg} flex items-center gap-2`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${tier.dot}`} aria-hidden />
                  <span className={`text-sm font-bold ${tier.headerText}`}>{tier.label}</span>
                </div>
                <div className="px-5 py-3 space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${tier.dot}`} />
                      <div>
                        <span className="font-semibold text-[#151c27] text-sm">{item.effect}</span>
                        <p className="text-[#3d4947] text-sm mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                  {tier.key === "red" && (
                    <a
                      href="tel:111"
                      className="flex items-center justify-center gap-2 bg-[#ba1a1a] text-white rounded-full h-12 font-bold text-sm mt-2 w-full"
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden>
                        call
                      </span>
                      Call 111 Now
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </Accordion>
  );
}
