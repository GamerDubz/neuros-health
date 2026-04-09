import Link from "next/link";
import { AilmentSummary } from "@/lib/db/ailments";

interface AilmentGridProps {
  ailments: AilmentSummary[];
}

export function AilmentGrid({ ailments }: AilmentGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {ailments.map((ailment) => {
        return (
          <Link
            key={ailment.id}
            href={`/health/ailments/${ailment.slug}`}
            className="p-5 rounded-3xl border border-surface-container-high bg-surface-container-lowest text-left shadow-[0_10px_40px_rgba(21,28,39,0.03)] hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary group block"
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
