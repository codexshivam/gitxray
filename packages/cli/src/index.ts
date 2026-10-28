#!/usr/bin/env node
import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs';
import { LocalScanner } from './scanner.js';
import { ClaudeMdExporter, AgentsSkillsExporter } from '@gitxray/core';

const program = new Command();

program
  .name('gitxray')
  .description('GitXray: Zero-install codebase decompiler, architecture graph, and CLAUDE.md exporter')
  .version('0.1.0');

// Default / inspect command
program
  .command('inspect', { isDefault: true })
  .argument('[target]', 'Target directory or GitHub repo', '.')
  .description('Inspect codebase and display architecture ranking table')
  .action(async (target) => {
    const resolvedDir = path.resolve(target);
    console.log(`\n🔍 GitXray analyzing: ${resolvedDir}\n`);

    try {
      const { graph, ranking, fileCount } = await LocalScanner.analyzeLocal(resolvedDir);
      console.log(`📁 Source files analyzed: ${fileCount}`);
      console.log(`🔗 Dependency graph edges: ${graph.edges.length}`);
      console.log(`📊 Topological stages:    ${ranking.stages.length}\n`);

      console.log('Top Core Modules (PageRank + Centrality):');
      console.log('─'.repeat(70));
      console.log(
        '  Rank  | Stage | Score  | Module Path'
      );
      console.log('─'.repeat(70));

      const top = ranking.rankedFiles.filter((f) => !f.isBoilerplate).slice(0, 10);
      top.forEach((node, idx) => {
        const rankStr = `#${idx + 1}`.padEnd(6);
        const stageStr = `S${node.stage ?? 0}`.padEnd(5);
        const scoreStr = `${(node.score * 100).toFixed(1)}%`.padEnd(6);
        console.log(`  ${rankStr} | ${stageStr} | ${scoreStr} | ${node.id}`);
      });
      console.log('─'.repeat(70));
      console.log(`\n💡 To export context for AI agents: npx gitxray export ${target}\n`);
    } catch (err: any) {
      console.error(`Error analyzing codebase: ${err.message}`);
      process.exit(1);
    }
  });

// Export command
program
  .command('export')
  .argument('[target]', 'Target directory to analyze', '.')
  .option('-o, --out <dir>', 'Output directory (defaults to target)', '.')
  .option('--claude', 'Export CLAUDE.md only', false)
  .option('--skills', 'Export .agents/skills.md only', false)
  .description('Export CLAUDE.md and .agents/skills.md for AI agent pairs')
  .action(async (target, options) => {
    const resolvedDir = path.resolve(target);
    const outputDir = path.resolve(options.out || target);
    const repoName = path.basename(resolvedDir);

    console.log(`\n📦 GitXray exporting architectural context for ${repoName}...`);

    try {
      const { graph, ranking } = await LocalScanner.analyzeLocal(resolvedDir);

      const writeAll = !options.claude && !options.skills;

      if (writeAll || options.claude) {
        const claudeMd = ClaudeMdExporter.export(graph, ranking, { repoName });
        const claudePath = path.join(outputDir, 'CLAUDE.md');
        fs.writeFileSync(claudePath, claudeMd, 'utf8');
        console.log(`✓ Generated: ${claudePath}`);
      }

      if (writeAll || options.skills) {
        const skillsMd = AgentsSkillsExporter.export(graph, ranking, { repoName });
        const skillsDir = path.join(outputDir, '.agents');
        if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });
        const skillsPath = path.join(skillsDir, 'skills.md');
        fs.writeFileSync(skillsPath, skillsMd, 'utf8');
        console.log(`✓ Generated: ${skillsPath}`);
      }

      console.log(`\n🎉 Architecture exports completed!\n`);
    } catch (err: any) {
      console.error(`Export failed: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
