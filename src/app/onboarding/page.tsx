"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HealthTree } from "@/components/HealthTree/HealthTree";

const SLIDES = [
  {
    id: 1,
    treeStage: 1,
    treeSize: "medium" as const,
    title: "Your data is\nyours.",
    desc: "Neuros Health does not sell your records to anyone, ever. Everything you log is securely stored with bank-grade encryption.",
    btnText: "Continue",
    chip: "🔒 100% Private",
  },
  {
    id: 2,
    treeStage: 2,
    treeSize: "large" as const,
    title: "Never miss a\ndose.",
    desc: "Set your routines. Get gentle nudges. Build streaks that make you feel genuinely proud of your consistency.",
    btnText: "Continue",
    chip: "⏰ Smart Tracking",
  },
  {
    id: 3,
    treeStage: 5,
    treeSize: "hero" as const,
    title: "Watch your\nhealth grow.",
    desc: "Every day you stick to your routine, your Health Tree flourishes. It's a living reflection of your commitment to yourself.",
    btnText: "Create Account",
    chip: "🌱 Meaningful Rewards",
  },
];

export default function OnboardingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.push("/signup");
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-br from-surface to-primary-container/20 flex flex-col justify-between overflow-hidden sm:justify-center sm:items-center">
      {/* Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-primary-fixed/20 blur-[100px] rounded-full sm:w-[600px] sm:h-[600px] opacity-60" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-tertiary-fixed/20 blur-[100px] rounded-full sm:w-[600px] sm:h-[600px] opacity-60" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative z-10 px-6 sm:bg-surface-container-lowest sm:shadow-2xl sm:rounded-3xl sm:h-[800px] sm:max-h-[90vh] sm:overflow-hidden sm:flex-none">
        
        {/* Dynamic Tree Container - Fixed Top Half */}
        <div className="h-[45vh] sm:h-[360px] flex items-end justify-center pb-8 relative shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex items-center justify-center relative"
            >
              <div className="absolute top-0 opacity-10 blur-2xl z-0 scale-150">
                <HealthTree stage={slide.treeStage} sizeVariant={slide.treeSize} animateTransition={true} />
              </div>
              <div className="relative z-10">
                <HealthTree stage={slide.treeStage} sizeVariant={slide.treeSize} animateTransition={true} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Section - Flexible Bottom Half */}
        <div className="flex-1 flex flex-col justify-end pb-12 sm:pb-16 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col flex-1"
            >
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-surface-container-low text-xs font-bold uppercase tracking-wider text-on-surface-variant self-start mb-6">
                 {slide.chip}
              </div>

              <h1 className="text-[2.5rem] leading-[1.1] font-extrabold tracking-tight text-on-surface whitespace-pre-line mb-4">
                {slide.title}
              </h1>
              
              <p className="text-base text-on-surface-variant leading-[1.6] mb-8">
                {slide.desc}
              </p>

              <div className="mt-auto">
                <button
                  onClick={handleNext}
                  className="w-full h-14 rounded-full gradient-primary text-white font-bold text-[17px] shadow-btn active:scale-[0.98] transition-all flex items-center justify-center hover:brightness-105"
                >
                  {slide.btnText}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {SLIDES.map((s, i) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-8 bg-primary"
                    : "w-2 bg-surface-container-high"
                }`}
              />
            ))}
          </div>

          {/* Login Link */}
          <div className="text-center mt-6 h-6">
             {currentSlide === 0 && (
               <motion.button 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="text-sm font-semibold text-primary hover:underline active:opacity-80 transition-all"
                 onClick={() => router.push("/login")}
               >
                 I already have an account
               </motion.button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
