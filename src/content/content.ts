import { load } from "../shared/storage";
import { Engine } from "./engine";
function startContent() {
  const engine = new Engine();
  let ready: Promise<void>;
  let generation = 0;
  const refreshNow = () =>
    (ready = (async () => {
      const request = ++generation;
      const settings = await load();
      let wallpaper: string | null = null;
      if (
        settings.studio.wallpaper &&
        typeof chrome.runtime.sendMessage === "function"
      )
        try {
          const result = await chrome.runtime.sendMessage({
            type: "VISTARA_WALLPAPER",
            id: settings.studio.wallpaper,
          });
          wallpaper = result?.data ?? null;
        } catch {}
      if (request === generation) engine.apply(settings, wallpaper);
    })().catch((error) => {
      engine.unmount();
      engine.status = "Settings or styling error: " + String(error);
    }));
  let timer: ReturnType<typeof setTimeout>;
  const refresh = () => {
    clearTimeout(timer);
    timer = setTimeout(refreshNow, 60);
  };
  refreshNow();
  chrome.storage.onChanged.addListener(refresh);
  chrome.runtime.onMessage.addListener((message, _sender, reply) => {
    if (message.type === "VISTARA_STATUS") {
      void ready.then(() =>
        reply({
          status: engine.status,
          scanMs: engine.scanMs,
          coverage: engine.coverage,
        }),
      );
      return true;
    }
    if (message.type === "VISTARA_BEFORE") {
      void ready.then(() => reply({ before: engine.toggleBefore() }));
      return true;
    }
  });
  // Navigation API catches same-document history changes without patching page scripts.
  if ("navigation" in window)
    (
      window as unknown as { navigation: EventTarget }
    ).navigation.addEventListener("navigatesuccess", refresh);
}
// executeScript recovery and declarative injection may race: initialize once per
// isolated extension world, without duplicating observers or message listeners.
const world = globalThis as typeof globalThis & {
  __vistaraContentStarted?: boolean;
};
if (!world.__vistaraContentStarted) {
  startContent();
  world.__vistaraContentStarted = true;
}
