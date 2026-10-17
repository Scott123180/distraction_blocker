/**
 * Builds and packages the extension into versioned ZIPs ready for
 * Chrome Web Store / Firefox Add-ons (AMO) submission.
 *
 * Usage: npm run package [-- chrome|firefox ...]   (default: all)
 * Output: dist/distraction_blocker_<browser>_v<version>.zip (gitignored)
 */

import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { root, BROWSERS, build, manifestFor } from './build.mjs';

const targets = process.argv.slice(2);

for (const browser of targets.length ? targets : BROWSERS) {
  const outDir = build(browser);
  const { version } = manifestFor(browser);
  const outName = `distraction_blocker_${browser}_v${version}.zip`;
  const outFile = resolve(root, 'dist', outName);

  if (existsSync(outFile)) {
    unlinkSync(outFile);
  }

  execSync(`zip -qr "${outFile}" .`, { cwd: outDir, stdio: 'inherit' });
  console.log(`Packaged: dist/${outName}`);
}
