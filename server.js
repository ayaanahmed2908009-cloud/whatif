const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// Whitelisted, not a generic directory walk — keeps internal files (.claude,
// config, etc.) from ever being served even if someone guesses the path.
const PAGES = {
  "/": "index.html",
  "/index.html": "index.html",
  "/our-story": "our-story.html",
  "/our-story.html": "our-story.html",
  "/privacy-policy": "privacy-policy.html",
  "/privacy-policy.html": "privacy-policy.html",
};

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function serveFile(res, filePath, transform) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(transform ? transform(data.toString("utf-8")) : data);
  });
}

function injectConfig(html) {
  const cascadeBaseUrl = process.env.CASCADE_BASE_URL || "";
  const configScript = `<script>window.CASCADE_BASE_URL = ${JSON.stringify(cascadeBaseUrl)};</script>`;
  return html.replace("</head>", `${configScript}</head>`);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pagePath = PAGES[url.pathname];

    if (pagePath) {
      serveFile(res, path.join(ROOT, pagePath), injectConfig);
      return;
    }

    if (url.pathname.startsWith("/assets/")) {
      const assetPath = path.join(ROOT, url.pathname);
      // Guard against path traversal (e.g. /assets/../.claude/launch.json).
      if (!assetPath.startsWith(path.join(ROOT, "assets"))) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("403 Forbidden");
        return;
      }
      serveFile(res, assetPath);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  })
  .listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
  });
