import { load } from "../shared/storage";
import { Engine } from "./engine";
const engine = new Engine();
let timer: ReturnType<typeof setTimeout>;
const refresh = () => {
  clearTimeout(timer);
  timer = setTimeout(
    () =>
      load()
        .then((s) => engine.apply(s))
        .catch(() => {
          engine.unmount();
          engine.status = "Storage error. Open settings to recover.";
        }),
    60,
  );
};
refresh();
chrome.storage.onChanged.addListener(refresh);
chrome.runtime.onMessage.addListener((message, _sender, reply) => {
  if (message.type === "VISTARA_STATUS")
    reply({ status: engine.status, scanMs: engine.scanMs });
  if (message.type === "VISTARA_BEFORE")
    reply({ before: engine.toggleBefore() });
});
// Navigation API catches same-document history changes without patching page scripts.
if ("navigation" in window)
  (
    window as unknown as { navigation: EventTarget }
  ).navigation.addEventListener("navigatesuccess", refresh);
