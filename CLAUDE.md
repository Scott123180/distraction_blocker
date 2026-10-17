# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-browser extension (Manifest V3) for Chrome/Chromium and Firefox that blocks distracting recommended content on social media and news sites. It does not block access to the sites themselves — it removes specific DOM elements like recommendation feeds, sidebars, and autoplay content.

## Project Structure

```
src/         ← shared extension source (JS, HTML, icons) used by every browser
manifests/   ← base.json (shared) + chrome.json / firefox.json (per-browser overrides)
scripts/     ← build/package + selector-checking scripts (tracked in git, never packaged)
dist/        ← build output (gitignored): dist/chrome/, dist/firefox/, and release ZIPs
package.json ← devDependencies only (Playwright); the extension has no npm deps
```

To install dev tools: `npm install`

## Building

The build is a plain copy plus manifest merge — no bundling or transpiling:
`scripts/build.mjs` copies `src/` to `dist/<browser>/` and writes `manifest.json` by
deep-merging `manifests/base.json` with `manifests/<browser>.json` (browser keys win).

- `npm run build` (or `build:chrome` / `build:firefox`) → `dist/<browser>/`
- `npm run package` (or `package:chrome` / `package:firefox`) → `dist/distraction_blocker_<browser>_v<version>.zip`

Re-run the build after editing anything in `src/` or `manifests/`. Never edit files in `dist/`.

Shared manifest fields (version, content scripts, match patterns) go in `manifests/base.json`.
Only put genuinely browser-specific keys in the per-browser files: Chrome uses `options_page`;
Firefox uses `options_ui` and `browser_specific_settings.gecko` (add-on ID, min version,
`data_collection_permissions`). The code uses the `chrome.*` namespace, which Firefox also supports
for MV3, so no polyfill is needed — keep it that way unless a Firefox-only API is required.

## Loading the Extension

- **Chrome:** `chrome://extensions/` → enable Developer mode → "Load unpacked" → select `dist/chrome/`
- **Firefox:** `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on…" → select `dist/firefox/manifest.json`

## Architecture

### Execution Flow

1. The built `manifest.json` (from `manifests/base.json`) injects `sites/youtube.js`, `sites/weather.js`, and `content.js` at `document_idle` on matched URLs.
2. Site-specific files (in `src/sites/`) define blocking functions in global scope before `content.js` runs.
3. `content.js` maps hostnames to blocking functions and config keys, checks `chrome.storage.sync` for whether each site is enabled, then calls the blocking function immediately and repeats it every 1 second via `setInterval` to handle SPA navigation.

## Selector Verification Scripts

When sites redesign and selectors break, use the scripts in `scripts/` to probe the live DOM:

- `check_selectors.mjs` — fast headless check of all known selectors across all sites (`npm run check`). Note: headless mode under-reports due to SPA rendering; use headed scripts to confirm.
- `verify_youtube.mjs` — headed browser, confirms all YouTube selectors with full render.
- `find_weather.mjs` / `find_weather2.mjs` — headed browser probes that dump Weather.com DOM structure for finding replacement selectors.
- `find_selectors.mjs` / `find_selectors2.mjs` — general headed probes for all other sites.

All scripts use Playwright with `channel: 'chrome'` (requires Chrome installed).

### Adding a New Site

1. Optionally create `src/sites/<site>.js` if the blocking logic is complex; otherwise add a function directly in `content.js`.
2. Add the hostname → function entry to `pageMap` in `content.js`.
3. Add the hostname → storage key entry to `blockConfigMap` in `content.js`.
4. Add the storage key + label to the `CONFIGS` array in `options.js`.
5. Add the URL pattern to `content_scripts.matches` in `manifests/base.json`.
6. If you created a new site file, add it to `content_scripts.js` in `manifests/base.json` (before `content.js`).
7. Run `npm run build` and test in both browsers.

### Per-Site Blocking Strategies

| Site | Strategy |
|------|----------|
| YouTube | Page-type detection via URL; removes feed, sidebar, shorts container, endscreen recommendations |
| Weather.com | Removes sidebar, content media blocks, non-alert messaging |
| Facebook | Removes `div[role='main']` |
| Reddit, Imgur, TikTok | Removes entire `<body>` |
| Instagram | Removes `<main>` and explore bar |

### Storage

Per-site on/off toggles are stored in `chrome.storage.sync` using keys like `blockYoutube`, `blockFacebook`, etc. The options page (`options.html` + `options.js`) renders checkboxes from the `CONFIGS` array and persists changes immediately on each `change` event.

## Known Issues / Caveats

- Facebook blocking breaks OAuth login flows on third-party sites that redirect through facebook.com (noted in `content.js`).
- The 1-second polling interval handles SPA page transitions but is a blunt approach; YouTube in particular requires it due to dynamic rendering.
- `removeElementIfExists` (in `youtube.js`) is a safe null-checked removal; the older `removeElement` (in `content.js`) will throw if the element is not found.
