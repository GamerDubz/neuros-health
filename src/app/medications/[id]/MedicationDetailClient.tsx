"use client";

import { useStore, Medication } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function MedicationDetailClient({ initialId }: { initialId: string }) {
  const router = useRouter();
  const { medications } = useStore();
  const [activeTab, setActiveTab] = useState("About");

  const med = medications.find(m => m.id === initialId) || medications[0];
  const tabs = ["About", "How to Take", "Side Effects", "Self-Care", "Storage"];

  return (
    <div className="min-h-screen bg-surface pb-24 lg:pb-0">
      
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg pt-safe">
         <div className="flex items-center justify-between h-16 px-6">
            <button onClick={() => router.push("/medications")} className="p-2 -ml-2 rounded-full text-primary active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg text-teal-800 tracking-tight flex-1 ml-2">{med.name}</h1>
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
               <h2 className="font-extrabold text-2xl md:text-3xl text-on-secondary-container tracking-tight">{med.name}</h2>
               <div className="flex flex-wrap items-center gap-3 mt-2">
                 <span className="text-sm font-bold text-on-secondary-container/80 uppercase tracking-wide">{med.dose}</span>
                 <span className="bg-white/60 px-3 py-1 rounded-full text-xs font-bold text-on-secondary-container shadow-sm">Anxiety</span>
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
               <div className="pt-8 px-2">
                 <button className="w-full bg-primary/10 text-primary font-bold px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
                   <span className="material-symbols-outlined text-[18px]">download</span> Leaflet PDF
                 </button>
               </div>
            </div>

            {/* Content Area */}
            <div className="pb-32 md:pb-12 animate-fade-in relative">
               {activeTab === "About" && (
                 <div className="space-y-6">
                    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
                       <h3 className="font-bold text-lg text-on-surface mb-3">What is {med.name}?</h3>
                       <p className="text-on-surface-variant font-medium text-sm md:text-base leading-relaxed">
                         {med.description || "Consult your healthcare provider for more information."}
                       </p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
                       <h3 className="font-bold text-lg text-on-surface mb-3">How does it work?</h3>
                       <p className="text-on-surface-variant font-medium text-sm md:text-base leading-relaxed">
                         Take as directed by your physician. This medication works to manage your health symptoms effectively over time.
                       </p>
                    </div>
                    <p className="text-xs text-outline px-4 italic text-center md:text-left">Based on general medical data. Always follow your prescriber's exact instructions.</p>
                 </div>
               )}

               {activeTab === "Side Effects" && (
                 <div className="space-y-6">
                    <div className="bg-surface-container-low p-6 rounded-3xl">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                         <span className="material-symbols-outlined text-outline">sick</span> Common
                       </h3>
                       <div className="flex flex-wrap gap-2">
                         {(med.sideEffects || ["Nausea", "Headaches", "Insomnia"]).map(s => (
                           <span key={s} className="bg-surface-container px-4 py-2 rounded-full text-sm font-semibold text-on-surface">{s}</span>
                         ))}
                       </div>
                    </div>

                    <div className="bg-secondary-fixed/40 p-6 rounded-3xl">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                         <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span> Monitor:
                       </h3>
                       <ul className="space-y-3">
                         {(med.warnings || ["Wait for reaction before driving.", "Do not stop suddenly."]).map(s => (
                           <li key={s} className="flex gap-3">
                              <span className="material-symbols-outlined text-secondary mt-0.5 text-[20px]">radio_button_unchecked</span>
                              <span className="text-sm font-medium text-on-surface leading-relaxed">{s}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                 </div>
               )}

               {activeTab === "How to Take" && (
                 <div className="space-y-3">
                    <div className="flex gap-4 p-5 bg-surface-container-lowest rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
                       <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-sm">1</div>
                       <p className="text-on-surface font-medium text-sm md:text-base leading-relaxed pt-1">Take your dose with or without food as instructed.</p>
                    </div>
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
                              {(med.selfCare || ["Stay hydrated.", "Check in with your doctor weekly."]).join(" ")}
                            </p>
                         </div>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === "Storage" && (
                 <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm space-y-2">
                    <div className="flex items-center gap-4 py-3">
                       <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-2xl text-on-surface-variant shrink-0">
                         <span className="material-symbols-outlined">thermostat</span>
                       </div>
                       <p className="text-sm font-medium text-on-surface">Store at room temperature.</p>
                    </div>
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
