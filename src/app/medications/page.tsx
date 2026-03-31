"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";

export default function MedicationsList() {
  const { medications, user } = useStore();
  const [search, setSearch] = useState("");

  const filteredMeds = medications.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto lg:max-w-none">
      
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
        
        {/* Left Column: List & Search */}
        <div className="space-y-6">
          <div className="flex justify-between items-end mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">My Medications</h1>
            <Link href="/medications/add" className="hidden lg:flex px-6 py-3 rounded-full gradient-primary font-bold text-white text-sm active:scale-95 transition-transform shadow-md">
              + Add Medication
            </Link>
          </div>

          <div className="relative h-14 w-full">
            <span className="material-symbols-outlined absolute left-4 top-4 text-outline">search</span>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medications..." 
              className="w-full h-full bg-surface-container-high rounded-xl pl-12 pr-4 text-on-surface text-base placeholder:text-outline/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
            />
          </div>

          <div className="pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Active Medications ({filteredMeds.length})</h2>
            
            {filteredMeds.length === 0 ? (
              <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col items-center justify-center text-center mt-8">
                 <div className="rounded-full bg-primary-fixed/20 w-24 h-24 flex items-center justify-center mb-4">
                   <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>vaccines</span>
                 </div>
                 <h3 className="font-bold text-lg text-on-surface">No medications found</h3>
                 <p className="text-sm text-on-surface-variant mt-1">Try another search or add a new one.</p>
                 <Link href="/medications/add" className="mt-6 px-6 py-3 rounded-full gradient-primary font-bold text-white active:scale-95 transition-transform">
                   + Add Medication
                 </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMeds.map(med => (
                  <div key={med.id} className="bg-surface-container-lowest p-5 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] relative overflow-hidden group">
                     <div className="flex items-start justify-between">
                       <div className="flex gap-4">
                         <div className="w-12 h-12 bg-primary-fixed/30 rounded-full flex items-center justify-center text-primary">
                           <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pill</span>
                         </div>
                         <div>
                           <h3 className="font-bold text-lg text-on-surface">{med.name}</h3>
                           <p className="text-xs text-on-surface-variant font-medium bg-surface-container py-1 px-3 flex items-center mt-2 rounded-full w-fit">
                              {med.dose} • {med.frequency}
                           </p>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center justify-between mt-5">
                       <div className="flex gap-2">
                         {med.time.map((t, i) => (
                           <span key={i} className="bg-surface-container-low px-3 py-1 rounded-full text-xs font-semibold text-on-surface-variant">{t}</span>
                         ))}
                       </div>
                       <Link href={`/medications/${med.id}`} className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                         View Info <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                       </Link>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Conditions (Sticky Desktop) */}
        <div className="lg:sticky lg:top-24 space-y-6 pt-10 lg:pt-0">
           <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">My Conditions</h2>
               <button className="text-primary font-bold text-sm hover:underline">+ Add</button>
             </div>
             
             <div className="flex flex-wrap gap-3">
               {user.conditions.length > 0 ? user.conditions.map((condition, i) => (
                 <span key={i} className="inline-flex items-center px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-bold shadow-sm">
                   {condition}
                 </span>
               )) : (
                 <span className="text-sm text-on-surface-variant">No conditions logged.</span>
               )}
             </div>
           </div>

           <div className="bg-primary-fixed/30 p-5 rounded-2xl flex items-center gap-4">
             <div className="w-10 h-10 bg-primary-container text-white flex items-center justify-center rounded-2xl">
               <span className="material-symbols-outlined">analytics</span>
             </div>
             <div>
               <p className="font-bold text-on-surface">{medications.length} Active Medications</p>
               <p className="text-xs text-on-surface-variant">Syncing with Health Log</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
