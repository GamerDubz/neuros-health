"use client";

import React, { useEffect, useState } from "react";
import "./HealthTreeStyles.css";

// The tree uses CSS variables for colors, mapped in globals.css for light/dark mode
// sizeVariant mappings
const SIZE_CLASSES: Record<string, string> = {
  micro: "tree-micro",
  tiny: "tree-tiny",
  small: "tree-small",
  medium: "tree-medium",
  standard: "tree-standard",
  large: "tree-large",
  hero: "tree-hero",
  display: "tree-display",
};

export interface HealthTreeProps {
  stage: number; // 1-7
  sizeVariant?: "micro" | "tiny" | "small" | "medium" | "standard" | "large" | "hero" | "display";
  isWilted?: boolean;
  className?: string;
  animateTransition?: boolean;
  // Trigger dose taken pulse
  pulseKey?: number;
}

export const HealthTree: React.FC<HealthTreeProps> = ({
  stage,
  sizeVariant = "standard",
  isWilted = false,
  className = "",
  animateTransition = false,
  pulseKey = 0,
}) => {
  const sizeClass = SIZE_CLASSES[sizeVariant] || SIZE_CLASSES.standard;
  const isSimplified = sizeVariant === "micro" || sizeVariant === "tiny";

  const [currentStage, setCurrentStage] = useState(stage);
  const [transitionState, setTransitionState] = useState<"idle" | "out" | "in">("idle");
  const [bursts, setBursts] = useState<number[]>([]);
  const [localPulse, setLocalPulse] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);

  // Handle stage transitions
  useEffect(() => {
    if (stage !== currentStage && animateTransition) {
      setTransitionState("out");
      setTimeout(() => {
        setCurrentStage(stage);
        setTransitionState("in");
        // Trigger particle burst
        setBursts((prev) => [...prev, Date.now()]);
        
        // Return to idle after growIn completes
        setTimeout(() => setTransitionState("idle"), 800);
      }, 400); // Wait for growOut to finish
    } else {
      setCurrentStage(stage);
    }
  }, [stage, currentStage, animateTransition]);

  // Handle pulse
  useEffect(() => {
    if (pulseKey !== localPulse) {
      setLocalPulse(pulseKey);
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 500);
    }
  }, [pulseKey, localPulse]);

  // Handle particle cleanup
  useEffect(() => {
    if (bursts.length > 0) {
      const timer = setTimeout(() => {
        setBursts((prev) => prev.slice(1));
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [bursts]);

  const getContainerClasses = () => {
    let classes = `tree-svg stage-${currentStage} ${sizeClass} ${className}`;
    if (transitionState === "out") classes += " tree-stage-out";
    if (transitionState === "in") classes += " tree-stage-in";
    if (isWilted) classes += " wilted";
    else if (!isWilted && transitionState === "idle") classes += " reviving"; // This needs better logic to only apply on un-wilt
    // if pulse is active add pulse
    if (pulseActive) classes += " pulse";
    return classes;
  };

  // Render SVG based on stage
  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={getContainerClasses()} data-stage="1">
            <ellipse cx="50" cy="88" rx="28" ry="7" fill="var(--color-primary)" opacity="0.10"/>
            <ellipse cx="50" cy="89" rx="22" ry="4" fill="var(--color-tertiary)" opacity="0.06"/>
            <ellipse cx="50" cy="86" rx="5" ry="7" fill="var(--color-secondary)" opacity="0.75"/>
            <ellipse cx="50" cy="84" rx="3.5" ry="3" fill="var(--color-secondary-fixed-dim)" opacity="0.50"/>
            <path d="M49 81 Q47 77 49 75" fill="none" stroke="var(--color-tertiary)" strokeWidth="1.8" strokeLinecap="round" opacity="0.80"/>
            <path d="M51 81 Q53 77 51 75" fill="none" stroke="var(--color-primary-container)" strokeWidth="1.8" strokeLinecap="round" opacity="0.70"/>
            {!isSimplified && <circle cx="50" cy="74" r="1.5" fill="var(--color-tertiary-fixed)" opacity="0.55"/>}
          </svg>
        );
      case 2:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={getContainerClasses()} data-stage="2">
            <ellipse cx="50" cy="90" rx="22" ry="4.5" fill="var(--color-primary)" opacity="0.09"/>
            <path d="M49 90 Q51 78 50 72" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round"/>
            <ellipse cx="44" cy="70" rx="5" ry="8" fill="var(--color-tertiary)" opacity="0.90" transform="rotate(-30 44 70)"/>
            <ellipse cx="56" cy="68" rx="6" ry="9" fill="var(--color-primary-container)" opacity="0.90" transform="rotate(25 56 68)"/>
            <circle cx="50" cy="66" r="5" fill="var(--color-primary)"/>
            {!isSimplified && <circle cx="52" cy="62" r="2.5" fill="var(--color-tertiary-fixed)" opacity="0.60"/>}
          </svg>
        );
      case 3:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={getContainerClasses()} data-stage="3">
            <ellipse cx="50" cy="90" rx="30" ry="5" fill="var(--color-primary)" opacity="0.10"/>
            <path d="M48 90 Q50 60 52 90" fill="none" stroke="var(--color-secondary)" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="40" cy="65" r="12" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="62" cy="62" r="14" fill="var(--color-primary)"/>
            <circle cx="50" cy="55" r="18" fill="var(--color-primary-container)"/>
            {!isSimplified && <circle cx="55" cy="45" r="4" fill="var(--color-tertiary-fixed)" opacity="0.60"/>}
          </svg>
        );
      case 4:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={getContainerClasses()} data-stage="4">
            <ellipse cx="50" cy="91" rx="34" ry="5.5" fill="var(--color-primary)" opacity="0.10"/>
            {!isSimplified && (
              <>
                <path d="M48 91 Q42 94 38 92" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.40"/>
                <path d="M52 91 Q58 94 62 92" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.40"/>
              </>
            )}
            <path d="M47 91 Q44 70 50 45" fill="none" stroke="var(--color-secondary)" strokeWidth="5" strokeLinecap="round"/>
            {!isSimplified && <path d="M48.5 88 Q46 68 51 48" fill="none" stroke="var(--color-secondary-fixed-dim)" strokeWidth="1.2" strokeLinecap="round" opacity="0.25"/>}
            <path d="M46 66 Q38 62 34 58" fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="38" cy="55" r="11" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="36" cy="50" r="9" fill="var(--color-tertiary)"/>
            <circle cx="65" cy="52" r="12" fill="var(--color-primary)"/>
            <circle cx="52" cy="44" r="19" fill="var(--color-primary-container)"/>
            <circle cx="50" cy="34" r="10" fill="var(--color-tertiary)"/>
            {!isSimplified && (
              <>
                <circle cx="58" cy="33" r="3.5" fill="var(--color-tertiary-fixed)" opacity="0.65"/>
                <circle cx="44" cy="38" r="2.5" fill="var(--color-primary-fixed-dim)" opacity="0.50"/>
              </>
            )}
          </svg>
        );
      case 5:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={getContainerClasses()} data-stage="5">
            {!isSimplified && <circle cx="50" cy="50" r="45" fill="var(--color-tertiary-fixed)" opacity="0.04"/>}
            <ellipse cx="50" cy="92" rx="38" ry="6" fill="var(--color-primary)" opacity="0.11"/>
            {!isSimplified && (
              <>
                <path d="M47 92 Q40 96 34 93" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
                <path d="M53 92 Q60 96 66 93" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
                <path d="M50 93 Q50 97 50 96" fill="none" stroke="var(--color-on-secondary-fixed-variant)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
              </>
            )}
            <path d="M46 92 Q43 68 49 42" fill="none" stroke="var(--color-secondary)" strokeWidth="6" strokeLinecap="round"/>
            {!isSimplified && <path d="M47.5 89 Q45 65 50 45" fill="none" stroke="var(--color-secondary-fixed-dim)" strokeWidth="1" strokeLinecap="round" opacity="0.20"/>}
            <path d="M45 60 Q34 54 28 48" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M51 68 Q62 63 70 58" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round"/>
            
            <circle cx="30" cy="44" r="10" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="70" cy="52" r="12" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="34" cy="38" r="12" fill="var(--color-tertiary)"/>
            <circle cx="67" cy="44" r="11" fill="var(--color-primary)"/>
            <circle cx="40" cy="42" r="14" fill="var(--color-primary-container)"/>
            <circle cx="62" cy="38" r="13" fill="var(--color-tertiary)"/>
            <circle cx="50" cy="32" r="20" fill="var(--color-primary-container)"/>
            <circle cx="50" cy="22" r="11" fill="var(--color-tertiary)"/>

            {!isSimplified && (
              <>
                <circle cx="56" cy="20" r="3.5" fill="var(--color-tertiary-fixed)" opacity="0.70"/>
                <circle cx="43" cy="26" r="2.5" fill="var(--color-tertiary-fixed)" opacity="0.55"/>
                <circle cx="63" cy="34" r="2" fill="var(--color-primary-fixed-dim)" opacity="0.50"/>
              </>
            )}
          </svg>
        );
      case 6:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={getContainerClasses()} data-stage="6">
            {!isSimplified && (
              <>
                <circle cx="50" cy="46" r="42" fill="var(--color-primary-fixed)" opacity="0.06"/>
                <circle cx="50" cy="46" r="32" fill="var(--color-primary-fixed-dim)" opacity="0.05"/>
              </>
            )}
            <ellipse cx="50" cy="93" rx="42" ry="6.5" fill="var(--color-primary)" opacity="0.12"/>
            {!isSimplified && (
              <>
                <path d="M46 93 Q37 98 30 95" fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round" opacity="0.50"/>
                <path d="M54 93 Q63 98 70 95" fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round" opacity="0.50"/>
                <path d="M49 94 Q44 99 42 97" fill="none" stroke="var(--color-on-secondary-fixed-variant)" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                <path d="M51 94 Q56 99 58 97" fill="none" stroke="var(--color-on-secondary-fixed-variant)" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
              </>
            )}
            <path d="M45 93 Q41 65 48 36" fill="none" stroke="var(--color-secondary)" strokeWidth="7" strokeLinecap="round"/>
            {!isSimplified && (
              <>
                <path d="M46.5 90 Q43 63 49 39" fill="none" stroke="var(--color-secondary-fixed-dim)" strokeWidth="1.2" strokeLinecap="round" opacity="0.22"/>
                <path d="M44 80 Q42 65 47 48" fill="none" stroke="var(--color-on-secondary-fixed-variant)" strokeWidth="0.8" strokeLinecap="round" opacity="0.15"/>
              </>
            )}
            <path d="M44 58 Q30 50 22 42" fill="none" stroke="var(--color-secondary)" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M50 52 Q65 44 74 36" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M48 70 Q62 64 72 60" fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round"/>

            <circle cx="24" cy="38" r="10" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="74" cy="32" r="11" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="72" cy="55" r="10" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="28" cy="32" r="13" fill="var(--color-tertiary)"/>
            <circle cx="70" cy="28" r="12" fill="var(--color-tertiary)"/>
            <circle cx="22" cy="46" r="9" fill="var(--color-primary)"/>
            <circle cx="74" cy="48" r="10" fill="var(--color-primary)"/>
            <circle cx="36" cy="34" r="15" fill="var(--color-primary-container)"/>
            <circle cx="64" cy="30" r="14" fill="var(--color-primary-container)"/>
            <circle cx="44" cy="42" r="13" fill="var(--color-tertiary)"/>
            <circle cx="57" cy="40" r="12" fill="var(--color-primary)"/>
            <circle cx="50" cy="26" r="18" fill="var(--color-primary-container)"/>
            <circle cx="50" cy="16" r="10" fill="var(--color-tertiary)"/>

            {!isSimplified && (
              <>
                <circle cx="54" cy="13" r="3.5" fill="var(--color-tertiary-fixed)" opacity="0.75"/>
                <circle cx="43" cy="20" r="2.5" fill="var(--color-tertiary-fixed)" opacity="0.60"/>
                <circle cx="67" cy="26" r="2" fill="var(--color-primary-fixed-dim)" opacity="0.55"/>
                <circle cx="32" cy="30" r="2.5" fill="var(--color-tertiary-fixed)" opacity="0.45"/>
              </>
            )}
          </svg>
        );
      case 7:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" overflow="visible" className={getContainerClasses()} data-stage="7">
            {!isSimplified && <circle cx="50" cy="44" r="48" fill="var(--color-primary-fixed)" opacity="0.07"/>}
            
            <ellipse cx="48" cy="93" rx="46" ry="7" fill="var(--color-primary)" opacity="0.13"/>
            {!isSimplified && <ellipse cx="48" cy="95" rx="36" ry="4" fill="var(--color-on-primary-fixed-variant)" opacity="0.08"/>}

            {!isSimplified && (
              <>
                <path d="M44 93 Q32 100 22 97" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" opacity="0.55"/>
                <path d="M52 93 Q64 100 74 97" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" opacity="0.55"/>
                <path d="M46 94 Q38 100 34 98" fill="none" stroke="var(--color-on-secondary-fixed-variant)" strokeWidth="2" strokeLinecap="round" opacity="0.40"/>
                <path d="M50 94 Q52 100 56 99" fill="none" stroke="var(--color-on-secondary-fixed-variant)" strokeWidth="2" strokeLinecap="round" opacity="0.40"/>
                <path d="M48 95 Q42 101 40 100" fill="none" stroke="var(--color-on-secondary-fixed-variant)" strokeWidth="1.5" strokeLinecap="round" opacity="0.30"/>

                <path d="M76 93 Q77 84 76 78" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" opacity="0.60"/>
                <circle cx="76" cy="74" r="7" fill="var(--color-on-primary-fixed-variant)" opacity="0.80"/>
                <circle cx="76" cy="71" r="5" fill="var(--color-tertiary)" opacity="0.75"/>
              </>
            )}

            <path d="M44 93 Q38 62 46 28" fill="none" stroke="var(--color-secondary)" strokeWidth="9" strokeLinecap="round"/>

            {!isSimplified && (
              <>
                <path d="M45.5 90 Q40 60 47 31" fill="none" stroke="var(--color-secondary-fixed-dim)" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
                <path d="M43 78 Q39 60 45 40" fill="none" stroke="var(--color-on-secondary-fixed-variant)" strokeWidth="1" strokeLinecap="round" opacity="0.18"/>
                <path d="M46 68 Q41 54 46 36" fill="none" stroke="var(--color-secondary-fixed-dim)" strokeWidth="0.6" strokeLinecap="round" opacity="0.12"/>
              </>
            )}

            <path d="M42 60 Q24 50 14 40" fill="none" stroke="var(--color-secondary)" strokeWidth="5" strokeLinecap="round"/>
            <path d="M38 52 Q26 44 20 36" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M48 48 Q68 38 80 28" fill="none" stroke="var(--color-secondary)" strokeWidth="4.5" strokeLinecap="round"/>
            <path d="M46 62 Q62 54 74 48" fill="none" stroke="var(--color-secondary)" strokeWidth="3.5" strokeLinecap="round"/>

            <circle cx="14" cy="36" r="12" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="80" cy="24" r="13" fill="var(--color-on-primary-fixed-variant)"/>
            <circle cx="72" cy="44" r="12" fill="var(--color-on-primary-fixed-variant)"/>

            <circle cx="18" cy="30" r="15" fill="var(--color-tertiary)"/>
            <circle cx="76" cy="20" r="14" fill="var(--color-tertiary)"/>
            <circle cx="20" cy="44" r="11" fill="var(--color-primary)"/>
            <circle cx="74" cy="40" r="12" fill="var(--color-primary)"/>

            <circle cx="28" cy="28" r="18" fill="var(--color-primary-container)"/>
            <circle cx="66" cy="26" r="17" fill="var(--color-primary-container)"/>
            <circle cx="38" cy="38" r="15" fill="var(--color-tertiary)"/>
            <circle cx="58" cy="36" r="14" fill="var(--color-primary)"/>

            <circle cx="32" cy="18" r="16" fill="var(--color-primary-container)"/> 
            <circle cx="64" cy="14" r="15" fill="var(--color-tertiary)"/> 
            <circle cx="48" cy="10" r="20" fill="var(--color-primary-container)"/> 

            <circle cx="48" cy="2" r="9" fill="var(--color-tertiary)"/>

            {!isSimplified && (
              <>
                <circle cx="52" cy="0" r="3.5" fill="var(--color-tertiary-fixed)" opacity="0.80"/>
                <circle cx="38" cy="10" r="2.5" fill="var(--color-tertiary-fixed)" opacity="0.65"/>
                <circle cx="66" cy="10" r="3" fill="var(--color-tertiary-fixed)" opacity="0.70"/>
                <circle cx="24" cy="22" r="2" fill="var(--color-primary-fixed-dim)" opacity="0.55"/>
                <circle cx="76" cy="18" r="2.5" fill="var(--color-tertiary-fixed)" opacity="0.50"/>

                <circle id="firefly-1" cx="42" cy="18" r="1.2" fill="var(--color-tertiary-fixed)" opacity="0"/>
                <circle id="firefly-2" cx="58" cy="24" r="1" fill="var(--color-primary-fixed-dim)" opacity="0"/>
                <circle id="firefly-3" cx="34" cy="30" r="1.2" fill="var(--color-tertiary-fixed)" opacity="0"/>
              </>
            )}
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {renderStage()}
      
      {bursts.length > 0 && (
        <div className="tree-particle-container">
          {bursts.map(b => (
            <React.Fragment key={b}>
              <div className="tree-particle" />
              <div className="tree-particle" />
              <div className="tree-particle" />
              <div className="tree-particle" />
              <div className="tree-particle" />
              <div className="tree-particle" />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
