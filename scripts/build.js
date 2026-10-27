import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'public');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

fs.copyFileSync(path.join(ROOT_DIR, 'web', 'index.html'), path.join(OUT_DIR, 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'web', 'styles.css'), path.join(OUT_DIR, 'styles.css'));

fs.writeFileSync(path.join(OUT_DIR, 'CNAME'), 'gitxray.shivm.co\n', 'utf-8');
fs.writeFileSync(path.join(OUT_DIR, '.nojekyll'), '', 'utf-8');

execSync(`npx esbuild "${path.join(ROOT_DIR, 'web', 'app.js')}" --bundle --minify --format=esm --outfile="${path.join(OUT_DIR, 'app.js')}"`, {
  stdio: 'inherit'
});

console.log('Build complete: static deployment bundle generated in public/');
