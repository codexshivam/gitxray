import { IngestionOptions, IngestionResult } from '../types.js';
export declare class GitHubIngestion {
    private cache;
    private isIgnored;
    fetchRepo(owner: string, repo: string, ref?: string, options?: IngestionOptions): Promise<IngestionResult>;
}
//# sourceMappingURL=github.d.ts.map