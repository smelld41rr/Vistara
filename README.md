# Vistara — Theme World · Studio 2.1

Your code. Your corner of the universe.

A local-first Chrome Manifest V3 appearance extension with a new Theme Studio, twelve original illustrated scenes, uploaded wallpapers, glass workspaces and nine dedicated coding adapters. The previous YouTube/ChatGPT/Google/GitHub/Reddit/Wikipedia adapters remain available.

**Validation boundary:** coding support is implemented and tested on representative local browser fixtures. This environment's network proxy returns 403 for all nine live sites, and its managed Chromium blocks unpacked extensions. Native Chrome installation and live logged-in route compatibility are **not verified**. Do not treat included fixture captures as live website screenshots or store approval.

## Install without building

1. Extract `release/Vistara-Theme-World-v2.1.0.zip` into a new folder.
2. Open `chrome://extensions` in Chrome. Turn **Developer mode** on.
3. Choose **Load unpacked** and select the extracted folder containing `manifest.json`.
4. Alternatively, select this source project's root folder or its `dist/` folder. Both manifests are generated and validated.
5. Allow the desired site's access and reload website tabs. Click Vistara → **Open Theme Studio**.

If Windows creates nested folders, select the inner folder containing `manifest.json`. Do not select the ZIP. Keep the extracted folder on disk. Upgrading the same folder and pressing Reload retains extension storage; removing the extension normally removes its settings and local wallpaper database. Export settings before a deliberate uninstall; image files need their own backup.

The v2 source and prebuilt ZIPs are prepared for GitHub delivery at the user's request. GitHub source delivery does not imply deployment, Chrome Web Store submission, publication or live-site certification.

## ChatGPT — Liquid Glass (optional)

Open the popup → expand **ChatGPT — Liquid Glass** → enable the switch. The same controls are in Studio → **ChatGPT Liquid Glass**. The feature is off by default and applies only to the exact `chatgpt.com` hostname. The global master and per-site exclusions still win.

The reference-inspired skin adds a peach/lavender/pink/sky aurora, three decorative glass orbs, a frosted native sidebar and pill composer, and subtle styling for existing segments, dialogs and message shells. It does not add fake Chat/Work controls or replace ChatGPT's frontend. OFF now restores original ChatGPT instead of falling back to the older generic ChatGPT treatment. Coding-platform scenes and preferences stay independent.

Controls include glass intensity, panel/ambient blur, backdrop brightness, four pastel presets, sidebar/composer opacity, optional animation, reduced motion and reset. These settings are local and do not sync. Lower transparency-slider values mean lower glass opacity/more transparency. Background animation is off by default, pauses in hidden tabs and respects both OS and user reduced motion. Compatibility/simple settings use more solid panels with reduced effects. Browser chrome is not themed.

After updating the unpacked extension, press **Reload** at `chrome://extensions` and reload the ChatGPT tab once. Later preference changes apply live. Avoid uninstalling if you want to retain extension storage. See [Liquid Glass implementation and validation](docs/LIQUID_GLASS_REPORT.md) for actual fixture evidence and manual live QA limitations.

## The experience

- **Scene library:** 12 original vector landscapes across Anime, Nature, Space, Cyberpunk, Minimal, Royal, Gaming and Study, with search and favorites. These are original stylized vector scenes, not licensed anime characters or third-party wallpapers.
- **Live Studio:** responsive gallery, local problem/editor/testcase preview and a nine-platform preview selector. This is a safe demo, not tab contents. Preview Run is simulated and labeled accordingly.
- **Make it yours:** five palettes, Auto/Dark/Light glass, blur/opacity/radius/borders/shadows/saturation, accent, scene visibility/brightness and image fit/position. Named atmospheres save Studio and appearance choices. Rename/duplicate/delete them in Advanced settings → My presets.
- **Uploaded wallpapers:** PNG/JPEG/WebP up to 12 MB; locally decoded and resized to at most 1920×1200, optimized to JPEG under 1.5 MB, stored in extension-origin IndexedDB. Maximum 20. SVG/animated formats are not accepted. Cover/contain and top/center/bottom placement are supported; a freeform crop editor is not included.
- **Focus:** hide adapter-recognized recommendations/sidebars while keeping problem/editor/Run/Submit controls. Toggle in Studio/popup or use **Alt+Shift+V**; customize at `chrome://extensions/shortcuts`.
- **Difficulty scenes:** explicit Easy/Medium/Hard labels select assigned scenes where recognized. No ratings/difficulty are invented. A custom uploaded wallpaper takes precedence over difficulty scenes.
- **Moments:** opt-in, dismissible Accepted/AC celebration when a recognized result changes. Sound is a short local Web Audio chime, off by default, and requires a page interaction/browser audio permission. Reduced-motion behavior is respected. Only available public difficulty/verdict labels are inspected; editor contents are not read.
- **Share a little win:** enter problem/platform/difficulty/language/runtime/name yourself and export a 1200×675 PNG. Metadata is not scraped or verified. Nothing is posted or sent automatically.
- **Advanced settings:** exact/parent site rules, exclusions, per-site appearance, accessibility, local/sync preference handling, validated JSON import/export and explicit reset actions. JSON includes local wallpaper IDs, not image bytes; missing local images fall back to scene art.

