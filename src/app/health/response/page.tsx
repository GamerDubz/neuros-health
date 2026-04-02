"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchConditions } from '@/lib/db/nz-health';

export default function AIResponseScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadGuidance = async () => {
      const storedSymptoms = sessionStorage.getItem("hc_symptoms") || "";
      const storedDuration = sessionStorage.getItem("hc_duration") || "Today";
      const storedSeverity = sessionStorage.getItem("hc_severity") || "Mild";

      if (!storedSymptoms) {
        router.push("/health/check");
        return;
      }

      // 1. Search database for matches
      const matches = await searchConditions(storedSymptoms);
      const topMatch = matches[0];

      // 2. Safety Heuristics
      const s = storedSymptoms.toLowerCase();
      let triage = "SELF_CARE";
      
      const redFlags = ["chest", "breath", "crushing", "severe pain", "unconscious", "stroke", "bleeding"];
      const hasRedFlag = redFlags.some(flag => s.includes(flag)) || storedSeverity === "Severe";

      if (hasRedFlag) {
        triage = "CALL_111_IMMEDIATELY";
      } else if (storedDuration === "1 week+" || storedDuration === "2 weeks+") {
        triage = "SEE_PHARMACIST";
      } else if (s.includes("dizzy") || s.includes("vomit") || s.includes("fever")) {
        triage = "CALL_HEALTHLINE";
      }

      // 3. Mapping data
      setData({
        symptomsText: `${storedSymptoms}, ${storedSeverity.toLowerCase()} severity for ${storedDuration.toLowerCase()}.`,
        triage,
        topMatch: topMatch ? {
          name: topMatch.condition_name,
          overview: topMatch.overview,
          emergency: topMatch.emergency
        } : null,
        whatItMayBe: topMatch 
          ? `Based on your symptoms, this matches information on ${topMatch.condition_name}.`
          : triage === "CALL_111_IMMEDIATELY" 
            ? "The symptoms you have described could indicate a serious or life-threatening medical emergency." 
            : "We couldn't find a direct match in our database, but here is general advice for your triage level.",
        actions: topMatch?.self_care 
          ? [topMatch.self_care.split('.')[0] + '.'] 
          : triage === "CALL_111_IMMEDIATELY"
            ? ["Call 111 immediately for an ambulance.", "Unlock your front door if possible."]
            : ["Rest and stay hydrated.", "Monitor your temperature."],
        watchOut: topMatch?.emergency 
          ? [topMatch.emergency.split('.')[0] + '.']
          : ["Symptoms suddenly worsen.", "Difficulty breathing."]
      });
    };

    loadGuidance();
  }, [router]);

  if (!data) return <div className="min-h-screen bg-surface flex items-center justify-center p-6"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-5xl">
       {/* Mobile Header */}
       <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg px-6 py-4 flex items-center gap-4 h-16 md:hidden">
          <button onClick={() => router.push("/health/check")} className="p-2 -ml-2 rounded-full text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="font-bold text-lg text-teal-800 tracking-tight">Your Health Guidance</h1>
       </header>

       <div className="grid lg:grid-cols-[65%_35%] gap-8 items-start pt-24 px-6 lg:pt-8 lg:px-0 pb-36">
          
          {/* Left Column: Response Content */}
          <div className="space-y-6">
            
            {/* Desktop Back */}
            <div className="hidden lg:flex items-center gap-4 mb-4">
              <button onClick={() => router.push("/health/check")} className="p-2 -ml-2 rounded-full text-primary hover:bg-surface-container-low transition-colors flex items-center gap-2 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back
              </button>
              <h1 className="font-bold text-2xl text-on-surface">Your Health Guidance</h1>
            </div>

            {/* CALL 111 IMMEDIATELY HERO (If triggered) */}
            {data.triage === "CALL_111_IMMEDIATELY" && (
              <div className="w-full p-6 rounded-3xl bg-error text-white animate-pulse flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-error/20">
                 <div className="flex items-center gap-4 text-center md:text-left">
                   <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
                   <h2 className="font-extrabold text-2xl md:text-3xl tracking-tight">CALL 111 IMMEDIATELY</h2>
                 </div>
                 <a href="tel:111" className="bg-white text-error px-8 py-4 rounded-full font-bold text-lg w-full md:w-auto text-center active:scale-95 transition-transform shadow-lg">
                   Call 111 Now
                 </a>
              </div>
            )}

            {/* Triage Badge (If NOT Call 111 Immediately) */}
            {data.triage !== "CALL_111_IMMEDIATELY" && (
              <div className="flex justify-center my-8">
                 <div className={`h-16 px-8 rounded-full flex items-center gap-3 font-extrabold text-lg uppercase tracking-wide shadow-md
                   ${data.triage === 'SELF_CARE' ? 'bg-tertiary text-white' : 
                     data.triage === 'SEE_PHARMACIST' ? 'bg-secondary-fixed text-on-secondary-fixed' :
                     data.triage === 'CALL_HEALTHLINE' ? 'bg-[#f4a261] text-white' :
                     'bg-error-container text-on-error-container border border-error/30'
                   }
                 `}>
                   {data.triage === 'SELF_CARE' && <span className="text-xl">🟢</span>}
                   {data.triage === 'SEE_PHARMACIST' && <span className="text-xl">🟡</span>}
                   {data.triage === 'CALL_HEALTHLINE' && <span className="text-xl">🟠</span>}
                   {data.triage === 'CALL_111' && <span className="text-xl">🔴</span>}
                   {data.triage.replace(/_/g, " ")}
                 </div>
              </div>
            )}

            {/* Symptoms Recap */}
            <div className="bg-surface-container-low p-4 rounded-3xl">
              <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Your Symptoms</h2>
              <p className="text-sm text-on-surface font-medium italic">"{data.symptomsText}"</p>
            </div>

            {/* What This May Be */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
              <h2 className="font-bold text-lg text-on-surface mb-3">What This May Be</h2>
              <p className="text-on-surface-variant leading-relaxed text-sm md:text-base font-medium">{data.whatItMayBe}</p>
            </div>

            {/* What You Can Do Now */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
              <h2 className="font-bold text-lg text-on-surface mb-4">What You Can Do Now</h2>
              <div className="space-y-3">
                {data.actions.map((act: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-2 bg-surface-container-low rounded-2xl">
                    <span className="material-symbols-outlined text-tertiary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <p className="text-on-surface text-sm md:text-base font-medium pt-0.5">{act}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Watch Out For */}
            <div className="bg-surface-container-low p-6 rounded-3xl border border-surface-container-highest">
               <h2 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-error">visibility</span> Watch Out For
               </h2>
               <div className="space-y-3 mb-4">
                 {data.watchOut.map((w: string, i: number) => (
                   <div key={i} className="flex items-start gap-3">
                     <span className="material-symbols-outlined text-error mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_unchecked</span>
                     <p className="text-on-surface text-sm font-medium">{w}</p>
                   </div>
                 ))}
               </div>
               <p className="text-sm text-error font-bold flex items-center gap-1">
                 <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span> These symptoms need urgent care.
               </p>
            </div>

            {/* Triage Summary Footer */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${data.triage === 'SELF_CARE' ? 'bg-tertiary' : 'bg-surface-dim'} `}></span>
                  <span className={`text-sm ${data.triage === 'SELF_CARE' ? 'font-bold text-on-surface' : 'text-on-surface-variant font-medium'}`}>Self-care for now</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${['SEE_PHARMACIST', 'CALL_HEALTHLINE'].includes(data.triage) ? 'bg-[#f4a261]' : 'bg-surface-dim'} `}></span>
                  <span className={`text-sm ${['SEE_PHARMACIST', 'CALL_HEALTHLINE'].includes(data.triage) ? 'font-bold text-on-surface' : 'text-on-surface-variant font-medium'}`}>Seek advice if concerned</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${data.triage.includes('111') ? 'bg-error' : 'bg-error/30'} `}></span>
                  <span className={`text-sm ${data.triage.includes('111') ? 'font-bold text-error' : 'text-on-surface-variant font-medium'}`}>Call 111 for red flags</span>
                </div>
              </div>
            </div>

            {/* Mobile Contact Buttons */}
            <div className="lg:hidden space-y-3 pt-6">
               <a href="tel:0800611116" className="w-full flex justify-center items-center gap-2 bg-primary text-white h-14 rounded-full font-bold text-base active:scale-95 transition-transform shadow-lg shadow-primary/20">
                 <span className="material-symbols-outlined text-[20px]">call</span> Call Neuros Pharmacy
               </a>
               <a href="tel:0800611116" className="w-full flex justify-center items-center gap-2 bg-surface-container-lowest border-2 border-primary text-primary h-14 rounded-full font-bold text-base active:scale-95 transition-transform">
                 <span className="material-symbols-outlined text-[20px]">call</span> Call Healthline
               </a>
            </div>

            {/* Mobile Disclaimer */}
            <p className="text-xs text-on-surface-variant text-center my-8 pb-8 lg:hidden px-6 font-medium leading-relaxed">
              This is general guidance only. Always consult a healthcare professional for medical concerns.
            </p>

          </div>

          {/* Right Column: Desktop Action Panel */}
          <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
            
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-6">Quick Contact</h2>
              <div className="space-y-3 mb-6">
                <a href="tel:0800611116" className="w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-primary text-white active:scale-95 transition-transform hover:bg-primary-container shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-[18px]">call</span> Call Neuros Pharmacy
                </a>
                <a href="tel:0800611116" className="w-full h-14 rounded-full border-2 border-primary flex items-center justify-center gap-2 font-bold text-sm bg-surface-container-lowest text-primary active:scale-95 transition-transform hover:bg-surface-container">
                  <span className="material-symbols-outlined text-[18px]">call</span> Call Healthline
                </a>
                <a href="tel:111" className="w-full bg-error text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform hover:opacity-90 mt-4">
                  <span className="material-symbols-outlined text-[20px]">emergency</span> Call 111
                </a>
              </div>
            </div>

            <button onClick={() => router.push("/health/check")} className="w-full bg-surface-container-low text-primary h-14 rounded-full font-bold text-sm active:scale-95 transition-transform hover:bg-surface-container mb-6 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">refresh</span> Start New Check
            </button>

            <p className="text-xs text-on-surface-variant text-center font-medium leading-relaxed px-4">
              This is general guidance only. Always consult a healthcare professional for medical concerns.
            </p>

          </div>
       </div>
    </div>
  );
}
