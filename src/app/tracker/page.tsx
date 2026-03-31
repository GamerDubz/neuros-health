"use client";

import { useStore } from "@/lib/store";
import { TreeHeroCard } from "@/components/HealthTree/TreeHeroCard";
import { TreeGallery } from "@/components/HealthTree/TreeGallery";

export default function TrackerPage() {
  const { logs, medications, user } = useStore();
  
  // Date logic
  const today = new Date();
  const dateKey = today.toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.dateStr === dateKey);
  const takenMeds = todayLogs.map(l => l.medicationId);

  const totalMeds = medications.length > 0 ? medications.length : 4; 
  const takenCount = takenMeds.length;
  const progressPercent = Math.min(100, Math.round((takenCount / totalMeds) * 100));

  // Determine stage from streak
  let treeStage = 1;
  const streak = user.streakDays || 0;
  if (streak >= 90) treeStage = 7;
  else if (streak >= 60) treeStage = 6;
  else if (streak >= 30) treeStage = 5;
  else if (streak >= 14) treeStage = 4;
  else if (streak >= 7) treeStage = 3;
  else if (streak >= 3) treeStage = 2;

  // Generate 7 days mock adherence array
  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const isToday = i === 6;
    
    // For mock visualization, random past days if not today
    const p = isToday ? progressPercent : (Math.random() > 0.3 ? 100 : 50);
    
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      percent: p,
      isToday
    };
  });

  return (
    <div className="space-y-8 animate-fade-in relative max-w-5xl mx-auto">
      
      <div className="pt-2">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Your Progress.</h1>
        <p className="text-on-surface-variant text-sm mt-1">Watch your commitment take root.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Col: The Tree Hero Card */}
        <div className="lg:col-span-1">
           <TreeHeroCard 
             stage={treeStage}
             streak={streak}
             progressPct={progressPercent}
             sizeVariant="large"
             isWilted={streak === 0 && treeStage > 1} 
           />
        </div>

        {/* Right Col: Stats & History */}
        <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
           
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-surface-container-high relative overflow-hidden">
               <span className="material-symbols-outlined absolute top-4 right-4 text-primary text-4xl opacity-10">history</span>
               <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Weekly Avg</p>
               <p className="text-[2.5rem] font-extrabold text-primary leading-none mt-2">85%</p>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-surface-container-high relative overflow-hidden">
               <span className="material-symbols-outlined absolute top-4 right-4 text-secondary text-4xl opacity-10">local_fire_department</span>
               <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Best Streak</p>
               <p className="text-[2.5rem] font-extrabold text-secondary leading-none mt-2">{Math.max(streak, 14)}d</p>
             </div>
           </div>

           <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm flex-1">
             <h2 className="text-lg font-extrabold text-on-surface mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined">calendar_month</span> Last 7 Days
             </h2>
             
             <div className="flex justify-between items-end h-[160px] gap-2">
               {past7Days.map((d, i) => (
                 <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group">
                   <div className="w-full relative bg-surface-container h-[120px] rounded-full overflow-hidden">
                     <div 
                       className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ${d.percent === 100 ? 'bg-primary' : (d.percent > 0 ? 'bg-secondary-container' : 'bg-transparent')}`}
                       style={{ height: `${d.percent}%` }}
                     />
                   </div>
                   <span className={`text-[11px] font-bold uppercase ${d.isToday ? 'text-primary' : 'text-on-surface-variant'} group-hover:text-primary transition-colors`}>
                     {d.dayName}
                   </span>
                 </div>
               ))}
             </div>
           </div>

           {/* Today's breakdown */}
           <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-extrabold text-on-surface">Today's Log</h2>
               <span className="text-sm font-bold text-on-surface-variant/60">{takenCount}/{totalMeds}</span>
             </div>
             <div className="space-y-2">
               {["Magnesium", "Sertraline", "Atorvastatin"].map((name, i) => {
                 const isTaken = i < takenCount;
                 return (
                   <div key={i} className={`flex items-center justify-between p-3 rounded-2xl ${isTaken ? 'bg-surface-container-low' : 'border border-surface-container'}`}>
                     <div className="flex items-center gap-3">
                       <span className={`material-symbols-outlined ${isTaken ? 'text-tertiary' : 'text-outline/50'}`}>
                         {isTaken ? 'check_circle' : 'radio_button_unchecked'}
                       </span>
                       <span className={`font-semibold text-sm ${isTaken ? 'text-on-surface line-through decoration-on-surface-variant/40' : 'text-on-surface'}`}>{name}</span>
                     </div>
                   </div>
                 )
               })}
             </div>
           </div>

           <TreeGallery />
        </div>
      </div>
    </div>
  );
}
