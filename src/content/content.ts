import { load } from "../shared/storage";
import { Engine } from "./engine";
function startContent() {
  const engine = new Engine();
  let ready: Promise<void>;
  const refreshNow = () =>
    (ready = load()
      .then((s) => engine.apply(s))
      .catch((error) => {
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
        reply({ status: engine.status, scanMs: engine.scanMs }),
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
