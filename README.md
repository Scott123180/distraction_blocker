# Distraction Blocker

Blocks recommended content on social media sites to avoid the gamification triggers and stops you from wasting time.

## Supported Sites

| Site | Status |
|------|--------|
| YouTube | beta |
| Facebook | alpha |
| Reddit | alpha |
| Imgur | alpha |
| TikTok | alpha |
| Instagram | alpha |
| Weather.com | alpha |

Each site can be toggled on/off individually from the extension's options page.

## Installation

### From the Chrome Web Store / Firefox Add-ons
*(links coming soon)*

### Manual / Developer Install
1. Clone this repo, then run `npm install` and `npm run build`
2. **Chrome:** go to `chrome://extensions/`, enable **Developer mode**, click **Load unpacked** and select `dist/chrome/`
3. **Firefox:** go to `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…** and select `dist/firefox/manifest.json`

## Development

Install dev dependencies (requires Node.js):

```bash
npm install
```

### Project layout

- `src/` — extension source shared by all browsers
- `manifests/` — `base.json` holds the shared manifest; `chrome.json` and `firefox.json` hold browser-specific overrides
- `dist/` — build output (gitignored)

### Building

```bash
npm run build            # both browsers → dist/chrome/ and dist/firefox/
npm run build:chrome     # or just one
npm run build:firefox
```

Re-run the build after changing anything in `src/` or `manifests/`, then reload the extension.

### Packaging for the Chrome Web Store / Firefox Add-ons

Bump the `version` field in `manifests/base.json`, then run:

```bash
npm run package          # or package:chrome / package:firefox
```

This produces `dist/distraction_blocker_<browser>_v<version>.zip`, ready for upload.

### Checking selectors

Sites change their DOM over time. To verify all selectors still work against live pages:

```bash
npm run check
```

For a more thorough headed-browser check (opens Chrome), use the scripts in `scripts/`.

## Report Issues

Sites are always changing. Please report broken functionality at https://github.com/Scott123180/distraction_blocker/issues

---

<a href="https://www.flaticon.com/free-icons/no-noise" title="no noise icons">No noise icons created by syafii5758 - Flaticon</a>
