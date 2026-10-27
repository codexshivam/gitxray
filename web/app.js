import { ARCHITECTURE_VAULT } from '../core/vault_data.js';
import { DependencyGraph } from '../core/graph.js';
import { ExecutionTracer } from '../core/tracer.js';
import { UnboxCompiler } from '../core/unbox.js';
import { BlastRadiusAnalyzer } from '../core/blast_radius.js';
import { AgentExporter } from '../core/exporter.js';
import { BadgeGenerator } from '../core/badge.js';

let currentRepo = 'openclaw/openclaw';
let activeGraph = null;
let activeAnalysis = null;
let activeUnboxCourse = null;
let activeStage = 0;
let tracer = new ExecutionTracer();
let currentTraceStep = 0;
let tracePlayInterval = null;

// Mock execution traces for rich simulation
const SAMPLE_TRACES = [
  {
    file: 'src/agent/loop.ts',
    line: 14,
    fn: 'runAgentLoop',
    type: 'call',
    payload: { prompt: 'Audit repository security', maxSteps: 5 },
    stateChanges: { loopActive: true, stepIndex: 0, status: 'INITIALIZING' },
    dbMutations: [{ table: 'sessions', op: 'insert', row: { id: 1, prompt: 'Audit repository security' } }]
  },
  {
    file: 'src/parser/ast.ts',
    line: 42,
    fn: 'buildTree',
    type: 'call',
    payload: { language: 'typescript', tokens: 1420 },
    stateChanges: { astNodes: 1420, parsed: true },
    dbMutations: []
  },
  {
    file: 'src/graph/centrality.ts',
    line: 88,
    fn: 'computePageRank',
    type: 'call',
    payload: { damping: 0.85, iterations: 12 },
    stateChanges: { gravityWellFound: 'src/agent/loop.ts', topScore: 0.28 },
    dbMutations: [{ table: 'metrics', op: 'insert', row: { id: 101, metric: 'PageRank', value: 0.28 } }]
  },
  {
    file: 'src/engine/dispatch.ts',
    line: 27,
    fn: 'dispatchAction',
    type: 'call',
    payload: { action: 'INSPECT_AST', target: 'core/engine.js' },
    stateChanges: { stepIndex: 1, activeAction: 'INSPECT_AST' },
    dbMutations: []
  },
  {
    file: 'src/agent/loop.ts',
    line: 65,
    fn: 'runAgentLoop',
    type: 'return',
    payload: { status: 'COMPLETED_STAGE_1' },
    stateChanges: { status: 'VERIFIED', loopActive: false },
    dbMutations: [{ table: 'sessions', op: 'update', row: { id: 1, status: 'VERIFIED' } }]
  }
];

function initTracer() {
  tracer.reset();
  for (const step of SAMPLE_TRACES) {
    tracer.recordStep(step);
  }
}

function buildGraphForRepo(repoName) {
  const vaultItem = ARCHITECTURE_VAULT.find(v => v.repo === repoName) || {
    repo: repoName,
    name: repoName.split('/')[1] || repoName,
    language: 'TypeScript',
    gravityWell: 'src/index.ts',
    stage0Summary: 'Foundational runtime loop',
    coreSnippet: 'export function init() { return true; }'
  };

  const graph = new DependencyGraph();
  const baseFiles = [
    vaultItem.gravityWell,
    'src/state.ts',
    'src/dispatcher.ts',
    'src/parser.ts',
    'src/utils.ts',
    'src/config.ts',
    'src/types.ts',
    'src/logger.ts',
    'src/storage.ts',
    'src/router.ts'
  ];

  baseFiles.forEach(file => {
    graph.addNode(file, {
      language: vaultItem.language,
      lines: Math.floor(Math.random() * 250) + 40
    });
  });

  graph.addEdge('src/dispatcher.ts', vaultItem.gravityWell);
  graph.addEdge('src/parser.ts', vaultItem.gravityWell);
  graph.addEdge('src/state.ts', vaultItem.gravityWell);
  graph.addEdge('src/router.ts', 'src/dispatcher.ts');
  graph.addEdge('src/storage.ts', 'src/state.ts');
  graph.addEdge(vaultItem.gravityWell, 'src/utils.ts');
  graph.addEdge(vaultItem.gravityWell, 'src/config.ts');
  graph.addEdge(vaultItem.gravityWell, 'src/types.ts');
  graph.addEdge('src/storage.ts', 'src/utils.ts');

  const filesMap = new Map();
  filesMap.set(vaultItem.gravityWell, vaultItem.coreSnippet);

  const analysis = graph.analyze();
  const unboxCompiler = new UnboxCompiler(analysis, filesMap);
  const blastAnalyzer = new BlastRadiusAnalyzer(graph);

  return {
    graph,
    analysis,
    unboxCompiler,
    blastAnalyzer,
    vaultItem
  };
}

