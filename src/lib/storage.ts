const memoryStore = new Map<string, string>();

function getWebStorage(): Storage | null {
  try {
    const g = globalThis as { localStorage?: Storage };
    if (g.localStorage && typeof g.localStorage.getItem === 'function') {
      return g.localStorage;
    }
  } catch {
    /* storage unavailable */
  }
  return null;
}

export const storage = {
  getItem(key: string): string | null {
    const web = getWebStorage();
    if (web) {
      try {
        return web.getItem(key);
      } catch {
        /* ignore */
      }
    }
    return memoryStore.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    memoryStore.set(key, value);
    const web = getWebStorage();
    if (web) {
      try {
        web.setItem(key, value);
      } catch {
        /* ignore */
      }
    }
  },
  removeItem(key: string): void {
    memoryStore.delete(key);
    const web = getWebStorage();
    if (web) {
      try {
        web.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  },
};

