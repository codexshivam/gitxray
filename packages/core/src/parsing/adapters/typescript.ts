import { FileParseResult, ImportDeclaration, SymbolDefinition, CallSite, LanguageAdapter } from '../../types.js';

export class TypeScriptAdapter implements LanguageAdapter {
  name = 'typescript';
  extensions = ['.ts', '.tsx', '.mts', '.cts'];

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

      if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

      // Imports: import ... from '...'
      const importMatch = trimmed.match(/^import\s+(?:type\s+)?(?:(.+?)\s+from\s+)?['"]([^'"]+)['"]/);
      if (importMatch) {
        const specStr = importMatch[1] || '';
        const source = importMatch[2];
        const specifiers = specStr
          .replace(/[{}]/g, '')
          .split(',')
          .map(s => s.trim().split(/\s+as\s+/)[0])
          .filter(Boolean);
        imports.push({ source, specifiers, line: lineNum });
        return;
      }

      // Functions: function foo, export function foo, const foo = () =>
      const funcMatch = trimmed.match(/(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)/);
      if (funcMatch) {
        symbols.push({ name: funcMatch[1], kind: 'function', line: lineNum });
        return;
      }

      const arrowMatch = trimmed.match(/(?:export\s+)?(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*(?::\s*[^=]+)?=>/);
      if (arrowMatch) {
        symbols.push({ name: arrowMatch[1], kind: 'function', line: lineNum });
        return;
      }

      // Classes & Interfaces & Types
      const classMatch = trimmed.match(/(?:export\s+)?(?:abstract\s+)?class\s+([a-zA-Z0-9_$]+)/);
      if (classMatch) {
        symbols.push({ name: classMatch[1], kind: 'class', line: lineNum });
        return;
      }

      const ifaceMatch = trimmed.match(/(?:export\s+)?interface\s+([a-zA-Z0-9_$]+)/);
      if (ifaceMatch) {
        symbols.push({ name: ifaceMatch[1], kind: 'interface', line: lineNum });
        return;
      }

      const typeMatch = trimmed.match(/(?:export\s+)?type\s+([a-zA-Z0-9_$]+)\s*=/);
      if (typeMatch) {
        symbols.push({ name: typeMatch[1], kind: 'type', line: lineNum });
        return;
      }

      // Call sites: foo(...)
      const callRegex = /([a-zA-Z0-9_$]+)\s*\(/g;
      let match: RegExpExecArray | null;
      const reserved = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'import', 'require', 'super', 'new']);
      while ((match = callRegex.exec(trimmed)) !== null) {
        const callee = match[1];
        if (!reserved.has(callee)) {
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
