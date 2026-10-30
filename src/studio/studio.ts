import { liquidControls } from "../shared/liquid-controls";
import { load, save } from "../shared/storage";
import { themes, type Settings } from "../shared/settings";
import { scenes, sceneUrl, sceneById } from "../shared/scenes";
import { codingPlatforms } from "../shared/platforms";
import {
  imageData,
  importWallpaper,
  listWallpapers,
  deleteWallpaper,
} from "../shared/assets";
import { el, button, toggle, notice, appearanceControls } from "../shared/ui";
const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
let settings: Settings;
let category = "All";
let timer: ReturnType<typeof setTimeout>;
let dirty = false;
let revision = 0;
let uploaded: string | null = null;
let shareRevision = 0;
const urls: string[] = [];
function tell(message: string, error = false) {
  notice(message, error);
}
async function persist() {
  const started = revision;
  try {
    await save(settings);
    $("save-state").textContent = "All changes saved";
  } catch (error) {
    $("save-state").textContent = "Saved locally / check status";
    tell(String(error), true);
  } finally {
    if (started === revision) dirty = false;
  }
}
function changed() {
  dirty = true;
  revision++;
  $("save-state").textContent = "Saving your world…";
  clearTimeout(timer);
  timer = setTimeout(persist, 350);
  updatePreview();
  void drawShare();
}
function field(label: string, control: HTMLElement) {
  const wrap = el("label", { class: "field" }, label);
  wrap.append(control);
  return wrap;
}
function select<T extends string>(
  label: string,
  values: readonly T[],
  current: T,
  change: (value: T) => void,
  labels?: Record<string, string>,
) {
  const input = el("select", { "aria-label": label });
  for (const value of values) {
    const option = el(
      "option",
      { value },
      labels?.[value] ?? value[0].toUpperCase() + value.slice(1),
    );
    option.selected = value === current;
    input.append(option);
  }
  input.onchange = () => change(input.value as T);
  return field(label, input);
}
function slider(
  label: string,
  min: number,
  max: number,
  step: number,
  value: number,
  unit: string,
  onchange: (v: number) => void,
) {
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
  input.value = String(value);
  const show = () =>
    (output.textContent =
      unit === "%"
        ? Math.round(Number(input.value) * 100) + "%"
        : input.value + unit);
  show();
  input.oninput = () => {
    show();
    onchange(Number(input.value));
    changed();
  };
  caption.append(output);
  row.append(caption, input);
  return row;
}
function palette() {
  return settings.studio.glass === "light"
    ? themes.arctic
    : settings.studio.glass === "dark"
      ? themes.midnight
      : themes[settings.appearance.theme];
}
function updatePreview() {
  const p = $("coding-preview");
  const a = settings.appearance;
  const t = palette();
  const s = settings.studio;
  const style = p.style;
  style.setProperty("--demo-fill", t.fill);
  style.setProperty("--demo-text", t.text);
  style.setProperty("--demo-opacity", String(a.opacity));
  style.setProperty(
    "--demo-blur",
    a.mode === "compatibility" ? "0px" : a.blur + "px",
  );
  style.setProperty("--demo-radius", a.radius / 2 + "px");
  style.setProperty(
    "--demo-code-size",
    Math.min(11, s.editorSize * 0.5) + "px",
  );
  style.setProperty("--demo-dim", String(1 - s.brightness * s.sceneStrength));
  style.backgroundImage =
    a.ambient && !settings.accessibility.disableImagery
      ? `url("${uploaded ?? sceneUrl(s.scene)}")`
      : "none";
  style.backgroundSize = s.fit;
  style.backgroundPosition = s.position;
  const info = $("selected-scene");
  info.replaceChildren();
  const image = el("img", { src: uploaded ?? sceneUrl(s.scene), alt: "" });
  const words = el("div");
  words.append(
    el("h3", {}, uploaded ? "Your own little world" : sceneById(s.scene).name),
    el(
      "p",
      {},
      uploaded
        ? "Local wallpaper · Only in this browser"
        : sceneById(s.scene).description,
    ),
  );
  info.append(image, words, el("span", {}, "● SELECTED"));
  $("preview-focus").replaceChildren(
    toggle("Focus mode", s.focus, (value) => {
      settings.studio.focus = value;
      changed();
      renderFlow();
    }),
  );
  $("master-switch").replaceChildren(
    toggle("Enable Vistara", settings.enabled, (v) => {
      settings.enabled = v;
      changed();
    }),
  );
}
function renderCategories() {
  const group = $("categories");
  group.replaceChildren();
  for (const name of [
    "All",
    "Favorites",
    ...new Set(scenes.map((s) => s.category)),
  ]) {
    const b = button(
      name,
      () => {
        category = name;
        renderCategories();
        renderGallery();
      },
      "category",
    );
    b.setAttribute("aria-pressed", String(category === name));
    group.append(b);
  }
}
function renderGallery() {
  const list = $("scene-grid");
  list.replaceChildren();
  const search = $<HTMLInputElement>("scene-search").value.toLowerCase();
  for (const scene of scenes.filter(
    (s) =>
      (category === "All" ||
        (category === "Favorites" &&
          settings.studio.favorites.includes(s.id)) ||
        s.category === category) &&
      `${s.name} ${s.category} ${s.description}`.toLowerCase().includes(search),
  )) {
    const card = el("article", {
      class:
        "scene-card" +
        (settings.studio.scene === scene.id && !settings.studio.wallpaper
          ? " selected"
          : ""),
    });
    const choose = button(
      "",
      () => {
        settings.studio.scene = scene.id;
        settings.studio.wallpaper = null;
        uploaded = null;
        changed();
        renderGallery();
      },
      "scene-art",
    );
    choose.setAttribute("aria-label", "Apply " + scene.name);
    choose.setAttribute(
      "aria-pressed",
      String(settings.studio.scene === scene.id && !settings.studio.wallpaper),
    );
    choose.append(
      el("img", {
        src: sceneUrl(scene.id),
        alt: "Original " + scene.category + " scene",
        loading: "lazy",
      }),
      el("span", { class: "scene-category" }, scene.category),
    );
    const favorite = button(
      settings.studio.favorites.includes(scene.id) ? "♥" : "♡",
      () => {
        const favorites = settings.studio.favorites;
        settings.studio.favorites = favorites.includes(scene.id)
          ? favorites.filter((id) => id !== scene.id)
          : [...favorites, scene.id];
        changed();
        renderGallery();
      },
      "scene-favorite",
    );
    favorite.setAttribute("aria-label", "Favorite " + scene.name);
    favorite.setAttribute(
      "aria-pressed",
      String(settings.studio.favorites.includes(scene.id)),
    );
    const meta = el("div", { class: "scene-meta" });
    meta.append(el("h3", {}, scene.name), el("p", {}, scene.description));
    const label = el(
      "div",
      { class: "scene-choice" },
      settings.studio.scene === scene.id && !settings.studio.wallpaper
        ? "● CURRENT ATMOSPHERE"
        : "EXPLORE THIS FEELING",
    );
    label.append(el("span", {}, "↗"));
    meta.append(label);
    card.append(choose, favorite, meta);
    list.append(card);
  }
  if (!list.children.length)
    list.append(
      el(
        "p",
        { class: "empty" },
        category === "Favorites"
          ? "Save a favorite with the heart on any scene."
          : "No scenes match. Try another feeling.",
      ),
    );
}
function renderCustomize() {
  renderLooks();
  const container = $("scene-controls");
  const s = settings.studio;
  container.replaceChildren();
  container.append(
    select(
      "Glass appearance",
      ["auto", "dark", "light"] as const,
      s.glass,
      (v) => {
        s.glass = v;
        changed();
      },
      {
        auto: "Follow selected palette",
        dark: "Midnight glass",
        light: "Frosted light glass",
      },
    ),
    slider(
      "Scene visibility",
      0,
      1,
      0.01,
      s.sceneStrength,
      "%",
      (v) => (s.sceneStrength = v),
    ),
    slider(
      "Wallpaper brightness",
      0,
      1,
      0.01,
      s.brightness,
      "%",
      (v) => (s.brightness = v),
    ),
    slider(
      "Code preview / textarea size",
      11,
      24,
      1,
      s.editorSize,
      "px",
      (v) => (s.editorSize = v),
    ),
    select(
      "Image placement",
      ["center", "top", "bottom"] as const,
      s.position,
      (v) => {
        s.position = v;
        changed();
      },
    ),
    select("Image fit", ["cover", "contain"] as const, s.fit, (v) => {
      s.fit = v;
      changed();
    }),
  );
  const accent = el("input", {
    type: "color",
    "aria-label": "Custom accent color",
  });
  accent.value = s.accent ?? palette().accent;
  accent.oninput = () => {
    s.accent = accent.value;
    changed();
  };
  container.append(
    el(
      "p",
      { class: "hint" },
      "Font size affects the Studio preview and recognized plain-text editors. Native Monaco/Ace/CodeMirror metrics stay untouched to preserve caret and selection alignment.",
    ),
    field("Custom accent color", accent),
    button("Restore palette accent", () => {
      s.accent = null;
      changed();
      renderCustomize();
    }),
  );
  appearanceControls(
    $("appearance-controls"),
    () => settings.appearance,
    (a) => {
      settings.appearance = a;
      changed();
    },
    true,
  );
}
function renderLooks() {
  const box = $("saved-looks");
  box.replaceChildren();
  if (!settings.customPresets.length) return;
  box.append(
    select(
      "Saved atmospheres",
      ["", ...settings.customPresets.map((p) => p.id)],
      "",
      (id) => {
        const preset = settings.customPresets.find((p) => p.id === id);
        if (!preset) return;
        settings.appearance = { ...preset.appearance };
        if (preset.studio) settings.studio = structuredClone(preset.studio);
        void (
          settings.studio.wallpaper
            ? imageData(settings.studio.wallpaper).catch(() => null)
            : Promise.resolve(null)
        ).then((data) => {
          uploaded = data;
          changed();
          renderCustomize();
          renderFlow();
          renderGallery();
        });
      },
      {
        "": "Choose a saved look",
        ...Object.fromEntries(
          settings.customPresets.map((p) => [p.id, p.name]),
        ),
      },
    ),
  );
}
$("save-look").onclick = () => {
  const input = $<HTMLInputElement>("look-name");
  if (!input.value.trim())
    return tell("Give this atmosphere a name first.", true);
  if (settings.customPresets.length >= 100)
    return tell("Maximum 100 saved looks.", true);
  settings.customPresets.push({
    id: crypto.randomUUID(),
    name: input.value.trim(),
    appearance: { ...settings.appearance },
    studio: structuredClone(settings.studio),
  });
  input.value = "";
  changed();
  renderLooks();
};
function renderFlow() {
  const s = settings.studio;
  const controls = $("flow-controls");
  controls.replaceChildren(
    toggle(
      "Focus mode",
      s.focus,
      (v) => {
        s.focus = v;
        changed();
      },
      "Quiet the distractions, keep the important controls.",
    ),
    toggle(
      "Accepted moments",
      s.effects,
      (v) => {
        s.effects = v;
        changed();
      },
      "A small, dismissible celebration when a recognized result changes to Accepted.",
    ),
    toggle(
      "Sound moments",
      s.sound,
      (v) => {
        s.sound = v;
        changed();
      },
      "Opt-in local chime. Browser audio rules require an interaction first.",
    ),
    slider("Sound volume", 0, 1, 0.01, s.volume, "%", (v) => (s.volume = v)),
    button("Preview chime", () => previewSound()),
  );
  const difficulty = $("difficulty-controls");
  difficulty.replaceChildren(
    toggle("Match scenes to difficulty", s.difficultyEnabled, (v) => {
      s.difficultyEnabled = v;
      changed();
    }),
  );
  for (const d of ["easy", "medium", "hard"] as const)
    difficulty.append(
      select(
        d + " challenge",
        scenes.map((scene) => scene.id),
        s.difficultyScenes[d],
        (value) => {
          s.difficultyScenes[d] = value;
          changed();
        },
        Object.fromEntries(scenes.map((scene) => [scene.id, scene.name])),
      ),
    );
}
function previewSound() {
  try {
    const audio = new AudioContext();
    const tone = audio.createOscillator(),
      gain = audio.createGain();
    tone.connect(gain);
    gain.connect(audio.destination);
    gain.gain.setValueAtTime(settings.studio.volume * 0.12, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.7);
    tone.frequency.setValueAtTime(523.25, audio.currentTime);
    tone.frequency.setValueAtTime(659.25, audio.currentTime + 0.18);
    tone.frequency.setValueAtTime(783.99, audio.currentTime + 0.36);
    tone.start();
    tone.stop(audio.currentTime + 0.75);
    setTimeout(() => void audio.close(), 1000);
  } catch (error) {
    tell("Audio preview unavailable: " + String(error), true);
  }
}
async function renderWallpapers() {
  for (const url of urls) URL.revokeObjectURL(url);
  urls.length = 0;
  const list = $("wallpaper-grid");
  list.replaceChildren();
  try {
    const records = await listWallpapers();
    for (const record of records) {
      const tile = el("article", { class: "wallpaper-tile" });
      const url = URL.createObjectURL(record.blob);
      urls.push(url);
      tile.append(
        el("img", { src: url, alt: record.name }),
        el("strong", {}, record.name),
        el(
          "small",
          {},
          `${record.width} × ${record.height} · ${Math.round(record.blob.size / 1024)} KB`,
        ),
      );
      const actions = el("div", { class: "inline" });
      actions.append(
        button(
          settings.studio.wallpaper === record.id
            ? "Selected"
            : "Use wallpaper",
          () => {
            settings.studio.wallpaper = record.id;
            void imageData(record.id).then((data) => {
              uploaded = data;
              changed();
              void renderWallpapers();
              renderGallery();
            });
          },
        ),
        button("Delete", () => {
          if (!window.confirm("Delete this local wallpaper?")) return;
          void deleteWallpaper(record.id)
            .then(() => {
              if (settings.studio.wallpaper === record.id) {
                settings.studio.wallpaper = null;
                uploaded = null;
                changed();
              }
              void renderWallpapers();
            })
            .catch((error) => tell(String(error), true));
        }),
      );
      tile.append(actions);
      list.append(tile);
    }
    if (!records.length)
      list.append(
        el("p", { class: "empty" }, "A blank canvas for your favorite view."),
      );
  } catch (error) {
    tell("Local image storage is unavailable: " + String(error), true);
  }
}
async function drawShare() {
  if (!settings) return;
  const request = ++shareRevision;
  const canvas = $<HTMLCanvasElement>("share-card"),
    ctx = canvas.getContext("2d")!;
  const image = new Image();
  image.src = uploaded ?? sceneUrl(settings.studio.scene);
  try {
    await image.decode();
  } catch {
    return;
  }
  if (request !== shareRevision) return;
  ctx.clearRect(0, 0, 1200, 675);
  const scale = Math.max(1200 / image.width, 675 / image.height);
  ctx.drawImage(
    image,
    (1200 - image.width * scale) / 2,
    (675 - image.height * scale) / 2,
    image.width * scale,
    image.height * scale,
  );
  ctx.fillStyle = "#08111dc9";
  ctx.fillRect(0, 0, 1200, 675);
  ctx.fillStyle = "#d9e5ce";
  ctx.font = "15px system-ui";
  ctx.fillText("VISTARA  /  A LITTLE PROGRESS, EVERY DAY.", 70, 80);
  ctx.fillStyle = "#b9d8ae";
  ctx.font = "20px system-ui";
  ctx.fillText("✓  ACCEPTED", 70, 185);
  ctx.fillStyle = "#fffaf3";
  ctx.font = "46px Georgia";
  const title =
    $<HTMLInputElement>("share-title").value || "A little progress, every day.";
  const words = title.split(/\s+/);
  let line = "",
    y = 270;
  for (const word of words) {
    if (ctx.measureText(line + word).width > 1030 && line) {
      ctx.fillText(line, 70, y);
      y += 60;
      line = "";
    }
    line += word + " ";
  }
  ctx.fillText(line.trim(), 70, y, 1060);
  ctx.fillStyle = "#c9d5cb";
  ctx.font = "19px system-ui";
  const metadata = [
    $<HTMLSelectElement>("share-platform").value,
    $<HTMLSelectElement>("share-difficulty").value,
    $<HTMLInputElement>("share-language").value,
    $<HTMLInputElement>("share-runtime").value,
  ]
    .filter(Boolean)
    .join("   ·   ");
  ctx.fillText(metadata, 70, 480, 1060);
  ctx.strokeStyle = "#d7e3cf33";
  ctx.beginPath();
  ctx.moveTo(70, 555);
  ctx.lineTo(1130, 555);
  ctx.stroke();
  ctx.fillStyle = "#b2c2b2";
  ctx.font = "16px system-ui";
  ctx.fillText(
    $<HTMLInputElement>("share-name").value || "One step closer.",
    70,
    607,
  );
  ctx.textAlign = "right";
  ctx.fillText(
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date()),
    1130,
    607,
  );
  ctx.textAlign = "left";
}
function route() {
  const id = location.hash.slice(1) || "gallery";
  const selected = [
    "gallery",
    "customize",
    "wallpapers",
    "flow",
    "share",
    "chatgpt",
  ].includes(id)
    ? id
    : "gallery";
  for (const view of document.querySelectorAll<HTMLElement>(".studio-view"))
    view.hidden = view.id !== selected;
  for (const link of document.querySelectorAll(".studio-nav"))
    link.classList.toggle(
      "active",
      link.getAttribute("href") === "#" + selected,
    );
  if (selected === "wallpapers") void renderWallpapers();
  if (selected === "share") void drawShare();
}
for (const id of ["platform-preview", "share-platform"])
  for (const platform of codingPlatforms)
    $<HTMLSelectElement>(id).append(
      el("option", { value: platform }, platform),
    );
