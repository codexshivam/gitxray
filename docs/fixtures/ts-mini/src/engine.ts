import { formatTimestamp } from './utils.js';

export interface EngineConfig {
  retries: number;
}

export class Engine {
  private status = 'idle';

  start(): boolean {
    this.status = 'running';
    const ts = formatTimestamp(Date.now());
    return true;
  }
}
