import { RankingResult, CoreGraphOutput } from '@gitxray/core';
export interface LocalAnalysis {
    graph: CoreGraphOutput;
    ranking: RankingResult;
    fileCount: number;
}
export declare class LocalScanner {
    static scanDirectory(dirPath: string): {
        relativePath: string;
        content: string;
    }[];
    static analyzeLocal(targetDir: string): Promise<LocalAnalysis>;
}
//# sourceMappingURL=scanner.d.ts.map