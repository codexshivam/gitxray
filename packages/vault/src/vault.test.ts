import { describe, it, expect } from 'vitest';
import { ARCHITECTURE_VAULT, CURATED_COURSES } from './index.js';
import { DeterministicVerifier } from '@gitxray/core';

describe('Phase 8: Architecture Vault & Curated Courses', () => {
  it('exposes exactly 50 well-known open source repositories across AI, Frontend, and Backend', () => {
    expect(ARCHITECTURE_VAULT.length).toBe(50);

    const aiRepos = ARCHITECTURE_VAULT.filter((r) => r.category === 'AI & Autonomous Agents');
    const feRepos = ARCHITECTURE_VAULT.filter((r) => r.category === 'Frontend & Web Systems');
    const beRepos = ARCHITECTURE_VAULT.filter((r) => r.category === 'Backend & Runtimes');

    expect(aiRepos.length).toBe(15);
    expect(feRepos.length).toBe(18);
    expect(beRepos.length).toBe(17);
  });

  it('exposes 10 fully curated and reviewed courses in CURATED_COURSES', () => {
    const courseKeys = Object.keys(CURATED_COURSES);
    expect(courseKeys.length).toBe(10);

    for (const key of courseKeys) {
      const course = CURATED_COURSES[key];
      expect(course.isReviewed).toBe(true);
      expect(course.milestones.length).toBeGreaterThan(0);

      for (const m of course.milestones) {
        expect(m.starterCode).toBeDefined();
        expect(m.referenceSolution).toBeDefined();
        expect(m.check).toBeDefined();
      }
    }
  });

  it('verifies that reference solutions pass deterministic verification harness for all 10 curated courses', async () => {
    for (const [key, course] of Object.entries(CURATED_COURSES)) {
      for (const milestone of course.milestones) {
        const result = DeterministicVerifier.evaluateSubmission(
          milestone,
          milestone.referenceSolution,
          course.language.toLowerCase()
        );

        if (!result.passed) {
          throw new Error(`Course ${key} milestone ${milestone.id} failed verification: ${result.feedback}`);
        }
        expect(result.passed).toBe(true);
      }
    }
  });
});
