import fs from 'node:fs';
import path from 'node:path';
import {
  CodebaseParser,
  CodeGraph,
  RankingEngine,
  RankingResult,
  CoreGraphOutput,
  FileParseResult
} from '@gitxray/core';

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.turbo',
  'venv',
  '.venv',
  '__pycache__'
]);

const SUPPORTED_EXTS = new Set(['.py', '.ts', '.tsx', '.js', '.jsx']);

export interface LocalAnalysis {
  graph: CoreGraphOutput;
  ranking: RankingResult;
  fileCount: number;
}

export class LocalScanner {
  public static scanDirectory(dirPath: string): { relativePath: string; content: string }[] {
    const results: { relativePath: string; content: string }[] = [];

    function walk(currDir: string) {
      let entries: fs.Dirent[] = [];
      try {
        entries = fs.readdirSync(currDir, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        if (entry.name.startsWith('.') && entry.name !== '.env') continue;
        const fullPath = path.join(currDir, entry.name);

        if (entry.isDirectory()) {
          if (!IGNORED_DIRS.has(entry.name)) {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (SUPPORTED_EXTS.has(ext)) {
            try {
              const rel = path.relative(dirPath, fullPath).replace(/\\/g, '/');
              const content = fs.readFileSync(fullPath, 'utf8');
              results.push({ relativePath: rel, content });
            } catch {}
          }
        }
      }
    }

    walk(dirPath);
    return results;
  }

  public static async analyzeLocal(targetDir: string): Promise<LocalAnalysis> {
    const files = this.scanDirectory(targetDir);
    const parser = new CodebaseParser();
    const parsedMap = new Map<string, FileParseResult>();

    for (const f of files) {
      const parsed = parser.parseFile(f.relativePath, f.content);
      if (parsed) {
        parsedMap.set(f.relativePath, parsed);
      }
    }

    const codeGraph = CodeGraph.fromParsedFiles(parsedMap);
    const ranking = RankingEngine.rank(codeGraph);

    return {
      graph: codeGraph.toFileGraphOutput(),
      ranking,
      fileCount: files.length
    };
  }
}
