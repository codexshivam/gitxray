export class DependencyGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.reverseEdges = new Map();
  }

  addNode(id, data = {}) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, ...data });
      this.edges.set(id, new Set());
      this.reverseEdges.set(id, new Set());
    } else {
      Object.assign(this.nodes.get(id), data);
    }
  }

  addEdge(fromId, toId, weight = 1) {
    if (!this.nodes.has(fromId)) this.addNode(fromId);
    if (!this.nodes.has(toId)) this.addNode(toId);
    this.edges.get(fromId).add(toId);
    this.reverseEdges.get(toId).add(fromId);
  }

  getNeighbors(id) {
    return Array.from(this.edges.get(id) || []);
  }

  getPredecessors(id) {
    return Array.from(this.reverseEdges.get(id) || []);
  }

  computeDegreeCentrality() {
    const totalNodes = this.nodes.size;
    const result = new Map();
    if (totalNodes <= 1) {
      for (const id of this.nodes.keys()) {
        result.set(id, { inDegree: 0, outDegree: 0, totalDegree: 0 });
      }
      return result;
    }

    const divisor = totalNodes - 1;
    for (const id of this.nodes.keys()) {
      const outDeg = (this.edges.get(id) || new Set()).size;
      const inDeg = (this.reverseEdges.get(id) || new Set()).size;
      result.set(id, {
        inDegree: inDeg / divisor,
        outDegree: outDeg / divisor,
        totalDegree: (inDeg + outDeg) / divisor
      });
    }
    return result;
  }

  computePageRank(damping = 0.85, maxIterations = 100, tolerance = 1e-6) {
    const n = this.nodes.size;
    if (n === 0) return new Map();

    const nodeIds = Array.from(this.nodes.keys());
    let ranks = new Map();
    const initialRank = 1 / n;
    for (const id of nodeIds) {
      ranks.set(id, initialRank);
    }

    for (let iter = 0; iter < maxIterations; iter++) {
      const nextRanks = new Map();
      let diff = 0;

      let danglingSum = 0;
      for (const id of nodeIds) {
        if ((this.edges.get(id) || new Set()).size === 0) {
          danglingSum += ranks.get(id);
        }
      }

      const baseValue = (1 - damping) / n + (damping * danglingSum) / n;

      for (const id of nodeIds) {
        let incomingSum = 0;
        const incoming = this.reverseEdges.get(id) || new Set();
        for (const sourceId of incoming) {
          const outCount = (this.edges.get(sourceId) || new Set()).size;
          if (outCount > 0) {
            incomingSum += ranks.get(sourceId) / outCount;
          }
        }

        const newRank = baseValue + damping * incomingSum;
        nextRanks.set(id, newRank);
        diff += Math.abs(newRank - ranks.get(id));
      }

      ranks = nextRanks;
      if (diff < tolerance) {
        break;
      }
    }

    return ranks;
  }

  computeClosenessCentrality() {
    const nodeIds = Array.from(this.nodes.keys());
    const n = nodeIds.length;
    const closeness = new Map();
    if (n <= 1) {
      for (const id of nodeIds) closeness.set(id, 0);
      return closeness;
    }

    for (const startId of nodeIds) {
      const distances = new Map();
      const queue = [startId];
      distances.set(startId, 0);

      while (queue.length > 0) {
        const current = queue.shift();
        const currentDist = distances.get(current);
        const neighbors = this.edges.get(current) || new Set();

        for (const neighbor of neighbors) {
          if (!distances.has(neighbor)) {
            distances.set(neighbor, currentDist + 1);
            queue.push(neighbor);
          }
        }
      }

      let totalDist = 0;
      let reachable = 0;
      for (const [id, d] of distances.entries()) {
        if (id !== startId) {
          totalDist += d;
          reachable++;
        }
      }

      if (reachable > 0 && totalDist > 0) {
        const rawCloseness = (reachable / (n - 1)) * (reachable / totalDist);
        closeness.set(startId, rawCloseness);
      } else {
        closeness.set(startId, 0);
      }
    }

    return closeness;
  }

  computeBetweennessCentrality() {
    const nodeIds = Array.from(this.nodes.keys());
    const betweenness = new Map();
    for (const id of nodeIds) betweenness.set(id, 0);

    for (const s of nodeIds) {
      const stack = [];
      const predecessors = new Map();
      const sigma = new Map();
      const dist = new Map();

      for (const v of nodeIds) {
        predecessors.set(v, []);
        sigma.set(v, 0);
        dist.set(v, -1);
      }

      sigma.set(s, 1);
      dist.set(s, 0);
      const queue = [s];

      while (queue.length > 0) {
        const v = queue.shift();
        stack.push(v);
        const d_v = dist.get(v);

        for (const w of this.edges.get(v) || []) {
          if (dist.get(w) < 0) {
            queue.push(w);
            dist.set(w, d_v + 1);
          }
          if (dist.get(w) === d_v + 1) {
            sigma.set(w, sigma.get(w) + sigma.get(v));
            predecessors.get(w).push(v);
          }
        }
      }

      const delta = new Map();
      for (const v of nodeIds) delta.set(v, 0);

      while (stack.length > 0) {
        const w = stack.pop();
        for (const v of predecessors.get(w)) {
          const c = (sigma.get(v) / (sigma.get(w) || 1)) * (1 + delta.get(w));
          delta.set(v, delta.get(v) + c);
        }
        if (w !== s) {
          betweenness.set(w, betweenness.get(w) + delta.get(w));
        }
      }
    }

    const n = nodeIds.length;
    if (n > 2) {
      const scale = 1 / ((n - 1) * (n - 2));
      for (const [id, val] of betweenness.entries()) {
        betweenness.set(id, val * scale);
      }
    }

    return betweenness;
  }

  computeEigenvectorCentrality(maxIterations = 100, tolerance = 1e-6) {
    const nodeIds = Array.from(this.nodes.keys());
    const n = nodeIds.length;
    let scores = new Map();
    if (n === 0) return scores;

    const initial = 1 / Math.sqrt(n);
    for (const id of nodeIds) scores.set(id, initial);

    for (let iter = 0; iter < maxIterations; iter++) {
      const nextScores = new Map();
      let normSq = 0;

      for (const id of nodeIds) {
        let sum = 0;
        for (const inId of this.reverseEdges.get(id) || []) {
          sum += scores.get(inId);
        }
        nextScores.set(id, sum);
        normSq += sum * sum;
      }

      const norm = Math.sqrt(normSq) || 1e-9;
      let diff = 0;
      for (const id of nodeIds) {
        const normalized = nextScores.get(id) / norm;
        diff += Math.abs(normalized - scores.get(id));
        nextScores.set(id, normalized);
      }

      scores = nextScores;
      if (diff < tolerance) break;
    }

    return scores;
  }

  computeClusteringCoefficients() {
    const coefficients = new Map();
    for (const [id, neighborsSet] of this.edges.entries()) {
      const allNeighbors = new Set([...neighborsSet, ...(this.reverseEdges.get(id) || [])]);
      allNeighbors.delete(id);
      const k = allNeighbors.size;

      if (k < 2) {
        coefficients.set(id, 0);
        continue;
      }

      const neighborList = Array.from(allNeighbors);
      let connections = 0;

      for (let i = 0; i < neighborList.length; i++) {
        for (let j = i + 1; j < neighborList.length; j++) {
          const u = neighborList[i];
          const v = neighborList[j];
          if ((this.edges.get(u) || new Set()).has(v) || (this.edges.get(v) || new Set()).has(u)) {
            connections++;
          }
        }
      }

      const possible = (k * (k - 1)) / 2;
      coefficients.set(id, connections / possible);
    }
    return coefficients;
  }

  analyze() {
    const pageRank = this.computePageRank();
    const betweenness = this.computeBetweennessCentrality();
    const closeness = this.computeClosenessCentrality();
    const degrees = this.computeDegreeCentrality();
    const eigenvector = this.computeEigenvectorCentrality();
    const clustering = this.computeClusteringCoefficients();

    const rankedNodes = [];
    for (const [id, node] of this.nodes.entries()) {
      const pr = pageRank.get(id) || 0;
      const bw = betweenness.get(id) || 0;
      const cl = closeness.get(id) || 0;
      const dg = degrees.get(id) || { inDegree: 0, outDegree: 0, totalDegree: 0 };
      const ev = eigenvector.get(id) || 0;
      const cc = clustering.get(id) || 0;

      const gravityScore = pr * 0.4 + bw * 0.25 + cl * 0.15 + ev * 0.2;

      rankedNodes.push({
        id,
        ...node,
        metrics: {
          pageRank: pr,
          betweenness: bw,
          closeness: cl,
          degrees: dg,
          eigenvector: ev,
          clusteringCoefficient: cc,
          gravityScore
        }
      });
    }

    rankedNodes.sort((a, b) => b.metrics.gravityScore - a.metrics.gravityScore);

    const totalNodes = rankedNodes.length;
    const coreCount = Math.max(1, Math.ceil(totalNodes * 0.05));
    const gravityWells = rankedNodes.slice(0, coreCount);

    return {
      totalNodes,
      totalEdges: Array.from(this.edges.values()).reduce((acc, s) => acc + s.size, 0),
      gravityWells,
      allNodes: rankedNodes
    };
  }
}
