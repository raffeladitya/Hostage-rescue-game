import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { networkInterfaces } from "node:os";

const root = resolve(".");
const args = new Map();

for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i];
  const value = process.argv[i + 1];
  if (key.startsWith("--")) {
    args.set(key, value && !value.startsWith("--") ? value : true);
  }
}

if (args.has("--check")) {
  const required = ["index.html", "src/main.js", "src/styles.css", "vendor/phaser.min.js"];
  const missing = required.filter((file) => !existsSync(join(root, file)));
  if (missing.length) {
    console.error(`Missing files: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log("Project files look ready.");
  process.exit(0);
}

const host = String(args.get("--host") || "127.0.0.1");
const port = Number(args.get("--port") || 5173);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function localIps() {
  const ips = [];
  for (const list of Object.values(networkInterfaces())) {
    for (const item of list || []) {
      if (item.family === "IPv4" && !item.internal) ips.push(item.address);
    }
  }
  return ips;
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(root, safePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mime[extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Local:   http://127.0.0.1:${port}`);
  if (host === "0.0.0.0") {
    for (const ip of localIps()) {
      console.log(`Network: http://${ip}:${port}`);
    }
  }
  console.log("Press Ctrl+C to stop.");
});
