# ChatGPT — Liquid Glass · Vistara 2.1.0

Implemented as an optional feature in the existing extension, not a duplicate extension or replacement ChatGPT client. This update is local/uncommitted; **no push, deployment or publication was performed**. The previously published v2.0 source is not changed on GitHub by this task.

## Reference interpretation and implementation

The supplied screenshot's webpage portion inspired the warm ivory/peach centre, lavender/sky edges, large partial iridescent orbs, soft white strokes, frosted sidebar and floating pill composer. Chrome's toolbar/tab/bookmarks are outside extension webpage styling scope. No third-party artwork, private screenshots, external fonts or remote assets were copied into the product.

CSS gradients draw the ambience. Three inert, aria-hidden edge decorations sit in a fixed viewport layer with pointer-events disabled; root/body/known app shells are layered so opaque page backgrounds do not hide it. No foreground content is filtered or blurred. Only selected sidebar/composer/segment/dialog surfaces use backdrop blur. Slow optional movement is CSS-only, off by default, paused on page visibility changes and disabled by user/system reduced motion. High-contrast/forced-colors/no-backdrop-filter fallbacks are included.

Existing native regions receive reversible markers. Layout widths/heights, message ordering, scrolling, form values and event handlers are not rewritten. Sidebar and composer keep their host layout; the fixture composer width/height matched its original geometry. Existing Chat/Work controls are styled only when found, never created. Message/code/table styling is scoped; pre-existing code-block contrast is captured before theme variables change, syntax colors remain author-controlled, and dark-prose tokens are mapped to readable text on the pastel page.

## Exact scope and OFF behavior

- Only HTTP(S) URLs whose hostname equals `chatgpt.com` qualify for this theme. Subdomains and similarly named hosts do not.
- `settings.chatgpt` stores independent, strictly validated local preferences. Existing v2 settings get disabled defaults without changing coding settings. It is omitted from the shared Sync payload.
- The global master, per-site OFF/exclusions, page opt-out and sensitive-flow protection still take precedence.
- On the exact ChatGPT host, the optional theme being OFF means original appearance, not the legacy generic ChatGPT palette. This is an intentional migration in behavior.
- OFF removes decorative nodes, stylesheet, root flags, panel markers, custom properties, observer, timers and media/visibility listeners. Original attributes/custom properties and their `!important` priorities are restored.
- Native authentication, requests, upload, voice, chat submission and streaming are not implemented or intercepted by this feature. No conversation/input values are read by the extension. The functional fixture provides its own mock native handlers solely for tests.

## Controls

Popup → ChatGPT — Liquid Glass, or Studio → ChatGPT Liquid Glass:

| Control               | Range/behavior                                                           |
| --------------------- | ------------------------------------------------------------------------ |
| Enable                | Optional, OFF by default; ChatGPT only                                   |
| Glass intensity       | 0–100%, edge/shadow/orb strength                                         |
| Background blur       | 4–36px, selected surface frost and gradient softness; default 30px       |
| Background brightness | 75–120%, decorative layer only                                           |
| Pastel preset         | Peach Aurora, Lavender Mist, Sky Pearl, Rose Quartz                      |
| Sidebar opacity       | 12–85%; lower is more transparent                                        |
| Composer opacity      | 20–90%; lower is more transparent                                        |
| Animation             | CSS ambient drift, OFF by default                                        |
| Reduce motion         | Stops decorative movement/transitions; OS preference always wins         |
| Reset                 | Appearance defaults while preserving the current enabled/disabled choice |

## Modified files

| Files                                            | Change                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `src/shared/liquid.ts` (new)                     | Preferences/defaults/pastel presets, validation and strict hostname eligibility      |
| `src/shared/liquid-controls.ts` (new)            | Shared real popup/Studio controls and private local demo                             |
| `src/shared/css.d.ts` (new)                      | Typed CSS text import                                                                |
| `src/shared/settings.ts`                         | Additive local preference migration and import validation                            |
| `src/shared/ui.css`                              | Styling for the control section and local preview                                    |
| `src/content/liquid/liquid.ts` (new)             | Theme lifecycle, bounded discovery, owned markers/properties, background and cleanup |
| `src/content/liquid/liquid.css` (new)            | Scoped pastel material, background/orbs, native surface/prose and accessibility CSS  |
| `src/content/engine.ts`                          | ChatGPT-only delegation, OFF gating and status/coverage integration                  |
| `src/popup/index.html`, `src/popup/popup.ts`     | Optional section, automatically expanded on ChatGPT                                  |
| `src/studio/index.html`, `src/studio/studio.ts`  | Shared ChatGPT configuration view/navigation                                         |
| `src/options/index.html`                         | Display version update                                                               |
| `esbuild.config.mjs`                             | Bundle local CSS as text; no remote CSS/runtime                                      |
| `package.json`, `package-lock.json`, manifests   | Version 2.1.0 and test command; permission set unchanged                             |
| `tests/liquid.test.ts`, `tests/liquid.mjs` (new) | Schema/isolation/migration and rendered functional fixtures                          |
| `tests/browser.mjs`                              | Explicit opt-in for revised ChatGPT behavior and stable sidebar fixture marker       |
| `tests/package.test.ts`, `tests/coding.mjs`      | Current package version checks/result version metadata                               |
| `dist/`, `release/`, `screenshots/`, docs        | Generated local deliverables and evidence                                            |

