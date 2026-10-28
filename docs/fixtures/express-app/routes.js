import { fetchUsers, fetchProducts } from './controllers.js';

export function createRouter() {
  return {
    dispatch: (req) => {
      if (req.url === '/users') return fetchUsers();
      if (req.url === '/products') return fetchProducts();
      return { status: 404 };
    }
  };
}
