import { CommandRunner } from './runner.js';
import { parseArguments } from './parser.js';

export function main(): void {
  const args = parseArguments(process.argv);
  const runner = new CommandRunner();
  runner.run(args);
}
