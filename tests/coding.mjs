import { chromium } from "playwright";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { cloneDefaults } from "../src/shared/settings.ts";
const dist = resolve("dist");
await mkdir("screenshots/coding", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1600, height: 1100 },
});
const memory = { local: { settings: cloneDefaults() }, sync: {} };
const errors = [];
const results = [];
let background;
context.on("page", (page) =>
  page.on("pageerror", (e) =>
    errors.push({ url: page.url(), error: e.message }),
  ),
);
const cases = [
  {
    site: "leetcode",
    host: "leetcode.com",
    path: "/problems/two-sum/",
    shell: '<div id="__next">',
    end: "</div>",
    nav: "<nav>",
    navEnd: "</nav>",
    panel: 'id="description" data-track-load="description_content"',
    tests: 'data-testid="testcase-panel"',
  },
  {
    site: "hackerrank",
    host: "www.hackerrank.com",
    path: "/challenges/two-sum/problem",
    shell: '<div class="challenge-interface">',
    end: "</div>",
    nav: '<header class="community-header">',
    navEnd: "</header>",
    panel: 'class="challenge_problem_statement"',
    tests: 'class="challenge-testcases"',
  },
  {
    site: "geeksforgeeks",
    host: "www.geeksforgeeks.org",
    path: "/problems/two-sum/1",
    shell: '<div id="__next">',
    end: "</div>",
    nav: "<header>",
    navEnd: "</header>",
    panel: 'class="problems_problem_content"',
    tests: 'class="problems_testcases"',
  },
  {
    site: "codeforces",
    host: "codeforces.com",
    path: "/problemset/problem/1/A",
    shell: '<div id="pageContent">',
    end: "</div>",
    nav: '<header id="header">',
    navEnd: "</header>",
    panel: 'class="problem-statement"',
    tests: 'class="datatable"',
  },
  {
    site: "codechef",
    host: "www.codechef.com",
    path: "/problems/TEST",
    shell: '<div id="root">',
    end: "</div>",
    nav: "<header>",
    navEnd: "</header>",
    panel: 'id="problem-statement"',
    tests: 'data-testid="testcase-panel"',
  },
  {
    site: "atcoder",
    host: "atcoder.jp",
    path: "/contests/practice/tasks/practice_1",
    shell: '<div id="main-container">',
    end: "</div>",
    nav: '<header class="navbar">',
    navEnd: "</header>",
    panel: 'id="task-statement"',
    tests: 'class="panel"',
  },
  {
    site: "code360",
    host: "www.naukri.com",
    path: "/code360/problems/two-sum",
    shell: "<app-root>",
    end: "</app-root>",
    nav: "<header>",
    navEnd: "</header>",
    panel: 'class="problem-description"',
    tests: 'class="test-case-container"',
  },
  {
    site: "interviewbit",
    host: "www.interviewbit.com",
    path: "/problems/two-sum/",
    shell: '<div id="app">',
    end: "</div>",
    nav: "<header>",
    navEnd: "</header>",
    panel: 'class="problem-statement"',
    tests: 'class="testcase-container"',
  },
  {
    site: "coderbyte",
    host: "coderbyte.com",
    path: "/editor/two-sum:JavaScript",
    shell: '<div id="challenge">',
    end: "</div>",
    nav: "<header>",
    navEnd: "</header>",
    panel: 'class="challenge-description"',
    tests: 'class="testcase-container"',
  },
];
const eligiblePages = () =>
  context
    .pages()
    .filter((p) => cases.some((c) => p.url().startsWith("https://" + c.host)));
