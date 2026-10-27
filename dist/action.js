import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { GitXrayEngine } from '../core/engine.js';

async function run() {
  try {
    const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
    const eventPath = process.env.GITHUB_EVENT_PATH;
    let changedFiles = [];

    if (eventPath && fs.existsSync(eventPath)) {
      const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
      if (eventData.pull_request) {
        try {
          const diffOutput = execSync('git diff --name-only origin/main HEAD', { encoding: 'utf-8' });
          changedFiles = diffOutput.split('\n').filter(Boolean);
        } catch (e) {
          changedFiles = [];
        }
      }
    }

    const engine = new GitXrayEngine();
    const result = engine.analyzeLocalProject(workspace);

    if (changedFiles.length === 0) {
      changedFiles = result.graphAnalysis.gravityWells.slice(0, 1).map(g => g.id);
    }

    const blastResult = result.blastAnalyzer.calculateBlastRadius(changedFiles);
    const repoName = process.env.GITHUB_REPOSITORY || 'target-repo';
    const reportMd = result.blastAnalyzer.formatMarkdownReport(blastResult, repoName);

    console.log('\n--- GitXray Blast-Radius Audit Report ---');
    console.log(reportMd);

    const stepSummaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (stepSummaryFile && fs.existsSync(stepSummaryFile)) {
      fs.appendFileSync(stepSummaryFile, `\n${reportMd}\n`);
    }
  } catch (error) {
    console.error('GitXray Action Error:', error);
    process.exit(1);
  }
}

run();
