import { init, save } from "../shared/storage";
import { defaults, eligible, resolve, type Settings } from "../shared/settings";
import {
  appearanceControls,
  makePreview,
  preview,
  toggle,
  notice,
  setStatus,
} from "../shared/ui";
let settings: Settings;
let tab: chrome.tabs.Tab | undefined;
let timer: ReturnType<typeof setTimeout>;
let saving = false;
async function persist() {
  saving = true;
  try {
    await save(settings);
    notice("Saved");
    await checkStatus();
  } catch (e) {
    notice(String(e), true);
  } finally {
    saving = false;
  }
}
function update() {
  setStatus(settings);
  preview(settings.appearance);
  clearTimeout(timer);
  timer = setTimeout(persist, 300);
}
async function checkStatus() {
  if (!tab?.id || !eligible(tab.url ?? "")) return;
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "VISTARA_STATUS",
    });
    if (response.status.startsWith("Safety")) notice(response.status);
    else if (!resolve(settings, tab.url ?? "").enabled)
      notice(resolve(settings, tab.url ?? "").reason);
  } catch {
    notice(
      "Page access unavailable. Grant site access in Chrome, then reload this page.",
      true,
    );
  }
}
function render() {
  setStatus(settings);
  document.querySelector("#master")!.replaceChildren(
    toggle("Enable Vistara globally", settings.enabled, (v) => {
      settings.enabled = v;
      update();
    }),
  );
  document.querySelector("#master label")!.classList.add("master");
  appearanceControls(
    document.querySelector("#controls")!,
    () => settings.appearance,
    (a) => {
      settings.appearance = a;
      update();
    },
  );
  const site = document.querySelector("#site")!;
  site.replaceChildren();
  if (tab?.url && eligible(tab.url)) {
    const host = new URL(tab.url).hostname;
    const effective = resolve({ ...settings, enabled: true }, tab.url);
    site.append(
      toggle(
        "This website",
        effective.enabled,
        (v) => {
          settings.siteOverrides = settings.siteOverrides.filter(
            (r) => !(r.host === host && !r.subdomains),
          );
          settings.siteOverrides.push({ host, subdomains: false, enabled: v });
          settings.excludedSites = settings.excludedSites.filter(
            (h) => h !== host,
          );
          update();
        },
        host,
      ),
    );
  } else {
    site.textContent = "Not available on this page";
    (document.querySelector("#before") as HTMLButtonElement).disabled = true;
  }
  preview(settings.appearance);
}
async function start() {
  settings = await init();
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  document.querySelector("#preview")!.append(makePreview());
  render();
  await checkStatus();
}
for (const id of ["settings", "open-options"])
  document
    .querySelector("#" + id)!
    .addEventListener("click", () => chrome.runtime.openOptionsPage());
document.querySelector("#preset-reset")!.addEventListener("click", () => {
  settings.appearance = {
    ...defaults.appearance,
    theme: settings.appearance.theme,
  };
  render();
  update();
});
document.querySelector("#before")!.addEventListener("click", async () => {
  try {
    if (!tab?.id) return;
    const result = await chrome.tabs.sendMessage(tab.id, {
      type: "VISTARA_BEFORE",
    });
    document
      .querySelector("#before")!
      .setAttribute("aria-pressed", String(result.before));
    notice(
      result.before
        ? "Original appearance · temporary for this tab"
        : "Theme restored",
    );
  } catch {
    notice(
      "Cannot reach this page. Reload it after granting site access.",
      true,
    );
  }
});
chrome.storage.onChanged.addListener(() => {
  if (saving || document.activeElement?.matches("input[type=range]")) return;
  clearTimeout(timer);
  timer = setTimeout(
    () =>
      init()
        .then((s) => {
          settings = s;
          render();
        })
        .catch((e) => notice(String(e), true)),
    150,
  );
});
window.addEventListener("pagehide", () => {
  clearTimeout(timer);
  if (settings) void save(settings);
});
start().catch((e) => notice(String(e), true));
