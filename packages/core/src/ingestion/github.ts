import { IngestionOptions, IngestionResult, RepoTreeItem } from '../types.js';
import { IngestionCache } from './cache.js';

export class GitHubIngestion {
  private cache = new IngestionCache();

  private isIgnored(path: string): boolean {
    const lower = path.toLowerCase();
    return (
      lower.includes('node_modules/') ||
      lower.includes('vendor/') ||
      lower.includes('.git/') ||
      lower.includes('dist/') ||
      lower.includes('build/') ||
      lower.includes('.github/') ||
      lower.includes('coverage/') ||
      lower.endsWith('.min.js') ||
      lower.endsWith('.lock') ||
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.gif') ||
      lower.endsWith('.ico') ||
      lower.endsWith('.pdf') ||
      lower.endsWith('.woff') ||
      lower.endsWith('.woff2') ||
      lower.endsWith('.ttf') ||
      lower.endsWith('.zip') ||
      lower.endsWith('.tar') ||
      lower.endsWith('.gz')
    );
  }

  async fetchRepo(owner: string, repo: string, ref?: string, options: IngestionOptions = {}): Promise<IngestionResult> {
    const maxFiles = options.maxFiles || 2000;
    const maxFileSizeKb = options.maxFileSizeKb || 500;
    let targetRef: string = ref || 'main';
    let rateLimited = false;

    // Resolve default branch if not specified
    if (!ref) {
      const metaKey = `repo-meta:${owner}/${repo}`;
      const cachedMeta = await this.cache.get<{ default_branch: string }>(metaKey);
      if (cachedMeta) {
        targetRef = cachedMeta.default_branch;
      } else {
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json'
        };
        if (options.token) headers['Authorization'] = `Bearer ${options.token}`;

        const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (metaRes.status === 403) {
          rateLimited = true;
          targetRef = 'main';
        } else if (metaRes.ok) {
          const metaData = await metaRes.json();
          targetRef = metaData.default_branch || 'main';
          await this.cache.set(metaKey, { default_branch: targetRef });
        } else {
          targetRef = 'main';
        }
      }
    }

    const cacheKey = `repo-tree:${owner}/${repo}:${targetRef}`;

    // Fetch or read tree
    let treeItems: RepoTreeItem[] | null = await this.cache.get<RepoTreeItem[]>(cacheKey);

    if (!treeItems && !rateLimited) {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json'
      };
      if (options.token) headers['Authorization'] = `Bearer ${options.token}`;

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${targetRef}?recursive=1`, { headers });
      if (treeRes.status === 403) {
        rateLimited = true;
      } else if (treeRes.ok) {
        const treeData = await treeRes.json();
        treeItems = treeData.tree as RepoTreeItem[];
        await this.cache.set(cacheKey, treeItems);
      }
    }

    if (!treeItems) {
      return {
        owner,
        repo,
        ref: targetRef,
        files: new Map(),
        totalBlobs: 0,
        ingestedBlobs: 0,
        rateLimited
      };
    }

    const eligibleBlobs = treeItems
      .filter(item => item.type === 'blob')
      .filter(item => !this.isIgnored(item.path))
      .filter(item => !item.size || item.size <= maxFileSizeKb * 1024);

    const totalBlobs = eligibleBlobs.length;
    const cappedBlobs = eligibleBlobs.slice(0, maxFiles);
    const files = new Map<string, string>();

    // Fetch sample files from raw.githubusercontent.com
    await Promise.all(
      cappedBlobs.slice(0, 30).map(async (blob) => {
        const fileCacheKey = `raw:${owner}/${repo}:${targetRef}:${blob.path}`;
        const cachedContent = await this.cache.get<string>(fileCacheKey);
        if (cachedContent !== null) {
          files.set(blob.path, cachedContent);
          return;
        }

        try {
          const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${targetRef}/${blob.path}`);
          if (rawRes.ok) {
            const content = await rawRes.text();
            files.set(blob.path, content);
            await this.cache.set(fileCacheKey, content);
          }
        } catch {
          // Skip fetch failure
        }
      })
    );

    return {
      owner,
      repo,
      ref: targetRef,
      files,
      totalBlobs,
      ingestedBlobs: files.size,
      rateLimited
    };
  }
}
