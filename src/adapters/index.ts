export interface Adapter {
  id: string;
  version: number;
  hosts: string[];
  rules: Record<string, string>;
  dynamic: boolean;
}
export const adapters: Adapter[] = [
  {
    id: "youtube",
    version: 1,
    hosts: ["youtube.com"],
    dynamic: true,
    rules: {
      nav: "ytd-masthead, ytd-guide-renderer, ytd-mini-guide-renderer",
      card: "ytd-rich-grid-media #details, ytd-video-renderer #meta, ytd-playlist-panel-renderer, ytd-comments-header-renderer",
      "input-shell": "ytd-searchbox, yt-searchbox",
      menu: "ytd-menu-popup-renderer, yt-chip-cloud-renderer",
      dialog: 'tp-yt-paper-dialog, [role="dialog"]',
    },
  },
  {
    id: "chatgpt",
    version: 1,
    hosts: ["chatgpt.com"],
    dynamic: true,
    rules: {
      nav: "#stage-slideover-sidebar, aside, header, nav[aria-label]",
      card: '[data-testid="conversation-turn"] > .rounded-xl, [data-testid="suggestion"]',
      "input-shell": 'form[data-type="unified-composer"], #composer-background',
      dialog: '[role="dialog"]',
    },
  },
  {
    id: "google",
    version: 1,
    hosts: [
      "google.com",
      "google.co.uk",
      "google.co.in",
      "google.ca",
      "google.de",
      "google.fr",
      "google.com.au",
    ],
    dynamic: true,
    rules: {
      nav: "#hdtb",
      "input-shell": ".RNNXgb",
      card: "#rso > div > .MjjYud, .related-question-pair",
    },
  },
  {
    id: "github",
    version: 1,
    hosts: ["github.com"],
    dynamic: true,
    rules: {
      nav: ".AppHeader, .Header, .Layout-sidebar",
      card: ".js-issue-row, .Box:not(:has(pre, .blob-wrapper, .js-diff-progressive-container))",
      menu: ".subnav, .UnderlineNav",
    },
  },
  {
    id: "reddit",
    version: 1,
    hosts: ["reddit.com"],
    dynamic: true,
    rules: {
      nav: "header, #left-sidebar-container, .side",
      card: "shreddit-post, .thing.link",
      dialog: '[role="dialog"]',
    },
  },
  {
    id: "wikipedia",
    version: 1,
    hosts: ["wikipedia.org"],
    dynamic: false,
    rules: {
      nav: ".vector-header-container, .vector-column-start",
      card: ".mw-body, .infobox",
      "input-shell": ".cdx-search-input",
    },
  },
  {
    id: "generic",
    version: 1,
    hosts: [],
    dynamic: true,
    rules: {
      nav: 'header[role="banner"], nav[aria-label]',
      card: 'article[data-card], [role="region"][aria-label]',
      menu: '[role="menu"]',
    },
  },
];
export function selectAdapter(host: string): Adapter {
  return (
    adapters.find((a) =>
      a.hosts.some((h) => host === h || host.endsWith("." + h)),
    ) ?? adapters[adapters.length - 1]
  );
}
export function sensitive(url: string): boolean {
  const u = new URL(url);
  return (
    /(^|[.-])(bank|banking|checkout|payment|payments|identity|health|medical|proctor|login|signin)([.-]|$)/i.test(
      u.hostname,
    ) ||
    /\/(checkout|payment|login|signin|oauth|auth|account\/security)(\/|$)/i.test(
      u.pathname,
    ) ||
    /\.(gov|mil)(\.|$)/i.test(u.hostname) ||
    !!document.querySelector(
      'input[type="password"], input[autocomplete="cc-number"], input[autocomplete="cc-csc"]',
    )
  );
}
