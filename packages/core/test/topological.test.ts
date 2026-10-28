import { describe, it, expect } from 'vitest';
import { CodeGraph } from '../src/graph/graph.js';
import { RankingEngine } from '../src/graph/ranking.js';

describe('Topological Stage Ordering with Cycle Collapsing', () => {
  it('computes linear topological stages for acyclic DAG', () => {
    const graph = new CodeGraph();
    // A -> B -> C
    graph.addFileEdge('A', 'B');
    graph.addFileEdge('B', 'C');

    const stages = RankingEngine.computeTopologicalStages(graph);
    expect(stages.length).toBe(3);
    expect(stages[0]).toContain('A');
    expect(stages[1]).toContain('B');
    expect(stages[2]).toContain('C');
  });

  it('collapses cyclic dependencies into composite stages without crashing', () => {
    const graph = new CodeGraph();
    // A -> B -> C -> B (cycle between B and C)
    graph.addFileEdge('A', 'B');
    graph.addFileEdge('B', 'C');
    graph.addFileEdge('C', 'B');
    graph.addFileEdge('C', 'D');

    const stages = RankingEngine.computeTopologicalStages(graph);
    // B and C should be grouped together into a collapsed stage
    expect(stages.some(s => s.includes('B') && s.includes('C'))).toBe(true);
    expect(stages[0]).toContain('A');
  });
});
