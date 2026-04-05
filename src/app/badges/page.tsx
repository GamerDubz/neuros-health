"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function BadgeCollectionPage() {
  const router = useRouter();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const badges = [
    {
      id: "streak_7",
      name: "7 Day Streak",
      earned: true,
      unlockedAt: "Mar 15, 2026",
      condition: "Track 7 days in a row.",
      color: "primary",
      icon: "local_fire_department"
    },
    {
      id: "streak_30",
      name: "30 Day Streak",
      earned: false,
      unlockedAt: null,
      condition: "Track 30 days in a row.",
      color: "secondary",
      icon: "local_fire_department",
      progress: "18 left"
    },
    {
      id: "first_med",
      name: "First Step",
      earned: true,
      unlockedAt: "Jan 10, 2026",
      condition: "Add your first medication.",
      color: "tertiary",
      icon: "eco"
    },
    {
      id: "tree_stage_3",
      name: "Sapling",
      earned: true,
      unlockedAt: "Feb 28, 2026",
      condition: "Grow your tree to Stage 3.",
      color: "primary",
      icon: "spa"
    },
    {
      id: "symptom_pro",
      name: "Proactive",
      earned: true,
      unlockedAt: "Mar 02, 2026",
      condition: "Use the Health Check tool 3 times.",
      color: "secondary",
      icon: "stethoscope"
    },
    {
      id: "tree_stage_7",
      name: "Grand Oak",
      earned: false,
      unlockedAt: null,
      condition: "Grow your tree to Stage 7.",
      color: "tertiary",
      icon: "park",
      progress: "Stage 3/7"
    },
    {
      id: "perfect_month",
      name: "Flawless",
      earned: false,
      unlockedAt: null,
      condition: "Complete an entire month with 100% adherence.",
      color: "secondary",
      icon: "auto_awesome",
      progress: "Not met"
    },
    {
      id: "night_owl",
      name: "Night Owl",
      earned: true,
      unlockedAt: "Feb 15, 2026",
      condition: "Take a medication scheduled after 10 PM.",
      color: "primary",
      icon: "nights_stay"
    }
  ];

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="min-h-screen bg-surface.">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg px-6 py-4 flex items-center gap-4 h-16 border-b border-surface-container/50 md:hidden">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full text-primary active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="font-bold text-lg text-teal-800 tracking-tight">My Badges</h1>
      </header>

      <div className="max-w-4xl mx-auto pt-24 pb-36 px-6 lg:pt-12 lg:px-8">
         <div className="hidden lg:flex justify-between items-center mb-8">
            <h1 className="font-extrabold text-4xl text-on-surface tracking-tight">Badge Collection</h1>
            <button onClick={() => router.push("/tracker")} className="text-primary font-bold text-sm hover:underline py-2 rounded-full">
               ← Back to Tracker
            </button>
         </div>

         {/* Summary Bar */}
         <div className="bg-primary-fixed/20 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shadow-sm">
            <div>
              <h2 className="font-extrabold text-xl md:text-2xl text-on-surface">{earnedCount} of {badges.length} badges earned</h2>
              <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px]">stars</span> You're doing great! Keep going.
              </p>
            </div>
            <div className="w-full md:w-48 bg-white/60 h-3 rounded-full overflow-hidden shadow-inner">
               <div className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-1000" style={{ width: `${(earnedCount/badges.length)*100}%` }}></div>
            </div>
         </div>

         {/* Badges Grid */}
         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {badges.map((badge, index) => (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`relative flex flex-col items-center p-4 rounded-3xl transition-transform active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  badge.earned ? 'bg-surface-container-lowest shadow-[0_10px_40px_rgba(21,28,39,0.04)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(21,28,39,0.08)]' : 'bg-surface-container-low hover:bg-surface-container'
                }`}
                style={{
                  animation: badge.earned ? `fadeInUp 0.5s ease-out ${index * 0.05}s both` : 'none'
                }}
              >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 shadow-inner ${
                    badge.earned ? `bg-${badge.color}-fixed/40` : 'bg-surface-container-highest'
                  }`}>
                     {badge.earned ? (
                        <span className={`material-symbols-outlined text-[32px] md:text-[40px] text-${badge.color} drop-shadow-sm`} style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                     ) : (
                        <span className="material-symbols-outlined text-outline text-[32px]">lock</span>
                     )}
                  </div>
                  <h3 className={`text-xs md:text-sm text-center leading-tight mb-1 ${badge.earned ? 'font-bold text-on-surface' : 'font-semibold text-on-surface-variant'}`}>
                    {badge.name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-outline text-center leading-tight font-medium">
                    {badge.earned ? badge.unlockedAt : badge.progress}
                  </p>
              </button>
            ))}
         </div>
      </div>

      {/* Detail Bottom Sheet (Mobile) / Modal (Desktop) */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center p-0 md:p-6 pb-0">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm transition-opacity"
             onClick={() => setSelectedBadge(null)}
           />
           
           {/* Sheet / Modal */}
           <div className="relative w-full md:w-auto md:min-w-[400px] max-w-lg bg-surface-container-lowest rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 pb-safe shadow-[0_-10px_40px_rgba(21,28,39,0.12)] md:shadow-[0_20px_60px_rgba(0,0,0,0.1)] animate-slide-up-fade text-center md:pb-8">
              <div className="w-12 h-1.5 bg-surface-container-high rounded-full mx-auto mb-8 md:hidden" />
              
              <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-md ${
                selectedBadge.earned ? `bg-${selectedBadge.color}-container` : 'bg-surface-container border-2 border-dashed border-outline-variant'
              }`}>
                 {selectedBadge.earned ? (
                   <span className={`material-symbols-outlined text-[56px] text-${selectedBadge.color} drop-shadow-md`} style={{ fontVariationSettings: "'FILL' 1" }}>{selectedBadge.icon}</span>
                 ) : (
                   <span className="material-symbols-outlined text-[48px] text-outline/50">lock</span>
                 )}
              </div>
              
              <h2 className={`text-3xl font-extrabold tracking-tight mb-2 ${selectedBadge.earned ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {selectedBadge.name}
              </h2>
              
              {selectedBadge.earned ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span> Earned {selectedBadge.unlockedAt}
                  </div>
                  <p className="text-on-surface-variant text-base font-medium mx-auto max-w-xs">{selectedBadge.condition}</p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface-variant px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-[16px]">lock</span> Locked
                  </div>
                  <p className="text-on-surface-variant text-base font-medium mx-auto max-w-xs mb-4">
                    <strong>How to unlock:</strong><br/>{selectedBadge.condition}
                  </p>
                  <p className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl inline-block">
                    Progress: {selectedBadge.progress}
                  </p>
                </>
              )}

              <button 
                onClick={() => setSelectedBadge(null)}
                className="w-full mt-8 bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-lg h-14 rounded-full transition-colors active:scale-95"
              >
                Close
              </button>
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
