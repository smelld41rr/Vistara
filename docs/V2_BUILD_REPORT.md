# Vistara Studio 2.0 — local build report

This build implements the coding-workspace direction from the audit. The user has authorized GitHub source/package delivery. No deployment, store submission or publication is authorized; native/live compatibility limitations below still apply.

## Audit findings addressed

| Audit gap                                | Implemented change                                                                                                 | Validation                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Nine hosts all used generic fallback     | Nine separate coding adapters, versioned selectors, Code360 route boundaries                                       | Host/path unit tests + all nine browser structural fixtures                                                                |
| Only header/strip changed                | Explicit workspace shells, nav, statement/test panels and editor surface handling                                  | At least two panels + navbar + editor required in each fixture                                                             |
| Negative background layer hidden by body | Wallpaper paints directly on body with fixed cover/contain positioning; known opaque app shells become transparent | Computed image URL/attachment, viewport-height check and actual captures                                                   |
| No custom image implementation           | Local decoding/resizing, JPEG optimization, IndexedDB and packaged background image delivery                       | Actual local upload, database persistence across Studio reload, worker-to-content data URL check                           |
| Editors entirely excluded                | Editor-aware shell rendering and light/dark foreground-compatible surfaces                                         | Original syntax token colors, code contents, typing and Run controls preserved                                             |
| Hidden login field paused everything     | Only visible active password/card inputs trigger form-based detection                                              | Hidden password input present in all nine fixtures without blocking; prior visible-field safety regression remains covered |
| Preview could hide missing site support  | Popup reports detected panels/editors or no-panels compatibility fallback                                          | Real message handshake plus per-fixture tag counts                                                                         |
| No focused coding Studio                 | New responsive scene/gallery/upload/customization/focus/share Studio                                               | Compiled Studio in real Chromium, including mobile and keyboard-focus checks                                               |

No blanket `* { background: transparent }` rule, document blur, node replacement, click-blocking scene overlay, page script interception or code-value scraping is used. Visual change is scoped to marked containers. Body scene sizing does not lock scrolling height or rewrite platform positioning.

## Features delivered

- Twelve original local vector scenes; eight categories; search, favorites and scene shortcuts in popup.
- Five palettes, Auto/Dark/Light glass, scene visibility/brightness, accent, surface effects and image fit/position.
- Local raster wallpaper upload/delete/select, optimized JPEGs and a 20-image limit. No remote image fetches.
- Full atmosphere presets: scene/focus/glass/etc. plus appearance; legacy appearance presets still work. Advanced settings handles rename, duplicate, delete and JSON backups.
- Focus mode and declared Alt+Shift+V command. Recognized recommendations/sidebars are hidden without hiding Run/Submit or editor controls in the tested layouts.
- Difficulty scene assignments for explicit Easy/Medium/Hard labels; otherwise retain default scene. Custom wallpaper wins.
- Opt-in Accepted/AC toast, reduced-motion treatment and local chime. Chime preview is implemented, but audible output/OS/audio-device behavior was not manually tested. Verdict detection is selector-dependent and not certified live.
- User-entered achievement-card rendering and actual PNG export, without automatically scraping or claiming verified submission metadata or posting to social networks.
- Existing general-site adapters and advanced settings retained.

Native editor syntax palette manipulation, native Monaco/Ace/CodeMirror font-metric changes, freeform crop tools, title-card/effect packs, automatic verified performance/streak extraction, Firefox and premium payments remain outside this build. The font control affects the Studio preview and recognized plain-text editors; native metrics remain unchanged to protect cursor/selection correctness. This is not a claim that every proposed feature in the planning conversation is complete.

## Commands and outcomes

- `npm run build`: passed; locally bundled background/content/popup/options/Studio and generated root/dist manifests.
- `npm run lint`: passed, strict TypeScript.
- `npm test`: **31 passed**, zero failed/skipped. Includes migration, schema safety, route boundaries, local references, presets, recovery and package entrypoints.
- `npm run test:contrast`: passed, original author-style priority restoration and generic-adapter contrast.
- `npm run test:browser`: **20 passed**, no uncaught page errors, for the earlier general-site/popup/options coverage.
- `npm run test:coding`: **21 passed**, no uncaught page errors. Compiled content, background and Studio bundles are exercised in real Chromium with simulated Chrome APIs.
- `npm run package`: creates local source/extension ZIPs, compares every decompressed entry byte-for-byte and writes checksums. Extracted manifests and referenced resources are additionally checked before handoff.

`docs/coding-browser-results.json` and `docs/browser-results.json` record the browser scenarios and timestamps. Artwork is original and generated locally; see `public/ASSETS.md`. Screenshot provenance is in `screenshots/coding/README.md`. The old v1 audit is preserved as historical evidence in `docs/CODING_AUDIT_BASELINE.md`.

## Nine-platform fixture matrix

| Platform      | Adapter route               | Nav / statement / tests / editor | Interaction and scene |
| ------------- | --------------------------- | -------------------------------- | --------------------- |
| LeetCode      | leetcode.com problems       | Passed fixture                   | Passed fixture        |
| HackerRank    | hackerrank.com challenges   | Passed fixture                   | Passed fixture        |
| GeeksforGeeks | geeksforgeeks.org problems  | Passed fixture                   | Passed fixture        |
| Codeforces    | codeforces.com problemset   | Passed fixture                   | Passed fixture        |
| CodeChef      | codechef.com problems       | Passed fixture                   | Passed fixture        |
| AtCoder       | atcoder.jp task             | Passed fixture                   | Passed fixture        |
| Code360       | naukri.com/code360 problems | Passed fixture                   | Passed fixture        |
| InterviewBit  | interviewbit.com problems   | Passed fixture                   | Passed fixture        |
| Coderbyte     | coderbyte.com editor        | Passed fixture                   | Passed fixture        |

These are representative structural HTML fixtures, not snapshots fetched from current production sites. Passing them proves the implemented selector/rendering behavior for those structures, not current live compatibility. Real editor execution, authenticated submit flows, profile/dashboard/contest routes, iframe editors, autocomplete, drag/resize, clipboard and fullscreen are not certified by this matrix.

## External limitations

All nine attempted live public URLs were denied by the environment's network proxy with HTTP tunnel 403; exact observations are in `docs/live-access-results.json`. The managed Chromium still has `ExtensionInstallBlocklist: ["*"]`, so real unpacked MV3 loading and privileged Chrome permission/command/service-worker behavior cannot be tested here. Browser tests simulate those APIs and execute the actual packaged background code in an extension-like same-origin page context for IndexedDB tests. No policy was disabled or bypassed.

The build is ready for local review and manual installation on an unmanaged Chrome profile. It is **not certified release-ready** until the live/native matrix, contrast/assistive-tech, permissions, CSP, native editor behavior and performance checklist passes. No zero-bug or all-websites guarantee is made.