$("platform-preview").onchange = () => {
  $("demo-platform").textContent =
    $<HTMLSelectElement>("platform-preview").value;
};
$("scene-search").oninput = renderGallery;
$("use-scene").onclick = () => {
  settings.studio.wallpaper = null;
  uploaded = null;
  changed();
  void renderWallpapers();
  renderGallery();
};
$<HTMLInputElement>("wallpaper-upload").onchange = async () => {
  const file = $<HTMLInputElement>("wallpaper-upload").files?.[0];
  if (!file) return;
  try {
    tell("Preparing your wallpaper locally…");
    const record = await importWallpaper(file);
    settings.studio.wallpaper = record.id;
    uploaded = await imageData(record.id);
    changed();
    await renderWallpapers();
    tell("Wallpaper saved locally and selected.");
  } catch (error) {
    tell(String(error), true);
  } finally {
    $<HTMLInputElement>("wallpaper-upload").value = "";
  }
};
for (const id of [
  "share-title",
  "share-platform",
  "share-difficulty",
  "share-language",
  "share-runtime",
  "share-name",
])
  $(id).oninput = () => void drawShare();
$("download-share").onclick = async () => {
  await drawShare();
  $<HTMLCanvasElement>("share-card").toBlob((blob) => {
    if (!blob) return tell("Could not create the card.", true);
    const url = URL.createObjectURL(blob);
    const link = el("a", { href: url, download: "vistara-little-win.png" });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
};
$("demo-run").onclick = () => {
  $("demo-result").textContent = "✓ Accepted · All preview tests passed";
};
window.addEventListener("hashchange", route);
window.addEventListener("pagehide", () => {
  clearTimeout(timer);
  for (const url of urls) URL.revokeObjectURL(url);
  if (dirty) void save(settings);
});
chrome.storage.onChanged.addListener(() => {
  if (dirty || document.activeElement?.matches("input,select,textarea")) return;
  clearTimeout(timer);
  timer = setTimeout(
    () =>
      load()
        .then(async (s) => {
          settings = s;
          liquidControls(
            $("studio-liquid-controls"),
            () => settings.chatgpt,
            (value) => {
              settings.chatgpt = value;
              changed();
            },
          );
          uploaded = s.studio.wallpaper
            ? await imageData(s.studio.wallpaper).catch(() => null)
            : null;
          renderGallery();
          renderCustomize();
          renderFlow();
          updatePreview();
        })
        .catch((error) => tell(String(error), true)),
    160,
  );
});
async function start() {
  settings = await load();
  if (settings.studio.wallpaper) {
    uploaded = await imageData(settings.studio.wallpaper).catch(() => null);
    if (!uploaded)
      tell(
        "This wallpaper is not stored in this browser. Scene artwork is shown instead.",
      );
  }
  liquidControls(
    $("studio-liquid-controls"),
    () => settings.chatgpt,
    (value) => {
      settings.chatgpt = value;
      changed();
    },
  );
  renderCategories();
  renderGallery();
  renderCustomize();
  renderFlow();
  updatePreview();
  route();
  $("save-state").textContent = "Your world, saved locally";
  void drawShare();
}
void start().catch((error) =>
  tell("Studio could not start: " + String(error), true),
);
