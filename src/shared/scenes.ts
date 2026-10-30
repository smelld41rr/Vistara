export type SceneCategory =
  | "Anime"
  | "Nature"
  | "Space"
  | "Cyberpunk"
  | "Minimal"
  | "Royal"
  | "Gaming"
  | "Study";
export interface Scene {
  id: string;
  name: string;
  category: SceneCategory;
  description: string;
  colors: [string, string, string];
  art:
    | "mountain"
    | "city"
    | "orbit"
    | "sakura"
    | "grid"
    | "paper"
    | "forest"
    | "palace";
}
export const scenes: Scene[] = [
  {
    id: "moonlit",
    name: "Moonlit escape",
    category: "Anime",
    description: "Quiet peaks, a thousand possibilities.",
    colors: ["#101833", "#635794", "#edb9b2"],
    art: "mountain",
  },
  {
    id: "sakura",
    name: "Sakura after dark",
    category: "Anime",
    description: "A softer place for your next breakthrough.",
    colors: ["#20152f", "#9e5b8d", "#f3b5ca"],
    art: "sakura",
  },
  {
    id: "studio",
    name: "Sunday studio",
    category: "Anime",
    description: "Warm windows. A world of your own.",
    colors: ["#172d44", "#5e8791", "#f6dbaa"],
    art: "city",
  },
  {
    id: "alpine",
    name: "Alpine stillness",
    category: "Nature",
    description: "Clear your mind. Find your flow.",
    colors: ["#102d35", "#59877c", "#d1d8b1"],
    art: "mountain",
  },
  {
    id: "forest",
    name: "Forest sanctuary",
    category: "Nature",
    description: "Room to breathe between the lines.",
    colors: ["#102b2b", "#35736b", "#b8d6a1"],
    art: "forest",
  },
  {
    id: "cosmos",
    name: "Somewhere beyond",
    category: "Space",
    description: "One small idea. Infinite space.",
    colors: ["#12142e", "#5459ad", "#c3b3ed"],
    art: "orbit",
  },
  {
    id: "neon",
    name: "After hours",
    category: "Cyberpunk",
    description: "The city sleeps. Your ideas do not.",
    colors: ["#15182c", "#405e97", "#dc8bb4"],
    art: "city",
  },
  {
    id: "grid",
    name: "Signal / noise",
    category: "Minimal",
    description: "A little structure. A lot of focus.",
    colors: ["#15232e", "#395363", "#a8d2cf"],
    art: "grid",
  },
  {
    id: "paper",
    name: "Vintage paper",
    category: "Study",
    description: "A familiar calm, reimagined.",
    colors: ["#544438", "#b2a082", "#e5d9bd"],
    art: "paper",
  },
  {
    id: "royal",
    name: "Velvet midnight",
    category: "Royal",
    description: "A workspace worthy of your ambition.",
    colors: ["#211b35", "#71556f", "#cfb27c"],
    art: "palace",
  },
  {
    id: "pixel",
    name: "Pixel horizon",
    category: "Gaming",
    description: "Your next level starts here.",
    colors: ["#112b36", "#3c7a82", "#9dd3bd"],
    art: "grid",
  },
  {
    id: "dawn",
    name: "First light",
    category: "Minimal",
    description: "Start again, with a fresh perspective.",
    colors: ["#433549", "#c58d86", "#f2d5af"],
    art: "mountain",
  },
];
export const sceneById = (id: string) =>
  scenes.find((s) => s.id === id) ?? scenes[0];
