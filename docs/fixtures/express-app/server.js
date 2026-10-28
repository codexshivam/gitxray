import { createRouter } from './routes.js';
import { logInfo } from './logger.js';

export function createServer() {
  logInfo('Initializing Express Application');
  const router = createRouter();
  return {
    handle: (req) => router.dispatch(req)
  };
}
