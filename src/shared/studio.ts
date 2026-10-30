import { sceneById, scenes } from "./scenes";
export interface StudioSettings {
  scene: string;
  wallpaper: string | null;
  sceneStrength: number;
  brightness: number;
  fit: "cover" | "contain";
  position: "center" | "top" | "bottom";
  focus: boolean;
  editorSize: number;
  accent: string | null;
  glass: "auto" | "dark" | "light";
  favorites: string[];
  difficultyScenes: { easy: string; medium: string; hard: string };
  difficultyEnabled: boolean;
  effects: boolean;
  sound: boolean;
  volume: number;
}
export const studioDefaults: StudioSettings = {
  scene: "moonlit",
  wallpaper: null,
  sceneStrength: 0.7,
  brightness: 0.6,
  fit: "cover",
  position: "center",
  focus: false,
  editorSize: 14,
  accent: null,
  glass: "auto",
  favorites: [],
  difficultyScenes: { easy: "alpine", medium: "moonlit", hard: "neon" },
  difficultyEnabled: false,
  effects: false,
  sound: false,
  volume: 0.25,
};
export function validateStudio(raw: unknown): StudioSettings {
  if (raw === undefined) return structuredClone(studioDefaults);
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw Error("Invalid Studio settings");
  const o = raw as Record<string, unknown>;
  const result = structuredClone(studioDefaults);
  const sceneIds = scenes.map((s) => s.id);
  for (const [k, v] of Object.entries(o)) {
    if (!Object.hasOwn(result, k)) throw Error("Unknown Studio setting: " + k);
    if (["focus", "difficultyEnabled", "effects", "sound"].includes(k)) {
      if (typeof v !== "boolean") throw Error("Invalid Studio switch");
      (result as unknown as Record<string, unknown>)[k] = v;
    } else if (
      ["sceneStrength", "brightness", "volume", "editorSize"].includes(k)
    ) {
      if (
        typeof v !== "number" ||
        !Number.isFinite(v) ||
        v < (k === "editorSize" ? 11 : 0) ||
        v > (k === "editorSize" ? 24 : 1)
      )
        throw Error("Invalid Studio range");
      (result as unknown as Record<string, unknown>)[k] = v;
    } else if (k === "scene") {
      if (typeof v !== "string" || !sceneIds.includes(v))
        throw Error("Unknown scene");
      result.scene = v;
    } else if (k === "wallpaper") {
      if (v !== null && (typeof v !== "string" || !/^[a-f0-9-]{36}$/.test(v)))
        throw Error("Invalid local wallpaper ID");
      result.wallpaper = v as string | null;
    } else if (k === "accent") {
      if (v !== null && (typeof v !== "string" || !/^#[a-f0-9]{6}$/i.test(v)))
        throw Error("Invalid accent color");
      result.accent = v as string | null;
    } else if (k === "fit") {
      if (v !== "cover" && v !== "contain") throw Error("Invalid image fit");
      result.fit = v;
    } else if (k === "position") {
      if (v !== "center" && v !== "top" && v !== "bottom")
        throw Error("Invalid image position");
      result.position = v;
    } else if (k === "glass") {
      if (v !== "auto" && v !== "dark" && v !== "light")
        throw Error("Invalid glass mode");
      result.glass = v;
    } else if (k === "favorites") {
      if (
        !Array.isArray(v) ||
        v.length > scenes.length ||
        v.some((id) => typeof id !== "string" || !sceneIds.includes(id))
      )
        throw Error("Invalid favorites");
      result.favorites = [...new Set(v)] as string[];
    } else if (k === "difficultyScenes") {
      if (
        !v ||
        typeof v !== "object" ||
        Array.isArray(v) ||
        Object.keys(v).length !== 3
      )
        throw Error("Invalid difficulty scenes");
      for (const d of ["easy", "medium", "hard"] as const) {
        const id = (v as Record<string, unknown>)[d];
        if (typeof id !== "string" || !sceneIds.includes(id))
          throw Error("Invalid difficulty scene");
        result.difficultyScenes[d] = id;
      }
    }
  }
  return result;
}
export function effectiveScene(
  s: StudioSettings,
  difficulty: string | null,
): string {
  return s.difficultyEnabled &&
    difficulty &&
    Object.hasOwn(s.difficultyScenes, difficulty)
    ? s.difficultyScenes[difficulty as keyof typeof s.difficultyScenes]
    : sceneById(s.scene).id;
}
