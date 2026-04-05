"use client";

import React, { useEffect, useState } from "react";
import { HealthTree, HealthTreeProps } from "./HealthTree";
import "./HealthTreeStyles.css";

const STAGE_DATA: Record<number, { name: string; sub: string }> = {
  1: { name: "Dormant Seed", sub: "Stage 1 of 7 · Just beginning" },
  2: { name: "First Sprout", sub: "Stage 2 of 7 · Something is growing" },
  3: { name: "Healthy Sapling", sub: "Stage 3 of 7 · Growing Strong" },
  4: { name: "Young Tree", sub: "Stage 4 of 7 · Building Roots" },
  5: { name: "Flourishing Tree", sub: "Stage 5 of 7 · Thriving" },
  6: { name: "Mature Tree", sub: "Stage 6 of 7 · Deep Roots" },
  7: { name: "Ancient Grove", sub: "Stage 7 of 7 · Mastery Achieved" },
};

export interface TreeHeroCardProps {
  stage: number;
  streak: number;
  progressPct: number;
  daysToNext?: number;
  isWilted?: boolean;
  className?: string;
  sizeVariant?: HealthTreeProps["sizeVariant"];
  hideLabels?: boolean;
  hideStreak?: boolean;
  animateTransition?: boolean;
  pulseKey?: number;
}

export const TreeHeroCard: React.FC<TreeHeroCardProps> = ({
  stage,
  streak,
  progressPct,
  daysToNext,
  isWilted = false,
  className = "",
  sizeVariant = "standard",
  hideLabels = false,
  hideStreak = false,
  animateTransition = true,
  pulseKey = 0,
}) => {
  const data = STAGE_DATA[stage] || STAGE_DATA[1];
  
  // Progress animation on mount/update
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Small delay to allow CSS transition to happen after mount
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPct);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPct]);

  return (
    <div className={`tree-hero-card ${className}`} data-stage={stage}>
      
      {!hideStreak && (
        <div className={`tree-streak-chip ${isWilted || streak === 0 ? "broken" : ""}`}>
          {isWilted || streak === 0 ? (
             <><span className="material-symbols-outlined text-[16px] align-middle mr-1" aria-hidden>heart_broken</span>Streak broken</>
          ) : (
            <><span className="material-symbols-outlined text-[16px] align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>local_fire_department</span><span>{streak}</span> Day Streak!</>
          )}
        </div>
      )}

      <HealthTree 
        stage={stage} 
        sizeVariant={sizeVariant} 
        isWilted={isWilted} 
        animateTransition={animateTransition}
        pulseKey={pulseKey}
      />

      {!hideLabels && (
        <>
          <div className="tree-label-block">
            <h2 className="tree-stage-name">{data.name}</h2>
            <p className="tree-stage-sub">{data.sub}</p>
          </div>

          <div className="tree-progress-container">
            <div className="tree-progress-meta">
              <span>Progress</span>
              <span>{Math.round(animatedProgress)}%</span>
            </div>
            <div className="tree-progress-track">
               <div 
                 className="tree-progress-fill" 
                 style={{ width: `${animatedProgress}%` }}
               />
            </div>
            {daysToNext !== undefined && daysToNext > 0 && stage < 7 && (
              <p className="tree-progress-hint">{daysToNext} more days to next stage</p>
            )}
            {stage === 7 && (
              <p className="tree-progress-hint text-primary font-bold">Max level reached!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
