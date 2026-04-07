interface MedicationReminderStepProps {
  remindersEnabled: boolean;
  loading: boolean;
  timesOfDay: string[];
  selectedDrug: any;
  dose: string;
  doseUnit: string;
  onToggleReminders: () => void;
  onSave: () => void;
}

export function MedicationReminderStep({
  remindersEnabled,
  loading,
  timesOfDay,
  selectedDrug,
  dose,
  doseUnit,
  onToggleReminders,
  onSave,
}: MedicationReminderStepProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-surface-container-lowest p-6 rounded-3xl flex items-center justify-between shadow-sm">
        <div>
          <h3 className="font-bold text-on-surface">Enable Reminders</h3>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Get a notification when your dose is due.
          </p>
        </div>
        <button
          onClick={onToggleReminders}
          className={`w-14 h-8 rounded-full p-1 transition-colors ${
            remindersEnabled ? "bg-primary" : "bg-surface-container-high"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white transform transition-transform shadow-sm ${
              remindersEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {remindersEnabled && timesOfDay.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mt-2 px-2">
            Set Notification Times
          </h3>
          {timesOfDay.map((time, index) => (
            <div
              key={index}
              className="bg-surface-container-lowest p-4 rounded-3xl flex items-center justify-between shadow-[0_10px_40px_rgba(21,28,39,0.04)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <span className="font-bold text-on-surface">{time} dose</span>
              </div>
              <input
                type="time"
                defaultValue={
                  time === "Morning"
                    ? "08:00"
                    : time === "Midday"
                      ? "13:00"
                      : time === "Evening"
                        ? "18:00"
                        : "21:00"
                }
                className="bg-surface-container-high px-3 py-2 rounded-xl text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}

          <div className="bg-surface-container-low p-4 rounded-2xl mt-6 border border-surface-container-highest">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">visibility</span> Notification
              Preview
            </p>
            <div className="bg-white p-3 rounded-xl shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">notifications</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  Time for your {selectedDrug?.display_name || selectedDrug?.name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Dose: {dose}
                  {doseUnit} • {timesOfDay[0] || ""} Reminder
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-6">
        <button
          onClick={onSave}
          disabled={loading}
          className="w-full h-14 rounded-full gradient-primary font-bold text-white text-lg active:scale-95 transition-transform disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[24px]">
              progress_activity
            </span>
          ) : (
            <>
              Confirm & Save{" "}
              <span className="material-symbols-outlined text-[20px]">check</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
