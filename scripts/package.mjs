/**
 * Packages the extension/ directory into a versioned ZIP ready for
 * Chrome Web Store submission.
 *
 * Usage: npm run package
 * Output: distraction_blocker_v<version>.zip (gitignored)
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(root, 'extension/manifest.json'), 'utf8'));
const version = manifest.version;
const outFile = resolve(root, `distraction_blocker_v${version}.zip`);

if (existsSync(outFile)) {
  unlinkSync(outFile);
  console.log(`Removed existing ${outFile}`);
}

execSync(`zip -r "${outFile}" .`, { cwd: resolve(root, 'extension'), stdio: 'inherit' });

console.log(`\nPackaged: distraction_blocker_v${version}.zip`);
