export class BlastRadiusAnalyzer {
  constructor(dependencyGraph) {
    this.graph = dependencyGraph;
  }

  calculateBlastRadius(changedFiles = []) {
    const affectedNodes = new Set();
    const queue = [...changedFiles];
    const visited = new Set(changedFiles);

    while (queue.length > 0) {
      const current = queue.shift();
      const predecessors = this.graph.getPredecessors(current);

      for (const pred of predecessors) {
        if (!visited.has(pred)) {
          visited.add(pred);
          affectedNodes.add(pred);
          queue.push(pred);
        }
      }
    }

    const totalNodes = this.graph.nodes.size || 1;
    const impactCount = affectedNodes.size + changedFiles.length;
    const impactPercentage = ((impactCount / totalNodes) * 100).toFixed(1);

    const severity =
      impactPercentage > 40 ? 'CRITICAL' : impactPercentage > 15 ? 'HIGH' : impactPercentage > 5 ? 'MEDIUM' : 'LOW';

    const rankedAffected = Array.from(affectedNodes).map(id => {
      const nodeData = this.graph.nodes.get(id) || {};
      return {
        id,
        language: nodeData.language || 'unknown',
        depth: this._calculateDistance(changedFiles, id)
      };
    });

    rankedAffected.sort((a, b) => a.depth - b.depth);

    return {
      changedFiles,
      affectedCount: affectedNodes.size,
      totalImpacted: impactCount,
      impactPercentage: parseFloat(impactPercentage),
      severity,
      affectedNodes: rankedAffected
    };
  }

  _calculateDistance(startNodes, target) {
    const queue = startNodes.map(s => ({ node: s, dist: 0 }));
    const visited = new Set(startNodes);

    while (queue.length > 0) {
      const { node, dist } = queue.shift();
      if (node === target) return dist;

      for (const pred of this.graph.getPredecessors(node)) {
        if (!visited.has(pred)) {
          visited.add(pred);
          queue.push({ node: pred, dist: dist + 1 });
        }
      }
    }
    return 1;
  }

  formatMarkdownReport(blastRadiusResult, repoName = 'target-repository') {
    const { changedFiles, affectedCount, impactPercentage, severity, affectedNodes } = blastRadiusResult;

    const severityEmoji =
      severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : severity === 'MEDIUM' ? '🟡' : '🟢';

    let md = `### ${severityEmoji} GitXray Blast-Radius Audit: \`${impactPercentage}%\` Surface Impact\n\n`;
    md += `| Metric | Value |\n| :--- | :--- |\n`;
    md += `| **Severity Rating** | \`${severity}\` |\n`;
    md += `| **Changed Entrypoints** | \`${changedFiles.length}\` files |\n`;
    md += `| **Downstream Nodes Impacted** | \`${affectedCount}\` modules |\n`;
    md += `| **Blast Radius** | \`${impactPercentage}%\` of repository |\n\n`;

    if (affectedNodes.length > 0) {
      md += `#### Downstream Impact Tree\n`;
      md += `\`\`\`text\n`;
      for (const node of affectedNodes.slice(0, 10)) {
        const indent = '  '.repeat(node.depth);
        md += `${indent}↳ [D+${node.depth}] ${node.id} (${node.language})\n`;
      }
      if (affectedNodes.length > 10) {
        md += `  ... and ${affectedNodes.length - 10} more affected downstream nodes\n`;
      }
      md += `\`\`\`\n\n`;
    }

    md += `> Verified with [GitXray](https://gitxray.dev/${repoName}) • Zero-install live codebase decompiler and execution trace\n`;
    return md;
  }
}
