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

### From the Chrome Web Store
*(link coming soon)*

### Manual / Developer Install
1. Clone this repo
2. Go to `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `extension/` folder

## Development

Install dev dependencies (requires Node.js):

```bash
npm install
```

### Packaging for the Chrome Web Store

Bump the `version` field in `extension/manifest.json`, then run:

```bash
npm run package
```

This produces `distraction_blocker_v<version>.zip` in the project root, ready for upload.

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
