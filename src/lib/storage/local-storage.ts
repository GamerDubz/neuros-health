// Safe localStorage helpers for the client-side app store.

export function readStorageValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorageValue(key: string, value: unknown): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or private browsing can block writes; fail silently.
  }
}
