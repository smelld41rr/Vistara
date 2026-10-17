# Privacy

Vistara - Theme World v1.0.2 is a local appearance extension with no backend, analytics, tracking, remote fonts, remote images or remotely hosted executable code. Runtime code initiates no network requests.

The content script checks URL eligibility, presence of sensitive form types, semantic roles and known selectors to find containers to style. It never reads input values, private messages or document text for collection. It does not transmit, summarize, log, sell or store page content, credentials, cookies, browsing history or account data. The active tab hostname is displayed locally to help manage site-specific preferences. It is not sent anywhere.

Small preferences use chrome.storage.sync when available, which may synchronize through the user's own Chrome account. Site rules, custom presets, local fallbacks and migration backups use chrome.storage.local. JSON exports are user-initiated files; imported data is validated with a 256 KB size cap. Imported code and CSS are not accepted. Resetting preferences restores defaults; uninstall removes extension-managed storage according to Chrome's behavior. Downloaded backup files remain under the user's control.

Permissions: storage saves configuration; activeTab supports active-host display and temporary tab-local commands. Static content-script matches on HTTP/HTTPS sites enable local appearance changes and explain Chrome's site-access warning. The scripting permission is used only to attach the bundled content script to the active tab when missing, using the user-invoked activeTab grant. No cookies, history, tabs, clipboard or webRequest permissions are used.

Future remote features would need a separate explicit design and disclosure. None are included in this build.