/** Original vector artwork. No external images, logos, fonts, or network calls. */
export function sceneSvg(id: string): string {
  const s = sceneById(id);
  const [a, b, c] = s.colors;
  let art = "";
  if (s.art === "mountain")
    art = `<circle cx="1050" cy="230" r="95" fill="${c}" opacity=".85"/><path d="M0 650L260 330 570 690 910 400 1330 700 1600 450V1000H0" fill="${b}"/><path d="M0 800L300 570 650 810 1150 540 1600 770V1000H0" fill="${a}" opacity=".9"/><path d="M910 400L855 480 940 453 1000 493" fill="${c}" opacity=".6"/>`;
  if (s.art === "sakura")
    art =
      `<circle cx="1100" cy="270" r="140" fill="${c}" opacity=".8"/><path d="M0 780Q280 500 600 760T1600 630V1000H0" fill="${a}"/><path d="M-20 0Q300 120 510 400M130 50Q310 260 650 210M250 150Q420 70 770 90" fill="none" stroke="${a}" stroke-width="24"/>` +
      Array.from(
        { length: 65 },
        (_, i) =>
          `<circle cx="${90 + ((i * 137) % 740)}" cy="${40 + ((i * 83) % 340)}" r="${7 + (i % 9)}" fill="${c}" opacity="${0.35 + (i % 5) * 0.12}"/>`,
      ).join("");
  if (s.art === "city")
    art =
      `<circle cx="1170" cy="230" r="115" fill="${c}" opacity=".55"/>` +
      Array.from({ length: 14 }, (_, i) => {
        const h = 160 + ((i * 97) % 300);
        return (
          `<path d="M${i * 125} 1000V${1000 - h}h112V1000" fill="${a}"/>` +
          Array.from(
            { length: 5 },
            (_, j) =>
              `<path d="M${i * 125 + 18} ${1030 - h + j * 42}h16v14h-16z M${i * 125 + 65} ${1030 - h + j * 42}h16v14h-16z" fill="${c}" opacity="${i % 3 === 0 ? 0.7 : 0.2}"/>`,
          ).join("")
        );
      }).join("");
  if (s.art === "orbit")
    art =
      `<circle cx="1100" cy="440" r="200" fill="${b}"/><ellipse cx="1100" cy="440" rx="330" ry="65" transform="rotate(-24 1100 440)" stroke="${c}" stroke-width="22" fill="none" opacity=".6"/>` +
      Array.from(
        { length: 80 },
        (_, i) =>
          `<circle cx="${(i * 137) % 1600}" cy="${(i * 83) % 1000}" r="${1 + (i % 3)}" fill="${c}" opacity=".7"/>`,
      ).join("");
  if (s.art === "forest")
    art =
      Array.from(
        { length: 20 },
        (_, i) =>
          `<path d="M${i * 90 - 90} 1000l90-${340 + ((i * 41) % 260)} 90 ${340 + ((i * 41) % 260)}z" fill="${i % 2 ? a : b}" opacity=".8"/>`,
      ).join("") +
      `<circle cx="1100" cy="210" r="85" fill="${c}" opacity=".6"/>`;
  if (s.art === "grid")
    art =
      Array.from(
        { length: 24 },
        (_, i) =>
          `<path d="M${i * 90} 0V1000 M0 ${i * 70}H1600" stroke="${c}" stroke-width="1" opacity=".15"/>`,
      ).join("") +
      `<circle cx="1100" cy="400" r="210" fill="${b}" opacity=".4"/>`;
  if (s.art === "paper")
    art =
      `<path d="M180 0V1000M190 0V1000" stroke="${a}" opacity=".25"/>` +
      Array.from(
        { length: 20 },
        (_, i) => `<path d="M0 ${i * 54}H1600" stroke="${a}" opacity=".1"/>`,
      ).join("");
  if (s.art === "palace")
    art = `<path d="M270 1000V550a530 530 0 011060 0V1000M350 1000V550a450 450 0 01900 0V1000" stroke="${c}" stroke-width="2" fill="none" opacity=".5"/><path d="M0 850H1600M0 900H1600" stroke="${c}" opacity=".2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><linearGradient id="sky" x2=".4" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><path fill="url(#sky)" d="M0 0h1600v1000H0z"/>${art}</svg>`;
}
export function sceneUrl(id: string): string {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(sceneSvg(id));
}