No coding-adapter definitions, coding-style rules or editor integration were changed for this theme.

## Tests actually run

- `npm run build`: passed, manifest entrypoints and all packaged assets present.
- `npm run lint`: passed, strict TypeScript.
- `npm test`: **35 passed**, zero failed/skipped. Includes optional migration, strict exact-host isolation, invalid-value protection and local JSON round-trip.
- `npm run test:contrast`: passed, generic fallback contrast and exact author-style restoration.
- `npm run test:browser`: **20 passed**, previous general-site/popup/options regression scenarios with explicit Liquid Glass opt-in for ChatGPT.
- `npm run test:coding`: **21 passed**, previous nine coding adapters/Studio/image/focus/share flows unchanged.
- `npm run test:liquid`: **15 passed**, no uncaught errors in the tested flows. Covers default OFF, actual compiled-content toggle, full viewport layer/pointer behavior, unchanged composer geometry, live controls/local persistence, multiline send/streamed fixture response, menus/file chooser/microphone state/Chat-Work fixture handlers, sidebar/history/SPA, reduced motion, exact OFF restoration, Studio controls, page refresh, responsive sizes, coding/subdomain isolation, global/per-host OFF precedence and visible-auth safety pause.

These browser suites execute the real compiled extension bundles in Chromium with simulated Chrome APIs and local representative pages. They are not a successful native MV3 install test or authenticated ChatGPT session. Microphone/voice-state fixture checks do **not** verify actual recording, audio, account work mode or ChatGPT server behavior.

## Visual comparison and screenshot provenance

All `screenshots/liquid/*.png` files are actual Chromium captures of the compiled theme on a local, clearly labeled functional fixture. They are not live ChatGPT screenshots. The fixture's existing layout/control structure was chosen to compare the supplied webpage design direction without fetching private content.

- `home-peach-1672.png`: desktop comparison at the supplied image width; pastel body, sidebar, pill composer and three edge forms.
- `conversation-peach.png`: native-like conversation layout, messages, code and table preservation.
- `home-1920.png`, `home-1366.png`, `home-390.png`: wide/laptop/mobile render checks.
- `popup-controls.png`: actual compiled popup configuration UI.

Differences from the reference: no themed browser chrome, no fabricated native Work/Plugins capabilities, fixture icons/account/history rather than real user data, conservative geometry that follows the host layout rather than forcing fixed desktop sidebar/composer dimensions. Real ChatGPT markup may differ and selectors may need maintenance. No pixel-perfect/live-match claim is made.

## Permissions, privacy and performance

Manifest V3 and the existing `storage`, `activeTab`, `scripting` permissions remain unchanged. No history/cookies/tabs/clipboard/network interception or new destination is added. No remote assets or runtime fetches are introduced. Code reads selectors/computed colors, not messages or input values. The theme observer batches added subtrees over 90ms, queues at most 32 roots and tracks at most 240 regions; it does not poll the document, observe streaming character data or run a JavaScript animation loop. Production CPU/GPU/memory and assistive-technology audits have not been measured or certified.

## Remaining manual checks

The managed Chromium environment still blocks unpacked extensions (`ExtensionInstallBlocklist: ["*"]`), and no authenticated user ChatGPT session is available. Required before claiming release readiness:

1. Native Chrome MV3 install/update and real permission revocation/recovery.
2. Actual ChatGPT homepage/current conversation DOM and long chat scrolling.
3. Real message send/stop/streaming, uploads/previews, voice/microphone, model/effort controls, Work mode if available, account settings/auth dialogs and browser shortcuts.
4. Native sidebar variants/mobile drawer, generated markup changes and app portals.
5. Real browser restart persistence, performance on representative hardware, WCAG contrast/keyboard/screen-reader/200% zoom and OS forced colors. Extreme user brightness/transparency choices can alter contrast; use high contrast/simple appearance where needed.

## Reload and use

For an existing unpacked extension, update its selected folder with the generated package contents, open `chrome://extensions`, press its **Reload** button, then reload the ChatGPT tab once. Avoid uninstalling just to update if settings/wallpapers should be retained. Fresh installs may select the extracted extension ZIP folder containing `manifest.json`, source root or `dist/`.

Open Vistara popup → expand **ChatGPT — Liquid Glass** → enable it. Keep global and current-site switches ON. Settings update live after a short debounced save; a page reload is not required for normal theme changes. Disable the Liquid Glass switch to restore the original page. Appearance reset does not change the enable switch. Studio has identical controls under its ChatGPT tab.

No GitHub push, deployment or publication was performed for 2.1.0.
