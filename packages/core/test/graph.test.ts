import { describe, it, expect } from 'vitest';
import { CodeGraph } from '../src/graph/graph.js';
import { CentralityEngine } from '../src/graph/centrality.js';

describe('CodeGraph and CentralityEngine', () => {
  it('constructs file and symbol graph accurately', () => {
    const graph = new CodeGraph();
    graph.addFileNode({ id: 'app.py', language: 'python', lineCount: 50, symbols: [] });
    graph.addFileNode({ id: 'routes.py', language: 'python', lineCount: 80, symbols: [] });
    graph.addFileEdge('app.py', 'routes.py');

    expect(graph.getFileNodes().length).toBe(2);
    expect(graph.getFileNeighbors('app.py')).toEqual(['routes.py']);
    expect(graph.getFilePredecessors('routes.py')).toEqual(['app.py']);
  });

  it('computes PageRank converging properly', () => {
    const graph = new CodeGraph();
    // A -> B -> C, D -> B
    graph.addFileEdge('A', 'B');
    graph.addFileEdge('B', 'C');
    graph.addFileEdge('D', 'B');

    const pr = CentralityEngine.computePageRank(graph);
    expect(pr.get('B')!).toBeGreaterThan(pr.get('A')!);
    expect(pr.get('C')!).toBeGreaterThan(0);
  });

  it('computes Brandes betweenness centrality accurately', () => {
    const graph = new CodeGraph();
    // Star / Hub: A -> B -> C -> D
    graph.addFileEdge('A', 'B');
    graph.addFileEdge('B', 'C');
    graph.addFileEdge('C', 'D');

    const bw = CentralityEngine.computeBetweennessCentrality(graph);
    // B and C are intermediate bridge nodes
    expect(bw.get('B')!).toBeGreaterThan(bw.get('A')!);
    expect(bw.get('C')!).toBeGreaterThan(bw.get('D')!);
  });

  it('computes in and out degree centrality', () => {
    const graph = new CodeGraph();
    graph.addFileEdge('A', 'B');
    graph.addFileEdge('C', 'B');

    const deg = CentralityEngine.computeDegreeCentrality(graph);
    expect(deg.get('B')?.inDegree).toBe(1.0); // 2 in / (3 - 1)
    expect(deg.get('B')?.outDegree).toBe(0.0);
  });
});
