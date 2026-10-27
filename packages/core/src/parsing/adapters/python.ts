import { FileParseResult, ImportDeclaration, SymbolDefinition, CallSite, LanguageAdapter } from '../../types.js';

export class PythonAdapter implements LanguageAdapter {
  name = 'python';
  extensions = ['.py', '.pyi'];

  parse(filePath: string, content: string): FileParseResult {
    const lines = content.split('\n');
    const imports: ImportDeclaration[] = [];
    const symbols: SymbolDefinition[] = [];
    const callSites: CallSite[] = [];
    let hasSyntaxErrors = false;

    // Check basic bracket parity
    let parens = 0, brackets = 0, braces = 0;
    for (const char of content) {
      if (char === '(') parens++;
      else if (char === ')') parens--;
      else if (char === '[') brackets++;
      else if (char === ']') brackets--;
      else if (char === '{') braces++;
      else if (char === '}') braces--;
    }
    if (parens !== 0 || brackets !== 0 || braces !== 0) {
      hasSyntaxErrors = true;
    }

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith('#')) return;

      // Imports: "from X import Y" or "import X"
      const fromMatch = trimmed.match(/^from\s+([a-zA-Z0-9_.]+)\s+import\s+(.+)$/);
      if (fromMatch) {
        const source = fromMatch[1];
        const specifiers = fromMatch[2].split(',').map(s => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
        imports.push({ source, specifiers, line: lineNum });
        return;
      }

      const importMatch = trimmed.match(/^import\s+([a-zA-Z0-9_.,\s]+)$/);
      if (importMatch) {
        const pkgs = importMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
        pkgs.forEach(pkg => {
          imports.push({ source: pkg, specifiers: [pkg], line: lineNum });
        });
        return;
      }

      // Definitions: "def foo" or "async def foo"
      const defMatch = trimmed.match(/^(?:async\s+)?def\s+([a-zA-Z0-9_]+)\s*\(/);
      if (defMatch) {
        symbols.push({ name: defMatch[1], kind: 'function', line: lineNum });
        return;
      }

      // Class definitions: "class Foo"
      const classMatch = trimmed.match(/^class\s+([a-zA-Z0-9_]+)(?:\s*\(|:)/);
      if (classMatch) {
        symbols.push({ name: classMatch[1], kind: 'class', line: lineNum });
        return;
      }

      // Call sites: foo(...)
      const callRegex = /([a-zA-Z0-9_]+)\s*\(/g;
      let match: RegExpExecArray | null;
      const reserved = new Set(['def', 'class', 'if', 'elif', 'while', 'for', 'with', 'return', 'raise', 'yield', 'except', 'assert']);
      while ((match = callRegex.exec(trimmed)) !== null) {
        const callee = match[1];
        if (!reserved.has(callee) && !callee.startsWith('__')) {
          callSites.push({ callee, line: lineNum });
        }
      }
    });

    return {
      filePath,
      language: this.name,
      lineCount: lines.length,
      imports,
      symbols,
      callSites,
      hasSyntaxErrors
    };
  }
}
