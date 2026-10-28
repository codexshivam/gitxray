import { UserModel, ProductModel } from './models.js';
import { logInfo } from './logger.js';

export function fetchUsers() {
  logInfo('Fetching user records');
  return UserModel.findAll();
}

export function fetchProducts() {
  logInfo('Fetching product inventory');
  return ProductModel.findAll();
}
