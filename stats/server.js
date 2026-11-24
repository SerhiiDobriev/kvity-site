/*
 * KVITY — статистика сайта для Алины: kvity.ro/stats/ (вход тем же паролем, что у конструктора фото).
 * Node 24 без пакетов. Без cookies у посетителей и без хранения IP:
 *   уникальность посетителя за день = хэш(IP + браузер + соль дня); соль живёт только сутки.
 * Данные: DATA_DIR/hits-YYYY-MM.jsonl — по строке на просмотр или нажатие.
 *
 * Сайт шлёт POST /stats/api/hit (js/stats.js). Панель: GET /stats/ → /stats/api/summary?days=N.
 * Запуск локально: node stats/server.js --dev  → http://localhost:5700/stats/
 */
"use strict";
const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

try { // stats/.env или foto/.env на компьютере; на сервере переменные даёт docker compose
  for (const f of [path.join(__dirname, ".env"), path.join(__dirname, "..", "foto", ".env")]) {
    if (!fs.existsSync(f)) continue;
    for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  }
} catch { /* нет файла */ }

const DEV = process.argv.includes("--dev");
const PORT = Number(process.env.PORT || (DEV ? 5700 : 4200));
const HOST = process.env.HOST || "127.0.0.1";
const PASSWORD = process.env.STATS_PASSWORD || process.env.FOTO_PASSWORD || "";
const DATA = path.resolve(process.env.DATA_DIR || path.join(__dirname, "data"));
const PUB = path.join(__dirname, "public");
const TZ = "Europe/Bucharest";

if (PASSWORD.length < 6) { console.error("Нет пароля (STATS_PASSWORD или FOTO_PASSWORD)"); process.exit(1); }
fs.mkdirSync(DATA, { recursive: true });

const SECRET_FILE = path.join(DATA, "secret.txt");
let SECRET;
try { SECRET = fs.readFileSync(SECRET_FILE, "utf8").trim(); } catch { /* нет */ }
if (!SECRET) { SECRET = crypto.randomBytes(32).toString("hex"); fs.writeFileSync(SECRET_FILE, SECRET, { mode: 0o600 }); }
const TOKEN = crypto.createHmac("sha256", SECRET).update("kvity-stats:" + PASSWORD).digest("hex");

// ---------- даты по времени Румынии ----------
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hour12: false });
const dayOf = (ms) => dayFmt.format(new Date(ms));            // 2026-11-24
const hourOf = (ms) => Number(hourFmt.format(new Date(ms))) % 24;

// Соль дня: только в памяти и в файле на сегодня, вчерашнюю удаляем — восстановить, кто это был, нельзя
let salt = { day: "", value: "" };
const SALT_FILE = path.join(DATA, "salt.json");
try { salt = JSON.parse(fs.readFileSync(SALT_FILE, "utf8")); } catch { /* нет */ }
function saltFor(day) {
  if (salt.day !== day) {
    salt = { day, value: crypto.randomBytes(16).toString("hex") };
    try { fs.writeFileSync(SALT_FILE, JSON.stringify(salt), { mode: 0o600 }); } catch { /* не страшно */ }
  }
  return salt.value;
}

// ---------- разбор посетителя ----------
function device(ua, w, touch) {
  if (/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
  if (/Mobi|iPhone|Android/i.test(ua)) return "mobile";
  if (/Macintosh/i.test(ua) && touch) return "tablet"; // iPad притворяется Mac'ом
  return "desktop";
}
function os(ua) {
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Mac OS X|Macintosh/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux";
  return "other";
}
function source(ref, utm, ua) {
  const u = String(utm || "").toLowerCase();
  if (u) {
    if (/insta|ig/.test(u)) return "Instagram";
    if (/face|fb/.test(u)) return "Facebook";
    if (/tik/.test(u)) return "TikTok";
    if (/google|gbp|maps/.test(u)) return "Google";
    if (/tele|tg/.test(u)) return "Telegram";
    if (/whats|wa/.test(u)) return "WhatsApp";
    if (/qr/.test(u)) return "QR";
    return u.slice(0, 30);
  }
  // Встроенные браузеры приложений часто не передают, откуда пришли — узнаём по самому браузеру
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "Facebook";
  if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return "TikTok";
  if (/Telegram/i.test(ua)) return "Telegram";
  if (/WhatsApp/i.test(ua)) return "WhatsApp";
  const h = String(ref || "").toLowerCase();
  if (!h) return "direct";
  if (/instagram/.test(h)) return "Instagram";
  if (/facebook|fb\.com|fb\.me/.test(h)) return "Facebook";
  if (/tiktok/.test(h)) return "TikTok";
  if (/google\./.test(h)) return "Google";
  if (/bing|yahoo|duckduckgo|yandex/.test(h)) return "other-search";
  if (/t\.me|telegram/.test(h)) return "Telegram";
  if (/whatsapp|wa\.me/.test(h)) return "WhatsApp";
  if (/kvity\.ro$/.test(h)) return "direct";
  return h.replace(/^www\./, "").slice(0, 40);
}
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp\/|telegrambot|headless|lighthouse|python|curl|wget/i;

const SAFE = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u001f]/g, "").slice(0, n || 60);

