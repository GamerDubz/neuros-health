// src/lib/constants.ts
// Centralised constants — update here, changes propagate everywhere.

/** Navigation tabs shared by Sidebar and BottomNav */
export const NAV_TABS = [
  { name: 'Home',    href: '/home',        icon: 'home' },
  { name: 'Meds',    href: '/medications', icon: 'medical_services' },
  { name: 'Health',  href: '/health',      icon: 'medical_information' },
  { name: 'Tracker', href: '/tracker',     icon: 'leaderboard' },
  { name: 'Profile', href: '/profile',     icon: 'person' },
] as const;

/** Streak thresholds that unlock the next tree stage */
export const STREAK_THRESHOLDS = [3, 7, 14, 30, 60, 90] as const;

/** Search / autocomplete tuning */
export const SEARCH_DEBOUNCE_MS  = 250;
export const SEARCH_MAX_RESULTS  = 8;
export const SEARCH_FETCH_POOL   = 20; // fetch more than needed so re-ranking has candidates
export const FUZZY_THRESHOLD     = 0.25;
