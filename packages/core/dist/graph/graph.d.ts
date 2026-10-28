import { FileParseResult, CoreGraphOutput, CoreGraphNode, SymbolGraphOutput, SymbolGraphNode } from '../types.js';
export declare class CodeGraph {
    private fileNodes;
    private fileAdjacency;
    private fileReverseAdjacency;
    private symbolNodes;
    private symbolAdjacency;
    private symbolReverseAdjacency;
    addFileNode(node: CoreGraphNode): void;
    addFileEdge(source: string, target: string): void;
    addSymbolNode(node: SymbolGraphNode): void;
    addSymbolEdge(source: string, target: string): void;
    getFileNodes(): CoreGraphNode[];
    getFileNeighbors(id: string): string[];
    getFilePredecessors(id: string): string[];
    getSymbolNodes(): SymbolGraphNode[];
    toFileGraphOutput(): CoreGraphOutput;
    toSymbolGraphOutput(): SymbolGraphOutput;
    static fromParsedFiles(parsedMap: Map<string, FileParseResult>): CodeGraph;
    private static resolveImportTarget;
}
//# sourceMappingURL=graph.d.ts.map