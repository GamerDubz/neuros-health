"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { QuickContactButtons } from "@/components/health-check/QuickContactButtons";
import { SymptomForm } from "@/components/health-check/SymptomForm";

const DURATION_OPTIONS = ["Today", "2–3 days", "1 week+", "2 weeks+"];
const SEVERITY_OPTIONS = ["Mild", "Moderate", "Severe"];

export default function HealthCheckPageClient() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!symptoms.trim()) return;

    setIsLoading(true);
    sessionStorage.setItem("hc_symptoms", symptoms);
    sessionStorage.setItem("hc_duration", duration);
    sessionStorage.setItem("hc_severity", severity);

    setTimeout(() => {
      router.push("/health/response");
    }, 1500);
  };

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-5xl">
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start pt-20 lg:pt-0 pb-36 px-6 lg:px-0">
        <div className="space-y-6">
          <div className="mb-2 lg:mb-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
              Health Check
            </h1>
          </div>

          <div className="bg-surface-container-low p-4 rounded-3xl flex items-start gap-3">
            <span
              className="material-symbols-outlined text-secondary mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              This tool provides general guidance only. It does not replace a
              doctor or pharmacist.
            </p>
          </div>

          <SymptomForm
            symptoms={symptoms}
            duration={duration}
            severity={severity}
            isLoading={isLoading}
            durationOptions={DURATION_OPTIONS}
            severityOptions={SEVERITY_OPTIONS}
            onSubmit={handleSubmit}
            onSymptomsChange={setSymptoms}
            onDurationChange={setDuration}
            onSeverityChange={setSeverity}
          />

          <div className="lg:hidden space-y-4 pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4 lg:hidden">
              Quick Contact
            </h2>
            <QuickContactButtons mode="health-check" layout="mobile" />
            <a
              href="tel:111"
              className="w-full bg-error text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform mt-3"
            >
              <span className="material-symbols-outlined text-[20px]">
                emergency
              </span>
              Call 111
            </a>
          </div>
        </div>

        <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-6">
              Quick Contact
            </h2>
            <QuickContactButtons mode="health-check" layout="desktop" />
          </div>

          <div className="bg-surface-container-low p-6 rounded-3xl">
            <h2 className="font-bold text-on-surface mb-2">Recent Checks</h2>
            <p className="text-sm text-on-surface-variant">
              No previous symptom checks found in your private log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