await context.exposeBinding("storageBridge", async (_, op, area, data) => {
  if (op === "get") {
    const store = memory[area];
    return typeof data === "string"
      ? { [data]: store[data] }
      : Array.isArray(data)
        ? Object.fromEntries(data.map((k) => [k, store[k]]))
        : store;
  }
  const changes = {};
  for (const [k, v] of Object.entries(data)) {
    changes[k] = { oldValue: memory[area][k], newValue: v };
    memory[area][k] = v;
  }
  for (const p of context.pages())
    await p
      .evaluate(
        ({ changes, area }) =>
          window.listeners.forEach((fn) => fn(changes, area)),
        { changes, area },
      )
      .catch(() => {});
});
await context.exposeBinding("runtimeBridge", async (_, message) => {
  if (!background) return { data: null };
  return background.evaluate(
    (message) =>
      new Promise((resolve) => {
        for (const fn of window.messages)
          fn(message, { id: "vistara-test" }, resolve);
      }),
    message,
  );
});
await context.exposeBinding("tabsBridge", async (_, op, message) => {
  const target = eligiblePages().at(-1);
  if (op === "query") return target ? [{ id: 1, url: target.url() }] : [];
  if (!target) throw Error("No page");
  return target.evaluate(
    (message) =>
      new Promise((resolve, reject) => {
        if (!window.messages.length) return reject(Error("No receiver"));
        for (const fn of window.messages) fn(message, {}, resolve);
      }),
    message,
  );
});
await context.exposeBinding("injectBridge", async () => {
  const target = eligiblePages().at(-1);
  await target.addScriptTag({ path: resolve(dist, "content.js") });
});
await context.addInitScript(() => {
  window.listeners = [];
  window.messages = [];
  window.commands = [];
  const area = (name) => ({
    get: (keys) => window.storageBridge("get", name, keys),
    set: (data) => window.storageBridge("set", name, data),
  });
  window.chrome = {
    storage: {
      local: area("local"),
      sync: area("sync"),
      onChanged: { addListener: (fn) => window.listeners.push(fn) },
    },
    runtime: {
      id: "vistara-test",
      getManifest: () => ({ content_scripts: [{ js: ["content.js"] }] }),
      onMessage: { addListener: (fn) => window.messages.push(fn) },
      sendMessage: (message) => window.runtimeBridge(message),
      openOptionsPage: async () => {},
    },
    scripting: { executeScript: () => window.injectBridge() },
    tabs: {
      query: () => window.tabsBridge("query"),
      sendMessage: (id, message) => window.tabsBridge("send", message),
    },
    commands: { onCommand: { addListener: (fn) => window.commands.push(fn) } },
  };
});
await context.route("https://vistara-ui.test/**", async (r) => {
  const p = new URL(r.request().url()).pathname;
  if (p === "/worker-test") {
    return r.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>Background bundle test</title>",
    });
  }
  try {
    const body = await readFile(dist + p);
    await r.fulfill({
      contentType: p.endsWith(".js")
        ? "text/javascript"
        : p.endsWith(".css")
          ? "text/css"
          : p.endsWith(".png")
            ? "image/png"
            : "text/html",
      body,
    });
  } catch {
    await r.fulfill({ status: 404, body: "Not found" });
  }
});
function fixture(c) {
  const attrs = (raw, cls) =>
    raw.startsWith("class=")
      ? 'class="' + cls + " " + raw.split('"')[1] + '"'
      : raw + ' class="' + cls + '"';
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>${c.site} — representative Vistara fixture</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#fafafa;color:#243044;font:14px system-ui}#pageContent,#__next,#app,#root,#challenge,app-root,.challenge-interface,#main-container{display:block;background:#fafafa;min-height:100vh}nav,header{display:flex;align-items:center;justify-content:space-between;padding:18px 28px;background:white;border-bottom:1px solid #ddd;margin:0 18px;min-height:65px}nav strong,header strong{font-size:17px}nav span,header span{font-size:10px;opacity:.6;letter-spacing:1px}.layout{display:grid;grid-template-columns:1fr 1.2fr;gap:18px;padding:24px 18px}.statement{min-height:630px;background:white;padding:32px;border:1px solid #ddd;border-radius:12px}.statement h1{font-size:30px;letter-spacing:-1px;margin:5px 0 16px}.statement p{line-height:1.9;max-width:550px}.statement pre{padding:18px;border-radius:10px;font-size:13px;line-height:1.8}.statement .tags{font-size:11px;opacity:.7}.right{display:grid;gap:18px;align-content:start}.monaco-editor{position:relative;min-height:370px;background:#1e1e1e;color:#ddd;border:1px solid #ccc;overflow:hidden}.editor-bar{position:relative;padding:13px 18px;border-bottom:1px solid #ffffff15;font-size:11px}.view-lines{position:relative;padding:20px;line-height:2.2;font-family:monospace;color:#ddd}.mtk1{color:#ddd}.mtk6{color:#c586c0}.mtk4{color:#90c3e0}.monaco-editor textarea{position:relative;margin:5px 20px 20px;width:calc(100% - 40px);height:65px;background:#101827;color:#d6e5ff;border:1px solid #7788aa55;padding:10px;resize:vertical;font:13px monospace}.monaco-editor-background{position:absolute;inset:0}.testcase{background:white;padding:25px;border:1px solid #ddd;border-radius:12px;min-height:165px}.testcase h2{font-size:13px;margin:0 0 18px}.testcase p{font-size:12px}.testcase input{background:transparent;color:inherit;border:1px solid #9997;padding:8px;border-radius:6px}.actions{display:flex;gap:10px;align-items:center}button{background:#99bba1;color:#102b21;border:0;padding:10px 20px;border-radius:8px;cursor:pointer}#verdict{font-size:12px;color:#8aca9e}.recommendations{padding:20px;margin:0 20px;background:#fff;border:1px solid #ddd;border-radius:10px;font-size:12px}label[data-difficulty]{display:inline-block;border-radius:5px;padding:4px 9px;color:#73b98e;background:#73b98e18;font-size:11px}</style></head><body>${c.shell}${c.nav}<strong>◈ ${c.site} workspace</strong><span>REPRESENTATIVE LOCAL FIXTURE · COMPILED VISTARA BUNDLE · NOT A LIVE WEBSITE</span><button id="menu">Menu</button>${c.navEnd}<div class="layout"><section ${attrs(c.panel, "statement")}><p class="tags">DESCRIPTION &nbsp; / &nbsp; SOLUTIONS &nbsp; / &nbsp; SUBMISSIONS</p><h1>1. Two Sum</h1><label data-difficulty="easy">Easy</label><p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p><p>You may assume that each input has exactly one solution, and you may not use the same element twice.</p><h3>Example 1</h3><pre>Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nExplanation: nums[0] + nums[1] == 9.</pre><h3>Constraints</h3><ul><li>2 ≤ nums.length ≤ 10⁴</li><li>Only one valid answer exists.</li></ul><p>Can you come up with an algorithm that is less than O(n²)?</p></section><div class="right"><div class="monaco-editor"><div class="monaco-editor-background"></div><div class="editor-bar">JavaScript &nbsp; ⌄ &nbsp; · &nbsp; Auto-saved locally</div><div class="view-lines"><span class="mtk6">function</span> <span class="mtk4">twoSum</span><span class="mtk1">(nums, target) {</span><br>&nbsp; <span class="mtk6">const</span> <span class="mtk1">seen = new Map();</span><br>&nbsp; <span class="mtk6">for</span> <span class="mtk1">(let i = 0; i &lt; nums.length; i++) {</span><br>&nbsp; &nbsp; <span class="mtk1">// one small step at a time</span><br>&nbsp; <span class="mtk1">}</span><br><span class="mtk1">}</span></div><textarea aria-label="Code editor">return [0, 1];</textarea></div><section ${attrs(c.tests, "testcase")}><h2>TESTCASE &nbsp; / &nbsp; TEST RESULT</h2><p>Case 1 &nbsp; · &nbsp; nums</p><input aria-label="Testcase" value="[2, 7, 11, 15]"></section><div class="actions"><button id="run">▷ Run</button><button id="submit">Submit ↗</button><span id="verdict" data-testid="submission-result">Ready</span></div></div></div><aside id="sidebar" data-testid="recommendations" class="recommendations">Recommended challenges · This sidebar can be quieted with Focus mode.</aside><input type="password" hidden><script>document.querySelector('#run').onclick=()=>document.querySelector('#verdict').textContent='All test cases passed';document.querySelector('#submit').onclick=()=>document.querySelector('#verdict').textContent='Accepted';document.querySelector('#menu').onclick=e=>e.target.textContent='Menu opened';</script>${c.end}<script src="https://vistara-ui.test/content.js"></script></body></html>`;
}
for (const c of cases)
  await context.route("https://" + c.host + "/**", (r) =>
    r.fulfill({ contentType: "text/html", body: fixture(c) }),
  );
