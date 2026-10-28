export class BlastRadiusCalculator {
    static calculate(rankedFiles, edges) {
        // Build reverse adjacency list: target -> Set<source> (files that import target)
        const reverseAdj = new Map();
        for (const edge of edges) {
            if (!reverseAdj.has(edge.target)) {
                reverseAdj.set(edge.target, new Set());
            }
            reverseAdj.get(edge.target).add(edge.source);
        }
        const blastMap = new Map();
        for (const node of rankedFiles) {
            const direct = Array.from(reverseAdj.get(node.id) || []);
            // Transitive downstream calculation via BFS
            const visited = new Set();
            const queue = [...direct];
            for (const d of direct) {
                visited.add(d);
            }
            while (queue.length > 0) {
                const curr = queue.shift();
                const upstreams = reverseAdj.get(curr);
                if (upstreams) {
                    for (const next of upstreams) {
                        if (!visited.has(next) && next !== node.id) {
                            visited.add(next);
                            queue.push(next);
                        }
                    }
                }
            }
            blastMap.set(node.id, {
                file: node.id,
                score: node.score,
                stage: node.stage ?? 0,
                directDependents: direct,
                transitiveDownstreamCount: visited.size
            });
        }
        return blastMap;
    }
    static getDownstreamForFiles(changedFiles, edges) {
        const reverseAdj = new Map();
        for (const edge of edges) {
            if (!reverseAdj.has(edge.target)) {
                reverseAdj.set(edge.target, new Set());
            }
            reverseAdj.get(edge.target).add(edge.source);
        }
        const directSet = new Set();
        const transitiveSet = new Set();
        const queue = [];
        for (const changed of changedFiles) {
            const dependents = reverseAdj.get(changed);
            if (dependents) {
                for (const dep of dependents) {
                    directSet.add(dep);
                    if (!transitiveSet.has(dep)) {
                        transitiveSet.add(dep);
                        queue.push(dep);
                    }
                }
            }
        }
        while (queue.length > 0) {
            const curr = queue.shift();
            const nextDependents = reverseAdj.get(curr);
            if (nextDependents) {
                for (const dep of nextDependents) {
                    if (!transitiveSet.has(dep) && !changedFiles.includes(dep)) {
                        transitiveSet.add(dep);
                        queue.push(dep);
                    }
                }
            }
        }
        return {
            direct: Array.from(directSet),
            transitive: Array.from(transitiveSet)
        };
    }
}
//# sourceMappingURL=blast_radius.js.map