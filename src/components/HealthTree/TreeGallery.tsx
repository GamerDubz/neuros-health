"use client";

import React, { useState } from "react";
import { HealthTree } from "./HealthTree";

export function TreeGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [demoPulse, setDemoPulse] = useState(0);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-8 py-4 px-6 bg-surface-container-lowest border border-surface-container hover:border-primary transition-colors rounded-2xl flex items-center justify-between group shadow-sm active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">forest</span>
          <div className="text-left">
            <h3 className="font-bold text-on-surface text-sm">View Tree Growth Stages</h3>
            <p className="text-xs text-on-surface-variant">See all 7 levels and their animations</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-surface/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-surface-container">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container">
          <div>
            <h2 className="text-xl font-extrabold text-on-surface">Health Tree Stages</h2>
            <p className="text-sm text-on-surface-variant">Your commitment visualised. Tap pulse to test animations.</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Content grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((stage) => (
              <div key={stage} className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 flex flex-col items-center justify-between gap-4 shadow-sm hover:border-primary-container transition-colors group">
                <div className="min-h-[180px] flex items-end justify-center w-full">
                  <HealthTree 
                    stage={stage} 
                    sizeVariant="medium" 
                    pulseKey={demoPulse}
                    animateTransition={true}
                  />
                </div>
                <div className="text-center w-full pt-4 border-t border-surface-container">
                  <p className="text-sm font-extrabold text-on-surface">Stage {stage}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">
                    {stage === 1 ? 'Seed' : stage === 7 ? 'Flourishing' : 'Growing'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-surface-container bg-surface-container-lowest flex justify-end">
          <button 
            onClick={() => setDemoPulse(prev => prev + 1)}
            className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-full shadow-md active:scale-95 transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            Trigger Pulse Animation
          </button>
        </div>

      </div>
    </div>
  );
}
