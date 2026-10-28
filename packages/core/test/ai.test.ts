import { describe, it, expect } from 'vitest';
import {
  TemplateExplanationEngine,
  ExplanationEngine,
  WebGPUExplanationProvider,
  AIProviderConfig,
  ExplanationRequest
} from '../src/index.js';

describe('Phase 6: Explanations Engine & Socratic AI Layer', () => {
  const sampleCode = `
def factorial(n: int) -> int:
    # TODO: Implement base case and recursive logic
    pass
  `;

  it('generates rich Socratic hints from template engine without LLM', () => {
    const req: ExplanationRequest = {
      mode: 'socratic-hint',
      code: sampleCode,
      language: 'python',
      filePath: 'src/math.py',
      milestoneTitle: 'Recursive Base Case',
      milestoneGoal: 'Compute factorial(n) for non-negative integers',
      errorFeedback: 'AssertionError: factorial(1) returned None'
    };

    const res = TemplateExplanationEngine.explain(req);
    expect(res.provider).toBe('template');
    expect(res.explanation).toContain('Socratic Guidance');
    expect(res.explanation).toContain('Recursive Base Case');
    expect(res.guidingQuestions).toBeDefined();
    expect(res.guidingQuestions!.length).toBeGreaterThan(0);
    expect(res.keyInvariants).toBeDefined();
  });

  it('generates architecture explanations for module files', () => {
    const req: ExplanationRequest = {
      mode: 'architecture-explainer',
      code: `import { Router } from 'express';\nexport const router = Router();`,
      language: 'typescript',
      filePath: 'src/routes/api.ts'
    };

    const res = TemplateExplanationEngine.explain(req);
    expect(res.explanation).toContain('Module Architecture Analysis');
    expect(res.explanation).toContain('src/routes/api.ts');
  });

  it('generates milestone roadmaps', () => {
    const req: ExplanationRequest = {
      mode: 'milestone-guide',
      code: sampleCode,
      language: 'python',
      milestoneTitle: 'Stage 1: Ingestion Router'
    };

    const res = TemplateExplanationEngine.explain(req);
    expect(res.explanation).toContain('Milestone Roadmap');
    expect(res.explanation).toContain('Stage 1: Ingestion Router');
  });

  it('falls back gracefully to template heuristics when Gemini API key is missing', async () => {
    const config: AIProviderConfig = {
      provider: 'gemini',
      enabled: true,
      apiKey: '' // Missing key
    };

    const req: ExplanationRequest = {
      mode: 'socratic-hint',
      code: sampleCode,
      language: 'python'
    };

    const res = await ExplanationEngine.explain(req, config);
    expect(res.provider).toBe('template');
    expect(res.explanation).toBeDefined();
  });

  it('falls back gracefully when WebGPU is not available in Node environment', async () => {
    const config: AIProviderConfig = {
      provider: 'webgpu',
      enabled: true
    };

    const req: ExplanationRequest = {
      mode: 'socratic-hint',
      code: sampleCode,
      language: 'python'
    };

    const res = await ExplanationEngine.explain(req, config);
    expect(res.provider).toBe('template');
  });

  it('detects WebGPU environment accurately', () => {
    const supported = WebGPUExplanationProvider.isWebGPUSupported();
    // In Node.js testing environment, navigator.gpu does not exist
    expect(supported).toBe(false);
  });
});
