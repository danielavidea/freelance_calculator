import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

interface Options<T> {
  /** Wins over anything saved, e.g. state that arrived through a shared link. */
  seed?: T;
  /** Set false to keep state in memory only. */
  persist?: boolean;
}

function read<T>(key: string): T | undefined {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? undefined : (JSON.parse(raw) as T);
  } catch {
    return undefined;
  }
}

/** useState that survives reloads. Storage can be blocked, so every access is guarded. */
export function useStored<T>(
  key: string,
  initial: T,
  { seed, persist = true }: Options<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => seed ?? (persist ? read<T>(key) : undefined) ?? initial);

  useEffect(() => {
    if (!persist) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Private mode or quota: the app still works, it just won't remember.
    }
  }, [key, value, persist]);

  return [value, setValue];
}
