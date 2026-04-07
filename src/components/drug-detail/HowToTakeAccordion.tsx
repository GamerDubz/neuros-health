import type { DrugDetail } from "@/lib/db/drug-detail";
import { Accordion } from "@/components/drug-detail/Accordion";
import { MaterialIcon } from "@/components/drug-detail/MaterialIcon";

export function HowToTakeAccordion({
  items,
  onCollapse,
}: {
  items: DrugDetail["how_to_take"];
  onCollapse?: () => void;
}) {
  return (
    <Accordion icon="medication" title="How to Take" onCollapse={onCollapse}>
      <div className="px-5 pb-5 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 py-2">
            <MaterialIcon name={item.icon} className="text-[22px] text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-on-surface text-sm">{item.label}: </span>
              <span className="text-on-surface-variant text-sm">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </Accordion>
  );
}
