import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { LocalScanner } from './scanner.js';

describe('Phase 7: GitXray CLI Scanner & Engine', () => {
  it('scans local filesystem directory and filters non-source/ignored files', () => {
    // Scan packages/cli/src directory
    const cliSrc = path.resolve(__dirname, '../src');
    const files = LocalScanner.scanDirectory(cliSrc);

    expect(files.length).toBeGreaterThan(0);
    const filenames = files.map((f) => f.relativePath);
    expect(filenames).toContain('index.ts');
    expect(filenames).toContain('scanner.ts');
  });

  it('runs complete local AST analysis, builds dependency graph, and ranks nodes', async () => {
    const cliSrc = path.resolve(__dirname, '../src');
    const { graph, ranking, fileCount } = await LocalScanner.analyzeLocal(cliSrc);

    expect(fileCount).toBeGreaterThan(0);
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(ranking.rankedFiles.length).toBeGreaterThan(0);
  });
});
