import { CodeGraph } from './graph.js';
import { RankingResult } from '../types.js';
export declare class RankingEngine {
    static isBoilerplatePath(filePath: string): boolean;
    static rank(graph: CodeGraph): RankingResult;
    /**
     * Tarjan's Strongly Connected Components (SCC) condensation + topological sort
     * Collapses cyclic dependencies into multi-file composite stages.
     */
    static computeTopologicalStages(graph: CodeGraph): string[][];
    private static findSCCs;
}
//# sourceMappingURL=ranking.d.ts.map