import { FormEvent } from "react";

interface SymptomFormProps {
  symptoms: string;
  duration: string;
  severity: string;
  isLoading: boolean;
  durationOptions: string[];
  severityOptions: string[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSymptomsChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
}

export function SymptomForm({
  symptoms,
  duration,
  severity,
  isLoading,
  durationOptions,
  severityOptions,
  onSubmit,
  onSymptomsChange,
  onDurationChange,
  onSeverityChange,
}: SymptomFormProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
      <form onSubmit={onSubmit} className="space-y-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            Describe your symptoms
          </label>
          <textarea
            required
            value={symptoms}
            onChange={(event) => onSymptomsChange(event.target.value)}
            placeholder="e.g. headache and nausea for the past 2 days..."
            className="w-full bg-surface-container-high rounded-2xl p-4 min-h-[120px] resize-none text-on-surface text-base focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline/60"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            How long?
          </label>
          <div className="flex flex-wrap gap-2">
            {durationOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onDurationChange(option)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                  duration === option
                    ? "bg-secondary-fixed text-on-secondary-fixed shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            Severity?
          </label>
          <div className="flex flex-wrap gap-2">
            {severityOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSeverityChange(option)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                  severity === option
                    ? "bg-secondary-fixed text-on-secondary-fixed shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!symptoms.trim() || isLoading}
          className="w-full h-14 rounded-full gradient-primary font-bold text-white text-lg flex justify-center items-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isLoading ? (
            <span className="material-symbols-outlined animate-spin hidden">
              progress_activity
            </span>
          ) : (
            <>
              Check My Symptoms{" "}
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </>
          )}
          {isLoading && (
            <span className="material-symbols-outlined animate-spin text-[24px]">
              progress_activity
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
