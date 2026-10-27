export class AgentExporter {
  constructor(graphAnalysis, repoName = 'project') {
    this.graphAnalysis = graphAnalysis;
    this.repoName = repoName;
  }

  generateClaudeMd() {
    const { totalNodes, totalEdges, gravityWells = [] } = this.graphAnalysis;

    let md = `# ${this.repoName} - Architectural Ontology & Invariants\n`;
    md += `> Compiled by GitXray Engine (Nodes: ${totalNodes}, Edges: ${totalEdges})\n\n`;

    md += `## Architectural Gravity Wells (Core Domain Kernels)\n`;
    md += `These files account for the core domain logic. Any edits here have maximal downstream blast-radius:\n`;
    for (const gw of gravityWells.slice(0, 8)) {
      md += `- \`${gw.id}\` (PageRank: ${gw.metrics?.pageRank?.toFixed(4) || 'N/A'}, Gravity: ${gw.metrics?.gravityScore?.toFixed(4) || 'N/A'})\n`;
    }
    md += `\n`;

    md += `## Structural Rules & Invariants\n`;
    md += `1. **Zero Silent State Drift**: Never introduce implicit circular dependencies crossing module boundaries.\n`;
    md += `2. **Downstream Blast-Radius Containment**: When touching gravity-well nodes, verify all callers and test cases.\n`;
    md += `3. **Pure Boundary Contracts**: Public exports must maintain explicit type signatures and handle upstream exceptions.\n\n`;

    md += `## Primary Dependency Flow\n`;
    md += `\`\`\`text\n`;
    for (const gw of gravityWells.slice(0, 5)) {
      md += `${gw.id}\n`;
    }
    md += `\`\`\`\n`;

    return md;
  }

  generateSkillsMd() {
    const { gravityWells = [] } = this.graphAnalysis;
    let md = `name: ${this.repoName}-architecture\n`;
    md += `description: Fast structural roadmap, critical gravity-well nodes, and invariants for ${this.repoName}.\n`;
    md += `version: 1.0.0\n---\n\n`;
    md += `# Essential Context\n`;
    md += `Core architectural files:\n`;
    for (const gw of gravityWells.slice(0, 6)) {
      md += `- \`${gw.id}\`\n`;
    }
    md += `\nAlways inspect these files first before applying cross-module patches.\n`;
    return md;
  }
}
