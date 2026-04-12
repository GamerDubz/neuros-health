"use client";

import { useAppStore } from "@/hooks/useAppStore";
import { getTreeStage, getDaysToNextStage } from "@/lib/utils";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TreeHeroCard } from "@/components/HealthTree/TreeHeroCard";
import { FirstMedicationSetup } from "@/components/FirstMedicationSetup";
import { AnimatePresence } from "framer-motion";
import DailyWellbeingCard from "@/components/home/DailyWellbeingCard";

function DashboardContent() {
  const { user, logs, checkIn, medications } = useAppStore();
  const searchParams = useSearchParams();
  const isSetupParam = searchParams.get("setup") === "true";
  const [showSetup, setShowSetup] = useState(isSetupParam);
  const [pulseKey, setPulseKey] = useState(0);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const dateKey = today.toISOString().split('T')[0];

  const takenIds = new Set(logs.filter(l => l.dateStr === dateKey).map(l => l.medicationId));
  const takenCount = takenIds.size;
  const totalMeds = medications.length || 1;
  const progressPercent = Math.min(100, Math.round((takenCount / totalMeds) * 100));

  const streak = user.streakDays || 0;
  const treeStage = getTreeStage(streak);
  const daysToNext = getDaysToNextStage(streak);

  const handleTakeMed = (id: string) => {
    if (!takenIds.has(id)) {
      checkIn(id, dateKey);
      setPulseKey(prev => prev + 1);
    }
  };

  // Show the first 3 medications on the dashboard card
  const dashboardMeds = medications.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in relative">

      <AnimatePresence>
        {showSetup && <FirstMedicationSetup onClose={() => setShowSetup(false)} />}
      </AnimatePresence>

      {/* Greeting Strip */}
      <div className="pt-2">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight inline-flex items-center gap-2">
          Good morning, {user.name || "there"}
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
            isWilted={streak === 0 && treeStage > 1}
          />
        </div>

        {/* Center Column: Today's Meds */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-on-surface">Today&apos;s Meds</h3>
                <p className="text-sm text-on-surface-variant mt-1">{takenCount} of {medications.length} taken</p>
              </div>
            </div>

            <div className="space-y-3">
              {dashboardMeds.length === 0 ? (
                <div className="text-sm text-on-surface-variant text-center py-4">
                  No medications yet.{" "}
                  <Link href="/medications/add" className="text-primary font-bold hover:underline">Add one</Link>
                </div>
              ) : (
                dashboardMeds.map((med) => {
                  const taken = takenIds.has(med.id);
                  return (
                    <div
                      key={med.id}
                      className={`p-4 rounded-2xl flex items-center justify-between ${
                        taken
                          ? "bg-surface-container-low"
                          : "bg-surface-container-lowest border border-surface-container-high shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200">
                          <span className="material-symbols-outlined text-black">medication</span>
                        </div>
                        <div>
                          <h4 className={`font-bold transition-all duration-300 ${taken ? "text-outline/70 line-through decoration-on-surface-variant/70 decoration-2" : "text-on-surface"}`}>
                            {med.name}
                          </h4>
                          <p className={`text-xs font-semibold mt-0.5 transition-all duration-300 ${taken ? "text-outline/70" : "text-on-surface-variant"}`}>
                            {taken ? `${med.dose} • Taken` : `Due ${med.time[0] || "—"}`}
                          </p>
                        </div>
                      </div>
                      {taken ? (
                        <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      ) : (
                        <button
                          onClick={() => handleTakeMed(med.id)}
                          className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full active:scale-95 transition-transform shadow-md shadow-primary/20"
                        >
                          Take Now
                        </button>
                      )}
                    </div>
                  );
                })
              )}
              {medications.length > 3 && (
                <Link href="/medications" className="block text-center text-xs font-bold text-primary hover:underline pt-1">
                  +{medications.length - 3} more — view all
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Banner */}
        <div className="lg:col-span-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">

            <Link href="/health/check" className="h-32 p-5 rounded-3xl bg-primary text-white shadow-lg shadow-primary/20 flex flex-col justify-between active:scale-95 transition-transform group overflow-hidden relative">
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

            <Link href="/badges" className="h-32 p-5 rounded-3xl bg-surface-container text-on-surface shadow-sm flex flex-col justify-between active:scale-95 transition-transform hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-3xl text-secondary">star</span>
              <span className="font-bold text-sm leading-tight">My<br/>Badges</span>
            </Link>

          </div>

          <DailyWellbeingCard />
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
