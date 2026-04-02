"use client";

import { useStore, Medication } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function MedicationDetailClient({ 
  initialId, 
  nzData 
}: { 
  initialId: string, 
  nzData?: any 
}) {
  const router = useRouter();
  const { medications } = useStore();
  const [activeTab, setActiveTab] = useState("About");

  // Fallback to store if no NZ data
  const medFromStore = medications.find(m => m.id === initialId) || medications[0];
  
  // Use NZ Data if available, else fallback to store/US data
  const medName = nzData?.display_name || medFromStore.name;
  const medDose = nzData?.forms_available || medFromStore.dose;
  const category = nzData?.category || "Medication";
  
  const tabs = ["About", "How to Take", "Side Effects", "Self-Care", "Storage"];

  return (
    <div className="min-h-screen bg-surface pb-24 lg:pb-0">
      
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg pt-safe">
         <div className="flex items-center justify-between h-16 px-6">
            <button onClick={() => router.push("/medications")} className="p-2 -ml-2 rounded-full text-primary active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg text-teal-800 tracking-tight flex-1 ml-2">{medName}</h1>
            <button className="p-2 -mr-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
         </div>
         <div className="flex overflow-x-auto gap-1 px-6 py-2 no-scrollbar bg-surface/90">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {tab}
              </button>
            ))}
         </div>
      </header>

      <div className="max-w-4xl mx-auto pt-36 md:pt-10 px-6 lg:px-0">
         
         {/* Desktop Breadcrumb/Back */}
         <div className="hidden md:flex justify-between items-center mb-6 px-4 lg:px-0">
            <button onClick={() => router.push("/medications")} className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Medications
            </button>
            <button className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
         </div>

         {/* Drug Header Card */}
         <div className="bg-secondary-container p-6 rounded-[2rem] md:rounded-3xl flex items-center gap-5 shadow-sm mx-0 md:mx-4 lg:mx-0">
            <div className="bg-white/80 w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-secondary backdrop-blur-sm">
               <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
            </div>
             <div>
                <h2 className="font-extrabold text-2xl md:text-3xl text-on-secondary-container tracking-tight">{medName}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-sm font-bold text-on-secondary-container/80 uppercase tracking-wide">{medDose}</span>
                  <span className="bg-white/60 px-3 py-1 rounded-full text-xs font-bold text-on-secondary-container shadow-sm">{category}</span>
                  {nzData?.funded_subsidised && (
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">NZ Funded</span>
                  )}
                </div>
             </div>
         </div>

         <div className="grid md:grid-cols-[240px_1fr] gap-8 mt-8">
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex flex-col space-y-2 sticky top-24">
               {tabs.map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`w-full text-left px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                     activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
                {nzData?.cmi_pdf_url && (
                  <div className="pt-8 px-2">
                    <a 
                      href={nzData.cmi_pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-primary/10 text-primary font-bold px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span> Consumer Info (PDF)
                    </a>
                  </div>
                )}
            </div>

            {/* Content Area */}
            <div className="pb-32 md:pb-12 animate-fade-in relative">
               {activeTab === "About" && (
                 <div className="space-y-6">
                    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
                       <h3 className="font-bold text-lg text-on-surface mb-3">What is {medName}?</h3>
                       <p className="text-on-surface-variant font-medium text-sm md:text-base leading-relaxed">
                         {nzData?.what_it_is || medFromStore.description || "Consult your healthcare provider for more information."}
                       </p>
                    </div>
                    {nzData?.how_it_works && (
                      <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
                         <h3 className="font-bold text-lg text-on-surface mb-3">How does it work?</h3>
                         <p className="text-on-surface-variant font-medium text-sm md:text-base leading-relaxed">
                           {nzData.how_it_works}
                         </p>
                      </div>
                    )}
                    <div className="flex flex-col items-center md:items-start gap-4 mt-8 px-4">
                      <p className="text-xs text-outline italic text-center md:text-left">
                        Information sourced from {nzData?.source_healthify ? "Healthify NZ" : nzData?.source_medsafe ? "Medsafe NZ" : "General Medical Data"}.
                      </p>
                      <div className="flex gap-4">
                        {nzData?.source_healthify && (
                          <img src="https://healthify.nz/themes/health-navigator/images/logo.png" alt="Healthify NZ" className="h-6 opacity-60 grayscale hover:grayscale-0 transition-all" />
                        )}
                        {nzData?.source_medsafe && (
                          <div className="text-[10px] font-black text-outline/40 uppercase tracking-tighter border border-outline/20 px-2 py-0.5 rounded">Medsafe NZ</div>
                        )}
                      </div>
                    </div>
                 </div>
               )}

               {activeTab === "Side Effects" && (
                 <div className="space-y-6">
                    {/* RED CARD: Serious Side Effects */}
                    {nzData?.serious_side_effects && (
                      <div className="bg-error-container p-6 rounded-3xl border-2 border-error/20 shadow-lg">
                        <div className="flex items-center gap-3 text-on-error-container mb-4">
                          <span className="material-symbols-outlined text-error text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
                          <h3 className="text-lg font-black uppercase tracking-tight">Serious Side Effects: Seek Help</h3>
                        </div>
                        <div className="text-sm font-bold text-on-error-container leading-relaxed whitespace-pre-line bg-white/40 p-4 rounded-xl">
                          {nzData.serious_side_effects}
                        </div>
                        <p className="text-xs font-bold text-error/70 mt-4 uppercase tracking-widest text-center">Stop taking and call 111 if severe.</p>
                      </div>
                    )}

                    <div className="bg-surface-container-low p-6 rounded-3xl">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                         <span className="material-symbols-outlined text-outline">sick</span> Common Side Effects:
                       </h3>
                       <div className="text-sm font-medium text-on-surface leading-loose whitespace-pre-line">
                         {nzData?.common_side_effects || nzData?.side_effects_combined || (medFromStore.sideEffects || ["Nausea", "Headaches", "Insomnia"]).join(", ")}
                       </div>
                    </div>

                    {nzData?.precautions && (
                      <div className="bg-secondary-fixed/40 p-6 rounded-3xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span> Precautions:
                        </h3>
                        <div className="text-sm font-medium text-secondary-900 leading-relaxed">
                          {nzData.precautions}
                        </div>
                      </div>
                    )}
                 </div>
               )}

               {activeTab === "How to Take" && (
                 <div className="space-y-6">
                    <div className="flex gap-4 p-6 bg-surface-container-lowest rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
                       <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0 shadow-sm">
                         <span className="material-symbols-outlined">instruction</span>
                       </div>
                       <div className="text-on-surface font-medium text-sm md:text-base leading-relaxed whitespace-pre-line">
                         {nzData?.dosage_how_to_take || "Take as directed by your physician or pharmacist."}
                       </div>
                    </div>
                    {nzData?.missed_dose && (
                      <div className="bg-tertiary-fixed/20 p-6 rounded-3xl">
                        <h4 className="font-bold text-tertiary uppercase text-xs tracking-widest mb-2 px-2">If you miss a dose:</h4>
                        <p className="text-sm font-semibold text-on-tertiary-container leading-relaxed px-2">
                          {nzData.missed_dose}
                        </p>
                      </div>
                    )}
                 </div>
               )}

               {activeTab === "Self-Care" && (
                 <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                           <span className="material-symbols-outlined text-[20px]">psychology</span>
                         </div>
                         <div>
                            <h4 className="font-bold text-on-surface">Tips</h4>
                            <p className="text-sm text-on-surface-variant font-medium mt-1 leading-relaxed">
                              {(medFromStore.selfCare || ["Stay hydrated.", "Check in with your doctor weekly."]).join(" ")}
                            </p>
                         </div>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === "Storage" && (
                 <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center gap-4 py-3">
                       <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-2xl text-on-surface-variant shrink-0">
                         <span className="material-symbols-outlined">thermostat</span>
                       </div>
                       <p className="text-sm font-medium text-on-surface">
                         {nzData?.storage || "Store at room temperature, away from moisture and heat."}
                       </p>
                    </div>
                    {nzData?.overdose && (
                      <div className="bg-error-container/40 p-4 rounded-2xl border border-error/10">
                        <p className="text-xs font-black text-error uppercase tracking-widest mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">emergency</span> Overdose
                        </p>
                        <p className="text-xs text-on-error-container font-bold leading-relaxed">{nzData.overdose}</p>
                      </div>
                    )}
                 </div>
               )}

            </div>
         </div>
      </div>

      {/* Mobile Fixed Download Footer */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 pb-safe bg-gradient-to-t from-surface via-surface/90 to-transparent z-40">
         <button className="w-full h-14 bg-primary text-white rounded-full font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary/20">
           <span className="material-symbols-outlined">description</span> Information Leaflet
         </button>
      </div>
    </div>
  );
}
