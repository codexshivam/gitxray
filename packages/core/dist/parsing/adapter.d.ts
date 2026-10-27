import { LanguageAdapter } from '../types.js';
export declare class AdapterRegistry {
    private adapters;
    register(adapter: LanguageAdapter): void;
    getAdapter(filePath: string): LanguageAdapter | null;
}
//# sourceMappingURL=adapter.d.ts.map