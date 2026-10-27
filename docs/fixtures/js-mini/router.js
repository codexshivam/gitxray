import { executeAction } from './controller.js';

export function routeRequest(url) {
  if (url === '/health') return { status: 'healthy' };
  return executeAction(url);
}
