// Черновик v7 (правка 31): основной сайт + видео. Собирает site/v7/index.html из site/index.html.
// Запуск: node tools/build-v7.js   (свои файлы черновика — site/v7/video.js и video.css)
"use strict";
const fs = require("fs"), path = require("path");
const SITE = path.join(__dirname, "..", "site");
let h = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
const must = (re, to) => { if (!re.test(h)) throw new Error("не найдено: " + re); h = h.replace(re, to); };
const isRel = (u) => u !== "" && !/^(\/|#|[a-z][a-z0-9+.-]*:)/i.test(u);

must(/<link rel="canonical"[^>]*>\s*/, "");
// первый экран: сразу видео, без фото основного сайта (чтобы фото не мелькало до видео)
const HERO_VIDEO = "video/kvity-hero-3.mp4"; // IMG_4463, сжато ffmpeg до 1080px
must(/\s*<link rel="preload" as="image"[^>]*>/, "");
must(/(<div class="hero__media">)\s*<img [^>]*>/, `$1
        <video class="hero__video" src="${HERO_VIDEO}" muted autoplay loop playsinline preload="auto"></video>`);
h = h.replace(/<link rel="alternate" hreflang[^>]*>\s*/g, "");
must(/(<meta name="viewport"[^>]*>)/, '$1\n  <meta name="robots" content="noindex, nofollow">');
must(/<title>/, "<title>v7 · ");
h = h.replace(/\b(src|href)="([^"]*)"/g, (m, a, u) => (isRel(u) ? `${a}="../${u}"` : m));
h = h.replace(/\bsrcset="([^"]*)"/g, (m, list) => `srcset="${list.split(",").map((p) => { p = p.trim(); return isRel(p) ? "../" + p : p; }).join(", ")}"`);
h = h.replace(`src="../${HERO_VIDEO}"`, `src="${HERO_VIDEO}"`); // своё видео лежит в v7/video/
must(/(<link rel="stylesheet" href="\.\.\/css\/style\.css[^"]*">)/, '$1\n  <link rel="stylesheet" href="video.css?v=4">\n  <script>window.KV_BASE = "../";</script>');
must(/\s*<script src="\.\.\/js\/stats\.js[^"]*" defer><\/script>/, "");
must(/(<script src="\.\.\/js\/main\.js[^"]*" defer><\/script>)/, '$1\n  <script src="video.js?v=7" defer></script>');
must(/(\s*<!-- Шары -->)/, `

    <!-- Видео (черновик v7) -->
    <section class="reels section" id="reels">
      <div class="head">
        <p class="label reveal" id="reelsKicker"></p>
        <h2 class="display reveal" id="reelsTitle"></h2>
        <p class="studios__lead reveal" id="reelsLead"></p>
      </div>
      <div class="reels__track" id="reelsTrack"></div>
    </section>
$1`);
h = h.replace(/<!doctype html>\s*/i, "<!doctype html>\n<!-- ЧЕРНОВИК v7, собран tools/build-v7.js из ../index.html — не править вручную -->\n");
fs.writeFileSync(path.join(SITE, "v7", "index.html"), h);
console.log("v7/index.html", Math.round(h.length / 1024), "КБ");
