import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { cloneDefaults } from "../src/shared/settings.ts";
const dist = resolve("dist");
await mkdir("screenshots/liquid", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1672, height: 940 },
});
const memory = { local: { settings: cloneDefaults() }, sync: {} };
const errors = [];
const passed = [];
const requests = [];
context.on("page", (p) => {
  p.on("pageerror", (e) => errors.push({ page: p.url(), error: e.message }));
  p.on("request", (r) => requests.push(r.url()));
});
await context.exposeBinding("liquidStorage", async (_, op, area, data) => {
  const store = memory[area];
  if (op === "get") {
    return typeof data === "string"
      ? { [data]: store[data] }
      : Array.isArray(data)
        ? Object.fromEntries(data.map((k) => [k, store[k]]))
        : store;
  }
  const changes = {};
  for (const [key, value] of Object.entries(data)) {
    changes[key] = { oldValue: store[key], newValue: value };
    store[key] = value;
  }
  for (const page of context.pages())
    await page
      .evaluate(
        (changes) =>
          window.storageListeners.forEach((fn) => fn(changes, "local")),
        changes,
      )
      .catch(() => {});
});
await context.exposeBinding("liquidTabs", async (_, op, message) => {
  const tab = context
    .pages()
    .find((p) => p.url().startsWith("https://chatgpt.com/"));
  if (op === "query") return tab ? [{ id: 1, url: tab.url() }] : [];
  if (!tab) throw Error("No tab");
  return tab.evaluate(
    (message) =>
      new Promise((resolve, reject) => {
        if (!window.messageListeners.length)
          return reject(Error("No receiver"));
        for (const fn of window.messageListeners) fn(message, {}, resolve);
      }),
    message,
  );
});
await context.addInitScript(() => {
  window.storageListeners = [];
  window.messageListeners = [];
  const area = (name) => ({
    get: (keys) => window.liquidStorage("get", name, keys),
    set: (data) => window.liquidStorage("set", name, data),
  });
  window.chrome = {
    storage: {
      local: area("local"),
      sync: area("sync"),
      onChanged: { addListener: (fn) => window.storageListeners.push(fn) },
    },
    runtime: {
      onMessage: { addListener: (fn) => window.messageListeners.push(fn) },
      getManifest: () => ({ content_scripts: [{ js: ["content.js"] }] }),
      openOptionsPage: async () => {},
    },
    tabs: {
      query: () => window.liquidTabs("query"),
      sendMessage: (id, message) => window.liquidTabs("send", message),
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
const fixture = `<!doctype html><html lang="en" style="--vl-base:#abcdef!important" data-gf-adapter="author"><head><meta charset="UTF-8"><title>ChatGPT Liquid Glass — LOCAL FUNCTIONAL FIXTURE</title><style>*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--text-primary,#24242b);font:15px/1.5 system-ui,sans-serif}button,a,input,textarea,[contenteditable]{font:inherit}button{cursor:pointer;color:inherit;background:transparent;border:0}a{color:inherit;text-decoration:none}button:disabled{cursor:not-allowed}#app{display:flex;height:100dvh;overflow:hidden;background:#fff}#stage-slideover-sidebar{display:flex;flex-direction:column;flex:0 0 280px;width:280px;background:var(--sidebar-surface-primary,#f5f5f5);margin:6px 0 6px 6px;height:calc(100dvh - 12px);overflow:hidden}.sidebar-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;font-size:19px}.sidebar-head button{font-size:20px;padding:4px}.sidebar-scroll{overflow:auto;flex:1;min-height:0;padding:2px 12px}.sidebar-scroll a{display:block;padding:12px 16px;margin-bottom:4px;border-radius:14px}.sidebar-scroll a span{margin-right:14px;font-size:20px}.recent-title{font-size:11px;color:var(--text-secondary,#777);padding:25px 16px 8px}.recent{font-size:12px}.profile{padding:18px 20px;display:flex;gap:10px;align-items:center;color:var(--text-secondary,#777);font-size:13px}.avatar{width:30px;height:30px;border-radius:50%;background:#bdaab866}.profile small{display:block;font-size:11px}#content{display:flex;flex:1;min-width:0;flex-direction:column;background:var(--main-surface-primary,#fff)}#page-header{height:70px;display:flex;align-items:center;justify-content:center;position:relative;background:var(--main-surface-primary,#fff)}#page-header>button{position:absolute;left:20px;padding:9px}#page-header [data-testid=help]{left:auto;right:18px;border:1px solid #ddd;padding:10px;border-radius:14px}[data-testid=chat-work-toggle]{display:flex;padding:4px;gap:3px;background:#f2f2f2;border-radius:999px;width:240px}[role=tab]{flex:1;padding:7px 25px;font-size:14px}[role=tab][aria-selected=true]{background:white;border-radius:999px}main{flex:1;overflow:auto;min-height:0;background:var(--main-surface-primary,#fff)}#home{min-height:calc(100dvh - 85px);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px;padding:20px 35px 110px}h1{font-size:32px;font-weight:500;margin:0;line-height:1.3;letter-spacing:-.8px}form{width:min(850px,100%);margin:0}#composer-background{display:flex;align-items:center;gap:10px;min-height:72px;padding:10px 12px 10px 18px;background:var(--main-surface-secondary,#f4f4f4);border-radius:30px}#prompt-textarea{flex:1;min-width:0;white-space:pre-wrap;overflow-wrap:anywhere;min-height:24px;max-height:180px;overflow:auto;outline:none;font-size:16px}#prompt-textarea:empty:before{content:attr(data-placeholder);color:#888;pointer-events:none}.composer-button{flex-shrink:0;width:38px;height:38px;border-radius:50%;padding:0;font-size:22px}.thinking{font-size:15px;color:var(--text-secondary,#777);white-space:nowrap}.voice{background:#6569db;color:white;width:45px;height:45px;font-size:22px}.attachment-row{font-size:11px;color:var(--text-secondary,#777)}.conversation{max-width:850px;margin:0 auto;padding:40px 28px 160px}.conversation article{padding:18px;margin:12px 0;line-height:1.9}.conversation pre{background:#101827;color:#edf3ff;padding:20px;border-radius:12px;overflow:auto;font-size:13px}.keyword{color:#d69ade}.conversation table{border-collapse:collapse;width:100%}.conversation td,.conversation th{border:1px solid #aaa;padding:8px}.conversation textarea{width:100%}body[data-conversation=true] #home{min-height:auto;padding:20px 30px 35px;position:sticky;bottom:0}body[data-conversation=true] #home h1{display:none}#fixture-label{position:fixed;right:12px;bottom:7px;font-size:8px;letter-spacing:1px;color:#675e7799;pointer-events:none;z-index:30}[role=menu],[role=dialog]{position:fixed;right:40px;top:100px;background:white;color:#222;border:1px solid #ccc;padding:20px;z-index:40;min-width:200px}[role=menu] button,[role=dialog] button{padding:8px}body[data-sidebar-collapsed=true] #stage-slideover-sidebar{width:0;flex-basis:0;visibility:hidden;margin-left:0}a:focus-visible,button:focus-visible{outline:2px solid #8185cc;outline-offset:3px}@media(max-width:760px){#stage-slideover-sidebar{position:fixed;left:0;top:0;bottom:0;z-index:25;display:none;background:#f7f7f7;width:270px}body[data-mobile-sidebar=true] #stage-slideover-sidebar{display:flex}#page-header{height:60px}#page-header [data-testid=chat-work-toggle]{width:180px}#home{padding:20px 16px 90px;gap:24px}h1{font-size:26px}#composer-background{gap:3px;min-height:65px;padding-left:9px}.composer-button{width:30px;height:33px;font-size:19px}.voice{width:36px;height:36px}.thinking{font-size:11px}#prompt-textarea{font-size:14px}.conversation{padding:20px 16px 120px}body[data-conversation=true] #home{padding:20px 16px}}</style></head><body><div id="app"><aside id="stage-slideover-sidebar" aria-label="Chat history"><div class="sidebar-head"><strong>ChatGPT</strong><button aria-label="Search chats">⌕</button><button aria-label="Collapse sidebar">◫</button></div><div class="sidebar-scroll"><a href="/" aria-current="page"><span>□</span>New chat</a><a href="#scheduled"><span>◷</span>Scheduled</a><a href="#plugins"><span>◎</span>Plugins</a><a href="#projects"><span>▱</span>Projects</a><a href="#explore"><span>⋯</span>Explore</a><div class="recent-title">Recent conversations</div>${Array.from({ length: 24 }, (_, i) => `<a class="recent" href="/c/example-${i}">A fresh perspective ${i + 1}</a>`).join("")}</div><div class="profile"><span class="avatar"></span><span>Local fixture account<small>Theme test</small></span></div></aside><div id="content"><header id="page-header"><button aria-label="Toggle sidebar">◫</button><div role="tablist" aria-label="Chat mode" data-testid="chat-work-toggle"><button role="tab" aria-selected="true">Chat</button><button role="tab" aria-selected="false">Work</button></div><button data-testid="help" aria-label="Open settings dialog">◔</button></header><main><div id="conversation" class="conversation" hidden></div><div id="home"><h1 data-testid="home-heading">Where should we begin?</h1><form data-type="unified-composer"><div class="attachment-row" id="attachment-row"></div><div id="composer-background"><button type="button" class="composer-button" id="attach" aria-label="Attach a file">＋</button><input type="file" id="upload" hidden><div id="prompt-textarea" contenteditable="true" role="textbox" aria-label="Message ChatGPT" data-placeholder="Ask ChatGPT"></div><button type="button" class="thinking" aria-label="Thinking effort">High ⌄</button><button type="button" class="composer-button" id="microphone" aria-label="Microphone" aria-pressed="false">♩</button><button type="submit" class="composer-button voice" data-testid="send-button" aria-label="Send message">↑</button></div></form></div></main></div></div><span id="fixture-label">LOCAL FUNCTIONAL FIXTURE · NOT LIVE CHATGPT</span><script>
window.submissions=[];const toggle=()=>{if(innerWidth<=760)document.body.dataset.mobileSidebar=document.body.dataset.mobileSidebar==='true'?'false':'true';else document.body.dataset.sidebarCollapsed=document.body.dataset.sidebarCollapsed==='true'?'false':'true';};document.querySelector('[aria-label="Toggle sidebar"]').onclick=toggle;document.querySelector('[aria-label="Collapse sidebar"]').onclick=toggle;
for(const button of document.querySelectorAll('[role=tab]'))button.onclick=()=>{for(const b of document.querySelectorAll('[role=tab]'))b.setAttribute('aria-selected',String(b===button));document.body.dataset.mode=button.textContent;};
document.querySelector('[aria-label="Thinking effort"]').onclick=()=>{const menu=document.createElement('div');menu.setAttribute('role','menu');const b=document.createElement('button');b.textContent='Choose standard effort';b.onclick=()=>{document.querySelector('[aria-label="Thinking effort"]').textContent='Standard ⌄';menu.remove();};menu.append(b);document.body.append(menu);};
document.querySelector('[data-testid=help]').onclick=()=>{const dialog=document.createElement('div');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-label','Fixture settings');const b=document.createElement('button');b.textContent='Close settings';b.onclick=()=>dialog.remove();dialog.append(b);document.body.append(dialog);};
document.querySelector('#microphone').onclick=e=>e.currentTarget.setAttribute('aria-pressed',String(e.currentTarget.getAttribute('aria-pressed')!=='true'));document.querySelector('#attach').onclick=()=>document.querySelector('#upload').click();document.querySelector('#upload').onchange=e=>document.querySelector('#attachment-row').textContent=e.target.files[0]?.name??'';
window.showConversation=()=>{document.body.dataset.conversation='true';const c=document.querySelector('#conversation');c.hidden=false;if(!c.children.length)c.innerHTML='<article data-testid="conversation-turn-1"><div data-message-author-role="assistant" class="markdown"><h1>A conversation heading</h1><p>Here is a small example. Your text, code and tables stay intact.</p><pre><code><span class="keyword">const</span> possibilities = [1, 2, 3];</code></pre><table><tr><th>Item</th><th>Value</th></tr><tr><td>One</td><td>1</td></tr></table></div></article>';};
for(const link of document.querySelectorAll('.recent'))link.onclick=e=>{e.preventDefault();history.pushState({},'',link.getAttribute('href'));showConversation();};document.querySelector('form').onsubmit=e=>{e.preventDefault();const input=document.querySelector('#prompt-textarea');const text=input.innerText;if(!text.trim())return;window.submissions.push(text);showConversation();const c=document.querySelector('#conversation');const user=document.createElement('article');user.dataset.testid='conversation-turn-user';const message=document.createElement('div');message.dataset.messageAuthorRole='user';message.textContent=text;user.append(message);c.append(user);const assistant=document.createElement('article');assistant.dataset.testid='conversation-turn-stream';const p=document.createElement('p');p.dataset.testid='stream';assistant.append(p);c.append(assistant);input.textContent='';let i=0;const chunks=['Thinking clearly.','Thinking clearly. One step','Thinking clearly. One step at a time.'];const timer=setInterval(()=>{p.textContent=chunks[i++];if(i===chunks.length)clearInterval(timer);},60);};if(location.pathname.startsWith('/c/'))showConversation();
</script><script src="https://vistara-ui.test/content.js"></script></body></html>`;
await context.route("https://chatgpt.com/**", (r) =>
  r.fulfill({ contentType: "text/html", body: fixture }),
);
await context.route("https://leetcode.com/**", (r) =>
  r.fulfill({
    contentType: "text/html",
    body: '<!doctype html><body><header>LeetCode</header><div id="__next"><section id="description">Description</section><section data-testid="testcase-panel">Tests</section><div class="monaco-editor" style="color:white;background:#111"><div class="view-lines">Editor</div></div></div><script src="https://vistara-ui.test/content.js"></script></body>',
  }),
);
await context.route("https://foo.chatgpt.com/**", (r) =>
  r.fulfill({
    contentType: "text/html",
    body: '<!doctype html><body><main>Subdomain not eligible for Liquid Glass</main><script src="https://vistara-ui.test/content.js"></script></body>',
  }),
);
async function check(name, fn) {
  await fn();
  passed.push(name);
  console.log("PASS", name);
}
const wait = () => new Promise((r) => setTimeout(r, 650));
try {
  const page = await context.newPage();
  await page.goto("https://chatgpt.com/");
  await page.waitForTimeout(100);
  const original = await page.evaluate(() => ({
    bodyBackground: getComputedStyle(document.body).backgroundColor,
    base: document.documentElement.style.getPropertyValue("--vl-base"),
    priority: document.documentElement.style.getPropertyPriority("--vl-base"),
    adapter: document.documentElement.getAttribute("data-gf-adapter"),
    composer: document
      .querySelector("#composer-background")
      .getBoundingClientRect()
      .toJSON(),
  }));
  await check(
    "default OFF leaves original ChatGPT appearance and author tokens intact",
    async () => {
      assert.equal(
        await page.locator("[data-vl-decoration],[data-vl-part]").count(),
        0,
      );
      assert.equal(await page.locator("#vistara-styles").count(), 0);
      assert.equal(
        await page
          .locator("body")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        original.bodyBackground,
      );
    },
  );
  const popup = await context.newPage();
  await popup.goto("https://vistara-ui.test/popup/index.html");
  await popup
    .getByRole("switch", { name: "Enable ChatGPT — Liquid Glass" })
    .waitFor();
  await check(
    "popup toggle enables real compiled content bundle without reloading",
    async () => {
      await popup
        .getByRole("switch", { name: "Enable ChatGPT — Liquid Glass" })
        .check();
      await page.waitForSelector('html[data-vistara-liquid="on"]');
      assert.equal(await page.locator("[data-vl-decoration]").count(), 1);
      assert.equal(await page.locator('[data-vl-part="sidebar"]').count(), 1);
      assert.equal(await page.locator('[data-vl-part="composer"]').count(), 1);
      assert.equal(await page.locator('[data-vl-part="segment"]').count(), 1);
    },
  );
  await check(
    "reference ocean backdrop covers viewport behind clickable content and preserves composer geometry",
    async () => {
      const bounds = await page.locator("[data-vl-decoration]").boundingBox();
      assert.equal(bounds.width, 1672);
      assert.equal(bounds.height, 940);
      assert.equal(
        await page
          .locator("[data-vl-decoration]")
          .evaluate((el) => getComputedStyle(el).pointerEvents),
        "none",
      );
      assert.equal(
        await page
          .locator("#app")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        "rgba(0, 0, 0, 0)",
      );
      const current = await page.locator("#composer-background").boundingBox();
      assert.ok(Math.abs(current.width - original.composer.width) < 1);
      assert.ok(Math.abs(current.height - original.composer.height) < 1);
      await page.screenshot({
        path: "screenshots/liquid/home-ocean-1672.png",
        fullPage: true,
      });
    },
  );
  await check("ocean reference styles preserve native suggestion handlers and pastel preset switching", async () => {
    assert.equal(await page.locator("html").getAttribute("data-vl-preset"), "ocean");
    await page.evaluate(() => {
      const group = document.createElement("div");
      group.id = "fixture-suggestions";
      group.style.cssText = "display:grid;gap:9px;width:min(760px,100%)";
      for (const text of ["Review a workflow safely", "Plan this week's work", "Summarize an email"]) {
        const card = document.createElement("button");
        card.dataset.testid = "suggestion-card";
        card.textContent = text + "   →";
        card.style.cssText = "text-align:left;padding:15px 20px";
        card.onclick = () => { document.querySelector("#prompt-textarea").textContent = text; };
        group.append(card);
      }
      document.querySelector("#home").append(group);
    });
    await page.waitForSelector('[data-vl-part="suggestion"]');
    await page.getByRole("button", {name:"Review a workflow safely"}).click();
    assert.equal(await page.locator("#prompt-textarea").textContent(), "Review a workflow safely");
    await page.locator("#prompt-textarea").fill("");
    const color = await page.locator("#prompt-textarea").evaluate(el => getComputedStyle(el).color);
    assert.equal(color, "rgb(244, 248, 255)");
    assert.equal(await page.locator('[data-testid="suggestion-card"]').count(), 3);
    await page.screenshot({path:"screenshots/liquid/reference-ocean.png",fullPage:true});
    await popup.getByRole("combobox", {name:"Color preset"}).selectOption("peach");
    await page.waitForSelector('html[data-vl-preset="peach"]');
    assert.equal(await page.locator("#prompt-textarea").evaluate(el=>getComputedStyle(el).color), "rgb(57, 53, 64)");
    await popup.getByRole("combobox", {name:"Color preset"}).selectOption("ocean");
    await page.waitForSelector('html[data-vl-preset="ocean"]');
    await page.locator("#fixture-suggestions").evaluate(el=>el.remove());
  });
  await check(
    "all popup effects persist and apply live to the page",
    async () => {
      await popup
        .getByRole("slider", { name: "Background blur", exact: true })
        .fill("34");
      await popup
        .getByRole("slider", { name: "Background blur", exact: true })
        .dispatchEvent("input");
      await popup
        .getByRole("slider", { name: "Sidebar transparency", exact: true })
        .fill("0.35");
      await popup
        .getByRole("slider", { name: "Sidebar transparency", exact: true })
        .dispatchEvent("input");
      await popup
        .getByRole("combobox", { name: "Color preset" })
        .selectOption("lavender");
      await wait();
      assert.equal(
        await page
          .locator("html")
          .evaluate((el) => el.style.getPropertyValue("--vl-blur")),
        "34px",
      );
      assert.equal(
        await page
          .locator("html")
          .evaluate((el) => el.style.getPropertyValue("--vl-sidebar-opacity")),
        "0.35",
      );
      assert.equal(memory.local.settings.chatgpt.preset, "lavender");
      assert.ok(!memory.sync.shared?.chatgpt);
      await popup.reload();
      await popup
        .getByRole("switch", { name: "Enable ChatGPT — Liquid Glass" })
        .waitFor();
      assert.equal(
        await popup
          .getByRole("combobox", { name: "Color preset" })
          .inputValue(),
        "lavender",
      );
    },
  );
  await popup
    .getByRole("button", { name: "Reset Liquid Glass appearance" })
    .click();
  await wait();
  await popup.setViewportSize({ width: 390, height: 600 });
  await popup.locator("#chatgpt-liquid-section").scrollIntoViewIfNeeded();
  await popup.screenshot({
    path: "screenshots/liquid/popup-controls.png",
    fullPage: true,
  });
  await check(
    "multiline typing, send and streamed fixture updates preserve native handlers",
    async () => {
      await page
        .getByRole("textbox", { name: "Message ChatGPT" })
        .fill("First line\nSecond line");
      assert.equal(
        await page
          .getByRole("textbox", { name: "Message ChatGPT" })
          .innerText(),
        "First line\nSecond line",
      );
      await page.getByRole("button", { name: "Send message" }).click();
      await page.waitForFunction(
        () =>
          document.querySelector("[data-testid=stream]")?.textContent ===
          "Thinking clearly. One step at a time.",
      );
      assert.deepEqual(await page.evaluate(() => window.submissions), [
        "First line\nSecond line",
      ]);
      assert.equal(
        await page.locator('[data-message-author-role="user"]').textContent(),
        "First line\nSecond line",
      );
      await wait();
      assert.equal(await page.locator('[data-vl-part="code"]').count(), 1);
      assert.equal(
        await page
          .locator(".keyword")
          .evaluate((el) => getComputedStyle(el).color),
        "rgb(214, 154, 222)",
      );
      assert.equal(await page.locator("table td").first().textContent(), "One");
      await page.screenshot({
        path: "screenshots/liquid/conversation-ocean.png",
        fullPage: true,
      });
    },
  );
  await check(
    "existing menus, file selection, microphone state and Chat/Work switch remain functional",
    async () => {
      await page.getByRole("button", { name: "Thinking effort" }).click();
      await page.waitForSelector('[role="menu"][data-vl-part="menu"]');
      await page
        .getByRole("button", { name: "Choose standard effort" })
        .click();
      assert.match(
        await page
          .getByRole("button", { name: "Thinking effort" })
          .textContent(),
        /Standard/,
      );
      const chooser = page.waitForEvent("filechooser");
      await page.getByRole("button", { name: "Attach a file" }).click();
      await (await chooser).setFiles("public/icons/icon16.png");
      assert.equal(
        await page.locator("#attachment-row").textContent(),
        "icon16.png",
      );
      await page
        .getByRole("button", { name: "Microphone", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "Microphone", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      await page.getByRole("tab", { name: "Work", exact: true }).click();
      assert.equal(
        await page.locator("body").getAttribute("data-mode"),
        "Work",
      );
      await page.getByRole("button", { name: "Open settings dialog" }).click();
      await page.waitForSelector("[role=dialog][data-vl-part=dialog]");
      await page.getByRole("button", { name: "Close settings" }).click();
    },
  );
  await check(
    "sidebar collapse/reopen, history scroll and SPA routes never duplicate layers",
    async () => {
      await page.getByRole("button", { name: "Toggle sidebar" }).click();
      assert.equal(
        await page.locator("#stage-slideover-sidebar").isVisible(),
        false,
      );
      await page.getByRole("button", { name: "Toggle sidebar" }).click();
      assert.equal(
        await page.locator("#stage-slideover-sidebar").isVisible(),
        true,
      );
      await page
        .locator(".sidebar-scroll")
        .evaluate((el) => (el.scrollTop = 180));
      assert.ok(
        (await page.locator(".sidebar-scroll").evaluate((el) => el.scrollTop)) >
          0,
      );
      await page.locator(".recent").nth(3).click();
      await wait();
      assert.match(page.url(), /\/c\/example-3/);
      assert.equal(await page.locator("[data-vl-decoration]").count(), 1);
      assert.equal(await page.locator("#vistara-styles").count(), 1);
      assert.equal(await page.locator('[data-vl-part="composer"]').count(), 1);
    },
  );
  await check("animation respects user and system reduced motion", async () => {
    await popup
      .getByRole("switch", { name: "Background animation", exact: true })
      .check();
    await wait();
    assert.equal(
      await page.locator("html").getAttribute("data-vl-motion"),
      "true",
    );
    await page.bringToFront();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () => document.documentElement.getAttribute("data-vl-motion") === "false",
    );
    assert.equal(
      await page.locator("html").getAttribute("data-vl-motion"),
      "false",
    );
    assert.equal(
      await page
        .locator(".vl-aurora")
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await popup
      .getByRole("switch", { name: "Reduce Liquid Glass motion" })
      .check();
    await wait();
    assert.equal(
      await page.locator("html").getAttribute("data-vl-motion"),
      "false",
    );
  });
  await check(
    "OFF removes every liquid layer/marker/token and restores author styles",
    async () => {
      await popup
        .getByRole("switch", { name: "Enable ChatGPT — Liquid Glass" })
        .uncheck();
      await wait();
      assert.equal(
        await page
          .locator("[data-vl-part],[data-vl-decoration],#vistara-styles")
          .count(),
        0,
      );
      assert.equal(
        await page.locator("html").getAttribute("data-vistara-liquid"),
        null,
      );
      assert.equal(
        await page.locator("html").getAttribute("data-gf-adapter"),
        original.adapter,
      );
      assert.equal(
        await page
          .locator("html")
          .evaluate((el) => el.style.getPropertyValue("--vl-base")),
        original.base,
      );
      assert.equal(
        await page
          .locator("html")
          .evaluate((el) => el.style.getPropertyPriority("--vl-base")),
        original.priority,
      );
      assert.equal(
        await page
          .locator("body")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        original.bodyBackground,
      );
      assert.equal(
        await page
          .locator("pre")
          .evaluate((el) => el.style.getPropertyValue("--vl-code-bg")),
        "",
      );
    },
  );
  await popup
    .getByRole("switch", { name: "Enable ChatGPT — Liquid Glass" })
    .check();
  await wait();
  await popup.close();
  await check(
    "Studio exposes the same ChatGPT controls and persisted theme survives page refresh",
    async () => {
      const studio = await context.newPage();
      await studio.goto("https://vistara-ui.test/studio/index.html#chatgpt");
      await studio
        .getByRole("switch", { name: "Enable ChatGPT — Liquid Glass" })
        .waitFor();
      assert.equal(await studio.locator("#chatgpt").isVisible(), true);
      assert.equal(
        await studio
          .getByRole("switch", { name: "Enable ChatGPT — Liquid Glass" })
          .isChecked(),
        true,
      );
      await studio
        .getByRole("combobox", { name: "Color preset" })
        .selectOption("sky");
      await wait();
      await page.reload();
      await page.waitForSelector('html[data-vistara-liquid="on"]');
      assert.equal(
        await page
          .locator("html")
          .evaluate((el) => el.style.getPropertyValue("--vl-sky")),
        "#C8E3FA",
      );
      await studio
        .getByRole("button", { name: "Reset Liquid Glass appearance" })
        .click();
      await wait();
      await studio.close();
    },
  );
  await page.goto("https://chatgpt.com/");
  await page.waitForSelector("[data-vl-decoration]");
  await check(
    "responsive 1920 / 1440 / 1366 / tablet / mobile preserve viewport and controls",
    async () => {
      for (const [width, height] of [
        [1920, 1080],
        [1440, 900],
        [1366, 768],
        [800, 1000],
        [390, 844],
      ]) {
        await page.setViewportSize({ width, height });
        await page.waitForTimeout(100);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        const composer = await page
          .locator("#composer-background")
          .boundingBox();
        assert.ok(composer.x >= 0 && composer.x + composer.width <= width);
        assert.equal(
          await page.getByRole("button", { name: "Send message" }).isVisible(),
          true,
        );
        if (width === 390) {
          await page.getByRole("button", { name: "Toggle sidebar" }).click();
          assert.equal(
            await page.locator("#stage-slideover-sidebar").isVisible(),
            true,
          );
          await page.getByRole("button", { name: "Collapse sidebar" }).click();
          assert.equal(
            await page.locator("#stage-slideover-sidebar").isVisible(),
            false,
          );
        }
        if ([1920, 1366, 390].includes(width))
          await page.screenshot({
            path: `screenshots/liquid/home-${width}.png`,
            fullPage: true,
          });
      }
    },
  );
  await check(
    "non-ChatGPT coding pages and ChatGPT subdomains never receive liquid styling",
    async () => {
      const code = await context.newPage();
      await code.goto("https://leetcode.com/problems/two-sum/");
      await code.waitForSelector('[data-gf-coding="true"]');
      assert.equal(
        await code.locator("[data-vl-decoration],[data-vl-part]").count(),
        0,
      );
      assert.ok((await code.locator('[data-gf-surface="panel"]').count()) >= 2);
      const sub = await context.newPage();
      await sub.goto("https://foo.chatgpt.com/");
      await sub.waitForTimeout(150);
      assert.equal(await sub.locator("[data-vl-decoration]").count(), 0);
      await code.close();
      await sub.close();
    },
  );
  await check(
    "global master OFF and exact-host OFF still override Liquid Glass",
    async () => {
      const panel = await context.newPage();
      await panel.goto("https://vistara-ui.test/popup/index.html");
      await panel
        .getByRole("switch", { name: "Enable Vistara globally" })
        .waitFor();
      await panel
        .getByRole("switch", { name: "Enable Vistara globally" })
        .uncheck();
      await wait();
      assert.equal(await page.locator("[data-vl-decoration]").count(), 0);
      await panel
        .getByRole("switch", { name: "Enable Vistara globally" })
        .check();
      await wait();
      await panel
        .getByRole("switch", { name: "This website", exact: true })
        .uncheck();
      await wait();
      assert.equal(await page.locator("[data-vl-decoration]").count(), 0);
      await panel
        .getByRole("switch", { name: "This website", exact: true })
        .check();
      await wait();
      await panel.close();
    },
  );
  await check(
    "visible authentication input pauses styling without reading its value",
    async () => {
      await page.evaluate(() => {
        const input = document.createElement("input");
        input.type = "password";
        input.id = "visible-login";
        document.body.append(input);
      });
      await wait();
      assert.equal(await page.locator("[data-vl-decoration]").count(), 0);
    },
  );
  await check("no external requests or uncaught bundle errors", async () => {
    assert.deepEqual(errors, []);
    assert.ok(
      requests.every(
        (url) =>
          url.startsWith("https://vistara-ui.test/") ||
          url.startsWith("https://chatgpt.com/") ||
          url.startsWith("https://leetcode.com/") ||
          url.startsWith("https://foo.chatgpt.com/") ||
          url.startsWith("data:"),
      ),
    );
  });
  await writeFile(
    "docs/liquid-browser-results.json",
    JSON.stringify(
      {
        version: "2.2.0",
        date: new Date().toISOString(),
        method:
          "Compiled extension bundles in Chromium with simulated Chrome APIs and local representative ChatGPT/coding fixtures. No live/authenticated or native MV3 verification.",
        passed,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(passed.length + " Liquid Glass browser scenarios passed.");
} finally {
  await context.close();
  await browser.close();
}
