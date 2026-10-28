export interface ParsedRepo {
  owner: string;
  repo: string;
  ref?: string;
}

/**
 * Extracts owner and repo from various input formats:
 * - "facebook/react"
 * - "https://github.com/facebook/react"
 * - "gitxray.dev/facebook/react"
 * - "github.com/facebook/react.git"
 * - "https://github.com/facebook/react/tree/main"
 */
export function parseRepoInput(input: string): ParsedRepo | null {
  if (!input) return null;
  const trimmed = input.trim().replace(/\.git$/, '');

  // Extract from full URL
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:github\.com|gitxray\.dev|gitxray\.shivm\.co)\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/tree\/([a-zA-Z0-9_.-]+))?/
  );
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2],
      ref: urlMatch[3]
    };
  }

  // Extract from "owner/repo" or "owner/repo@ref"
  const shorthandMatch = trimmed.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:@([a-zA-Z0-9_.-]+))?$/);
  if (shorthandMatch) {
    return {
      owner: shorthandMatch[1],
      repo: shorthandMatch[2],
      ref: shorthandMatch[3]
    };
  }

  return null;
}

/**
 * Gets repo from current browser URL:
 * Supports:
 * - pathname: /:owner/:repo
 * - query: ?repo=owner/repo
 * - hash: #/:owner/:repo
 */
export function getRepoFromBrowserUrl(): ParsedRepo | null {
  if (typeof window === 'undefined') return null;

  // 1. Check query parameter ?repo=owner/repo
  const params = new URLSearchParams(window.location.search);
  const repoParam = params.get('repo');
  if (repoParam) {
    const parsed = parseRepoInput(repoParam);
    if (parsed) return parsed;
  }

  // 2. Check hash route #/owner/repo
  if (window.location.hash) {
    const hashRoute = window.location.hash.replace(/^#\/?/, '');
    const parsed = parseRepoInput(hashRoute);
    if (parsed) return parsed;
  }

  // 3. Check pathname /owner/repo
  const pathname = window.location.pathname.replace(/^\//, '');
  if (pathname && pathname !== 'index.html') {
    const segments = pathname.split('/');
    if (segments.length >= 2 && segments[0] && segments[1]) {
      return {
        owner: segments[0],
        repo: segments[1],
        ref: segments[2]
      };
    }
  }

  return null;
}

/**
 * Updates browser URL without page reload
 */
export function setBrowserRepo(owner: string, repo: string, ref?: string) {
  if (typeof window === 'undefined') return;
  const path = ref ? `/${owner}/${repo}/tree/${ref}` : `/${owner}/${repo}`;
  window.history.pushState({ owner, repo, ref }, '', path);
}

/**
 * Resets browser URL to root
 */
export function clearBrowserRepo() {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', '/');
}
