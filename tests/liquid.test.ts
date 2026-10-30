import { test } from "node:test";
import assert from "node:assert/strict";
import {
  liquidDefaults,
  validateLiquid,
  isLiquidHost,
} from "../src/shared/liquid.ts";
import {
  cloneDefaults,
  validate,
  importSettings,
} from "../src/shared/settings.ts";
test("Liquid Glass is optional and v2 settings migrate without changing coding preferences", () => {
  const s = cloneDefaults();
  const { chatgpt, ...legacy } = s;
  const next = validate(legacy);
  assert.deepEqual(next.chatgpt, liquidDefaults);
  assert.equal(next.chatgpt.enabled, false);
  assert.deepEqual(next.studio, s.studio);
});
test("theme only accepts exact ChatGPT HTTP(S) origin hostname", () => {
  for (const u of [
    "https://chatgpt.com/",
    "https://chatgpt.com/c/a",
    "http://chatgpt.com/",
  ])
    assert.equal(isLiquidHost(u), true);
  for (const u of [
    "https://notchatgpt.com/",
    "https://foo.chatgpt.com/",
    "https://chatgpt.com.evil.test/",
    "https://leetcode.com/",
    "chrome://settings",
    "bad",
  ])
    assert.equal(isLiquidHost(u), false);
});
test("Liquid settings reject script/CSS values, unknown fields, invalid types and bounds", () => {
  for (const input of [
    null,
    [],
    { preset: "constructor" },
    { preset: "url(x)" },
    { blur: 37 },
    { brightness: NaN },
    { intensity: -1 },
    { sidebarOpacity: 0 },
    { composerOpacity: 1 },
    { enabled: "true" },
    { animation: 1 },
    { css: "*{}" },
  ])
    assert.throws(() => validateLiquid(input));
});
test("local JSON preferences round-trip without modifying shared coding appearance", () => {
  const s = cloneDefaults();
  s.chatgpt = {
    ...liquidDefaults,
    enabled: true,
    preset: "lavender",
    animation: true,
    blur: 32,
  };
  const next = importSettings(JSON.stringify(s));
  assert.deepEqual(next.chatgpt, s.chatgpt);
  assert.deepEqual(next.appearance, s.appearance);
  assert.deepEqual(next.studio, s.studio);
});
