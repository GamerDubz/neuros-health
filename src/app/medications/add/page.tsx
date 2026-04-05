"use client";

import React from 'react';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchMedicines, getConditionsList } from '@/lib/db/nz-health';
import { fuzzySort } from '@/lib/fuzzy';
import { useStore } from '@/lib/store';
import { debounce } from '@/lib/utils';

export default function AddMedicationWizard() {
  const router = useRouter();
  const { addMedication } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
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

  // Load conditions on mount
  useEffect(() => {
    getConditionsList().then(setConditions);
  }, []);

  // Debounced search for medicines
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 1) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchMedicines(searchQuery);

        // Apply fuzzy re-ranking so misspellings surface the right medication
        const q = searchQuery.toLowerCase();
        const ranked = fuzzySort(
          q,
          data || [],
          (item: any) => [
            item.display_name || '',
            item.generic_name || '',
            ...(item.brand_names || []),
          ],
          0.25
        );

        setResults(ranked);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStep1Next = () => {
    if (selectedDrug) setStep(2);
  };

  const handleStep2Next = () => {
    if (dose && timesOfDay.length > 0) setStep(3);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      // Save medication to store with slug for DB linking
      addMedication({
        id: `med-${Date.now()}`,
        slug: selectedDrug?.slug || undefined,
        name: selectedDrug?.display_name || selectedDrug?.name || searchQuery,
        dose: `${dose}${doseUnit}`,
        frequency,
        time: frequency === 'As needed' ? ['As needed'] : timesOfDay,
        type: 'Tablet',
        conditionId: linkedCondition || undefined,
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/medications");
      }, 2000);
    }, 1000);
  };

  const toggleTime = (time: string) => {
    setTimesOfDay((prev: string[]) => prev.includes(time) ? prev.filter((t: string) => t !== time) : [...prev, time]);
  };

  // Success overlay
  if (success) {
    return (
      <div className="fixed inset-0 bg-surface z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
         <div className="w-32 h-32 bg-primary-container rounded-full flex items-center justify-center mb-6 animate-[bounce_1s_ease-in-out]">
            <span className="material-symbols-outlined text-[64px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>eco</span>
         </div>
         <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 text-center">
           {selectedDrug.display_name || selectedDrug.name} added!
         </h1>
         <p className="text-on-surface-variant font-medium text-lg text-center">Your tree is growing!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg pt-4 pb-2 px-6">
         <div className="flex items-center justify-between h-12">
            <button onClick={() => step === 1 ? router.push("/medications") : setStep(step - 1)} className="p-2 -ml-2 rounded-full text-on-surface-variant active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-bold text-base text-on-surface truncate pr-4">
              {step === 1 ? "Find Your Medication" : step === 2 ? "Your Details" : "Set Reminders"}
            </h1>
            <span className="text-sm text-on-surface-variant font-semibold">Step {step} of 3</span>
         </div>
         <div className="h-1 bg-surface-container-high rounded-full w-full mt-2 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${(step / 3) * 100}%` }} />
         </div>
      </header>

      {/* Main Content Area */}
      <div className="pt-24 md:pt-12 px-6 max-w-2xl mx-auto pb-36 font-sans">
         
         {/* Desktop Wizard Nav */}
         <div className="hidden md:block mb-12">
           <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -mt-0.5 h-1 bg-surface-container-high -z-10 rounded-full"></div>
              <div className="absolute left-0 top-1/2 -mt-0.5 h-1 bg-primary -z-10 transition-all duration-300 rounded-full" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
              
              {[1, 2, 3].map(num => (
                <div key={num} className="flex flex-col items-center gap-2">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step >= num ? 'bg-primary text-white shadow-md' : 'bg-surface-container-high text-on-surface-variant'
                   }`}>
                     {step > num ? <span className="material-symbols-outlined text-[20px]">check</span> : num}
                   </div>
                   <span className={`text-xs font-bold uppercase tracking-wider ${step >= num ? 'text-primary' : 'text-on-surface-variant'}`}>
                     {num === 1 ? "Find" : num === 2 ? "Details" : "Reminders"}
                   </span>
                </div>
              ))}
           </div>
         </div>

         {/* Desktop Back button */}
         <div className="hidden md:flex mb-6">
            <button onClick={() => step === 1 ? router.push("/medications") : setStep(step - 1)} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
            </button>
         </div>

         {/* --- STEP 1: FIND --- */}
         {step === 1 && (
           <div className="animate-fade-in">
             <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-6 md:block hidden">Find Your Medication</h2>
             <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-4 top-4 text-outline/80 text-[28px]">search</span>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type a medication name..." 
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  className="w-full h-16 bg-surface-container-high rounded-2xl pl-14 pr-4 text-lg font-medium text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/60"
                />
             </div>

             {searchQuery && (
                <div className="space-y-2 mb-6">
                  {isSearching ? (
                    <div className="p-8 flex justify-center">
                      <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                    </div>
                  ) : (
                    <>
                      {results.map((result) => (
                        <button 
                          key={result.id || result.slug} 
                          onClick={() => { setSelectedDrug(result); handleStep1Next(); }}
                          className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-transparent flex items-center justify-between active:bg-surface-container hover:border-primary/20 transition-all text-left group"
                        >
                          <div>
                            <div className="font-semibold text-on-surface group-hover:text-primary transition-colors">{result.display_name}</div>
                            <div className="text-sm text-on-surface-variant font-medium mt-0.5">
                              {result.generic_name} {result.brand_names?.length > 0 && `• ${result.brand_names.join(', ')}`}
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward_ios</span>
                        </button>
                      ))}
                      {results.length === 0 && searchQuery.length >= 1 && (
                        <div className="p-4 text-center text-on-surface-variant text-sm font-medium">
                          No matches found in NZ database.
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

             <div className="mt-4">
                <p className="text-sm text-on-surface-variant">
                  Can't find it? <button onClick={() => { setSelectedDrug({ name: searchQuery || "Custom Med" }); setStep(2); }} className="text-primary font-bold hover:underline">Add manually</button>
                </p>
             </div>
           </div>
         )}

         {/* --- STEP 2: DETAILS --- */}
         {step === 2 && (
           <div className="animate-fade-in space-y-6">
             <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary-fixed text-on-primary-fixed px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm w-fit">
                   <span className="material-symbols-outlined text-[18px]">check</span>
                   {selectedDrug?.display_name || selectedDrug?.name}
                </div>
                <button onClick={() => setStep(1)} className="text-xs text-on-surface-variant hover:text-primary font-bold ml-2">Change</button>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-semibold text-on-surface block">Dose Amount</label>
               <div className="flex gap-3">
                 <input 
                   type="number" 
                   value={dose}
                   onChange={(e: any) => setDose(e.target.value)}
                   placeholder="e.g. 50"
                   className="flex-1 h-14 bg-surface-container-high rounded-2xl px-4 text-on-surface font-medium focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
                 />
                 <div className="bg-surface-container-low rounded-2xl flex p-1 items-center h-14 w-fit">
                   {['mg', 'ml'].map(unit => (
                     <button 
                       key={unit}
                       onClick={() => setDoseUnit(unit)}
                       className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${doseUnit === unit ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
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
                 {['Once daily', 'Twice daily', 'As needed', 'Custom'].map(freq => (
                   <button 
                     key={freq}
                     onClick={() => setFrequency(freq)}
                     className={`p-4 rounded-2xl text-left font-semibold text-sm transition-all border ${
                       frequency === freq ? 'bg-primary-fixed/30 border-primary text-primary' : 'bg-surface-container-lowest border-transparent text-on-surface-variant hover:border-surface-dim'
                     }`}
                   >
                     {freq}
                   </button>
                 ))}
               </div>
             </div>

             {frequency !== 'As needed' && (
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-on-surface block mt-2">Time of Day</label>
                 <div className="flex flex-wrap gap-2">
                   {['Morning', 'Midday', 'Evening', 'Night'].map(time => (
                     <button 
                       key={time}
                       onClick={() => toggleTime(time)}
                       className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                         timesOfDay.includes(time) ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                       }`}
                     >
                       {time}
                     </button>
                   ))}
                 </div>
               </div>
             )}

             <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface block mt-2">Link Condition (Optional)</label>
                 <select 
                   value={linkedCondition}
                   onChange={(e) => setLinkedCondition(e.target.value)}
                   className="w-full h-14 bg-surface-container-high rounded-2xl px-4 text-on-surface font-medium focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                 >
                   <option value="">None</option>
                   {conditions.map(c => (
                     <option key={c.id} value={c.slug}>{c.condition_name}</option>
                   ))}
                 </select>
             </div>

             <div className="pt-6">
                <button 
                  onClick={handleStep2Next}
                  disabled={!dose || (frequency !== 'As needed' && timesOfDay.length === 0)}
                  className="w-full h-14 rounded-full gradient-primary font-bold text-white text-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  Next Step <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
             </div>
           </div>
         )}

         {/* --- STEP 3: REMINDERS --- */}
         {step === 3 && (
           <div className="animate-fade-in space-y-6">
              
              <div className="bg-surface-container-lowest p-6 rounded-3xl flex items-center justify-between shadow-sm">
                 <div>
                   <h3 className="font-bold text-on-surface">Enable Reminders</h3>
                   <p className="text-sm text-on-surface-variant mt-1 font-medium">Get a notification when your dose is due.</p>
                 </div>
                 <button 
                   onClick={() => setRemindersEnabled(!remindersEnabled)}
                   className={`w-14 h-8 rounded-full p-1 transition-colors ${remindersEnabled ? 'bg-primary' : 'bg-surface-container-high'}`}
                 >
                   <div className={`w-6 h-6 rounded-full bg-white transform transition-transform shadow-sm ${remindersEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
              </div>

              {remindersEnabled && timesOfDay.length > 0 && (
                <div className="space-y-3">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mt-2 px-2">Set Notification Times</h3>
                   {timesOfDay.map((time: any, idx: any) => (
                     <div key={idx} className="bg-surface-container-lowest p-4 rounded-3xl flex items-center justify-between shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                             <span className="material-symbols-outlined">schedule</span>
                           </div>
                           <span className="font-bold text-on-surface">{time} dose</span>
                        </div>
                        <input 
                           type="time" 
                           defaultValue={time === 'Morning' ? '08:00' : time === 'Midday' ? '13:00' : time === 'Evening' ? '18:00' : '21:00'}
                           className="bg-surface-container-high px-3 py-2 rounded-xl text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                     </div>
                   ))}

                   <div className="bg-surface-container-low p-4 rounded-2xl mt-6 border border-surface-container-highest">
                     <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-3 flex items-center gap-1">
                       <span className="material-symbols-outlined text-[16px]">visibility</span> Notification Preview
                     </p>
                     <div className="bg-white p-3 rounded-xl shadow-sm flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[16px]">notifications</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">Time for your {selectedDrug?.display_name || selectedDrug?.name}</p>
                          <p className="text-xs text-gray-600 mt-0.5">Dose: {dose}{doseUnit} • {timesOfDay[0] || ""} Reminder</p>
                        </div>
                     </div>
                   </div>
                </div>
              )}

              <div className="pt-6">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full h-14 rounded-full gradient-primary font-bold text-white text-lg active:scale-95 transition-transform disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
                  ) : (
                    <>Confirm & Save <span className="material-symbols-outlined text-[20px]">check</span></>
                  )}
                </button>
              </div>

           </div>
         )}
      </div>
    </div>
  );
}
