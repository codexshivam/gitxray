import fs from 'node:fs';
import path from 'node:path';
import { CodeParser } from './parser.js';
import { DependencyGraph } from './graph.js';
import { ExecutionTracer } from './tracer.js';
import { UnboxCompiler } from './unbox.js';
import { BlastRadiusAnalyzer } from './blast_radius.js';
import { AgentExporter } from './exporter.js';
import { BadgeGenerator } from './badge.js';
import { ARCHITECTURE_VAULT } from './vault_data.js';

export class GitXrayEngine {
  constructor(options = {}) {
    this.options = options;
    this.parser = new CodeParser();
    this.graph = new DependencyGraph();
    this.tracer = new ExecutionTracer();
    this.filesMap = new Map();
  }

  scanDirectory(dirPath, ignoreDirs = ['node_modules', '.git', 'dist', 'build', 'coverage', '.cache']) {
    const results = [];
    const walk = (currentPath) => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!ignoreDirs.includes(entry.name) && !entry.name.startsWith('.')) {
            walk(path.join(currentPath, entry.name));
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const validExts = ['.js', '.ts', '.jsx', '.tsx', '.py', '.rs', '.go', '.c', '.h', '.cpp', '.java'];
          if (validExts.includes(ext)) {
            results.push(path.join(currentPath, entry.name));
          }
        }
      }
    };

    walk(dirPath);
    return results;
  }

  analyzeLocalProject(rootPath) {
    const filePaths = this.scanDirectory(rootPath);
    this.graph = new DependencyGraph();
    this.filesMap.clear();

    const parsedFiles = [];
    for (const filePath of filePaths) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(rootPath, filePath);
        this.filesMap.set(relativePath, content);

        const parsed = this.parser.parseFile(relativePath, content);
        parsedFiles.push(parsed);

        this.graph.addNode(relativePath, {
          language: parsed.language,
          lines: parsed.lineCount,
          symbols: parsed.symbols
        });
      } catch (err) {
        // Skip unreadable files
      }
    }

    for (const file of parsedFiles) {
      for (const imp of file.imports) {
        const target = this._resolveImport(file.filePath, imp, this.filesMap);
        if (target) {
          this.graph.addEdge(file.filePath, target);
        }
      }
    }

    const graphAnalysis = this.graph.analyze();
    const blastAnalyzer = new BlastRadiusAnalyzer(this.graph);
    const unboxCompiler = new UnboxCompiler(graphAnalysis, this.filesMap);
    const exporter = new AgentExporter(graphAnalysis, path.basename(rootPath));

    return {
      rootPath,
      totalFiles: filePaths.length,
      graphAnalysis,
      blastAnalyzer,
      unboxCompiler,
      exporter
    };
  }

  _resolveImport(sourceFile, importStr, filesMap) {
    const dir = path.dirname(sourceFile);
    const candidates = [
      path.join(dir, importStr),
      path.join(dir, `${importStr}.js`),
      path.join(dir, `${importStr}.ts`),
      path.join(dir, `${importStr}.jsx`),
      path.join(dir, `${importStr}.tsx`),
      path.join(dir, importStr, 'index.js'),
      path.join(dir, importStr, 'index.ts'),
      importStr,
      `${importStr}.py`
    ];

    for (const candidate of candidates) {
      const normalized = candidate.replace(/\\/g, '/');
      if (filesMap.has(normalized)) {
        return normalized;
      }
    }
    return null;
  }
}

export {
  CodeParser,
  DependencyGraph,
  ExecutionTracer,
  UnboxCompiler,
  BlastRadiusAnalyzer,
  AgentExporter,
  BadgeGenerator,
  ARCHITECTURE_VAULT
};
