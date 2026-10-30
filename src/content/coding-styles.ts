export const codingCss = `
html[data-glassflow="on"][data-gf-coding="true"] {--background:var(--gf-base);--foreground:var(--gf-text);--bg-primary:var(--gf-base);--bg-secondary:rgba(var(--gf-fill),.72);--text-primary:var(--gf-text);--text-secondary:var(--gf-muted);--layer-01:rgba(var(--gf-fill),.72);--color-background:var(--gf-base)}
html[data-glassflow="on"][data-gf-coding="true"]::before {display:none}
html[data-glassflow="on"][data-gf-coding="true"] body {min-height:100vh;background-color:var(--gf-base)!important;background-image:linear-gradient(rgba(var(--gf-dim-fill),var(--gf-dim)),rgba(var(--gf-dim-fill),var(--gf-dim))),var(--gf-wallpaper)!important;background-size:var(--gf-wallpaper-fit)!important;background-position:var(--gf-wallpaper-position)!important;background-attachment:fixed!important;background-repeat:no-repeat!important;color:var(--gf-text)}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-workspace] {background:transparent!important}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-surface] {color:var(--gf-text)!important}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-surface] :where(h1,h2,h3,h4,p,li,td,th,label) {color:inherit}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-surface] a {color:var(--gf-accent)}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-surface] :where(pre,code):not([class*="language-"]) {background:rgba(var(--gf-fill),.8);color:var(--gf-text)}
html[data-glassflow="on"] [data-gf-editor-tone="light"] {--gf-editor-fill:242,246,255;--gf-editor-text:#162746}
html[data-glassflow="on"] [data-gf-editor-tone="dark"] {--gf-editor-fill:17,27,42;--gf-editor-text:#edf3ff}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-editor] {background:rgba(var(--gf-editor-fill),.96)!important;color:var(--gf-editor-text);border-radius:var(--gf-radius);box-shadow:inset 0 0 0 1px rgba(180,200,240,var(--gf-border-alpha))}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-editor] :where(.monaco-editor-background,.margin,.ace_gutter,.cm-gutters) {background:rgba(var(--gf-editor-fill),.98)!important;color:var(--gf-editor-text)}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-editor] :where(.view-lines,.cm-content,.ace_text-layer) {background:transparent!important}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-editor="plain"] {font-size:var(--gf-editor-size)}
html[data-glassflow="on"][data-gf-coding="true"] [data-gf-distraction]{background:rgba(var(--gf-fill),var(--gf-opacity))!important;color:var(--gf-text)!important;border-radius:var(--gf-radius);box-shadow:inset 0 0 0 1px rgba(180,200,240,var(--gf-border-alpha))}
html[data-glassflow="on"][data-gf-focus="true"] [data-gf-distraction] {visibility:hidden!important;pointer-events:none!important}
html[data-glassflow="on"][data-gf-coding="true"][data-gf-mode="compatibility"] body,html[data-glassflow="on"][data-gf-coding="true"][data-gf-ambient="false"] body {background-image:none!important}
@media(forced-colors:active){html[data-glassflow="on"][data-gf-coding="true"] body,html[data-glassflow="on"] [data-gf-editor]{background:Canvas!important;color:CanvasText!important}}
`;
