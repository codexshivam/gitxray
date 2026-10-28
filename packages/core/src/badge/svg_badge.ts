export interface BadgeData {
  owner: string;
  repo: string;
  fileCount: number;
  stageCount: number;
  coreKernel?: string;
  score?: number;
}

export class SvgBadgeGenerator {
  public static generateBadge(data: BadgeData): string {
    const kernel = data.coreKernel ? data.coreKernel.split('/').pop() || data.coreKernel : 'core';
    const leftText = 'gitxray';
    const rightText = `${data.fileCount} files • S${data.stageCount} • ${kernel}`;

    // Clean SVG with shields.io-compatible styling and modern gradient flair
    return `<svg xmlns="http://www.w3.org/2000/svg" width="310" height="28" viewBox="0 0 310 28" role="img" aria-label="GitXray Architecture">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
  </defs>
  <rect width="310" height="28" rx="6" fill="url(#bg)" stroke="#334155" stroke-width="1" />
  
  <!-- Left Brand Pill -->
  <rect x="1" y="1" width="70" height="26" rx="5" fill="#1e293b" />
  <circle cx="14" cy="14" r="4" fill="url(#accent)" />
  <text x="24" y="17" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="0.5">${leftText}</text>
  
  <!-- Right Metric Stats -->
  <text x="82" y="17" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="500">
    <tspan fill="#f1f5f9" font-weight="600">${data.fileCount}</tspan> files <tspan fill="#64748b">•</tspan> 
    <tspan fill="#34d399" font-weight="600">${data.stageCount}</tspan> stages <tspan fill="#64748b">•</tspan> 
    <tspan fill="#38bdf8" font-family="monospace" font-size="10">${kernel}</tspan>
  </text>
</svg>`;
  }
}
