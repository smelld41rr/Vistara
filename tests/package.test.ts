import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access, stat } from "node:fs/promises";
import { resolve, dirname, extname } from "node:path";
async function verifyFolder(folder: string) {
  const root = resolve(folder);
  const manifest = JSON.parse(
    await readFile(resolve(root, "manifest.json"), "utf8"),
  );
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, "1.0.1");
  const entries = [
    manifest.action.default_popup,
    manifest.options_page,
    ...Object.values(manifest.icons),
    ...Object.values(manifest.action.default_icon),
    ...manifest.content_scripts.flatMap((s: { js: string[] }) => s.js),
  ] as string[];
  for (const entry of entries) {
    const target = resolve(root, entry);
    assert.ok(
      target.startsWith(root + "/"),
      "manifest must stay within selected folder",
    );
    await access(target);
    assert.ok((await stat(target)).size > 0);
    if (extname(target) === ".html") {
      const html = await readFile(target, "utf8");
      for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        const resource = match[1];
        if (/^(https?:|#)/.test(resource)) continue;
        const file = resolve(dirname(target), resource);
        assert.ok(file.startsWith(root + "/"));
        await access(file);
      }
    }
  }
  return manifest;
}
test("GitHub ZIP root is directly loadable and all nested UI assets resolve", async () => {
  const m = await verifyFolder(".");
  assert.ok(m.action.default_popup.startsWith("dist/"));
});
test("dist remains independently loadable with no source files required", async () => {
  const m = await verifyFolder("dist");
  assert.ok(!m.action.default_popup.startsWith("dist/"));
});
test("root and dist manifests describe the same product and permissions", async () => {
  const a = await verifyFolder("."),
    b = await verifyFolder("dist");
  assert.equal(a.name, b.name);
  assert.deepEqual(a.permissions, b.permissions);
  assert.deepEqual(a.content_scripts[0].matches, b.content_scripts[0].matches);
});
