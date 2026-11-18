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

  var touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (touch) root.classList.add("is-touch");
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
    maxScale = touch ? 12 : Math.max(36, (w / (fs * 0.13)) * 1.4);
  }

  /* Прокрутка: на каждом кадре читаем только scrollY, а положения блоков меряем заранее (layoutAll).
     Так браузеру не приходится пересчитывать вёрстку посреди кадра — на телефоне это и давало рывки. */
  var Y = 0;
  var heroTop = 0, heroRange = 1;

  function updateIntro() {
    if (!hero || reduce) return;
    var p = clamp((Y - heroTop) / heroRange, 0, 1);
    if (sdaOn) { hero.classList.toggle("is-revealed", p > 0.7); return; } // движение ведёт браузер (buildSda)
    var z = clamp(p / 0.6, 0, 1);
    var e = smooth(z);
    var s = Math.pow(maxScale, e);
    mask.style.transform = "scale(" + s.toFixed(3) + ")";
    // на телефоне буквы не растягиваем до бесконечности, а мягко растворяем — так легче для видеокарты
    if (touch) mask.style.opacity = (1 - smooth(clamp((z - 0.45) / 0.5, 0, 1))).toFixed(3);
    mask.style.visibility = z >= 0.995 ? "hidden" : "visible";
    heroImg.style.transform = "scale(" + (1.2 - 0.2 * e).toFixed(4) + ")";
    hero.style.setProperty("--p", p.toFixed(4));
    hero.classList.toggle("is-revealed", p > 0.7);
  }

  /* ---------------- Категории: едут вбок ---------------- */
  var catsSec = $("#catsSec"), catsTrack = $("#cats"), catsBar = $("#catsBar"), catsPin = $(".cats__pin");
  var catsDist = 0, catsTop = 0, catsRange = 1, lastCatsX = null;
  function layoutCats() {
    if (!catsSec || reduce) return false;
    var ph = catsPin.clientHeight;          // 100svh — не прыгает, когда прячется адресная строка
    var old = catsDist;
    catsDist = Math.max(0, catsTrack.offsetWidth - W);
    catsSec.style.height = (ph + catsDist) + "px";
    catsRange = Math.max(1, catsDist);
    return old !== catsDist;
  }
  function updateCats() {
    if (!catsSec || reduce || sdaOn) return;
    var p = clamp((Y - catsTop) / catsRange, 0, 1);
    var x = Math.round(-p * catsDist);
    if (x === lastCatsX) return;
    lastCatsX = x;
    catsTrack.style.transform = "translate3d(" + x + "px,0,0)";
    if (catsBar) catsBar.style.setProperty("--cp", p.toFixed(4));
  }

  /* ---------------- Анимации, которые ведёт сам браузер ----------------
     Современные браузеры умеют сами связывать анимацию с прокруткой (ViewTimeline) и считают её
     отдельно от страницы — она не дёргается, даже если телефон в этот момент занят (догружает фото).
     Где браузер так не умеет, работает запасной вариант выше (updateIntro / updateCats). */
  var sdaOk = !reduce && typeof window.ViewTimeline === "function";
  var sdaOn = false, anims = [];
  function run(el, frames, tl) {
    if (!el) return;
    anims.push(el.animate(frames, { timeline: tl, fill: "both", easing: "linear", rangeStart: "contain 0%", rangeEnd: "contain 100%" }));
  }
  function buildSda() {
    anims.forEach(function (a) { a.cancel(); });
    anims = [];
    if (!sdaOk || !hero) return false;
    try {
      var tl = new ViewTimeline({ subject: hero, axis: "block", inset: "0px" }) /* без отступа под шапку (scroll-padding) */;
      var N = 24, i, z, e, kMask = [], kImg = [];
      for (i = 0; i <= N; i++) {
        z = i / N; e = smooth(z);
        kMask.push({
          offset: z * 0.6,
          transform: "scale(" + Math.pow(maxScale, e).toFixed(3) + ")",
          opacity: touch ? +(1 - smooth(clamp((z - 0.45) / 0.5, 0, 1))).toFixed(3) : (z >= 0.995 ? 0 : 1)
        });
        kImg.push({ offset: z * 0.6, transform: "scale(" + (1.2 - 0.2 * e).toFixed(4) + ")" });
      }
      kMask.push({ offset: 1, transform: "scale(" + maxScale.toFixed(3) + ")", opacity: 0 });
      kImg.push({ offset: 1, transform: "scale(1)" });
      run(mask, kMask, tl);
      run(heroImg, kImg, tl);
      run($(".hero__shade"), [{ offset: 0, opacity: 0 }, { offset: 0.375, opacity: 0 }, { offset: 0.79, opacity: 1 }, { offset: 1, opacity: 1 }], tl);
      run(cap, [{ offset: 0, opacity: 1 }, { offset: 0.07, opacity: 0 }, { offset: 1, opacity: 0 }], tl);
      run($(".hero__hint"), [{ offset: 0, opacity: 1 }, { offset: 0.08, opacity: 0 }, { offset: 1, opacity: 0 }], tl);
      run($(".hero__content"), [
        { offset: 0, opacity: 0, transform: "translateY(144px)" },
        { offset: 0.56, opacity: 0, transform: "translateY(43px)" },
        { offset: 0.76, opacity: 1, transform: "translateY(7px)" },
        { offset: 0.8, opacity: 1, transform: "translateY(0)" },
        { offset: 1, opacity: 1, transform: "translateY(0)" }
      ], tl);
      if (catsSec) {
        var ctl = new ViewTimeline({ subject: catsSec, axis: "block", inset: "0px" });
        run(catsTrack, [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(" + (-catsDist) + "px,0,0)" }], ctl);
        run(catsBar, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], ctl);
      }
      // скрипт больше не двигает эти блоки сам
      mask.style.transform = mask.style.opacity = mask.style.visibility = heroImg.style.transform = catsTrack.style.transform = "";
      return true;
    } catch (err) {
      anims.forEach(function (a) { a.cancel(); });
      anims = [];
      return false;
    }
  }

  /* ---------------- Проявление текста словами ---------------- */
  var scrubs = [];
  function updateScrub() {
    scrubs.forEach(function (s) {
      var n = s.words.length;
      if (!n) return;
      var k;
      if (reduce) k = n;
      else {
        var top = s.top - Y;  // положение на экране
        var p = clamp((H * 0.82 - top) / (s.height + H * 0.3), 0, 1);
        k = Math.round(p * n * 1.05);
      }
      if (k === s.k) return;
      s.k = k;
      for (var i = 0; i < n; i++) s.words[i].classList.toggle("on", i < k);
    });
  }

  /* ---------------- Параллакс (только компьютер) ---------------- */
  var para = touch ? [] : $$("[data-speed]").map(function (el) { return { el: el, speed: parseFloat(el.dataset.speed), mid: 0 }; });
  function updatePara() {
    if (reduce) return;
    para.forEach(function (o) {
      var c = o.mid - Y;  // центр блока относительно верха экрана
      if (c < -H || c > H * 2) return;
      o.el.style.transform = "translate3d(0," + (-(c - H / 2) * o.speed).toFixed(1) + "px,0)";
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

  /* ---------------- Замеры ---------------- */
  function measure() {
    var y = window.scrollY;
    if (hero) {
      heroTop = hero.getBoundingClientRect().top + y;
      heroRange = Math.max(1, hero.offsetHeight - $(".hero__pin").clientHeight);
    }
    if (catsSec) catsTop = catsSec.getBoundingClientRect().top + y;
    scrubs = $$(".scrub").map(function (el) {
      var r = el.getBoundingClientRect();
      return { words: el.querySelectorAll(".sw"), top: r.top + y, height: r.height, k: -1 };
    });
    para.forEach(function (o) {
      var r = o.el.parentElement.getBoundingClientRect();
      o.mid = r.top + y + r.height / 2;
    });
    lastCatsX = null;
  }

  /* ---------------- Прокрутка ---------------- */
  var ticking = false;
  function onScroll() {
    ticking = false;
    Y = window.scrollY;
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
    measure();
    sdaOn = buildSda();
    onScroll();
  }
  // На телефоне при прокрутке прячется адресная строка и меняется высота окна —
  // это не повод всё перемерять (иначе страница дёргается). Перемеряем, только если изменилась ширина.
  var resizeTimer, lastW = W;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (touch && window.innerWidth === lastW) { H = window.innerHeight; return; }
      lastW = window.innerWidth;
      layoutAll();
    }, 150);
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
      if (layoutCats() && sdaOn) sdaOn = buildSda(); // ширина ленты категорий изменилась (другой язык)
      measure();
      onScroll();
    });
  }).observe(document.body, { childList: true, subtree: true });

  processText();
  cloneReviews();
  layoutAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutAll);
  window.addEventListener("load", layoutAll);

  // Фото подгружаем заранее, когда страница уже открылась и телефон свободен, —
  // чтобы он не «задумывался» над фото прямо во время прокрутки. На медленном интернете не трогаем.
  window.addEventListener("load", function () {
    var c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) return;
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1500); };
    idle(function () {
      $$('img[loading="lazy"]').forEach(function (img) { img.loading = "eager"; });
    }, { timeout: 4000 });
  });
  // высота страницы поменялась (догрузились фото, сменился фильтр галереи) — перемеряем положения блоков
  if ("ResizeObserver" in window) {
    var roTimer;
    new ResizeObserver(function () {
      clearTimeout(roTimer);
      roTimer = setTimeout(function () { measure(); onScroll(); }, 100);
    }).observe(document.body);
  }

  /* ---------------- Лепестки в финальном блоке ---------------- */
  (function petals() {
    var cv = $("#petals");
    if (!cv || reduce || !cv.getContext) return;
    if (touch) { cv.remove(); return; } // на телефоне без лепестков: они рисуются каждый кадр
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

  /* ---------------- «Магнитные» кнопки (только мышь) ---------------- */
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
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
