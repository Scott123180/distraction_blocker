/**
 * Builds the extension for one or more browsers.
 *
 * Copies the shared source in src/ to dist/<browser>/ and writes a
 * manifest.json produced by merging manifests/base.json with
 * manifests/<browser>.json (browser-specific keys win).
 *
 * Usage: node scripts/build.mjs [chrome|firefox ...]   (default: all)
 * Output: dist/chrome/, dist/firefox/ (gitignored)
 */

import { readFileSync, writeFileSync, rmSync, cpSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const BROWSERS = ['chrome', 'firefox'];

const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

function merge(base, override) {
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
    out[key] = isObject(value) && isObject(base[key]) ? merge(base[key], value) : value;
  }
  return out;
}

export function manifestFor(browser) {
  return merge(readJson('manifests/base.json'), readJson(`manifests/${browser}.json`));
}

export function build(browser) {
  if (!BROWSERS.includes(browser)) {
    throw new Error(`Unknown browser "${browser}". Expected one of: ${BROWSERS.join(', ')}`);
  }
  const outDir = resolve(root, 'dist', browser);
  rmSync(outDir, { recursive: true, force: true });
  cpSync(resolve(root, 'src'), outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'manifest.json'), JSON.stringify(manifestFor(browser), null, 2) + '\n');
  console.log(`Built dist/${browser}/`);
  return outDir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const targets = process.argv.slice(2);
  (targets.length ? targets : BROWSERS).forEach(build);
}