// Canvas Force-Directed Rendering
let canvas, ctx;
let nodesArray = [];
let edgesArray = [];
let animId = null;

function setupCanvas() {
  canvas = document.getElementById('graphCanvas');
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  setupCanvasInteractions();
}

let panX = 0, panY = 0, zoom = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;

function setupCanvasInteractions() {
  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX - panX;
    dragStartY = e.clientY - panY;
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panX = e.clientX - dragStartX;
    panY = e.clientY - dragStartY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    zoom = Math.max(0.4, Math.min(3, zoom * factor));
  });
}

function updateGraphVisualization(analysis) {
  const { allNodes, gravityWells } = analysis;
  const gravitySet = new Set(gravityWells.map(g => g.id));

  const width = canvas.width || 800;
  const height = canvas.height || 600;

  nodesArray = allNodes.map((n, i) => {
    const angle = (i / allNodes.length) * Math.PI * 2;
    const radius = 180 + (i % 2) * 50;
    const isGravity = gravitySet.has(n.id);
    return {
      id: n.id,
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      radius: isGravity ? 24 : 14 + (n.metrics.pageRank * 80),
      isGravity,
      score: n.metrics.gravityScore,
      pr: n.metrics.pageRank
    };
  });

  edgesArray = [];
  for (const [fromId, neighbors] of activeGraph.edges.entries()) {
    for (const toId of neighbors) {
      edgesArray.push({ from: fromId, to: toId });
    }
  }

  if (animId) cancelAnimationFrame(animId);
  runSimulation();
}

function runSimulation() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);

  // Draw Edges
  ctx.lineWidth = 1.5;
  for (const edge of edgesArray) {
    const source = nodesArray.find(n => n.id === edge.from);
    const target = nodesArray.find(n => n.id === edge.to);
    if (!source || !target) continue;

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.stroke();

    // Edge arrow
    const angle = Math.atan2(target.y - source.y, target.x - source.x);
    const arrowDist = target.radius + 6;
    const ax = target.x - Math.cos(angle) * arrowDist;
    const ay = target.y - Math.sin(angle) * arrowDist;

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(ax, ay, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Nodes
  for (const node of nodesArray) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

    if (node.isGravity) {
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 18;
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.shadowBlur = 0;
    }
    ctx.fill();

    ctx.lineWidth = node.isGravity ? 3 : 1.5;
    ctx.strokeStyle = node.isGravity ? '#38bdf8' : '#475569';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Node label
    ctx.font = '10px monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    const label = node.id.split('/').pop();
    ctx.fillText(label, node.x, node.y + node.radius + 14);
  }

  ctx.restore();
  animId = requestAnimationFrame(runSimulation);
}

function renderGravityDrawer(gravityWells) {
  const container = document.getElementById('gravityWellsList');
  container.innerHTML = '';

  gravityWells.forEach((gw, idx) => {
    const card = document.createElement('div');
    card.className = 'gravity-card';
    card.innerHTML = `
      <div class="gravity-card-title">#${idx + 1} ${gw.id}</div>
      <div class="gravity-card-metrics">
        <div>PageRank: <span class="metric-pill">${(gw.metrics.pageRank * 100).toFixed(1)}%</span></div>
        <div>Gravity: <span class="metric-pill">${(gw.metrics.gravityScore * 100).toFixed(1)}%</span></div>
      </div>
    `;
    card.addEventListener('click', () => {
      switchToTracerWithFile(gw.id);
    });
    container.appendChild(card);
  });
}

