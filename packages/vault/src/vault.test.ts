import { describe, it, expect } from 'vitest';
import { ARCHITECTURE_VAULT } from './index.js';

describe('Vault Index', () => {
  it('exposes prebuilt vault courses', () => {
    expect(ARCHITECTURE_VAULT.length).toBeGreaterThan(0);
  });
});
