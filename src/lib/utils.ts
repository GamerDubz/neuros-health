import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { STREAK_THRESHOLDS } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return function(...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/** Returns the HealthTree growth stage (1–7) for a given streak count. */
export function getTreeStage(streak: number): number {
  if (streak >= 90) return 7
  if (streak >= 60) return 6
  if (streak >= 30) return 5
  if (streak >= 14) return 4
  if (streak >= 7)  return 3
  if (streak >= 3)  return 2
  return 1
}

/** Returns how many more streak days until the next tree stage unlock. */
export function getDaysToNextStage(streak: number): number {
  const next = STREAK_THRESHOLDS.find(t => t > streak)
  return next !== undefined ? next - streak : 0
}
