import {
  themes,
  type Appearance,
  type Settings,
  type Theme,
  type Mode,
} from "./settings";
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}
export function button(text: string, action: () => void, cls = "button") {
  const b = el("button", { type: "button", class: cls }, text);
  b.addEventListener("click", action);
  return b;
}
export function notice(message: string, error = false) {
  const n = document.querySelector<HTMLElement>("#notice")!;
  n.textContent = message;
  n.classList.toggle("error", error);
}
export function preview(a: Appearance) {
  for (const panel of document.querySelectorAll<HTMLElement>(".preview")) {
    const t = themes[a.theme];
    panel.style.setProperty("--preview-base", t.base);
    panel.style.setProperty("--preview-fill", t.fill);
    panel.style.setProperty("--preview-text", t.text);
    panel.style.setProperty("--preview-accent", t.accent);
    panel.style.setProperty("--preview-glow", t.glow);
    panel.style.setProperty("--preview-opacity", String(a.opacity));
    panel.style.setProperty("--preview-radius", `${a.radius / 2}px`);
    panel.style.setProperty("--preview-blur", `${a.blur}px`);
    panel.style.setProperty(
      "--preview-intensity",
      String(a.ambient ? a.intensity : 0),
    );
    panel.dataset.mode = a.mode;
  }
}
export function makePreview() {
  const p = el("div", {
    class: "preview",
    "aria-label": "Local theme preview. No website content is read.",
  });
  const top = el("div", { class: "mini-top" });
  top.append(
    el("span", {}, "● ● ●"),
    el("span", {}, "Your little corner of the web"),
    el("span", {}, "◇"),
  );
  const layout = el("div", { class: "mini-layout" });
  const side = el("div", { class: "mini-side" });
  for (const t of ["◈", "⌂", "▦", "♡"]) side.append(el("span", {}, t));
  const content = el("div", { class: "mini-content" });
  content.append(
    el("small", { class: "eyebrow" }, "A FRESH PERSPECTIVE"),
    el("strong", {}, "Make yourself at home."),
  );
  const cards = el("div", { class: "mini-cards" });
  for (let i = 0; i < 3; i++) {
    const c = el("div", { class: "mini-card" });
    c.append(
      el("div", { class: "mini-art art-" + i }),
      el("span", {}, ["Less noise.", "More wonder.", "Your world."][i]),
    );
    cards.append(c);
  }
  content.append(cards);
  layout.append(side, content);
  p.append(
    top,
    layout,
    el("div", { class: "preview-label" }, "● LIVE PREVIEW"),
  );
  return p;
}
export function toggle(
  label: string,
  checked: boolean,
  change: (v: boolean) => void,
  detail?: string,
) {
  const wrap = el("label", { class: "toggle-row" });
  const words = el("span");
  words.append(el("strong", {}, label));
  if (detail) words.append(el("small", {}, detail));
  const input = el("input", {
    type: "checkbox",
    role: "switch",
    "aria-label": label,
  });
  input.checked = checked;
  input.addEventListener("change", () => change(input.checked));
  wrap.append(words, input);
  return wrap;
}
export function heading(title: string, kicker: string) {
  const h = el("div", { class: "section-heading" });
  h.append(el("h2", {}, title), el("span", {}, kicker));
  return h;
}
export function appearanceControls(
  container: HTMLElement,
  get: () => Appearance,
  change: (next: Appearance) => void,
  advanced = false,
) {
  container.replaceChildren();
  const a = get();
  container.append(heading("Find your atmosphere", "01 / APPEARANCE"));
  const grid = el("div", { class: "theme-grid" });
  for (const [id, t] of Object.entries(themes)) {
    const b = button(
      t.name,
      () => {
        change({ ...get(), theme: id as Theme });
        appearanceControls(container, get, change, advanced);
      },
      "theme",
    );
    b.dataset.theme = id;
    b.setAttribute("aria-pressed", String(a.theme === id));
    const swatch = el("span", { class: "swatch" });
    swatch.style.background = `radial-gradient(at 70% 25%,${t.accent},transparent 65%),linear-gradient(135deg,${t.base},${t.glow})`;
    b.prepend(swatch);
    grid.append(b);
  }
  container.append(grid);
  const sliderDefs: [
    keyof Appearance,
    string,
    number,
    number,
    number,
    string,
  ][] = [
    ["blur", "Frosted blur", 4, 32, 1, "px"],
    ["opacity", "Glass opacity", 0.2, 0.9, 0.01, "%"],
    ["radius", "Corner softness", 8, 28, 1, "px"],
    ["intensity", "Ambient light", 0, 1, 0.01, "%"],
  ];
  if (advanced)
    sliderDefs.push(
      ["border", "Glass edge", 0, 1, 0.01, "%"],
      ["shadow", "Shadow depth", 0, 1, 0.01, "%"],
      ["saturation", "Saturation", 0.5, 2, 0.05, "×"],
    );
  for (const [key, label, min, max, step, unit] of sliderDefs) {
    const row = el("label", { class: "slider-row" });
    const title = el("span", {}, label);
    const output = el("output");
    const range = el("input", {
      type: "range",
      min: String(min),
      max: String(max),
      step: String(step),
      "aria-label": label,
    });
    range.value = String(a[key]);
    const update = () =>
      (output.textContent =
        (unit === "%"
          ? Math.round(Number(range.value) * 100)
          : Number(range.value)) + unit);
    update();
    range.addEventListener("input", () => {
      update();
      change({ ...get(), [key]: Number(range.value) });
    });
    title.append(output);
    row.append(title, range);
    container.append(row);
  }
  container.append(heading("Choose your coverage", "02 / EXPERIENCE"));
  const modes = el("div", {
    class: "segments",
    role: "group",
    "aria-label": "Coverage mode",
  });
  const description = el("p", { class: "hint" });
  const descriptions = {
    balanced: "A little glass, right where it belongs.",
    immersive: "More panels and dialogs, with the same careful touch.",
    compatibility: "Lightweight surfaces. No blur or ambient background.",
  };
  description.textContent = descriptions[a.mode];
  for (const mode of ["balanced", "immersive", "compatibility"] as Mode[]) {
    const b = button(
      mode[0].toUpperCase() + mode.slice(1),
      () => {
        change({ ...get(), mode });
        for (const child of modes.children)
          child.setAttribute("aria-pressed", String(child === b));
        description.textContent = descriptions[mode];
      },
      "segment",
    );
    b.setAttribute("aria-pressed", String(a.mode === mode));
    modes.append(b);
  }
  container.append(modes, description);
  if (advanced) {
    container.append(
      toggle("Ambient background", a.ambient, (v) =>
        change({ ...get(), ambient: v }),
      ),
      toggle("Solid contrast surfaces", a.contrast, (v) =>
        change({ ...get(), contrast: v }),
      ),
    );
  }
  preview(a);
}
export function setStatus(s: Settings) {
  const b = document.querySelector("#state");
  if (b) {
    b.textContent = s.enabled ? "● Active" : "○ Paused";
    b.classList.toggle("paused", !s.enabled);
  }
}
