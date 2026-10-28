import { RankingResult } from '../types.js';
import { UnboxCourse } from './types.js';
export declare class UnboxGenerator {
    /**
     * Automatically generates an unbox "Build It From Scratch" course
     * from the repository's ranked dependency graph and topological stages.
     */
    static generateCourse(repo: string, files: Record<string, string>, ranking: RankingResult): UnboxCourse;
}
//# sourceMappingURL=generator.d.ts.map