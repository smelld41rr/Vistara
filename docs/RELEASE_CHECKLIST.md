# Release checklist — manual checks still required

The source and `dist/` are delivered. This is a development build, not a Chrome Web Store-approved release. No store upload, publication, Git push, or user data transfer has been performed.

## Real Chrome installation and permissions

- Load `dist/` unpacked on an unmanaged Chrome profile; confirm no manifest warnings and every icon/popup/options route loads.
- Reload already-open websites after installation. Test first-run defaults.
- Verify the popup's active website, per-host toggle, temporary before/after, denied site access, access revocation, unsupported URLs, protected pages, PDF viewer and account-free Chrome Sync fallback.
- Grant access to only specific sites, then all sites; confirm no misleading success status.
- Restart Chrome, inspect persistence, exercise update migration and quota failure. Confirm only small preferences sync while rules/presets remain local.

## Live website interaction matrix

| Website           | Required routes/interactions                                                                                       | Status in this environment                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| YouTube           | Home, search, watch, Shorts, playlist, theater/fullscreen, live, mini-player, timestamps, menus, infinite scroll   | Untested on live site; adapter fixture passes             |
| ChatGPT           | Sidebar, chat switching, composer typing, streaming, Markdown/code/copy, tables, attachments, tools, modal dialogs | Untested on live site; adapter fixture passes             |
| Google            | Search box, tabs, organic/sponsored labels, questions, shopping/rich results                                       | Untested on live site; adapter fixture passes             |
| GitHub            | Repo navigation, issues/PRs, diff colors, editor, badges, security notices                                         | Untested on live site; adapter fixture passes             |
| Reddit            | Feed, voting state, media, NSFW/moderation indicators, dialogs                                                     | Untested on live site; adapter fixture passes             |
| Wikipedia         | Article, TOC, infobox, tables, footnotes, dark/light site preferences                                              | Untested on live site; adapter fixture passes             |
| Generic/sensitive | Semantic nav, payment/auth detection, excluded domains, unsupported regions                                        | Local fixtures pass; broader real-world coverage untested |

For each site, test Midnight/Aurora/Arctic and all three modes, global/per-site disable, SPA navigation, lazy loading, and no lost click targets. Inspect the extension's isolated-world console for uncaught exceptions.

## Accessibility and performance

- Keyboard-only all popup/options controls, visible focus, theme selection semantics and slider labels.
- Screen-reader review and 200% browser zoom; narrow and wide viewports.
- OS reduced motion and forced colors, high contrast, ambient-off and Simple appearance.
- Body-text contrast on real site surfaces (target 4.5:1); preserve author code/diff/player color semantics.
- Long scrolling pages and repeated mount/unmount: CPU, mutation work, memory growth, dropped frames and layout shifts. Compare against extension disabled; do not treat local fixture timings as production benchmarks.
- If an adapter is unreliable, keep it in Compatibility or exclude it pending a focused selector fix.

## Store submission

- Verify current Manifest V3 and Chrome Web Store policies with official documentation at submission time.
- Provide a public privacy-policy URL and accurate single-purpose/permission explanations.
- Use actual live extension screenshots from an unmanaged Chrome profile; current images are clearly labeled fixture/browser renders and not storefront proof of compatibility.
- Review icon ownership, product name and third-party trademark use; icons are original geometric artwork, and no external artwork is bundled.
- Inspect the ZIP for remote code, development-only data, credentials, missing assets and unnecessary permissions.
- Choose developer contact/support and store listing text, complete disclosures and collect manual QA evidence.
- Obtain explicit user instruction before submitting or publishing.
