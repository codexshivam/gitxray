#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { GitXrayEngine, BadgeGenerator, ARCHITECTURE_VAULT } from '../core/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const command = args[0] || 'inspect';

const BANNER = `
\x1b[36m   ██████╗ ██╗████████╗██╗  ██╗██████╗  █████╗ ██╗   ██╗\x1b[0m
\x1b[36m  ██╔════╝ ██║╚══██╔══╝╚██╗██╔╝██╔══██╗██╔══██╗╚██╗ ██╔╝\x1b[0m
\x1b[32m  ██║  ███╗██║   ██║    ╚███╔╝ ██████╔╝███████║ ╚████╔╝ \x1b[0m
\x1b[32m  ██║   ██║██║   ██║    ██╔██╗ ██╔══██╗██╔══██║  ╚██╔╝  \x1b[0m
\x1b[34m  ╚██████╔╝██║   ██║   ██╔╝ ██╗██║  ██║██║  ██║   ██║   \x1b[0m
\x1b[34m   ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   \x1b[0m
  \x1b[90mThe Zero-Install Live Codebase Decompiler & Engine\x1b[0m
`;

switch (command) {
  case 'inspect':
    runInspect(args[1] || process.cwd());
    break;
  case 'serve':
    runServe(args[1] || 3000);
    break;
  case 'unbox':
    runUnbox(args[1] || process.cwd());
    break;
  case 'export-agents':
    runExportAgents(args[1] || process.cwd());
    break;
  case 'badge':
    runBadge(args[1] || 'gitxray/gitxray');
    break;
  case 'vault':
    runVault();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    if (command.startsWith('http') || command.includes('/')) {
      runInspect(process.cwd());
    } else {
      showHelp();
    }
    break;
}

function showHelp() {
  console.log(BANNER);
  console.log(`Usage:
  npx gitxray inspect [path]       Inspect directory & compute PageRank gravity wells
  npx gitxray serve [port]         Launch zero-install browser visualizer (default: 3000)
  npx gitxray unbox [path]         Decompile codebase into 6 progressive rebuild milestones
  npx gitxray export-agents [path] Generate CLAUDE.md and .agents/skills.md
  npx gitxray badge [owner/repo]   Output dynamic SVG badge and markdown embed code
  npx gitxray vault                Browse the 50 legendary pre-decompiled architectures
`);
}

function runInspect(targetDir) {
  console.log(BANNER);
  const resolvedPath = path.resolve(targetDir);
  console.log(`\x1b[33m⚡ Ingesting AST and computing graph topology for:\x1b[0m ${resolvedPath}\n`);

  const engine = new GitXrayEngine();
  const startTime = Date.now();
  const result = engine.analyzeLocalProject(resolvedPath);
  const elapsed = Date.now() - startTime;

  const { totalFiles, graphAnalysis } = result;
  const { totalNodes, totalEdges, gravityWells } = graphAnalysis;

  console.log(`\x1b[32m✔ Microsecond Extraction Complete\x1b[0m (${elapsed}ms)`);
  console.log(`  • Scanned Files: ${totalFiles}`);
  console.log(`  • Graph Nodes:   ${totalNodes}`);
  console.log(`  • Import Edges:  ${totalEdges}\n`);

  console.log(`\x1b[1m\x1b[35m=== Architectural Gravity Wells (Core 5% Domain Kernels) ===\x1b[0m`);
  console.log(`\x1b[90mMathematical ranking via PageRank + Betweenness + Closeness centrality:\x1b[0m\n`);

  gravityWells.slice(0, 7).forEach((node, idx) => {
    const pr = (node.metrics.pageRank * 100).toFixed(2);
    const bw = (node.metrics.betweenness * 100).toFixed(2);
    const score = (node.metrics.gravityScore * 100).toFixed(2);
    console.log(`  \x1b[36m#${idx + 1}\x1b[0m \x1b[1m${node.id}\x1b[0m`);
    console.log(`     \x1b[90mPageRank: ${pr}% | Betweenness: ${bw}% | Gravity Score: ${score}%\x1b[0m`);
  });

  console.log(`\n\x1b[32m✔ Recommended Actions:\x1b[0m`);
  console.log(`  1. Run \x1b[36mnpx gitxray serve\x1b[0m to view the live interactive visualizer.`);
  console.log(`  2. Run \x1b[36mnpx gitxray export-agents\x1b[0m to slash AI coding agent context tokens by 98%.`);
  console.log(`  3. Run \x1b[36mnpx gitxray unbox\x1b[0m to test the Build-From-Scratch verification harness.\n`);
}

