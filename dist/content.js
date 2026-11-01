"use strict";(()=>{var P={ocean:{name:"Electric ocean \xB7 reference",peach:"#146BCE",lavender:"#5548ED",pink:"#CF7CFF",sky:"#33DFFF",base:"#061C52"},peach:{name:"Peach aurora",peach:"#F8D9C8",lavender:"#DCD4FA",pink:"#F6DCE9",sky:"#D8E7FF",base:"#FFF8F4"},lavender:{name:"Lavender mist",peach:"#F2DEEA",lavender:"#CEC8F2",pink:"#EFDCF3",sky:"#DDE7FF",base:"#FAF8FF"},sky:{name:"Sky pearl",peach:"#F4E6DA",lavender:"#DBDFFA",pink:"#F4E5ED",sky:"#C8E3FA",base:"#F7FBFF"},rose:{name:"Rose quartz",peach:"#F8D9D2",lavender:"#E1D4EF",pink:"#F5CEE0",sky:"#DFE8FB",base:"#FFF7FA"}},C={enabled:!1,intensity:.65,blur:30,brightness:1,preset:"ocean",animation:!1,sidebarOpacity:.24,composerOpacity:.46,reduceMotion:!1};function D(n){if(n===void 0)return{...C};if(!n||typeof n!="object"||Array.isArray(n))throw Error("Invalid ChatGPT Liquid Glass settings");let t={...C};for(let[e,r]of Object.entries(n)){if(!Object.hasOwn(t,e))throw Error("Unknown Liquid Glass setting: "+e);if(e==="enabled"||e==="animation"||e==="reduceMotion"){if(typeof r!="boolean")throw Error("Invalid Liquid Glass switch");t[e]=r}else if(e==="preset"){if(typeof r!="string"||!Object.hasOwn(P,r))throw Error("Unknown Liquid Glass preset");t.preset=r}else{let a={intensity:[0,1],blur:[4,36],brightness:[.75,1.2],sidebarOpacity:[.12,.85],composerOpacity:[.2,.9]},[o,s]=a[e];if(typeof r!="number"||!Number.isFinite(r)||r<o||r>s)throw Error("Invalid Liquid Glass range: "+e);t[e]=r}}return t}function N(n){try{let t=new URL(n);return["https:","http:"].includes(t.protocol)&&t.hostname==="chatgpt.com"}catch{return!1}}var E=[{id:"moonlit",name:"Moonlit escape",category:"Anime",description:"Quiet peaks, a thousand possibilities.",colors:["#101833","#635794","#edb9b2"],art:"mountain"},{id:"sakura",name:"Sakura after dark",category:"Anime",description:"A softer place for your next breakthrough.",colors:["#20152f","#9e5b8d","#f3b5ca"],art:"sakura"},{id:"studio",name:"Sunday studio",category:"Anime",description:"Warm windows. A world of your own.",colors:["#172d44","#5e8791","#f6dbaa"],art:"city"},{id:"alpine",name:"Alpine stillness",category:"Nature",description:"Clear your mind. Find your flow.",colors:["#102d35","#59877c","#d1d8b1"],art:"mountain"},{id:"forest",name:"Forest sanctuary",category:"Nature",description:"Room to breathe between the lines.",colors:["#102b2b","#35736b","#b8d6a1"],art:"forest"},{id:"cosmos",name:"Somewhere beyond",category:"Space",description:"One small idea. Infinite space.",colors:["#12142e","#5459ad","#c3b3ed"],art:"orbit"},{id:"neon",name:"After hours",category:"Cyberpunk",description:"The city sleeps. Your ideas do not.",colors:["#15182c","#405e97","#dc8bb4"],art:"city"},{id:"grid",name:"Signal / noise",category:"Minimal",description:"A little structure. A lot of focus.",colors:["#15232e","#395363","#a8d2cf"],art:"grid"},{id:"paper",name:"Vintage paper",category:"Study",description:"A familiar calm, reimagined.",colors:["#544438","#b2a082","#e5d9bd"],art:"paper"},{id:"royal",name:"Velvet midnight",category:"Royal",description:"A workspace worthy of your ambition.",colors:["#211b35","#71556f","#cfb27c"],art:"palace"},{id:"pixel",name:"Pixel horizon",category:"Gaming",description:"Your next level starts here.",colors:["#112b36","#3c7a82","#9dd3bd"],art:"grid"},{id:"dawn",name:"First light",category:"Minimal",description:"Start again, with a fresh perspective.",colors:["#433549","#c58d86","#f2d5af"],art:"mountain"}],R=n=>E.find(t=>t.id===n)??E[0];function rt(n){let t=R(n),[e,r,a]=t.colors,o="";return t.art==="mountain"&&(o=`<circle cx="1050" cy="230" r="95" fill="${a}" opacity=".85"/><path d="M0 650L260 330 570 690 910 400 1330 700 1600 450V1000H0" fill="${r}"/><path d="M0 800L300 570 650 810 1150 540 1600 770V1000H0" fill="${e}" opacity=".9"/><path d="M910 400L855 480 940 453 1000 493" fill="${a}" opacity=".6"/>`),t.art==="sakura"&&(o=`<circle cx="1100" cy="270" r="140" fill="${a}" opacity=".8"/><path d="M0 780Q280 500 600 760T1600 630V1000H0" fill="${e}"/><path d="M-20 0Q300 120 510 400M130 50Q310 260 650 210M250 150Q420 70 770 90" fill="none" stroke="${e}" stroke-width="24"/>`+Array.from({length:65},(s,i)=>`<circle cx="${90+i*137%740}" cy="${40+i*83%340}" r="${7+i%9}" fill="${a}" opacity="${.35+i%5*.12}"/>`).join("")),t.art==="city"&&(o=`<circle cx="1170" cy="230" r="115" fill="${a}" opacity=".55"/>`+Array.from({length:14},(s,i)=>{let f=160+i*97%300;return`<path d="M${i*125} 1000V${1e3-f}h112V1000" fill="${e}"/>`+Array.from({length:5},(m,p)=>`<path d="M${i*125+18} ${1030-f+p*42}h16v14h-16z M${i*125+65} ${1030-f+p*42}h16v14h-16z" fill="${a}" opacity="${i%3===0?.7:.2}"/>`).join("")}).join("")),t.art==="orbit"&&(o=`<circle cx="1100" cy="440" r="200" fill="${r}"/><ellipse cx="1100" cy="440" rx="330" ry="65" transform="rotate(-24 1100 440)" stroke="${a}" stroke-width="22" fill="none" opacity=".6"/>`+Array.from({length:80},(s,i)=>`<circle cx="${i*137%1600}" cy="${i*83%1e3}" r="${1+i%3}" fill="${a}" opacity=".7"/>`).join("")),t.art==="forest"&&(o=Array.from({length:20},(s,i)=>`<path d="M${i*90-90} 1000l90-${340+i*41%260} 90 ${340+i*41%260}z" fill="${i%2?e:r}" opacity=".8"/>`).join("")+`<circle cx="1100" cy="210" r="85" fill="${a}" opacity=".6"/>`),t.art==="grid"&&(o=Array.from({length:24},(s,i)=>`<path d="M${i*90} 0V1000 M0 ${i*70}H1600" stroke="${a}" stroke-width="1" opacity=".15"/>`).join("")+`<circle cx="1100" cy="400" r="210" fill="${r}" opacity=".4"/>`),t.art==="paper"&&(o=`<path d="M180 0V1000M190 0V1000" stroke="${e}" opacity=".25"/>`+Array.from({length:20},(s,i)=>`<path d="M0 ${i*54}H1600" stroke="${e}" opacity=".1"/>`).join("")),t.art==="palace"&&(o=`<path d="M270 1000V550a530 530 0 011060 0V1000M350 1000V550a450 450 0 01900 0V1000" stroke="${a}" stroke-width="2" fill="none" opacity=".5"/><path d="M0 850H1600M0 900H1600" stroke="${a}" opacity=".2"/>`),`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><linearGradient id="sky" x2=".4" y2="1"><stop stop-color="${e}"/><stop offset="1" stop-color="${r}"/></linearGradient></defs><path fill="url(#sky)" d="M0 0h1600v1000H0z"/>${o}</svg>`}function H(n){return"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(rt(n))}var M={scene:"moonlit",wallpaper:null,sceneStrength:.7,brightness:.6,fit:"cover",position:"center",focus:!1,editorSize:14,accent:null,glass:"auto",favorites:[],difficultyScenes:{easy:"alpine",medium:"moonlit",hard:"neon"},difficultyEnabled:!1,effects:!1,sound:!1,volume:.25};function j(n){if(n===void 0)return structuredClone(M);if(!n||typeof n!="object"||Array.isArray(n))throw Error("Invalid Studio settings");let t=n,e=structuredClone(M),r=E.map(a=>a.id);for(let[a,o]of Object.entries(t)){if(!Object.hasOwn(e,a))throw Error("Unknown Studio setting: "+a);if(["focus","difficultyEnabled","effects","sound"].includes(a)){if(typeof o!="boolean")throw Error("Invalid Studio switch");e[a]=o}else if(["sceneStrength","brightness","volume","editorSize"].includes(a)){if(typeof o!="number"||!Number.isFinite(o)||o<(a==="editorSize"?11:0)||o>(a==="editorSize"?24:1))throw Error("Invalid Studio range");e[a]=o}else if(a==="scene"){if(typeof o!="string"||!r.includes(o))throw Error("Unknown scene");e.scene=o}else if(a==="wallpaper"){if(o!==null&&(typeof o!="string"||!/^[a-f0-9-]{36}$/.test(o)))throw Error("Invalid local wallpaper ID");e.wallpaper=o}else if(a==="accent"){if(o!==null&&(typeof o!="string"||!/^#[a-f0-9]{6}$/i.test(o)))throw Error("Invalid accent color");e.accent=o}else if(a==="fit"){if(o!=="cover"&&o!=="contain")throw Error("Invalid image fit");e.fit=o}else if(a==="position"){if(o!=="center"&&o!=="top"&&o!=="bottom")throw Error("Invalid image position");e.position=o}else if(a==="glass"){if(o!=="auto"&&o!=="dark"&&o!=="light")throw Error("Invalid glass mode");e.glass=o}else if(a==="favorites"){if(!Array.isArray(o)||o.length>E.length||o.some(s=>typeof s!="string"||!r.includes(s)))throw Error("Invalid favorites");e.favorites=[...new Set(o)]}else if(a==="difficultyScenes"){if(!o||typeof o!="object"||Array.isArray(o)||Object.keys(o).length!==3)throw Error("Invalid difficulty scenes");for(let s of["easy","medium","hard"]){let i=o[s];if(typeof i!="string"||!r.includes(i))throw Error("Invalid difficulty scene");e.difficultyScenes[s]=i}}}return e}function U(n,t){return n.difficultyEnabled&&t&&Object.hasOwn(n.difficultyScenes,t)?n.difficultyScenes[t]:R(n.scene).id}var S={midnight:{name:"Midnight",base:"#081225",fill:"22,35,70",text:"#f5f8ff",muted:"#b7c8e1",accent:"#65b7ff",glow:"#3455cb"},aurora:{name:"Aurora",base:"#170e2b",fill:"54,31,83",text:"#faf7ff",muted:"#dbc5ed",accent:"#d58dff",glow:"#912db2"},arctic:{name:"Arctic",base:"#e6f0ff",fill:"255,255,255",text:"#162746",muted:"#43587a",accent:"#315dbf",glow:"#9bbbea"},orchid:{name:"Orchid",base:"#231b28",fill:"58,41,62",text:"#fff4f7",muted:"#dcc2cf",accent:"#edb5b3",glow:"#895376"},pixel:{name:"Pixel Realm",base:"#111b2a",fill:"22,44,54",text:"#effff8",muted:"#b6d7ce",accent:"#7de4bb",glow:"#277e7d"}},$={chatgpt:{...C},studio:structuredClone(M),schemaVersion:1,enabled:!0,appearance:{theme:"midnight",mode:"balanced",blur:16,opacity:.52,radius:16,intensity:.55,border:.23,shadow:.28,saturation:1.15,ambient:!0,contrast:!1},excludedSites:[],siteOverrides:[],customPresets:[],accessibility:{reduceMotion:!1,highContrast:!1,disableImagery:!1,simple:!1}},L=()=>structuredClone($);function G(n){let t=n.trim().toLowerCase().replace(/\.$/,"");if(!t||t.includes("/")||t.includes(":")||!/^([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(t)||t.length>253)throw Error("Enter a hostname only, such as example.com.");return t}var B=(n,t,e=!1)=>n===t||e&&n.endsWith("."+t);function ot(n){try{let t=new URL(n);return["http:","https:"].includes(t.protocol)&&!["chromewebstore.google.com","chrome.google.com"].includes(t.hostname)}catch{return!1}}var Q={blur:[4,32],opacity:[.2,.9],radius:[8,28],intensity:[0,1],border:[0,1],shadow:[0,1],saturation:[.5,2]};function T(n,t=$.appearance){if(!n||typeof n!="object"||Array.isArray(n))throw Error("Invalid appearance.");let e=n,r={...t};for(let a of Object.keys(e)){if(!Object.hasOwn(t,a))throw Error("Unknown appearance field: "+a);if(a==="theme"){if(typeof e[a]!="string"||!Object.hasOwn(S,e[a]))throw Error("Unknown theme.");r.theme=e[a]}else if(a==="mode"){if(!["balanced","immersive","compatibility"].includes(String(e[a])))throw Error("Unknown mode.");r.mode=e[a]}else if(a==="ambient"||a==="contrast"){if(typeof e[a]!="boolean")throw Error("Invalid boolean.");r[a]=e[a]}else{let o=a,s=e[a];if(typeof s!="number"||!Number.isFinite(s)||s<Q[o][0]||s>Q[o][1])throw Error("Out of range: "+a);r[o]=s}}return r}function z(n){if(!n||typeof n!="object"||Array.isArray(n))throw Error("Settings must be an object.");let t=n;if(t.schemaVersion!==1)throw Error("Unsupported settings version.");if(Object.keys(t).some(i=>!Object.hasOwn($,i)))throw Error("Unknown settings field.");if(typeof t.enabled!="boolean")throw Error("Invalid enabled state.");let e=T(t.appearance);if(!Array.isArray(t.excludedSites)||!Array.isArray(t.siteOverrides)||!Array.isArray(t.customPresets)||t.siteOverrides.length>500||t.customPresets.length>100||t.excludedSites.length>500)throw Error("Invalid or oversized collections.");let r=t.excludedSites.map(i=>{if(typeof i!="string")throw Error("Invalid host.");return G(i)}),a=t.siteOverrides.map(i=>{if(!i||typeof i.host!="string"||typeof i.enabled!="boolean"||typeof i.subdomains!="boolean")throw Error("Invalid site rule.");let{host:f,enabled:m,subdomains:p,...y}=i;return T(y),{host:G(f),enabled:m,subdomains:p,...y}});if(new Set(a.map(i=>i.host+":"+i.subdomains)).size!==a.length)throw Error("Duplicate site rule.");let o=t.customPresets.map(i=>{if(!i||typeof i.id!="string"||typeof i.name!="string"||!i.name.trim()||i.name.length>60||i.id.length>100||Object.keys(i).some(f=>!["id","name","appearance","studio"].includes(f)))throw Error("Invalid preset.");return{id:i.id,name:i.name,appearance:T(i.appearance),...Object.hasOwn(i,"studio")?{studio:j(i.studio)}:{}}});if(new Set(o.map(i=>i.id)).size!==o.length)throw Error("Duplicate preset ID.");let s={...$.accessibility};if(!t.accessibility||typeof t.accessibility!="object")throw Error("Invalid accessibility.");for(let[i,f]of Object.entries(t.accessibility)){if(!Object.hasOwn(s,i)||typeof f!="boolean")throw Error("Invalid accessibility flag.");s[i]=f}return{schemaVersion:1,enabled:t.enabled,appearance:e,excludedSites:r,siteOverrides:a,customPresets:o,accessibility:s,studio:j(t.studio),chatgpt:D(t.chatgpt)}}function W(n){if(n==null)return L();let t=n;return t.schemaVersion===void 0||t.schemaVersion===0?z({...L(),enabled:typeof t.enabled=="boolean"?t.enabled:!0,appearance:T({theme:t.defaultTheme??"midnight",mode:t.defaultMode??"balanced"})}):z(n)}function Y(n,t){let e="";try{e=new URL(t).hostname}catch{}let r=n.siteOverrides.filter(p=>B(e,p.host,p.subdomains)),a=r.find(p=>p.host===e&&!p.subdomains)??r.find(p=>p.host===e),o=r.filter(p=>p.subdomains).sort((p,y)=>y.host.length-p.host.length)[0],s=a??o,i={...n.appearance,...s},f="Active",m=!0;return ot(t)?n.enabled?(n.excludedSites.some(p=>B(e,p,!0))||s?.enabled===!1)&&(m=!1,f="Disabled for this website"):(m=!1,f="Paused globally"):(m=!1,f="Not available on this page"),n.accessibility.simple&&(i.mode="compatibility"),n.accessibility.highContrast&&(i.contrast=!0),n.accessibility.disableImagery&&(i.ambient=!1),{...i,enabled:m,reason:f}}var bt=Promise.resolve();async function X(){let n=await chrome.storage.local.get(["settings","sharedFallback"]),t;try{t=(await chrome.storage.sync.get("shared")).shared}catch{}let e=n.sharedFallback,r=Number(t?.revision??0)>Number(e?.revision??0)?t:e??t,{revision:a,...o}=r??{};try{return W(n.settings||r?{...L(),...n.settings??{},...o}:null)}catch(s){throw await chrome.storage.local.set({migrationBackup:n.settings??o}),Error("Stored settings could not be migrated. A local backup was preserved. "+String(s))}}var J=[{id:"leetcode",version:1,hosts:["leetcode.com","leetcode.cn"],dynamic:!0,coding:!0,rules:{workspace:"#app, #__next, .elf-layout",nav:'nav, [data-cy="navbar"], header',panel:'[data-track-load="description_content"], #description, [data-testid="problem-description"], [data-testid="testcase-panel"], [data-testid="editor-panel"], .elf-layout > .flexlayout__layout .flexlayout__tab',editor:".monaco-editor, .cm-editor, .CodeMirror",menu:'[role="tablist"]'},difficulty:'[diff], [data-difficulty], [class*="text-difficulty"]',verdict:'[data-e2e-locator="submission-result"], [data-testid="submission-result"]',focus:'[data-testid="recommendations"], aside[aria-label="Recommendations"]'},{id:"hackerrank",version:1,hosts:["hackerrank.com"],dynamic:!0,coding:!0,rules:{workspace:"#content, .challenge-interface, .challenge-body",nav:".community-header, .challenge-header, header",panel:'.challenge_problem_statement, .challenge-editor-wrapper, .challenge-testcases, .challenge-response, [data-testid="problem-statement"]',editor:".monaco-editor, .CodeMirror, .ace_editor",menu:'[role="tablist"]'},difficulty:"[data-difficulty], .difficulty-block",verdict:'.challenge-response .status, [data-testid="submission-result"]',focus:".recommended-challenges, .challenge-sidebar"},{id:"geeksforgeeks",version:1,hosts:["geeksforgeeks.org"],dynamic:!0,coding:!0,rules:{workspace:"#__next, #root, .practicePage",nav:"header, .header-main__wrapper",panel:'[class*="problems_problem_content"], [class*="problems_editor"], [class*="problems_testcases"], [data-testid="problem-statement"], .problem-statement',editor:".monaco-editor, .ace_editor, .CodeMirror",menu:'[role="tablist"]'},difficulty:'[data-difficulty], [class*="difficulty"]',verdict:'[data-testid="submission-result"]',focus:'[data-testid="recommendations"]'},{id:"codeforces",version:1,hosts:["codeforces.com"],dynamic:!0,coding:!0,rules:{workspace:"#body, #pageContent",nav:"#header, .menu-box",panel:".problem-statement, #sidebar > .roundbox, .submit-form, .datatable",editor:".ace_editor, .CodeMirror, .monaco-editor, textarea[name=sourceCode], textarea#sourceCode",menu:".second-level-menu"},verdict:".verdict-accepted, .verdict-rejected",focus:"#sidebar"},{id:"codechef",version:1,hosts:["codechef.com"],dynamic:!0,coding:!0,rules:{workspace:"#root, #app, #main",nav:"header, .m-header",panel:'#problem-statement, .problem-statement, [data-testid="problem-statement"], [data-testid="testcase-panel"], .ide-container',editor:".monaco-editor, .ace_editor, .CodeMirror",menu:'[role="tablist"]'},difficulty:"[data-difficulty]",verdict:'[data-testid="submission-result"]',focus:'[data-testid="recommendations"]'},{id:"atcoder",version:1,hosts:["atcoder.jp"],dynamic:!0,coding:!0,rules:{workspace:"#main-container, #main-container > .container",nav:".navbar, #contest-nav",panel:"#task-statement, #submit-form, .panel, #standings-table",editor:".ace_editor, .CodeMirror, .monaco-editor, textarea[name=sourceCode], textarea#sourceCode",menu:".nav-tabs"},verdict:'.label-success, [data-testid="submission-result"]',focus:".advertisement"},{id:"code360",version:1,hosts:["naukri.com","codingninjas.com"],path:/\/(code360|codestudio|studio)(\/|$)/,dynamic:!0,coding:!0,rules:{workspace:"app-root, #root, #__next, .problem-container",nav:"header, app-header",panel:'.problem-description, .coding-container, .test-case-container, [data-testid="problem-statement"], [data-testid="editor-panel"]',editor:".monaco-editor, .ace_editor, .CodeMirror",menu:'[role="tablist"]'},difficulty:"[data-difficulty]",verdict:'[data-testid="submission-result"]',focus:'[data-testid="recommendations"]'},{id:"interviewbit",version:1,hosts:["interviewbit.com"],dynamic:!0,coding:!0,rules:{workspace:"#app, #root, .problem-container",nav:"header, .ib-navbar, .navbar",panel:'.problem-statement, .problem-description, .editor-container, .testcase-container, [data-testid="problem-statement"]',editor:".ace_editor, .monaco-editor, .CodeMirror",menu:'[role="tablist"]'},difficulty:"[data-difficulty]",verdict:'[data-testid="submission-result"]',focus:'[data-testid="recommendations"]'},{id:"coderbyte",version:1,hosts:["coderbyte.com"],dynamic:!0,coding:!0,rules:{workspace:"#root, #app, #challenge",nav:"header, .navbar",panel:'.challenge-description, .challenge-editor, .testcase-container, [data-testid="problem-statement"]',editor:".ace_editor, .monaco-editor, .CodeMirror",menu:'[role="tablist"]'},difficulty:"[data-difficulty]",verdict:'[data-testid="submission-result"]',focus:'[data-testid="recommendations"]'}];var I=[...J,{id:"youtube",version:1,hosts:["youtube.com"],dynamic:!0,rules:{nav:"ytd-masthead, ytd-guide-renderer, ytd-mini-guide-renderer",card:"ytd-rich-grid-media #details, ytd-video-renderer #meta, ytd-playlist-panel-renderer, ytd-comments-header-renderer","input-shell":"ytd-searchbox, yt-searchbox",menu:"ytd-menu-popup-renderer, yt-chip-cloud-renderer",dialog:'tp-yt-paper-dialog, [role="dialog"]'}},{id:"chatgpt",version:1,hosts:["chatgpt.com"],dynamic:!0,rules:{nav:"#stage-slideover-sidebar, aside, header, nav[aria-label]",card:'[data-testid="conversation-turn"] > .rounded-xl, [data-testid="suggestion"]',"input-shell":'form[data-type="unified-composer"], #composer-background',dialog:'[role="dialog"]'}},{id:"google",version:1,hosts:["google.com","google.co.uk","google.co.in","google.ca","google.de","google.fr","google.com.au"],dynamic:!0,rules:{nav:"#hdtb","input-shell":".RNNXgb",card:"#rso > div > .MjjYud, .related-question-pair"}},{id:"github",version:1,hosts:["github.com"],dynamic:!0,rules:{nav:".AppHeader, .Header, .Layout-sidebar",card:".js-issue-row, .Box:not(:has(pre, .blob-wrapper, .js-diff-progressive-container))",menu:".subnav, .UnderlineNav"}},{id:"reddit",version:1,hosts:["reddit.com"],dynamic:!0,rules:{nav:"header, #left-sidebar-container, .side",card:"shreddit-post, .thing.link",dialog:'[role="dialog"]'}},{id:"wikipedia",version:1,hosts:["wikipedia.org"],dynamic:!1,rules:{nav:".vector-header-container, .vector-column-start",card:".mw-body, .infobox","input-shell":".cdx-search-input"}},{id:"generic",version:1,hosts:[],dynamic:!0,rules:{nav:'header[role="banner"], nav[aria-label]',card:'article[data-card], [role="region"][aria-label]',menu:'[role="menu"]'}}];function K(n,t="/"){return I.find(e=>e.hosts.some(r=>n===r||n.endsWith("."+r))&&(!e.path||e.path.test(t)))??I[I.length-1]}function q(n){let t=new URL(n);return/(^|[.-])(bank|banking|checkout|payment|payments|identity|health|medical|proctor|login|signin)([.-]|$)/i.test(t.hostname)||/\/(checkout|payment|login|signin|oauth|auth|account\/security)(\/|$)/i.test(t.pathname)||/\.(gov|mil)(\.|$)/i.test(t.hostname)||Array.from(document.querySelectorAll('input[type="password"], input[autocomplete="cc-number"], input[autocomplete="cc-csc"]')).some(e=>{let r=getComputedStyle(e);return!e.closest('[hidden], [inert], [aria-hidden="true"]')&&e.getClientRects().length>0&&r.display!=="none"&&r.visibility!=="hidden"&&Number(r.opacity)!==0})}var Z=`/* ChatGPT only. No layout replacement, page-content filters or global resets. */
html[data-vistara-liquid="on"] {
  background: var(--vl-base) !important;
  isolation: isolate;
  --main-surface-primary: transparent;
  --main-surface-secondary: rgba(255, 255, 255, 0.38);
  --main-surface-tertiary: rgba(255, 255, 255, 0.5);
  --sidebar-surface-primary: transparent;
  --sidebar-surface-secondary: rgba(255, 255, 255, 0.34);
  --bg-primary: transparent;
  --bg-secondary: rgba(255, 255, 255, 0.38);
  --bg-tertiary: rgba(255, 255, 255, 0.48);
  --bg-elevated-primary: rgba(255, 255, 255, 0.88);
  --bg-elevated-secondary: rgba(255, 255, 255, 0.56);
  --text-primary: #37343e;
  --text-secondary: #65616e;
  --text-tertiary: #77717d;
  --text-placeholder: #77717d;
  --border-light: rgba(255, 255, 255, 0.65);
  --border-medium: rgba(156, 145, 181, 0.28);
}
html[data-vistara-liquid="on"] body {
  background: transparent !important;
  color: #37343e;
}
html[data-vistara-liquid="on"] [data-vl-part="shell"],
html[data-vistara-liquid="on"] [data-vl-part="main"],
html[data-vistara-liquid="on"] [data-vl-part="header"] {
  background: transparent !important;
}
html[data-vistara-liquid="on"] [data-vl-decoration] {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none !important;
  user-select: none;
  contain: strict;
  filter: brightness(var(--vl-brightness));
}
html[data-vistara-liquid="on"] [data-vl-decoration] * {
  pointer-events: none !important;
}
html[data-vistara-liquid="on"] .vl-aurora {
  position: absolute;
  inset: -4vmax;
  background:
    radial-gradient(
      ellipse at 12% 20%,
      var(--vl-peach),
      transparent var(--vl-blend)
    ),
    radial-gradient(ellipse at 60% 0%, #fff5dc, transparent 58%),
    radial-gradient(ellipse at 96% 32%, var(--vl-pink), transparent 56%),
    radial-gradient(ellipse at 20% 95%, var(--vl-lavender), transparent 62%),
    radial-gradient(ellipse at 62% 82%, var(--vl-sky), transparent 62%),
    linear-gradient(
      130deg,
      var(--vl-base),
      var(--vl-peach) 43%,
      var(--vl-lavender)
    );
  animation: vl-drift 36s ease-in-out infinite alternate;
  animation-play-state: paused;
}
html[data-vistara-liquid="on"] .vl-orb {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.66);
  border-radius: 50%;
  background:
    linear-gradient(
      128deg,
      rgba(255, 255, 255, 0.03) 20%,
      rgba(255, 255, 255, 0.36) 42%,
      rgba(255, 227, 210, 0.42) 49%,
      rgba(255, 255, 255, 0.32) 50%,
      rgba(192, 201, 248, 0.12) 64%,
      rgba(255, 255, 255, 0.03) 79%
    ),
    radial-gradient(
      ellipse at 20% 12%,
      rgba(255, 255, 255, 0.45),
      transparent 55%
    );
  box-shadow:
    inset 2px 2px 3px rgba(255, 255, 255, 0.78),
    inset -4px -5px 12px rgba(182, 168, 220, 0.12),
    0 0 14px rgba(255, 255, 255, 0.28);
  opacity: calc(0.35 + var(--vl-intensity) * 0.65);
}
html[data-vistara-liquid="on"] .vl-orb-left {
  width: min(58vw, 920px);
  aspect-ratio: 1;
  left: -23vw;
  bottom: -34vh;
  transform: rotate(24deg);
}
html[data-vistara-liquid="on"] .vl-orb-top {
  width: min(44vw, 690px);
  aspect-ratio: 1;
  right: -24vw;
  top: -39vh;
  transform: rotate(-18deg);
}
html[data-vistara-liquid="on"] .vl-orb-right {
  width: min(35vw, 550px);
  aspect-ratio: 1.42;
  right: -15vw;
  bottom: -11vh;
  transform: rotate(-18deg);
}
html[data-vistara-liquid="on"] [data-vl-part="sidebar"] {
  background: rgba(255, 255, 255, var(--vl-sidebar-opacity)) !important;
  color: #38343f;
  border-radius: 28px;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.82),
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    0 16px 48px rgba(125, 111, 162, var(--vl-shadow));
  backdrop-filter: blur(var(--vl-blur)) saturate(1.12);
  -webkit-backdrop-filter: blur(var(--vl-blur)) saturate(1.12);
}
html[data-vistara-liquid="on"]
  [data-vl-part="sidebar"]
  :where(nav, [data-testid="sidebar-content"]) {
  background: transparent !important;
}
html[data-vistara-liquid="on"] [data-vl-part="sidebar"] :where(a, button) {
  color: inherit;
  border-radius: 14px;
  transition:
    background-color 0.18s,
    box-shadow 0.18s;
}
html[data-vistara-liquid="on"]
  [data-vl-part="sidebar"]
  :where(a, button):hover {
  background-color: rgba(255, 255, 255, 0.33);
}
html[data-vistara-liquid="on"]
  [data-vl-part="sidebar"]
  :where([aria-current="page"], [data-active="true"]) {
  background: rgba(255, 255, 255, 0.48) !important;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.82),
    0 4px 18px rgba(122, 108, 151, 0.06);
}
html[data-vistara-liquid="on"] [data-vl-part="home-title"] {
  color: #3e3a43;
  font-weight: 500;
  letter-spacing: -0.035em;
}
html[data-vistara-liquid="on"] [data-vl-part="composer"] {
  background: rgba(255, 255, 255, var(--vl-composer-opacity)) !important;
  color: #393540;
  border-radius: 36px !important;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.94),
    0 16px 50px rgba(145, 112, 144, var(--vl-shadow)),
    0 0 0 10px rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(var(--vl-blur)) saturate(1.13);
  -webkit-backdrop-filter: blur(var(--vl-blur)) saturate(1.13);
  transition:
    box-shadow 0.2s,
    background-color 0.2s;
}
html[data-vistara-liquid="on"] [data-vl-part="composer"]:focus-within {
  box-shadow:
    inset 0 0 0 1px #fff,
    0 14px 50px rgba(145, 112, 144, var(--vl-shadow)),
    0 0 0 10px rgba(255, 255, 255, 0.17),
    0 0 0 12px rgba(165, 151, 227, 0.15);
}
html[data-vistara-liquid="on"]
  [data-vl-part="composer"]
  :where(textarea, [contenteditable="true"]) {
  background: transparent !important;
  color: #393540;
  caret-color: #6955aa;
}
html[data-vistara-liquid="on"] [data-vl-part="composer"] textarea::placeholder {
  color: #79717d;
  opacity: 1;
}
html[data-vistara-liquid="on"]
  [data-vl-part="composer"]
  [data-placeholder]:empty:before {
  color: #79717d;
}
html[data-vistara-liquid="on"] [data-vl-part="composer"] button {
  border-radius: 50%;
  transition:
    box-shadow 0.18s,
    background-color 0.18s;
}
html[data-vistara-liquid="on"]
  [data-vl-part="composer"]
  button:not([data-testid="send-button"]):not(
    [data-testid="composer-speech-button"]
  ):hover {
  background-color: rgba(255, 255, 255, 0.4);
}
html[data-vistara-liquid="on"]
  [data-vl-part="composer"]
  :where(
    button[data-testid="send-button"],
    button[data-testid="composer-speech-button"],
    button[data-testid="voice-button"]
  ) {
  background: #6368db;
  color: #fff;
  box-shadow:
    inset 0 1px 1px #ffffff60,
    0 4px 12px #7777c530;
}
html[data-vistara-liquid="on"] [data-vl-part="segment"] {
  background: rgba(255, 255, 255, 0.25) !important;
  color: #47414e;
  border-radius: 999px;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.6),
    0 4px 22px rgba(135, 122, 161, 0.08);
  backdrop-filter: blur(14px);
}
html[data-vistara-liquid="on"]
  [data-vl-part="segment"]
  :where(button, [role="tab"]) {
  border-radius: 999px;
  color: inherit;
  transition:
    background-color 0.18s,
    box-shadow 0.18s;
}
html[data-vistara-liquid="on"]
  [data-vl-part="segment"]
  :where([aria-selected="true"], [aria-pressed="true"]) {
  background: rgba(255, 255, 255, 0.63) !important;
  box-shadow: 0 2px 12px rgba(137, 111, 139, 0.1);
}
html[data-vistara-liquid="on"] [data-vl-part="message"] {
  background: rgba(255, 255, 255, 0.24);
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px #ffffff45;
}
html[data-vistara-liquid="on"] [data-vl-part="dialog"],
html[data-vistara-liquid="on"] [data-vl-part="menu"] {
  background: rgba(255, 255, 255, 0.91) !important;
  color: #393540;
  border-radius: 18px;
  box-shadow:
    inset 0 0 0 1px #ffffffe6,
    0 18px 60px #75609026;
  backdrop-filter: blur(18px);
}
html[data-vistara-liquid="on"] [data-vl-part="code"] {
  background: var(--vl-code-bg, #162031) !important;
  color: var(--vl-code-fg, #eff4ff) !important;
  backdrop-filter: none;
}
html[data-vistara-liquid="on"]
  [data-vl-part="main"]
  :where(.markdown table, [data-message-author-role] table) {
  border-color: #a49bab;
  background: rgba(255, 255, 255, 0.28);
}
html[data-vistara-liquid="on"]
  :where(
    [data-vl-part="sidebar"],
    [data-vl-part="composer"],
    [data-vl-part="segment"],
    [data-vl-part="dialog"],
    [data-vl-part="menu"]
  )
  :where(button, a, textarea, [contenteditable="true"]):focus-visible {
  outline: 2px solid #7970bd;
  outline-offset: 3px;
}
html[data-vistara-liquid="on"] [data-vl-part] button:disabled {
  opacity: 0.45;
}
html[data-vistara-liquid="on"][data-vl-motion="true"][data-vl-paused="false"]
  .vl-aurora {
  animation-play-state: running;
}
html[data-vistara-liquid="on"][data-vl-reduced="true"] [data-vl-part],
html[data-vistara-liquid="on"][data-vl-reduced="true"]
  [data-vl-part]
  :where(button, a) {
  transition: none;
}
html[data-vistara-liquid="on"][data-vl-contrast="true"]
  [data-vl-part="sidebar"],
html[data-vistara-liquid="on"][data-vl-contrast="true"]
  [data-vl-part="composer"] {
  background: rgba(255, 255, 255, 0.97) !important;
  backdrop-filter: none;
}
@keyframes vl-drift {
  from {
    transform: translate(-1%, 0);
  }
  to {
    transform: translate(1%, 1.5%);
  }
}
@media (max-width: 760px) {
  html[data-vistara-liquid="on"] [data-vl-part="sidebar"] {
    border-radius: 20px;
  }
  html[data-vistara-liquid="on"] [data-vl-part="composer"] {
    border-radius: 28px !important;
  }
  html[data-vistara-liquid="on"] .vl-orb-left {
    width: 90vw;
    left: -50vw;
    bottom: -10vh;
  }
  html[data-vistara-liquid="on"] .vl-orb-top {
    width: 90vw;
    right: -60vw;
    top: -20vh;
  }
  html[data-vistara-liquid="on"] .vl-orb-right {
    width: 70vw;
    right: -40vw;
    bottom: -5vh;
  }
}
@media (prefers-reduced-motion: reduce) {
  html[data-vistara-liquid="on"] .vl-aurora {
    animation: none !important;
  }
  html[data-vistara-liquid="on"] [data-vl-part],
  html[data-vistara-liquid="on"] [data-vl-part] :where(button, a) {
    transition: none !important;
  }
}
@media (forced-colors: active) {
  html[data-vistara-liquid="on"],
  html[data-vistara-liquid="on"] body {
    background: Canvas !important;
    color: CanvasText !important;
  }
  html[data-vistara-liquid="on"] [data-vl-decoration] {
    display: none;
  }
  html[data-vistara-liquid="on"] [data-vl-part] {
    background: Canvas !important;
    color: CanvasText !important;
    box-shadow: none;
    backdrop-filter: none;
  }
  html[data-vistara-liquid="on"] [data-vl-part="composer"] {
    outline: 1px solid CanvasText;
  }
}
@supports not (backdrop-filter: blur(1px)) {
  html[data-vistara-liquid="on"] [data-vl-part="sidebar"],
  html[data-vistara-liquid="on"] [data-vl-part="composer"] {
    background: rgba(255, 255, 255, 0.9) !important;
  }
}
/* Host dark-mode prose tokens must not leave conversation text white on pastel. */
html[data-vistara-liquid="on"] [data-vl-part="main"] .markdown {
  color: #37343e;
  --tw-prose-body: #37343e;
  --tw-prose-headings: #37343e;
  --tw-prose-links: #62519b;
  --tw-prose-bold: #37343e;
  --tw-prose-counters: #655c6e;
  --tw-prose-bullets: #807486;
  --tw-prose-quotes: #57495e;
  --tw-prose-code: #56456b;
  --tw-prose-pre-code: #eff4ff;
  --tw-prose-pre-bg: #162031;
}
html[data-vistara-liquid="on"]
  [data-vl-part="composer"]
  #prompt-textarea
  [data-placeholder]::before {
  color: #79717d;
}
/* Electric Ocean: reference-inspired blue glass. Existing pastel presets remain intact. */
html[data-vistara-liquid="on"][data-vl-preset="ocean"] {
  color-scheme: dark;
  --text-primary: #f2f7ff;
  --text-secondary: #c1d5ff;
  --text-tertiary: #a9c7f5;
  --text-placeholder: #b5c9ed;
  --main-surface-secondary: #153f816e;
  --main-surface-tertiary: #306ac17a;
  --sidebar-surface-secondary: #3380db40;
  --bg-secondary: #153f816e;
  --bg-tertiary: #306ac17a;
  --bg-elevated-primary: #102b60;
  --bg-elevated-secondary: #173c77;
  --border-light: #8fcdff66;
  --border-medium: #78b7ff80;
}
html[data-vistara-liquid="on"][data-vl-preset="ocean"] body {
  color: #f2f7ff;
}
html[data-vl-preset="ocean"] .vl-aurora {
  background:
    radial-gradient(ellipse at 82% 24%, #147fd78c, transparent 43%),
    radial-gradient(ellipse at 40% 5%, #149fdb8c, transparent 36%),
    radial-gradient(ellipse at 76% 77%, #4448df80, transparent 42%),
    radial-gradient(ellipse at 10% 72%, #2044b5b3, transparent 45%),
    linear-gradient(135deg, #061435, #0a3178 48%, #071746);
}
/* The reflected floor uses only decorative layers, never a foreground filter. */
html[data-vl-preset="ocean"] [data-vl-decoration]::before {
  content: "";
  position: absolute;
  z-index: 2;
  left: -10%;
  right: -10%;
  bottom: -10%;
  height: 30%;
  transform: perspective(420px) rotateX(35deg) rotate(-2deg);
  background:
    repeating-linear-gradient(176deg, transparent 0 13px, #6cbaff24 14px, transparent 16px 27px),
    radial-gradient(ellipse at 44% 45%, #346bffb3, transparent 43%),
    linear-gradient(173deg, transparent 25%, #83dfff80 26%, #174bffa6 27%, transparent 31%, #ae81ff66 52%, #23ccff99 54%, transparent 56%),
    linear-gradient(#081a4566, #07153ed9);
}
html[data-vl-preset="ocean"] [data-vl-decoration]::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 22% 20%, #8879ff 0 1px, transparent 2px),
    radial-gradient(circle at 83% 37%, #4adaff 0 1px, transparent 2px),
    radial-gradient(circle at 70% 16%, #9386ff 0 1px, transparent 2px);
  background-size: 197px 223px, 307px 191px, 271px 283px;
  opacity: .24;
  mask-image: linear-gradient(90deg, transparent 15%, #000 22%, transparent 60%, #000 90%);
}
html[data-vl-preset="ocean"] .vl-orb {
  border: 1px solid #9cefff9c;
  background:
    radial-gradient(ellipse at 76% 14%, #ffb7ffcc, transparent 17%),
    radial-gradient(ellipse at 92% 57%, #b77aff9c, transparent 27%),
    radial-gradient(ellipse at 15% 80%, #20dfff9c, transparent 25%),
    radial-gradient(ellipse at 45% 40%, #0e246f05 30%, #1c51cf66 65%, #91f8ffb3 83%, #a987ffb3 90%, #1222551a 97%);
  box-shadow: inset 3px 4px 7px #a2f5ffb3, inset -8px -12px 26px #705aff99,
    inset 0 0 58px #2944a966, 0 -3px 18px #16dbff66, 0 8px 38px #4c45ff80;
  opacity: calc(.72 + var(--vl-intensity) * .28);
}
html[data-vl-preset="ocean"] .vl-orb-top {
  width: min(55vw, 980px);
  aspect-ratio: 1.4;
  right: -1vw;
  top: 13vh;
  transform: rotate(-27deg);
}
html[data-vl-preset="ocean"] .vl-orb-left {
  width: min(42vw, 700px);
  aspect-ratio: 1.25;
  left: -9vw;
  bottom: 3vh;
  transform: rotate(28deg);
}
html[data-vl-preset="ocean"] .vl-orb-right {
  width: min(32vw, 550px);
  aspect-ratio: 1.25;
  right: -17vw;
  bottom: 3vh;
  transform: rotate(-22deg);
}
html[data-vl-preset="ocean"] .vl-aurora::after {
  content: "";
  position: absolute;
  width: clamp(70px, 8.5vw, 150px);
  aspect-ratio: 1;
  left: 28%;
  top: 29%;
  border-radius: 50%;
  background: radial-gradient(circle at 75% 20%, #d98affb3, transparent 25%),
    radial-gradient(circle at 22% 78%, #64faffbf, transparent 30%),
    radial-gradient(circle at 40% 40%, #122d63aa 35%, #2d67d280 60%, #a0ffffc9 72%, #7064ff99 78%, transparent 85%);
  box-shadow: inset 2px 3px 9px #84deff80, inset -4px -5px 9px #706affb3, 0 0 12px #137dce66;
}
html[data-vl-preset="ocean"] [data-vl-part="sidebar"] {
  background: rgba(48, 100, 186, var(--vl-sidebar-opacity)) !important;
  color: #f0f6ff;
  border-radius: 24px;
  box-shadow: inset 0 0 0 1px #a4d7ff80, inset 0 1px 14px #b1d4ff26,
    0 0 20px #528fff38, 8px 0 30px #05205a40;
  backdrop-filter: blur(var(--vl-blur)) saturate(1.5);
}
html[data-vl-preset="ocean"] [data-vl-part="sidebar"] :where(a, button):hover {
  background: #4298ff40;
}
html[data-vl-preset="ocean"] [data-vl-part="sidebar"] :where([aria-current="page"], [data-active="true"]) {
  background: linear-gradient(120deg, #6859ffba, #1756bc99 55%, #2ae3ff9c) !important;
  box-shadow: inset 0 0 0 1px #a9cfff99, inset 0 1px 10px #c9f8ff80,
    0 0 18px #594bffbf;
}
html[data-vl-preset="ocean"] [data-vl-part="home-title"] {
  color: #f3f7ff;
  font-weight: 600;
  text-shadow: 0 2px 20px #09214b80;
}
html[data-vl-preset="ocean"] [data-vl-part="composer"] {
  background: linear-gradient(105deg, #6ba8f02e, #c4c9ff26 45%, #1360ba33),
    rgba(39, 88, 170, var(--vl-composer-opacity)) !important;
  color: #f4f8ff;
  border-radius: 48px !important;
  box-shadow: inset 0 0 0 1px #a9efffdb, inset 0 2px 12px #a2e9ff8c,
    inset 0 -2px 9px #6c9dff9c, 0 0 22px #2393ff80, 0 14px 36px #03174080;
  backdrop-filter: blur(var(--vl-blur)) saturate(1.5);
}
html[data-vl-preset="ocean"] [data-vl-part="composer"]:focus-within {
  box-shadow: inset 0 0 0 1px #c4f8ff, inset 0 2px 14px #a2e9ff99,
    0 0 0 2px #57cfff55, 0 0 28px #2393ff99, 0 14px 36px #03174080;
}
html[data-vl-preset="ocean"] [data-vl-part="composer"] :where(textarea, [contenteditable="true"]) {
  color: #f4f8ff;
  caret-color: #9ff7ff;
}
html[data-vl-preset="ocean"] [data-vl-part="composer"] textarea::placeholder,
html[data-vl-preset="ocean"] [data-vl-part="composer"] [data-placeholder]:empty::before,
html[data-vl-preset="ocean"] [data-vl-part="composer"] #prompt-textarea [data-placeholder]::before {
  color: #bacded !important;
}
html[data-vl-preset="ocean"] [data-vl-part="composer"] button { color: #eef7ff; }
html[data-vl-preset="ocean"] [data-vl-part="composer"] :where(button[data-testid="send-button"], button[data-testid="composer-speech-button"], button[data-testid="voice-button"]) {
  background: linear-gradient(135deg, #55efff, #2389ff 62%, #5956ff);
  box-shadow: inset 0 0 0 1px #b9fcffcc, inset 0 2px 9px #c0ffff8c, 0 0 18px #29dfff9c;
}
html[data-vl-preset="ocean"] [data-vl-part="segment"],
html[data-vl-preset="ocean"] [data-vl-part="suggestion"] {
  color: #f1f6ff;
  background: linear-gradient(120deg, #2378b940, #6965f23b), #244c9b66 !important;
  box-shadow: inset 0 0 0 1px #8dbbff66, inset 0 1px 10px #9ad7ff26, 0 5px 20px #07296840;
  backdrop-filter: blur(16px);
}
html[data-vl-preset="ocean"] [data-vl-part="suggestion"] { border-radius: 16px; }
html[data-vl-preset="ocean"] [data-vl-part="segment"] :where([aria-selected="true"], [aria-pressed="true"]) {
  background: linear-gradient(130deg, #28cdffb3, #4974ffbf 60%, #7852ff99) !important;
  box-shadow: inset 0 0 0 1px #adebff99, inset 0 1px 10px #baf5ff80, 0 0 18px #25c7ff80;
}
html[data-vl-preset="ocean"] [data-vl-part="message"] { background: #2859a966; }
html[data-vl-preset="ocean"] [data-vl-part="dialog"],
html[data-vl-preset="ocean"] [data-vl-part="menu"] {
  background: #102b60f5 !important;
  color: #edf6ff;
  box-shadow: inset 0 0 0 1px #84c3ff66, 0 18px 60px #020d2c99;
}
html[data-vl-preset="ocean"] [data-vl-part="main"] .markdown {
  color: #eff5ff;
  --tw-prose-body: #eff5ff;
  --tw-prose-headings: #f6f9ff;
  --tw-prose-links: #81e9ff;
  --tw-prose-bold: #f6f9ff;
  --tw-prose-counters: #c1d5ff;
  --tw-prose-bullets: #a9c7f5;
  --tw-prose-quotes: #d1dfff;
  --tw-prose-code: #d6d4ff;
}
html[data-vl-preset="ocean"] [data-vl-part="main"] :where(.markdown table, [data-message-author-role] table) {
  background: #102a5d99;
  border-color: #91bcf580;
}
html[data-vl-preset="ocean"] [data-vl-part] :where(button, a, textarea, [contenteditable="true"]):focus-visible {
  outline-color: #8cf4ff;
}
html[data-vl-preset="ocean"][data-vl-contrast="true"] :where([data-vl-part="sidebar"], [data-vl-part="composer"]) {
  background: #102650 !important;
  backdrop-filter: none;
}
@supports not (backdrop-filter: blur(1px)) {
  html[data-vl-preset="ocean"] :where([data-vl-part="sidebar"], [data-vl-part="composer"]) {
    background: #153267 !important;
  }
}
@media (max-width: 760px) {
  html[data-vl-preset="ocean"] .vl-orb-top { width: 100vw; right: -35vw; top: 28vh; }
  html[data-vl-preset="ocean"] .vl-orb-left { width: 85vw; left: -48vw; bottom: 8vh; }
}
@media (forced-colors: active) {
  html[data-vl-preset="ocean"] [data-vl-part],
  html[data-vl-preset="ocean"] [data-vl-part="main"] .markdown {
    background: Canvas !important;
    color: CanvasText !important;
    box-shadow: none !important;
  }
}
`;var nt={shell:'#root, #__next, #app, #thread, [data-testid="app-shell"]',main:"main",header:'main > header, #page-header, [data-testid="page-header"], body > header',sidebar:'#stage-slideover-sidebar, #sidebar, [data-testid="sidebar"], aside[aria-label="Chat history"]',composer:'#composer-background, [data-testid="composer"], form[data-type="unified-composer"]:not(:has(#composer-background, [data-testid="composer"])), form:has(#prompt-textarea):not(:has(#composer-background, [data-testid="composer"]))',segment:'[data-testid="chat-work-toggle"], [role="tablist"][aria-label*="mode" i], [role="tablist"][aria-label*="chat" i]',"home-title":"main h1:not(article h1):not(.markdown h1):not([data-message-author-role] h1)",message:'[data-message-author-role="user"]',dialog:'[role="dialog"]',menu:'[role="menu"], [role="listbox"]',code:"pre:has(code)",suggestion:'[data-testid="suggestion-card"], [data-testid="starter-prompt"], [data-testid="conversation-starter"], [data-testid="prompt-suggestion"]'},O=class{style=null;backdrop=null;observer=null;abort=null;timer;pending=new Set;marked=new Map;properties=new Map;rootAttrs=new Map;settings=null;coverage={panels:0,editors:0,navigation:0};status="Liquid Glass starting";scanMs=0;attribute(t,e,r){this.marked.has(t)||this.marked.set(t,new Map);let a=this.marked.get(t);a.has(e)||a.set(e,t.getAttribute(e)),t.setAttribute(e,r)}variable(t,e,r){this.properties.has(t)||this.properties.set(t,new Map);let a=this.properties.get(t);a.has(e)||a.set(e,{value:t.style.getPropertyValue(e),priority:t.style.getPropertyPriority(e)}),t.style.setProperty(e,r)}rootAttribute(t,e){let r=document.documentElement;this.rootAttrs.has(t)||this.rootAttrs.set(t,r.getAttribute(t)),r.setAttribute(t,e)}forget(t){for(let[e,r]of this.marked.get(t)??[])r===null?t.removeAttribute(e):t.setAttribute(e,r);if(this.marked.delete(t),t instanceof HTMLElement){for(let[e,r]of this.properties.get(t)??[])r.value?t.style.setProperty(e,r.value,r.priority):t.style.removeProperty(e);this.properties.delete(t)}}mount(t,{reduceMotion:e=!1,highContrast:r=!1,simple:a=!1}={}){this.unmount(),this.settings=t;let o=document.documentElement,s=P[t.preset],i=new Map;for(let u of document.querySelectorAll("pre:has(code)")){let d=getComputedStyle(u);i.set(u,{bg:d.backgroundColor,fg:d.color})}let f={"--vl-base":s.base,"--vl-peach":s.peach,"--vl-lavender":s.lavender,"--vl-pink":s.pink,"--vl-sky":s.sky,"--vl-intensity":String(t.intensity),"--vl-blur":(a?4:t.blur)+"px","--vl-blend":38+t.blur+"%","--vl-brightness":String(t.brightness),"--vl-sidebar-opacity":String(t.sidebarOpacity),"--vl-composer-opacity":String(t.composerOpacity),"--vl-shadow":String(.045+t.intensity*.12)};for(let[u,d]of Object.entries(f))this.variable(o,u,d);for(let[u,d]of Object.entries({"data-vistara-liquid":"on","data-vl-preset":t.preset,"data-glassflow":"on","data-gf-adapter":"chatgpt","data-vl-contrast":String(r||a)}))this.rootAttribute(u,d);this.style=document.createElement("style"),this.style.id="vistara-styles",this.style.textContent=Z,o.append(this.style);let m=document.createElement("div");m.dataset.vlDecoration="",m.setAttribute("aria-hidden","true"),m.inert=!0;let p=document.createElement("div");p.className="vl-aurora",m.append(p);for(let u of["left","top","right"]){let d=document.createElement("span");d.className="vl-orb vl-orb-"+u,m.append(d)}document.body.append(m),this.backdrop=m;let y=()=>{let u=0,d=0;for(let[l]of this.marked){let c=l.getAttribute("data-vl-part");c==="sidebar"&&d++,(c==="composer"||c==="message")&&u++}this.coverage.panels=u,this.coverage.navigation=d,this.status=u||d?"Active \xB7 ChatGPT \u2014 Liquid Glass":"Liquid Glass background active \xB7 no sidebar/composer recognized on this route"},k=u=>{if(q(location.href)){this.unmount(),this.status="Safety pause: sensitive page";return}if(u.closest("[data-vl-decoration]"))return;let d=performance.now();for(let[l,c]of Object.entries(nt)){let h=[...u.matches(c)?[u]:[],...u.querySelectorAll(c)];for(let b of h.slice(0,120)){if(this.marked.size>=240)break;if(!(b.closest("[data-vl-decoration]")||b.hasAttribute("data-vl-part"))&&!(l==="sidebar"&&b.parentElement?.closest('[data-vl-part="sidebar"]'))&&!(l==="composer"&&b.parentElement?.closest('[data-vl-part="composer"]'))){if(l==="code"&&b instanceof HTMLElement){let g=i.get(b),w=g?.bg??getComputedStyle(b).backgroundColor,A=g?.fg??getComputedStyle(b).color,V=!w||w==="transparent"||/rgba\([^)]*,\s*0\)/.test(w);this.variable(b,"--vl-code-bg",V?"#162031":w),this.variable(b,"--vl-code-fg",V?"#eff4ff":A)}this.attribute(b,"data-vl-part",l),(l==="sidebar"||l==="header")&&this.attribute(b,"data-gf-surface","nav"),l==="composer"&&this.attribute(b,"data-gf-surface","input-shell")}}}y(),this.scanMs+=performance.now()-d};k(document.body),this.observer=new MutationObserver(u=>{for(let d of u){for(let l of d.removedNodes)if(l instanceof Element)for(let c of this.marked.keys())(c===l||l.contains(c))&&this.forget(c);for(let l of d.addedNodes)l instanceof Element&&!l.closest("[data-vl-decoration]")&&this.pending.size<32&&this.pending.add(l)}this.pending.size&&!this.timer&&(this.timer=setTimeout(()=>{this.timer=void 0;let d=[...this.pending];this.pending.clear();for(let l of d)l.isConnected&&k(l)},90))}),this.observer.observe(document.body,{childList:!0,subtree:!0}),this.abort=new AbortController;let v=matchMedia("(prefers-reduced-motion: reduce)"),x=()=>{let u=e||t.reduceMotion||v.matches||a;this.rootAttribute("data-vl-reduced",String(u)),this.rootAttribute("data-vl-motion",String(t.animation&&!u)),this.rootAttribute("data-vl-paused",String(document.visibilityState==="hidden"))};x(),v.addEventListener("change",x,{signal:this.abort.signal}),document.addEventListener("visibilitychange",x,{signal:this.abort.signal})}unmount(){this.observer?.disconnect(),this.observer=null,this.abort?.abort(),this.abort=null,clearTimeout(this.timer),this.timer=void 0,this.pending.clear();for(let t of this.marked.keys())this.forget(t);for(let[t,e]of this.properties)for(let[r,a]of e)a.value?t.style.setProperty(r,a.value,a.priority):t.style.removeProperty(r);this.properties.clear();for(let[t,e]of this.rootAttrs)e===null?document.documentElement.removeAttribute(t):document.documentElement.setAttribute(t,e);this.rootAttrs.clear(),this.style?.remove(),this.style=null,this.backdrop?.remove(),this.backdrop=null,this.settings=null,this.coverage.panels=0,this.coverage.navigation=0}};var tt='html[data-glassflow="on"][data-gf-adapter="chatgpt"]{--main-surface-primary:var(--gf-base);--main-surface-secondary:rgba(var(--gf-fill),.65);--main-surface-tertiary:rgba(var(--gf-fill),.8);--bg-primary:var(--gf-base);--bg-secondary:rgba(var(--gf-fill),.65);--text-primary:var(--gf-text);--text-secondary:var(--gf-muted);--border-light:rgba(180,200,240,.2)}html[data-glassflow="on"][data-gf-adapter="youtube"]{--yt-spec-base-background:var(--gf-base);--yt-spec-raised-background:rgba(var(--gf-fill),.8);--yt-spec-menu-background:var(--gf-base);--yt-spec-text-primary:var(--gf-text);--yt-spec-text-secondary:var(--gf-muted);--ytd-searchbox-background:rgba(var(--gf-fill),.6);--ytd-searchbox-text-color:var(--gf-text)}html[data-glassflow="on"]:not([data-gf-mode="compatibility"])[data-gf-adapter="chatgpt"] body,html[data-glassflow="on"]:not([data-gf-mode="compatibility"])[data-gf-adapter="youtube"] body{background:radial-gradient(ellipse at 0% 0%,rgba(var(--gf-fill),var(--gf-body-intensity)),transparent 65%),var(--gf-base)!important;color:var(--gf-text)}html[data-glassflow="on"][data-gf-adapter="chatgpt"] [data-gf-surface],html[data-glassflow="on"][data-gf-adapter="youtube"] [data-gf-surface]{color:var(--gf-text)}html[data-glassflow="on"] [data-gf-surface]{background:rgba(var(--gf-fill),var(--gf-opacity))!important;border-radius:var(--gf-radius)!important;box-shadow:inset 0 0 0 1px rgba(180,200,240,var(--gf-border-alpha)),0 6px 24px rgba(0,0,0,var(--gf-shadow-strength));backdrop-filter:blur(var(--gf-blur)) saturate(var(--gf-saturation));}html[data-glassflow="on"][data-gf-mode="compatibility"] [data-gf-surface]{backdrop-filter:none;box-shadow:inset 0 0 0 1px rgba(180,200,240,.25)}html[data-glassflow="on"] [data-gf-surface="input-shell"]{color:inherit}html[data-glassflow="on"] [data-gf-tone="light"]{background:rgba(235,242,255,max(.8,var(--gf-opacity)))!important}html[data-glassflow="on"] [data-gf-tone="dark"]{background:rgba(22,35,55,max(.8,var(--gf-opacity)))!important}html[data-glassflow="on"][data-gf-contrast="true"] [data-gf-surface]{background:var(--gf-base)!important;box-shadow:inset 0 0 0 2px var(--gf-accent)}html[data-glassflow="on"]::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(ellipse at 15% 0%,var(--gf-glow),transparent 65%),radial-gradient(ellipse at 95% 65%,var(--gf-accent),transparent 65%);opacity:var(--gf-bg-intensity)}html[data-glassflow="on"]{background-color:var(--gf-base)}html[data-glassflow="on"][data-gf-ambient="false"]::before{display:none}html[data-glassflow="on"][data-gf-mode="compatibility"]::before{display:none}html[data-glassflow="on"][data-gf-contrast="true"] [data-gf-tone="light"]{background:#f2f6ff!important}html[data-glassflow="on"][data-gf-contrast="true"] [data-gf-tone="dark"]{background:#111b2a!important}@media(forced-colors:active){html[data-glassflow="on"] body{background:Canvas!important;color:CanvasText!important}html[data-glassflow="on"] [data-gf-surface]{background:Canvas!important;box-shadow:none;backdrop-filter:none}html[data-glassflow="on"]::before{display:none}}';var et=`
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
`;var _=class{last="";host=null;timer;audio=null;arm(){this.audio||(this.audio=new AudioContext),this.audio.state==="suspended"&&this.audio.resume().catch(()=>{})}update(t,e,r){let a=t.trim().toLowerCase();if(!a||a===this.last)return;let o=!this.last;if(this.last=a,o||!e.effects||!/^(accepted|ac)(\s|$)/i.test(a))return;this.host?.remove();let s=document.createElement("div");s.dataset.vistaraUi="moment";let i=s.attachShadow({mode:"closed"}),f=document.createElement("style");f.textContent=`:host{position:fixed;right:24px;bottom:24px;z-index:2147483640;font:14px system-ui;color:#effff8}article{padding:22px 26px;border-radius:16px;border:1px solid #9df3c777;background:#102d2ef2;box-shadow:0 20px 80px #0005;${r?"":"animation:enter .3s ease-out"}}strong{font-size:19px}p{margin:7px 0 0;color:#b7dccc}button{float:right;background:none;border:0;color:inherit;cursor:pointer;font-size:20px;margin-left:20px}@keyframes enter{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){article{animation:none}}`;let m=document.createElement("article");m.setAttribute("role","status");let p=document.createElement("button");p.textContent="\xD7",p.setAttribute("aria-label","Dismiss accepted moment"),p.onclick=()=>this.host?.remove();let y=document.createElement("strong");y.textContent="A little progress. A big feeling.";let k=document.createElement("p");if(k.textContent="Accepted. Take a breath\u2014you earned it.",m.append(p,y,k),i.append(f,m),document.body.append(s),this.host=s,clearTimeout(this.timer),this.timer=setTimeout(()=>s.remove(),5500),e.sound&&this.audio?.state==="running"){let v=this.audio.createOscillator(),x=this.audio.createGain();v.connect(x),x.connect(this.audio.destination),x.gain.setValueAtTime(e.volume*.12,this.audio.currentTime),x.gain.exponentialRampToValueAtTime(.001,this.audio.currentTime+.7),v.frequency.setValueAtTime(523.25,this.audio.currentTime),v.frequency.setValueAtTime(659.25,this.audio.currentTime+.18),v.frequency.setValueAtTime(783.99,this.audio.currentTime+.36),v.start(),v.stop(this.audio.currentTime+.75)}}destroy(){clearTimeout(this.timer),this.host?.remove(),this.host=null,this.audio?.close().catch(()=>{}),this.audio=null}};var F=class{style=null;marked=new Map;observer=null;timer;roots=new Set;settings=null;oldVars=new Map;attrs=new Map;before=!1;abort=null;wallpaper=null;moments=null;liquid=null;currentStatus="Inactive";get status(){return this.liquid?.status??this.currentStatus}set status(t){this.currentStatus=t}scanMs=0;currentCoverage={panels:0,editors:0,navigation:0};get coverage(){return this.liquid?.coverage??this.currentCoverage}set coverage(t){this.currentCoverage=t}mark(t,e,r){return t.hasAttribute(e)&&!this.marked.get(t)?.has(e)?!1:(t.setAttribute(e,r),this.marked.has(t)||this.marked.set(t,new Set),this.marked.get(t).add(e),!0)}forget(t){for(let e of this.marked.get(t)??[])t.removeAttribute(e);this.marked.delete(t)}apply(t,e=this.wallpaper){this.unmount(),this.settings=t,this.wallpaper=e;let r=Y(t,location.href);if(this.status=r.reason,!r.enabled)return;if(this.before){this.status="Before view \xB7 original appearance";return}if(document.documentElement.hasAttribute("data-vistara-optout")||document.querySelector('meta[name="vistara"][content="off"]')){this.status="Page opted out";return}if(q(location.href)){this.status="Safety pause: sensitive page";return}if(N(location.href)){if(!t.chatgpt.enabled){this.status="ChatGPT \u2014 Liquid Glass off \xB7 original appearance";return}this.liquid=new O,this.liquid.mount(t.chatgpt,{reduceMotion:t.accessibility.reduceMotion,highContrast:t.accessibility.highContrast,simple:t.accessibility.simple||r.mode==="compatibility"});return}let a=K(location.hostname,location.pathname),o=t.studio,s=document.documentElement,i=a.coding?o.glass==="light"?S.arctic:o.glass==="dark"?S.midnight:S[r.theme]:S[r.theme];this.style=document.createElement("style"),this.style.id="vistara-styles",this.style.textContent=tt+(a.coding?et:""),s.append(this.style);let f={"--gf-fill":i.fill,"--gf-base":i.base,"--gf-text":i.text,"--gf-muted":i.muted,"--gf-accent":o.accent??i.accent,"--gf-glow":i.glow,"--gf-blur":`${r.blur}px`,"--gf-opacity":String(r.opacity),"--gf-radius":`${r.radius}px`,"--gf-border-alpha":String(r.border),"--gf-shadow-strength":String(r.shadow),"--gf-saturation":String(r.saturation),"--gf-bg-intensity":String(r.intensity),"--gf-body-intensity":String(r.ambient?r.intensity:0),"--gf-dim":String(1-o.brightness*o.sceneStrength),"--gf-dim-fill":i.fill,"--gf-editor-size":`${o.editorSize}px`,"--gf-wallpaper-fit":o.fit,"--gf-wallpaper-position":o.position},m=(d,l)=>{this.oldVars.has(d)||this.oldVars.set(d,{value:s.style.getPropertyValue(d),priority:s.style.getPropertyPriority(d)}),s.style.setProperty(d,l)};for(let[d,l]of Object.entries(f))m(d,l);for(let[d,l]of Object.entries({"data-glassflow":"on","data-gf-mode":r.mode,"data-gf-contrast":String(r.contrast),"data-gf-ambient":String(r.ambient&&!t.accessibility.disableImagery),"data-gf-adapter":a.id,"data-gf-coding":String(!!a.coding),"data-gf-focus":String(o.focus)}))this.attrs.set(d,s.getAttribute(d)),s.setAttribute(d,l);this.moments=a.coding?new _:null;let p="",y=()=>{let d=null;if(a.difficulty){let c=document.querySelector(a.difficulty)?.textContent?.slice(0,80).toLowerCase()??"";d=["easy","medium","hard"].find(h=>new RegExp("\\b"+h+"\\b").test(c))??null}let l=U(o,d);if(p!==l){let c=e&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(e)&&e.length<21e5?e:null;m("--gf-wallpaper",`url("${c??H(l)}")`),p=l}if(a.verdict){let c=document.querySelector(a.verdict)?.textContent?.slice(0,120)??"";this.moments?.update(c,o,t.accessibility.reduceMotion||matchMedia("(prefers-reduced-motion: reduce)").matches)}},k=()=>{this.coverage={panels:0,editors:0,navigation:0};for(let[d,l]of this.marked)if(l.has("data-gf-editor")&&this.coverage.editors++,l.has("data-gf-surface")){let c=d.getAttribute("data-gf-surface");c==="nav"?this.coverage.navigation++:(c==="panel"||c==="card")&&this.coverage.panels++}this.status=a.coding?this.coverage.panels||this.coverage.editors?`Active \xB7 ${a.id} \xB7 ${this.coverage.panels} panels \xB7 ${this.coverage.editors} editors`:`Compatibility fallback \xB7 ${a.id}: no workspace panels detected on this route`:`Active \xB7 ${a.id}`},v=d=>{let l=performance.now();if(q(location.href)){this.unmount(),this.status="Safety pause: sensitive page";return}if(!d.closest("[data-vistara-ui]")){for(let[c,h]of Object.entries(a.rules)){if(r.mode==="compatibility"&&!["nav","input-shell","editor"].includes(c)||r.mode==="balanced"&&c==="dialog")continue;let b;try{b=[...d.matches(h)?[d]:[],...d.querySelectorAll(h)]}catch{continue}for(let g of b.slice(0,160)){if(this.marked.size>=160)break;if(!g.closest("[data-vistara-ui]")){if(c==="workspace"){this.mark(g,"data-gf-workspace","true");continue}if(c==="editor"){if(!g.hasAttribute("data-gf-editor")){let w=g.querySelector(".mtk1,.cm-content,.ace_text-layer")??g,A=getComputedStyle(w).color.match(/[\d.]+/g)?.slice(0,3).map(Number)??[255,255,255];this.mark(g,"data-gf-editor",g instanceof HTMLTextAreaElement?"plain":"true")&&this.mark(g,"data-gf-editor-tone",A[0]*.2126+A[1]*.7152+A[2]*.0722<145?"light":"dark")}continue}if(!(g.hasAttribute("data-gf-surface")||g.hasAttribute("data-gf-tone")||g.closest('video,canvas,pre,code,[contenteditable="true"],[role="alert"],.html5-video-player,.monaco-editor,.ace_editor,.cm-editor,.CodeMirror,.diff-view,.captcha')||g.parentElement?.closest("[data-gf-surface]")||g.querySelector("[data-gf-surface]"))){if(!a.coding&&!["youtube","chatgpt"].includes(a.id)){let w=getComputedStyle(g).color.match(/[\d.]+/g)?.slice(0,3).map(Number)??[0,0,0];this.mark(g,"data-gf-tone",w[0]*.2126+w[1]*.7152+w[2]*.0722<145?"light":"dark")}this.mark(g,"data-gf-surface",c)}}}}if(a.focus)for(let c of[...d.matches(a.focus)?[d]:[],...d.querySelectorAll(a.focus)].slice(0,20))this.mark(c,"data-gf-distraction","true");y(),k(),this.scanMs+=performance.now()-l}};v(document.body),a.dynamic&&(this.observer=new MutationObserver(d=>{for(let l of d)if(!(l.target instanceof Element&&l.target.closest("[data-vistara-ui]"))){for(let c of l.removedNodes)if(c instanceof Element)for(let h of this.marked.keys())(c===h||c.contains(h))&&this.forget(h);for(let c of l.addedNodes){let h=c instanceof Element?c:l.target instanceof Element?l.target:null;h&&!h.closest("[data-vistara-ui]")&&this.roots.size<32&&this.roots.add(h)}}!this.timer&&this.roots.size&&(this.timer=setTimeout(()=>{this.timer=void 0;let l=[...this.roots];this.roots.clear();for(let c of l)c.isConnected&&v(c)},100))}),this.observer.observe(document.body,{childList:!0,subtree:!0})),this.abort=new AbortController;let x=location.href,u=()=>{x!==location.href&&this.settings&&(x=location.href,this.apply(this.settings))};window.addEventListener("popstate",u,{signal:this.abort.signal}),window.addEventListener("hashchange",u,{signal:this.abort.signal}),o.sound&&o.effects&&document.addEventListener("pointerdown",d=>{d.isTrusted&&d.target instanceof Element&&d.target.closest('button,input[type="submit"]')&&this.moments?.arm()},{signal:this.abort.signal})}toggleBefore(){return this.before=!this.before,this.settings&&this.apply(this.settings),this.before}unmount(){this.liquid?.unmount(),this.liquid=null,this.observer?.disconnect(),this.observer=null,this.abort?.abort(),this.moments?.destroy(),this.moments=null,clearTimeout(this.timer),this.timer=void 0,this.roots.clear();for(let t of this.marked.keys())this.forget(t);this.coverage={panels:0,editors:0,navigation:0},this.style?.remove(),this.style=null;for(let[t,e]of this.oldVars)e.value?document.documentElement.style.setProperty(t,e.value,e.priority):document.documentElement.style.removeProperty(t);this.oldVars.clear();for(let[t,e]of this.attrs)e===null?document.documentElement.removeAttribute(t):document.documentElement.setAttribute(t,e);this.attrs.clear()}};function st(){let n=new F,t,e=0,r=()=>t=(async()=>{let s=++e,i=await X(),f=null;if(i.studio.wallpaper&&typeof chrome.runtime.sendMessage=="function")try{f=(await chrome.runtime.sendMessage({type:"VISTARA_WALLPAPER",id:i.studio.wallpaper}))?.data??null}catch{}s===e&&n.apply(i,f)})().catch(s=>{n.unmount(),n.status="Settings or styling error: "+String(s)}),a,o=()=>{clearTimeout(a),a=setTimeout(r,60)};r(),chrome.storage.onChanged.addListener(o),chrome.runtime.onMessage.addListener((s,i,f)=>{if(s.type==="VISTARA_STATUS")return t.then(()=>f({status:n.status,scanMs:n.scanMs,coverage:n.coverage})),!0;if(s.type==="VISTARA_BEFORE")return t.then(()=>f({before:n.toggleBefore()})),!0}),"navigation"in window&&window.navigation.addEventListener("navigatesuccess",o)}var at=globalThis;at.__vistaraContentStarted||(st(),at.__vistaraContentStarted=!0);})();
