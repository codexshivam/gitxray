import { IngestionCache } from './cache.js';
export class GitHubIngestion {
    cache = new IngestionCache();
    isIgnored(path) {
        const lower = path.toLowerCase();
        return (lower.includes('node_modules/') ||
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
            lower.endsWith('.gz'));
    }
    async fetchRepo(owner, repo, ref, options = {}) {
        const maxFiles = options.maxFiles || 2000;
        const maxFileSizeKb = options.maxFileSizeKb || 500;
        let targetRef = ref || 'main';
        let rateLimited = false;
        // Resolve default branch if not specified
        if (!ref) {
            const metaKey = `repo-meta:${owner}/${repo}`;
            const cachedMeta = await this.cache.get(metaKey);
            if (cachedMeta) {
                targetRef = cachedMeta.default_branch;
            }
            else {
                const headers = {
                    'Accept': 'application/vnd.github.v3+json'
                };
                if (options.token)
                    headers['Authorization'] = `Bearer ${options.token}`;
                const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
                if (metaRes.status === 403) {
                    rateLimited = true;
                    targetRef = 'main';
                }
                else if (metaRes.ok) {
                    const metaData = await metaRes.json();
                    targetRef = metaData.default_branch || 'main';
                    await this.cache.set(metaKey, { default_branch: targetRef });
                }
                else {
                    targetRef = 'main';
                }
            }
        }
        const cacheKey = `repo-tree:${owner}/${repo}:${targetRef}`;
        // Fetch or read tree
        let treeItems = await this.cache.get(cacheKey);
        if (!treeItems && !rateLimited) {
            const headers = {
                'Accept': 'application/vnd.github.v3+json'
            };
            if (options.token)
                headers['Authorization'] = `Bearer ${options.token}`;
            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${targetRef}?recursive=1`, { headers });
            if (treeRes.status === 403) {
                rateLimited = true;
            }
            else if (treeRes.ok) {
                const treeData = await treeRes.json();
                treeItems = treeData.tree;
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
        const files = new Map();
        // Fetch sample files from raw.githubusercontent.com
        await Promise.all(cappedBlobs.slice(0, 30).map(async (blob) => {
            const fileCacheKey = `raw:${owner}/${repo}:${targetRef}:${blob.path}`;
            const cachedContent = await this.cache.get(fileCacheKey);
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
            }
            catch {
                // Skip fetch failure
            }
        }));
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
//# sourceMappingURL=github.js.map