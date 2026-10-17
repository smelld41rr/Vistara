import { test } from "node:test";
import assert from "node:assert/strict";
import { connectTab } from "../src/shared/connection.ts";
function mock(
  send: () => Promise<unknown>,
  inject: () => Promise<unknown>,
  files: string[] = ["content.js"],
) {
  Object.defineProperty(globalThis, "chrome", {
    configurable: true,
    value: {
      tabs: { sendMessage: send },
      runtime: { getManifest: () => ({ content_scripts: [{ js: files }] }) },
      scripting: { executeScript: inject },
    },
  });
}
test("healthy connection never injects a duplicate script", async () => {
  let injections = 0;
  mock(
    async () => ({ status: "Active · chatgpt" }),
    async () => {
      injections++;
    },
  );
  assert.equal((await connectTab(1)).status, "Active · chatgpt");
  assert.equal(injections, 0);
});
test("missing receiver recovers an already-open tab and confirms handshake", async () => {
  let injected = false;
  mock(
    async () => {
      if (!injected) throw Error("Receiving end does not exist");
      return { status: "Active · chatgpt" };
    },
    async () => {
      injected = true;
    },
  );
  assert.equal((await connectTab(2)).status, "Active · chatgpt");
  assert.ok(injected);
});
test("permission denial reports Chrome error without claiming success", async () => {
  mock(
    async () => {
      throw Error("No receiver");
    },
    async () => {
      throw Error("Cannot access contents of this URL");
    },
  );
  await assert.rejects(connectTab(3), /Cannot access contents/);
});
test("successful injection without a valid reply is not a successful connection", async () => {
  mock(
    async () => ({}),
    async () => {},
  );
  await assert.rejects(connectTab(4), /did not respond/);
});
test("incomplete package is diagnosed explicitly", async () => {
  mock(
    async () => undefined,
    async () => {},
    [],
  );
  await assert.rejects(connectTab(5), /package is incomplete/);
});
test("recovery respects the generated root manifest content-script path", async () => {
  let injected = false;
  let args: unknown;
  Object.defineProperty(globalThis, "chrome", {
    configurable: true,
    value: {
      tabs: {
        sendMessage: async () => {
          if (!injected) throw Error("No receiver");
          return { status: "Active" };
        },
      },
      runtime: {
        getManifest: () => ({ content_scripts: [{ js: ["dist/content.js"] }] }),
      },
      scripting: {
        executeScript: async (input: unknown) => {
          args = input;
          injected = true;
        },
      },
    },
  });
  await connectTab(7);
  assert.deepEqual(args, { target: { tabId: 7 }, files: ["dist/content.js"] });
});
