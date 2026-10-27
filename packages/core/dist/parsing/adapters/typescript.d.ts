import { FileParseResult, LanguageAdapter } from '../../types.js';
export declare class TypeScriptAdapter implements LanguageAdapter {
    name: string;
    extensions: string[];
    parse(filePath: string, content: string): FileParseResult;
}
//# sourceMappingURL=typescript.d.ts.map