function renderTracerStep(index) {
  const frame = tracer.scrub(index);
  if (!frame) return;

  currentTraceStep = index;
  document.getElementById('traceSlider').value = index;
  document.getElementById('traceStepCounter').innerText = `Step ${index + 1} / ${tracer.frames.length}`;
  document.getElementById('tracerActiveFileLabel').innerText = `${frame.file}:${frame.line} [${frame.fn}()]`;

  // Code Block
  const codePre = document.getElementById('tracerCodeBlock');
  codePre.innerHTML = `// Execution Frame #${frame.stepIndex} [Type: ${frame.type.toUpperCase()}]\n` +
    `// File: ${frame.file} (Line ${frame.line})\n` +
    `function ${frame.fn}() {\n` +
    `  // Payload: ${JSON.stringify(frame.payload, null, 2)}\n` +
    `}`;

  // Stack
  const stackContainer = document.getElementById('tracerStackContainer');
  stackContainer.innerHTML = '';
  frame.stack.forEach(s => {
    const div = document.createElement('div');
    div.className = 'stack-frame';
    div.innerText = `${s.fn} (${s.file}:${s.line})`;
    stackContainer.appendChild(div);
  });

  // Variables
  const varsContainer = document.getElementById('tracerVariablesContainer');
  varsContainer.innerHTML = '';
  for (const [k, v] of Object.entries(frame.variables)) {
    const row = document.createElement('div');
    row.className = 'variable-row';
    row.innerHTML = `<span class="var-name">${k}</span><span class="var-value">${JSON.stringify(v)}</span>`;
    varsContainer.appendChild(row);
  }

  // Storage
  const storageContainer = document.getElementById('tracerStorageContainer');
  const dbs = Object.entries(frame.dbSnapshot);
  if (dbs.length === 0) {
    storageContainer.innerText = '[No pending dirty mutations]';
  } else {
    storageContainer.innerHTML = dbs.map(([tbl, rows]) =>
      `<strong>TABLE ${tbl} (${rows.length} rows):</strong>\n${JSON.stringify(rows, null, 2)}`
    ).join('\n\n');
  }
}

function switchToTracerWithFile(fileId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.view-container').forEach(c => c.classList.remove('active'));

  const tab = document.querySelector('[data-tab="tab-tracer"]');
  const view = document.getElementById('tab-tracer');
  tab.classList.add('active');
  view.classList.add('active');

  renderTracerStep(0);
}

function renderUnboxMilestones(course) {
  const sidebar = document.getElementById('stagesSidebar');
  sidebar.innerHTML = '';

  course.milestones.forEach((m, idx) => {
    const tab = document.createElement('div');
    tab.className = `stage-tab ${idx === activeStage ? 'active' : ''}`;
    tab.innerHTML = `
      <div class="stage-badge">Stage ${m.stage}</div>
      <div class="stage-tab-title">${m.name}</div>
    `;
    tab.addEventListener('click', () => {
      activeStage = idx;
      renderUnboxMilestones(course);
      loadStagePlayground(m);
    });
    sidebar.appendChild(tab);
  });

  loadStagePlayground(course.milestones[activeStage]);
}

function loadStagePlayground(milestone) {
  document.getElementById('playgroundStageTitle').innerText = `Stage ${milestone.stage}: ${milestone.name}`;
  document.getElementById('playgroundStageObjective').innerText = milestone.objective;
  const editor = document.getElementById('codeEditor');
  editor.value = milestone.codeTemplate || milestone.solution || '// Write your stage implementation here';

  const terminal = document.getElementById('verificationTerminal');
  terminal.innerHTML = `<span style="color: var(--text-muted);">&gt; Ready to verify Stage ${milestone.stage}. Target: ${milestone.targetFile}</span>`;
}

