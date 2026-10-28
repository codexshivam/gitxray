import { CodeGraph } from './graph.js';
import { CentralityEngine } from './centrality.js';
import { RankedFileNode, RankingResult } from '../types.js';

export class RankingEngine {
  static isBoilerplatePath(filePath: string): boolean {
    const lower = filePath.toLowerCase();
    const base = lower.split('/').pop() || lower;

    return (
      lower.includes('test/') ||
      lower.includes('tests/') ||
      lower.includes('__tests__/') ||
      lower.includes('fixtures/') ||
      lower.includes('migrations/') ||
      lower.includes('alembic/') ||
      base.startsWith('test_') ||
      base.endsWith('_test.py') ||
      base.includes('.test.') ||
      base.includes('.spec.') ||
      base === 'conftest.py' ||
      base === 'setup.py' ||
      base.startsWith('config.') ||
      base.startsWith('settings.') ||
      base.endsWith('.config.js') ||
      base.endsWith('.config.ts')
    );
  }

  static rank(graph: CodeGraph): RankingResult {
    const nodes = graph.getFileNodes();
    const metricsMap = CentralityEngine.calculateMetrics(graph);
    const stages = this.computeTopologicalStages(graph);

    // Build stage index map: file -> stageNumber
    const fileStageMap = new Map<string, number>();
    stages.forEach((stageGroup, stageIndex) => {
      stageGroup.forEach(file => {
        fileStageMap.set(file, stageIndex);
      });
    });

    const rankedFiles: RankedFileNode[] = nodes.map(node => {
      const metrics = metricsMap.get(node.id) || {
        pageRank: 0,
        betweenness: 0,
        inDegree: 0,
        outDegree: 0
      };

      const isBoilerplate = this.isBoilerplatePath(node.id);
      const rawScore = 0.50 * metrics.pageRank + 0.30 * metrics.betweenness + 0.20 * metrics.inDegree;
      const score = isBoilerplate ? rawScore * 0.20 : rawScore;

      return {
        id: node.id,
        language: node.language,
        lineCount: node.lineCount,
        isBoilerplate,
        score,
        metrics,
        stage: fileStageMap.get(node.id) ?? 0
      };
    });

    rankedFiles.sort((a, b) => b.score - a.score);

    const total = rankedFiles.length;
    const gravityCount = Math.max(1, Math.ceil(total * 0.25));
    const gravityWells = rankedFiles.slice(0, gravityCount);

    return {
      rankedFiles,
      stages,
      gravityWells
    };
  }

  /**
   * Tarjan's Strongly Connected Components (SCC) condensation + topological sort
   * Collapses cyclic dependencies into multi-file composite stages.
   */
  static computeTopologicalStages(graph: CodeGraph): string[][] {
    const nodes = graph.getFileNodes().map(n => n.id);
    const sccs = this.findSCCs(graph, nodes);

    // Map each node to its SCC index
    const nodeToScc = new Map<string, number>();
    sccs.forEach((scc, idx) => {
      scc.forEach(node => nodeToScc.set(node, idx));
    });

    // Build condensed DAG between SCC components
    const sccInDegree = new Array(sccs.length).fill(0);
    const sccAdjacency = new Map<number, Set<number>>();
    for (let i = 0; i < sccs.length; i++) {
      sccAdjacency.set(i, new Set());
    }

    for (const u of nodes) {
      const uScc = nodeToScc.get(u)!;
      for (const v of graph.getFileNeighbors(u)) {
        const vScc = nodeToScc.get(v)!;
        if (uScc !== vScc && !sccAdjacency.get(uScc)!.has(vScc)) {
          sccAdjacency.get(uScc)!.add(vScc);
          sccInDegree[vScc]++;
        }
      }
    }

    // Kahn's algorithm for topological sorting on condensed DAG
    const queue: number[] = [];
    for (let i = 0; i < sccs.length; i++) {
      if (sccInDegree[i] === 0) {
        queue.push(i);
      }
    }

    const stages: string[][] = [];
    while (queue.length > 0) {
      const currentLevelSize = queue.length;
      const currentLevelFiles: string[] = [];

      for (let i = 0; i < currentLevelSize; i++) {
        const sccIdx = queue.shift()!;
        currentLevelFiles.push(...sccs[sccIdx]);

        for (const nextScc of sccAdjacency.get(sccIdx)!) {
          sccInDegree[nextScc]--;
          if (sccInDegree[nextScc] === 0) {
            queue.push(nextScc);
          }
        }
      }

      currentLevelFiles.sort();
      stages.push(currentLevelFiles);
    }

    // Safety fallback for any unvisited nodes
    const visited = new Set(stages.flat());
    const remaining = nodes.filter(n => !visited.has(n));
    if (remaining.length > 0) {
      stages.push(remaining.sort());
    }

    return stages;
  }

  private static findSCCs(graph: CodeGraph, nodes: string[]): string[][] {
    let index = 0;
    const indices = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const sccs: string[][] = [];

    const strongConnect = (v: string) => {
      indices.set(v, index);
      lowlink.set(v, index);
      index++;
      stack.push(v);
      onStack.add(v);

      for (const w of graph.getFileNeighbors(v)) {
        if (!indices.has(w)) {
          strongConnect(w);
          lowlink.set(v, Math.min(lowlink.get(v)!, lowlink.get(w)!));
        } else if (onStack.has(w)) {
          lowlink.set(v, Math.min(lowlink.get(v)!, indices.get(w)!));
        }
      }

      if (lowlink.get(v) === indices.get(v)) {
        const component: string[] = [];
        let w = '';
        do {
          w = stack.pop()!;
          onStack.delete(w);
          component.push(w);
        } while (w !== v);
        sccs.push(component);
      }
    };

    for (const node of nodes) {
      if (!indices.has(node)) {
        strongConnect(node);
      }
    }

    return sccs;
  }
}
