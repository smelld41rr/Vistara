# Vistara Theme World: coding-platform compatibility audit and proposed plan

Audit date: 30 October 2026. Baseline: v1.0.2, commit `3e965f6`. Scope: read-only inspection and existing-build testing. No application changes, commit, push, deploy or publication remain from this audit. Initial local edits made before the user's plan-only clarification were reverted; repository status is clean.

## Executive finding

The delivered general-purpose glass extension does not implement the requested multi-platform coding studio. Its six named adapters cover YouTube, ChatGPT, Google, GitHub, Reddit and Wikipedia. None covers the nine selected coding platforms. All nine hosts resolve to the generic adapter. The earlier passing fixture suite did not establish coding-platform compatibility.

The requested full coding-workspace experience is currently missing, not merely hidden behind a permission setting. Reinstalling or granting permissions alone cannot implement the absent adapters, image storage or editor integration.

## Method and limits

Inspected source schema, adapter selection, surface discovery, scoped CSS, background rendering, permission recovery and existing tests. Ran strict TypeScript checks and all 24 existing unit/package tests: all passed. Ran the existing compiled `dist/content.js` in Chromium against nine local structural fixtures using simulated Chrome storage/message APIs. No new application code or committed tests were added. The fixtures represent problem/editor/testcase shells and are not fetched live website DOM. They validate the fallback defect, not current live selectors or every route. The machine's administrator policy still blocks all unpacked extensions, so native installation, permission enforcement, live logged-in sites and real code execution remain unverified.

## Nine-platform results

| Platform | Adapter selected | Navbar fixture | Problem panel | Testcase panel | Editor theme | Wallpaper |
|---|---|---|---|---|---|---|
| LeetCode | generic | Header only | Missing | Missing | Missing | Missing |
| HackerRank | generic | Header only | Missing | Missing | Missing | Missing |
| GeeksforGeeks | generic | Header only | Missing | Missing | Missing | Missing |
| Codeforces | generic | Header only | Missing | Missing | Missing | Missing |
| CodeChef | generic | Header only | Missing | Missing | Missing | Missing |
| AtCoder | generic | Header only | Missing | Missing | Missing | Missing |
| Code360 | generic | Header only | Missing | Missing | Missing | Missing |
| InterviewBit | generic | Header only | Missing | Missing | Missing | Missing |
| Coderbyte | generic | Header only | Missing | Missing | Missing | Missing |

“Header only” means the fixture deliberately included a generic `header[role=banner]`. A real navbar without that role or a labeled nav may receive no styling at all. Some real problem panels with generic region attributes may receive incidental styling; this is not dedicated integration.

## Prioritized findings

### P0: Missing coding-platform adapters

`src/adapters/index.ts` has no named coding-platform adapter. The generic fallback recognizes only semantic headers/nav, explicitly marked cards/regions and menus. It cannot identify coding editor, statement or console regions. Adding wildcard background overrides would mask the gap while risking controls and readability.

### P0: Background layering hides the ambient scene

`src/content/styles.ts` paints ambient gradients on fixed `html::before` at z-index -1. In all nine fixtures the body retained opaque white background and `background-image: none`, so the scene did not show behind the workspace. Full viewport height was retained (1000px in a 1000px test viewport): this reproduction is not a collapsed-height defect. `pointer-events: none` is correct and should remain. Actual site stacking contexts, fixed panels and clipping still need live inspection before a specific replacement layer is selected.

### P0: Wallpaper feature absent

Current settings have ambient intensity and gradients, but no wallpaper IDs, custom image selection, placement, compression, upload UI, IndexedDB store or image delivery mechanism. No wallpaper URL is painted on the tested body. Custom wallpaper, difficulty-specific image scenes and image-backed studio previews cannot work in this version.

### P1: Editor integration intentionally excluded

`src/content/engine.ts` explicitly skips Monaco editors and contenteditable descendants. The safe fallback preserves code, but does not theme the editor or understand syntax tokens. In all fixtures editor token color remained unchanged. A future implementation needs editor-specific handling for Monaco/Ace/CodeMirror, with controlled surface colors and readable tokens rather than blanket recoloring.

