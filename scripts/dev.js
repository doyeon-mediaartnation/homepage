#!/usr/bin/env node
/**
 * Local dev server: serves the static site and runs api/contact.js like Vercel does.
 *
 *   node --env-file=.env scripts/dev.js        (Node 20.6+; reads .env for the API keys)
 *
 * Only for local testing — Vercel ignores this file.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT) || 8765;
// 0.0.0.0 so phones on the same Wi-Fi can open the preview (user-approved); HOST=127.0.0.1 keeps it local.
const HOST = process.env.HOST || "0.0.0.0";
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".gif": "image/gif", ".woff2": "font/woff2", ".woff": "font/woff", ".pdf": "application/pdf",
};

const api = { "/api/contact": () => require("../api/contact.js") };

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = api[url.pathname];
    if (route) {
      try {
        await route()(req, res);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "internal" }));
      }
      console.log(req.method, url.pathname, "→", res.statusCode);
      return;
    }
    let file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (!file.startsWith(ROOT)) { res.statusCode = 403; return res.end("forbidden"); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    else if (!fs.existsSync(file) && fs.existsSync(file + "/index.html")) file = file + "/index.html";
    if (!fs.existsSync(file)) {
      // mirror Vercel: serve the custom 404 page for unknown paths
      res.statusCode = 404;
      const nf = path.join(ROOT, "404.html");
      if (fs.existsSync(nf)) { res.setHeader("Content-Type", MIME[".html"]); return fs.createReadStream(nf).pipe(res); }
      return res.end("not found");
    }
    res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, HOST, () => {
    const configured = process.env.ACS_CONNECTION_STRING && process.env.ACS_SENDER;
    console.log(`dev server http://localhost:${PORT}/ko/  (contact API: ${configured ? "Azure configured" : "NOT configured — set .env"})`);
    if (HOST === "0.0.0.0") {
      const nets = Object.values(require("os").networkInterfaces()).flat().filter((n) => n && n.family === "IPv4" && !n.internal);
      nets.forEach((n) => console.log(`  on this network: http://${n.address}:${PORT}/ko/`));
    }
  });
