import { CoreGraphEdge, RankedFileNode } from '../types.js';
import { ModuleBlastRadius } from './types.js';
export declare class BlastRadiusCalculator {
    static calculate(rankedFiles: RankedFileNode[], edges: CoreGraphEdge[]): Map<string, ModuleBlastRadius>;
    static getDownstreamForFiles(changedFiles: string[], edges: CoreGraphEdge[]): {
        direct: string[];
        transitive: string[];
    };
}
//# sourceMappingURL=blast_radius.d.ts.map