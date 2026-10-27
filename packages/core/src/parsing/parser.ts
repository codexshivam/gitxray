import { FileParseResult, CoreGraphOutput, CoreGraphNode, CoreGraphEdge } from '../types.js';
import { AdapterRegistry } from './adapter.js';
import { PythonAdapter } from './adapters/python.js';
import { TypeScriptAdapter } from './adapters/typescript.js';
import { JavaScriptAdapter } from './adapters/javascript.js';

export class CodebaseParser {
  private registry = new AdapterRegistry();

  constructor() {
    this.registry.register(new PythonAdapter());
    this.registry.register(new TypeScriptAdapter());
    this.registry.register(new JavaScriptAdapter());
  }

  parseFile(filePath: string, content: string): FileParseResult | null {
    const adapter = this.registry.getAdapter(filePath);
    if (!adapter) return null;
    return adapter.parse(filePath, content);
  }

  buildGraph(files: Map<string, string>): CoreGraphOutput {
    const parsedFiles = new Map<string, FileParseResult>();

    for (const [filePath, content] of files.entries()) {
      const parsed = this.parseFile(filePath, content);
      if (parsed) {
        parsedFiles.set(filePath, parsed);
      }
    }

    const nodes: CoreGraphNode[] = [];
    const edges: CoreGraphEdge[] = [];
    const allPaths = Array.from(parsedFiles.keys());

    for (const [filePath, parsed] of parsedFiles.entries()) {
      nodes.push({
        id: filePath,
        language: parsed.language,
        lineCount: parsed.lineCount,
        symbols: parsed.symbols
      });

      for (const imp of parsed.imports) {
        const targetPath = this.resolveImportTarget(filePath, imp.source, allPaths);
        if (targetPath && targetPath !== filePath) {
          edges.push({
            source: filePath,
            target: targetPath
          });
        }
      }
    }

    // Deduplicate edges and sort for golden reproducibility
    const edgeSet = new Set<string>();
    const uniqueEdges: CoreGraphEdge[] = [];
    for (const edge of edges) {
      const key = `${edge.source}-->${edge.target}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        uniqueEdges.push(edge);
      }
    }

    nodes.sort((a, b) => a.id.localeCompare(b.id));
    uniqueEdges.sort((a, b) => `${a.source}-->${a.target}`.localeCompare(`${b.source}-->${b.target}`));

    return {
      nodes,
      edges: uniqueEdges
    };
  }

  private resolveImportTarget(sourceFile: string, importSource: string, allPaths: string[]): string | null {
    const cleanSource = importSource.replace(/^[./\\]+/, '').replace(/\.[^/.]+$/, '');
    const parts = cleanSource.split(/[./\\]/);
    const targetBaseName = parts[parts.length - 1];

    for (const path of allPaths) {
      const pathWithoutExt = path.replace(/\.[^/.]+$/, '');
      if (pathWithoutExt.endsWith(cleanSource) || pathWithoutExt.endsWith(targetBaseName)) {
        return path;
      }
    }
    return null;
  }
}
