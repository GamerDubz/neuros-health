interface MedicationDetailsStepProps {
  selectedDrug: any;
  dose: string;
  doseUnit: string;
  frequency: string;
  timesOfDay: string[];
  linkedCondition: string;
  conditions: any[];
  onBackToSearch: () => void;
  onDoseChange: (value: string) => void;
  onDoseUnitChange: (unit: string) => void;
  onFrequencyChange: (frequency: string) => void;
  onToggleTime: (time: string) => void;
  onLinkedConditionChange: (value: string) => void;
  onNext: () => void;
}

export function MedicationDetailsStep({
  selectedDrug,
  dose,
  doseUnit,
  frequency,
  timesOfDay,
  linkedCondition,
  conditions,
  onBackToSearch,
  onDoseChange,
  onDoseUnitChange,
  onFrequencyChange,
  onToggleTime,
  onLinkedConditionChange,
  onNext,
}: MedicationDetailsStepProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-primary-fixed text-on-primary-fixed px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm w-fit">
          <span className="material-symbols-outlined text-[18px]">check</span>
          {selectedDrug?.display_name || selectedDrug?.name}
        </div>
        <button
          onClick={onBackToSearch}
          className="text-xs text-on-surface-variant hover:text-primary font-bold ml-2"
        >
          Change
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-on-surface block">Dose Amount</label>
        <div className="flex gap-3">
          <input
            type="number"
            value={dose}
            onChange={(event) => onDoseChange(event.target.value)}
            placeholder="e.g. 50"
            className="flex-1 h-14 bg-surface-container-high rounded-2xl px-4 text-on-surface font-medium focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
          />
          <div className="bg-surface-container-low rounded-2xl flex p-1 items-center h-14 w-fit">
            {["mg", "ml"].map((unit) => (
              <button
                key={unit}
                onClick={() => onDoseUnitChange(unit)}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                  doseUnit === unit
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-on-surface block mt-2">Frequency</label>
        <div className="grid grid-cols-2 gap-3">
          {["Once daily", "Twice daily", "As needed", "Custom"].map((option) => (
            <button
              key={option}
              onClick={() => onFrequencyChange(option)}
              className={`p-4 rounded-2xl text-left font-semibold text-sm transition-all border ${
                frequency === option
                  ? "bg-primary-fixed/30 border-primary text-primary"
                  : "bg-surface-container-lowest border-transparent text-on-surface-variant hover:border-surface-dim"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {frequency !== "As needed" && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface block mt-2">Time of Day</label>
          <div className="flex flex-wrap gap-2">
            {["Morning", "Midday", "Evening", "Night"].map((time) => (
              <button
                key={time}
                onClick={() => onToggleTime(time)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  timesOfDay.includes(time)
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-on-surface block mt-2">
          Link Condition (Optional)
        </label>
        <select
          value={linkedCondition}
          onChange={(event) => onLinkedConditionChange(event.target.value)}
          className="w-full h-14 bg-surface-container-high rounded-2xl px-4 text-on-surface font-medium focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
        >
          <option value="">None</option>
          {conditions.map((condition) => (
            <option key={condition.id} value={condition.slug}>
              {condition.condition_name}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-6">
        <button
          onClick={onNext}
          disabled={!dose || (frequency !== "As needed" && timesOfDay.length === 0)}
          className="w-full h-14 rounded-full gradient-primary font-bold text-white text-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          Next Step{" "}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
