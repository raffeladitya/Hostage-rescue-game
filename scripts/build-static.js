import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(".");
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

[
  "index.html",
  "src",
  "vendor",
  "README.md",
  "package.json"
].forEach((item) => {
  const source = join(root, item);
  if (!existsSync(source)) {
    throw new Error(`Missing build input: ${item}`);
  }
  cpSync(source, join(dist, item), { recursive: true });
});

console.log("Static build ready in dist.");
