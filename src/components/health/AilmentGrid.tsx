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
            className="bg-surface-container-lowest p-5 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] active:bg-surface-container-low text-left active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary group block"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                background: `linear-gradient(135deg, ${colours.from}, ${colours.to})`,
              }}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ color: colours.text }}
                aria-hidden
              >
                health_and_safety
              </span>
            </div>
            <h3 className="font-bold text-on-surface text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
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