// ---------- запись ----------
let writing = Promise.resolve();
function append(rec) {
  const file = path.join(DATA, "hits-" + rec.d.slice(0, 7) + ".jsonl");
  const line = JSON.stringify(rec) + "\n";
  writing = writing.then(() => fsp.appendFile(file, line)).catch((e) => console.error("write failed", e));
}
// не больше 120 запросов в минуту с одного адреса
const rate = new Map();
function limited(ip) {
  const now = Date.now(), r = rate.get(ip) || { t: now, n: 0 };
  if (now - r.t > 60000) { r.t = now; r.n = 0; }
  r.n++; rate.set(ip, r);
  if (rate.size > 5000) rate.clear();
  return r.n > 120;
}

function hit(req, body) {
  const ua = String(req.headers["user-agent"] || "");
  if (!ua || BOT.test(ua)) return;
  let m; try { m = JSON.parse(body); } catch { return; }
  if (!m || typeof m !== "object") return;
  const now = Date.now(), d = dayOf(now);
  const ip = String(req.headers["x-real-ip"] || req.socket.remoteAddress || "");
  if (limited(ip)) return;
  const v = crypto.createHash("sha256").update(saltFor(d) + "|" + ip + "|" + ua).digest("hex").slice(0, 16);
  const rec = { d, h: hourOf(now), v, t: m.t === "e" ? "e" : "pv" };
  if (rec.t === "pv") {
    rec.p = SAFE(m.p, 40) || "/";
    rec.s = source(SAFE(m.r, 80), SAFE(m.u, 40), ua);
    rec.dv = device(ua, Number(m.w) || 0, !!m.tc);
    rec.os = os(ua);
    rec.l = ["ro", "en", "ua"].includes(m.l) ? m.l : "";
    rec.tz = SAFE(m.tz, 40);
  } else {
    rec.e = SAFE(m.e, 40);
    if (!rec.e) return;
    if (m.x && typeof m.x === "object") {
      rec.x = {};
      for (const k of Object.keys(m.x).slice(0, 6)) rec.x[SAFE(k, 20)] = SAFE(m.x[k], 60);
    }
    rec.l = ["ro", "en", "ua"].includes(m.l) ? m.l : "";
  }
  append(rec);
}

