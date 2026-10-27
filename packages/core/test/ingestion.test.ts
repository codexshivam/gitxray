import { describe, it, expect } from 'vitest';
import { IngestionCache } from '../src/ingestion/cache.js';
import { GitHubIngestion } from '../src/ingestion/github.js';

describe('GitHub Ingestion & Cache Layer', () => {
  it('stores and retrieves items from in-memory cache fallback', async () => {
    const cache = new IngestionCache();
    await cache.set('test-key', { foo: 'bar' });
    const res = await cache.get<{ foo: string }>('test-key');
    expect(res).toEqual({ foo: 'bar' });

    const nonExistent = await cache.get('missing');
    expect(nonExistent).toBeNull();
  });

  it('correctly filters ignored files and directories', () => {
    const ingestion = new GitHubIngestion();
    const isIgnored = (ingestion as any).isIgnored.bind(ingestion);

    expect(isIgnored('node_modules/express/index.js')).toBe(true);
    expect(isIgnored('vendor/bundle/ruby.rb')).toBe(true);
    expect(isIgnored('dist/bundle.min.js')).toBe(true);
    expect(isIgnored('package-lock.json.lock')).toBe(true);
    expect(isIgnored('assets/logo.png')).toBe(true);
    expect(isIgnored('src/app.ts')).toBe(false);
    expect(isIgnored('backend/main.py')).toBe(false);
  });
});
