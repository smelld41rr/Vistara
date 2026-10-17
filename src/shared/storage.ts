import { cloneDefaults, migrate, validate, type Settings } from "./settings";
let queue: Promise<unknown> = Promise.resolve();
export async function load(): Promise<Settings> {
  const local = await chrome.storage.local.get(["settings", "sharedFallback"]);
  let sync: Record<string, unknown> | undefined;
  try {
    sync = (await chrome.storage.sync.get("shared")).shared as
      Record<string, unknown> | undefined;
  } catch {
    /* Keep local preferences available without a Chrome Sync account. */
  }
  const fallback = local.sharedFallback as Record<string, unknown> | undefined;
  const newest =
    Number(sync?.revision ?? 0) > Number(fallback?.revision ?? 0)
      ? sync
      : (fallback ?? sync);
  const { revision: _revision, ...shared } = newest ?? {};
  try {
    return migrate(
      local.settings || newest
        ? { ...cloneDefaults(), ...(local.settings ?? {}), ...shared }
        : null,
    );
  } catch (error) {
    await chrome.storage.local.set({
      migrationBackup: local.settings ?? shared,
    });
    throw Error(
      "Stored settings could not be migrated. A local backup was preserved. " +
        String(error),
    );
  }
}
export function save(settings: Settings): Promise<void> {
  const snapshot = validate(settings);
  const task = async () => {
    const shared = {
      schemaVersion: 1,
      enabled: snapshot.enabled,
      appearance: snapshot.appearance,
      accessibility: snapshot.accessibility,
      revision: Date.now(),
    };
    await chrome.storage.local.set({
      settings: snapshot,
      sharedFallback: shared,
    });
    try {
      await chrome.storage.sync.set({ shared });
    } catch {
      throw Error(
        "Saved locally. Chrome Sync is unavailable or its quota was reached.",
      );
    }
  };
  const next = queue.then(task, task);
  queue = next.catch(() => {});
  return next;
}
export const init = load;
export { cloneDefaults };
