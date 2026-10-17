export const themes = {
  midnight: {
    name: "Midnight",
    base: "#081225",
    fill: "22,35,70",
    text: "#f5f8ff",
    muted: "#b7c8e1",
    accent: "#65b7ff",
    glow: "#3455cb",
  },
  aurora: {
    name: "Aurora",
    base: "#170e2b",
    fill: "54,31,83",
    text: "#faf7ff",
    muted: "#dbc5ed",
    accent: "#d58dff",
    glow: "#912db2",
  },
  arctic: {
    name: "Arctic",
    base: "#e6f0ff",
    fill: "255,255,255",
    text: "#162746",
    muted: "#43587a",
    accent: "#315dbf",
    glow: "#9bbbea",
  },
  orchid: {
    name: "Orchid",
    base: "#231b28",
    fill: "58,41,62",
    text: "#fff4f7",
    muted: "#dcc2cf",
    accent: "#edb5b3",
    glow: "#895376",
  },
  pixel: {
    name: "Pixel Realm",
    base: "#111b2a",
    fill: "22,44,54",
    text: "#effff8",
    muted: "#b6d7ce",
    accent: "#7de4bb",
    glow: "#277e7d",
  },
} as const;
export type Theme = keyof typeof themes;
export type Mode = "balanced" | "immersive" | "compatibility";
export interface Appearance {
  theme: Theme;
  mode: Mode;
  blur: number;
  opacity: number;
  radius: number;
  intensity: number;
  border: number;
  shadow: number;
  saturation: number;
  ambient: boolean;
  contrast: boolean;
}
export interface Rule extends Partial<Appearance> {
  host: string;
  subdomains: boolean;
  enabled: boolean;
}
export interface Preset {
  id: string;
  name: string;
  appearance: Appearance;
}
export interface Settings {
  schemaVersion: 1;
  enabled: boolean;
  appearance: Appearance;
  excludedSites: string[];
  siteOverrides: Rule[];
  customPresets: Preset[];
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    disableImagery: boolean;
    simple: boolean;
  };
}
export const defaults: Settings = {
  schemaVersion: 1,
  enabled: true,
  appearance: {
    theme: "midnight",
    mode: "balanced",
    blur: 16,
    opacity: 0.52,
    radius: 16,
    intensity: 0.55,
    border: 0.23,
    shadow: 0.28,
    saturation: 1.15,
    ambient: true,
    contrast: false,
  },
  excludedSites: [],
  siteOverrides: [],
  customPresets: [],
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    disableImagery: false,
    simple: false,
  },
};
export const cloneDefaults = (): Settings => structuredClone(defaults);
export function hostname(value: string): string {
  const s = value.trim().toLowerCase().replace(/\.$/, "");
  if (
    !s ||
    s.includes("/") ||
    s.includes(":") ||
    !/^([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
      s,
    ) ||
    s.length > 253
  )
    throw Error("Enter a hostname only, such as example.com.");
  return s;
}
export const matches = (host: string, rule: string, children = false) =>
  host === rule || (children && host.endsWith("." + rule));
export function eligible(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      ["http:", "https:"].includes(u.protocol) &&
      !["chromewebstore.google.com", "chrome.google.com"].includes(u.hostname)
    );
  } catch {
    return false;
  }
}
const ranges = {
  blur: [4, 32],
  opacity: [0.2, 0.9],
  radius: [8, 28],
  intensity: [0, 1],
  border: [0, 1],
  shadow: [0, 1],
  saturation: [0.5, 2],
} as const;
export function appearance(
  raw: unknown,
  base: Appearance = defaults.appearance,
): Appearance {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw Error("Invalid appearance.");
  const o = raw as Record<string, unknown>;
  const a = { ...base };
  for (const key of Object.keys(o)) {
    if (!Object.hasOwn(base, key))
      throw Error("Unknown appearance field: " + key);
    if (key === "theme") {
      if (
        typeof o[key] !== "string" ||
        !Object.hasOwn(themes, o[key] as string)
      )
        throw Error("Unknown theme.");
      a.theme = o[key] as Theme;
    } else if (key === "mode") {
      if (!["balanced", "immersive", "compatibility"].includes(String(o[key])))
        throw Error("Unknown mode.");
      a.mode = o[key] as Mode;
    } else if (key === "ambient" || key === "contrast") {
      if (typeof o[key] !== "boolean") throw Error("Invalid boolean.");
      a[key] = o[key];
    } else {
      const k = key as keyof typeof ranges;
      const v = o[key];
      if (
        typeof v !== "number" ||
        !Number.isFinite(v) ||
        v < ranges[k][0] ||
        v > ranges[k][1]
      )
        throw Error("Out of range: " + key);
      a[k] = v;
    }
  }
  return a;
}
export function validate(raw: unknown): Settings {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw Error("Settings must be an object.");
  const o = raw as Record<string, any>;
  if (o.schemaVersion !== 1) throw Error("Unsupported settings version.");
  if (Object.keys(o).some((k) => !Object.hasOwn(defaults, k)))
    throw Error("Unknown settings field.");
  if (typeof o.enabled !== "boolean") throw Error("Invalid enabled state.");
  const a = appearance(o.appearance);
  if (
    !Array.isArray(o.excludedSites) ||
    !Array.isArray(o.siteOverrides) ||
    !Array.isArray(o.customPresets) ||
    o.siteOverrides.length > 500 ||
    o.customPresets.length > 100 ||
    o.excludedSites.length > 500
  )
    throw Error("Invalid or oversized collections.");
  const excludedSites = o.excludedSites.map((h: unknown) => {
    if (typeof h !== "string") throw Error("Invalid host.");
    return hostname(h);
  });
  const siteOverrides = o.siteOverrides.map((r: any) => {
    if (
      !r ||
      typeof r.host !== "string" ||
      typeof r.enabled !== "boolean" ||
      typeof r.subdomains !== "boolean"
    )
      throw Error("Invalid site rule.");
    const { host, enabled, subdomains, ...rest } = r;
    appearance(rest);
    return { host: hostname(host), enabled, subdomains, ...rest };
  });
  if (
    new Set(siteOverrides.map((r: Rule) => r.host + ":" + r.subdomains))
      .size !== siteOverrides.length
  )
    throw Error("Duplicate site rule.");
  const customPresets = o.customPresets.map((p: any) => {
    if (
      !p ||
      typeof p.id !== "string" ||
      typeof p.name !== "string" ||
      !p.name.trim() ||
      p.name.length > 60 ||
      p.id.length > 100 ||
      Object.keys(p).some((k) => !["id", "name", "appearance"].includes(k))
    )
      throw Error("Invalid preset.");
    return { id: p.id, name: p.name, appearance: appearance(p.appearance) };
  });
  if (
    new Set(customPresets.map((p: Preset) => p.id)).size !==
    customPresets.length
  )
    throw Error("Duplicate preset ID.");
  const accessibility = { ...defaults.accessibility };
  if (!o.accessibility || typeof o.accessibility !== "object")
    throw Error("Invalid accessibility.");
  for (const [k, v] of Object.entries(o.accessibility)) {
    if (!Object.hasOwn(accessibility, k) || typeof v !== "boolean")
      throw Error("Invalid accessibility flag.");
    accessibility[k as keyof typeof accessibility] = v;
  }
  return {
    schemaVersion: 1,
    enabled: o.enabled,
    appearance: a,
    excludedSites,
    siteOverrides,
    customPresets,
    accessibility,
  };
}
export function importSettings(text: string): Settings {
  if (new TextEncoder().encode(text).length > 262144)
    throw Error("Import exceeds 256 KB.");
  return validate(
    JSON.parse(text, (key, value) => {
      if (["__proto__", "prototype", "constructor"].includes(key))
        throw Error("Unsafe import key.");
      return value;
    }),
  );
}
export function migrate(raw: unknown): Settings {
  if (raw == null) return cloneDefaults();
  const o = raw as Record<string, unknown>;
  if (o.schemaVersion === undefined || o.schemaVersion === 0) {
    return validate({
      ...cloneDefaults(),
      enabled: typeof o.enabled === "boolean" ? o.enabled : true,
      appearance: appearance({
        theme: o.defaultTheme ?? "midnight",
        mode: o.defaultMode ?? "balanced",
      }),
    });
  }
  return validate(raw);
}
export function resolve(
  s: Settings,
  url: string,
): Appearance & { enabled: boolean; reason: string } {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {}
  const rules = s.siteOverrides.filter((r) =>
    matches(host, r.host, r.subdomains),
  );
  const exact =
    rules.find((r) => r.host === host && !r.subdomains) ??
    rules.find((r) => r.host === host);
  const parent = rules
    .filter((r) => r.subdomains)
    .sort((a, b) => b.host.length - a.host.length)[0];
  const rule = exact ?? parent;
  const a = { ...s.appearance, ...rule };
  let reason = "Active";
  let enabled = true;
  if (!eligible(url)) {
    enabled = false;
    reason = "Not available on this page";
  } else if (!s.enabled) {
    enabled = false;
    reason = "Paused globally";
  } else if (
    s.excludedSites.some((h) => matches(host, h, true)) ||
    rule?.enabled === false
  ) {
    enabled = false;
    reason = "Disabled for this website";
  }
  if (s.accessibility.simple) a.mode = "compatibility";
  if (s.accessibility.highContrast) a.contrast = true;
  if (s.accessibility.disableImagery) a.ambient = false;
  return { ...a, enabled, reason };
}
