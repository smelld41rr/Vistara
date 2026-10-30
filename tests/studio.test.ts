import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cloneDefaults,
  validate,
  importSettings,
} from "../src/shared/settings.ts";
import {
  validateStudio,
  studioDefaults,
  effectiveScene,
} from "../src/shared/studio.ts";
import { scenes, sceneSvg, sceneUrl } from "../src/shared/scenes.ts";
import { selectAdapter } from "../src/adapters/index.ts";
test("v1 settings migrate additively to Studio defaults", () => {
  const s = cloneDefaults();
  const { studio, ...old } = s;
  assert.deepEqual(validate(old).studio, studioDefaults);
  assert.equal(
    importSettings(JSON.stringify(old)).appearance.theme,
    "midnight",
  );
});
test("nine coding adapters route by host and Code360 path boundaries", () => {
  for (const [h, p, id] of [
    ["leetcode.com", "/problems/two-sum", "leetcode"],
    ["www.hackerrank.com", "/challenges/x", "hackerrank"],
    ["www.geeksforgeeks.org", "/problems/x", "geeksforgeeks"],
    ["codeforces.com", "/problemset/problem/1/A", "codeforces"],
    ["www.codechef.com", "/problems/TEST", "codechef"],
    ["atcoder.jp", "/contests/x", "atcoder"],
    ["www.naukri.com", "/code360/problems/x", "code360"],
    ["www.interviewbit.com", "/problems/x", "interviewbit"],
    ["coderbyte.com", "/editor/x", "coderbyte"],
  ])
    assert.equal(selectAdapter(h, p).id, id);
  assert.equal(selectAdapter("www.naukri.com", "/jobs").id, "generic");
  assert.equal(selectAdapter("notleetcode.com", "/problems").id, "generic");
  assert.equal(
    selectAdapter("naukri.com", "/code360not/problems").id,
    "generic",
  );
});
test("Studio import rejects executable URLs, CSS, unknown scenes, bad types and ranges", () => {
  for (const raw of [
    { wallpaper: "https://tracking.test/x" },
    { accent: "red;background:url(x)" },
    { scene: "constructor" },
    { sceneStrength: 2 },
    { brightness: NaN },
    { editorSize: 100 },
    { focus: "yes" },
    { favorites: ["unknown"] },
    { difficultyScenes: { easy: "moonlit" } },
    { evil: true },
  ])
    assert.throws(() => validateStudio(raw));
});
test("difficulty mapping is explicit and falls back instead of inventing a rating", () => {
  const s = structuredClone(studioDefaults);
  assert.equal(effectiveScene(s, "hard"), "moonlit");
  s.difficultyEnabled = true;
  assert.equal(effectiveScene(s, "hard"), "neon");
  assert.equal(effectiveScene(s, null), "moonlit");
  assert.equal(effectiveScene(s, "unknown"), "moonlit");
});
test("original scenes are unique, local and safe SVG data URLs", () => {
  assert.equal(scenes.length, 12);
  assert.equal(new Set(scenes.map((s) => s.id)).size, 12);
  for (const scene of scenes) {
    const svg = sceneSvg(scene.id);
    assert.ok(svg.startsWith("<svg"));
    assert.ok(!/<script|<foreignObject|href=|onload=/i.test(svg));
    assert.ok(sceneUrl(scene.id).startsWith("data:image/svg+xml;"));
  }
});
test("Studio local references are validated without embedding images in settings exports", () => {
  const s = cloneDefaults();
  s.studio.wallpaper = "12345678-1234-1234-1234-123456789abc";
  const raw = JSON.stringify(validate(s));
  assert.ok(!raw.includes("data:image"));
  assert.equal(importSettings(raw).studio.wallpaper, s.studio.wallpaper);
});
test("saved looks validate and preserve scene choices as well as appearance", () => {
  const s = cloneDefaults();
  s.customPresets = [
    {
      id: "a",
      name: "My corner",
      appearance: { ...s.appearance },
      studio: { ...s.studio, scene: "sakura" },
    },
  ];
  assert.equal(
    importSettings(JSON.stringify(s)).customPresets[0].studio?.scene,
    "sakura",
  );
  s.customPresets[0].studio!.accent = "url(javascript:x)";
  assert.throws(() => validate(s));
});
