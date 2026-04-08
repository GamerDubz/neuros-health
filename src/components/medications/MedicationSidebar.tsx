import { UserProfile } from "@/types/store";

interface MedicationSidebarProps {
  user: UserProfile;
}

export function MedicationSidebar({
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
    </div>
  );
}
