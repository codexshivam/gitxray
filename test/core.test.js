import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CodeParser,
  DependencyGraph,
  ExecutionTracer,
  UnboxCompiler,
  BlastRadiusAnalyzer,
  AgentExporter,
  BadgeGenerator,
  GitXrayEngine,
  ARCHITECTURE_VAULT
} from '../core/index.js';

test('CodeParser correctly detects languages and extracts symbols & calls', () => {
  const parser = new CodeParser();

  const jsCode = `
    import { foo } from './foo.js';
    function calculateTotal(items) {
      return foo(items);
    }
    class Engine {}
  `;
  const jsParsed = parser.parseFile('app.js', jsCode);
  assert.equal(jsParsed.language, 'javascript');
  assert.equal(jsParsed.imports.length, 1);
  assert.equal(jsParsed.symbols.length, 2);
  assert.ok(jsParsed.calls.includes('foo'));

  const pyCode = `
from math import sqrt
def solve(n):
    return sqrt(n)
  `;
  const pyParsed = parser.parseFile('solve.py', pyCode);
  assert.equal(pyParsed.language, 'python');
  assert.equal(pyParsed.imports.length, 1);
  assert.equal(pyParsed.symbols.length, 1);
  assert.ok(pyParsed.calls.includes('sqrt'));
});

test('DependencyGraph computes PageRank and centrality metrics accurately', () => {
  const graph = new DependencyGraph();

  // A -> B -> C, D -> B
  graph.addEdge('A', 'B');
  graph.addEdge('B', 'C');
  graph.addEdge('D', 'B');

  const pageRank = graph.computePageRank();
  assert.ok(pageRank.get('B') > pageRank.get('A'));

  const betweenness = graph.computeBetweennessCentrality();
  assert.ok(betweenness.get('B') >= 0);

  const closeness = graph.computeClosenessCentrality();
  assert.ok(closeness.get('B') >= 0);

  const analysis = graph.analyze();
  assert.equal(analysis.totalNodes, 4);
  assert.ok(analysis.gravityWells.length > 0);
  assert.equal(analysis.gravityWells[0].id, 'B');
});

test('ExecutionTracer tracks steps, stack frames, and variable diffs', () => {
  const tracer = new ExecutionTracer();

  tracer.recordStep({
    file: 'main.js',
    line: 10,
    fn: 'start',
    type: 'call',
    payload: { seed: 42 },
    stateChanges: { count: 1 }
  });

  tracer.recordStep({
    file: 'sub.js',
    line: 25,
    fn: 'calculate',
    type: 'call',
    payload: {},
    stateChanges: { count: 2, result: 100 }
  });

  const timeline = tracer.getTimeline();
  assert.equal(timeline.totalSteps, 2);

  const frame0 = tracer.scrub(0);
  assert.equal(frame0.stack.length, 1);
  assert.equal(frame0.variables.count, 1);

  const frame1 = tracer.scrub(1);
  assert.equal(frame1.stack.length, 2);
  assert.equal(frame1.variables.count, 2);
  assert.equal(frame1.variableDiff.updated.count.to, 2);
});

test('UnboxCompiler generates progressive milestones and verifies code deterministically', () => {
  const graph = new DependencyGraph();
  graph.addNode('core/loop.js');
  const analysis = graph.analyze();

  const filesMap = new Map();
  filesMap.set('core/loop.js', 'export function run() { return true; }');

  const compiler = new UnboxCompiler(analysis, filesMap);
  const course = compiler.compileCourse();

  assert.equal(course.totalStages, 6);
  assert.equal(course.milestones[0].stage, 0);

  const passVerification = compiler.verifyStage(0, 'export function run() { return true; }');
  assert.equal(passVerification.passed, true);
  assert.equal(passVerification.exitCode, 0);

  const failVerification = compiler.verifyStage(0, '');
  assert.equal(failVerification.passed, false);
  assert.notEqual(failVerification.exitCode, 0);
});

test('BlastRadiusAnalyzer computes downstream impact tree', () => {
  const graph = new DependencyGraph();
  // Service calls DB and Auth
  graph.addEdge('api/service.js', 'db/client.js');
  graph.addEdge('api/service.js', 'auth/jwt.js');
  graph.addEdge('routes/users.js', 'api/service.js');

  const analyzer = new BlastRadiusAnalyzer(graph);
  const result = analyzer.calculateBlastRadius(['db/client.js']);

  assert.equal(result.changedFiles.length, 1);
  assert.ok(result.affectedCount >= 2); // api/service.js and routes/users.js
  assert.ok(result.impactPercentage > 0);

  const report = analyzer.formatMarkdownReport(result, 'test/repo');
  assert.ok(report.includes('Blast-Radius Audit'));
});

test('AgentExporter generates CLAUDE.md and skills.md', () => {
  const graph = new DependencyGraph();
  graph.addEdge('index.js', 'core.js');
  const analysis = graph.analyze();

  const exporter = new AgentExporter(analysis, 'my-repo');
  const claudeMd = exporter.generateClaudeMd();
  const skillsMd = exporter.generateSkillsMd();

  assert.ok(claudeMd.includes('Architectural Ontology & Invariants'));
  assert.ok(skillsMd.includes('name: my-repo-architecture'));
});

test('BadgeGenerator creates valid SVG badge', () => {
  const svg = BadgeGenerator.generateBadgeSvg({ repo: 'gitxray/gitxray' });
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('GitXray'));

  const md = BadgeGenerator.getBadgeMarkdown('gitxray/gitxray');
  assert.ok(md.includes('https://gitxray.dev/gitxray/gitxray'));
});

test('Architecture Vault contains 50 legendary pre-decompiled repositories', () => {
  assert.equal(ARCHITECTURE_VAULT.length, 50);
  const openclaw = ARCHITECTURE_VAULT.find(v => v.repo === 'openclaw/openclaw');
  assert.ok(openclaw);
  assert.equal(openclaw.name, 'OpenClaw');
});
