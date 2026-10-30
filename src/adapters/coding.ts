import type { Adapter } from "./index";
export const codingAdapters: Adapter[] = [
  {
    id: "leetcode",
    version: 1,
    hosts: ["leetcode.com", "leetcode.cn"],
    dynamic: true,
    coding: true,
    rules: {
      workspace: "#app, #__next, .elf-layout",
      nav: 'nav, [data-cy="navbar"], header',
      panel:
        '[data-track-load="description_content"], #description, [data-testid="problem-description"], [data-testid="testcase-panel"], [data-testid="editor-panel"], .elf-layout > .flexlayout__layout .flexlayout__tab',
      editor: ".monaco-editor, .cm-editor, .CodeMirror",
      menu: '[role="tablist"]',
    },
    difficulty: '[diff], [data-difficulty], [class*="text-difficulty"]',
    verdict:
      '[data-e2e-locator="submission-result"], [data-testid="submission-result"]',
    focus:
      '[data-testid="recommendations"], aside[aria-label="Recommendations"]',
  },
  {
    id: "hackerrank",
    version: 1,
    hosts: ["hackerrank.com"],
    dynamic: true,
    coding: true,
    rules: {
      workspace: "#content, .challenge-interface, .challenge-body",
      nav: ".community-header, .challenge-header, header",
      panel:
        '.challenge_problem_statement, .challenge-editor-wrapper, .challenge-testcases, .challenge-response, [data-testid="problem-statement"]',
      editor: ".monaco-editor, .CodeMirror, .ace_editor",
      menu: '[role="tablist"]',
    },
    difficulty: "[data-difficulty], .difficulty-block",
    verdict: '.challenge-response .status, [data-testid="submission-result"]',
    focus: ".recommended-challenges, .challenge-sidebar",
  },
  {
    id: "geeksforgeeks",
    version: 1,
    hosts: ["geeksforgeeks.org"],
    dynamic: true,
    coding: true,
    rules: {
      workspace: "#__next, #root, .practicePage",
      nav: "header, .header-main__wrapper",
      panel:
        '[class*="problems_problem_content"], [class*="problems_editor"], [class*="problems_testcases"], [data-testid="problem-statement"], .problem-statement',
      editor: ".monaco-editor, .ace_editor, .CodeMirror",
      menu: '[role="tablist"]',
    },
    difficulty: '[data-difficulty], [class*="difficulty"]',
    verdict: '[data-testid="submission-result"]',
    focus: '[data-testid="recommendations"]',
  },
  {
    id: "codeforces",
    version: 1,
    hosts: ["codeforces.com"],
    dynamic: true,
    coding: true,
    rules: {
      workspace: "#body, #pageContent",
      nav: "#header, .menu-box",
      panel:
        ".problem-statement, #sidebar > .roundbox, .submit-form, .datatable",
      editor:
        ".ace_editor, .CodeMirror, .monaco-editor, textarea[name=sourceCode], textarea#sourceCode",
      menu: ".second-level-menu",
    },
    verdict: ".verdict-accepted, .verdict-rejected",
    focus: "#sidebar",
  },
  {
    id: "codechef",
    version: 1,
    hosts: ["codechef.com"],
    dynamic: true,
    coding: true,
    rules: {
      workspace: "#root, #app, #main",
      nav: "header, .m-header",
      panel:
        '#problem-statement, .problem-statement, [data-testid="problem-statement"], [data-testid="testcase-panel"], .ide-container',
      editor: ".monaco-editor, .ace_editor, .CodeMirror",
      menu: '[role="tablist"]',
    },
    difficulty: "[data-difficulty]",
    verdict: '[data-testid="submission-result"]',
    focus: '[data-testid="recommendations"]',
  },
  {
    id: "atcoder",
    version: 1,
    hosts: ["atcoder.jp"],
    dynamic: true,
    coding: true,
    rules: {
      workspace: "#main-container, #main-container > .container",
      nav: ".navbar, #contest-nav",
      panel: "#task-statement, #submit-form, .panel, #standings-table",
      editor:
        ".ace_editor, .CodeMirror, .monaco-editor, textarea[name=sourceCode], textarea#sourceCode",
      menu: ".nav-tabs",
    },
    verdict: '.label-success, [data-testid="submission-result"]',
    focus: ".advertisement",
  },
  {
    id: "code360",
    version: 1,
    hosts: ["naukri.com", "codingninjas.com"],
    path: /\/(code360|codestudio|studio)(\/|$)/,
    dynamic: true,
    coding: true,
    rules: {
      workspace: "app-root, #root, #__next, .problem-container",
      nav: "header, app-header",
      panel:
        '.problem-description, .coding-container, .test-case-container, [data-testid="problem-statement"], [data-testid="editor-panel"]',
      editor: ".monaco-editor, .ace_editor, .CodeMirror",
      menu: '[role="tablist"]',
    },
    difficulty: "[data-difficulty]",
    verdict: '[data-testid="submission-result"]',
    focus: '[data-testid="recommendations"]',
  },
  {
    id: "interviewbit",
    version: 1,
    hosts: ["interviewbit.com"],
    dynamic: true,
    coding: true,
    rules: {
      workspace: "#app, #root, .problem-container",
      nav: "header, .ib-navbar, .navbar",
      panel:
        '.problem-statement, .problem-description, .editor-container, .testcase-container, [data-testid="problem-statement"]',
      editor: ".ace_editor, .monaco-editor, .CodeMirror",
      menu: '[role="tablist"]',
    },
    difficulty: "[data-difficulty]",
    verdict: '[data-testid="submission-result"]',
    focus: '[data-testid="recommendations"]',
  },
  {
    id: "coderbyte",
    version: 1,
    hosts: ["coderbyte.com"],
    dynamic: true,
    coding: true,
    rules: {
      workspace: "#root, #app, #challenge",
      nav: "header, .navbar",
      panel:
        '.challenge-description, .challenge-editor, .testcase-container, [data-testid="problem-statement"]',
      editor: ".ace_editor, .monaco-editor, .CodeMirror",
      menu: '[role="tablist"]',
    },
    difficulty: "[data-difficulty]",
    verdict: '[data-testid="submission-result"]',
    focus: '[data-testid="recommendations"]',
  },
];
