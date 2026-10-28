import { describe, it, expect } from 'vitest';
import {
  DeterministicVerifier,
  UnboxGenerator,
  Milestone,
  CodebaseParser,
  CodeGraph,
  RankingEngine
} from '../src/index.js';

describe('Phase 5: Unbox Mode & Deterministic Invariant Verifier', () => {
  const sampleMilestone: Milestone = {
    id: 'test-m0',
    title: 'Stage 0: Engine Loop',
    stage: 0,
    description: 'Implement Engine class with start method',
    targetFile: 'engine.js',
    starterCode: 'export class Engine { start() { return false; } }',
    referenceSolution: 'export class Engine { start() { return true; } }',
    check: {
      type: 'composite',
      expectedSymbols: ['Engine'],
      requiredPatterns: ['start()'],
      testSnippet: `
        const e = new Engine();
        if (e.start() !== true) throw new Error("Expected start() to return true");
      `
    },
    hints: ['Return true from start']
  };

  it('rejects submissions that are empty or have syntax errors', () => {
    const emptyRes = DeterministicVerifier.evaluateSubmission(sampleMilestone, '', 'JavaScript');
    expect(emptyRes.passed).toBe(false);
    expect(emptyRes.exitCode).toBe(1);

    const syntaxErrRes = DeterministicVerifier.evaluateSubmission(
      sampleMilestone,
      'export class Engine { def invalid() {',
      'JavaScript'
    );
    expect(syntaxErrRes.passed).toBe(false);
  });

  it('rejects submissions missing required AST symbols', () => {
    const missingSymRes = DeterministicVerifier.evaluateSubmission(
      sampleMilestone,
      'export function NotAnEngine() { return true; }',
      'JavaScript'
    );
    expect(missingSymRes.passed).toBe(false);
    expect(missingSymRes.feedback).toContain('Missing required symbol(s): Engine');
  });

  it('rejects submissions failing deterministic unit-test assertions', () => {
    const wrongLogicRes = DeterministicVerifier.evaluateSubmission(
      sampleMilestone,
      sampleMilestone.starterCode,
      'JavaScript'
    );
    expect(wrongLogicRes.passed).toBe(false);
    expect(wrongLogicRes.feedback).toContain('Invariant test assertion failed');
  });

  it('accepts correct submissions passing all deterministic invariants without LLM', () => {
    const successRes = DeterministicVerifier.evaluateSubmission(
      sampleMilestone,
      sampleMilestone.referenceSolution,
      'JavaScript'
    );
    expect(successRes.passed).toBe(true);
    expect(successRes.exitCode).toBe(0);
    expect(successRes.feedback).toContain('All deterministic invariant checks passed');
  });

  it('auto-generates an Unbox course from a ranked code graph', () => {
    const files = {
      'app.py': 'class Engine:\n    def run(self):\n        return True\n',
      'routes.py': 'from app import Engine\ndef route():\n    return Engine().run()\n'
    };

    const parser = new CodebaseParser();
    const parsedMap = new Map();
    for (const [p, c] of Object.entries(files)) {
      const parsed = parser.parseFile(p, c);
      if (parsed) parsedMap.set(p, parsed);
    }
    const graph = CodeGraph.fromParsedFiles(parsedMap);
    const ranking = RankingEngine.rank(graph);

    const course = UnboxGenerator.generateCourse('test/repo', files, ranking);
    expect(course.repo).toBe('test/repo');
    expect(course.isReviewed).toBe(false);
    expect(course.milestones.length).toBeGreaterThanOrEqual(3);

    // Verify Stage 0 milestone
    const stage0 = course.milestones[0];
    expect(stage0.stage).toBe(0);
    expect(stage0.targetFile).toBe('app.py');
    expect(stage0.check.expectedSymbols).toContain('Engine');
  });
});
