import type { DrugDetail } from "@/lib/db/drug-detail";

export function RedZoneBox({ redZone }: { redZone: DrugDetail["red_zone"] }) {
  if (!redZone) return null;

  return (
    <div className="rounded-2xl bg-[#fef2f2] border-l-4 border-[#ba1a1a] p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-[22px] text-[#ba1a1a]" aria-hidden>
          emergency
        </span>
        <h3 className="font-bold text-[#991b1b] text-sm uppercase tracking-wider">
          Overdose / Emergency
        </h3>
      </div>
      {redZone.overdose_signs?.length > 0 && (
        <>
          <p className="text-xs font-bold text-[#991b1b] uppercase mb-1">Warning signs</p>
          <ul className="text-sm text-[#3d4947] mb-4 space-y-1">
            {redZone.overdose_signs.map((sign, index) => (
              <li key={index} className="flex items-start gap-2">
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
            <span className="material-symbols-outlined text-[18px]" aria-hidden>
              call
            </span>
            Call 111
          </a>
        )}
        {redZone.phone_poisons && (
          <a
            href={`tel:${redZone.phone_poisons.replace(/\s+/g, "")}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#ba1a1a] text-[#ba1a1a] rounded-full h-12 font-bold text-sm"
          >
            Poisons: {redZone.phone_poisons}
          </a>
        )}
      </div>
    </div>
  );
}
