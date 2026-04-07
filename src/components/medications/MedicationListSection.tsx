import Link from "next/link";
import { Medication } from "@/types/store";

interface MedicationListSectionProps {
  filteredMedications: Medication[];
}

export function MedicationListSection({
  filteredMedications,
}: MedicationListSectionProps) {
  return (
    <div className="pt-4">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4">
        Active Medications ({filteredMedications.length})
      </h2>

      {filteredMedications.length === 0 ? (
        <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col items-center justify-center text-center mt-8">
          <div className="rounded-full bg-primary-fixed/20 w-24 h-24 flex items-center justify-center mb-4">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              vaccines
            </span>
          </div>
          <h3 className="font-bold text-lg text-on-surface">No medications found</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Try another search or add a new one.
          </p>
          <Link
            href="/medications/add"
            className="mt-6 px-6 py-3 rounded-full gradient-primary font-bold text-white active:scale-95 transition-transform"
          >
            + Add Medication
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMedications.map((medication) => (
            <div
              key={medication.id}
              className="bg-surface-container-lowest p-5 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-fixed/30 rounded-full flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      pill
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">
                      {medication.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium bg-surface-container py-1 px-3 flex items-center mt-2 rounded-full w-fit">
                      {medication.dose} • {medication.frequency}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-5 gap-4">
                <div className="flex flex-wrap gap-2">
                  {medication.time.map((timeLabel, index) => (
                    <span
                      key={`${medication.id}-${timeLabel}-${index}`}
                      className="bg-surface-container-low px-3 py-1 rounded-full text-xs font-semibold text-on-surface-variant"
                    >
                      {timeLabel}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/medications/${medication.slug || medication.id}`}
                  className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View Info{" "}
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
