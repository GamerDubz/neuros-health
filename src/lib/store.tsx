"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  time: string[];
  type: string;
  conditionId?: string;
  description?: string;
  sideEffects?: string[];
  warnings?: string[];
  selfCare?: string[];
}

export interface UserProfile {
  name: string;
  isPremium: boolean;
  streak: number;
  points: number;
  badges: string[];
  conditions: string[];
  allergies: string[];
  remindersEnabled: boolean;
}

interface LogEntry {
  medicationId: string;
  dateStr: string;
  taken: boolean;
}

interface StoreContextType {
  user: UserProfile;
  medications: Medication[];
  logs: LogEntry[];
  checkIn: (medicationId: string, dateStr: string) => void;
  addMedication: (med: Medication) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialMeds: Medication[] = [
  { 
    id: "m1", name: "Levothyroxine", dose: "100mcg", frequency: "Daily", time: ["08:30 AM"], type: "Pill",
    description: "Used to treat an underactive thyroid (hypothyroidism).",
    sideEffects: ["Weight changes", "Headache", "Tremors", "Nervousness"],
    warnings: ["Seek emergency help if you have severe chest pain or uneven heartbeats."],
    selfCare: ["Take on an empty stomach, 30-60 minutes before breakfast.", "Take with a full glass of water."]
  },
  { 
    id: "m2", name: "Lisinopril", dose: "20mg", frequency: "Once daily", time: ["10:15 PM"], type: "Tablet",
    description: "An ACE inhibitor used to treat high blood pressure and heart failure.",
    sideEffects: ["Dry cough", "Dizziness", "Headache"],
    warnings: ["Do not use if pregnant. Call your doctor if you have signs of an allergic reaction (swelling of face/lips/tongue)."],
    selfCare: ["Drink plenty of water", "Avoid getting up too fast from a sitting or lying position"]
  },
  { 
    id: "m4", name: "Metformin", dose: "500mg", frequency: "With lunch", time: ["01:00 PM"], type: "Tablet",
    description: "Used to improve blood sugar control in adults with type 2 diabetes.",
    sideEffects: ["Nausea", "Stomach upset", "Diarrhea"],
    warnings: ["Lactic acidosis is a rare but serious complication. Seek immediate help if you experience unusual muscle pain, trouble breathing, or unusual sleepiness."],
    selfCare: ["Take with meals to reduce stomach upset", "Check blood sugar as directed"]
  }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    name: "Alex",
    isPremium: false,
    streak: 6,
    points: 450,
    badges: ["First Triage", "3-Day Streak"],
    conditions: ["Type 2 Diabetes", "Hypertension"],
    allergies: ["Penicillin", "Peanuts"],
    remindersEnabled: true
  });

  const [medications, setMedications] = useState<Medication[]>(initialMeds);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const checkIn = (medicationId: string, dateStr: string) => {
    setLogs(prev => {
      if (prev.find(l => l.medicationId === medicationId && l.dateStr === dateStr)) return prev;
      const newLogs = [...prev, { medicationId, dateStr, taken: true }];
      
      setUser(current => {
        let newStreak = current.streak + 1;
        let newBadges = [...current.badges];
        
        // Gamification unlocking
        if (newStreak === 7 && !newBadges.includes("7-Day Streak")) newBadges.push("7-Day Streak");

        return {
          ...current,
          points: current.points + 10,
          streak: newStreak,
          badges: newBadges
        };
      });

      return newLogs;
    });
  };

  const addMedication = (med: Medication) => {
    setMedications(prev => [...prev, med]);
    setUser(current => {
      let b = [...current.badges];
      if (!b.includes("First Med Added")) b.push("First Med Added");
      return { ...current, badges: b };
    });
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <StoreContext.Provider value={{ user, medications, logs, checkIn, addMedication, updateUser }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
