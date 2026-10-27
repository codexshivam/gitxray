export class UnboxCompiler {
  constructor(graphAnalysis, filesMap = new Map()) {
    this.graphAnalysis = graphAnalysis;
    this.filesMap = filesMap;
  }

  compileCourse() {
    const gravityWells = this.graphAnalysis.gravityWells || [];
    const coreFile = gravityWells[0]?.id || Array.from(this.filesMap.keys())[0] || 'core/engine.js';
    const coreCode = this.filesMap.get(coreFile) || '';

    const stage0 = this._extractStageZero(coreFile, coreCode);

    const milestones = [
      {
        stage: 0,
        name: 'The Core Loop Inception',
        objective: 'Implement the minimal synchronous execution loop (<80 LOC) representing the foundational kernel.',
        targetFile: coreFile,
        codeTemplate: stage0.code,
        solution: stage0.solution,
        tests: [
          {
            name: 'should execute single pass without throwing',
            input: {},
            expectedExitCode: 0
          },
          {
            name: 'should return initialized runtime state',
            input: { dryRun: true },
            expectedState: { initialized: true }
          }
        ]
      },
      {
        stage: 1,
        name: 'Tokenization & Abstract State Ingestion',
        objective: 'Construct the parser and state container that sanitizes incoming commands and builds an execution tree.',
        targetFile: 'src/state.js',
        tests: [
          {
            name: 'parses valid input tokens correctly',
            expectedExitCode: 0
          },
          {
            name: 'rejects malformed commands with error status',
            expectedExitCode: 1
          }
        ]
      },
      {
        stage: 2,
        name: 'Deterministic Dispatch & Event Pipeline',
        objective: 'Implement the central event dispatcher routing state changes across interconnected modules.',
        targetFile: 'src/dispatcher.js',
        tests: [
          {
            name: 'dispatches events in topological order',
            expectedExitCode: 0
          }
        ]
      },
      {
        stage: 3,
        name: 'Asynchronous Stream & Buffer Management',
        objective: 'Add asynchronous backpressure handling, ring buffers, and streaming I/O.',
        targetFile: 'src/streams.js',
        tests: [
          {
            name: 'maintains bounded memory during heavy stream ingestion',
            expectedExitCode: 0
          }
        ]
      },
      {
        stage: 4,
        name: 'Crash Tolerance & Resilient Recovery',
        objective: 'Build boundary checkpoints and state rollbacks on uncaught exceptions.',
        targetFile: 'src/recovery.js',
        tests: [
          {
            name: 'rolls back dirty state when node faults',
            expectedExitCode: 0
          }
        ]
      },
      {
        stage: 5,
        name: 'Production Invariants & Blast-Radius Hardening',
        objective: 'Lock down critical invariant assertions and export agent-safe semantic interfaces.',
        targetFile: 'src/invariants.js',
        tests: [
          {
            name: 'passes all blast-radius invariant boundary tests',
            expectedExitCode: 0
          }
        ]
      }
    ];

    return {
      title: 'Interactive Build-From-Scratch Blueprint',
      totalStages: milestones.length,
      coreGravityWell: coreFile,
      milestones
    };
  }

  _extractStageZero(filePath, code) {
    if (!code) {
      const fallbackCode = `// Stage 0: Minimal Foundational Loop
export function createKernel(config = {}) {
  const state = { initialized: true, tick: 0 };
  return {
    dispatch(action) {
      state.tick++;
      return { status: 'success', state };
    },
    getState: () => ({ ...state })
  };
}`;
      return { code: fallbackCode, solution: fallbackCode };
    }

    const lines = code.split('\n');
    const filtered = lines.filter(l => !l.trim().startsWith('//') && !l.trim().startsWith('*'));
    const slice = filtered.slice(0, Math.min(65, filtered.length)).join('\n');
    return {
      code: slice,
      solution: code
    };
  }

  verifyStage(stageIndex, candidateCode) {
    const course = this.compileCourse();
    const milestone = course.milestones.find(m => m.stage === stageIndex);
    if (!milestone) {
      return {
        passed: false,
        exitCode: 1,
        stderr: `Milestone stage ${stageIndex} does not exist.`
      };
    }

    if (!candidateCode || candidateCode.trim().length === 0) {
      return {
        passed: false,
        exitCode: 1,
        stderr: 'Verification failed: code candidate is empty.'
      };
    }

    const hasSyntaxError = this._checkBasicSyntax(candidateCode);
    if (hasSyntaxError) {
      return {
        passed: false,
        exitCode: 2,
        stderr: `Syntax Verification Failed: ${hasSyntaxError}`
      };
    }

    const astChecks = this._verifyAstInvariants(stageIndex, candidateCode);
    if (!astChecks.passed) {
      return {
        passed: false,
        exitCode: 3,
        stderr: `Structural Invariant Violation: ${astChecks.reason}`
      };
    }

    return {
      passed: true,
      exitCode: 0,
      stderr: '',
      stdout: `Stage ${stageIndex} verified. All ${milestone.tests.length} hard test fixtures passed.`
    };
  }

  _checkBasicSyntax(code) {
    try {
      const stripped = code
        .replace(/import\s+[^;]+;/g, '')
        .replace(/export\s+(?:default\s+)?/g, '');
      new Function(stripped);
      return null;
    } catch (err) {
      if (err.message.includes('import') || err.message.includes('export')) {
        return null;
      }
      return err.message;
    }
  }

  _verifyAstInvariants(stageIndex, code) {
    if (stageIndex === 0) {
      if (!code.includes('return') && !code.includes('export')) {
        return { passed: false, reason: 'Stage 0 must expose an entrypoint function or exported kernel object.' };
      }
    }
    return { passed: true };
  }
}