### P1: Hidden login inputs pause the entire page

`src/adapters/index.ts` treats any password/card input anywhere in the document as a sensitive page, even when hidden. Adding a hidden password input caused safety pause in all nine fixtures. Do not simply remove transaction protection; distinguish visible/active login or payment flows from dormant login dialogs and surface the exact pause reason.

### P1: Preview does not prove page coverage

The popup preview is an independent miniature demo. It can look themed while the current site has zero meaningful workspace surfaces styled. Future status should distinguish “connected”, “adapter detected”, “panels styled”, “compatibility fallback” and “unsupported route”.

### P2: Requirements and test coverage gap

The supplied coding-studio requirements include focus mode, category gallery, custom backgrounds, difficulty scenes, editor colors, verdict effects/sounds and share cards. These are not implemented in the current application. Existing tests cover settings and the earlier general-site experience. Minified one-line `dist/*.js` is normal packaging and is not itself why the page looks like a strip.

## What did work in the nine fixtures

- Existing script initialized without uncaught page errors: 9/9.
- The generic header was tagged: 9/9.
- Fixture Run button remained clickable: 9/9; this is not execution on any platform.
- Textarea contents and sampled syntax token colors were preserved: 9/9.
- Disable removed extension surface tags: 9/9.
- Full viewport body height was preserved: 9/9.
- Full coding-workspace coverage was not achieved: 0/9.

## Proposed implementation plan, pending approval

1. **Approve the corrected PRD and compatibility matrix.** Keep the selected nine platforms, Chrome first, original premium design, local uploads and later premium options. Define route coverage and clearly separate core workspace support from advanced verdict/share metadata.
2. **Capture real DOM and baseline screenshots.** For each platform inspect problem, editor, tests/results, navbar and relevant SPA routes. Record current selectors and editor types; include Code360 path scoping so ordinary naukri.com pages are not treated as coding workspaces. Do not assume fixture selectors equal current production markup.
3. **Prove the rendering design on LeetCode.** Create explicit workspace/background/panel/editor layers with reversible styling, correct viewport coverage and pointer handling. Confirm gradient/image visibility under opaque application shells, readable text, editor caret/selection and working Run/Submit. Validate both light and dark host themes before expanding.
4. **Implement shared wallpaper and editor systems.** Use compressed, bounded local image storage, explicit fit/position/brightness controls and safe message delivery. Separate editor adapters for Monaco/Ace/CodeMirror; preserve syntax semantics, line highlights, selection and diff colors. Add reset and complete cleanup.
5. **Integrate the remaining eight sites individually.** Each must have explicit route matching, selectors, exclusions, dynamic-navigation behavior, compatibility fallback and regression fixtures. Report exact supported features instead of “works everywhere”.
6. **Build the requested Studio features.** Theme/category gallery, custom upload, focus mode and shortcut, per-difficulty scenes, advanced customization, accessible live preview, preset import/export and user-initiated share-card export. Handle verdict effects/sound as opt-in modules with motion/audio controls and only available public result metadata. No code or submission data should be transmitted.
7. **Run release gates before packaging.** Nine sites × supported routes × light/dark × modes; actual native Chrome installation; reload/update/permissions; typing and Run/Submit; SPA/lazy loading; focus and image persistence; disable restoration; screenshot comparisons; contrast, keyboard/zoom, CPU/memory and no added network requests. Browser fixtures alone do not satisfy this gate.

## Exit criteria

For each claimed coding site, the wallpaper must be visible across the intended workspace rather than only a strip; statement/editor/tests/navbar must each have verified styling; controls, editor data and syntax must remain usable; disabling must restore the original page; and evidence must include live native-extension tests on supported routes. Do not publish or push any implementation without the user's approval.

## Evidence files

`results.json` contains all measured fixture outcomes. `leetcode-before.png` and `leetcode-after.png` are actual Chromium captures of a local representative fixture. They are not live LeetCode screenshots. The full source repository remains unchanged.
