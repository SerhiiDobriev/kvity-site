/*
 * KVITY v5 «Bloom» — эффекты поверх общей логики (../js/main.js).
 * Орбита фото, 3D-карусель, выбор настроения с расходящимся кругом,
 * слова-выезды, счётчики, наклон плиток, лента отзывов, взрыв лепестков.
 * Движение при прокрутке задано в CSS (animation-timeline) — его ведёт браузер.
 */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var cfg = window.KVITY_CONFIG;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var base = window.KV_BASE || "";
  var byId = {};
  cfg.gallery.forEach(function (g, i) { byId[g.id] = { g: g, i: i }; });
  var small = function (id) { var g = byId[id].g; return base + "img/" + id + "-" + g.slug + "-s.webp"; };

  /* ---------------- Открыть фото в просмотре (через галерею main.js) ---------------- */
  function openPhoto(id) {
    var all = $('.filter[data-filter="all"]');
    if (all && !all.classList.contains("is-active")) all.click();
    var w = $('#gallery .work[data-index="' + byId[id].i + '"]');
    if (w) w.click();
  }

  /* ---------------- Орбита на первом экране ---------------- */
  (function orbit() {
    var ring = $("#orbit");
    if (!ring) return;
    var ids = ["g01", "g03", "g05", "g06", "g09", "g10", "g11", "g04"].filter(function (id) { return byId[id]; });
    ring.innerHTML = ids.map(function (id, i) {
      return '<div class="orbit__item" style="--a:' + (i * 360 / ids.length) + 'deg">' +
        '<button type="button" class="orbit__card" tabindex="-1" data-id="' + id + '" style="--a:' + (i * 360 / ids.length) + 'deg">' +
        '<img src="' + small(id) + '" alt="" width="640" height="853" decoding="async"></button></div>';
    }).join("");
    ring.addEventListener("click", function (e) {
      var b = e.target.closest(".orbit__card");
      if (b) openPhoto(b.dataset.id);
    });
  })();

  /* ---------------- 3D-карусель работ ---------------- */
  var ringEl = $("#ring"), ringW = 0;
  function buildRing() {
    if (!ringEl) return;
    var w = window.innerWidth;
    var n = w < 720 ? 10 : 14;
    var rw = w < 720 ? 112 : (w < 1024 ? 160 : 190);
    if (ringW && (ringW < 720) === (w < 720) && (ringW < 1024) === (w < 1024)) return;
    ringW = w;
    var rr = (rw / 2) / Math.tan(Math.PI / n) + (w < 720 ? 12 : 26);
    ringEl.style.setProperty("--rw", rw + "px");
    ringEl.style.setProperty("--rr", rr.toFixed(1) + "px");
    var step = cfg.gallery.length / n;
    var html = "";
    for (var i = 0; i < n; i++) {
      var g = cfg.gallery[Math.floor(i * step)];
      html += '<button type="button" class="ring__item" tabindex="-1" data-id="' + g.id + '" style="--a:' + (i * 360 / n) + 'deg">' +
        '<img src="' + small(g.id) + '" alt="" width="640" height="853" loading="lazy" decoding="async"></button>';
    }
    ringEl.innerHTML = html;
  }
  buildRing();
  if (ringEl) ringEl.addEventListener("click", function (e) {
    var b = e.target.closest(".ring__item");
    if (b) openPhoto(b.dataset.id);
  });
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(buildRing, 200); });

  /* ---------------- Настроение (цветовая тема) ---------------- */
  var MOOD = {
    ro: { label: "Alege starea", blush: "Pudră", peach: "Piersică", lilac: "Liliac", sage: "Salvie" },
    en: { label: "Pick a mood", blush: "Blush", peach: "Peach", lilac: "Lilac", sage: "Sage" },
    uk: { label: "Оберіть настрій", blush: "Пудра", peach: "Персик", lilac: "Бузок", sage: "Шавлія" }
  };
  function moodTexts() {
    var t = MOOD[root.lang] || MOOD.ro;
    var l = $("#moodLabel");
    if (l) l.textContent = t.label;
    $$(".mood__pill").forEach(function (b) { $("span", b).textContent = t[b.dataset.mood]; });
  }
  function markMood() {
    var m = root.dataset.mood || "blush";
    $$(".mood__pill").forEach(function (b) {
      var on = b.dataset.mood === m;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
  }
  function setMood(m, x, y) {
    if ((root.dataset.mood || "blush") === m) return;
    var apply = function () {
      root.dataset.mood = m;
      try { localStorage.setItem("kvity-mood", m); } catch (e) { /* приватный режим */ }
      markMood();
    };
    if (reduce || !document.startViewTransition) { apply(); return; }
    var r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    var tr = document.startViewTransition(apply);
    tr.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + r + "px at " + x + "px " + y + "px)"] },
        { duration: 800, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () {});
  }
  $$(".mood__pill").forEach(function (b) {
    b.addEventListener("click", function () {
      var r = b.getBoundingClientRect();
      setMood(b.dataset.mood, r.left + r.width / 2, r.top + r.height / 2);
    });
  });
  markMood();
  moodTexts();
  new MutationObserver(moodTexts).observe(root, { attributes: true, attributeFilter: ["lang"] });

  /* ---------------- Слова заголовков ---------------- */
  function wrapWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n, i = 0;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var outer = document.createElement("span"), inner = document.createElement("span");
        outer.className = "w";
        inner.textContent = part;
        inner.style.setProperty("--wi", i++);
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }
  function processText() {
    $$(".split").forEach(function (el) {
      if (!el.querySelector(".w") && el.textContent.trim()) wrapWords(el);
    });
  }

  /* ---------------- Отзывы: две ленты ---------------- */
  function cloneReviews() {
    var t1 = $("#reviewsTrack"), t2 = $("#reviewsTrack2");
    if (!t1 || !t2 || t1.querySelector("[data-clone]")) return;
    var kids = Array.prototype.slice.call(t1.children);
    if (!kids.length) return;
    var copy = function (k) { var c = k.cloneNode(true); c.setAttribute("data-clone", ""); c.setAttribute("aria-hidden", "true"); c.classList.add("in"); return c; };
    kids.forEach(function (k) { t1.appendChild(copy(k)); });
    t2.innerHTML = "";
    var rev = kids.slice().reverse();
    rev.concat(rev).forEach(function (k) { t2.appendChild(copy(k)); });
  }

  var pending = false;
  new MutationObserver(function () {
    if (pending) return;
    pending = true;
    setTimeout(function () { pending = false; processText(); cloneReviews(); }, 0);
  }).observe(document.body, { childList: true, subtree: true });
  processText();
  cloneReviews();

  /* ---------------- Счётчики (5.0, 2) ---------------- */
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, to = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length, t0 = null;
        (function tick(t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / 1300), v = to * (1 - Math.pow(1 - p, 3));
          el.textContent = v.toFixed(dec);
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
    }, { threshold: .6 });
    $$(".count").forEach(function (el) { el.textContent = (0).toFixed((el.dataset.count.split(".")[1] || "").length); cio.observe(el); });
  }

  /* ---------------- Наклон плиток и «магнитные» кнопки (только мышь) ---------------- */
  if (finePointer && !reduce) {
    $$("[data-tilt]").forEach(function (el) {
      var raf = 0, ev = null;
      el.addEventListener("pointermove", function (e) {
        ev = e;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = el.getBoundingClientRect();
          var px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
          el.style.setProperty("--ry", ((px - .5) * 9).toFixed(2) + "deg");
          el.style.setProperty("--rx", ((.5 - py) * 7).toFixed(2) + "deg");
          el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
          el.style.setProperty("--go", "1");
        });
      });
      el.addEventListener("pointerleave", function () {
        ["--rx", "--ry"].forEach(function (p) { el.style.setProperty(p, "0deg"); });
        el.style.setProperty("--go", "0");
      });
    });
    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * .32).toFixed(1) + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------------- Взрыв лепестков после отправки заявки ---------------- */
  var burstCv = $("#burst");
  function burst(x, y) {
    if (!burstCv || reduce) return;
    var ctx = burstCv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = window.innerWidth, h = window.innerHeight;
    burstCv.width = w * dpr; burstCv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cs = getComputedStyle(root);
    var colors = ["--accent", "--au1", "--au2", "--au3"].map(function (v) { return cs.getPropertyValue(v).trim(); }).concat("#ffffff");
    var parts = [];
    for (var i = 0; i < 70; i++) {
      var a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.3, sp = 5 + Math.random() * 9;
      parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 5 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length], flip: Math.random() * 6 });
    }
    var t0 = performance.now();
    (function frame(t) {
      var life = (t - t0) / 1700;
      ctx.clearRect(0, 0, w, h);
      if (life >= 1) return;
      ctx.globalAlpha = 1 - life * life;
      parts.forEach(function (p) {
        p.vy += .28; p.vx *= .985; p.vy *= .985;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.flip += .15;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, .45 + .55 * Math.abs(Math.sin(p.flip)));
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.bezierCurveTo(p.r * .9, -p.r * .6, p.r * .7, p.r * .7, 0, p.r);
        ctx.bezierCurveTo(-p.r * .7, p.r * .7, -p.r * .9, -p.r * .6, 0, -p.r);
        ctx.fillStyle = p.c;
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(frame);
    })(t0);
  }
  var form = $("#orderForm"), lastBtn = null;
  if (form) {
    form.addEventListener("click", function (e) { var b = e.target.closest("[data-channel]"); if (b) lastBtn = b; });
    form.addEventListener("submit", function () {
      // main.js уже проверил поля: если ошибок нет — заявка ушла, празднуем
      setTimeout(function () {
        if ($(".has-error", form)) return;
        var r = (lastBtn || $("[data-channel]", form)).getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2);
      }, 0);
    });
  }

  /* ---------------- Фото подгружаем заранее, когда страница открылась ---------------- */
  window.addEventListener("load", function () {
    var c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) return;
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1500); };
    idle(function () { $$('img[loading="lazy"]').forEach(function (img) { img.loading = "eager"; }); }, { timeout: 4000 });
  });
})();
