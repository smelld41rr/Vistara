import { init, save } from "../shared/storage";
import {
  appearance,
  cloneDefaults,
  defaults,
  hostname,
  importSettings,
  themes,
  type Settings,
  type Rule,
  type Appearance,
} from "../shared/settings";
import {
  el,
  button,
  toggle,
  notice,
  makePreview,
  appearanceControls,
  preview,
  setStatus,
} from "../shared/ui";
let settings: Settings;
let timer: ReturnType<typeof setTimeout>;
let dirty = false;
let pendingConfirm: (() => void) | null = null;
const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
function confirmAction(title: string, description: string, action: () => void) {
  $("confirm-title").textContent = title;
  $("confirm-description").textContent = description;
  pendingConfirm = action;
  $<HTMLDialogElement>("confirm-dialog").showModal();
}
$("cancel-confirm").onclick = () => {
  $<HTMLDialogElement>("confirm-dialog").close();
  pendingConfirm = null;
};
$("accept-confirm").onclick = () => {
  $<HTMLDialogElement>("confirm-dialog").close();
  pendingConfirm?.();
  pendingConfirm = null;
};
async function persist() {
  try {
    await save(settings);
    notice("Your changes are saved.");
  } catch (e) {
    notice(String(e), true);
  } finally {
    dirty = false;
  }
}
function changed() {
  dirty = true;
  setStatus(settings);
  preview(settings.appearance);
  clearTimeout(timer);
  timer = setTimeout(persist, 350);
}
function renderAppearance() {
  appearanceControls(
    $("appearance-controls"),
    () => settings.appearance,
    (a) => {
      settings.appearance = a;
      changed();
    },
    true,
  );
  $("global").replaceChildren(
    toggle(
      "Enable Vistara",
      settings.enabled,
      (v) => {
        settings.enabled = v;
        changed();
      },
      "A calmer atmosphere on every supported website.",
    ),
  );
  setStatus(settings);
}
function showRoute() {
  const hash = location.hash.slice(1) || "appearance";
  const id = [
    "appearance",
    "sites",
    "presets",
    "accessibility",
    "data",
    "help",
  ].includes(hash)
    ? hash
    : "appearance";
  for (const section of document.querySelectorAll<HTMLElement>(
    ".settings-view",
  ))
    section.hidden = section.id !== id;
  for (const link of document.querySelectorAll(".nav-link"))
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  const titles: Record<string, [string, string]> = {
    appearance: [
      "A different kind of browsing.",
      "Less noise. More atmosphere. Make the everyday feel extraordinary.",
    ],
    sites: [
      "Every website. Your way.",
      "Keep the good things. Change the atmosphere.",
    ],
    presets: [
      "Find your favorite feeling.",
      "A collection of looks that feel like you.",
    ],
    accessibility: [
      "Make room for comfort.",
      "Thoughtful choices for the way you browse.",
    ],
    data: [
      "Your world goes with you.",
      "Simple backups. A fresh start whenever you need one.",
    ],
    help: ["A little clarity.", "Everything you need to feel right at home."],
  };
  $("page-title").textContent = titles[id][0];
  $("page-description").textContent = titles[id][1];
}
function renderSites() {
  const query = $<HTMLInputElement>("site-search").value.toLowerCase();
  const list = $("site-list");
  list.replaceChildren();
  for (const rule of settings.siteOverrides.filter((r) =>
    r.host.includes(query),
  )) {
    const row = el("div", { class: "rule-item" });
    const words = el("div");
    words.append(
      el("strong", {}, rule.host),
      el(
        "small",
        {},
        `${rule.subdomains ? "Including subdomains" : "Exact hostname"} · ${rule.enabled ? (rule.theme ? themes[rule.theme].name : "Global theme") : "Disabled"}`,
      ),
    );
    const actions = el("div", { class: "actions" });
    actions.append(
      button("Edit", () => editRule(rule)),
      button("Remove", () => {
        settings.siteOverrides = settings.siteOverrides.filter(
          (r) => r !== rule,
        );
        changed();
        renderSites();
      }),
    );
    row.append(words, actions);
    list.append(row);
  }
  if (!list.children.length)
    list.append(
      el(
        "p",
        { class: "empty" },
        query
          ? "No matching websites."
          : "No rules yet. Your global look is at home everywhere.",
      ),
    );
  $<HTMLTextAreaElement>("exclusions").value =
    settings.excludedSites.join("\n");
}
function editRule(existing?: Rule) {
  const editor = $("rule-editor");
  editor.replaceChildren();
  const box = el("div", { class: "rule-editor" });
  box.append(
    el("h3", {}, existing ? "Edit website rule" : "A new website rule"),
  );
  const input = el("input", {
    type: "text",
    placeholder: "example.com",
    "aria-label": "Hostname",
  });
  input.value = existing?.host ?? "";
  const hostLabel = el("label", { class: "field" }, "Website hostname");
  hostLabel.append(input);
  let enabled = existing?.enabled ?? true,
    subdomains = existing?.subdomains ?? false,
    useOverride =
      !!existing &&
      Object.keys(existing).some(
        (k) => !["host", "enabled", "subdomains"].includes(k),
      );
  const rest = existing
    ? Object.fromEntries(
        Object.entries(existing).filter(
          ([k]) => !["host", "enabled", "subdomains"].includes(k),
        ),
      )
    : {};
  let a: Appearance = appearance(rest, settings.appearance);
  box.append(
    hostLabel,
    toggle("Enable for this site", enabled, (v) => (enabled = v)),
    toggle("Include subdomains", subdomains, (v) => (subdomains = v)),
  );
  const controls = el("div");
  const render = () => {
    controls.hidden = !useOverride;
    if (useOverride)
      appearanceControls(
        controls,
        () => a,
        (v) => (a = v),
        true,
      );
  };
  box.append(
    toggle("Customize this website", useOverride, (v) => {
      useOverride = v;
      render();
    }),
    controls,
  );
  render();
  const actions = el("div", { class: "quick-actions" });
  actions.append(
    button("Save rule", () => {
      try {
        const host = hostname(input.value);
        const rule: Rule = {
          host,
          enabled,
          subdomains,
          ...(useOverride ? a : {}),
        };
        settings.siteOverrides = settings.siteOverrides.filter(
          (r) =>
            r !== existing && !(r.host === host && r.subdomains === subdomains),
        );
        settings.siteOverrides.push(rule);
        editor.replaceChildren();
        changed();
        renderSites();
      } catch (e) {
        notice(String(e), true);
      }
    }),
    button("Cancel", () => editor.replaceChildren()),
  );
  box.append(actions);
  editor.append(box);
  input.focus();
}
function renderPresets() {
  const list = $("preset-list");
  list.replaceChildren();
  for (const preset of settings.customPresets) {
    const row = el("div", { class: "preset-item" });
    const words = el("div");
    words.append(
      el("strong", {}, preset.name),
      el(
        "small",
        {},
        `${themes[preset.appearance.theme].name} · ${preset.appearance.mode}`,
      ),
    );
    const actions = el("div", { class: "actions" });
    actions.append(
      button("Apply", () => {
        settings.appearance = { ...preset.appearance };
        changed();
        renderAppearance();
        notice("Preset applied.");
      }),
      button("Rename", () => {
        const name = el("input", {
          type: "text",
          "aria-label": "New preset name",
          maxlength: "60",
        });
        name.value = preset.name;
        words.replaceChildren(name);
        actions.replaceChildren(
          button("Save name", () => {
            if (!name.value.trim())
              return notice("Please enter a preset name.", true);
            preset.name = name.value.trim();
            changed();
            renderPresets();
          }),
        );
        name.focus();
      }),
      button("Duplicate", () => {
        if (settings.customPresets.length >= 100)
          return notice("Maximum 100 presets.", true);
        settings.customPresets.push({
          ...structuredClone(preset),
          id: crypto.randomUUID(),
          name: (preset.name + " copy").slice(0, 60),
        });
        changed();
        renderPresets();
      }),
      button("Delete", () =>
        confirmAction(
          "Delete preset?",
          `Remove “${preset.name}”? Your current appearance stays unchanged.`,
          () => {
            settings.customPresets = settings.customPresets.filter(
              (p) => p !== preset,
            );
            changed();
            renderPresets();
          },
        ),
      ),
    );
    row.append(words, actions);
    list.append(row);
  }
  if (!list.children.length)
    list.append(
      el(
        "p",
        { class: "empty" },
        "Your next favorite look starts with the appearance controls.",
      ),
    );
}
function renderAccessibility() {
  const controls = $("accessibility-controls");
  controls.replaceChildren();
  for (const [key, label, detail] of [
    [
      "reduceMotion",
      "Reduce motion",
      "Vistara has no animated page backgrounds; also keeps future effects static.",
    ],
    [
      "highContrast",
      "High contrast",
      "Use solid surfaces with a clearly visible edge.",
    ],
    [
      "disableImagery",
      "Disable ambient backgrounds",
      "Turn off all decorative page backdrops.",
    ],
    [
      "simple",
      "Simple appearance",
      "Use Compatibility mode everywhere, with no backdrop blur.",
    ],
  ] as const)
    controls.append(
      toggle(
        label,
        settings.accessibility[key],
        (v) => {
          settings.accessibility[key] = v;
          changed();
        },
        detail,
      ),
    );
}
function renderAll() {
  renderAppearance();
  renderSites();
  renderPresets();
  renderAccessibility();
  preview(settings.appearance);
}
$("new-rule").onclick = () => editRule();
$("site-search").oninput = renderSites;
$("save-exclusions").onclick = () => {
  try {
    settings.excludedSites = [
      ...new Set(
        $<HTMLTextAreaElement>("exclusions")
          .value.split("\n")
          .map((h) => h.trim())
          .filter(Boolean)
          .map(hostname),
      ),
    ];
    changed();
  } catch (e) {
    notice(String(e), true);
  }
};
$("clear-sites").onclick = () =>
  confirmAction(
    "Reset all website rules?",
    "This removes every override and exclusion. Global appearance and presets stay saved.",
    () => {
      settings.siteOverrides = [];
      settings.excludedSites = [];
      changed();
      renderSites();
    },
  );
