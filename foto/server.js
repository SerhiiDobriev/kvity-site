/*
 * KVITY — конструктор фото для Алины (kvity.tutormate.site/foto/, вход по паролю).
 * Пароль — FOTO_PASSWORD в окружении или в foto/.env (в git не идёт). После входа — cookie на год.
 * Node 24 без пакетов. Хранит её фото и раскладку в DATA_DIR:
 *   photos/<id>.jpg (большое, до 2000 px), photos/<id>-s.jpg (превью, 640 px)
 *   state.json — список фото, раскладка по местам сайта, отметка «Готово»
 *   done/<время>.json — копия раскладки при каждом «Готово»
 * На живой сайт ничего не пишет.
 *
 * Запуск локально: node foto/server.js --dev  → http://localhost:5600/foto/
 * (в --dev отдаёт и сам сайт из ../site, чтобы работал предпросмотр)
 */
"use strict";
const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

// foto/.env (KEY=значение) — для запуска на компьютере; на сервере те же переменные даёт docker compose
try {
  for (const line of fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
} catch { /* нет файла */ }

const DEV = process.argv.includes("--dev");
const PORT = Number(process.env.PORT || (DEV ? 5600 : 4100));
const HOST = process.env.HOST || "127.0.0.1";
const PASSWORD = process.env.FOTO_PASSWORD || "";
const DATA = path.resolve(process.env.DATA_DIR || path.join(__dirname, "data"));
const PUB = path.join(__dirname, "public");
const SITE = path.resolve(__dirname, "..", "site");
const MAX_PHOTO = 15 * 1024 * 1024;
const MAX_PHOTOS = 400;

if (PASSWORD.length < 6) { console.error("FOTO_PASSWORD не задан или короче 6 знаков"); process.exit(1); }
fs.mkdirSync(path.join(DATA, "photos"), { recursive: true });
fs.mkdirSync(path.join(DATA, "done"), { recursive: true });

// Секрет для cookie живёт в папке данных. Смена пароля = все старые входы перестают действовать.
const SECRET_FILE = path.join(DATA, "secret.txt");
let SECRET;
try { SECRET = fs.readFileSync(SECRET_FILE, "utf8").trim(); } catch { /* нет */ }
if (!SECRET) { SECRET = crypto.randomBytes(32).toString("hex"); fs.writeFileSync(SECRET_FILE, SECRET, { mode: 0o600 }); }
const TOKEN = crypto.createHmac("sha256", SECRET).update("kvity-foto:" + PASSWORD).digest("hex");

const STATE_FILE = path.join(DATA, "state.json");
const emptyState = () => ({ version: 0, photos: [], layout: { single: {}, gallery: [] }, done: null, savedAt: null });
let state;
try { state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch { state = emptyState(); }

let writing = Promise.resolve();
function persist() {
  const data = JSON.stringify(state, null, 1);
  writing = writing.then(async () => {
    const tmp = STATE_FILE + ".tmp";
    await fsp.writeFile(tmp, data);
    await fsp.rename(tmp, STATE_FILE);
  }).catch((e) => console.error("save failed", e));
  return writing;
}

const ID_RE = /^[a-z0-9]{6,16}$/;
const SLOT_RE = /^[a-z0-9_-]{1,32}$/;
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8" };

function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function cookieKey(req) {
  const m = /(?:^|;\s*)fk=([^;]+)/.exec(req.headers.cookie || "");
  return m ? decodeURIComponent(m[1]) : "";
}
function authed(req) { return safeEqual(cookieKey(req), TOKEN); }
// Не больше 8 неверных паролей за 10 минут с одного адреса
const fails = new Map();
function clientIp(req) { return String(req.headers["x-real-ip"] || req.socket.remoteAddress || ""); }
function tooManyFails(ip) {
  const now = Date.now(), list = (fails.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  fails.set(ip, list);
  return list.length >= 8;
}
function send(res, code, body, type, extra) {
  res.writeHead(code, Object.assign({ "Content-Type": type || "application/json; charset=utf-8", "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow" }, extra || {}));
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on("data", (c) => { size += c.length; if (size > limit) { reject(new Error("too big")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
function isJpeg(b) { return b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff; }

function publicState() {
  return { version: state.version, photos: state.photos, layout: state.layout, done: state.done, savedAt: state.savedAt };
}
// Раскладка: single = { слот: id }, gallery = [{ p: id, cat, cap: подпись }] в порядке сайта.
// Чистим от мусора и несуществующих фото.
const CATS = new Set(["bouquets", "mono", "xl", "baskets", "wedding", "balloons", "christmas"]);
function cleanLayout(l) {
  const have = new Set(state.photos.map((p) => p.id));
  const out = { single: {}, gallery: [] };
  if (l && l.single && typeof l.single === "object") for (const [k, v] of Object.entries(l.single)) if (SLOT_RE.test(k) && have.has(v)) out.single[k] = v;
  if (l && Array.isArray(l.gallery)) for (const g of l.gallery.slice(0, 300)) {
    if (!g || typeof g !== "object") continue;
    out.gallery.push({ p: have.has(g.p) ? g.p : "", cat: CATS.has(g.cat) ? g.cat : "bouquets", cap: String(g.cap || "").slice(0, 300) });
  }
  return out;
}

async function serveFile(res, file, cacheable) {
  try {
    const data = await fsp.readFile(file);
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": cacheable ? "private, max-age=31536000, immutable" : "no-cache", "X-Robots-Tag": "noindex, nofollow" });
    res.end(data);
  } catch { send(res, 404, "Not found", "text/plain; charset=utf-8"); }
}

async function handle(req, res) {
  const url = new URL(req.url, "http://x");
  const p = decodeURIComponent(url.pathname);

  if (p === "/foto") return send(res, 301, "", "text/plain", { Location: "/foto/" + url.search });
  if (p === "/foto/" || p === "/foto/index.html") return serveFile(res, path.join(PUB, "index.html"));
  if (/^\/foto\/(app\.js|app\.css)$/.test(p)) return serveFile(res, path.join(PUB, p.slice(6)));

  // Фото. Имя как у сайта (<id>.webp / <id>-s.webp), чтобы предпросмотр шёл через настоящий main.js; внутри — JPEG.
  // c<N>- — номер карточки галереи в предпросмотре (чтобы у каждой была своя подпись)
  let m = /^\/foto\/img\/(?:c\d{1,3}-)?([a-z0-9]{6,16})(-s)?\.(webp|jpg)$/.exec(p);
  if (m) {
    if (!authed(req)) return send(res, 403, "Forbidden", "text/plain");
    return serveFile(res, path.join(DATA, "photos", m[1] + (m[2] || "") + ".jpg"), true);
  }

  if (p === "/foto/api/login" && req.method === "POST") {
    const ip = clientIp(req);
    if (tooManyFails(ip)) return send(res, 429, { error: "wait" });
    let pw = "";
    try { pw = String(JSON.parse((await readBody(req, 4096)).toString("utf8")).password || ""); } catch { /* пусто */ }
    if (!safeEqual(pw.trim(), PASSWORD)) { fails.get(ip).push(Date.now()); return send(res, 403, { error: "password" }); }
    fails.delete(ip);
    return send(res, 200, { ok: true }, null, { "Set-Cookie": "fk=" + TOKEN +
      "; Path=/foto; HttpOnly; SameSite=Lax; Max-Age=31536000" + (DEV ? "" : "; Secure") });
  }

  if (p.startsWith("/foto/api/")) {
    if (!authed(req)) return send(res, 403, { error: "login" });
    const route = p.slice(10);

    if (route === "state" && req.method === "GET") return send(res, 200, publicState());
    if (route === "state" && req.method === "PUT") {
      const body = JSON.parse((await readBody(req, 512 * 1024)).toString("utf8") || "{}");
      state.layout = cleanLayout(body.layout);
      state.version += 1; state.savedAt = new Date().toISOString();
      await persist();
      return send(res, 200, { version: state.version, savedAt: state.savedAt });
    }
    m = /^photos\/([a-z0-9]{6,16})$/.exec(route);
    if (m && req.method === "POST") {
      const id = m[1], small = url.searchParams.get("size") === "s";
      if (!small && state.photos.length >= MAX_PHOTOS) return send(res, 400, { error: "limit" });
      const buf = await readBody(req, MAX_PHOTO);
      if (!isJpeg(buf)) return send(res, 400, { error: "format" });
      await fsp.writeFile(path.join(DATA, "photos", id + (small ? "-s" : "") + ".jpg"), buf);
      if (!small && !state.photos.some((x) => x.id === id)) {
        const name = String(url.searchParams.get("name") || "").slice(0, 120);
        const w = Math.min(10000, parseInt(url.searchParams.get("w"), 10) || 0), h = Math.min(10000, parseInt(url.searchParams.get("h"), 10) || 0);
        state.photos.push({ id, name, w, h, added: new Date().toISOString() });
        state.version += 1;
        await persist();
      }
      return send(res, 200, { ok: true, version: state.version });
    }
    if (m && req.method === "DELETE") {
      const id = m[1];
      state.photos = state.photos.filter((x) => x.id !== id);
      state.layout = cleanLayout(state.layout);
      state.version += 1;
      await persist();
      for (const f of [id + ".jpg", id + "-s.jpg"]) fsp.unlink(path.join(DATA, "photos", f)).catch(() => {});
      return send(res, 200, publicState());
    }
    if (route === "done" && req.method === "POST") {
      const body = JSON.parse((await readBody(req, 512 * 1024)).toString("utf8") || "{}");
      state.layout = cleanLayout(body.layout || state.layout);
      state.version += 1;
      const at = new Date().toISOString();
      state.done = { at, version: state.version };
      await persist();
      await fsp.writeFile(path.join(DATA, "done", at.replace(/[:.]/g, "-") + ".json"), JSON.stringify(state, null, 1));
      console.log("DONE pressed at", at, "photos:", state.photos.length);
      return send(res, 200, publicState());
    }
    return send(res, 404, { error: "not found" });
  }

  // Только локально: сам сайт для предпросмотра (на сервере его отдаёт nginx)
  if (DEV) {
    const rel = p === "/" ? "index.html" : p.slice(1);
    const file = path.resolve(SITE, rel);
    if (file.startsWith(SITE)) return serveFile(res, file);
  }
  send(res, 404, "Not found", "text/plain");
}

http.createServer((req, res) => {
  handle(req, res).catch((e) => { console.error(e); if (!res.headersSent) send(res, e.message === "too big" ? 413 : 500, { error: "server" }); });
}).listen(PORT, HOST, () => console.log("KVITY foto on http://" + HOST + ":" + PORT + "/foto/"));
