import Link from "next/link";
import { AilmentSummary, CATEGORY_COLOURS } from "@/lib/db/ailments";

interface AilmentGridProps {
  ailments: AilmentSummary[];
}

export function AilmentGrid({ ailments }: AilmentGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {ailments.map((ailment) => {
        const primaryTag = ailment.condition_tags?.[0] || "general";
        const colours = CATEGORY_COLOURS[primaryTag] || CATEGORY_COLOURS.general;

        return (
          <Link
            key={ailment.id}
            href={`/health/ailments/${ailment.slug}`}
            style={{
              backgroundColor: `${colours.from}15`, // Light tint of the category colour
              borderColor: `${colours.from}30`,
            }}
            className="p-5 rounded-3xl border shadow-[0_10px_40px_rgba(21,28,39,0.04)] text-left hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary group block"
          >
            <h3 className="font-bold text-on-surface text-sm leading-tight mb-2 transition-colors">
              {ailment.common_name}
            </h3>
            <p className="text-xs text-on-surface-variant leading-snug line-clamp-2">
              {ailment.two_line_summary}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
