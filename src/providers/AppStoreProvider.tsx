"use client";

import { ReactNode, useEffect, useState } from "react";
import { readStorageValue, writeStorageValue } from "@/lib/storage/local-storage";
import { AppStoreContext } from "@/providers/app-store-context";
import type { LogEntry, Medication, UserProfile } from "@/types/store";

const DEFAULT_USER: UserProfile = {
  name: "Alex",
  isPremium: false,
  streakDays: 6,
  points: 450,
  badges: ["First Triage", "3-Day Streak"],
  conditions: ["Type 2 Diabetes", "Hypertension"],
  allergies: ["Penicillin", "Peanuts"],
  remindersEnabled: true,
};

const DEMO_MEDICATIONS: Medication[] = [
  {
    id: "m1",
    slug: "levothyroxine",
    name: "Levothyroxine",
    dose: "100mcg",
    frequency: "Daily",
    time: ["08:30 AM"],
    type: "Pill",
    description: "Used to treat an underactive thyroid (hypothyroidism).",
    sideEffects: ["Weight changes", "Headache", "Tremors", "Nervousness"],
    warnings: ["Seek emergency help if you have severe chest pain or uneven heartbeats."],
    selfCare: ["Take on an empty stomach, 30-60 minutes before breakfast.", "Take with a full glass of water."],
  },
  {
    id: "m2",
    slug: "lisinopril",
    name: "Lisinopril",
    dose: "20mg",
    frequency: "Once daily",
    time: ["10:15 PM"],
    type: "Tablet",
    description: "An ACE inhibitor used to treat high blood pressure and heart failure.",
    sideEffects: ["Dry cough", "Dizziness", "Headache"],
    warnings: ["Do not use if pregnant. Call your doctor if you have signs of an allergic reaction."],
    selfCare: ["Drink plenty of water", "Avoid getting up too fast from a sitting or lying position"],
  },
  {
    id: "m4",
    slug: "metformin",
    name: "Metformin",
    dose: "500mg",
    frequency: "With lunch",
    time: ["01:00 PM"],
    type: "Tablet",
    description: "Used to improve blood sugar control in adults with type 2 diabetes.",
    sideEffects: ["Nausea", "Stomach upset", "Diarrhea"],
    warnings: ["Lactic acidosis is a rare but serious complication. Seek immediate help if symptoms occur."],
    selfCare: ["Take with meals to reduce stomach upset", "Check blood sugar as directed"],
  },
];

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => readStorageValue("neuros-user", DEFAULT_USER));
  const [medications, setMedications] = useState<Medication[]>(() =>
    readStorageValue("neuros-medications", DEMO_MEDICATIONS)
  );
  const [logs, setLogs] = useState<LogEntry[]>(() => readStorageValue("neuros-logs", []));

  useEffect(() => {
    writeStorageValue("neuros-user", user);
  }, [user]);

  useEffect(() => {
    writeStorageValue("neuros-medications", medications);
  }, [medications]);

  useEffect(() => {
    writeStorageValue("neuros-logs", logs);
  }, [logs]);

  const checkIn = (medicationId: string, dateStr: string) => {
    setLogs((previousLogs) => {
      const existingLog = previousLogs.find(
        (log) => log.medicationId === medicationId && log.dateStr === dateStr
      );

      if (existingLog) return previousLogs;

      const nextLogs = [...previousLogs, { medicationId, dateStr, taken: true }];

      setUser((currentUser) => {
        const nextStreak = (currentUser.streakDays || 0) + 1;
        const nextBadges = [...currentUser.badges];

        if (nextStreak === 7 && !nextBadges.includes("7-Day Streak")) {
          nextBadges.push("7-Day Streak");
        }

        return {
          ...currentUser,
          points: currentUser.points + 10,
          streakDays: nextStreak,
          badges: nextBadges,
        };
      });

      return nextLogs;
    });
  };

  const addMedication = (medication: Medication) => {
    setMedications((previousMedications) => [...previousMedications, medication]);

    setUser((currentUser) => {
      const nextBadges = [...currentUser.badges];

      if (!nextBadges.includes("First Med Added")) {
        nextBadges.push("First Med Added");
      }

      return { ...currentUser, badges: nextBadges };
    });
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((previousUser) => ({ ...previousUser, ...updates }));
  };

  return (
    <AppStoreContext.Provider
      value={{ user, medications, logs, checkIn, addMedication, updateUser }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}
