export class CentralityEngine {
    static computePageRank(graph, damping = 0.85, maxIterations = 100, tolerance = 1e-6) {
        const nodes = graph.getFileNodes().map(n => n.id);
        const n = nodes.length;
        const ranks = new Map();
        if (n === 0)
            return ranks;
        const initial = 1 / n;
        for (const id of nodes) {
            ranks.set(id, initial);
        }
        for (let iter = 0; iter < maxIterations; iter++) {
            const nextRanks = new Map();
            let diff = 0;
            // Sum rank of dangling nodes (out-degree = 0)
            let danglingSum = 0;
            for (const id of nodes) {
                if (graph.getFileNeighbors(id).length === 0) {
                    danglingSum += ranks.get(id);
                }
            }
            const baseValue = (1 - damping) / n + (damping * danglingSum) / n;
            for (const id of nodes) {
                let incomingSum = 0;
                const predecessors = graph.getFilePredecessors(id);
                for (const pred of predecessors) {
                    const outCount = graph.getFileNeighbors(pred).length;
                    if (outCount > 0) {
                        incomingSum += ranks.get(pred) / outCount;
                    }
                }
                const newRank = baseValue + damping * incomingSum;
                nextRanks.set(id, newRank);
                diff += Math.abs(newRank - ranks.get(id));
            }
            for (const [id, val] of nextRanks.entries()) {
                ranks.set(id, val);
            }
            if (diff < tolerance) {
                break;
            }
        }
        return ranks;
    }
    static computeBetweennessCentrality(graph) {
        const nodes = graph.getFileNodes().map(n => n.id);
        const n = nodes.length;
        const cb = new Map();
        for (const v of nodes)
            cb.set(v, 0);
        for (const s of nodes) {
            const stack = [];
            const predecessors = new Map();
            const sigma = new Map();
            const dist = new Map();
            for (const v of nodes) {
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
                for (const w of graph.getFileNeighbors(v)) {
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
            for (const v of nodes)
                delta.set(v, 0);
            while (stack.length > 0) {
                const w = stack.pop();
                for (const v of predecessors.get(w)) {
                    const c = (sigma.get(v) / (sigma.get(w) || 1)) * (1 + delta.get(w));
                    delta.set(v, delta.get(v) + c);
                }
                if (w !== s) {
                    cb.set(w, cb.get(w) + delta.get(w));
                }
            }
        }
        // Normalize betweenness
        if (n > 2) {
            const scale = 1 / ((n - 1) * (n - 2));
            for (const [id, val] of cb.entries()) {
                cb.set(id, val * scale);
            }
        }
        return cb;
    }
    static computeDegreeCentrality(graph) {
        const nodes = graph.getFileNodes().map(n => n.id);
        const n = nodes.length;
        const divisor = n > 1 ? n - 1 : 1;
        const result = new Map();
        for (const id of nodes) {
            const inCount = graph.getFilePredecessors(id).length;
            const outCount = graph.getFileNeighbors(id).length;
            result.set(id, {
                inDegree: inCount / divisor,
                outDegree: outCount / divisor
            });
        }
        return result;
    }
    static calculateMetrics(graph) {
        const pageRank = this.computePageRank(graph);
        const betweenness = this.computeBetweennessCentrality(graph);
        const degrees = this.computeDegreeCentrality(graph);
        const metricsMap = new Map();
        for (const node of graph.getFileNodes()) {
            const pr = pageRank.get(node.id) || 0;
            const bw = betweenness.get(node.id) || 0;
            const deg = degrees.get(node.id) || { inDegree: 0, outDegree: 0 };
            metricsMap.set(node.id, {
                pageRank: pr,
                betweenness: bw,
                inDegree: deg.inDegree,
                outDegree: deg.outDegree
            });
        }
        return metricsMap;
    }
}
//# sourceMappingURL=centrality.js.map