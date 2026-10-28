import { Milestone, CheckEvaluationResult } from './types.js';
export declare class DeterministicVerifier {
    private static parser;
    /**
     * Evaluates student submitted code against deterministic milestone invariants.
     * NEVER uses an LLM to judge correctness.
     */
    static evaluateSubmission(milestone: Milestone, submittedCode: string, language: string): CheckEvaluationResult;
}
//# sourceMappingURL=verifier.d.ts.map