export declare class IngestionCache {
    private memCache;
    private isBrowser;
    constructor();
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
}
//# sourceMappingURL=cache.d.ts.map