import { HealthGuidanceTriage } from "@/lib/health-check/guidance";

interface TriageBadgeProps {
  triage: HealthGuidanceTriage;
}

export function TriageBadge({ triage }: TriageBadgeProps) {
  return (
    <div className="flex justify-center my-8">
      <div
        className={`h-16 px-8 rounded-full flex items-center gap-3 font-extrabold text-lg uppercase tracking-wide shadow-md
          ${triage === "SELF_CARE" ? "bg-tertiary text-white" : ""}
          ${triage === "SEE_PHARMACIST" ? "bg-secondary-fixed text-on-secondary-fixed" : ""}
          ${triage === "CALL_HEALTHLINE" ? "bg-[#f4a261] text-white" : ""}
        `}
      >
        {triage === "SELF_CARE" && (
          <span className="w-3 h-3 rounded-full bg-[#22c55e] shadow-inner" aria-hidden />
        )}
        {triage === "SEE_PHARMACIST" && (
          <span className="w-3 h-3 rounded-full bg-[#eab308] shadow-inner" aria-hidden />
        )}
        {triage === "CALL_HEALTHLINE" && (
          <span className="w-3 h-3 rounded-full bg-[#f97316] shadow-inner" aria-hidden />
        )}
        {triage.replace(/_/g, " ")}
      </div>
    </div>
  );
}
