import { chromium } from "playwright";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
const dist = resolve("dist");
await mkdir("screenshots", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const memory = { local: {}, sync: {} };
await context.exposeBinding(
  "vistaraStorage",
  async ({ page }, op, area, data) => {
    if (op === "get") {
      const all = memory[area];
      if (typeof data === "string") return { [data]: all[data] };
      if (Array.isArray(data))
        return Object.fromEntries(data.map((k) => [k, all[k]]));
      return all;
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
            window.__storageListeners?.forEach((fn) => fn(changes, area)),
          { changes, area },
        )
        .catch(() => {});
  },
);
await context.exposeBinding(
  "vistaraTabs",
  async ({ page }, op, id, message) => {
    const pages = context
      .pages()
      .filter((p) => /youtube|chatgpt|fixture.test/.test(p.url()));
    const target = pages.at(-1);
    if (op === "query") return target ? [{ id: 1, url: target.url() }] : [];
    if (!target) throw Error("Page unavailable");
    return target.evaluate(
      (message) =>
        new Promise((resolve, reject) => {
          if (!window.__messageListeners?.length)
            return reject(Error("No content script"));
          for (const fn of window.__messageListeners) fn(message, {}, resolve);
        }),
      message,
    );
  },
);
await context.exposeBinding("vistaraInject", async () => {
  const target = context
    .pages()
    .filter((p) => /youtube|chatgpt|fixture.test/.test(p.url()))
    .at(-1);
  if (!target) throw Error("No eligible tab");
  await target.addScriptTag({
    content: await readFile(resolve(dist, "content.js"), "utf8"),
  });
});
await context.addInitScript(() => {
  window.__storageListeners = [];
  window.__messageListeners = [];
  const area = (name) => ({
    get: (keys) => window.vistaraStorage("get", name, keys),
    set: (data) => window.vistaraStorage("set", name, data),
  });
  window.chrome = {
    storage: {
      local: area("local"),
      sync: area("sync"),
      onChanged: { addListener: (fn) => window.__storageListeners.push(fn) },
    },
    scripting: { executeScript: () => window.vistaraInject() },
    runtime: {
      getManifest: () => ({ content_scripts: [{ js: ["content.js"] }] }),
      onMessage: { addListener: (fn) => window.__messageListeners.push(fn) },
      openOptionsPage: () => Promise.resolve(),
    },
    tabs: {
      query: () => window.vistaraTabs("query"),
      sendMessage: (id, message) => window.vistaraTabs("send", id, message),
    },
  };
});
await context.route("https://vistara-ui.test/**", async (r) => {
  const path = new URL(r.request().url()).pathname;
  try {
    const body = await readFile(dist + path);
    await r.fulfill({
      contentType: path.endsWith(".js")
        ? "text/javascript"
        : path.endsWith(".css")
          ? "text/css"
          : path.endsWith(".png")
            ? "image/png"
            : "text/html",
      body,
    });
  } catch {
    await r.fulfill({ status: 404, body: "Not found" });
  }
});
const errors = [];
context.on("page", (p) => p.on("pageerror", (e) => errors.push(e.message)));
const results = [];
async function check(name, fn) {
  await fn();
  results.push(name);
  console.log("PASS", name);
}
try {
  const id = "browser-harness";
  const options = await context.newPage();
  await options.goto(`https://vistara-ui.test/options/index.html`);
  await options.locator("#appearance-controls .theme").first().waitFor();
  const storage = async () =>
    options.evaluate(() => chrome.storage.local.get("settings"));
  const wait = () => new Promise((r) => setTimeout(r, 650));
  const set = async (fn) => {
    await options.evaluate(fn);
    await wait();
  };
  const fixture = (site) =>
    `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>${site} fixture — Vistara QA</title><style>*{box-sizing:border-box}body{margin:0;font:16px system-ui;background:var(--main-surface-primary,var(--yt-spec-base-background,#101522));color:var(--text-primary,var(--yt-spec-text-primary,#eef3ff))}header,ytd-masthead{display:flex;align-items:center;justify-content:space-between;padding:20px 30px;margin:15px;height:75px;background:var(--main-surface-secondary,var(--yt-spec-raised-background,#1a2235))}aside,nav{position:fixed;top:110px;bottom:20px;left:15px;width:220px;padding:25px;background:var(--main-surface-secondary,var(--yt-spec-raised-background,#192134))}aside a,nav a{display:block;color:inherit;text-decoration:none;padding:15px 0}main{margin:40px 35px 35px 270px}h1{font-size:36px;font-weight:600;letter-spacing:-1.4px;margin:10px 0}p{color:inherit;opacity:.8;line-height:1.8}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:35px}.video{height:165px;background:linear-gradient(135deg,#d6c5a0,#698b99 48%,#283d56);border-radius:12px}.two{background:linear-gradient(135deg,#a6c4e7,#6564a7 48%,#182c48)}.three{background:linear-gradient(135deg,#dbc0bb,#9b6c8e 48%,#443659)}#details,article{padding:18px;background:var(--main-surface-secondary,var(--yt-spec-raised-background,#1b2437));margin-top:9px}button{background:#9db7ff;color:#132440;border:0;padding:12px 22px;border-radius:8px;cursor:pointer}input,textarea{background:transparent;color:inherit;border:0;outline-offset:4px;padding:12px;font:inherit}form,#composer-background{padding:18px;background:#202b40;border-radius:18px;margin-top:35px;display:flex;justify-content:space-between}pre{background:#070c15;color:#8de8bd;padding:25px;border-radius:12px}label{font-size:12px}#result{margin-left:12px}.badge{font-size:11px;color:#a9b9dc;letter-spacing:1.5px}ytd-rich-grid-media{display:block}</style></head><body><ytd-masthead><header role="banner"><strong>◈ ${site === "youtube" ? "Video discovery" : site === "chatgpt" ? "Your creative space" : "A calmer corner of the web"}</strong><span class="badge">VISTARA · LOCAL TEST FIXTURE · NOT A LIVE WEBSITE</span><button id="action">Try a button</button><span id="result"></span></header></ytd-masthead><aside id="stage-slideover-sidebar"><strong>YOUR SPACE</strong><nav aria-label="Main"><a href="#home">⌂ &nbsp; Home</a><a href="#discover">◈ &nbsp; Discover</a><a href="#saved">♡ &nbsp; Saved for later</a><a href="#history">◷ &nbsp; Recently visited</a></nav></aside><main><label>ACTUAL COMPILED BUNDLE RENDER · REPRESENTATIVE ${site.toUpperCase()} FIXTURE</label><h1>${site === "chatgpt" ? "What will you create today?" : "A little more inspiration."}</h1><p>${site === "chatgpt" ? "A quiet space for your next big idea." : "Discover something that stays with you. Thoughtful stories, familiar places, fresh perspectives."}</p>${site === "chatgpt" ? '<article data-card><h2>A small idea, a whole new possibility.</h2><p>Plan an adventure. Learn something new. Make room for a little curiosity.</p><pre><code>const possibilities = ["explore", "create", "discover"];</code></pre></article>' : '<div class="cards">' + [0, 1, 2].map((x) => `<ytd-rich-grid-media><div class="video ${["", "two", "three"][x]}"></div><div id="details"><strong>${["Where the mountains meet the sky", "Designing a slower morning", "The art of noticing"][x]}</strong><p>A fresh perspective<br>12 min · Discover collection</p></div></ytd-rich-grid-media>`).join("") + "</div>"}<form data-type="unified-composer"><input aria-label="Message" placeholder="${site === "chatgpt" ? "Ask anything…" : "Search for a little inspiration…"}"><button type="submit">${site === "chatgpt" ? "Send ↑" : "Search ↗"}</button></form><p id="typed"></p></main><script>document.querySelector('#action').onclick=()=>document.querySelector('#result').textContent='Still works!';document.querySelector('form').onsubmit=e=>{e.preventDefault();document.querySelector('#typed').textContent=document.querySelector('input').value;};</script><script src="https://vistara-ui.test/content.js"></script></body></html>`;
  await context.route("https://www.youtube.com/**", (r) =>
    r.fulfill({ contentType: "text/html", body: fixture("youtube") }),
  );
  await context.route("https://chatgpt.com/**", (r) =>
    r.fulfill({ contentType: "text/html", body: fixture("chatgpt") }),
  );
  await context.route("http://fixture.test/**", (r) =>
    r.fulfill({ contentType: "text/html", body: fixture("generic") }),
  );
  const page = await context.newPage();
  await check(
    "compiled content bundle starts and selects YouTube adapter",
    async () => {
      await page.goto("https://www.youtube.com/");
      await page.waitForSelector('html[data-glassflow="on"]');
      assert.ok((await page.locator("[data-gf-surface]").count()) > 0);
      assert.equal(
        await page.locator("html").getAttribute("data-gf-adapter"),
        "youtube",
      );
    },
  );
  await check("host buttons and form values remain functional", async () => {
    await page.locator("#action").click();
    assert.equal(await page.locator("#result").textContent(), "Still works!");
    await page.locator("input").fill("Hello Vistara");
    await page.locator("form button").click();
    assert.equal(await page.locator("#typed").textContent(), "Hello Vistara");
  });
  await page.screenshot({
    path: "screenshots/youtube-midnight.png",
    fullPage: true,
  });
  await check(
    "global off removes styles and tokens; on restores without reload",
    async () => {
      await options.locator("#global input").uncheck();
      await wait();
      assert.equal(await page.locator("[data-gf-surface]").count(), 0);
      assert.equal(await page.locator("#vistara-styles").count(), 0);
      assert.equal(
        await page.locator("html").getAttribute("data-glassflow"),
        null,
      );
      await options.locator("#global input").check();
      await wait();
      await page.waitForSelector('html[data-glassflow="on"]');
    },
  );
  await check(
    "theme and sliders update the open page and persist",
    async () => {
      await options.locator('[data-theme="aurora"]').first().click();
      const range = options.getByRole("slider", { name: "Frosted blur" });
      await range.fill("25");
      await range.dispatchEvent("input");
      await wait();
      assert.equal(
        await page
          .locator("html")
          .evaluate((e) => e.style.getPropertyValue("--gf-blur")),
        "25px",
      );
      assert.equal(
        await page
          .locator("html")
          .evaluate((e) => e.style.getPropertyValue("--gf-base")),
        "#170e2b",
      );
      await options.reload();
      await options.locator("#appearance-controls .theme").first().waitFor();
      assert.equal(
        await options
          .getByRole("slider", { name: "Frosted blur" })
          .inputValue(),
        "25",
      );
    },
  );
  await check("compatibility disables blur and cards", async () => {
    await options
      .getByRole("button", { name: "Compatibility", exact: true })
      .click();
    await wait();
    assert.equal(await page.locator('[data-gf-surface="card"]').count(), 0);
    const value = await page
      .locator("[data-gf-surface]")
      .first()
      .evaluate((e) => getComputedStyle(e).backdropFilter);
    assert.equal(value, "none");
  });
  await options.locator("#reset-appearance").click();
  await wait();
  await page.screenshot({
    path: "screenshots/youtube-midnight.png",
    fullPage: true,
  });
  await check(
    "ChatGPT adapter preserves code, input, and SPA navigation",
    async () => {
      await page.goto("https://chatgpt.com/");
      await page.waitForSelector('[data-gf-adapter="chatgpt"]');
      assert.equal(await page.locator("code[data-gf-surface]").count(), 0);
      await page.locator("input").fill("A creative thought");
      await page.locator("form button").click();
      assert.equal(
        await page.locator("#typed").textContent(),
        "A creative thought",
      );
      await page.evaluate(() => history.pushState({}, "", "/c/test"));
      await wait();
      assert.equal(await page.locator("#vistara-styles").count(), 1);
    },
  );
  await page.screenshot({
    path: "screenshots/chatgpt-midnight.png",
    fullPage: true,
  });
  await options.locator('[data-theme="arctic"]').first().click();
  await wait();
  await page.screenshot({
    path: "screenshots/chatgpt-arctic.png",
    fullPage: true,
  });
  await check(
    "site rule overrides global and remains off after reload",
    async () => {
      await options.goto(`https://vistara-ui.test/options/index.html#sites`);
      await options.locator("#new-rule").click();
      await options
        .getByRole("textbox", { name: "Hostname", exact: true })
        .fill("chatgpt.com");
      await options
        .getByRole("switch", { name: "Enable for this site", exact: true })
        .uncheck();
      await options
        .getByRole("button", { name: "Save rule", exact: true })
        .click();
      await wait();
      assert.equal(await page.locator("[data-gf-surface]").count(), 0);
      await page.reload();
      await wait();
      assert.equal(await page.locator("[data-gf-surface]").count(), 0);
    },
  );
  await check(
    "per-site removal restores globals; dynamic nodes styled once",
    async () => {
      await options
        .getByRole("button", { name: "Remove", exact: true })
        .click();
      await wait();
      await page.waitForSelector("[data-gf-surface]");
      await page.evaluate(() => {
        const aside = document.createElement("aside");
        aside.textContent = "Dynamic sidebar";
        document.body.append(aside);
      });
      await wait();
      assert.equal(await page.locator("aside[data-gf-surface]").count(), 2);
      assert.equal(await page.locator("#vistara-styles").count(), 1);
    },
  );
  await check(
    "import rejects unsafe data and requires confirmation for valid replacement",
    async () => {
      await options.goto(`https://vistara-ui.test/options/index.html#data`);
      await options.locator("#import-json").fill('{"__proto__": {}}');
      await options.locator("#import").click();
      assert.match(await options.locator("#notice").textContent(), /rejected/);
      const s = (await storage()).settings;
      await options.locator("#import-json").fill(JSON.stringify(s));
      await options.locator("#import").click();
      assert.equal(await options.locator("#confirm-dialog").isVisible(), true);
      await options.locator("#cancel-confirm").click();
    },
  );
  await check(
    "preset create, rename, duplicate, apply and delete",
    async () => {
      await options.goto(`https://vistara-ui.test/options/index.html#presets`);
      await options.locator("#preset-name").fill("Calm day");
      await options.locator("#save-preset").click();
      assert.equal(await options.locator(".preset-item").count(), 1);
      await options
        .getByRole("button", { name: "Rename", exact: true })
        .click();
      await options
        .getByRole("textbox", { name: "New preset name" })
        .fill("Arctic calm");
      await options.getByRole("button", { name: "Save name" }).click();
      await options
        .getByRole("button", { name: "Duplicate", exact: true })
        .click();
      assert.equal(await options.locator(".preset-item").count(), 2);
      await options
        .getByRole("button", { name: "Apply", exact: true })
        .first()
        .click();
      await options
        .getByRole("button", { name: "Delete", exact: true })
        .first()
        .click();
      await options.locator("#accept-confirm").click();
      assert.equal(await options.locator(".preset-item").count(), 1);
    },
  );
  await check("sensitive form auto-pauses without reading values", async () => {
    await page.evaluate(() => {
      const input = document.createElement("input");
      input.type = "password";
      document.body.append(input);
    });
    await wait();
    assert.equal(await page.locator("[data-gf-surface]").count(), 0);
  });
  await check("popup loads, preview and theme controls work", async () => {
    await page.goto("https://www.youtube.com/");
    await wait();
    await page.bringToFront();
    const popup = await context.newPage();
    await popup.goto(`https://vistara-ui.test/popup/index.html`);
    await popup.locator(".theme").first().waitFor();
    await popup.locator('[data-theme="midnight"]').click();
    await wait();
    assert.equal(await popup.locator(".preview").count(), 1);
    await popup.setViewportSize({ width: 390, height: 850 });
    await popup.screenshot({ path: "screenshots/popup.png", fullPage: true });
    await popup.close();
  });
  await options.goto(`https://vistara-ui.test/options/index.html#appearance`);
  await options.locator("#appearance-controls .theme").first().waitFor();
  await options.screenshot({ path: "screenshots/options.png", fullPage: true });
  await check("narrow options and reduced motion remain usable", async () => {
    await options.setViewportSize({ width: 500, height: 900 });
    await options.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await options.locator("#reset-appearance").isVisible(), true);
    assert.ok(
      await options.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await options.screenshot({
      path: "screenshots/options-narrow.png",
      fullPage: true,
    });
  });
  await check(
    "all remaining adapters and generic fallback mount and unmount",
    async () => {
      const cases = [
        [
          "https://github.com/demo",
          "github",
          '<header class="AppHeader">Navigation</header><div class="js-issue-row">Issue</div><pre><code>untouched</code></pre>',
        ],
        [
          "https://www.google.com/search?q=test",
          "google",
          '<div id="hdtb">Navigation</div><div class="RNNXgb"><input aria-label="Search"></div>',
        ],
        [
          "https://www.reddit.com/",
          "reddit",
          "<header>Navigation</header><shreddit-post>Post</shreddit-post>",
        ],
        [
          "https://en.wikipedia.org/wiki/Test",
          "wikipedia",
          '<div class="vector-header-container">Navigation</div><main class="mw-body">Article</main>',
        ],
        [
          "http://fixture.test/generic",
          "generic",
          '<header role="banner">Navigation</header><article data-card>Card</article>',
        ],
      ];
      for (const [url, adapter, markup] of cases) {
        await context.route(url, (r) =>
          r.fulfill({
            contentType: "text/html",
            body:
              '<!doctype html><html><head><meta charset="UTF-8"></head><body>' +
              markup +
              '<script src="https://vistara-ui.test/content.js"></script></body></html>',
          }),
        );
        await page.goto(url);
        await page.waitForSelector("[data-gf-surface]");
        assert.equal(
          await page.locator("html").getAttribute("data-gf-adapter"),
          adapter,
        );
        assert.equal(await page.locator("code[data-gf-surface]").count(), 0);
      }
    },
  );
  await check(
    "before/after removes effects temporarily and restores them",
    async () => {
      await page.goto("https://www.youtube.com/");
      await page.waitForSelector("[data-gf-surface]");
      await page.evaluate(() =>
        window.__messageListeners.forEach((fn) =>
          fn({ type: "VISTARA_BEFORE" }, {}, () => {}),
        ),
      );
      assert.equal(await page.locator("[data-gf-surface]").count(), 0);
      await page.evaluate(() =>
        window.__messageListeners.forEach((fn) =>
          fn({ type: "VISTARA_BEFORE" }, {}, () => {}),
        ),
      );
      assert.ok((await page.locator("[data-gf-surface]").count()) > 0);
    },
  );
  await check(
    "ambient control updates page tokens; surface cap and disable restoration",
    async () => {
      await options.goto(
        "https://vistara-ui.test/options/index.html#appearance",
      );
      await options
        .getByRole("switch", { name: "Ambient background", exact: true })
        .uncheck();
      await wait();
      assert.equal(
        await page.locator("html").getAttribute("data-gf-ambient"),
        "false",
      );
      await options
        .getByRole("switch", { name: "Ambient background", exact: true })
        .check();
      await wait();
      await page.evaluate(() => {
        const section = document.createElement("section");
        for (let i = 0; i < 250; i++) {
          const n = document.createElement("ytd-rich-grid-media");
          const d = document.createElement("div");
          d.id = "details";
          d.textContent = "Dynamic surface";
          n.append(d);
          section.append(n);
        }
        document.body.append(section);
      });
      await wait();
      assert.ok((await page.locator("[data-gf-surface]").count()) <= 160);
      await options.locator("#global input").uncheck();
      await wait();
      assert.equal(
        await page
          .locator("html")
          .evaluate((e) => e.style.getPropertyValue("--gf-blur")),
        "",
      );
      assert.equal(await page.locator("[data-gf-surface]").count(), 0);
      await options.locator("#global input").check();
      await wait();
    },
  );
  await check(
    "Sync quota failure preserves new local preferences after reopening options",
    async () => {
      await options.evaluate(() => {
        chrome.storage.sync.set = async () => {
          throw Error("Quota test");
        };
      });
      await options.locator('[data-theme="orchid"]').first().click();
      await wait();
      assert.match(
        await options.locator("#notice").textContent(),
        /Saved locally/,
      );
      await options.reload();
      await options.locator("#appearance-controls .theme").first().waitFor();
      assert.equal(
        await options
          .locator('[data-theme="orchid"]')
          .first()
          .getAttribute("aria-pressed"),
        "true",
      );
    },
  );
  await check("page opt-out prevents styling", async () => {
    await context.route("http://fixture.test/optout", (r) =>
      r.fulfill({
        contentType: "text/html",
        body: '<html data-vistara-optout><body><header role="banner">Not themed</header><script src="https://vistara-ui.test/content.js"></script></body></html>',
      }),
    );
    await page.goto("http://fixture.test/optout");
    await wait();
    assert.equal(await page.locator("[data-gf-surface]").count(), 0);
  });
  await check(
    "popup repairs a missing content script in an already-open tab",
    async () => {
      await context.route("http://fixture.test/recover", (r) =>
        r.fulfill({
          contentType: "text/html",
          body: '<!doctype html><body><header role="banner">Recover this tab</header></body>',
        }),
      );
      await page.goto("http://fixture.test/recover");
      const popup = await context.newPage();
      await popup.goto("https://vistara-ui.test/popup/index.html");
      await page.waitForSelector("[data-gf-surface]");
      await popup.waitForFunction(() =>
        document.querySelector("#notice").textContent.includes("Active"),
      );
      assert.equal(await popup.locator("#repair").isVisible(), false);
      await page.addScriptTag({
        content: await readFile(resolve(dist, "content.js"), "utf8"),
      });
      assert.equal(
        await page.evaluate(() => window.__messageListeners.length),
        1,
      );
      assert.equal(await page.locator("#vistara-styles").count(), 1);
      await popup.close();
    },
  );
  await check("no uncaught extension or fixture page errors", async () =>
    assert.deepEqual(errors, []),
  );
  await writeFile(
    "docs/browser-results.json",
    JSON.stringify(
      {
        date: new Date().toISOString(),
        browser: context.browser()?.version(),
        type: "Compiled bundles in Chromium with simulated Chrome APIs and local representative fixtures. Administrator policy blocks unpacked-extension installation. Not a real extension install or live-site test.",
        passed: results,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(`${results.length} browser scenarios passed.`);
} finally {
  await context.close();
  await browser.close();
}
