import { CodeGraph } from './graph.js';
import { CentralityMetrics } from '../types.js';
export declare class CentralityEngine {
    static computePageRank(graph: CodeGraph, damping?: number, maxIterations?: number, tolerance?: number): Map<string, number>;
    static computeBetweennessCentrality(graph: CodeGraph): Map<string, number>;
    static computeDegreeCentrality(graph: CodeGraph): Map<string, {
        inDegree: number;
        outDegree: number;
    }>;
    static calculateMetrics(graph: CodeGraph): Map<string, CentralityMetrics>;
}
//# sourceMappingURL=centrality.d.ts.map