## Nine coding adapters

LeetCode (including leetcode.cn), HackerRank, GeeksforGeeks, Codeforces, CodeChef, AtCoder, Code360, InterviewBit and Coderbyte have separate route/selector definitions in `src/adapters/coding.ts`. Code360 is path-scoped under `/code360`, `/codestudio` or `/studio`; unrelated naukri.com pages stay generic. Adapter markup can change and requires maintenance.

Selected workspace shells become transparent; selected nav/problem/test panels receive readable glass surfaces; the **body paints the wallpaper**, rather than hiding it behind an opaque body with a negative-z-index overlay. No page node replacement, editor API interception, form-value changes or code-submission interception is used. Layout positioning/scroll dimensions are retained. Known editors get distinct surface treatment; syntax token colors and Monaco/Ace/CodeMirror font metrics stay native. The font-size control affects the Studio preview and recognized plain-text editors, not those native engines. Arbitrary syntax-palette editing is not implemented.

Popup status distinguishes detected panels/editors from a compatibility fallback with no recognized workspace panels. Unknown routes are not claimed as fully supported. Compatibility mode removes page backgrounds and blur. Global disable, exclusions and page opt-out win; disabling restores original variables/attributes and removes engine observers and visual effects. Only **visible** password/card fields trigger form-based safety pause, so dormant hidden login forms no longer disable every coding page. Actual auth/payment URL protection remains.

## Development and checks

Use Node.js 22/24 LTS:

```sh
npm ci
npm run build
npm run lint
npm test
npm run test:contrast
npm run test:browser
npm run test:coding
npm run test:liquid
npm run package
```

`npm run dev` watches JavaScript; rerun build for HTML/CSS/manifest changes, reload the extension and website tabs. Use `--cache /tmp/vistara-npm` with npm in restricted environments where its default cache is unavailable. Set `CHROMIUM_PATH` for browser tests if Chromium is not at `/usr/bin/chromium`.

- `npm test`: schema/migration, security, host/route matching, site precedence, storage fallback, connection recovery, Studio scenes/presets and root/dist package checks.
- `test:browser`: previous general-site/popup/options regression fixtures.
- `test:coding`: real Chromium renders of compiled Studio, content and background bundles with simulated Chrome APIs. Checks all nine structural fixtures, image storage/delivery, focus command, difficulty updates, saved looks, moments, PNG export and responsive UI.
- `test:contrast`: exact author-style restoration and conservative fallback contrast.
- `package`: refreshes build, produces versioned and convenient unversioned source/extension ZIPs, verifies every archive entry and writes SHA256 checksums. It never pushes or publishes. Run checks before packaging.

See [current test evidence](docs/V2_BUILD_REPORT.md), [original audit](docs/CODING_AUDIT_BASELINE.md) and [release checklist](docs/RELEASE_CHECKLIST.md).

## Structure

```text
src/studio/        new scene gallery, local images, preview, focus and share UI
src/adapters/      nine coding + six general adapters and generic fallback
src/content/       reversible rendering, coverage status, scoped coding CSS, moments
src/background/    local image delivery and focus keyboard command
src/shared/        schema, storage, IndexedDB, scenes, DOM controls, connection recovery
src/popup/         quick controls, scene shortcuts, current-site status
src/options/       advanced preferences, rules, presets, import/export
scripts/           reproducible local ZIP packaging
public/            original icons and asset provenance
dist/              bundled installable extension; no Node/runtime dependencies
tests/             unit, package and compiled-bundle browser tests
screenshots/       real local-fixture/UI captures with provenance
release/           source/extension ZIPs and checksums
```

## Privacy and limits

No backend, accounts, analytics, remote fonts, remote code or runtime network requests. Preferences use Chrome Sync/local; uploaded images stay in extension IndexedDB. `storage` saves preferences; `activeTab` identifies the user-invoked tab; `scripting` recovers a missing packaged content script in that tab using the activeTab grant. Static HTTP/HTTPS matches enable appearance changes and explain Chrome's site-access warning. The packaged worker serves local assets and handles the declared command. No cookies/history/clipboard/webRequest/tabs permission is used. See [PRIVACY.md](PRIVACY.md).

Chrome UI, internal pages, Web Store, PDF viewer, inaccessible frames and closed shadow roots cannot be styled. Only top-level HTTP/HTTPS documents are targeted. Editor/viewer iframe and shadow-root integrations are not claimed. Audio/autoplay, CSP and permissions can restrict effects. Authenticated submissions, contests, streaming and real third-party editor behavior still require live/native QA. Sound/title-card packs, automatic verified submission share metadata, freeform image cropping, arbitrary native syntax palette editing, Firefox, accounts and premium payments are outside this local build.

Official documentation: [content scripts](https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts), [permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions), [storage](https://developer.chrome.com/docs/extensions/reference/api/storage), [scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting), [local installation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world).
