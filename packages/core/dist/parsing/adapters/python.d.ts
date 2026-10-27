import { FileParseResult, LanguageAdapter } from '../../types.js';
export declare class PythonAdapter implements LanguageAdapter {
    name: string;
    extensions: string[];
    parse(filePath: string, content: string): FileParseResult;
}
//# sourceMappingURL=python.d.ts.map