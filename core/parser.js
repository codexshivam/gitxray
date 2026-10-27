import fs from 'node:fs';
import path from 'node:path';

export class CodeParser {
  constructor(options = {}) {
    this.options = options;
  }

  detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.js':
      case '.mjs':
      case '.cjs':
        return 'javascript';
      case '.ts':
      case '.mts':
      case '.cts':
        return 'typescript';
      case '.jsx':
      case '.tsx':
        return 'react';
      case '.py':
        return 'python';
      case '.rs':
        return 'rust';
      case '.go':
        return 'go';
      case '.c':
      case '.h':
      case '.cpp':
      case '.hpp':
      case '.cc':
        return 'cpp';
      case '.java':
        return 'java';
      default:
        return 'unknown';
    }
  }

  parseFile(filePath, content) {
    const lang = this.detectLanguage(filePath);
    const lines = content.split('\n');
    const lineCount = lines.length;

    const symbols = [];
    const imports = [];
    const calls = [];

    switch (lang) {
      case 'javascript':
      case 'typescript':
      case 'react':
        this._parseEcmaScript(content, lines, symbols, imports, calls);
        break;
      case 'python':
        this._parsePython(content, lines, symbols, imports, calls);
        break;
      case 'rust':
        this._parseRust(content, lines, symbols, imports, calls);
        break;
      case 'go':
        this._parseGo(content, lines, symbols, imports, calls);
        break;
      case 'cpp':
      case 'java':
        this._parseCStyle(content, lines, symbols, imports, calls);
        break;
      default:
        this._parseGeneric(content, lines, symbols, imports, calls);
        break;
    }

    return {
      filePath,
      language: lang,
      lineCount,
      symbols,
      imports,
      calls: [...new Set(calls)]
    };
  }

  _parseEcmaScript(content, lines, symbols, imports, calls) {
    const importRegex = /(?:import\s+(?:[\w*\s{},]*)\s+from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1] || match[2]);
    }

    const funcRegex = /(?:function\s+([A-Za-z0-9_$]+)|(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|(?:class\s+([A-Za-z0-9_$]+)))/g;
    while ((match = funcRegex.exec(content)) !== null) {
      const name = match[1] || match[2] || match[3];
      const kind = match[3] ? 'class' : 'function';
      const line = content.slice(0, match.index).split('\n').length;
      symbols.push({ name, kind, line });
    }

    const callRegex = /([A-Za-z0-9_$]+)\s*\(/g;
    const reserved = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'import', 'require', 'return']);
    while ((match = callRegex.exec(content)) !== null) {
      const callee = match[1];
      if (!reserved.has(callee)) {
        calls.push(callee);
      }
    }
  }

  _parsePython(content, lines, symbols, imports, calls) {
    const importRegex = /(?:from\s+([A-Za-z0-9_.]+)\s+import|import\s+([A-Za-z0-9_.]+))/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1] || match[2]);
    }

    const defRegex = /(?:def\s+([A-Za-z0-9_]+)|class\s+([A-Za-z0-9_]+))/g;
    while ((match = defRegex.exec(content)) !== null) {
      const name = match[1] || match[2];
      const kind = match[2] ? 'class' : 'function';
      const line = content.slice(0, match.index).split('\n').length;
      symbols.push({ name, kind, line });
    }

    const callRegex = /([A-Za-z0-9_]+)\s*\(/g;
    const reserved = new Set(['def', 'class', 'if', 'elif', 'while', 'for', 'with', 'return', 'print', 'super']);
    while ((match = callRegex.exec(content)) !== null) {
      const callee = match[1];
      if (!reserved.has(callee)) {
        calls.push(callee);
      }
    }
  }

  _parseRust(content, lines, symbols, imports, calls) {
    const useRegex = /use\s+([A-Za-z0-9_:]+);/g;
    let match;
    while ((match = useRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    const itemRegex = /(?:fn\s+([A-Za-z0-9_]+)|struct\s+([A-Za-z0-9_]+)|enum\s+([A-Za-z0-9_]+)|impl\s+([A-Za-z0-9_]+))/g;
    while ((match = itemRegex.exec(content)) !== null) {
      const name = match[1] || match[2] || match[3] || match[4];
      const kind = match[1] ? 'function' : match[2] ? 'struct' : match[3] ? 'enum' : 'impl';
      const line = content.slice(0, match.index).split('\n').length;
      symbols.push({ name, kind, line });
    }

    const callRegex = /([A-Za-z0-9_]+)\s*\(/g;
    const reserved = new Set(['fn', 'struct', 'enum', 'impl', 'if', 'while', 'for', 'match', 'return', 'println', 'vec']);
    while ((match = callRegex.exec(content)) !== null) {
      const callee = match[1];
      if (!reserved.has(callee)) {
        calls.push(callee);
      }
    }
  }

  _parseGo(content, lines, symbols, imports, calls) {
    const importRegex = /import\s+(?:\(\s*([^)]+)\s*\)|"([^"]+)")/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      if (match[2]) {
        imports.push(match[2]);
      } else if (match[1]) {
        const pkgLines = match[1].split('\n').map(s => s.trim().replace(/"/g, '')).filter(Boolean);
        imports.push(...pkgLines);
      }
    }

    const funcRegex = /(?:func\s+(?:\([^)]+\)\s+)?([A-Za-z0-9_]+)|type\s+([A-Za-z0-9_]+)\s+struct)/g;
    while ((match = funcRegex.exec(content)) !== null) {
      const name = match[1] || match[2];
      const kind = match[2] ? 'struct' : 'function';
      const line = content.slice(0, match.index).split('\n').length;
      symbols.push({ name, kind, line });
    }

    const callRegex = /([A-Za-z0-9_]+)\s*\(/g;
    const reserved = new Set(['func', 'type', 'struct', 'if', 'for', 'switch', 'return', 'make', 'len', 'append']);
    while ((match = callRegex.exec(content)) !== null) {
      const callee = match[1];
      if (!reserved.has(callee)) {
        calls.push(callee);
      }
    }
  }

  _parseCStyle(content, lines, symbols, imports, calls) {
    const incRegex = /#(?:include|import)\s+[<"]([^>"]+)[>"]/g;
    let match;
    while ((match = incRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    const funcRegex = /(?:(?:class|struct)\s+([A-Za-z0-9_]+)|(?:[A-Za-z0-9_<>\*&]+\s+)+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{)/g;
    while ((match = funcRegex.exec(content)) !== null) {
      const name = match[1] || match[2];
      if (!name) continue;
      const kind = match[1] ? 'class' : 'function';
      const line = content.slice(0, match.index).split('\n').length;
      symbols.push({ name, kind, line });
    }

    const callRegex = /([A-Za-z0-9_]+)\s*\(/g;
    const reserved = new Set(['if', 'for', 'while', 'switch', 'catch', 'return', 'sizeof', 'typeof', 'printf']);
    while ((match = callRegex.exec(content)) !== null) {
      const callee = match[1];
      if (!reserved.has(callee)) {
        calls.push(callee);
      }
    }
  }

  _parseGeneric(content, lines, symbols, imports, calls) {
    const genericImport = /(?:import|require|include|use)\s+([A-Za-z0-9_./"'-]+)/g;
    let match;
    while ((match = genericImport.exec(content)) !== null) {
      imports.push(match[1].replace(/['"]/g, ''));
    }
  }
}
