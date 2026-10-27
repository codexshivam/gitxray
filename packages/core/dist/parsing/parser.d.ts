import { FileParseResult, CoreGraphOutput } from '../types.js';
export declare class CodebaseParser {
    private registry;
    constructor();
    parseFile(filePath: string, content: string): FileParseResult | null;
    buildGraph(files: Map<string, string>): CoreGraphOutput;
    private resolveImportTarget;
}
//# sourceMappingURL=parser.d.ts.map