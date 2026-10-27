export class BadgeGenerator {
  static generateBadgeSvg({ repo = 'gitxray/gitxray', nodes = 42, score = '98%', status = 'decompiled' } = {}) {
    const leftText = `GitXray`;
    const rightText = `${nodes} nodes | ${score}`;

    const width = 210;
    const height = 28;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${leftText}: ${rightText}">
  <title>${leftText}: ${rightText}</title>
  <linearGradient id="g" x2="0" y2="100%">
    <stop offset="0" stop-color="#0e1726" stop-opacity=".9"/>
    <stop offset="1" stop-color="#050811" stop-opacity=".95"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${width}" height="${height}" rx="6" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="68" height="${height}" fill="#0f172a"/>
    <rect x="68" width="${width - 68}" height="${height}" fill="#059669"/>
    <rect width="${width}" height="${height}" fill="url(#g)" opacity="0.15"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-weight="600" font-size="11">
    <text x="34" y="18" fill="#38bdf8">⚛ X-Ray</text>
    <text x="139" y="18" fill="#ffffff">${rightText}</text>
  </g>
</svg>`;
  }

  static getBadgeMarkdown(repo) {
    const badgeUrl = `https://gitxray.dev/api/badge/${repo}.svg`;
    const targetUrl = `https://gitxray.dev/${repo}`;
    return `[![GitXray Architecture](${badgeUrl})](${targetUrl})`;
  }
}
