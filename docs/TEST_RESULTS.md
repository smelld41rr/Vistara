# Validation evidence and feature status

## Automated checks

- `npm install --cache /tmp/vistara-npm --no-audit --no-fund`: dependencies installed with a local writable cache. The machine's default npm cache directory was unavailable; no verification was disabled.
- `npm run build`: passed. esbuild emits three local JavaScript bundles, copies HTML/CSS/icons/manifest and verifies manifest entrypoint paths.
- `npm run lint`: passed, strict TypeScript checking.
- `npm test`: **15 tests passed**, zero failed/skipped. Covers schema normalization, dangerous keys, size/enum/range validation, hostname boundaries, protected pages, exact/parent/default precedence, OFF/exclusions, accessibility precedence, legacy migration, adapter selection, fresh-device Sync, newer local fallback after quota failure, local-rule preservation and backup of unsupported settings.
- `npm run test:browser`: **19 browser scenarios passed**, zero uncaught page exceptions in the tested flows. Results are recorded in `browser-results.json` with browser version and timestamp.

The browser suite runs the **compiled distribution JavaScript** in real Chromium pages, using local representative website fixtures and simulated Chrome storage/tab APIs. It is a bundle-integration suite, not a successfully installed MV3 extension test. Attempting native installation revealed the machine's administrative `ExtensionInstallBlocklist: ["*"]`; the CDP loader explicitly reported that loading unpacked extensions is disabled by the administrator. That policy was left intact.

The suite exercises actual rendered DOM, forms/buttons, effect cleanup/re-enable, theme and slider persistence after options reload, Compatibility styling, code preservation, SPA routes, per-host rules across reloads, dynamic DOM/idempotency, invalid/valid import confirmation, preset lifecycle, password-field safety pause, popup preview, responsive options/reduced motion, all seven adapter routes, before/after, ambient toggle, surface cap, root-token restoration, simulated Sync quota failure and explicit page opt-out.

- `npm run test:contrast`: passed. Confirms adaptive surfaces preserve dark/light author text, high-contrast mode chooses compatible solid fills, and disabling restores pre-existing root token values and their `!important` priority exactly.
- `npm run dev`: watcher started successfully, then stopped after verification.

## Feature status

“Working” below refers to the delivered code and automated unit/fixture evidence. Native extension installation and privileged API behavior remain untested under an unmanaged Chrome profile.

| Capability                                             | Status          | Evidence or limit                                                             |
| ------------------------------------------------------ | --------------- | ----------------------------------------------------------------------------- |
| TypeScript/esbuild, MV3 manifest and local assets      | Working         | Build consistency validation                                                  |
| Load unpacked in actual Chrome                         | Untested        | Administrator policy blocks it here                                           |
| Popup and offline local preview                        | Working         | Built UI rendered in Chromium harness                                         |
| Five palettes and appearance sliders                   | Working         | Theme/blur persistence and rendered-token checks                              |
| Global toggle, cleanup and re-enable                   | Working         | Attributes, style element and temporary variables removed                     |
| Three coverage modes                                   | Working         | Compatibility drops blur/cards; Immersive admits dialogs                      |
| Exact/parent rules, exclusions, global OFF precedence  | Working         | Unit and browser rule tests                                                   |
| Per-site full appearance editing                       | Working         | Implemented shared advanced controls; toggle/removal browser-tested           |
| Before/after temporary tab toggle                      | Working         | Both states tested through message bridge                                     |
| Six dedicated adapters + generic fallback              | Partial         | All selector fixtures pass; live route matrix untested                        |
| YouTube playback/Shorts/fullscreen/live                | Untested        | Requires actual Chrome and live website QA                                    |
| ChatGPT streaming/attachments/tool interactions        | Untested        | Composer/code/SPA fixtures only                                               |
| Custom preset CRUD, duplicate and apply                | Working         | Browser lifecycle tests                                                       |
| Settings export/import                                 | Working         | Download implementation; validation and confirmation tested                   |
| Schema validation, migration and backup                | Working         | Unit cases and invalid-import browser flow                                    |
| Sync/local split and quota fallback                    | Working         | Simulated API tests; real Chrome account Sync untested                        |
| Safety pause and page opt-out                          | Partial         | Password/URL detection and explicit opt-out; heuristic coverage               |
| Reduced motion, forced colors, contrast/simple toggles | Partial         | Static effects/CSS and settings implemented; full assistive-tech audit unrun  |
| Keyboard semantics and focus                           | Partial         | Native labeled controls/focus styles; manual screen-reader/200% audit pending |
| Performance limits and cleanup                         | Working         | Surface-cap and repeated-toggle fixtures; no production performance benchmark |
| Automatic performance downgrade                        | Not implemented | Manual Compatibility fallback available                                       |
| 30-minute pause and keyboard shortcut                  | Not implemented | Optional specification items                                                  |
| Bundled pixel-art imagery                              | Not implemented | Optional; Pixel Realm is a palette with CSS ambience                          |
| No backend/analytics/remote runtime assets             | Working         | No runtime fetch, XHR, remote scripts, or asset URLs                          |
| Store publishing or signed CRX                         | Not implemented | Not requested; release checklist supplied                                     |

## Screenshots

See `screenshots/README.md` for provenance. Captures show the actual compiled UI and representative local video/chat fixtures, including Midnight and Arctic. They are not live website compatibility evidence or fabricated storefront screenshots.

## Release assessment

A buildable development extension and installable file package are delivered. Before calling this release-ready, load it on an unmanaged Chrome profile, complete `RELEASE_CHECKLIST.md`, verify all live-site critical interactions, validate real permission/Sync behavior and produce actual live extension screenshots. No claim of Chrome Web Store readiness or publication is made.
