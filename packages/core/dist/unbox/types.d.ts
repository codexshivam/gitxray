export type MilestoneCheckType = 'unit_test' | 'ast_match' | 'exit_code' | 'composite';
export interface DeterministicCheck {
    type: MilestoneCheckType;
    testSnippet: string;
    expectedSymbols?: string[];
    requiredPatterns?: string[];
    forbiddenPatterns?: string[];
}
export interface Milestone {
    id: string;
    title: string;
    stage: number;
    description: string;
    targetFile: string;
    starterCode: string;
    referenceSolution: string;
    check: DeterministicCheck;
    hints: string[];
}
export interface UnboxCourse {
    repo: string;
    title: string;
    language: string;
    isReviewed: boolean;
    stage0Summary: string;
    milestones: Milestone[];
}
export interface CheckEvaluationResult {
    passed: boolean;
    exitCode: number;
    feedback: string;
    missingSymbols?: string[];
    syntaxErrors?: string[];
    output?: string;
}
//# sourceMappingURL=types.d.ts.map