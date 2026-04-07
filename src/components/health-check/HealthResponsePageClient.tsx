"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchConditions } from "@/lib/db/nz-health";
import {
  buildHealthGuidance,
  HealthGuidanceData,
} from "@/lib/health-check/guidance";
import { AIResponseCard } from "@/components/health-check/AIResponseCard";
import { QuickContactButtons } from "@/components/health-check/QuickContactButtons";
import { TriageBadge } from "@/components/health-check/TriageBadge";

function EmergencyHero() {
  return (
    <div className="w-full p-6 rounded-3xl bg-error text-white animate-pulse flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-error/20">
      <div className="flex items-center gap-4 text-center md:text-left">
        <span
          className="material-symbols-outlined text-[48px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          emergency
        </span>
        <h2 className="font-extrabold text-2xl md:text-3xl tracking-tight">
          CALL 111 IMMEDIATELY
        </h2>
      </div>
      <a
        href="tel:111"
        className="bg-white text-error px-8 py-4 rounded-full font-bold text-lg w-full md:w-auto text-center active:scale-95 transition-transform shadow-lg"
      >
        Call 111 Now
      </a>
    </div>
  );
}

export default function HealthResponsePageClient() {
  const router = useRouter();
  const [data, setData] = useState<HealthGuidanceData | null>(null);

  useEffect(() => {
    const loadGuidance = async () => {
      const storedSymptoms = sessionStorage.getItem("hc_symptoms") || "";
      const storedDuration = sessionStorage.getItem("hc_duration") || "Today";
      const storedSeverity = sessionStorage.getItem("hc_severity") || "Mild";

      if (!storedSymptoms) {
        router.push("/health/check");
        return;
      }

      const matches = await searchConditions(storedSymptoms);
      setData(
        buildHealthGuidance({
          symptoms: storedSymptoms,
          duration: storedDuration,
          severity: storedSeverity,
          topMatch: matches[0],
        }),
      );
    };

    loadGuidance();
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-5xl">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg px-6 py-4 flex items-center gap-4 h-16 md:hidden">
        <button
          onClick={() => router.push("/health/check")}
          className="p-2 -ml-2 rounded-full text-primary active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[24px]">
            arrow_back
          </span>
        </button>
        <h1 className="font-bold text-lg text-primary tracking-tight">
          Your Health Guidance
        </h1>
      </header>

      <div className="grid lg:grid-cols-[65%_35%] gap-8 items-start pt-24 px-6 lg:pt-8 lg:px-0 pb-36">
        <div className="space-y-6">
          <div className="hidden lg:flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push("/health/check")}
              className="p-2 -ml-2 rounded-full text-primary hover:bg-surface-container-low transition-colors flex items-center gap-2 font-bold text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back
              </span>{" "}
              Back
            </button>
            <h1 className="font-bold text-2xl text-on-surface">
              Your Health Guidance
            </h1>
          </div>

          {data.triage === "CALL_111_IMMEDIATELY" ? (
            <EmergencyHero />
          ) : (
            <TriageBadge triage={data.triage} />
          )}

          <div className="bg-surface-container-low p-4 rounded-3xl">
            <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Your Symptoms
            </h2>
            <p className="text-sm text-on-surface font-medium italic">
              "{data.symptomsText}"
            </p>
          </div>

          <AIResponseCard title="What This May Be">
            <p className="text-on-surface-variant leading-relaxed text-sm md:text-base font-medium">
              {data.whatItMayBe}
            </p>
          </AIResponseCard>

          <AIResponseCard title="What You Can Do Now" className="space-y-3">
            {data.actions.map((action, index) => (
              <div
                key={`${action}-${index}`}
                className="flex items-start gap-3 p-2 bg-surface-container-low rounded-2xl"
              >
                <span
                  className="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <p className="text-on-surface text-sm md:text-base font-medium pt-0.5">
                  {action}
                </p>
              </div>
            ))}
          </AIResponseCard>

          <div className="bg-surface-container-low p-6 rounded-3xl border border-surface-container-highest">
            <h2 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">
                visibility
              </span>{" "}
              Watch Out For
            </h2>
            <div className="space-y-3 mb-4">
              {data.watchOut.map((watchItem, index) => (
                <div key={`${watchItem}-${index}`} className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-error mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    radio_button_unchecked
                  </span>
                  <p className="text-on-surface text-sm font-medium">
                    {watchItem}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-error font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                arrow_right_alt
              </span>{" "}
              These symptoms need urgent care.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${data.triage === "SELF_CARE" ? "bg-tertiary" : "bg-surface-dim"}`}
              />
              <span
                className={`text-sm ${data.triage === "SELF_CARE" ? "font-bold text-on-surface" : "text-on-surface-variant font-medium"}`}
              >
                Self-care for now
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${["SEE_PHARMACIST", "CALL_HEALTHLINE"].includes(data.triage) ? "bg-[#f4a261]" : "bg-surface-dim"}`}
              />
              <span
                className={`text-sm ${["SEE_PHARMACIST", "CALL_HEALTHLINE"].includes(data.triage) ? "font-bold text-on-surface" : "text-on-surface-variant font-medium"}`}
              >
                Seek advice if concerned
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${data.triage.includes("111") ? "bg-error" : "bg-error/30"}`}
              />
              <span
                className={`text-sm ${data.triage.includes("111") ? "font-bold text-error" : "text-on-surface-variant font-medium"}`}
              >
                Call 111 for red flags
              </span>
            </div>
          </div>

          <div className="lg:hidden">
            <QuickContactButtons mode="health-response" layout="mobile" />
          </div>

          <p className="text-xs text-on-surface-variant text-center my-8 pb-8 lg:hidden px-6 font-medium leading-relaxed">
            This is general guidance only. Always consult a healthcare
            professional for medical concerns.
          </p>
        </div>

        <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
          <AIResponseCard title="Quick Contact">
            <QuickContactButtons mode="health-response" layout="desktop" />
          </AIResponseCard>

          <button
            onClick={() => router.push("/health/check")}
            className="w-full bg-surface-container-low text-primary h-14 rounded-full font-bold text-sm active:scale-95 transition-transform hover:bg-surface-container mb-6 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Start New Check
          </button>

          <p className="text-xs text-on-surface-variant text-center font-medium leading-relaxed px-4">
            This is general guidance only. Always consult a healthcare
            professional for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
