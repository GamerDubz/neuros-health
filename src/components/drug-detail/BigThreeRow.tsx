import { MaterialIcon } from "@/components/drug-detail/MaterialIcon";

export function BigThreeRow({ items }: { items: { icon: string; label: string }[] }) {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.slice(0, 3).map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-[0_10px_40px_rgba(21,28,39,0.04)] min-h-[88px]"
        >
          <MaterialIcon name={item.icon} className="text-[32px] text-[#00685d]" />
          <span className="text-xs font-bold text-[#151c27] text-center leading-tight">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
