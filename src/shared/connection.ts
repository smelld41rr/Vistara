/** Recover an eligible existing tab using the popup's user-granted activeTab access. */
export async function connectTab(
  tabId: number,
): Promise<{ status: string; scanMs?: number }> {
  const ping = () => chrome.tabs.sendMessage(tabId, { type: "VISTARA_STATUS" });
  try {
    const response = await ping();
    if (typeof response?.status === "string") return response;
  } catch {
    /* Content scripts do not automatically attach to tabs open before installation. */
  }
  const manifest = chrome.runtime.getManifest();
  const files = manifest.content_scripts?.[0]?.js;
  if (!files?.length)
    throw Error(
      "The installed package is incomplete. Install the latest Vistara ZIP.",
    );
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files });
  } catch (error) {
    throw Error(
      "Chrome could not attach Vistara to this page. Open the extension’s Details → Site access and allow this site, then reload the tab. Chrome reported: " +
        String(error),
    );
  }
  const response = await ping();
  if (typeof response?.status !== "string")
    throw Error("The page script did not respond. Reload this tab and retry.");
  return response;
}
