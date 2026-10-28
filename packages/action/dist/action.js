import { BlastRadiusCalculator } from '@gitxray/core';
export class BlastRadiusAction {
    static STICKY_TAG = '<!-- gitxray-blast-radius -->';
    static generateMermaid(changedFiles, directDependents, edges, maxNodes = 20) {
        const lines = ['```mermaid', 'graph LR'];
        // Add changed nodes
        lines.push('  subgraph Changed ["⚡ PR Changed Files"]');
        for (const c of changedFiles.slice(0, 5)) {
            const label = c.split('/').pop() || c;
            const safeId = c.replace(/[^a-zA-Z0-9_]/g, '_');
            lines.push(`    ${safeId}["${label}"]:::changed`);
        }
        lines.push('  end');
        // Add direct downstream nodes
        if (directDependents.length > 0) {
            lines.push('  subgraph Downstream ["🎯 Affected Downstream"]');
            for (const d of directDependents.slice(0, maxNodes)) {
                const label = d.split('/').pop() || d;
                const safeId = d.replace(/[^a-zA-Z0-9_]/g, '_');
                lines.push(`    ${safeId}["${label}"]:::affected`);
            }
            lines.push('  end');
            // Edges between changed and affected
            for (const edge of edges) {
                if (changedFiles.includes(edge.target) && directDependents.includes(edge.source)) {
                    const fromId = edge.target.replace(/[^a-zA-Z0-9_]/g, '_');
                    const toId = edge.source.replace(/[^a-zA-Z0-9_]/g, '_');
                    lines.push(`  ${fromId} --> ${toId}`);
                }
            }
        }
        lines.push('  classDef changed fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;');
        lines.push('  classDef affected fill:#1e1b4b,stroke:#a855f7,stroke-width:1.5px,color:#e2e8f0;');
        lines.push('```');
        return lines.join('\n');
    }
    static buildCommentBody(repo, changedFiles, directDependents, transitiveDownstream, mermaid) {
        return `${this.STICKY_TAG}
## 🔬 GitXray Blast Radius Map

**Changed Files in PR**: ${changedFiles.length}
**Direct Affected Modules**: ${directDependents.length}
**Total Downstream Impact**: ${transitiveDownstream.length} files

${mermaid}

${transitiveDownstream.length > 0
            ? `> [!IMPORTANT]\n> Changes to \`${changedFiles[0] || 'core files'}\` cascade to **${transitiveDownstream.length}** downstream files. Verify tests pass for affected dependents.`
            : '> [!NOTE]\n> Changes are isolated with 0 downstream dependents.'}

---
*Explore the full dependency graph interactively on [GitXray](https://gitxray.dev/${repo})*
`;
    }
    static async execute(config, changedFiles, edges) {
        if (!config.enabled) {
            return {
                changedFiles,
                directDependents: [],
                transitiveDownstream: [],
                mermaidDiagram: '',
                commentBody: 'GitXray action is disabled by input configuration.'
            };
        }
        const { direct, transitive } = BlastRadiusCalculator.getDownstreamForFiles(changedFiles, edges);
        const mermaid = this.generateMermaid(changedFiles, direct, edges, config.maxDownstream);
        const commentBody = this.buildCommentBody(config.repo, changedFiles, direct, transitive, mermaid);
        // If running in live CI environment with token
        if (config.githubToken && config.prNumber) {
            await this.postOrUpdateComment(config, commentBody);
        }
        return {
            changedFiles,
            directDependents: direct,
            transitiveDownstream: transitive,
            mermaidDiagram: mermaid,
            commentBody
        };
    }
    static async postOrUpdateComment(config, body) {
        const headers = {
            Authorization: `Bearer ${config.githubToken}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'GitXray-Action'
        };
        const commentsUrl = `https://api.github.com/repos/${config.repo}/issues/${config.prNumber}/comments`;
        // 1. Search for existing sticky comment
        const listRes = await fetch(commentsUrl, { headers });
        if (!listRes.ok)
            return;
        const comments = await listRes.json();
        const existing = comments.find((c) => c.body && c.body.includes(this.STICKY_TAG));
        if (existing) {
            // Update existing comment
            await fetch(existing.url, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ body })
            });
        }
        else {
            // Post new comment
            await fetch(commentsUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({ body })
            });
        }
    }
}
//# sourceMappingURL=action.js.map