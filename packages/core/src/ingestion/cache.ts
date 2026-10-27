import { get, set } from 'idb-keyval';

export class IngestionCache {
  private memCache = new Map<string, any>();
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isBrowser) {
      try {
        const val = await get(key);
        return (val as T) ?? null;
      } catch {
        return (this.memCache.get(key) as T) ?? null;
      }
    }
    return (this.memCache.get(key) as T) ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (this.isBrowser) {
      try {
        await set(key, value);
      } catch {
        this.memCache.set(key, value);
      }
    } else {
      this.memCache.set(key, value);
    }
  }
}
