import { resolve, themes, type Settings } from "../shared/settings";
import { effectiveScene } from "../shared/studio";
import { sceneUrl } from "../shared/scenes";
import { selectAdapter, sensitive } from "../adapters";
import { css } from "./styles";
import { codingCss } from "./coding-styles";
import { Moments } from "./moments";
type Mark =
  | "data-gf-surface"
  | "data-gf-tone"
  | "data-gf-workspace"
  | "data-gf-editor"
  | "data-gf-editor-tone"
  | "data-gf-distraction";
export class Engine {
  private style: HTMLStyleElement | null = null;
  private marked = new Map<Element, Set<Mark>>();
  private observer: MutationObserver | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private roots = new Set<Element>();
  private settings: Settings | null = null;
  private oldVars = new Map<string, { value: string; priority: string }>();
  private attrs = new Map<string, string | null>();
  private before = false;
  private abort: AbortController | null = null;
  private wallpaper: string | null = null;
  private moments: Moments | null = null;
  public status = "Inactive";
  public scanMs = 0;
  public coverage = { panels: 0, editors: 0, navigation: 0 };
  private mark(el: Element, key: Mark, value: string) {
    if (el.hasAttribute(key) && !this.marked.get(el)?.has(key)) return false;
    el.setAttribute(key, value);
    if (!this.marked.has(el)) this.marked.set(el, new Set());
    this.marked.get(el)!.add(key);
    return true;
  }
  private forget(el: Element) {
    for (const key of this.marked.get(el) ?? []) el.removeAttribute(key);
    this.marked.delete(el);
  }
  apply(settings: Settings, wallpaper: string | null = this.wallpaper) {
    this.unmount();
    this.settings = settings;
    this.wallpaper = wallpaper;
    const e = resolve(settings, location.href);
    this.status = e.reason;
    if (!e.enabled) return;
    if (this.before) {
      this.status = "Before view · original appearance";
      return;
    }
    if (
      document.documentElement.hasAttribute("data-vistara-optout") ||
      document.querySelector('meta[name="vistara"][content="off"]')
    ) {
      this.status = "Page opted out";
      return;
    }
    if (sensitive(location.href)) {
      this.status = "Safety pause: sensitive page";
      return;
    }
    const adapter = selectAdapter(location.hostname, location.pathname);
    const studio = settings.studio;
    const root = document.documentElement;
    const token = adapter.coding
      ? studio.glass === "light"
        ? themes.arctic
        : studio.glass === "dark"
          ? themes.midnight
          : themes[e.theme]
      : themes[e.theme];
    this.style = document.createElement("style");
    this.style.id = "vistara-styles";
    this.style.textContent = css + (adapter.coding ? codingCss : "");
    root.append(this.style);
    const variables: Record<string, string> = {
      "--gf-fill": token.fill,
      "--gf-base": token.base,
      "--gf-text": token.text,
      "--gf-muted": token.muted,
      "--gf-accent": studio.accent ?? token.accent,
      "--gf-glow": token.glow,
      "--gf-blur": `${e.blur}px`,
      "--gf-opacity": String(e.opacity),
      "--gf-radius": `${e.radius}px`,
      "--gf-border-alpha": String(e.border),
      "--gf-shadow-strength": String(e.shadow),
      "--gf-saturation": String(e.saturation),
      "--gf-bg-intensity": String(e.intensity),
      "--gf-body-intensity": String(e.ambient ? e.intensity : 0),
      "--gf-dim": String(1 - studio.brightness * studio.sceneStrength),
      "--gf-dim-fill": token.fill,
      "--gf-editor-size": `${studio.editorSize}px`,
      "--gf-wallpaper-fit": studio.fit,
      "--gf-wallpaper-position": studio.position,
    };
    const setVariable = (key: string, value: string) => {
      if (!this.oldVars.has(key))
        this.oldVars.set(key, {
          value: root.style.getPropertyValue(key),
          priority: root.style.getPropertyPriority(key),
        });
      root.style.setProperty(key, value);
    };
    for (const [key, value] of Object.entries(variables))
      setVariable(key, value);
    for (const [key, value] of Object.entries({
      "data-glassflow": "on",
      "data-gf-mode": e.mode,
      "data-gf-contrast": String(e.contrast),
      "data-gf-ambient": String(
        e.ambient && !settings.accessibility.disableImagery,
      ),
      "data-gf-adapter": adapter.id,
      "data-gf-coding": String(!!adapter.coding),
      "data-gf-focus": String(studio.focus),
    })) {
      this.attrs.set(key, root.getAttribute(key));
      root.setAttribute(key, value);
    }
    this.moments = adapter.coding ? new Moments() : null;
    let currentScene = "";
    const signals = () => {
      let difficulty: string | null = null;
      if (adapter.difficulty) {
        const label =
          document
            .querySelector(adapter.difficulty)
            ?.textContent?.slice(0, 80)
            .toLowerCase() ?? "";
        difficulty =
          ["easy", "medium", "hard"].find((d) =>
            new RegExp("\\b" + d + "\\b").test(label),
          ) ?? null;
      }
      const scene = effectiveScene(studio, difficulty);
      if (currentScene !== scene) {
        const custom =
          wallpaper &&
          /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(
            wallpaper,
          ) &&
          wallpaper.length < 2100000
            ? wallpaper
            : null;
        setVariable("--gf-wallpaper", `url("${custom ?? sceneUrl(scene)}")`);
        currentScene = scene;
      }
      if (adapter.verdict) {
        const label =
          document.querySelector(adapter.verdict)?.textContent?.slice(0, 120) ??
          "";
        this.moments?.update(
          label,
          studio,
          settings.accessibility.reduceMotion ||
            matchMedia("(prefers-reduced-motion: reduce)").matches,
        );
      }
    };
    const counts = () => {
      this.coverage = { panels: 0, editors: 0, navigation: 0 };
      for (const [el, keys] of this.marked) {
        if (keys.has("data-gf-editor")) this.coverage.editors++;
        if (keys.has("data-gf-surface")) {
          const kind = el.getAttribute("data-gf-surface");
          if (kind === "nav") this.coverage.navigation++;
          else if (kind === "panel" || kind === "card") this.coverage.panels++;
        }
      }
      this.status = adapter.coding
        ? this.coverage.panels || this.coverage.editors
          ? `Active · ${adapter.id} · ${this.coverage.panels} panels · ${this.coverage.editors} editors`
          : `Compatibility fallback · ${adapter.id}: no workspace panels detected on this route`
        : `Active · ${adapter.id}`;
    };
    const scan = (scope: Element) => {
      const started = performance.now();
      if (sensitive(location.href)) {
        this.unmount();
        this.status = "Safety pause: sensitive page";
        return;
      }
      if (scope.closest("[data-vistara-ui]")) return;
      for (const [kind, selector] of Object.entries(adapter.rules)) {
        if (
          e.mode === "compatibility" &&
          !["nav", "input-shell", "editor"].includes(kind)
        )
          continue;
        if (e.mode === "balanced" && kind === "dialog") continue;
        let nodes: Element[];
        try {
          nodes = [
            ...(scope.matches(selector) ? [scope] : []),
            ...scope.querySelectorAll(selector),
          ];
        } catch {
          continue;
        }
        for (const el of nodes.slice(0, 160)) {
          if (this.marked.size >= 160) break;
          if (el.closest("[data-vistara-ui]")) continue;
          if (kind === "workspace") {
            this.mark(el, "data-gf-workspace", "true");
            continue;
          }
          if (kind === "editor") {
            if (!el.hasAttribute("data-gf-editor")) {
              const sample =
                el.querySelector(".mtk1,.cm-content,.ace_text-layer") ?? el;
              const rgb = getComputedStyle(sample)
                .color.match(/[\d.]+/g)
                ?.slice(0, 3)
                .map(Number) ?? [255, 255, 255];
              if (
                this.mark(
                  el,
                  "data-gf-editor",
                  el instanceof HTMLTextAreaElement ? "plain" : "true",
                )
              )
                this.mark(
                  el,
                  "data-gf-editor-tone",
                  rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 < 145
                    ? "light"
                    : "dark",
                );
            }
            continue;
          }
          if (
            el.hasAttribute("data-gf-surface") ||
            el.hasAttribute("data-gf-tone") ||
            el.closest(
              'video,canvas,pre,code,[contenteditable="true"],[role="alert"],.html5-video-player,.monaco-editor,.ace_editor,.cm-editor,.CodeMirror,.diff-view,.captcha',
            ) ||
            el.parentElement?.closest("[data-gf-surface]") ||
            el.querySelector("[data-gf-surface]")
          )
            continue;
          if (!adapter.coding && !["youtube", "chatgpt"].includes(adapter.id)) {
            const rgb = getComputedStyle(el)
              .color.match(/[\d.]+/g)
              ?.slice(0, 3)
              .map(Number) ?? [0, 0, 0];
            this.mark(
              el,
              "data-gf-tone",
              rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 < 145
                ? "light"
                : "dark",
            );
          }
          this.mark(el, "data-gf-surface", kind);
        }
      }
      if (adapter.focus) {
        for (const el of [
          ...(scope.matches(adapter.focus) ? [scope] : []),
          ...scope.querySelectorAll(adapter.focus),
        ].slice(0, 20))
          this.mark(el, "data-gf-distraction", "true");
      }
      signals();
      counts();
      this.scanMs += performance.now() - started;
    };
    scan(document.body);
    if (adapter.dynamic) {
      this.observer = new MutationObserver((records) => {
        for (const record of records) {
          if (
            record.target instanceof Element &&
            record.target.closest("[data-vistara-ui]")
          )
            continue;
          for (const node of record.removedNodes)
            if (node instanceof Element)
              for (const el of this.marked.keys())
                if (node === el || node.contains(el)) this.forget(el);
          for (const node of record.addedNodes) {
            const el =
              node instanceof Element
                ? node
                : record.target instanceof Element
                  ? record.target
                  : null;
            if (el && !el.closest("[data-vistara-ui]") && this.roots.size < 32)
              this.roots.add(el);
          }
        }
        if (!this.timer && this.roots.size)
          this.timer = setTimeout(() => {
            this.timer = undefined;
            const nodes = [...this.roots];
            this.roots.clear();
            for (const el of nodes) if (el.isConnected) scan(el);
          }, 100);
      });
      this.observer.observe(document.body, { childList: true, subtree: true });
    }
    this.abort = new AbortController();
    let last = location.href;
    const route = () => {
      if (last !== location.href && this.settings) {
        last = location.href;
        this.apply(this.settings);
      }
    };
    window.addEventListener("popstate", route, { signal: this.abort.signal });
    window.addEventListener("hashchange", route, { signal: this.abort.signal });
    if (studio.sound && studio.effects)
      document.addEventListener(
        "pointerdown",
        (event) => {
          if (
            event.isTrusted &&
            event.target instanceof Element &&
            event.target.closest('button,input[type="submit"]')
          )
            this.moments?.arm();
        },
        { signal: this.abort.signal },
      );
  }
  toggleBefore() {
    this.before = !this.before;
    if (this.settings) this.apply(this.settings);
    return this.before;
  }
  unmount() {
    this.observer?.disconnect();
    this.observer = null;
    this.abort?.abort();
    this.moments?.destroy();
    this.moments = null;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.roots.clear();
    for (const el of this.marked.keys()) this.forget(el);
    this.coverage = { panels: 0, editors: 0, navigation: 0 };
    this.style?.remove();
    this.style = null;
    for (const [k, v] of this.oldVars) {
      if (v.value)
        document.documentElement.style.setProperty(k, v.value, v.priority);
      else document.documentElement.style.removeProperty(k);
    }
    this.oldVars.clear();
    for (const [k, v] of this.attrs) {
      if (v === null) document.documentElement.removeAttribute(k);
      else document.documentElement.setAttribute(k, v);
    }
    this.attrs.clear();
  }
}
