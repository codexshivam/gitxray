import { describe, it, expect } from 'vitest';
import { parseRepoInput } from './utils/url';
import { SAMPLE_REPOSITORIES } from './utils/samples';
import {
  CodebaseParser,
  CodeGraph,
  RankingEngine
} from '@gitxray/core';

describe('Web App Shell & Routing', () => {
  it('parses various repository URL formats', () => {
    expect(parseRepoInput('pallets/flask')).toEqual({
      owner: 'pallets',
      repo: 'flask',
      ref: undefined
    });
    expect(parseRepoInput('https://github.com/expressjs/express/tree/develop')).toEqual({
      owner: 'expressjs',
      repo: 'express',
      ref: 'develop'
    });
    expect(parseRepoInput('gitxray.dev/openai/whisper')).toEqual({
      owner: 'openai',
      repo: 'whisper',
      ref: undefined
    });
  });

  it('contains valid pre-loaded sample repositories', () => {
    const keys = Object.keys(SAMPLE_REPOSITORIES);
    expect(keys).toContain('pallets/flask');
    expect(keys).toContain('expressjs/express');
    expect(keys).toContain('openai/whisper');
    expect(keys).toContain('codexshivam/nidaniq');

    keys.forEach((key) => {
      const sample = SAMPLE_REPOSITORIES[key];
      expect(sample.owner).toBeTruthy();
      expect(sample.repo).toBeTruthy();
      expect(Object.keys(sample.files).length).toBeGreaterThan(0);
    });
  });

  it('executes full parser, graph, and ranking pipeline on sample repo', () => {
    const sample = SAMPLE_REPOSITORIES['pallets/flask'];
    const parser = new CodebaseParser();
    const parsedMap = new Map();

    for (const [filePath, content] of Object.entries(sample.files)) {
      const parsed = parser.parseFile(filePath, content);
      if (parsed) {
        parsedMap.set(filePath, parsed);
      }
    }
    expect(parsedMap.size).toBeGreaterThan(0);

    const graph = CodeGraph.fromParsedFiles(parsedMap);
    const fileGraphOutput = graph.toFileGraphOutput();
    expect(fileGraphOutput.nodes.length).toBeGreaterThan(0);
    expect(fileGraphOutput.edges.length).toBeGreaterThan(0);

    const ranking = RankingEngine.rank(graph);
    expect(ranking.rankedFiles.length).toBeGreaterThan(0);

    // Verify non-boilerplate core files outrank boilerplate tests/config
    const topRanked = ranking.rankedFiles.slice(0, 3).map((r) => r.id);
    const hasCore = topRanked.some((p) => p.includes('app.py') || p.includes('routes.py') || p.includes('models.py'));
    expect(hasCore).toBe(true);

    // Verify test file is deprioritized
    const testRank = ranking.rankedFiles.find((r) => r.id.includes('test_app.py'));
    expect(testRank?.isBoilerplate).toBe(true);
  });
});
