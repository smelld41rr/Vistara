import { sensitive } from "../../adapters";
import { liquidPresets, type LiquidSettings } from "../../shared/liquid";
import stylesheet from "./liquid.css";
const rules: Record<string, string> = {
  shell: '#root, #__next, #app, #thread, [data-testid="app-shell"]',
  main: "main",
  header:
    'main > header, #page-header, [data-testid="page-header"], body > header',
  sidebar:
    '#stage-slideover-sidebar, #sidebar, [data-testid="sidebar"], aside[aria-label="Chat history"]',
  composer:
    '#composer-background, [data-testid="composer"], form[data-type="unified-composer"]:not(:has(#composer-background, [data-testid="composer"])), form:has(#prompt-textarea):not(:has(#composer-background, [data-testid="composer"]))',
  segment:
    '[data-testid="chat-work-toggle"], [role="tablist"][aria-label*="mode" i], [role="tablist"][aria-label*="chat" i]',
  "home-title":
    "main h1:not(article h1):not(.markdown h1):not([data-message-author-role] h1)",
  message: '[data-message-author-role="user"]',
  dialog: '[role="dialog"]',
  menu: '[role="menu"], [role="listbox"]',
  code: "pre:has(code)",
  suggestion: '[data-testid="suggestion-card"], [data-testid="starter-prompt"], [data-testid="conversation-starter"], [data-testid="prompt-suggestion"]',

};
export class LiquidGlass {
  private style: HTMLStyleElement | null = null;
  private backdrop: HTMLElement | null = null;
  private observer: MutationObserver | null = null;
  private abort: AbortController | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private pending = new Set<Element>();
  private marked = new Map<Element, Map<string, string | null>>();
  private properties = new Map<
    HTMLElement,
    Map<string, { value: string; priority: string }>
  >();
  private rootAttrs = new Map<string, string | null>();
  private settings: LiquidSettings | null = null;
  public coverage = { panels: 0, editors: 0, navigation: 0 };
  public status = "Liquid Glass starting";
  public scanMs = 0;
  private attribute(el: Element, name: string, value: string) {
    if (!this.marked.has(el)) this.marked.set(el, new Map());
    const attrs = this.marked.get(el)!;
    if (!attrs.has(name)) attrs.set(name, el.getAttribute(name));
    el.setAttribute(name, value);
  }
  private variable(el: HTMLElement, name: string, value: string) {
    if (!this.properties.has(el)) this.properties.set(el, new Map());
    const map = this.properties.get(el)!;
    if (!map.has(name))
      map.set(name, {
        value: el.style.getPropertyValue(name),
        priority: el.style.getPropertyPriority(name),
      });
    el.style.setProperty(name, value);
  }
  private rootAttribute(name: string, value: string) {
    const root = document.documentElement;
    if (!this.rootAttrs.has(name))
      this.rootAttrs.set(name, root.getAttribute(name));
    root.setAttribute(name, value);
  }
  private forget(el: Element) {
    for (const [key, value] of this.marked.get(el) ?? []) {
      if (value === null) el.removeAttribute(key);
      else el.setAttribute(key, value);
    }
    this.marked.delete(el);
    if (el instanceof HTMLElement) {
      for (const [key, old] of this.properties.get(el) ?? []) {
        if (old.value) el.style.setProperty(key, old.value, old.priority);
        else el.style.removeProperty(key);
      }
      this.properties.delete(el);
    }
  }
  mount(
    settings: LiquidSettings,
    {
      reduceMotion = false,
      highContrast = false,
      simple = false,
    }: {
      reduceMotion?: boolean;
      highContrast?: boolean;
      simple?: boolean;
    } = {},
  ) {
    this.unmount();
    this.settings = settings;
    const root = document.documentElement;
    const preset = liquidPresets[settings.preset];
    // Capture existing code-block contrast before host theme variables change.
    const codeColors = new Map<Element, { bg: string; fg: string }>();
    for (const el of document.querySelectorAll("pre:has(code)")) {
      const c = getComputedStyle(el);
      codeColors.set(el, { bg: c.backgroundColor, fg: c.color });
    }
    const vars: Record<string, string> = {
      "--vl-base": preset.base,
      "--vl-peach": preset.peach,
      "--vl-lavender": preset.lavender,
      "--vl-pink": preset.pink,
      "--vl-sky": preset.sky,
      "--vl-intensity": String(settings.intensity),
      "--vl-blur": (simple ? 4 : settings.blur) + "px",
      "--vl-blend": 38 + settings.blur + "%",
      "--vl-brightness": String(settings.brightness),
      "--vl-sidebar-opacity": String(settings.sidebarOpacity),
      "--vl-composer-opacity": String(settings.composerOpacity),
      "--vl-shadow": String(0.045 + settings.intensity * 0.12),
    };
    for (const [name, value] of Object.entries(vars))
      this.variable(root, name, value);
    for (const [name, value] of Object.entries({
      "data-vistara-liquid": "on",
      "data-vl-preset": settings.preset,
      "data-glassflow": "on",
      "data-gf-adapter": "chatgpt",
      "data-vl-contrast": String(highContrast || simple),
    }))
      this.rootAttribute(name, value);
    this.style = document.createElement("style");
    this.style.id = "vistara-styles";
    this.style.textContent = stylesheet;
    root.append(this.style);
    const backdrop = document.createElement("div");
    backdrop.dataset.vlDecoration = "";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.inert = true;
    const aurora = document.createElement("div");
    aurora.className = "vl-aurora";
    backdrop.append(aurora);
    for (const name of ["left", "top", "right"]) {
      const orb = document.createElement("span");
      orb.className = "vl-orb vl-orb-" + name;
      backdrop.append(orb);
    }
    document.body.append(backdrop);
    this.backdrop = backdrop;
    const counts = () => {
      let panels = 0,
        navigation = 0;
      for (const [el] of this.marked) {
        const kind = el.getAttribute("data-vl-part");
        if (kind === "sidebar") navigation++;
        if (kind === "composer" || kind === "message") panels++;
      }
      this.coverage.panels = panels;
      this.coverage.navigation = navigation;
      this.status =
        panels || navigation
          ? "Active · ChatGPT — Liquid Glass"
          : "Liquid Glass background active · no sidebar/composer recognized on this route";
    };
    const scan = (scope: Element) => {
      if (sensitive(location.href)) {
        this.unmount();
        this.status = "Safety pause: sensitive page";
        return;
      }
      if (scope.closest("[data-vl-decoration]")) return;
      const start = performance.now();
      for (const [kind, selector] of Object.entries(rules)) {
        const nodes = [
          ...(scope.matches(selector) ? [scope] : []),
          ...scope.querySelectorAll(selector),
        ];
        for (const el of nodes.slice(0, 120)) {
          if (this.marked.size >= 240) break;
          if (
            el.closest("[data-vl-decoration]") ||
            el.hasAttribute("data-vl-part")
          )
            continue;
          if (
            kind === "sidebar" &&
            el.parentElement?.closest('[data-vl-part="sidebar"]')
          )
            continue;
          if (
            kind === "composer" &&
            el.parentElement?.closest('[data-vl-part="composer"]')
          )
            continue;
          if (kind === "code" && el instanceof HTMLElement) {
            const old = codeColors.get(el);
            const bg = old?.bg ?? getComputedStyle(el).backgroundColor;
            const fg = old?.fg ?? getComputedStyle(el).color;
            const transparent =
              !bg || bg === "transparent" || /rgba\([^)]*,\s*0\)/.test(bg);
            this.variable(el, "--vl-code-bg", transparent ? "#162031" : bg);
            this.variable(el, "--vl-code-fg", transparent ? "#eff4ff" : fg);
          }
          this.attribute(el, "data-vl-part", kind);
          if (kind === "sidebar" || kind === "header")
            this.attribute(el, "data-gf-surface", "nav");
          if (kind === "composer")
            this.attribute(el, "data-gf-surface", "input-shell");
        }
      }
      counts();
      this.scanMs += performance.now() - start;
    };
    scan(document.body);
    this.observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.removedNodes)
          if (node instanceof Element)
            for (const el of this.marked.keys())
              if (el === node || node.contains(el)) this.forget(el);
        for (const node of record.addedNodes)
          if (
            node instanceof Element &&
            !node.closest("[data-vl-decoration]") &&
            this.pending.size < 32
          )
            this.pending.add(node);
      }
      if (this.pending.size && !this.timer)
        this.timer = setTimeout(() => {
          this.timer = undefined;
          const nodes = [...this.pending];
          this.pending.clear();
          for (const node of nodes) if (node.isConnected) scan(node);
        }, 90);
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.abort = new AbortController();
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => {
      const reduced =
        reduceMotion || settings.reduceMotion || media.matches || simple;
      this.rootAttribute("data-vl-reduced", String(reduced));
      this.rootAttribute(
        "data-vl-motion",
        String(settings.animation && !reduced),
      );
      this.rootAttribute(
        "data-vl-paused",
        String(document.visibilityState === "hidden"),
      );
    };
    motion();
    media.addEventListener("change", motion, { signal: this.abort.signal });
    document.addEventListener("visibilitychange", motion, {
      signal: this.abort.signal,
    });
  }
  unmount() {
    this.observer?.disconnect();
    this.observer = null;
    this.abort?.abort();
    this.abort = null;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.pending.clear();
    for (const el of this.marked.keys()) this.forget(el);
    for (const [el, vars] of this.properties) {
      for (const [name, old] of vars) {
        if (old.value) el.style.setProperty(name, old.value, old.priority);
        else el.style.removeProperty(name);
      }
    }
    this.properties.clear();
    for (const [key, value] of this.rootAttrs) {
      if (value === null) document.documentElement.removeAttribute(key);
      else document.documentElement.setAttribute(key, value);
    }
    this.rootAttrs.clear();
    this.style?.remove();
    this.style = null;
    this.backdrop?.remove();
    this.backdrop = null;
    this.settings = null;
    this.coverage.panels = 0;
    this.coverage.navigation = 0;
  }
}
