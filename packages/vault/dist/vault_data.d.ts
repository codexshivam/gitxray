import { UnboxCourse } from '@gitxray/core';
export interface VaultCourse {
    repo: string;
    name: string;
    category: 'AI & Autonomous Agents' | 'Frontend & Web Systems' | 'Backend & Runtimes';
    language: 'Python' | 'JavaScript' | 'TypeScript';
    stars: string;
    gravityWell: string;
    stage0Summary: string;
    coreSnippet: string;
    isReviewed?: boolean;
}
export declare const ARCHITECTURE_VAULT: VaultCourse[];
export declare const CURATED_COURSES: Record<string, UnboxCourse>;
//# sourceMappingURL=vault_data.d.ts.map