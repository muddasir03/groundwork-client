// A tiny store backed by localStorage, read through useSyncExternalStore so the server render and
// first browser render agree (both use the fallback) and updates reach every component.
// Used for per-browser state (compare selection, shortlist) until accounts exist in the API.
// If storage is blocked (private mode, disabled site data) it keeps working in memory.

export type LocalStore<T> = {
  read: () => T | null;
  write: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createLocalStore<T>(key: string): LocalStore<T> {
  const listeners = new Set<() => void>();
  let memory: string | null = null;
  let cachedRaw: string | null | undefined;
  let cachedValue: T | null = null;

  function getRaw(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory;
    }
  }

  function read(): T | null {
    const raw = getRaw();
    // Return the same object while the stored string is unchanged (useSyncExternalStore requires it).
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw === null ? null : (JSON.parse(raw) as T);
      } catch {
        cachedValue = null;
      }
    }
    return cachedValue;
  }

  function write(value: T) {
    const raw = JSON.stringify(value);
    memory = raw;
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      // Storage unavailable: `memory` keeps the value for this page session.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return { read, write, subscribe };
}
