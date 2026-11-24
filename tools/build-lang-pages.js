// Собирает site/en/index.html и site/ua/index.html из site/index.html + site/js/i18n.js.
// Зачем: у каждого языка свой адрес, свой <title>, описание и уже готовый текст в HTML —
// так Google (и превью ссылок в мессенджерах) видят английскую и украинскую версии.
// ЗАПУСКАТЬ после каждой правки index.html или i18n.js, до git commit:
//   node tools/build-lang-pages.js
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = path.join(__dirname, "..", "site");
const ORIGIN = "https://kvity.ro";
const src = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(SITE, "js", "i18n.js"), "utf8"), ctx);
const I18N = ctx.window.KVITY_I18N;

const PAGES = { en: { html: "en", dir: "en", locale: "en_US" }, ua: { html: "uk", dir: "ua", locale: "uk_UA" } };

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");
const get = (dict, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), dict);
const isRel = (u) => u !== "" && !/^(\/|#|[a-z][a-z0-9+.-]*:)/i.test(u);

function build(lang) {
  const P = PAGES[lang], d = I18N[lang], url = ORIGIN + "/" + P.dir + "/";
  let h = src;
  const must = (re, to) => { if (!re.test(h)) throw new Error("не найдено: " + re); h = h.replace(re, to); };

  must(/<html lang="ro">/, `<html lang="${P.html}">`);
  must(/<title>[^<]*<\/title>/, `<title>${esc(d.meta.title)}</title>`);
  must(/(<meta name="description" content=")[^"]*"/, `$1${attr(d.meta.description)}"`);
  must(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`);
  must(/(<meta property="og:title" content=")[^"]*"/, `$1${attr(d.meta.title)}"`);
  must(/(<meta property="og:description" content=")[^"]*"/, `$1${attr(d.meta.description)}"`);
  must(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);
  must(/(<meta property="og:type"[^>]*>)/, `$1\n  <meta property="og:locale" content="${P.locale}">`);

  // относительные пути (img/…, css/…, js/…) → от корня сайта, иначе из /en/ они не найдутся
  h = h.replace(/\b(src|href)="([^"]*)"/g, (m, a, u) => (isRel(u) ? `${a}="/${u}"` : m));
  h = h.replace(/\bsrcset="([^"]*)"/g, (m, list) =>
    `srcset="${list.split(",").map((p) => { p = p.trim(); return isRel(p) ? "/" + p : p; }).join(", ")}"`);
  // фото галереи main.js берёт из KV_BASE + "img/…"
  must(/(\s*)(<script src="\/js\/config\.js)/, `$1<script>window.KV_BASE = "/";</script>$1$2`);

  // готовый текст на нужном языке (main.js потом всё равно перерисует)
  h = h.replace(/(<(\w+)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g, (m, open, tag, key, txt, close) => {
    const v = get(d, key); return v == null ? m : open + esc(v) + close;
  });
  h = h.replace(/(<(\w+)\b[^>]*\sdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, tag, key, txt, close) => {
    const v = get(d, key); return v == null ? m : open + v + close;
  });
  for (const [a, target] of [["ph", "placeholder"], ["aria", "aria-label"], ["alt", "alt"]]) {
    h = h.replace(new RegExp(`<[^>]*\\sdata-i18n-${a}="([^"]+)"[^>]*>`, "g"), (tagStr, key) => {
      const v = get(d, key); if (v == null) return tagStr;
      const re = new RegExp(`\\s${target}="[^"]*"`);
      return re.test(tagStr) ? tagStr.replace(re, ` ${target}="${attr(v)}"`) : tagStr.replace(/\s*(\/?)>$/, ` ${target}="${attr(v)}"$1>`);
    });
  }

  h = h.replace(/<!doctype html>\s*/i, "<!doctype html>\n<!-- СОБРАНО tools/build-lang-pages.js из ../index.html — не править вручную -->\n");
  const out = path.join(SITE, P.dir, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, h);
  const left = (h.match(/Florărie|Comandă|Buchete/g) || []).length;
  console.log(`${P.dir}/index.html: ${Math.round(h.length / 1024)} КБ, румынских слов-маркеров осталось: ${left}`);
}

build("en");
build("ua");
