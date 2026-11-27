/*
 * KVITY v7 (черновик, правка 31): видео на сайте.
 *  1) первый экран — короткое видео без звука по кругу (как живое фото);
 *  2) блок «KVITY у русі» — вертикальные ролики 9:16, листаются пальцем,
 *     сами тихо играют, когда видны; нажатие — на весь экран со звуком.
 * Пока видео нет, вместо них — фото с медленным «движением камеры».
 * Чтобы поставить настоящее видео: положить .mp4 в site/video/ и вписать src ниже.
 */
(function () {
  "use strict";
  var IMG = "../img/";
  // Пример: бесплатные стоковые ролики Mixkit и Pexels (лицензии позволяют на сайтах без подписи).
  // Только для показа Алине; потом заменить на её видео.
  var VID = "video/mixkit-";
  var V = {
    hero: { src: "video/pexels-6428717.mp4", poster: IMG + "buchet-trandafiri-piersica-kvity-constanta.webp?v=2" }, // Pexels, бесплатная лицензия
    reels: [
      { src: VID + "15122.mp4", poster: "", t: { ua: "Збираємо букет", ro: "Asamblăm buchetul", en: "Making a bouquet" } },
      { src: VID + "49067.mp4", poster: "", t: { ua: "Ніжні півонії", ro: "Bujori delicați", en: "Delicate peonies" } },
      { src: VID + "45126.mp4", poster: "", t: { ua: "Букет нареченої", ro: "Buchet de mireasă", en: "Bridal bouquet" } },
      { src: VID + "15115.mp4", poster: "", t: { ua: "Вручаємо з любов'ю", ro: "Oferit cu drag", en: "Handed with love" } },
      { src: VID + "18204.mp4", poster: "", t: { ua: "Весільна класика", ro: "Clasic de nuntă", en: "Wedding classic" } }
    ]
  };
  var TXT = {
    ua: { kicker: "KVITY у русі", title: "Як народжується<br><em>ваш букет</em>", watch: "Дивитись відео", soon: "Тут буде відео", close: "Закрити" },
    ro: { kicker: "KVITY în mișcare", title: "Cum se naște<br><em>buchetul tău</em>", watch: "Vezi video", soon: "Aici va fi un video", close: "Închide" },
    en: { kicker: "KVITY in motion", title: "How your bouquet<br><em>comes to life</em>", watch: "Watch video", soon: "Video coming here", close: "Close" }
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function lang() { var l = document.documentElement.lang; return l === "uk" ? "ua" : (TXT[l] ? l : "ro"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';

  /* ---------- первый экран ---------- */
  var media = $(".hero__media");
  if (V.hero.src) {
    media.insertAdjacentHTML("afterbegin", '<video class="hero__video" src="' + V.hero.src + '" poster="' + V.hero.poster + '" muted autoplay loop playsinline preload="metadata"></video>');
  } else {
    media.classList.add("is-live");
  }

  /* ---------- ролики ---------- */
  var track = $("#reelsTrack");
  function cardHtml(r, i) {
    var inner = r.src
      ? '<video src="' + r.src + '" poster="' + r.poster + '" muted loop playsinline preload="metadata"></video>'
      : '<img src="' + r.poster + '" alt="" loading="lazy" style="--k:' + (i % 3) + '">';
    return '<button type="button" class="reel reveal" style="--delay:' + i * 0.08 + 's" data-i="' + i + '">' + inner +
      '<span class="reel__play">' + PLAY + '</span><span class="reel__cap"></span></button>';
  }
  track.innerHTML = V.reels.map(cardHtml).join("");

  // ролики тихо играют, только пока видны на экране
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("in"); // плавное появление, как у остальных блоков
        var v = $("video", e.target); if (!v) return;
        if (e.isIntersecting) { v.play().catch(function () {}); } else v.pause();
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(track.children, function (c) { io.observe(c); });
  } else Array.prototype.forEach.call(track.children, function (c) { c.classList.add("in"); });

  /* ---------- плеер на весь экран ---------- */
  var list = V.reels, cur = 0;
  document.body.insertAdjacentHTML("beforeend",
    '<div class="vplayer" id="vplayer" hidden role="dialog" aria-modal="true">' +
    '<button type="button" class="vplayer__x" aria-label="">×</button>' +
    '<div class="vplayer__stage"></div>' +
    '<p class="vplayer__cap"></p></div>');
  var pl = $("#vplayer"), stage = $(".vplayer__stage", pl);
  function show(i) {
    cur = (i + list.length) % list.length;
    var it = list[cur], L = lang();
    stage.innerHTML = it.src
      ? '<video src="' + it.src + '" poster="' + it.poster + '" controls autoplay playsinline></video>'
      : '<img src="' + it.poster + '" alt=""><span class="vplayer__soon">' + PLAY + esc(TXT[L].soon) + "</span>";
    $(".vplayer__cap", pl).textContent = it.t ? it.t[L] : "KVITY";
  }
  function open(i) { show(i); pl.hidden = false; document.documentElement.style.overflow = "hidden"; requestAnimationFrame(function () { pl.classList.add("is-open"); }); }
  function close() { pl.classList.remove("is-open"); stage.innerHTML = ""; document.documentElement.style.overflow = ""; setTimeout(function () { pl.hidden = true; }, 250); }
  track.addEventListener("click", function (e) { var c = e.target.closest(".reel"); if (c) open(+c.dataset.i); });
  $(".vplayer__x", pl).addEventListener("click", close);
  pl.addEventListener("click", function (e) { if (e.target === pl) close(); });
  document.addEventListener("keydown", function (e) {
    if (pl.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
  var y0 = null, x0 = null;
  pl.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  pl.addEventListener("touchend", function (e) {
    if (x0 == null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) show(cur + (dy < 0 ? 1 : -1)); // вверх — следующее, как в Reels
    else if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  /* ---------- тексты на языке сайта ---------- */
  function texts() {
    var L = lang(), T = TXT[L];
    $("#reelsKicker").textContent = T.kicker;
    $("#reelsTitle").innerHTML = T.title;
    $(".vplayer__x", pl).setAttribute("aria-label", T.close);
    Array.prototype.forEach.call(track.children, function (c) { c.querySelector(".reel__cap").textContent = V.reels[+c.dataset.i].t[L]; });
    if (!pl.hidden) show(cur);
  }
  texts();
  new MutationObserver(texts).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
