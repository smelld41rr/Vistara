import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cloneDefaults,
  validate,
  importSettings,
  resolve,
  hostname,
  matches,
  eligible,
  migrate,
  appearance,
} from "../src/shared/settings.ts";
import { selectAdapter } from "../src/adapters/index.ts";
test("defaults validate and round-trip", () =>
  assert.deepEqual(validate(cloneDefaults()), cloneDefaults()));
test("hostname boundaries, normalization and invalid inputs", () => {
  assert.equal(hostname("WWW.Example.com."), "www.example.com");
  assert.ok(matches("a.example.com", "example.com", true));
  assert.ok(!matches("notexample.com", "example.com", true));
  assert.ok(!matches("a.example.com", "example.com"));
  for (const bad of [
    "https://example.com",
    "foo/bar",
    "x:80",
    "-example.com",
    "example..com",
    "",
  ])
    assert.throws(() => hostname(bad));
});
test("protected pages are never eligible", () => {
  for (const u of [
    "chrome://settings",
    "file:///a",
    "https://chromewebstore.google.com/detail/test",
    "https://chrome.google.com/webstore",
    "bad",
  ])
    assert.equal(eligible(u), false);
  assert.equal(eligible("https://example.com"), true);
});
test("exact > longest parent > defaults", () => {
  const s = cloneDefaults();
  s.siteOverrides = [
    { host: "example.com", subdomains: true, enabled: true, theme: "aurora" },
    { host: "a.example.com", subdomains: true, enabled: true, theme: "orchid" },
    {
      host: "x.a.example.com",
      subdomains: false,
      enabled: true,
      theme: "arctic",
    },
  ];
  assert.equal(resolve(s, "https://x.a.example.com").theme, "arctic");
  assert.equal(resolve(s, "https://y.a.example.com").theme, "orchid");
  assert.equal(resolve(s, "https://b.example.com").theme, "aurora");
  assert.equal(resolve(s, "https://notexample.com").theme, "midnight");
});
test("master off and exclusions beat explicit site on", () => {
  const s = cloneDefaults();
  s.siteOverrides = [{ host: "example.com", subdomains: false, enabled: true }];
  s.enabled = false;
  assert.equal(resolve(s, "https://example.com").enabled, false);
  s.enabled = true;
  s.excludedSites = ["example.com"];
  assert.equal(resolve(s, "https://example.com").enabled, false);
});
test("explicit site OFF and accessibility overrides", () => {
  const s = cloneDefaults();
  s.siteOverrides = [
    { host: "example.com", subdomains: false, enabled: false },
  ];
  assert.equal(resolve(s, "https://example.com").enabled, false);
  s.accessibility.simple = true;
  s.accessibility.highContrast = true;
  s.accessibility.disableImagery = true;
  const r = resolve(s, "https://other.com");
  assert.equal(r.mode, "compatibility");
  assert.equal(r.contrast, true);
  assert.equal(r.ambient, false);
});
test("reject invalid import without mutating defaults", () => {
  const before = cloneDefaults();
  for (const text of [
    "{}",
    "null",
    "[]",
    "{bad",
    '{"__proto__":{}}',
    "x".repeat(262145),
  ])
    assert.throws(() => importSettings(text));
  assert.deepEqual(before, cloneDefaults());
});
test("reject invalid effect values and enum values", () => {
  for (const raw of [
    { blur: 33 },
    { opacity: 0.1 },
    { radius: NaN },
    { theme: "constructor" },
    { mode: "bad" },
    { ambient: "yes" },
    { unexpected: 0 },
  ])
    assert.throws(() => appearance(raw));
});
test("strict rule, preset, and version validation", () => {
  const s = cloneDefaults();
  s.siteOverrides = [
    { host: "example.com", subdomains: false, enabled: true },
    { host: "example.com", subdomains: false, enabled: false },
  ];
  assert.throws(() => validate(s));
  assert.throws(() => validate({ ...cloneDefaults(), schemaVersion: 99 }));
  assert.throws(() =>
    validate({
      ...cloneDefaults(),
      customPresets: [{ id: "x", name: "x", appearance: { blur: -1 } }],
    }),
  );
});
test("migration preserves valid old preferences, rejects future versions", () => {
  assert.equal(
    migrate({ schemaVersion: 0, enabled: false, defaultTheme: "aurora" })
      .appearance.theme,
    "aurora",
  );
  assert.equal(migrate({ enabled: false }).enabled, false);
  assert.throws(() => migrate({ schemaVersion: 2 }));
  assert.deepEqual(migrate(null), cloneDefaults());
});
test("adapter routing uses hostname boundaries", () => {
  for (const [host, id] of [
    ["www.youtube.com", "youtube"],
    ["chatgpt.com", "chatgpt"],
    ["github.com", "github"],
    ["en.wikipedia.org", "wikipedia"],
    ["www.google.co.in", "google"],
    ["new.reddit.com", "reddit"],
    ["notyoutube.com", "generic"],
  ])
    assert.equal(selectAdapter(host).id, id);
});
