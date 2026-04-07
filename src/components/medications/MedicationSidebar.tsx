import { UserProfile } from "@/types/store";

interface MedicationSidebarProps {
  medicationCount: number;
  user: UserProfile;
}

export function MedicationSidebar({
  medicationCount,
  user,
}: MedicationSidebarProps) {
  return (
    <div className="lg:sticky lg:top-24 space-y-6 pt-10 lg:pt-0">
      <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
            My Conditions
          </h2>
          <button className="text-primary font-bold text-sm hover:underline">
            + Add
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {user.conditions.length > 0 ? (
            user.conditions.map((condition, index) => (
              <span
                key={`${condition}-${index}`}
                className="inline-flex items-center px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-bold shadow-sm"
              >
                {condition}
              </span>
            ))
          ) : (
            <span className="text-sm text-on-surface-variant">
              No conditions logged.
            </span>
          )}
        </div>
      </div>

      <div className="bg-primary-fixed/30 p-5 rounded-2xl flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-container text-white flex items-center justify-center rounded-2xl">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <div>
          <p className="font-bold text-on-surface">
            {medicationCount} Active Medications
          </p>
          <p className="text-xs text-on-surface-variant">
            Syncing with Health Log
          </p>
        </div>
      </div>
    </div>
  );
}