function runExportAgents(targetDir) {
  console.log(BANNER);
  const resolvedPath = path.resolve(targetDir);
  const engine = new GitXrayEngine();
  const result = engine.analyzeLocalProject(resolvedPath);

  const claudeMdPath = path.join(resolvedPath, 'CLAUDE.md');
  const agentsDir = path.join(resolvedPath, '.agents');
  const skillsMdPath = path.join(agentsDir, 'skills.md');

  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
  }

  const claudeContent = result.exporter.generateClaudeMd();
  const skillsContent = result.exporter.generateSkillsMd();

  fs.writeFileSync(claudeMdPath, claudeContent, 'utf-8');
  fs.writeFileSync(skillsMdPath, skillsContent, 'utf-8');

  console.log(`\x1b[32m✔ AI Agent Context Export Complete!\x1b[0m`);
  console.log(`  • Written: ${claudeMdPath}`);
  console.log(`  • Written: ${skillsMdPath}`);
  console.log(`\n\x1b[90mCoding agents (Claude Code, Cursor, Codex) now possess full structural AST awareness.\x1b[0m\n`);
}

function runUnbox(targetDir) {
  console.log(BANNER);
  const resolvedPath = path.resolve(targetDir);
  const engine = new GitXrayEngine();
  const result = engine.analyzeLocalProject(resolvedPath);
  const course = result.unboxCompiler.compileCourse();

  console.log(`\x1b[1m\x1b[33m=== Automated Unbox Mode: ${course.title} ===\x1b[0m\n`);
  console.log(`Identified Core Gravity Well: \x1b[36m${course.coreGravityWell}\x1b[0m\n`);

  course.milestones.forEach((m) => {
    console.log(`\x1b[32m[Stage ${m.stage}]\x1b[0m \x1b[1m${m.name}\x1b[0m`);
    console.log(`  \x1b[90mTarget: ${m.targetFile}\x1b[0m`);
    console.log(`  Objective: ${m.objective}`);
    console.log(`  Fixtures:  ${m.tests.length} automated invariant test cases\n`);
  });

  console.log(`\x1b[33mRunning Hard Verification Harness for Stage 0...\x1b[0m`);
  const stage0 = course.milestones[0];
  const verification = result.unboxCompiler.verifyStage(0, stage0.solution || stage0.codeTemplate);

  if (verification.passed) {
    console.log(`\x1b[32m✔ Stage 0 Verification Succeeded!\x1b[0m Exit code: ${verification.exitCode}`);
    console.log(`  ${verification.stdout}\n`);
  } else {
    console.log(`\x1b[31m✖ Verification Failed:\x1b[0m ${verification.stderr}\n`);
  }
}

function runBadge(repo) {
  const svg = BadgeGenerator.generateBadgeSvg({ repo });
  const md = BadgeGenerator.getBadgeMarkdown(repo);
  console.log(BANNER);
  console.log(`\x1b[1mEmbeddable Markdown Badge for ${repo}:\x1b[0m\n`);
  console.log(md);
  console.log(`\n\x1b[90mRaw SVG output length: ${svg.length} bytes\x1b[0m\n`);
}

function runVault() {
  console.log(BANNER);
  console.log(`\x1b[1m\x1b[35m=== The Open-Source Architecture Vault (50 Legendary Repositories) ===\x1b[0m\n`);
  ARCHITECTURE_VAULT.forEach((item, idx) => {
    console.log(`  \x1b[36m${(idx + 1).toString().padStart(2, ' ')}.\x1b[0m \x1b[1m${item.name}\x1b[0m (${item.repo}) - \x1b[33m${item.stars} ★\x1b[0m [${item.language}]`);
    console.log(`      \x1b[90mKernel: ${item.gravityWell} | ${item.stage0Summary}\x1b[0m`);
  });
  console.log(`\nOpen any repo online: https://gitxray.dev/<owner>/<repo>\n`);
}

function runServe(port = 3000) {
  const webDir = path.join(ROOT_DIR, 'web');
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];

    // API Routes
    if (reqUrl.startsWith('/api/badge/')) {
      const repoParam = reqUrl.replace('/api/badge/', '').replace(/\.svg$/, '');
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' });
      res.end(BadgeGenerator.generateBadgeSvg({ repo: repoParam }));
      return;
    }

    if (reqUrl === '/api/vault') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(ARCHITECTURE_VAULT));
      return;
    }

    if (reqUrl === '/api/analyze-local') {
      const engine = new GitXrayEngine();
      const analysis = engine.analyzeLocalProject(process.cwd());
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        totalFiles: analysis.totalFiles,
        graphAnalysis: analysis.graphAnalysis,
        course: analysis.unboxCompiler.compileCourse(),
        claudeMd: analysis.exporter.generateClaudeMd()
      }));
      return;
    }

    if (reqUrl === '/' || reqUrl === '/index.html') {
      reqUrl = '/index.html';
    }

    const filePath = path.join(webDir, reqUrl);
    if (!fs.existsSync(filePath)) {
      // Fallback to index.html for SPA route
      const indexPath = path.join(webDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(indexPath).pipe(res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png'
    };

    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  server.listen(port, () => {
    console.log(BANNER);
    console.log(`\x1b[32m✔ GitXray Live Visualizer Running!\x1b[0m`);
    console.log(`  Local URL:  \x1b[36mhttp://localhost:${port}\x1b[0m`);
    console.log(`  Engine:     WASM AST & Graph Centrality Engine`);
    console.log(`  Vault:      50 Legendary Repositories Pre-Loaded`);
    console.log(`\n\x1b[90mPress Ctrl+C to terminate the local server.\x1b[0m\n`);
  });
}
