"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getConditionsList, searchMedicines } from "@/lib/db/nz-health";
import { fuzzySort } from "@/lib/fuzzy";
import { useAppStore } from "@/hooks/useAppStore";
import { MedicationWizardSuccess } from "@/components/medications/MedicationWizardSuccess";
import { MedicationSearchStep } from "@/components/medications/MedicationSearchStep";
import { MedicationDetailsStep } from "@/components/medications/MedicationDetailsStep";
import { MedicationReminderStep } from "@/components/medications/MedicationReminderStep";

export default function AddMedicationWizard() {
  const router = useRouter();
  const { addMedication } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [conditions, setConditions] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [dose, setDose] = useState("");
  const [doseUnit, setDoseUnit] = useState("mg");
  const [frequency, setFrequency] = useState("Once daily");
  const [timesOfDay, setTimesOfDay] = useState<string[]>([]);
  const [linkedCondition, setLinkedCondition] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  useEffect(() => {
    getConditionsList().then(setConditions);
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 1) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);

      try {
        const data = await searchMedicines(searchQuery);
        const query = searchQuery.toLowerCase();
        const ranked = fuzzySort(
          query,
          data || [],
          (item: any) => [
            item.display_name || "",
            item.generic_name || "",
            ...(item.brand_names || []),
          ],
          0.25
        );

        setResults(ranked);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      addMedication({
        id: `med-${Date.now()}`,
        slug: selectedDrug?.slug || undefined,
        name: selectedDrug?.display_name || selectedDrug?.name || searchQuery,
        dose: `${dose}${doseUnit}`,
        frequency,
        time: frequency === "As needed" ? ["As needed"] : timesOfDay,
        type: "Tablet",
        conditionId: linkedCondition || undefined,
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/medications");
      }, 2000);
    }, 1000);
  };

  const handleSelectDrug = (result: any) => {
    setSelectedDrug(result);
    setStep(2);
  };

  const handleManualAdd = () => {
    setSelectedDrug({ name: searchQuery || "Custom Med" });
    setStep(2);
  };

  const handleStep2Next = () => {
    if (dose && timesOfDay.length > 0) {
      setStep(3);
    }
  };

  const toggleTime = (time: string) => {
    setTimesOfDay((previousTimes) =>
      previousTimes.includes(time)
        ? previousTimes.filter((currentTime) => currentTime !== time)
        : [...previousTimes, time]
    );
  };

  if (success) {
    return (
      <MedicationWizardSuccess
        medicationName={selectedDrug.display_name || selectedDrug.name}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg pt-4 pb-2 px-6">
        <div className="flex items-center justify-between h-12">
          <button
            onClick={() => (step === 1 ? router.push("/medications") : setStep(step - 1))}
            className="p-2 -ml-2 rounded-full text-on-surface-variant active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="font-bold text-base text-on-surface truncate pr-4">
            {step === 1
              ? "Find Your Medication"
              : step === 2
                ? "Your Details"
                : "Set Reminders"}
          </h1>
          <span className="text-sm text-on-surface-variant font-semibold">Step {step} of 3</span>
        </div>
        <div className="h-1 bg-surface-container-high rounded-full w-full mt-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      <div className="pt-24 md:pt-12 px-6 max-w-2xl mx-auto pb-36 font-sans">
        <div className="hidden md:block mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -mt-0.5 h-1 bg-surface-container-high -z-10 rounded-full" />
            <div
              className="absolute left-0 top-1/2 -mt-0.5 h-1 bg-primary -z-10 transition-all duration-300 rounded-full"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />

            {[1, 2, 3].map((number) => (
              <div key={number} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step >= number
                      ? "bg-primary text-white shadow-md"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {step > number ? (
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  ) : (
                    number
                  )}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    step >= number ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {number === 1 ? "Find" : number === 2 ? "Details" : "Reminders"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex mb-6">
          <button
            onClick={() => (step === 1 ? router.push("/medications") : setStep(step - 1))}
            className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
          </button>
        </div>

        {step === 1 && (
          <MedicationSearchStep
            searchQuery={searchQuery}
            results={results}
            isSearching={isSearching}
            onSearchQueryChange={setSearchQuery}
            onSelectDrug={handleSelectDrug}
            onManualAdd={handleManualAdd}
          />
        )}

        {step === 2 && (
          <MedicationDetailsStep
            selectedDrug={selectedDrug}
            dose={dose}
            doseUnit={doseUnit}
            frequency={frequency}
            timesOfDay={timesOfDay}
            linkedCondition={linkedCondition}
            conditions={conditions}
            onBackToSearch={() => setStep(1)}
            onDoseChange={setDose}
            onDoseUnitChange={setDoseUnit}
            onFrequencyChange={setFrequency}
            onToggleTime={toggleTime}
            onLinkedConditionChange={setLinkedCondition}
            onNext={handleStep2Next}
          />
        )}

        {step === 3 && (
          <MedicationReminderStep
            remindersEnabled={remindersEnabled}
            loading={loading}
            timesOfDay={timesOfDay}
            selectedDrug={selectedDrug}
            dose={dose}
            doseUnit={doseUnit}
            onToggleReminders={() => setRemindersEnabled(!remindersEnabled)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
