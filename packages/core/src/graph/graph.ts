import { FileParseResult, CoreGraphOutput, CoreGraphNode, CoreGraphEdge, SymbolGraphOutput, SymbolGraphNode, SymbolGraphEdge } from '../types.js';

export class CodeGraph {
  private fileNodes = new Map<string, CoreGraphNode>();
  private fileAdjacency = new Map<string, Set<string>>(); // source -> targets (imports)
  private fileReverseAdjacency = new Map<string, Set<string>>(); // target -> sources (imported by)

  private symbolNodes = new Map<string, SymbolGraphNode>();
  private symbolAdjacency = new Map<string, Set<string>>();
  private symbolReverseAdjacency = new Map<string, Set<string>>();

  addFileNode(node: CoreGraphNode): void {
    if (!this.fileNodes.has(node.id)) {
      this.fileNodes.set(node.id, node);
      this.fileAdjacency.set(node.id, new Set());
      this.fileReverseAdjacency.set(node.id, new Set());
    }
  }

  addFileEdge(source: string, target: string): void {
    if (!this.fileNodes.has(source)) {
      this.addFileNode({ id: source, language: 'unknown', lineCount: 0, symbols: [] });
    }
    if (!this.fileNodes.has(target)) {
      this.addFileNode({ id: target, language: 'unknown', lineCount: 0, symbols: [] });
    }
    this.fileAdjacency.get(source)!.add(target);
    this.fileReverseAdjacency.get(target)!.add(source);
  }

  addSymbolNode(node: SymbolGraphNode): void {
    if (!this.symbolNodes.has(node.id)) {
      this.symbolNodes.set(node.id, node);
      this.symbolAdjacency.set(node.id, new Set());
      this.symbolReverseAdjacency.set(node.id, new Set());
    }
  }

  addSymbolEdge(source: string, target: string): void {
    if (!this.symbolNodes.has(source) || !this.symbolNodes.has(target)) return;
    this.symbolAdjacency.get(source)!.add(target);
    this.symbolReverseAdjacency.get(target)!.add(source);
  }

  getFileNodes(): CoreGraphNode[] {
    return Array.from(this.fileNodes.values());
  }

  getFileNeighbors(id: string): string[] {
    return Array.from(this.fileAdjacency.get(id) || []);
  }

  getFilePredecessors(id: string): string[] {
    return Array.from(this.fileReverseAdjacency.get(id) || []);
  }

  getSymbolNodes(): SymbolGraphNode[] {
    return Array.from(this.symbolNodes.values());
  }

  toFileGraphOutput(): CoreGraphOutput {
    const edges: CoreGraphEdge[] = [];
    for (const [source, targets] of this.fileAdjacency.entries()) {
      for (const target of targets) {
        edges.push({ source, target });
      }
    }
    return {
      nodes: this.getFileNodes(),
      edges
    };
  }

  toSymbolGraphOutput(): SymbolGraphOutput {
    const edges: SymbolGraphEdge[] = [];
    for (const [source, targets] of this.symbolAdjacency.entries()) {
      for (const target of targets) {
        edges.push({ source, target });
      }
    }
    return {
      nodes: this.getSymbolNodes(),
      edges
    };
  }

  static fromParsedFiles(parsedMap: Map<string, FileParseResult>): CodeGraph {
    const graph = new CodeGraph();
    const allPaths = Array.from(parsedMap.keys());

    // 1. Register File Nodes & Symbol Nodes
    for (const [filePath, parsed] of parsedMap.entries()) {
      graph.addFileNode({
        id: filePath,
        language: parsed.language,
        lineCount: parsed.lineCount,
        symbols: parsed.symbols
      });

      for (const sym of parsed.symbols) {
        const symId = `${filePath}#${sym.name}`;
        graph.addSymbolNode({
          id: symId,
          file: filePath,
          name: sym.name,
          kind: sym.kind,
          line: sym.line
        });
      }
    }

    // 2. Build File-Level Dependency Edges
    for (const [sourcePath, parsed] of parsedMap.entries()) {
      for (const imp of parsed.imports) {
        const targetPath = CodeGraph.resolveImportTarget(sourcePath, imp.source, allPaths);
        if (targetPath && targetPath !== sourcePath) {
          graph.addFileEdge(sourcePath, targetPath);
        }
      }
    }

    // 3. Build Symbol-Level Call Edges (name-based intra-file and cross-file resolution)
    const symbolIndex = new Map<string, string[]>(); // name -> [symId1, symId2]
    for (const sym of graph.getSymbolNodes()) {
      if (!symbolIndex.has(sym.name)) symbolIndex.set(sym.name, []);
      symbolIndex.get(sym.name)!.push(sym.id);
    }

    for (const [sourcePath, parsed] of parsedMap.entries()) {
      // Find caller symbols in this file
      for (const call of parsed.callSites) {
        const potentialTargets = symbolIndex.get(call.callee) || [];
        for (const targetSymId of potentialTargets) {
          const targetFile = targetSymId.split('#')[0];
          // Either same file or directly imported file
          if (targetFile === sourcePath || graph.getFileNeighbors(sourcePath).includes(targetFile)) {
            // Find which symbol in sourcePath contains this line
            const callerSym = parsed.symbols
              .filter(s => s.line <= call.line)
              .sort((a, b) => b.line - a.line)[0];

            if (callerSym) {
              const callerId = `${sourcePath}#${callerSym.name}`;
              if (callerId !== targetSymId) {
                graph.addSymbolEdge(callerId, targetSymId);
              }
            }
          }
        }
      }
    }

    return graph;
  }

  private static resolveImportTarget(sourceFile: string, importSource: string, allPaths: string[]): string | null {
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
