import { describe, it, expect } from 'vitest';
import { BlastRadiusAction } from './action.js';
describe('Phase 7: GitHub Action PR Blast Radius Shield', () => {
    const edges = [
        { source: 'packages/web/src/App.tsx', target: 'packages/core/src/index.ts', weight: 1 },
        { source: 'packages/cli/src/index.ts', target: 'packages/core/src/index.ts', weight: 1 },
        { source: 'packages/core/src/index.ts', target: 'packages/core/src/graph/graph.ts', weight: 1 }
    ];
    it('generates Mermaid blast radius diagram and sticky comment markdown', async () => {
        const config = {
            githubToken: '',
            repo: 'codexshivam/gitxray',
            prNumber: 42,
            enabled: true
        };
        const changedFiles = ['packages/core/src/index.ts'];
        const result = await BlastRadiusAction.execute(config, changedFiles, edges);
        expect(result.changedFiles).toEqual(changedFiles);
        expect(result.directDependents).toContain('packages/web/src/App.tsx');
        expect(result.directDependents).toContain('packages/cli/src/index.ts');
        expect(result.mermaidDiagram).toContain('graph LR');
        expect(result.mermaidDiagram).toContain('Affected Downstream');
        expect(result.commentBody).toContain('<!-- gitxray-blast-radius -->');
        expect(result.commentBody).toContain('Total Downstream Impact');
    });
    it('respects enabled: false opt-out flag', async () => {
        const config = {
            githubToken: '',
            repo: 'codexshivam/gitxray',
            prNumber: 42,
            enabled: false
        };
        const result = await BlastRadiusAction.execute(config, ['src/index.ts'], edges);
        expect(result.commentBody).toContain('disabled by input');
        expect(result.mermaidDiagram).toBe('');
    });
});
//# sourceMappingURL=action.test.js.map