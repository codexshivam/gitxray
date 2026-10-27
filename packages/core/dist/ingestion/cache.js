import { get, set } from 'idb-keyval';
export class IngestionCache {
    memCache = new Map();
    isBrowser;
    constructor() {
        this.isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
    }
    async get(key) {
        if (this.isBrowser) {
            try {
                const val = await get(key);
                return val ?? null;
            }
            catch {
                return this.memCache.get(key) ?? null;
            }
        }
        return this.memCache.get(key) ?? null;
    }
    async set(key, value) {
        if (this.isBrowser) {
            try {
                await set(key, value);
            }
            catch {
                this.memCache.set(key, value);
            }
        }
        else {
            this.memCache.set(key, value);
        }
    }
}
//# sourceMappingURL=cache.js.map