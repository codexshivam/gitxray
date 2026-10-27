import { describe, it, expect } from 'vitest';
import { CodebaseParser } from '../src/parsing/parser.js';

describe('CodebaseParser and Language Adapters', () => {
  const parser = new CodebaseParser();

  it('parses Python functions, classes, imports, and calls', () => {
    const code = `
import math
from typing import List

class Calculator:
    def add(self, a: int, b: int) -> int:
        return a + b

def run():
    calc = Calculator()
    return calc.add(1, 2)
`;
    const res = parser.parseFile('calc.py', code);
    expect(res).not.toBeNull();
    expect(res?.language).toBe('python');
    expect(res?.imports.length).toBe(2);
    expect(res?.symbols.map(s => s.name)).toEqual(['Calculator', 'add', 'run']);
    expect(res?.hasSyntaxErrors).toBe(false);
  });

  it('tolerates Python syntax errors gracefully without throwing', () => {
    const brokenCode = `
def broken_fn(
    x = 10
    # Missing closing parenthesis and unexpected token
    print "invalid syntax"
`;
    const res = parser.parseFile('broken.py', brokenCode);
    expect(res).not.toBeNull();
    expect(res?.hasSyntaxErrors).toBe(true);
    expect(res?.symbols.some(s => s.name === 'broken_fn')).toBe(true);
  });

  it('parses TypeScript interfaces, types, classes, and calls', () => {
    const code = `
import { Engine } from './engine';

export interface Options {
  timeout: number;
}

export type ID = string | number;

export class Runner {
  execute(opt: Options) {
    const engine = new Engine();
    return engine.start();
  }
}
`;
    const res = parser.parseFile('runner.ts', code);
    expect(res).not.toBeNull();
    expect(res?.language).toBe('typescript');
    expect(res?.imports.length).toBe(1);
    expect(res?.symbols.map(s => s.name)).toEqual(['Options', 'ID', 'Runner']);
    expect(res?.hasSyntaxErrors).toBe(false);
  });

  it('tolerates TypeScript syntax errors gracefully without crashing', () => {
    const brokenCode = `
export class Incomplete {
  test() {
    const a = [1, 2, 3;
`;
    const res = parser.parseFile('incomplete.ts', brokenCode);
    expect(res).not.toBeNull();
    expect(res?.hasSyntaxErrors).toBe(true);
    expect(res?.symbols.some(s => s.name === 'Incomplete')).toBe(true);
  });
});
