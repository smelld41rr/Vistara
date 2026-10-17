import { build, context } from "esbuild";
import { mkdir, cp, copyFile, readFile, access } from "node:fs/promises";
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await copyFile("manifest.template.json", "dist/manifest.json");
// The GitHub source ZIP is also loadable directly. Keep its manifest generated
// from the same source, with every extension resource pointing into dist/.
const rootManifest = JSON.parse(
  await readFile("manifest.template.json", "utf8"),
);
const prefix = (path) => `dist/${path}`;
rootManifest.action.default_popup = prefix(rootManifest.action.default_popup);
for (const size of Object.keys(rootManifest.action.default_icon))
  rootManifest.action.default_icon[size] = prefix(
    rootManifest.action.default_icon[size],
  );
rootManifest.options_page = prefix(rootManifest.options_page);
for (const size of Object.keys(rootManifest.icons))
  rootManifest.icons[size] = prefix(rootManifest.icons[size]);
for (const script of rootManifest.content_scripts)
  script.js = script.js.map(prefix);
await import("node:fs/promises").then(({ writeFile }) =>
  writeFile("manifest.json", JSON.stringify(rootManifest, null, 2) + "\n"),
);
for (const name of ["popup", "options"]) {
  await mkdir(`dist/${name}`, { recursive: true });
  await copyFile(`src/${name}/index.html`, `dist/${name}/index.html`);
}
await copyFile("src/shared/ui.css", "dist/ui.css");
const opts = {
  entryPoints: {
    content: "src/content/content.ts",
    "popup/popup": "src/popup/popup.ts",
    "options/options": "src/options/options.ts",
  },
  bundle: true,
  outdir: "dist",
  target: "chrome120",
  format: "iife",
  minify: !process.argv.includes("--watch"),
  legalComments: "none",
};
if (process.argv.includes("--watch")) {
  const ctx = await context(opts);
  await ctx.watch();
  console.log("Watching extension source; reload extension after changes.");
} else {
  await build(opts);
  const m = JSON.parse(await readFile("dist/manifest.json", "utf8"));
  for (const path of [
    ...m.content_scripts.flatMap((x) => x.js),
    m.action.default_popup,
    m.options_page,
    ...Object.values(m.icons),
    "popup/popup.js",
    "options/options.js",
    "ui.css",
  ])
    await access(`dist/${path}`);
  console.log(
    "Build verified: manifest entrypoints and packaged assets exist.",
  );
}
