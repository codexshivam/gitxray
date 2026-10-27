import { routeRequest } from './router.js';

export function handleIncoming(req, res) {
  return routeRequest(req.url);
}
