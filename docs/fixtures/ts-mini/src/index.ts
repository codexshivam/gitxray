import { Engine } from './engine.js';

export function runCLI(): void {
  const engine = new Engine();
  engine.start();
}
