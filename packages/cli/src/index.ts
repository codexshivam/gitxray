#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('gitxray')
  .description('Zero-install browser-native live codebase decompiler & AST graph engine')
  .version('0.1.0');

program
  .command('inspect')
  .argument('[target]', 'Target directory or GitHub repo', '.')
  .description('Inspect codebase and extract AST graph')
  .action((target) => {
    console.log(`Inspecting ${target}...`);
  });

program.parse(process.argv);