function verifyCurrentStage() {
  const compiler = activeUnboxCourse.unboxCompiler;
  const candidateCode = document.getElementById('codeEditor').value;
  const res = compiler.verifyStage(activeStage, candidateCode);

  const terminal = document.getElementById('verificationTerminal');
  if (res.passed) {
    terminal.innerHTML = `
      <div style="color: var(--accent-emerald); font-weight: 700;">✔ HARD TEST HARNESS PASSED (Exit Code: ${res.exitCode})</div>
      <div style="color: var(--text-primary); margin-top: 4px;">${res.stdout}</div>
      <div style="color: var(--text-muted); margin-top: 4px;">AST invariants verified deterministically. Stage complete!</div>
    `;
  } else {
    terminal.innerHTML = `
      <div style="color: var(--accent-rose); font-weight: 700;">✖ VERIFICATION REJECTED (Exit Code: ${res.exitCode})</div>
      <div style="color: var(--text-primary); margin-top: 4px;">${res.stderr}</div>
    `;
  }
}

function renderBlastRadius(blastAnalyzer) {
  const gravityWell = activeAnalysis.gravityWells[0]?.id || 'src/agent/loop.ts';
  const result = blastAnalyzer.calculateBlastRadius([gravityWell]);

  document.getElementById('blastSeverity').innerText = result.severity;
  document.getElementById('blastSeverity').style.color =
    result.severity === 'CRITICAL' ? 'var(--accent-rose)' :
    result.severity === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-emerald)';

  document.getElementById('blastPercent').innerText = `${result.impactPercentage}%`;
  document.getElementById('blastDownstreamCount').innerText = result.affectedCount;
  document.getElementById('blastEntrypoint').innerText = gravityWell;

  const treeContainer = document.getElementById('blastTreeContainer');
  if (result.affectedNodes.length === 0) {
    treeContainer.innerHTML = '<div>Isolated leaf node; zero downstream blast radius.</div>';
  } else {
    treeContainer.innerHTML = result.affectedNodes.map(n =>
      `<div>↳ <span style="color: var(--accent-cyan);">[Depth +${n.depth}]</span> <strong>${n.id}</strong> (${n.language})</div>`
    ).join('');
  }
}

function renderVaultGrid(filter = 'all') {
  const grid = document.getElementById('vaultGrid');
  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? ARCHITECTURE_VAULT
    : ARCHITECTURE_VAULT.filter(item => item.category === filter);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'vault-card';
    card.innerHTML = `
      <div>
        <div class="vault-card-head">
          <div>
            <div class="vault-card-title">${item.name}</div>
            <div class="vault-card-repo">${item.repo}</div>
          </div>
          <div class="vault-card-stars">★ ${item.stars}</div>
        </div>
        <div class="vault-card-desc">${item.stage0Summary}</div>
      </div>
      <div class="vault-card-foot">
        <span class="vault-card-lang">${item.language}</span>
        <span style="color: var(--accent-cyan); font-weight: 600;">⚡ Decompile Course →</span>
      </div>
    `;
    card.addEventListener('click', () => {
      document.getElementById('repoInput').value = item.repo;
      loadRepository(item.repo);
      document.querySelector('[data-tab="tab-graph"]').click();
    });
    grid.appendChild(card);
  });
}

function loadRepository(repoName) {
  currentRepo = repoName;
  document.getElementById('statsRepoName').innerText = repoName;

  const bundle = buildGraphForRepo(repoName);
  activeGraph = bundle.graph;
  activeAnalysis = bundle.analysis;
  activeUnboxCourse = bundle;

  document.getElementById('statsNodesCount').innerText = activeAnalysis.totalNodes;
  document.getElementById('statsEdgesCount').innerText = activeAnalysis.totalEdges;

  updateGraphVisualization(activeAnalysis);
  renderGravityDrawer(activeAnalysis.gravityWells);
  renderUnboxMilestones(bundle.unboxCompiler.compileCourse());
  renderBlastRadius(bundle.blastAnalyzer);

  initTracer();
  renderTracerStep(0);
}

