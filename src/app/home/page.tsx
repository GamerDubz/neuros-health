"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TreeHeroCard } from "@/components/HealthTree/TreeHeroCard";
import { FirstMedicationSetup } from "@/components/FirstMedicationSetup";
import { AnimatePresence } from "framer-motion";

import { Suspense } from "react";

function DashboardContent() {
  const { user, logs, checkIn, medications } = useStore();
  const searchParams = useSearchParams();
  const [showSetup, setShowSetup] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    // Show setup wizard if URL has ?setup=true and we haven't dismissed it
    if (searchParams.get("setup") === "true") {
      setShowSetup(true);
    }
  }, [searchParams]);

   // Date logic
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const dateKey = today.toISOString().split('T')[0];
  
  const todayLogs = logs.filter(l => l.dateStr === dateKey);
  const takenMeds = todayLogs.map(l => l.medicationId);

  const handleTakeMed = (id: string) => {
    if (!takenMeds.includes(id)) {
      checkIn(id, dateKey);
      setPulseKey(prev => prev + 1); // Trigger tree ping
    }
  };

  const totalMeds = medications.length > 0 ? medications.length : 4; // Mock standard if empty
  const takenCount = takenMeds.length;
  const progressPercent = Math.min(100, Math.round((takenCount / totalMeds) * 100));

  // Determine stage from streak (simplified logic based on master prompt Part 4.1)
  // Stage 1: 0-2 days, Stage 2: 3-6 days, Stage 3: 7-13 days, Stage 4: 14-29 days, etc.
  let treeStage = 1;
  const streak = user.streakDays || 0;
  if (streak >= 90) treeStage = 7;
  else if (streak >= 60) treeStage = 6;
  else if (streak >= 30) treeStage = 5;
  else if (streak >= 14) treeStage = 4;
  else if (streak >= 7) treeStage = 3;
  else if (streak >= 3) treeStage = 2;

  // Days to next calculation
  let daysToNext = 3 - streak;
  if (streak >= 3) daysToNext = 7 - streak;
  if (streak >= 7) daysToNext = 14 - streak;
  if (streak >= 14) daysToNext = 30 - streak;
  if (streak >= 30) daysToNext = 60 - streak;
  if (streak >= 60) daysToNext = 90 - streak;
  if (streak >= 90) daysToNext = 0;

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* FIRST MEDICATION SETUP WIZARD */}
      <AnimatePresence>
        {showSetup && (
          <FirstMedicationSetup onClose={() => setShowSetup(false)} />
        )}
      </AnimatePresence>

      {/* Greeting Strip */}
      <div className="pt-2">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight inline-flex items-center gap-2">
          Good morning, {user.name || "Alex"}
          <span className="material-symbols-outlined text-[28px] text-[#eab308]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>waving_hand</span>
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">{dateString}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Hero Tree */}
        <div className="lg:col-span-1 space-y-6">
           <TreeHeroCard 
             stage={treeStage}
             streak={streak}
             progressPct={progressPercent}
             daysToNext={daysToNext}
             pulseKey={pulseKey}
             isWilted={streak === 0 && treeStage > 1} // Wilt if they broke streak but had progress before
           />
        </div>

        {/* Center Column: Today's Meds */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-on-surface">Today's Meds</h3>
                <p className="text-sm text-on-surface-variant mt-1 cursor-pointer">Next dose in 2h 15m</p>
              </div>
              <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-2xl font-bold text-sm">
                {takenCount} / {totalMeds} taken
              </div>
            </div>

            <div className="space-y-3">
              {/* Due Row */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between border border-surface-container-high shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary-fixed rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">pill</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Magnesium</h4>
                    <p className="text-xs text-on-surface-variant font-semibold mt-0.5">Due 12:30 PM</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleTakeMed("magnesium")}
                  className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full active:scale-95 transition-transform shadow-md shadow-primary/20"
                >
                  Take Now
                </button>
              </div>

              {/* Taken Row */}
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-fixed-dim rounded-full flex items-center justify-center opacity-70">
                    <span className="material-symbols-outlined text-primary-fixed">vaccines</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface line-through decoration-on-surface-variant/40">Sertraline</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">50mg • Taken 8:00 AM</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>

              {/* Upcoming Row */}
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between opacity-80">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline">medication</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Atorvastatin</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">9:00 PM</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Banner */}
        <div className="lg:col-span-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            
            <Link href="/advisor" className="h-32 p-5 rounded-3xl bg-primary text-white shadow-lg shadow-primary/20 flex flex-col justify-between active:scale-95 transition-transform group overflow-hidden relative">
              <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">healing</span>
              <span className="font-bold text-sm leading-tight relative z-10">Check<br/>Symptoms</span>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            </Link>

            <Link href="/medications/add" className="h-32 p-5 rounded-3xl bg-secondary-container text-on-secondary-container shadow-lg shadow-secondary/10 flex flex-col justify-between active:scale-95 transition-transform group relative overflow-hidden">
              <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform text-secondary">add_circle</span>
              <span className="font-bold text-sm leading-tight relative z-10">Add<br/>Medication</span>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary-fixed/40 rounded-full blur-xl" />
            </Link>

            <Link href="/profile" className="h-32 p-5 rounded-3xl bg-tertiary-container text-on-tertiary-container shadow-md flex flex-col justify-between active:scale-95 transition-transform relative overflow-hidden">
              <span className="material-symbols-outlined text-3xl text-tertiary">monitor_heart</span>
              <span className="font-bold text-sm leading-tight relative z-10">My<br/>Conditions</span>
            </Link>

            <Link href="/badges" className="h-32 p-5 rounded-3xl bg-surface-container text-on-surface shadow-sm flex flex-col justify-between active:scale-95 transition-transform hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-3xl text-secondary">star</span>
              <span className="font-bold text-sm leading-tight">My<br/>Badges</span>
            </Link>

          </div>

          <div className="rounded-3xl overflow-hidden h-40 relative group cursor-pointer shadow-md">
             <div className="absolute inset-0 bg-[#151c27] z-0" />
             <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 to-transparent z-10 opacity-50" />
             
             <div className="absolute bottom-4 left-5 z-20">
               <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
                 <span className="material-symbols-outlined">self_improvement</span> Daily Mindfulness
               </h3>
               <p className="text-white/80 text-xs mt-1 font-medium">5 minute breathing exercise</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><p className="text-on-surface-variant animate-pulse">Loading dashboard...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
