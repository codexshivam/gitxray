import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CodebaseParser } from '../src/parsing/parser.js';
import { CodeGraph } from '../src/graph/graph.js';
import { RankingEngine } from '../src/graph/ranking.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../../../docs/fixtures');

function loadParsedRepo(repoSubdir: string) {
  const dirPath = path.join(FIXTURES_DIR, repoSubdir);
  const parser = new CodebaseParser();
  const parsedMap = new Map();

  function walk(current: string) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const rel = path.relative(dirPath, full).replace(/\\/g, '/');
        const content = fs.readFileSync(full, 'utf-8');
        const parsed = parser.parseFile(rel, content);
        if (parsed) {
          parsedMap.set(rel, parsed);
        }
      }
    }
  }

  walk(dirPath);
  const graph = CodeGraph.fromParsedFiles(parsedMap);
  return { graph, ranking: RankingEngine.rank(graph) };
}

describe('Ranking Validation Against 3 Benchmark Repositories', () => {
  it('identifies core files for flask-app fixture matching human expectation', () => {
    const { ranking } = loadParsedRepo('flask-app');
    const topIds = ranking.gravityWells.map(g => g.id);

    // Human expectation: routes.py / app.py are core, tests/test_app.py is boilerplate
    expect(topIds.some(id => id === 'routes.py' || id === 'app.py' || id === 'models.py')).toBe(true);
    const testFile = ranking.rankedFiles.find(f => f.id === 'tests/test_app.py');
    expect(testFile?.isBoilerplate).toBe(true);
    expect(ranking.rankedFiles[0].id).not.toBe('tests/test_app.py');
  });

  it('identifies core files for express-app fixture matching human expectation', () => {
    const { ranking } = loadParsedRepo('express-app');
    const topIds = ranking.gravityWells.map(g => g.id);

    // Human expectation: server.js / routes.js / controllers.js are core
    expect(topIds.some(id => id === 'server.js' || id === 'routes.js' || id === 'controllers.js')).toBe(true);
    const testFile = ranking.rankedFiles.find(f => f.id === 'tests/server.test.js');
    expect(testFile?.isBoilerplate).toBe(true);
  });

  it('identifies core files for cli-tool fixture matching human expectation', () => {
    const { ranking } = loadParsedRepo('cli-tool');
    const topIds = ranking.gravityWells.map(g => g.id);

    // Human expectation: src/runner.ts or src/bin.ts is core
    expect(topIds.some(id => id === 'src/runner.ts' || id === 'src/bin.ts')).toBe(true);
    const testFile = ranking.rankedFiles.find(f => f.id === 'tests/cli.test.ts');
    expect(testFile?.isBoilerplate).toBe(true);
  });
});