const wait = () => new Promise((r) => setTimeout(r, 650));
async function check(name, fn) {
  await fn();
  results.push(name);
  console.log("PASS", name);
}
try {
  background = await context.newPage();
  await background.goto("https://vistara-ui.test/worker-test");
  await background.addScriptTag({ path: resolve(dist, "background.js") });
  const studio = await context.newPage();
  await studio.goto("https://vistara-ui.test/studio/index.html");
  await studio.locator(".scene-card").first().waitFor();
  await check(
    "Studio renders twelve original scenes with no startup errors",
    async () => {
      assert.equal(await studio.locator(".scene-card").count(), 12);
      assert.equal(await studio.locator("#coding-preview").isVisible(), true);
      await studio.screenshot({
        path: "screenshots/coding/studio-gallery.png",
        fullPage: true,
      });
    },
  );
  await check(
    "scene search, categories, favorites and local selection persist",
    async () => {
      await studio.getByRole("button", { name: "Nature", exact: true }).click();
      assert.equal(await studio.locator(".scene-card").count(), 2);
      await studio.getByRole("button", { name: "All", exact: true }).click();
      await studio
        .getByRole("searchbox", { name: "Search scenes" })
        .fill("sakura");
      assert.equal(await studio.locator(".scene-card").count(), 1);
      await studio
        .getByRole("button", { name: "Favorite Sakura after dark" })
        .click();
      await studio
        .getByRole("button", { name: "Apply Sakura after dark" })
        .click();
      await wait();
      assert.equal(memory.local.settings.studio.scene, "sakura");
      await studio.getByRole("searchbox", { name: "Search scenes" }).fill("");
      await studio
        .getByRole("button", { name: "Favorites", exact: true })
        .click();
      assert.equal(await studio.locator(".scene-card").count(), 1);
      await studio.getByRole("button", { name: "All", exact: true }).click();
    },
  );
  const page = await context.newPage();
  for (const c of cases)
    await check(
      c.site + ": background, statement, testcase, navbar and editor coverage",
      async () => {
        await page.goto("https://" + c.host + c.path);
        await page.waitForSelector('html[data-gf-coding="true"]');
        await wait();
        assert.equal(
          await page.locator("html").getAttribute("data-gf-adapter"),
          c.site,
        );
        assert.ok(
          (await page.locator('[data-gf-surface="panel"]').count()) >= 2,
        );
        assert.ok((await page.locator('[data-gf-surface="nav"]').count()) >= 1);
        assert.equal(await page.locator("[data-gf-editor]").count(), 1);
        assert.match(
          await page
            .locator("body")
            .evaluate((e) => getComputedStyle(e).backgroundImage),
          /data:image\/svg/,
        );
        assert.ok(
          (
            await page
              .locator("body")
              .evaluate((e) => getComputedStyle(e).backgroundAttachment)
          )
            .split(",")
            .every((value) => value.trim() === "fixed"),
        );
        assert.ok(
          await page
            .locator("body")
            .evaluate((e) => e.getBoundingClientRect().height >= innerHeight),
        );
        assert.equal(
          await page
            .locator(".mtk6")
            .first()
            .evaluate((e) => getComputedStyle(e).color),
          "rgb(197, 134, 192)",
        );
        await page
          .getByRole("textbox", { name: "Code editor" })
          .fill("const answer = [0, 1];");
        await page.locator("#run").click();
        assert.equal(
          await page.locator("#verdict").textContent(),
          "All test cases passed",
        );
        await page
          .getByRole("textbox", { name: "Testcase", exact: true })
          .fill("[3, 4]");
        await page.locator("#menu").click();
        assert.equal(await page.locator("#menu").textContent(), "Menu opened");
        assert.equal(
          await page.getByRole("textbox", { name: "Code editor" }).inputValue(),
          "const answer = [0, 1];",
        );
        await page.screenshot({
          path: `screenshots/coding/${c.site}.png`,
          fullPage: true,
        });
        if (c.site === "leetcode") {
          await page.evaluate(
            () =>
              new Promise((resolve) =>
                window.messages.forEach((fn) =>
                  fn({ type: "VISTARA_BEFORE" }, {}, resolve),
                ),
              ),
          );
          await page.screenshot({
            path: "screenshots/coding/leetcode-before.png",
            fullPage: true,
          });
          await page.evaluate(
            () =>
              new Promise((resolve) =>
                window.messages.forEach((fn) =>
                  fn({ type: "VISTARA_BEFORE" }, {}, resolve),
                ),
              ),
          );
        }
      },
    );
  await page.goto("https://leetcode.com/problems/two-sum/");
  await page.waitForSelector("[data-gf-editor]");
  await check(
    "focus mode hides recommendations, not Run/Submit; keyboard command toggles it",
    async () => {
      await studio.goto("https://vistara-ui.test/studio/index.html#flow");
      await studio
        .locator("#flow-controls")
        .getByRole("switch", { name: "Focus mode", exact: true })
        .check();
      await wait();
      assert.equal(
        await page.locator('[data-testid="recommendations"]').isVisible(),
        false,
      );
      assert.equal(await page.locator("#run").isVisible(), true);
      await background.evaluate(() =>
        window.commands.forEach((fn) => fn("toggle-focus")),
      );
      await wait();
      assert.equal(
        await page.locator('[data-testid="recommendations"]').isVisible(),
        true,
      );
    },
  );
  await check(
    "difficulty scenes react to dynamic difficulty labels",
    async () => {
      await studio
        .getByRole("switch", { name: "Match scenes to difficulty" })
        .check();
      await wait();
      const easy = await page
        .locator("html")
        .evaluate((e) => e.style.getPropertyValue("--gf-wallpaper"));
      await page
        .locator("[data-difficulty]")
        .evaluate((e) => (e.textContent = "Hard"));
      await wait();
      const hard = await page
        .locator("html")
        .evaluate((e) => e.style.getPropertyValue("--gf-wallpaper"));
      assert.notEqual(easy, hard);
    },
  );
  await check(
    "local PNG upload is optimized, stored in IndexedDB and served by compiled background",
    async () => {
      await studio.goto("https://vistara-ui.test/studio/index.html#wallpapers");
      await studio
        .locator("#wallpaper-upload")
        .setInputFiles("public/icons/icon128.png");
      await studio.locator(".wallpaper-tile").waitFor();
      await wait();
      assert.ok(memory.local.settings.studio.wallpaper);
      const image = await page
        .locator("body")
        .evaluate((e) => getComputedStyle(e).backgroundImage);
      assert.match(image, /data:image\/jpeg;base64/);
      assert.ok(!JSON.stringify(memory.sync).includes("data:image"));
      assert.equal(await studio.locator(".wallpaper-tile").count(), 1);
      await studio.reload();
      await studio.locator(".wallpaper-tile").waitFor();
      assert.equal(await studio.locator(".wallpaper-tile").count(), 1);
      await studio.screenshot({
        path: "screenshots/coding/studio-wallpaper.png",
        fullPage: true,
      });
    },
  );
  await check(
    "scene brightness, light glass and font controls update actual page",
    async () => {
      await studio.locator("#use-scene").click();
      await studio.goto("https://vistara-ui.test/studio/index.html#customize");
      await studio
        .getByRole("combobox", { name: "Glass appearance" })
        .selectOption("light");
      await studio
        .getByRole("slider", { name: "Code preview / textarea size" })
        .fill("18");
      await studio
        .getByRole("slider", { name: "Code preview / textarea size" })
        .dispatchEvent("input");
      await wait();
      assert.equal(
        await page
          .locator("html")
          .evaluate((e) => e.style.getPropertyValue("--gf-text")),
        "#162746",
      );
      assert.equal(
        await page
          .locator("html")
          .evaluate((e) => e.style.getPropertyValue("--gf-editor-size")),
        "18px",
      );
      assert.equal(
        await page
          .locator(".view-lines")
          .evaluate((el) => getComputedStyle(el).fontSize),
        "14px",
      );
      await page.screenshot({
        path: "screenshots/coding/leetcode-light.png",
        fullPage: true,
      });
    },
  );
  await check(
    "saved atmospheres restore scene, glass and appearance",
    async () => {
      await studio.locator("#look-name").fill("My coding corner");
      await studio.locator("#save-look").click();
      await wait();
      const saved = memory.local.settings.customPresets.find(
        (p) => p.name === "My coding corner",
      );
      assert.ok(saved.studio);
      await studio.goto("https://vistara-ui.test/studio/index.html#gallery");
      await studio.getByRole("button", { name: "Apply After hours" }).click();
      await wait();
      await studio.goto("https://vistara-ui.test/studio/index.html#customize");
      await studio
        .getByRole("combobox", { name: "Saved atmospheres" })
        .selectOption(saved.id);
      await wait();
      assert.equal(memory.local.settings.studio.scene, saved.studio.scene);
      assert.equal(memory.local.settings.studio.glass, saved.studio.glass);
    },
  );
  await check(
    "accepted moment appears once after an observed verdict transition",
    async () => {
      await studio.goto("https://vistara-ui.test/studio/index.html#flow");
      await studio
        .getByRole("switch", { name: "Accepted moments", exact: true })
        .check();
      await wait();
      await page.locator("#run").click();
      await wait();
      await page.locator("#submit").click();
      await page.waitForSelector('[data-vistara-ui="moment"]');
      assert.equal(await page.locator('[data-vistara-ui="moment"]').count(), 1);
    },
  );
  await check(
    "global OFF restores body background, code, focus and all engine-owned markers",
    async () => {
      await studio
        .getByRole("switch", { name: "Enable Vistara", exact: true })
        .uncheck();
      await wait();
      assert.equal(
        await page
          .locator(
            "[data-gf-surface],[data-gf-editor],[data-gf-workspace],[data-gf-distraction],[data-vistara-ui]",
          )
          .count(),
        0,
      );
      assert.equal(
        await page
          .locator("body")
          .evaluate((e) => getComputedStyle(e).backgroundImage),
        "none",
      );
      assert.equal(
        await page
          .locator(".mtk6")
          .first()
          .evaluate((e) => getComputedStyle(e).color),
        "rgb(197, 134, 192)",
      );
      await studio
        .getByRole("switch", { name: "Enable Vistara", exact: true })
        .check();
      await wait();
    },
  );
  await check(
    "share card reflects entered details and downloads an actual PNG",
    async () => {
      await studio.goto("https://vistara-ui.test/studio/index.html#share");
      await studio
        .locator("#share-title")
        .fill("Two Sum, one little breakthrough");
      await studio.locator("#share-name").fill("Vistara tester");
      const pending = studio.waitForEvent("download");
      await studio.locator("#download-share").click();
      const download = await pending;
      await download.saveAs("screenshots/coding/share-card.png");
      const bytes = await readFile("screenshots/coding/share-card.png");
      assert.equal(bytes.subarray(1, 4).toString(), "PNG");
      assert.ok(bytes.length > 10000);
    },
  );
  await check(
    "Studio narrow layout, keyboard focus and reduced-motion controls stay reachable",
    async () => {
      await studio.goto("https://vistara-ui.test/studio/index.html");
      await studio.setViewportSize({ width: 500, height: 900 });
      await studio.emulateMedia({ reducedMotion: "reduce" });
      assert.ok(
        await studio.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await studio
        .getByRole("button", { name: "Apply Moonlit escape" })
        .focus();
      assert.equal(
        await studio
          .getByRole("button", { name: "Apply Moonlit escape" })
          .evaluate((e) => document.activeElement === e),
        true,
      );
      await studio.screenshot({
        path: "screenshots/coding/studio-mobile.png",
        fullPage: true,
      });
    },
  );
  await check(
    "no uncaught bundle exceptions across coding and Studio tests",
    async () => assert.deepEqual(errors, []),
  );
  await writeFile(
    "docs/coding-browser-results.json",
    JSON.stringify(
      {
        version: JSON.parse(await readFile("package.json", "utf8")).version,
        date: new Date().toISOString(),
        type: "Compiled application and background bundles in Chromium, simulated Chrome APIs, representative local fixtures. Not live-site or native extension validation.",
        passed: results,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(results.length + " coding/Studio scenarios passed.");
} finally {
  await context.close();
  await browser.close();
}
