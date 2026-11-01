# Electric Ocean — v2.2.0

Reference-inspired ChatGPT Liquid Glass update, November 1, 2026.

## Result

Added Electric Ocean with deep blue/cyan aurora, glossy violet edge bubbles, a floating bubble, reflected floor, subtle particles, blue frosted sidebar, glowing current navigation, luminous cyan composer/actions, glass native segments and recognized suggestion cards. All background graphics are locally bundled CSS; no image service, external resource or new permission is required.

The reference is a visual target, not a claim of pixel-identical live output. ChatGPT keeps its native geometry, icons, content, handlers, and available controls. Chrome's tabs, toolbar, bookmarks and address bar cannot be styled by this webpage extension. We do not invent reference suggestions, navigation entries, account content, or Chat/Work controls. Known suggestion selectors are narrowly scoped and may require adjustment after upstream markup changes.

## Settings and migration

Liquid Glass remains optional and OFF by default. Electric Ocean is the new appearance default for fresh/reset Liquid settings. Existing saved presets remain selected. After upgrading, explicitly choose **Color preset → Electric ocean · reference** in the ChatGPT Liquid Glass popup/Studio section. Enable Liquid Glass, keep the global and site switches on, and reload the extension and tab once after an update. Four previous pastel presets remain selectable.

A reversible root preset marker scopes the additional rules. Cleanup restores prior root attributes/properties, removes owned layers and observers, and returns original ChatGPT appearance. Ocean has readable light foregrounds, dark elevated menus, focus indicators, reduced-motion support, dark solid accessibility/fallback panels and forced-colors handling. Code colors remain native. No source/site content, private input values or conversations are collected.

## Changed implementation

- `src/shared/liquid.ts`: new preset/default, existing settings preserved.
- `src/shared/liquid-controls.ts`: five selectable presets, correct local blue preview, neutral Color preset label.
- `src/content/liquid/liquid.ts`: reversible preset attribute and recognized native suggestion regions.
- `src/content/liquid/liquid.css`: scoped Ocean decoration and surfaces, responsive/accessibility fallbacks.
- Version metadata, tests, generated dist, installation notes, screenshots and packages updated.

## Validation

- Build and TypeScript checks passed.
- 35 unit tests passed.
- 16 Liquid Glass Chromium fixture scenarios passed, including new Ocean/pastel switching, readable input, dynamically recognized suggestion cards and preserved click handlers.
- 20 general browser regression scenarios passed.
- Adaptive contrast and exact restoration check passed.
- Desktop 1920/1440/1366, tablet and 390px mobile fixtures passed, as did master/site OFF, reduced motion, storage persistence, SPA idempotence, native fixture composer/menu/file/mic state and non-ChatGPT isolation.

All browser tests use compiled bundles in real Chromium with simulated Chrome APIs and representative local pages. Managed Chromium blocks unpacked extension installation. Live authenticated ChatGPT, actual voice recording, server-side chat submission and upstream DOM compatibility are not verified. No claim of native/live certification is made.

`reference-ocean.png` is a labeled local functional fixture render. Its three suggestion cards exist only in the test fixture to exercise surface styling and click-handler preservation. Historical peach captures remain v2.1 evidence. See `liquid-browser-results.json` and `browser-results.json` for executed scenarios.
