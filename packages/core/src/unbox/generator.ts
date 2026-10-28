import {
  RankingResult,
  RankedFileNode
} from '../types.js';
import {
  UnboxCourse,
  Milestone
} from './types.js';

export class UnboxGenerator {
  /**
   * Automatically generates an unbox "Build It From Scratch" course
   * from the repository's ranked dependency graph and topological stages.
   */
  static generateCourse(
    repo: string,
    files: Record<string, string>,
    ranking: RankingResult
  ): UnboxCourse {
    const topFiles = ranking.rankedFiles.filter((f) => !f.isBoilerplate);
    const kernelFile: RankedFileNode | undefined = topFiles[0];
    const kernelPath = kernelFile ? kernelFile.id : Object.keys(files)[0] || 'core.py';
    const kernelContent = files[kernelPath] || '';
    const kernelLines = kernelContent.split('\n');

    // Extract minimal Stage 0 reduction (target 40-80 lines)
    const stage0Slice = kernelLines.slice(0, Math.min(60, kernelLines.length)).join('\n');
    const isPython = kernelPath.endsWith('.py');
    const lang = isPython ? 'Python' : 'JavaScript';

    const milestones: Milestone[] = [];

    // Milestone 0: Foundational Kernel Loop
    milestones.push({
      id: 'stage-0',
      title: 'Stage 0: The Foundational Core Loop',
      stage: 0,
      description: `Implement the minimal architectural heartbeat for ${kernelPath}. Every downstream module depends on this core abstraction.`,
      targetFile: kernelPath,
      starterCode: isPython
        ? `class Engine:\n    def __init__(self, name: str):\n        self.name = name\n        self.active = False\n\n    def run(self):\n        # TODO: Activate engine and return status\n        pass\n`
        : `export class Engine {\n  name: string;\n  active: boolean;\n  constructor(name: string) {\n    this.name = name;\n    this.active = false;\n  }\n  run() {\n    // TODO: Activate engine and return status\n    return null;\n  }\n}\n`,
      referenceSolution: isPython
        ? `class Engine:\n    def __init__(self, name: str):\n        self.name = name\n        self.active = True\n\n    def run(self):\n        return {"status": "ACTIVE", "name": self.name}\n`
        : `export class Engine {\n  name: string;\n  active: boolean;\n  constructor(name: string) {\n    this.name = name;\n    this.active = true;\n  }\n  run() {\n    return { status: "ACTIVE", name: this.name };\n  }\n}\n`,
      check: {
        type: 'composite',
        expectedSymbols: ['Engine'],
        requiredPatterns: [isPython ? 'def run' : 'run()'],
        testSnippet: isPython
          ? `e = Engine('core')\nassert e.name == 'core'\n`
          : `const e = new Engine('core'); if (e.name !== 'core') throw new Error('Expected name core');`
      },
      hints: [
        'Initialize instance properties in the constructor',
        'Ensure the run method returns an object with status'
      ]
    });

    // Milestone 1: Routing & State Pipeline
    milestones.push({
      id: 'stage-1',
      title: 'Stage 1: State & Input Validation Pipeline',
      stage: 1,
      description: 'Implement invariant assertions and input sanitization before payloads enter core processing.',
      targetFile: isPython ? 'pipeline.py' : 'pipeline.js',
      starterCode: isPython
        ? `def validate_payload(data):\n    # TODO: Verify data is non-empty dictionary\n    pass\n`
        : `export function validatePayload(data) {\n  // TODO: Verify data is non-empty object\n  return false;\n}\n`,
      referenceSolution: isPython
        ? `def validate_payload(data):\n    if not data or not isinstance(data, dict):\n        raise ValueError("Invalid payload")\n    return True\n`
        : `export function validatePayload(data) {\n  if (!data || typeof data !== 'object') return false;\n  return true;\n}\n`,
      check: {
        type: 'composite',
        expectedSymbols: [isPython ? 'validate_payload' : 'validatePayload'],
        testSnippet: isPython
          ? `assert validate_payload({'key': 'val'}) is True\n`
          : `if (!validatePayload({ ok: true })) throw new Error('Expected valid payload');`
      },
      hints: [
        'Check type and existence of incoming data structure'
      ]
    });

    // Milestone 2: Downstream Dispatcher
    milestones.push({
      id: 'stage-2',
      title: 'Stage 2: Event & Action Dispatcher',
      stage: 2,
      description: 'Construct the event bus that routes processed inputs to downstream handler modules.',
      targetFile: isPython ? 'dispatcher.py' : 'dispatcher.js',
      starterCode: isPython
        ? `class Dispatcher:\n    def __init__(self):\n        self.handlers = {}\n\n    def register(self, event, handler):\n        pass\n`
        : `export class Dispatcher {\n  constructor() {\n    this.handlers = new Map();\n  }\n  register(event, handler) {\n    // TODO: Register event handler\n  }\n}\n`,
      referenceSolution: isPython
        ? `class Dispatcher:\n    def __init__(self):\n        self.handlers = {}\n\n    def register(self, event, handler):\n        self.handlers[event] = handler\n`
        : `export class Dispatcher {\n  constructor() {\n    this.handlers = new Map();\n  }\n  register(event, handler) {\n    this.handlers.set(event, handler);\n  }\n}\n`,
      check: {
        type: 'composite',
        expectedSymbols: ['Dispatcher'],
        testSnippet: isPython
          ? `d = Dispatcher()\nd.register('click', lambda: 1)\nassert 'click' in d.handlers\n`
          : `const d = new Dispatcher(); d.register('test', () => 1); if (!d.handlers.has('test')) throw new Error('Registration failed');`
      },
      hints: [
        'Store handlers keyed by event name'
      ]
    });

    return {
      repo,
      title: `Build ${repo.split('/').pop()} from Scratch`,
      language: lang,
      isReviewed: false,
      stage0Summary: `Minimal 40-line extraction of ${kernelPath} core execution loop.`,
      milestones
    };
  }
}