// Event Listeners
function setupEvents() {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view-container').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');

      if (tabId === 'tab-graph') {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    });
  });

  // Repo search
  document.getElementById('btnRunXray').addEventListener('click', () => {
    const val = document.getElementById('repoInput').value.trim();
    if (val) loadRepository(val);
  });

  document.getElementById('repoInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = document.getElementById('repoInput').value.trim();
      if (val) loadRepository(val);
    }
  });

  document.getElementById('brandReset').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('repoInput').value = 'openclaw/openclaw';
    loadRepository('openclaw/openclaw');
  });

  // Tracer Scrubber
  document.getElementById('traceSlider').addEventListener('input', e => {
    renderTracerStep(parseInt(e.target.value, 10));
  });

  document.getElementById('btnTracePrev').addEventListener('click', () => {
    if (currentTraceStep > 0) renderTracerStep(currentTraceStep - 1);
  });

  document.getElementById('btnTraceNext').addEventListener('click', () => {
    if (currentTraceStep < tracer.frames.length - 1) renderTracerStep(currentTraceStep + 1);
  });

  document.getElementById('btnTracePlay').addEventListener('click', () => {
    const btn = document.getElementById('btnTracePlay');
    if (tracePlayInterval) {
      clearInterval(tracePlayInterval);
      tracePlayInterval = null;
      btn.innerText = '▶';
    } else {
      btn.innerText = '⏸';
      tracePlayInterval = setInterval(() => {
        if (currentTraceStep < tracer.frames.length - 1) {
          renderTracerStep(currentTraceStep + 1);
        } else {
          renderTracerStep(0);
        }
      }, 1200);
    }
  });

  // Unbox verification
  document.getElementById('btnVerifyCode').addEventListener('click', verifyCurrentStage);

  // Vault filters
  document.querySelectorAll('.vault-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vault-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVaultGrid(btn.getAttribute('data-filter'));
    });
  });

  // Badge Modal
  const badgeModal = document.getElementById('badgeModal');
  document.getElementById('btnOpenBadgeModal').addEventListener('click', () => {
    const md = BadgeGenerator.getBadgeMarkdown(currentRepo);
    const svg = BadgeGenerator.generateBadgeSvg({ repo: currentRepo });
    document.getElementById('badgePreviewContainer').innerHTML = svg;
    document.getElementById('badgeMarkdownCode').innerText = md;
    badgeModal.classList.add('active');
  });

  document.getElementById('btnCloseBadgeModal').addEventListener('click', () => {
    badgeModal.classList.remove('active');
  });

  document.getElementById('btnCopyBadge').addEventListener('click', () => {
    const md = document.getElementById('badgeMarkdownCode').innerText;
    navigator.clipboard.writeText(md).then(() => {
      document.getElementById('btnCopyBadge').innerText = 'Copied to Clipboard!';
      setTimeout(() => {
        document.getElementById('btnCopyBadge').innerText = 'Copy Markdown Snippet';
      }, 2000);
    });
  });

  // Agents Modal
  const agentsModal = document.getElementById('agentsModal');
  document.getElementById('btnOpenAgentsModal').addEventListener('click', () => {
    const exporter = new AgentExporter(activeAnalysis, currentRepo);
    const claudeContent = exporter.generateClaudeMd();
    document.getElementById('agentsPreOutput').innerText = claudeContent;
    agentsModal.classList.add('active');
  });

  document.getElementById('btnCloseAgentsModal').addEventListener('click', () => {
    agentsModal.classList.remove('active');
  });

  document.getElementById('btnCopyAgents').addEventListener('click', () => {
    const content = document.getElementById('agentsPreOutput').innerText;
    navigator.clipboard.writeText(content).then(() => {
      document.getElementById('btnCopyAgents').innerText = 'Copied to Clipboard!';
      setTimeout(() => {
        document.getElementById('btnCopyAgents').innerText = 'Copy CLAUDE.md';
      }, 2000);
    });
  });
}

// Dynamic Host Setup
function setupDynamicHost() {
  const host = window.location.host || 'gitxray.shivm.co';
  const brandTag = document.getElementById('brandTagline');
  const prefixTag = document.getElementById('repoPrefix');
  if (brandTag) brandTag.innerText = host;
  if (prefixTag) prefixTag.innerText = `${host}/`;
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  setupDynamicHost();
  setupCanvas();
  setupEvents();
  renderVaultGrid('all');
  loadRepository('openclaw/openclaw');
});
