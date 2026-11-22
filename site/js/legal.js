/*
 * Страницы «Умови» и «Політика конфіденційності»: язык и данные фирмы.
 * Тексты всех трёх языков лежат в самой странице (<article data-l="ro|en|ua">), показываем один.
 * Контакты и реквизиты берутся из js/config.js, чтобы менять их в одном месте.
 */
(function () {
  "use strict";
  var cfg = window.KVITY_CONFIG || {};
  var LANGS = ["ro", "en", "ua"];
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* приватный режим */ } }
  };

  function detect() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) > -1) return q;
    var saved = store.get("kvity-lang");
    if (saved && LANGS.indexOf(saved) > -1) return saved;
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < list.length; i++) {
      var n = String(list[i] || "").slice(0, 2).toLowerCase();
      if (n === "uk" || n === "ru") return "ua";
      if (n === "ro" || n === "mo") return "ro";
    }
    return "en";
  }

  function show(lang) {
    document.documentElement.lang = lang === "ua" ? "uk" : lang;
    Array.prototype.forEach.call(document.querySelectorAll("article[data-l]"), function (a) { a.hidden = a.dataset.l !== lang; });
    Array.prototype.forEach.call(document.querySelectorAll(".lg-langs button"), function (b) {
      b.classList.toggle("is-active", b.dataset.lang === lang);
      b.setAttribute("aria-pressed", b.dataset.lang === lang);
    });
    var art = document.querySelector('article[data-l="' + lang + '"]');
    var h = art && art.querySelector("h1");
    if (h) document.title = h.textContent + " | KVITY";
    Array.prototype.forEach.call(document.querySelectorAll("a[data-home]"), function (a) { a.href = "./?lang=" + lang; });
    Array.prototype.forEach.call(document.querySelectorAll("a[data-page]"), function (a) { a.href = a.dataset.page + "?lang=" + lang; });
  }

  // Данные из config.js
  var legal = cfg.legal || {}, studios = cfg.studios || [];
  var data = {
    company: legal.company, cui: legal.cui, regCom: legal.regCom, seat: legal.seat, email: legal.email,
    phone: cfg.phone, tg: cfg.telegramOrders ? "@" + cfg.telegramOrders : "",
    studio1: studios[0] ? studios[0].address : "", studio2: studios[1] ? studios[1].address : ""
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-c]"), function (el) {
    var v = data[el.dataset.c] || "";
    el.textContent = v;
    if (el.dataset.c === "email" && v && el.tagName === "A") el.href = "mailto:" + v;
    if (el.dataset.c === "phone" && v && el.tagName === "A") el.href = "tel:" + v.replace(/\s+/g, "");
  });
  // Строки, где данных пока нет (например, почты), прячем целиком
  Array.prototype.forEach.call(document.querySelectorAll("[data-if]"), function (el) { el.hidden = !data[el.dataset.if]; });

  document.querySelector(".lg-langs").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-lang]");
    if (!b) return;
    store.set("kvity-lang", b.dataset.lang);
    show(b.dataset.lang);
  });
  show(detect());
})();
