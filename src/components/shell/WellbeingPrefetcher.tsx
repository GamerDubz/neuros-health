"use client";

import { useEffect } from "react";
import { getDailyWellbeingTip } from "@/lib/db/wellbeing";

// Fires the wellbeing fetch as soon as the app shell mounts so the daily card
// loads instantly when the user reaches the home screen. The result is cached
// in a module-level variable — no re-fetch happens on subsequent navigations.
export function WellbeingPrefetcher() {
  useEffect(() => {
    getDailyWellbeingTip(); // warm the cache; ignore the result here
  }, []);

  return null;
}
