import { imageData } from "../shared/assets";
import { load, save } from "../shared/storage";
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (sender.id !== chrome.runtime.id) return;
  if (
    message?.type === "VISTARA_WALLPAPER" &&
    typeof message.id === "string" &&
    /^[a-f0-9-]{36}$/.test(message.id)
  ) {
    void imageData(message.id)
      .then((data) => reply({ data }))
      .catch(() => reply({ data: null }));
    return true;
  }
});
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-focus")
    void load()
      .then((s) => {
        s.studio.focus = !s.studio.focus;
        return save(s);
      })
      .catch(() => {});
});
