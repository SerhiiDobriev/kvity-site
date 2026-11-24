/*
 * Счётчик посещений KVITY (своя статистика на kvity.ro/stats/). Без cookies, без личных данных:
 * шлём только страницу, язык, откуда пришли, ширину экрана, часовой пояс и нажатия на кнопки.
 * Не считаем: конструктор фото (сайт внутри рамки), локальную проверку и свои устройства (?nostat=1).
 */
(function () {
  "use strict";
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* приватный режим */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* приватный режим */ } }
  };
  var q = new URLSearchParams(location.search);
  if (q.get("nostat") === "1") store.set("kvity-nostat", "1");
  if (q.get("nostat") === "0") store.del("kvity-nostat");
  var off = window.top !== window.self || window.KV_ALL_CATS || navigator.webdriver ||
    store.get("kvity-nostat") === "1" || !/kvity\.ro$/.test(location.hostname) && location.port !== "5700";
  var URL_HIT = "/stats/api/hit";

  function lang() { var l = document.documentElement.lang; return l === "uk" ? "ua" : (l || "").slice(0, 2); }
  function send(data) {
    if (off) return;
    var body = JSON.stringify(data);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(URL_HIT, new Blob([body], { type: "text/plain" }))) return;
    } catch (e) { /* ниже fetch */ }
    try { fetch(URL_HIT, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } }); } catch (e) { /* без статистики */ }
  }
  // Событие с сайта: window.kvStat("order_tg", { what: "...", budget: "..." })
  window.kvStat = function (name, extra) { send({ t: "e", e: name, x: extra || null, l: lang() }); };

  function pageview() {
    var ref = "";
    try { ref = document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) { /* пусто */ }
    var tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* пусто */ }
    send({ t: "pv", p: location.pathname, r: ref, u: q.get("utm_source") || q.get("src") || "", w: window.innerWidth, tc: (navigator.maxTouchPoints || 0) > 1 ? 1 : 0, tz: tz, l: lang() });
  }
  // Язык страница выставляет своим скриптом — ждём, пока он отработает
  if (document.readyState === "complete") setTimeout(pageview, 300);
  else window.addEventListener("load", function () { setTimeout(pageview, 300); });

  // Нажатия: звонок, чат, маршрут, Instagram, разделы, «Показати ще», фото, язык
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("a, button");
    if (!el) return;
    var href = el.getAttribute("href") || "";
    var name = "";
    if (/^tel:/.test(href)) name = "call";
    else if (/wa\.me|whatsapp/.test(href)) name = "chat_wa";
    else if (/t\.me\//.test(href)) name = "chat_tg";
    else if (/google\.[a-z.]+\/maps\/dir/.test(href)) name = "route";
    else if (/google\.[a-z.]+\/maps\/place/.test(href)) name = "google_reviews";
    else if (/instagram\.com/.test(href)) name = "instagram";
    else if (el.dataset.filter) name = "cat:" + el.dataset.filter;
    else if (el.dataset.cat) name = "cat:" + el.dataset.cat;
    else if (el.id === "moreWorks") name = "more";
    else if (el.id === "lbSimilar") name = "similar";
    else if (el.closest(".langs") && el.dataset.lang) name = "lang:" + el.dataset.lang;
    else if (/#order$/.test(href)) name = "order_open";
    else if (/termeni|confidentialitate/.test(href)) name = "legal";
    if (name) window.kvStat(name);
  }, true);
  document.addEventListener("click", function (e) {
    var fig = e.target.closest && e.target.closest("#gallery figure, #gallery .work");
    if (fig) window.kvStat("photo");
  }, true);
})();
