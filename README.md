# Vistara — Theme World

A calmer web, through glass. An offline-first Manifest V3 Chrome extension inspired by the supplied GlassFlow specification and visual guide, branded for Vistara.

## Get started in 60 seconds

1. Use Node.js 22 or 24 LTS. In this repository run `npm install` and `npm run build` (or use the included built `dist/`).
2. Open `chrome://extensions` in Google Chrome. Enable **Developer mode**.
3. Choose **Load unpacked**, then select the **dist** folder, not the repository root or ZIP file.
4. Reload an ordinary website, pin Vistara using Chrome's Extensions menu, and open its popup.
5. Pick a theme. Try the sliders or Before / After. Open **Make it yours** for website rules and advanced settings.

For the ZIP, extract it first; the manifest sits at the extracted folder's root. Load that extracted folder. Never select the ZIP directly. Enterprise-managed browsers may forbid unpacked extensions; that requires the browser administrator's policy change.

## What you get

Five local palettes: Midnight, Aurora, Arctic, Orchid, Pixel Realm. Balanced mode styles selected navigation/card surfaces; Immersive also admits adapter-supported dialog shells; Compatibility omits card/dialog treatment and backdrop blur. Media pixels, code content, form values, event handlers and page structure are preserved.

The popup has a global switch, locally generated preview, theme picker, blur/opacity/radius/ambient sliders, modes, active-host toggle, temporary before/after and appearance reset. Before/after is tab-local and lasts until the page reloads; it never changes saved settings. Active site overrides can intentionally differ from global controls—edit or remove them in Website rules if global changes appear ineffective.

Options include seven adjustable effects, ambient/contrast settings, exact-host and parent-domain rules, searchable site lists, exclusions, named presets, export/import, accessibility controls and troubleshooting. Exclusions always win. Within overrides, exact host beats the longest parent-domain match, then global defaults apply. Global OFF and unsupported URLs always win. Site OFF is respected; a narrower explicit exact-host rule may intentionally override a broader parent-domain rule. Hostname boundaries prevent `notexample.com` matching `example.com`.

Vistara automatically pauses detected sensitive flows (password/card inputs; common authentication, payment, medical and government URLs). This is conservative detection, not a guarantee that every sensitive website is identified. Disable a troublesome site in the popup or add it to exclusions. Website authors can opt out with `<meta name="vistara" content="off">` or a `data-vistara-optout` attribute on `<html>`.

## Project layout

```text
src/
  shared/       schema, migrations, hostname matching, storage, shared UI
  adapters/     six versioned site adapters + generic fallback
  content/      scoped CSS, reversible engine, storage/navigation messaging
  popup/        compact control centre
  options/      responsive advanced settings
public/icons/   original generated PNG assets (16/32/48/128)
tests/          unit suite and Chromium bundle-integration harness
screenshots/    actual browser captures of local fixtures and product UI
docs/           specification review, test evidence, release checklist
dist/           self-contained installable extension
```

## Developer workflow

```sh
npm install
npm run dev          # JS watch; reload extension after edits
npm run build        # bundle, copy static assets, check manifest paths
npm run lint         # strict TypeScript validation
npm test             # settings, validation, matching, precedence, migrations
npm run test:browser # compiled bundles in a real Chromium fixture harness
npm run test:contrast # adaptive contrast and exact author-style restoration
```

The lockfile is included; use `npm ci` for reproducible installation. If your environment disallows the default npm cache, use `npm ci --cache /tmp/vistara-npm`. Browser tests use `/usr/bin/chromium`; adjust `CHROMIUM_PATH` if necessary. The dev watcher rebuilds JavaScript; rerun `npm run build` after editing HTML, CSS, manifest or assets. Reload Vistara on `chrome://extensions`, then reload already-open websites to refresh content scripts after code updates.

For browser tests, the installed Chromium's administrator policy blocks unpacked extensions. The harness uses the **built** JavaScript in real Chromium pages with simulated storage/tab APIs. It validates application logic and rendering, not actual installation, Chrome permission enforcement, or live-site compatibility. See [test evidence](docs/TEST_RESULTS.md) and [release checklist](docs/RELEASE_CHECKLIST.md).

## Permissions and privacy

`storage` saves preferences; `activeTab` identifies the selected host when the popup is invoked and supports tab-local commands. HTTP/HTTPS content-script matches provide styling access to eligible pages. Chrome displays broad site-access wording because styling requires DOM access. No `tabs`, scripting, history, cookie, clipboard or request-interception permissions are requested. No page text or form values are collected. Everything runs locally, and settings may use your browser's own Chrome Sync. See [PRIVACY.md](PRIVACY.md).

Chrome's tab strip, toolbar, address bar, native dialogs, `chrome://` pages, Web Store, browser PDF viewer, closed shadow roots and inaccessible frames cannot be styled. Only top-level HTTP/HTTPS documents are targeted. Native website styles, site updates, CSP behavior and third-party widgets can limit coverage. A universal visual tool cannot promise identical pixels on arbitrary websites.

## Design tokens and performance

The engine sets `--gf-blur` (4–32px), `--gf-opacity` (.20–.90), `--gf-radius` (8–28px), `--gf-border-alpha`, `--gf-shadow-strength`, `--gf-accent`, `--gf-saturation`, `--gf-bg-intensity`, `--gf-base`, `--gf-text`, and `--gf-muted`. Defaults are 16px / .52 / 16px. Palettes are defined in `shared/settings.ts`. Adapter-specific CSS supplies YouTube and ChatGPT theme variables without touching media or syntax colors. Other adapters keep existing text colors and choose a compatible light or dark surface for conservative treatment; theme coverage is consequently less complete.

At most 160 non-nested surfaces are tracked per page. Added DOM subtrees are coalesced over 100ms with up to 32 pending roots. Attribute changes do not trigger the observer. Disable removes styles, tags, temporary root variables, timers and the engine's mutation observer. There are no page animation loops. Performance targets for release: no extension-caused layout shifts; batched scans generally under a 16ms frame on representative hardware; stable surface counts under infinite scroll. These are targets, not measured guarantees. Choose Compatibility for expensive sites. `VISTARA_STATUS` reports accumulated discovery time for diagnosis.

## Troubleshooting

- **Not available on this page:** Chrome protects this URL, or it isn't HTTP/HTTPS.
- **Page access unavailable:** allow the site under the extension's “This can read and change site data” menu, then reload the page. Initial installation does not inject into tabs that were already loaded.
- **Theme looks unchanged:** inspect exact/parent site overrides and exclusions. The generic fallback deliberately styles very few surfaces.
- **Poor contrast or slow scrolling:** choose Compatibility, lower blur, use solid contrast surfaces, or turn off that website. Some author-defined colors remain intentionally untouched.
- **Sync warning:** the local copy was saved; Chrome Sync is unavailable or quota-limited. Retry later. JSON export provides an independent backup.
- **Unsupported stored version:** the original local settings are retained as `migrationBackup`. Export/recover deliberately; don't silently overwrite newer settings.
- **A website changed:** adapters may need selector updates. Report hostname, route, theme, mode and the exact symptom without including private page contents.

## Distribution

The ZIP is an unpacked distribution, not a signed CRX. No store submission or publication was performed. Review the manual QA matrix, privacy disclosures, permission justification, trademark-neutral screenshots and Chrome Web Store requirements before submitting.

Official Chrome references: [content scripts](https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts), [permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions), [storage](https://developer.chrome.com/docs/extensions/reference/api/storage), [scripting API background reference](https://developer.chrome.com/docs/extensions/reference/api/scripting), [local installation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world).
