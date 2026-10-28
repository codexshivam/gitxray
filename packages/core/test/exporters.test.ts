import { describe, it, expect } from 'vitest';
import {
  CodeGraph,
  RankingEngine,
  ClaudeMdExporter,
  AgentsSkillsExporter,
  BlastRadiusCalculator,
  SvgBadgeGenerator,
  CoreGraphEdge,
  RankedFileNode
} from '../src/index.js';

describe('Phase 7: Exporters, Blast Radius & SVG Badge', () => {
  const edges: CoreGraphEdge[] = [
    { source: 'src/app.ts', target: 'src/router.ts', weight: 1 },
    { source: 'src/router.ts', target: 'src/controller.ts', weight: 1 },
    { source: 'src/controller.ts', target: 'src/db.ts', weight: 1 },
    { source: 'src/service.ts', target: 'src/db.ts', weight: 1 }
  ];

  const rankedFiles: RankedFileNode[] = [
    {
      id: 'src/db.ts',
      score: 0.45,
      stage: 0,
      isBoilerplate: false,
      metrics: { pageRank: 0.4, betweenness: 0.5, inDegree: 2, outDegree: 0 }
    },
    {
      id: 'src/controller.ts',
      score: 0.3,
      stage: 1,
      isBoilerplate: false,
      metrics: { pageRank: 0.3, betweenness: 0.3, inDegree: 1, outDegree: 1 }
    },
    {
      id: 'src/router.ts',
      score: 0.15,
      stage: 2,
      isBoilerplate: false,
      metrics: { pageRank: 0.15, betweenness: 0.1, inDegree: 1, outDegree: 1 }
    },
    {
      id: 'src/app.ts',
      score: 0.1,
      stage: 3,
      isBoilerplate: false,
      metrics: { pageRank: 0.1, betweenness: 0.0, inDegree: 0, outDegree: 1 }
    }
  ];

  it('calculates direct dependents and transitive downstream blast radius accurately', () => {
    const blastMap = BlastRadiusCalculator.calculate(rankedFiles, edges);

    // Modifying src/db.ts affects controller.ts, service.ts, and transitively router.ts, app.ts
    const dbBlast = blastMap.get('src/db.ts');
    expect(dbBlast).toBeDefined();
    expect(dbBlast!.directDependents).toContain('src/controller.ts');
    expect(dbBlast!.directDependents).toContain('src/service.ts');
    expect(dbBlast!.transitiveDownstreamCount).toBeGreaterThanOrEqual(2);

    // Modifying src/app.ts affects 0 downstream files (leaf caller)
    const appBlast = blastMap.get('src/app.ts');
    expect(appBlast?.directDependents.length).toBe(0);
  });

  it('generates high-density CLAUDE.md with architectural invariants and stage flow', () => {
    const graph = {
      nodes: rankedFiles.map((f) => ({ id: f.id, label: f.id, metrics: f.metrics })),
      edges
    };

    const ranking = {
      rankedFiles,
      gravityWells: [rankedFiles[0]],
      stages: [
        ['src/db.ts'],
        ['src/controller.ts'],
        ['src/router.ts'],
        ['src/app.ts']
      ]
    };

    const doc = ClaudeMdExporter.export(graph, ranking, {
      repoName: 'test/sample-api'
    });

    expect(doc).toContain('# CLAUDE.md — Architecture & Agent Context for test/sample-api');
    expect(doc).toContain('Core Gravity Wells & High-Centrality Modules');
    expect(doc).toContain('Topological Stage Ordering');
    expect(doc).toContain('Blast Radius Invariants');
    expect(doc).toContain('src/db.ts');
  });

  it('generates standard .agents/skills.md context definition', () => {
    const graph = {
      nodes: rankedFiles.map((f) => ({ id: f.id, label: f.id, metrics: f.metrics })),
      edges
    };
    const ranking = {
      rankedFiles,
      gravityWells: [rankedFiles[0]],
      stages: [['src/db.ts']]
    };

    const doc = AgentsSkillsExporter.export(graph, ranking, {
      repoName: 'myorg/myrepo'
    });

    expect(doc).toContain('name: myorg-myrepo-architecture');
    expect(doc).toContain('## Core Modules & Impact Table');
    expect(doc).toContain('src/db.ts');
  });

  it('generates valid SVG architecture badges', () => {
    const svg = SvgBadgeGenerator.generateBadge({
      owner: 'pallets',
      repo: 'flask',
      fileCount: 42,
      stageCount: 4,
      coreKernel: 'src/flask/app.py'
    });

    expect(svg).toContain('<svg');
    expect(svg).toContain('42</tspan> files');
    expect(svg).toContain('4</tspan> stages');
    expect(svg).toContain('app.py');
    expect(svg).toContain('gitxray');
  });
});
