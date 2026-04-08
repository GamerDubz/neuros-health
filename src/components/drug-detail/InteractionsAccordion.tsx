"use client";

import { useState } from "react";
import type { DrugDetail } from "@/lib/db/drug-detail";
import { Accordion } from "@/components/drug-detail/Accordion";

const SEVERITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-surface-container-high", text: "text-on-surface-variant", label: "Low" },
  moderate: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]", label: "Moderate" },
  high: { bg: "bg-error-container", text: "text-on-error-container", label: "High" },
};

export function InteractionsAccordion({ interactions }: { interactions: DrugDetail["interactions"] }) {
  const [search, setSearch] = useState("");

  // Don't render if there are no interactions
  if (!interactions || interactions.length === 0) return null;

  const filteredInteractions = interactions.filter((item) =>
    item.interactant?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Accordion icon="sync_alt" title="Interactions" count={interactions.length}>
      {!interactions.length ? (
        <p className="text-sm text-on-surface-variant text-center py-6 px-5">No interactions recorded.</p>
      ) : (
        <div className="px-5 pb-5">
          <input
            type="text"
            placeholder="Search interactions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full h-11 bg-surface-container-high rounded-xl px-4 text-sm mt-4 mb-3 text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="space-y-3">
            {filteredInteractions.map((item, index) => {
              const severity = SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.low;

              return (
                <div key={index} className="flex items-start gap-3 py-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${severity.bg} ${severity.text}`}>
                    {severity.label}
                  </span>
                  <div>
                    <span className="font-semibold text-on-surface text-sm">{item.interactant}</span>
                    <p className="text-on-surface-variant text-sm mt-0.5">{item.note}</p>
                  </div>
                </div>
              );
            })}
            {filteredInteractions.length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-3">No interactions found</p>
            )}
          </div>
        </div>
      )}
    </Accordion>
  );
}