$("save-preset").onclick = () => {
  const input = $<HTMLInputElement>("preset-name");
  if (!input.value.trim()) return notice("Give this look a name first.", true);
  if (settings.customPresets.length >= 100)
    return notice("Maximum 100 presets.", true);
  settings.customPresets.push({
    id: crypto.randomUUID(),
    name: input.value.trim(),
    appearance: { ...settings.appearance },
  });
  input.value = "";
  changed();
  renderPresets();
};
$("restore-presets").onclick = () =>
  confirmAction(
    "Restore built-in appearance?",
    "Custom presets will be removed and the global look restored to Midnight defaults.",
    () => {
      settings.customPresets = [];
      settings.appearance = { ...defaults.appearance };
      changed();
      renderPresets();
      renderAppearance();
    },
  );
$("reset-appearance").onclick = () => {
  settings.appearance = { ...defaults.appearance };
  changed();
  renderAppearance();
};
$("export").onclick = () => {
  const blob = new Blob([JSON.stringify(settings, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = el("a", { href: url, download: "vistara-settings.json" });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$<HTMLInputElement>("import-file").onchange = async () => {
  const file = $<HTMLInputElement>("import-file").files?.[0];
  if (!file) return;
  if (file.size > 262144) return notice("File exceeds 256 KB.", true);
  try {
    $<HTMLTextAreaElement>("import-json").value = await file.text();
    notice("File loaded. Choose Validate & import to continue.");
  } catch (e) {
    notice(String(e), true);
  }
};
$("import").onclick = () => {
  try {
    const candidate = importSettings(
      $<HTMLTextAreaElement>("import-json").value,
    );
    confirmAction(
      "Replace current settings?",
      "The validated import will replace all preferences, website rules, and custom presets. Export a backup first if you want to keep them.",
      () => {
        settings = candidate;
        changed();
        renderAll();
        notice("Settings imported.");
      },
    );
  } catch (e) {
    notice("Import rejected: " + String(e), true);
  }
};
$("reset-all").onclick = () =>
  confirmAction(
    "Reset everything?",
    "All settings, website rules, and custom presets will return to their defaults.",
    () => {
      settings = cloneDefaults();
      changed();
      renderAll();
    },
  );
window.addEventListener("hashchange", showRoute);
window.addEventListener("pagehide", () => {
  clearTimeout(timer);
  if (dirty) void save(settings);
});
chrome.storage.onChanged.addListener(() => {
  if (dirty || document.activeElement?.matches("input,textarea,select")) return;
  clearTimeout(timer);
  timer = setTimeout(
    () =>
      init()
        .then((s) => {
          settings = s;
          renderAll();
        })
        .catch((e) => notice(String(e), true)),
    160,
  );
});
init()
  .then((s) => {
    settings = s;
    $("preview").append(makePreview());
    renderAll();
    showRoute();
  })
  .catch((e) => notice(String(e), true));
