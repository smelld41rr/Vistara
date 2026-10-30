# Coding / Studio screenshot provenance

All PNGs here are actual Chromium captures or an actual generated PNG share card from the compiled v2 application. Chrome storage/message/command APIs are simulated in the browser harness; the background, Studio and content JavaScript are the real built bundles. The nine websites are intercepted **local representative fixtures, not live websites**, and headers identify this. The managed browser forbids unpacked-extension installation, and the network proxy denies the nine public website URLs.

- `studio-gallery.png`: new scene library and private interactive preview.
- `studio-wallpaper.png`: local upload and IndexedDB gallery; a test icon serves as a test image.
- `studio-mobile.png`: 500px Studio layout with reduced motion.
- `leetcode.png` and the other eight platform-named images: default dark glass, full-workspace local fixtures; typed code and clickable controls are exercised.
- `leetcode-before.png`: the same fixture with before/after temporarily disabled.
- `leetcode-light.png`: light glass with the native dark syntax/editor contrast preserved.
- `share-card.png`: actual PNG export, with manually entered test metadata.

These images are not storefront proof of live-site compatibility. No private user content or third-party screenshots were collected.
