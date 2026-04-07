"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function FirstMedicationSetup({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => setStep(2);
  const handleFinish = () => {
    // In a real app, we'd add the medication to the store
    // Trigger celebration
    onClose();
  };

  const skipSetup = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-6 pb-0">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={skipSetup}
        className="absolute inset-0 bg-scrim/40 backdrop-blur-sm"
      />

      {/* Modal / Sheet */}
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-[500px] bg-surface rounded-t-4xl sm:rounded-3xl shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-container flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-[32px] text-primary">psychiatry</span>
            </div>
            <h2 className="text-[2rem] font-extrabold text-on-surface leading-tight tracking-tight">
              {step === 1 ? "Let's get your\nroutine started." : "When do you\ntake it?"}
            </h2>
            <p className="text-on-surface-variant text-base mt-2">
              {step === 1 ? "Add your first medication to plant your Health Tree." : "We'll send you a gentle reminder so you don't have to remember."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mx-4">Medication Name</label>
                  <input 
                    type="text"
                    placeholder="e.g., Sertraline"
                    autoFocus
                    className="w-full h-14 bg-surface-container-lowest border border-surface-container rounded-2xl px-4 text-[15px] font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mx-4">Dosage</label>
                  <input 
                    type="text"
                    placeholder="e.g., 50mg"
                    className="w-full h-14 bg-surface-container-lowest border border-surface-container rounded-2xl px-4 text-[15px] font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mx-4">Reminder Time</label>
                  <input 
                    type="time"
                    defaultValue="08:00"
                    className="w-full h-14 bg-surface-container-lowest border border-surface-container rounded-2xl px-4 text-[15px] font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  />
                </div>
                
                {/* Visual feedback of the reward */}
                <div className="bg-tertiary-container/30 rounded-2xl p-4 mt-6 border border-tertiary-fixed-dim/20 flex gap-4 items-center">
                  <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>eco</span>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Plant your seed</h4>
                    <p className="text-[13px] text-on-surface-variant">Adding this will unlock your Health Tree.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-surface-container-lowest border-t border-surface-container-low flex items-center justify-between pb-safe">
           <button 
             onClick={skipSetup}
             className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2"
           >
             Do this later
           </button>
           <button 
             onClick={step === 1 ? handleNext : handleFinish}
             className="h-12 px-8 rounded-full gradient-primary text-white font-bold text-[15px] shadow-btn active:scale-95 transition-all flex items-center justify-center hover:brightness-105"
           >
             {step === 1 ? "Continue" : (
               <span className="inline-flex items-center gap-2">
                 Plant My Tree
                 <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>eco</span>
               </span>
             )}
           </button>
        </div>
      </motion.div>
    </div>
  );
}
