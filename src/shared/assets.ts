export interface Wallpaper {
  id: string;
  name: string;
  blob: Blob;
  created: number;
  width: number;
  height: number;
}
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("vistara-wallpapers", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("images", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(Error("Wallpaper storage could not be opened."));
  });
}
async function request<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await open();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("images", mode);
      const req = run(tx.objectStore("images"));
      let result: T;
      req.onsuccess = () => (result = req.result);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(Error("Wallpaper storage failed."));
      tx.onabort = () => reject(Error("Wallpaper storage was interrupted."));
    });
  } finally {
    db.close();
  }
}
export const listWallpapers = () =>
  request<Wallpaper[]>("readonly", (s) => s.getAll());
export const getWallpaper = (id: string) =>
  request<Wallpaper | undefined>("readonly", (s) => s.get(id));
export const deleteWallpaper = (id: string) =>
  request("readwrite", (s) => s.delete(id));
export async function putWallpaper(record: Wallpaper) {
  if ((await listWallpapers()).length >= 20)
    throw Error("Keep up to 20 wallpapers. Delete one before adding more.");
  if (record.blob.size > 1500000 || record.blob.type !== "image/jpeg")
    throw Error("Wallpaper must be an optimized JPEG under 1.5 MB.");
  await request("readwrite", (s) => s.put(record));
}
export async function imageData(id: string): Promise<string | null> {
  const record = await getWallpaper(id);
  if (!record) return null;
  const bytes = new Uint8Array(await record.blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 32768)
    binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return "data:image/jpeg;base64," + btoa(binary);
}
export async function importWallpaper(file: File): Promise<Wallpaper> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 12 * 1024 * 1024
  )
    throw Error(
      "Choose a PNG, JPEG or WebP image under 12 MB. SVG and animated images are not supported.",
    );
  const image = await createImageBitmap(file);
  try {
    if (image.width * image.height > 40000000)
      throw Error("Image dimensions are too large.");
    const scale = Math.min(1, 1920 / image.width, 1200 / image.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas
      .getContext("2d")!
      .drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(Error("Image conversion failed."))),
        "image/jpeg",
        0.82,
      ),
    );
    const record = {
      id: crypto.randomUUID(),
      name: file.name.slice(0, 100),
      blob,
      created: Date.now(),
      width: canvas.width,
      height: canvas.height,
    };
    await putWallpaper(record);
    return record;
  } finally {
    image.close();
  }
}
