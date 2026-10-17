import { test } from "node:test";
import assert from "node:assert/strict";
import { cloneDefaults } from "../src/shared/settings.ts";
import { load, save } from "../src/shared/storage.ts";
function mock(
  local: Record<string, unknown> = {},
  sync: Record<string, unknown> = {},
  fail = false,
) {
  const area = (data: Record<string, unknown>, syncArea = false) => ({
    get: async (keys: string | string[]) =>
      Object.fromEntries(
        (Array.isArray(keys) ? keys : [keys]).map((k) => [k, data[k]]),
      ),
    set: async (values: Record<string, unknown>) => {
      if (syncArea && fail) throw Error("quota");
      Object.assign(data, structuredClone(values));
    },
  });
  Object.defineProperty(globalThis, "chrome", {
    value: { storage: { local: area(local), sync: area(sync, true) } },
    configurable: true,
  });
  return { local, sync };
}
test("fresh device loads synced appearance without a local settings record", async () => {
  const settings = cloneDefaults();
  settings.appearance.theme = "aurora";
  mock(
    {},
    {
      shared: {
        schemaVersion: 1,
        appearance: settings.appearance,
        enabled: false,
        accessibility: settings.accessibility,
        revision: 2,
      },
    },
  );
  const actual = await load();
  assert.equal(actual.appearance.theme, "aurora");
  assert.equal(actual.enabled, false);
  assert.deepEqual(actual.siteOverrides, []);
});
test("quota failure preserves newer local preferences over stale sync data", async () => {
  const baseline = cloneDefaults();
  const store = mock({}, { shared: { ...baseline, revision: 1 } }, true);
  const s = cloneDefaults();
  s.appearance.theme = "arctic";
  await assert.rejects(save(s), /Saved locally/);
  assert.equal((await load()).appearance.theme, "arctic");
  assert.ok(store.local.sharedFallback);
});
test("newer sync preferences preserve larger local-only rule collections", async () => {
  const s = cloneDefaults();
  s.siteOverrides = [
    { host: "example.com", subdomains: false, enabled: false },
  ];
  const newer = cloneDefaults();
  newer.appearance.theme = "orchid";
  mock(
    { settings: s, sharedFallback: { appearance: s.appearance, revision: 1 } },
    {
      shared: {
        schemaVersion: 1,
        enabled: true,
        appearance: newer.appearance,
        accessibility: newer.accessibility,
        revision: 2,
      },
    },
  );
  const actual = await load();
  assert.equal(actual.appearance.theme, "orchid");
  assert.equal(actual.siteOverrides[0].host, "example.com");
});
test("unsupported stored data is backed up rather than silently reset", async () => {
  const store = mock({ settings: { schemaVersion: 99, enabled: true } });
  await assert.rejects(load(), /backup was preserved/);
  assert.deepEqual(store.local.migrationBackup, {
    schemaVersion: 99,
    enabled: true,
  });
});
