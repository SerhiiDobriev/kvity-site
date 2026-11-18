/*
 * KVITY v4 — эффекты поверх общей логики (../js/main.js).
 * Заставка, «влёт» в букву I, слова-проявления, лента категорий,
 * параллакс, лента отзывов, лепестки, курсор, «магнитные» кнопки.
 * При «уменьшить движение» (системная настройка) почти всё выключается.
 */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (t) { return t * t * (3 - 2 * t); };
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) root.classList.add("is-reduced");

  var W = window.innerWidth, H = window.innerHeight;

  /* ---------------- Заставка ---------------- */
  var loader = $("#loader");
  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    var l = loader; loader = null;
    setTimeout(function () { l.remove(); }, 1300);
  }
  if (reduce) hideLoader();
  else {
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(function () {
      // цветок рисуется ~1.6 с от начала загрузки страницы
      setTimeout(hideLoader, Math.max(0, 1750 - performance.now()));
    });
  }

  /* ---------------- Слова: выезжают / проявляются ---------------- */
  function wrapWords(el, cls) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n, i = 0;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var parts = node.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var outer = document.createElement("span");
        outer.className = cls;
        if (cls === "w") {
          var inner = document.createElement("span");
          inner.textContent = part;
          inner.style.setProperty("--wi", i);
          outer.appendChild(inner);
        } else {
          outer.textContent = part;
        }
        i++;
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  function processText() {
    $$(".split").forEach(function (el) {
      if (!el.querySelector(".w") && el.textContent.trim()) wrapWords(el, "w");
    });
    $$(".scrub").forEach(function (el) {
      if (!el.querySelector(".sw") && el.textContent.trim()) { wrapWords(el, "sw"); el._k = -1; }
    });
  }

  /* ---------------- Первый экран: маска KVITY ---------------- */
  var hero = $(".hero"), mask = $("#heroMask"), word = $("#maskWord"), mark = $("#maskMark"), cap = $("#heroCap");
  var heroImg = $(".hero__photo img");
  var maxScale = 40;

  function layoutIntro() {
    if (!hero || reduce) return;
    var pin = $(".hero__pin");
    var w = pin.clientWidth, h = pin.clientHeight;
    var fs = Math.min(w * 0.27, h * 0.36);
    var capH = fs * 0.70;                 // высота заглавной Montserrat
    var u = capH * 1.08 / 100;            // единица знака #kv-mark (100 = высота заглавной), как в логотипе
    var blockH = capH + 61 * u;           // цветок над I + буквы
    var capTop = (h - blockH) / 2 + 61 * u;
    var baseline = capTop + capH;
    word.setAttribute("font-size", fs.toFixed(1));
    word.setAttribute("letter-spacing", (fs * 0.05).toFixed(1));
    word.setAttribute("x", (w / 2 + fs * 0.025).toFixed(1)); // компенсируем разрядку после последней буквы
    word.setAttribute("y", baseline.toFixed(1));
    var ext;
    try { ext = word.getExtentOfChar(2); } catch (e) { ext = null; }
    var icx = ext ? ext.x + (ext.width - fs * 0.05) / 2 : w / 2; // центр буквы I (ширина включает разрядку)
    mark.setAttribute("x", (icx - 99 * u).toFixed(1));
    mark.setAttribute("y", (capTop - 64 * u).toFixed(1));
    mark.setAttribute("width", (132 * u).toFixed(1));
    mark.setAttribute("height", (149 * u).toFixed(1));
    mask.style.transformOrigin = icx.toFixed(1) + "px " + (capTop + capH * 0.55).toFixed(1) + "px";
    hero.style.setProperty("--capY", (baseline + Math.max(22, fs * 0.16)) + "px");
    maxScale = Math.max(36, (w / (fs * 0.13)) * 1.4);
  }

  function updateIntro() {
    if (!hero || reduce) return;
    var r = hero.getBoundingClientRect();
    var total = hero.offsetHeight - H;
    var p = clamp(-r.top / total, 0, 1);
    var z = clamp(p / 0.6, 0, 1);
    var s = Math.pow(maxScale, smooth(z));
    mask.style.transform = "scale(" + s.toFixed(3) + ")";
    mask.style.visibility = z >= 0.995 ? "hidden" : "visible";
    heroImg.style.transform = "scale(" + (1.2 - 0.2 * smooth(z)).toFixed(4) + ")";
    hero.style.setProperty("--p", p.toFixed(4));
    hero.classList.toggle("is-revealed", p > 0.7);
  }

  /* ---------------- Категории: едут вбок ---------------- */
  var catsSec = $("#catsSec"), catsTrack = $("#cats"), catsBar = $("#catsBar"), catsDist = 0;
  function layoutCats() {
    if (!catsSec || reduce) return;
    catsDist = Math.max(0, catsTrack.offsetWidth - W);
    catsSec.style.height = (H + catsDist) + "px";
  }
  function updateCats() {
    if (!catsSec || reduce) return;
    var r = catsSec.getBoundingClientRect();
    var total = catsSec.offsetHeight - H;
    var p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    catsTrack.style.transform = "translate3d(" + (-p * catsDist).toFixed(1) + "px,0,0)";
    if (catsBar) catsBar.style.setProperty("--cp", p.toFixed(4));
  }

  /* ---------------- Проявление текста словами ---------------- */
  function updateScrub() {
    $$(".scrub").forEach(function (el) {
      var words = el.querySelectorAll(".sw");
      if (!words.length) return;
      if (reduce) { if (el._k !== words.length) { el._k = words.length; for (var j = 0; j < words.length; j++) words[j].classList.add("on"); } return; }
      var r = el.getBoundingClientRect();
      var p = clamp((H * 0.82 - r.top) / (r.height + H * 0.3), 0, 1);
      var k = Math.round(p * words.length * 1.05);
      if (k === el._k) return;
      el._k = k;
      for (var i = 0; i < words.length; i++) words[i].classList.toggle("on", i < k);
    });
  }

  /* ---------------- Параллакс ---------------- */
  var para = $$("[data-speed]");
  function updatePara() {
    if (reduce) return;
    para.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > H + 200) return;
      var d = (r.top + r.height / 2 - H / 2) * parseFloat(el.dataset.speed);
      el.style.transform = "translate3d(0," + (-d).toFixed(1) + "px,0)";
    });
  }

  /* ---------------- Лента отзывов: копия для бесконечной прокрутки ---------------- */
  function cloneReviews() {
    var tr = $("#reviewsTrack");
    if (!tr || reduce || tr.querySelector("[data-clone]")) return;
    var kids = Array.prototype.slice.call(tr.children);
    if (!kids.length) return;
    kids.forEach(function (k) {
      var c = k.cloneNode(true);
      c.setAttribute("data-clone", "");
      c.setAttribute("aria-hidden", "true");
      c.classList.add("in");
      tr.appendChild(c);
    });
  }

  /* ---------------- Прокрутка ---------------- */
  var ticking = false;
  function onScroll() {
    ticking = false;
    updateIntro();
    updateCats();
    updateScrub();
    updatePara();
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener("scroll", requestTick, { passive: true });

  function layoutAll() {
    W = window.innerWidth; H = window.innerHeight;
    layoutIntro();
    layoutCats();
    onScroll();
  }
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutAll, 120);
  });

  // main.js перерисовывает блоки при смене языка — заново делим слова, копируем отзывы, меряем ленту
  var pending = false;
  new MutationObserver(function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      processText();
      cloneReviews();
      layoutCats();
      updateCats();
      updateScrub();
    });
  }).observe(document.body, { childList: true, subtree: true });

  processText();
  cloneReviews();
  layoutAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutAll);
  window.addEventListener("load", layoutAll);

  /* ---------------- Лепестки в финальном блоке ---------------- */
  (function petals() {
    var cv = $("#petals");
    if (!cv || reduce || !cv.getContext) return;
    var ctx = cv.getContext("2d"), list = [], running = false, dpr = Math.min(2, window.devicePixelRatio || 1), cw = 0, ch = 0;
    var COLORS = ["242,205,190", "246,226,216", "217,147,127", "255,240,232"];
    function size() {
      cw = cv.clientWidth; ch = cv.clientHeight;
      cv.width = cw * dpr; cv.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      return {
        x: Math.random() * cw,
        y: initial ? Math.random() * ch : -30,
        r: 6 + Math.random() * 9,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - .5) * .02,
        vy: .35 + Math.random() * .6,
        sway: Math.random() * Math.PI * 2,
        flip: Math.random() * Math.PI * 2,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        a: .35 + Math.random() * .45
      };
    }
    function init() {
      size();
      var n = cw < 720 ? 16 : 30;
      list = [];
      for (var i = 0; i < n; i++) list.push(make(true));
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, cw, ch);
      list.forEach(function (p, i) {
        p.sway += .012; p.flip += .03; p.rot += p.vr;
        p.y += p.vy; p.x += Math.sin(p.sway) * .5;
        if (p.y > ch + 30) list[i] = make(false);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, .55 + .45 * Math.abs(Math.sin(p.flip)));
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.bezierCurveTo(p.r * .9, -p.r * .6, p.r * .7, p.r * .7, 0, p.r);
        ctx.bezierCurveTo(-p.r * .7, p.r * .7, -p.r * .9, -p.r * .6, 0, -p.r);
        ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(frame);
    }
    init();
    window.addEventListener("resize", init);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; requestAnimationFrame(frame); }
        if (!vis) running = false;
      }).observe(cv);
    }
  })();

  /* ---------------- Курсор и «магнитные» кнопки (только мышь) ---------------- */
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var cur = $("#cursor"), label = $("span", cur);
    var VIEW = { ro: "Vezi", en: "View", uk: "Дивитись", ru: "Смотреть" };
    var tx = W / 2, ty = H / 2, cx = tx, cy = ty, shown = false;
    root.classList.add("has-cursor");
    cur.classList.add("is-hidden");
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; cx = tx; cy = ty; cur.classList.remove("is-hidden"); }
    }, { passive: true });
    document.addEventListener("mouseleave", function () { shown = false; cur.classList.add("is-hidden"); });
    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      var view = t.closest && t.closest(".work, .cat");
      var link = !view && t.closest && t.closest("a, button, .chip, .filter");
      var field = t.closest && t.closest("input, textarea, select, iframe");
      cur.classList.toggle("is-view", !!view);
      cur.classList.toggle("is-link", !!link);
      cur.classList.toggle("is-hidden", !!field || !shown);
      if (view) label.textContent = VIEW[root.lang] || VIEW.ro;
    });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      requestAnimationFrame(loop);
    })();

    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = "translate(" + (dx * 0.22).toFixed(1) + "px," + (dy * 0.32).toFixed(1) + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }
})();
