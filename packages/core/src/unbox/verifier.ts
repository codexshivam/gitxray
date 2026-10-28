import {
  Milestone,
  CheckEvaluationResult
} from './types.js';
import { CodebaseParser } from '../parsing/parser.js';

export class DeterministicVerifier {
  private static parser = new CodebaseParser();

  /**
   * Evaluates student submitted code against deterministic milestone invariants.
   * NEVER uses an LLM to judge correctness.
   */
  static evaluateSubmission(
    milestone: Milestone,
    submittedCode: string,
    language: string
  ): CheckEvaluationResult {
    const trimmed = submittedCode.trim();
    if (!trimmed) {
      return {
        passed: false,
        exitCode: 1,
        feedback: 'Submission is empty. Please provide implementation code.'
      };
    }

    // 1. Check for uncompleted placeholders
    if (submittedCode.includes('TODO')) {
      return {
        passed: false,
        exitCode: 1,
        feedback: 'Incomplete implementation: TODO markers still remain.'
      };
    }

    // 2. Static AST Invariant Inspection
    const parsed = this.parser.parseFile(milestone.targetFile, submittedCode);
    if (!parsed) {
      return {
        passed: false,
        exitCode: 1,
        feedback: `Unsupported file type for AST validation: ${milestone.targetFile}`
      };
    }

    if (parsed.hasSyntaxErrors) {
      return {
        passed: false,
        exitCode: 1,
        feedback: 'Syntax error detected. Ensure the code compiles cleanly.'
      };
    }

    // 3. Symbol Presence Verification
    const expected = milestone.check.expectedSymbols || [];
    const definedSymbolNames = new Set(parsed.symbols.map((s) => s.name));
    const missing: string[] = [];

    for (const sym of expected) {
      if (!definedSymbolNames.has(sym)) {
        missing.push(sym);
      }
    }

    if (missing.length > 0) {
      return {
        passed: false,
        exitCode: 1,
        feedback: `Missing required symbol(s): ${missing.join(', ')}`,
        missingSymbols: missing
      };
    }

    // 4. Required Patterns Verification
    if (milestone.check.requiredPatterns) {
      for (const pattern of milestone.check.requiredPatterns) {
        if (!submittedCode.includes(pattern)) {
          return {
            passed: false,
            exitCode: 1,
            feedback: `Required invariant pattern not found: "${pattern}"`
          };
        }
      }
    }

    // 5. Forbidden Patterns Verification
    if (milestone.check.forbiddenPatterns) {
      for (const forbidden of milestone.check.forbiddenPatterns) {
        if (submittedCode.includes(forbidden)) {
          return {
            passed: false,
            exitCode: 1,
            feedback: `Forbidden pattern detected: "${forbidden}"`
          };
        }
      }
    }

    // 6. Functional Invariant Execution
    const testSnippet = milestone.check.testSnippet;
    if (testSnippet) {
      try {
        const isJsTs = language === 'JavaScript' || language === 'TypeScript' || milestone.targetFile.endsWith('.js') || milestone.targetFile.endsWith('.ts');
        if (isJsTs) {
          // Strip export keywords for in-function execution
          const executableCode = submittedCode
            .replace(/^\s*export\s+default\s+/gm, '')
            .replace(/^\s*export\s+/gm, '');

          const wrappedCode = `
            ${executableCode}
            ${testSnippet}
          `;
          const runTest = new Function(wrappedCode);
          runTest();
        } else {
          // Python placeholder and invariant verification
          if (submittedCode.includes('pass') && !milestone.referenceSolution.includes('pass')) {
            return {
              passed: false,
              exitCode: 1,
              feedback: 'Incomplete implementation: placeholder "pass" detected.'
            };
          }
        }
      } catch (err: any) {
        return {
          passed: false,
          exitCode: 1,
          feedback: `Invariant test assertion failed: ${err.message || String(err)}`
        };
      }
    }

    return {
      passed: true,
      exitCode: 0,
      feedback: '✓ All deterministic invariant checks passed.'
    };
  }
}
