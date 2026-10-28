export interface BadgeData {
    owner: string;
    repo: string;
    fileCount: number;
    stageCount: number;
    coreKernel?: string;
    score?: number;
}
export declare class SvgBadgeGenerator {
    static generateBadge(data: BadgeData): string;
}
//# sourceMappingURL=svg_badge.d.ts.map