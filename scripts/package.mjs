import { zipSync, unzipSync } from "fflate";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, relative, join } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const root = resolve(import.meta.dirname, "..");
execFileSync(process.execPath, ["esbuild.config.mjs"], {
  cwd: root,
  stdio: "inherit",
});
const version = JSON.parse(
  await readFile(join(root, "package.json"), "utf8"),
).version;
const release = join(root, "release");
await mkdir(release, { recursive: true });
async function collect(dir, exclude = new Set()) {
  const files = {};
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (
      exclude.has(item.name) ||
      item.name.startsWith(".env") ||
      item.name.endsWith(".log") ||
      item.name === ".npmrc"
    )
      continue;
    const path = join(dir, item.name);
    if (item.isSymbolicLink()) continue;
    if (item.isDirectory()) {
      for (const [name, data] of Object.entries(await collect(path, exclude)))
        files[item.name + "/" + name] = data;
    } else if (item.isFile())
      files[item.name] = new Uint8Array(await readFile(path));
  }
  return files;
}
const extension = await collect(join(root, "dist"));
extension["INSTALL.txt"] = new Uint8Array(
  await readFile(join(root, "INSTALL.txt")),
);
const sources = await collect(
  root,
  new Set([".git", "node_modules", "release", ".browser-profile"]),
);
const allowedFolders = new Set([
  "src",
  "dist",
  "tests",
  "scripts",
  "public",
  "screenshots",
  "docs",
]);
const allowedFiles = new Set([
  ".gitignore",
  ".nvmrc",
  "README.md",
  "PRIVACY.md",
  "LICENSE",
  "INSTALL.txt",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "esbuild.config.mjs",
  "manifest.json",
  "manifest.template.json",
]);
const wrapped = Object.fromEntries(
  Object.entries(sources)
    .filter(([name]) =>
      name.includes("/")
        ? allowedFolders.has(name.split("/")[0])
        : allowedFiles.has(name),
    )
    .map(([name, data]) => ["Vistara/" + name, data]),
);
for (const [name, files] of [
  ["Vistara-Theme-World", extension],
  ["Vistara-Source", wrapped],
]) {
  const bytes = zipSync(files, { level: 6 });
  const verified = unzipSync(bytes);
  for (const [path, data] of Object.entries(files)) {
    if (Buffer.compare(Buffer.from(data), Buffer.from(verified[path])) !== 0)
      throw Error("Archive mismatch: " + path);
  }
  const manifest = JSON.parse(
    new TextDecoder().decode(
      verified[
        name === "Vistara-Source" ? "Vistara/manifest.json" : "manifest.json"
      ],
    ),
  );
  if (manifest.version !== version) throw Error("Packaged version mismatch");
  for (const filename of [`${name}-v${version}.zip`, `${name}.zip`])
    await writeFile(join(release, filename), bytes);
  console.log(
    `${name}-v${version}.zip: ${bytes.length.toLocaleString()} bytes; ${Object.keys(files).length} entries verified`,
  );
}
const hashes = [];
for (const name of (await readdir(release))
  .filter((n) => n.endsWith(".zip"))
  .sort()) {
  hashes.push(
    createHash("sha256")
      .update(await readFile(join(release, name)))
      .digest("hex") +
      "  " +
      name,
  );
}
await writeFile(join(release, "SHA256SUMS"), hashes.join("\n") + "\n");
console.log("Local packages created. No Git push or publication performed.");
