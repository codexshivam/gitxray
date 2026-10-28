export interface ExporterOptions {
    repoName: string;
    maxTopModules?: number;
    includeInvariants?: boolean;
    includeBlastRadius?: boolean;
}
export interface ModuleBlastRadius {
    file: string;
    score: number;
    stage: number;
    directDependents: string[];
    transitiveDownstreamCount: number;
}
//# sourceMappingURL=types.d.ts.map