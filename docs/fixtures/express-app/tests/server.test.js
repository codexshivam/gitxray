import { createServer } from '../server.js';

export function testServer() {
  const server = createServer();
  const res = server.handle({ url: '/users' });
  console.assert(res.length === 1);
}
