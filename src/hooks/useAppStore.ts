"use client";

import { useContext } from "react";
import { AppStoreContext } from "@/providers/app-store-context";

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }

  return context;
}
