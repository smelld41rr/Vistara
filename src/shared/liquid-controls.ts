import { liquidDefaults, liquidPresets, type LiquidSettings } from "./liquid";
import { el, button, toggle } from "./ui";
export function liquidControls(
  container: HTMLElement,
  get: () => LiquidSettings,
  change: (settings: LiquidSettings) => void,
) {
  const s = get();
  container.replaceChildren();
  container.append(
    toggle(
      "Enable ChatGPT — Liquid Glass",
      s.enabled,
      (value) => change({ ...get(), enabled: value }),
      "ChatGPT only · OFF restores the original page",
    ),
  );
  const preview = el("div", {
    class: "liquid-control-preview",
    "aria-label": "Local pastel Liquid Glass demo",
  });
  const side = el("div", { class: "liquid-demo-sidebar" }, "◈  ChatGPT");
  const main = el("div", { class: "liquid-demo-main" });
  main.append(
    el("strong", {}, "Where should we begin?"),
    el(
      "div",
      { class: "liquid-demo-composer" },
      "+    Ask anything…                       ◉",
    ),
  );
  preview.append(side, main);
  container.append(preview);
  const repaint = () => {
    const value = get(),
      preset = liquidPresets[value.preset];
    preview.style.background = `radial-gradient(at 15% 15%,${preset.peach},transparent 65%),radial-gradient(at 80% 90%,${preset.lavender},transparent 60%),${preset.base}`;
    side.style.backgroundColor = `rgba(255,255,255,${value.sidebarOpacity})`;
    const composer = preview.querySelector<HTMLElement>(
      ".liquid-demo-composer",
    )!;
    composer.style.backgroundColor = `rgba(255,255,255,${value.composerOpacity})`;
    preview.style.setProperty("--liquid-preview-blur", value.blur / 3 + "px");
  };
  const pick = el("select", { "aria-label": "Pastel color preset" });
  for (const [id, preset] of Object.entries(liquidPresets)) {
    const option = el("option", { value: id }, preset.name);
    option.selected = id === s.preset;
    pick.append(option);
  }
  pick.onchange = () => {
    change({ ...get(), preset: pick.value as LiquidSettings["preset"] });
    repaint();
  };
  const presetLabel = el("label", { class: "field" }, "Pastel color preset");
  presetLabel.append(pick);
  container.append(presetLabel);
  for (const [key, label, min, max, step, unit] of [
    ["intensity", "Glass intensity", 0, 1, 0.01, "%"],
    ["blur", "Background blur", 4, 36, 1, "px"],
    ["brightness", "Background brightness", 0.75, 1.2, 0.01, "%"],
    ["sidebarOpacity", "Sidebar transparency", 0.12, 0.85, 0.01, "%"],
    ["composerOpacity", "Composer transparency", 0.2, 0.9, 0.01, "%"],
  ] as const) {
    const row = el("label", { class: "slider-row" });
    const caption = el("span", {}, label);
    const output = el("output");
    const input = el("input", {
      type: "range",
      min: String(min),
      max: String(max),
      step: String(step),
      "aria-label": label,
    });
    input.value = String(s[key]);
    const display = () =>
      (output.textContent =
        unit === "%"
          ? Math.round(Number(input.value) * 100) + "%"
          : input.value + "px");
    display();
    input.oninput = () => {
      display();
      change({ ...get(), [key]: Number(input.value) });
      repaint();
    };
    caption.append(output);
    row.append(caption, input);
    container.append(row);
  }
  container.append(
    el(
      "p",
      { class: "hint" },
      "Transparency sliders show glass opacity: lower values reveal more background. Blur controls panel frost and the softness of the ambient blend.",
    ),
    toggle(
      "Background animation",
      s.animation,
      (value) => change({ ...get(), animation: value }),
      "Optional slow ambient movement; paused in hidden tabs.",
    ),
    toggle(
      "Reduce Liquid Glass motion",
      s.reduceMotion,
      (value) => change({ ...get(), reduceMotion: value }),
      "System reduced-motion and accessibility preferences always win.",
    ),
    button("Reset Liquid Glass appearance", () => {
      const enabled = get().enabled;
      change({ ...liquidDefaults, enabled });
      liquidControls(container, get, change);
    }),
  );
  repaint();
}
