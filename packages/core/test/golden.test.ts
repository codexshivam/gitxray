import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CodebaseParser } from '../src/parsing/parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../../../docs/fixtures');

function loadFixtureFiles(dirPath: string): Map<string, string> {
  const map = new Map<string, string>();
  function walk(current: string) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const rel = path.relative(dirPath, full).replace(/\\/g, '/');
        map.set(rel, fs.readFileSync(full, 'utf-8'));
      }
    }
  }
  walk(dirPath);
  return map;
}

describe('Golden Graph Output Validation', () => {
  const parser = new CodebaseParser();

  it('generates stable golden graph for python-mini fixture', () => {
    const files = loadFixtureFiles(path.join(FIXTURES_DIR, 'python-mini'));
    const graph = parser.buildGraph(files);

    expect(graph.nodes.map(n => n.id)).toEqual(['app.py', 'config.py', 'services.py']);
    expect(graph.edges).toEqual([
      { source: 'app.py', target: 'config.py' },
      { source: 'app.py', target: 'services.py' },
      { source: 'services.py', target: 'config.py' }
    ]);
  });

  it('generates stable golden graph for ts-mini fixture', () => {
    const files = loadFixtureFiles(path.join(FIXTURES_DIR, 'ts-mini'));
    const graph = parser.buildGraph(files);

    expect(graph.nodes.map(n => n.id)).toEqual([
      'src/engine.ts',
      'src/index.ts',
      'src/utils.ts'
    ]);
    expect(graph.edges).toEqual([
      { source: 'src/engine.ts', target: 'src/utils.ts' },
      { source: 'src/index.ts', target: 'src/engine.ts' }
    ]);
  });

  it('generates stable golden graph for js-mini fixture', () => {
    const files = loadFixtureFiles(path.join(FIXTURES_DIR, 'js-mini'));
    const graph = parser.buildGraph(files);

    expect(graph.nodes.map(n => n.id)).toEqual([
      'controller.js',
      'index.js',
      'router.js'
    ]);
    expect(graph.edges).toEqual([
      { source: 'index.js', target: 'router.js' },
      { source: 'router.js', target: 'controller.js' }
    ]);
  });
});
