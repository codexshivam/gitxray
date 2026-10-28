import { CommandRunner } from '../src/runner.js';
import { parseArguments } from '../src/parser.js';

export function testCLI() {
  const arg = parseArguments(['node', 'bin.js', 'test']);
  const runner = new CommandRunner();
  console.assert(runner.run(arg) === true);
}
