import { resolve, themes, type Settings } from "../shared/settings";
import { selectAdapter, sensitive } from "../adapters";
import { css } from "./styles";
export class Engine {
  private style: HTMLStyleElement | null = null;
  private tagged = new Set<Element>();
  private observer: MutationObserver | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private roots = new Set<Element>();
  private settings: Settings | null = null;
  private oldVars = new Map<string, { value: string; priority: string }>();
  private attrs = new Map<string, string | null>();
  private before = false;
  private abort: AbortController | null = null;
  public status = "Inactive";
  public scanMs = 0;
  private count = 0;
  apply(settings: Settings) {
    this.unmount();
    this.settings = settings;
    const effective = resolve(settings, location.href);
    this.status = effective.reason;
    if (!effective.enabled || this.before) return;
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
    const adapter = selectAdapter(location.hostname);
    const root = document.documentElement;
    const token = themes[effective.theme];
    this.style = document.createElement("style");
    this.style.id = "vistara-styles";
    this.style.textContent = css;
    root.append(this.style);
    const variables: Record<string, string> = {
      "--gf-fill": token.fill,
      "--gf-base": token.base,
      "--gf-text": token.text,
      "--gf-muted": token.muted,
      "--gf-accent": token.accent,
      "--gf-glow": token.glow,
      "--gf-blur": `${effective.blur}px`,
      "--gf-opacity": String(effective.opacity),
      "--gf-radius": `${effective.radius}px`,
      "--gf-border-alpha": String(effective.border),
      "--gf-shadow-strength": String(effective.shadow),
      "--gf-saturation": String(effective.saturation),
      "--gf-bg-intensity": String(effective.intensity),
      "--gf-body-intensity": String(
        effective.ambient ? effective.intensity : 0,
      ),
    };
    for (const [k, v] of Object.entries(variables)) {
      this.oldVars.set(k, {
        value: root.style.getPropertyValue(k),
        priority: root.style.getPropertyPriority(k),
      });
      root.style.setProperty(k, v);
    }
    for (const [k, v] of Object.entries({
      "data-glassflow": "on",
      "data-gf-mode": effective.mode,
      "data-gf-contrast": String(effective.contrast),
      "data-gf-ambient": String(effective.ambient),
      "data-gf-adapter": adapter.id,
    })) {
      this.attrs.set(k, root.getAttribute(k));
      root.setAttribute(k, v);
    }
    const scan = (scope: Element) => {
      const started = performance.now();
      if (sensitive(location.href)) {
        this.unmount();
        this.status = "Safety pause: sensitive page";
        return;
      }
      for (const [kind, selector] of Object.entries(adapter.rules)) {
        if (
          effective.mode === "compatibility" &&
          !["nav", "input-shell"].includes(kind)
        )
          continue;
        if (effective.mode === "balanced" && kind === "dialog") continue;
        let nodes: Element[] = [];
        try {
          nodes = [
            ...(scope.matches(selector) ? [scope] : []),
            ...scope.querySelectorAll(selector),
          ];
        } catch {
          continue;
        }
        for (const el of nodes.slice(0, 160)) {
          if (this.count >= 160) break;
          if (
            this.tagged.has(el) ||
            el.hasAttribute("data-gf-surface") ||
            el.hasAttribute("data-gf-tone") ||
            el.closest(
              'video, canvas, pre, code, [contenteditable="true"], [role="alert"], .html5-video-player, .monaco-editor, .diff-view, .captcha',
            ) ||
            el.parentElement?.closest("[data-gf-surface]") ||
            el.querySelector("[data-gf-surface]")
          )
            continue;
          // Preserve author text on conservative adapters: use a compatible surface,
          // instead of forcing a light palette behind light text (or the reverse).
          if (!["youtube", "chatgpt"].includes(adapter.id)) {
            const channels = getComputedStyle(el)
              .color.match(/[\d.]+/g)
              ?.slice(0, 3)
              .map(Number) ?? [0, 0, 0];
            const luminance =
              channels[0] * 0.2126 +
              channels[1] * 0.7152 +
              channels[2] * 0.0722;
            el.setAttribute("data-gf-tone", luminance < 145 ? "light" : "dark");
          }
          el.setAttribute("data-gf-surface", kind);
          this.tagged.add(el);
          this.count++;
        }
      }
      this.scanMs += performance.now() - started;
    };
    scan(document.body);
    if (adapter.dynamic) {
      this.observer = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.removedNodes)
            if (node instanceof Element)
              for (const el of this.tagged)
                if (node === el || node.contains(el)) {
                  el.removeAttribute("data-gf-surface");
                  el.removeAttribute("data-gf-tone");
                  this.tagged.delete(el);
                  this.count--;
                }
          for (const node of record.addedNodes)
            if (
              node instanceof Element &&
              node !== this.style &&
              this.roots.size < 32
            )
              this.roots.add(node);
        }
        if (!this.timer && this.roots.size)
          this.timer = setTimeout(() => {
            this.timer = undefined;
            const roots = [...this.roots];
            this.roots.clear();
            for (const node of roots) if (node.isConnected) scan(node);
          }, 100);
      });
      this.observer.observe(document.body, { childList: true, subtree: true });
    }
    this.abort = new AbortController();
    let lastUrl = location.href;
    const route = () => {
      if (lastUrl !== location.href) {
        lastUrl = location.href;
        if (this.settings) this.apply(this.settings);
      }
    };
    window.addEventListener("popstate", route, { signal: this.abort.signal });
    window.addEventListener("hashchange", route, { signal: this.abort.signal });
    window.addEventListener(
      "navigation" in window ? "navigate" : "vistara-navigation",
      route,
      { signal: this.abort.signal },
    );
    this.status = `Active · ${adapter.id}`;
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
    clearTimeout(this.timer);
    this.timer = undefined;
    this.roots.clear();
    for (const el of this.tagged) {
      el.removeAttribute("data-gf-surface");
      el.removeAttribute("data-gf-tone");
    }
    this.tagged.clear();
    this.count = 0;
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