// ---------- сводка ----------
async function readDays(days) {
  const now = Date.now(), want = new Set(), months = new Set();
  for (let i = 0; i < days; i++) { const d = dayOf(now - i * 86400000); want.add(d); months.add(d.slice(0, 7)); }
  const recs = [];
  for (const mo of months) {
    let txt = "";
    try { txt = await fsp.readFile(path.join(DATA, "hits-" + mo + ".jsonl"), "utf8"); } catch { continue; }
    for (const line of txt.split("\n")) {
      if (!line) continue;
      try { const r = JSON.parse(line); if (want.has(r.d)) recs.push(r); } catch { /* битая строка */ }
    }
  }
  return { recs, want: [...want].sort() };
}
function count(map, key, by) {
  if (!key) return;
  let s = map.get(key); if (!s) { s = by ? new Set() : 0; }
  if (by) s.add(by); else s++;
  map.set(key, s);
}
function top(map, n) {
  return [...map.entries()].map(([k, v]) => [k, typeof v === "number" ? v : v.size])
    .sort((a, b) => b[1] - a[1]).slice(0, n || 12);
}
async function summary(days) {
  const { recs, want } = await readDays(days);
  const perDay = new Map(want.map((d) => [d, { v: new Set(), pv: 0, orders: 0 }]));
  const hours = new Array(24).fill(0);
  const visitors = new Set();
  const src = new Map(), dev = new Map(), oss = new Map(), lang = new Map(), tz = new Map(), page = new Map();
  const ev = new Map(), cats = new Map(), orderWhat = new Map(), orderOcc = new Map(), orderBudget = new Map();
  let pv = 0, orders = 0, calls = 0;
  const firstSrc = new Map(); // источник посетителя за день — по первому просмотру
  for (const r of recs) {
    const day = perDay.get(r.d);
    if (r.t === "pv") {
      pv++; visitors.add(r.d + r.v); if (day) { day.v.add(r.v); day.pv++; }
      hours[r.h] = (hours[r.h] || 0) + 1;
      const key = r.d + r.v;
      if (!firstSrc.has(key)) {
        firstSrc.set(key, 1);
        count(src, r.s); count(dev, r.dv); count(oss, r.os); count(lang, r.l); count(tz, r.tz);
      }
      count(page, r.p);
    } else {
      const e = r.e;
      if (e === "order_tg" || e === "order_wa") {
        orders++; if (day) day.orders++;
        if (r.x) { count(orderWhat, r.x.what); count(orderOcc, r.x.occasion); count(orderBudget, r.x.budget); }
      }
      if (e === "call") calls++;
      if (e.startsWith("cat:")) count(cats, e.slice(4), r.d + r.v);
      else count(ev, e, r.d + r.v);
    }
  }
  return {
    days, from: want[0], to: want[want.length - 1],
    visitors: visitors.size, pageviews: pv, orders, calls,
    perDay: [...perDay.entries()].map(([d, x]) => ({ d, v: x.v.size, pv: x.pv, orders: x.orders })),
    hours,
    sources: top(src), devices: top(dev), os: top(oss), langs: top(lang), tz: top(tz, 15), pages: top(page),
    events: top(ev, 20), cats: top(cats), orderWhat: top(orderWhat), orderOccasion: top(orderOcc), orderBudget: top(orderBudget)
  };
}

// ---------- http ----------
function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function authed(req) {
  const m = /(?:^|;\s*)ks=([^;]+)/.exec(req.headers.cookie || "");
  return m && safeEqual(decodeURIComponent(m[1]), TOKEN);
}
const fails = new Map();
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
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml" };

async function handle(req, res) {
  const url = new URL(req.url, "http://x");
  const p = url.pathname;
  const ip = String(req.headers["x-real-ip"] || req.socket.remoteAddress || "");

  if (p === "/stats/api/hit" && req.method === "POST") {
    try { hit(req, await readBody(req, 2048)); } catch { /* слишком большое */ }
    return send(res, 204, "");
  }
  if (p === "/stats/api/login" && req.method === "POST") {
    if (tooManyFails(ip)) return send(res, 429, { error: "wait" });
    let pw = ""; try { pw = JSON.parse(await readBody(req, 1024)).password || ""; } catch { /* пусто */ }
    if (!safeEqual(pw, PASSWORD)) { fails.get(ip).push(Date.now()); return send(res, 403, { error: "password" }); }
    return send(res, 200, { ok: true }, null, { "Set-Cookie": "ks=" + TOKEN +
      "; Path=/stats/; Max-Age=31536000; HttpOnly; SameSite=Lax" + (DEV ? "" : "; Secure") });
  }
  if (p === "/stats/api/summary") {
    if (!DEV && !authed(req)) return send(res, 403, { error: "login" }); // локально без пароля
    const days = Math.max(1, Math.min(365, Number(url.searchParams.get("days")) || 7));
    return send(res, 200, await summary(days));
  }
  if (p === "/stats" ) return send(res, 301, "", "text/plain", { Location: "/stats/" });
  if (p === "/stats/" || p === "/stats/index.html") {
    return send(res, 200, await fsp.readFile(path.join(PUB, "index.html")), MIME[".html"]);
  }
  if (DEV && !p.startsWith("/stats/")) { // локально отдаём и сам сайт, чтобы проверить счётчик
    const f = path.join(__dirname, "..", "site", p.endsWith("/") ? p + "index.html" : p);
    try { return send(res, 200, await fsp.readFile(f), MIME[path.extname(f)] || "application/octet-stream"); } catch { /* дальше 404 */ }
  }
  send(res, 404, "Not found", "text/plain; charset=utf-8");
}

http.createServer((req, res) => {
  handle(req, res).catch((e) => { console.error(e); try { send(res, 500, { error: "server" }); } catch { /* уже ответили */ } });
}).listen(PORT, HOST, () => console.log("KVITY stats on http://" + HOST + ":" + PORT + "/stats/"));
