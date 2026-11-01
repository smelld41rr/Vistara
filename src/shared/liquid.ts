export const liquidPresets = {
  ocean: {
    name: "Electric ocean · reference",
    peach: "#146BCE",
    lavender: "#5548ED",
    pink: "#CF7CFF",
    sky: "#33DFFF",
    base: "#061C52",
  },
  peach: {
    name: "Peach aurora",
    peach: "#F8D9C8",
    lavender: "#DCD4FA",
    pink: "#F6DCE9",
    sky: "#D8E7FF",
    base: "#FFF8F4",
  },
  lavender: {
    name: "Lavender mist",
    peach: "#F2DEEA",
    lavender: "#CEC8F2",
    pink: "#EFDCF3",
    sky: "#DDE7FF",
    base: "#FAF8FF",
  },
  sky: {
    name: "Sky pearl",
    peach: "#F4E6DA",
    lavender: "#DBDFFA",
    pink: "#F4E5ED",
    sky: "#C8E3FA",
    base: "#F7FBFF",
  },
  rose: {
    name: "Rose quartz",
    peach: "#F8D9D2",
    lavender: "#E1D4EF",
    pink: "#F5CEE0",
    sky: "#DFE8FB",
    base: "#FFF7FA",
  },
} as const;
export interface LiquidSettings {
  enabled: boolean;
  intensity: number;
  blur: number;
  brightness: number;
  preset: keyof typeof liquidPresets;
  animation: boolean;
  sidebarOpacity: number;
  composerOpacity: number;
  reduceMotion: boolean;
}
export const liquidDefaults: LiquidSettings = {
  enabled: false,
  intensity: 0.65,
  blur: 30,
  brightness: 1,
  preset: "ocean",
  animation: false,
  sidebarOpacity: 0.24,
  composerOpacity: 0.46,
  reduceMotion: false,
};
export function validateLiquid(raw: unknown): LiquidSettings {
  if (raw === undefined) return { ...liquidDefaults };
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw Error("Invalid ChatGPT Liquid Glass settings");
  const result = { ...liquidDefaults };
  for (const [key, value] of Object.entries(raw)) {
    if (!Object.hasOwn(result, key))
      throw Error("Unknown Liquid Glass setting: " + key);
    if (key === "enabled" || key === "animation" || key === "reduceMotion") {
      if (typeof value !== "boolean")
        throw Error("Invalid Liquid Glass switch");
      result[key] = value;
    } else if (key === "preset") {
      if (typeof value !== "string" || !Object.hasOwn(liquidPresets, value))
        throw Error("Unknown Liquid Glass preset");
      result.preset = value as LiquidSettings["preset"];
    } else {
      const limits: Record<string, [number, number]> = {
        intensity: [0, 1],
        blur: [4, 36],
        brightness: [0.75, 1.2],
        sidebarOpacity: [0.12, 0.85],
        composerOpacity: [0.2, 0.9],
      };
      const [min, max] = limits[key];
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < min ||
        value > max
      )
        throw Error("Invalid Liquid Glass range: " + key);
      (result as unknown as Record<string, unknown>)[key] = value;
    }
  }
  return result;
}
export function isLiquidHost(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      ["https:", "http:"].includes(u.protocol) && u.hostname === "chatgpt.com"
    );
  } catch {
    return false;
  }
}
