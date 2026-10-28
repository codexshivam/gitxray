import { formatStatus } from './utils.js';

export class CommandRunner {
  run(commandName: string): boolean {
    const formatted = formatStatus(`Executing ${commandName}`);
    return true;
  }
}
