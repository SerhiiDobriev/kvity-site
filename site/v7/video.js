/*
 * KVITY v7 (черновик, правка 31): видео на сайте.
 *  1) первый экран — короткое видео без звука по кругу; само видео и заставка стоят в HTML (tools/build-v7.js);
 *  2) блок «Історія одного букета» — 6 вертикальных роликов Алины (шаги 01–06),
 *     грузятся и тихо играют, только когда видны; нажатие — на весь экран со звуком,
 *     дальше ролики идут один за другим, как Stories.
 * Видео лежат в site/v7/video/ (не в git), сжаты ffmpeg из оригиналов в private/video-alina/.
 */
(function () {
  "use strict";
  var V = "video/alina-";
  // тексты от Алины (UA, 27.11.2026); RO и EN — перевод
  var STEPS = [
    { t: { ua: "Зустрічаємо квіти", ro: "Primim florile", en: "Welcoming the flowers" },
      d: { ua: "Приймаємо свіже постачання та ретельно перевіряємо якість кожної квітки.",
           ro: "Primim florile proaspete și verificăm cu atenție calitatea fiecărei flori.",
           en: "We receive each fresh delivery and carefully check the quality of every flower." } },
    { t: { ua: "Готуємо з турботою", ro: "Le pregătim cu grijă", en: "Preparing with care" },
      d: { ua: "Зачищаємо стебла, оновлюємо зрізи та створюємо оптимальні умови для зберігання квітів з урахуванням особливостей кожного сорту.",
           ro: "Curățăm tulpinile, le tăiem din nou și creăm condiții optime de păstrare, ținând cont de particularitățile fiecărui soi.",
           en: "We clean and re-cut the stems and create the best storage conditions, taking into account the needs of each variety." } },
    { t: { ua: "Створюємо ваш букет", ro: "Creăm buchetul tău", en: "Creating your bouquet" },
      d: { ua: "Поєднуємо відтінки, форми й фактури, приділяючи увагу кожній деталі. Створюємо ідеальний букет саме для вас.",
           ro: "Combinăm nuanțe, forme și texturi, cu atenție la fiecare detaliu. Creăm buchetul perfect, special pentru tine.",
           en: "We combine shades, shapes and textures, paying attention to every detail. We create the perfect bouquet just for you." } },
    { t: { ua: "Ділимося результатом", ro: "Îți arătăm rezultatul", en: "Sharing the result" },
      d: { ua: "Фотографуємо готовий букет та надсилаємо вам фото на погодження.",
           ro: "Fotografiem buchetul gata și îți trimitem fotografia spre aprobare.",
           en: "We photograph the finished bouquet and send you the photo for approval." } },
    { t: { ua: "Додаємо особисте", ro: "Adăugăm o notă personală", en: "Adding a personal touch" },
      d: { ua: "Переносимо ваші найтепліші слова на листівку, щоб разом із квітами передати ваші почуття. Додаємо рекомендації з догляду за букетом та поживний засіб для зрізаних квітів.",
           ro: "Scriem cele mai calde cuvinte ale tale pe o felicitare, ca împreună cu florile să-ți transmită sentimentele. Adăugăm sfaturi de îngrijire și un plic de hrană pentru flori.",
           en: "We write your warmest words on a card, so that together with the flowers it carries your feelings. We add care tips and a sachet of flower food." } },
    { t: { ua: "Доставляємо емоції", ro: "Livrăm emoții", en: "Delivering emotions" },
      d: { ua: "Дбайливо доставляємо букет, щоб він став частиною вашого особливого моменту.",
           ro: "Livrăm buchetul cu grijă, ca să devină parte din momentul tău special.",
           en: "We deliver the bouquet with care, so it becomes part of your special moment." } }
  ];
  STEPS.forEach(function (s, i) { var n = "0" + (i + 1); s.n = n; s.src = V + n + ".mp4"; s.poster = V + n + ".jpg?v=2"; }); // заставка = первый кадр ролика, чтобы не было скачка при старте
  var TXT = {
    ua: { kicker: "KVITY у русі", title: "Історія<br><em>одного букета</em>",
          lead: "За кожним букетом KVITY — маленька історія, яку зазвичай не видно. Запрошуємо вас побачити її нашими очима.",
          close: "Закрити", prev: "Назад", next: "Далі", dialog: "Відео" },
    ro: { kicker: "KVITY în mișcare", title: "Povestea<br><em>unui buchet</em>",
          lead: "În spatele fiecărui buchet KVITY e o mică poveste care de obicei rămâne nevăzută. Te invităm s-o vezi prin ochii noștri.",
          close: "Închide", prev: "Înapoi", next: "Înainte", dialog: "Video" },
    en: { kicker: "KVITY in motion", title: "The story<br><em>of a bouquet</em>",
          lead: "Behind every KVITY bouquet there is a small story that usually stays unseen. We invite you to see it through our eyes.",
          close: "Close", prev: "Previous", next: "Next", dialog: "Video" }
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  function lang() { var l = document.documentElement.lang; return l === "uk" ? "ua" : (TXT[l] ? l : "ro"); }
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
  var ARROW = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };

  // меньше движения / экономия трафика — ролики сами не играют (видна заставка)
  var calm = (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) ||
             (navigator.connection && navigator.connection.saveData);

  /* ---------- первый экран ---------- */
  var hv = $(".hero__video");
  if (hv && calm) { hv.removeAttribute("autoplay"); hv.pause(); }

  /* ---------- шаги с роликами ---------- */
  var track = $("#reelsTrack");
  track.insertAdjacentHTML("beforebegin", '<div class="reels__wrap"></div>');
  var wrap = track.previousElementSibling;
  wrap.appendChild(track);
  wrap.insertAdjacentHTML("beforeend",
    '<button type="button" class="reels__arrow reels__arrow--prev">' + ARROW("M15 5l-7 7 7 7") + "</button>" +
    '<button type="button" class="reels__arrow reels__arrow--next">' + ARROW("M9 5l7 7-7 7") + "</button>");
  // ролики грузятся заранее, но после первого экрана (см. ниже «load»), чтобы не тормозить его
  track.innerHTML = STEPS.map(function (s, i) {
    return '<figure class="story reveal" style="--delay:' + i * 0.08 + 's">' +
      '<button type="button" class="reel" data-i="' + i + '">' +
      '<video src="' + s.src + '" poster="' + s.poster + '" muted loop playsinline preload="none"></video>' +
      '<span class="reel__play">' + PLAY + '</span></button>' +
      '<figcaption><span class="story__n">' + s.n + '</span><h3></h3><p></p></figcaption></figure>';
  }).join("");

  var playerOpen = false, visible = [];
  function feedPlay(v) { if (!calm && !playerOpen) v.play().catch(function () {}); }
  if ("IntersectionObserver" in window) {
    // плавное появление, как у остальных блоков (карточка высокая из-за текста — хватает 10%)
    var ioIn = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ioIn.unobserve(e.target); } });
    }, { threshold: 0.1 });
    // ролик играет, когда видна хотя бы половина самого видео
    var ioPlay = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = $("video", e.target);
        visible[+e.target.dataset.i] = e.isIntersecting;
        if (e.isIntersecting) feedPlay(v); else v.pause();
      });
    }, { threshold: 0.5 });
    each(track.children, function (c) { ioIn.observe(c); ioPlay.observe($(".reel", c)); });
  } else each(track.children, function (c) { c.classList.add("in"); });

  // как только страница (первый экран, фото) загрузилась — тихо подгружаем все ролики,
  // чтобы к моменту, когда до них долистают, они уже были готовы
  function preloadReels() {
    if (calm) return;
    each(track.querySelectorAll("video"), function (v) { v.preload = "auto"; v.load(); });
  }
  if (document.readyState === "complete") setTimeout(preloadReels, 300);
  else window.addEventListener("load", function () { setTimeout(preloadReels, 300); });

  /* стрелки ‹ › для мыши, когда ролики не помещаются в ряд */
  var prev = $(".reels__arrow--prev", wrap), next = $(".reels__arrow--next", wrap);
  function arrows() {
    var max = track.scrollWidth - track.clientWidth;
    wrap.classList.toggle("is-scroll", max > 2);
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft > max - 4;
    var r = $(".reel", track); if (r) wrap.style.setProperty("--mid", r.offsetHeight / 2 + "px"); // на середине видео
  }
  function step(dir) {
    var c = track.children[0], gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: dir * (c.offsetWidth + gap), behavior: "smooth" });
  }
  prev.addEventListener("click", function () { step(-1); });
  next.addEventListener("click", function () { step(1); });
  track.addEventListener("scroll", arrows, { passive: true });
  window.addEventListener("resize", arrows);
  arrows();

  /* ---------- плеер на весь экран ---------- */
  var cur = 0, hideTimer = null, opener = null;
  document.body.insertAdjacentHTML("beforeend",
    '<div class="vplayer" id="vplayer" hidden role="dialog" aria-modal="true">' +
    '<button type="button" class="vplayer__x">×</button>' +
    '<div class="vplayer__stage"></div>' +
    '<p class="vplayer__cap"></p></div>');
  var pl = $("#vplayer"), stage = $(".vplayer__stage", pl), xBtn = $(".vplayer__x", pl);
  function show(i) {
    cur = (i + STEPS.length) % STEPS.length;
    var s = STEPS[cur];
    stage.innerHTML = '<video src="' + s.src + '" poster="' + s.poster + '" controls playsinline></video>';
    var v = $("video", stage);
    v.addEventListener("ended", function () { show(cur + 1); }); // дальше следующий шаг, как в Stories
    // play() сразу (в нажатии) — иначе iPhone может не включить звук; если не дал — хотя бы без звука
    v.play().catch(function () { v.muted = true; v.play().catch(function () {}); });
    $(".vplayer__cap", pl).textContent = s.n + " — " + s.t[lang()];
  }
  function open(i, from) {
    clearTimeout(hideTimer);
    opener = from || null;
    playerOpen = true;
    each(track.querySelectorAll("video"), function (v) { v.pause(); }); // лента под плеером не играет
    show(i);
    pl.hidden = false; document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(function () { pl.classList.add("is-open"); });
    xBtn.focus();
  }
  function close() {
    playerOpen = false;
    pl.classList.remove("is-open"); stage.innerHTML = ""; document.documentElement.style.overflow = "";
    hideTimer = setTimeout(function () { pl.hidden = true; }, 250);
    each(track.querySelectorAll(".reel"), function (r, i) { if (visible[i]) feedPlay($("video", r)); });
    if (opener) opener.focus();
  }
  track.addEventListener("click", function (e) { var c = e.target.closest(".reel"); if (c) open(+c.dataset.i, c); });
  xBtn.addEventListener("click", close);
  pl.addEventListener("click", function (e) { if (e.target === pl) close(); });
  document.addEventListener("keydown", function (e) {
    if (!playerOpen) return;
    if (e.key === "Escape") close();
    // стрелки переключают ролики, но не когда фокус на самом видео (там они перематывают)
    var onVideo = e.target && e.target.tagName === "VIDEO";
    if (e.key === "ArrowRight" && !onVideo) show(cur + 1);
    if (e.key === "ArrowLeft" && !onVideo) show(cur - 1);
    if (e.key === "Tab") { // фокус не уходит из плеера на страницу под ним
      e.preventDefault();
      var v = $("video", stage);
      (document.activeElement === xBtn && v ? v : xBtn).focus();
    }
  });
  // свайп: вверх/вниз — следующий/предыдущий (как в Reels); вбок — только вне видео,
  // чтобы перемотка ролика пальцем не переключала его
  var y0 = null, x0 = null, onStage = false;
  pl.addEventListener("touchstart", function (e) {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; onStage = stage.contains(e.target);
  }, { passive: true });
  pl.addEventListener("touchend", function (e) {
    if (x0 == null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.5) show(cur + (dy < 0 ? 1 : -1));
    else if (!onStage && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  /* ---------- тексты на языке сайта ---------- */
  function texts() {
    var L = lang(), T = TXT[L];
    $("#reelsKicker").textContent = T.kicker;
    $("#reelsTitle").innerHTML = T.title;
    $("#reelsLead").textContent = T.lead;
    xBtn.setAttribute("aria-label", T.close);
    pl.setAttribute("aria-label", T.dialog);
    prev.setAttribute("aria-label", T.prev);
    next.setAttribute("aria-label", T.next);
    each(track.children, function (c, i) {
      $("h3", c).textContent = STEPS[i].t[L];
      $("p", c).textContent = STEPS[i].d[L];
      $(".reel", c).setAttribute("aria-label", STEPS[i].n + " " + STEPS[i].t[L]);
    });
    if (playerOpen) $(".vplayer__cap", pl).textContent = STEPS[cur].n + " — " + STEPS[cur].t[L];
    arrows();
  }
  texts();
  new MutationObserver(texts).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
