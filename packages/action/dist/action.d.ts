import { CoreGraphEdge } from '@gitxray/core';
export interface ActionConfig {
    githubToken: string;
    repo: string;
    prNumber: number;
    enabled: boolean;
    maxDownstream?: number;
}
export interface PRBlastRadiusResult {
    changedFiles: string[];
    directDependents: string[];
    transitiveDownstream: string[];
    mermaidDiagram: string;
    commentBody: string;
}
export declare class BlastRadiusAction {
    static readonly STICKY_TAG = "<!-- gitxray-blast-radius -->";
    static generateMermaid(changedFiles: string[], directDependents: string[], edges: CoreGraphEdge[], maxNodes?: number): string;
    static buildCommentBody(repo: string, changedFiles: string[], directDependents: string[], transitiveDownstream: string[], mermaid: string): string;
    static execute(config: ActionConfig, changedFiles: string[], edges: CoreGraphEdge[]): Promise<PRBlastRadiusResult>;
    private static postOrUpdateComment;
}
//# sourceMappingURL=action.d.ts.map