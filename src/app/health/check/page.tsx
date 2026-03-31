"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HealthCheck() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const durationOptions = ["Today", "2–3 days", "1 week+", "2 weeks+"];
  const severityOptions = ["Mild", "Moderate", "Severe"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    // Persist to session storage so response page can read it quickly
    sessionStorage.setItem("hc_symptoms", symptoms);
    sessionStorage.setItem("hc_duration", duration);
    sessionStorage.setItem("hc_severity", severity);
    
    // Simulate network delay
    setTimeout(() => {
      router.push("/health/response");
    }, 1500);
  };

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-5xl">
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start pt-20 lg:pt-0 pb-36 px-6 lg:px-0">
        
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="mb-2 lg:mb-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Health Check</h1>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-surface-container-low p-4 rounded-3xl flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              This tool provides general guidance only. It does not replace a doctor or pharmacist.
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1 */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Describe your symptoms
                </label>
                <textarea 
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. headache and nausea for the past 2 days..."
                  className="w-full bg-surface-container-high rounded-2xl p-4 min-h-[120px] resize-none text-on-surface text-base focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline/60"
                />
              </div>

              {/* Step 2 */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  How long?
                </label>
                <div className="flex flex-wrap gap-2">
                  {durationOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDuration(opt)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                        duration === opt 
                          ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm' 
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Severity?
                </label>
                <div className="flex flex-wrap gap-2">
                  {severityOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSeverity(opt)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                        severity === opt 
                          ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm' 
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {opt}
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
                  <span className="material-symbols-outlined animate-spin hidden">progress_activity</span>
                ) : (
                  <>Check My Symptoms <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
                )}
                {isLoading && <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>}
              </button>
            </form>
          </div>

          {/* Mobile Quick Contact (hidden on desktop, handled in right column) */}
          <div className="lg:hidden space-y-4 pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4 lg:hidden">Quick Contact</h2>
            <div className="grid grid-cols-2 gap-3">
              <a href="tel:0800611116" className="h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-primary text-white active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[18px]">call</span> Neuros Pharmacy
              </a>
              <a href="tel:0800611116" className="h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-surface-container-low text-primary active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[18px]">call</span> Healthline
              </a>
            </div>
            <a href="tel:111" className="w-full bg-error text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform mt-3">
              <span className="material-symbols-outlined text-[20px]">emergency</span> Call 111
            </a>
          </div>
        </div>

        {/* Right Column: Desktop Quick Contact */}
        <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
           <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
             <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-6">Quick Contact</h2>
             
             <div className="space-y-3">
               <a href="tel:0800611116" className="w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-primary text-white active:scale-95 transition-transform hover:bg-primary-container">
                 <span className="material-symbols-outlined text-[18px]">call</span> Neuros Pharmacy
               </a>
               <a href="tel:0800611116" className="w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold text-sm bg-surface-container-low text-primary active:scale-95 transition-transform hover:bg-surface-container">
                 <span className="material-symbols-outlined text-[18px]">call</span> Healthline
               </a>
               <div className="h-px bg-surface-container-high my-4"></div>
               <a href="tel:111" className="w-full bg-error text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform hover:opacity-90">
                 <span className="material-symbols-outlined text-[20px]">emergency</span> Call 111
               </a>
             </div>
           </div>

           <div className="bg-surface-container-low p-6 rounded-3xl">
              <h2 className="font-bold text-on-surface mb-2">Recent Checks</h2>
              <p className="text-sm text-on-surface-variant">No previous symptom checks found in your private log.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
