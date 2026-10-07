(function () {
  "use strict";

  var cfg = window.KVITY_CONFIG;
  var I18N = window.KVITY_I18N;
  var LANGS = ["ro", "en", "ua", "ru"];
  var HTML_LANG = { ro: "ro", en: "en", ua: "uk", ru: "ru" };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var el = function (tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (html != null) node.innerHTML = html;
    return node;
  };
  var icon = function (id) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var tel = function (p) { return "tel:" + p.replace(/[^\d+]/g, ""); };
  var mapsDir = function (q) { return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q); };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* приватный режим */ } }
  };

  /* ---------------- Язык ---------------- */
  var lang = detectLang();
  var dict = I18N[lang];

  function detectLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) > -1) return q;
    var saved = store.get("kvity-lang");
    if (saved && LANGS.indexOf(saved) > -1) return saved;
    var nav = (navigator.language || "ro").slice(0, 2).toLowerCase();
    if (nav === "uk") return "ua";
    if (nav === "ru") return "ru";
    if (nav === "en") return "en";
    return "ro";
  }

  function t(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, dict);
  }

  function applyLang(next) {
    lang = next;
    dict = I18N[lang];
    store.set("kvity-lang", lang);
    document.documentElement.lang = HTML_LANG[lang];
    document.title = t("meta.title");
    $('meta[name="description"]').setAttribute("content", t("meta.description"));

    $$("[data-i18n]").forEach(function (n) { var v = t(n.dataset.i18n); if (v != null) n.textContent = v; });
    $$("[data-i18n-html]").forEach(function (n) {
      var v = t(n.dataset.i18nHtml);
      if (v == null) return;
      n.innerHTML = v;
      if (n.hasAttribute("data-split")) splitWords(n);
    });
    $$("[data-i18n-ph]").forEach(function (n) { n.placeholder = t(n.dataset.i18nPh); });
    $$("[data-i18n-aria]").forEach(function (n) { n.setAttribute("aria-label", t(n.dataset.i18nAria)); });
    $$(".langs button").forEach(function (b) {
      var on = b.dataset.lang === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });

    renderMarquee();
    renderGalleryCaptions();
    renderSteps();
    renderChips();
    renderTimes();
    renderStudios();
    renderReviews();
    renderFooter();
    updateRef();
    observeAll();
  }

  /* Делим заголовок на слова для пословной анимации, сохраняя <em> и <br> */
  function splitWords(root) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = el("span", { "class": "w" });
            var inner = el("span", { style: "--i:" + (i++) });
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    })(root);
  }

  /* ---------------- Бегущая строка ---------------- */
  function renderMarquee() {
    var items = t("marquee");
    var html = "";
    for (var r = 0; r < 2; r++) {
      html += items.map(function (s) {
        return '<span class="marquee__item">' + esc(s) + '<svg aria-hidden="true"><use href="#i-flower"/></svg></span>';
      }).join("");
    }
    $("#marquee").innerHTML = html;
  }

  /* ---------------- Галерея ---------------- */
  var gallery = $("#gallery");
  function buildGallery() {
    cfg.gallery.forEach(function (item, idx) {
      var fig = el("figure", { "class": "work", tabindex: "0", role: "button", "data-index": idx });
      fig.innerHTML =
        '<div class="work__frame"><img src="' + item.src + '" alt="" loading="lazy" decoding="async">' +
        '<span class="work__num">' + String(idx + 1).padStart(2, "0") + "</span></div>" +
        "<figcaption></figcaption>";
      fig.addEventListener("click", function () { openLightbox(idx); });
      fig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(idx); } });
      gallery.appendChild(fig);
    });
  }
  function caption(id) { return t("gallery.captions." + id) || ""; }
  function renderGalleryCaptions() {
    $$(".work", gallery).forEach(function (fig, idx) {
      var cap = caption(cfg.gallery[idx].id);
      $("figcaption", fig).textContent = cap;
      $("img", fig).alt = "KVITY — " + cap;
      fig.setAttribute("aria-label", cap);
    });
  }

  /* ---------------- Лайтбокс ---------------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbIndex = 0, lastFocus = null;
  function openLightbox(idx) {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.documentElement.style.overflow = "hidden";
    showSlide(idx);
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    $("#lbClose").focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    setTimeout(function () { lb.hidden = true; lbImg.classList.remove("is-loaded"); }, 400);
    if (lastFocus) lastFocus.focus();
  }
  function showSlide(idx) {
    var n = cfg.gallery.length;
    lbIndex = (idx + n) % n;
    var item = cfg.gallery[lbIndex];
    lbImg.classList.remove("is-loaded");
    lbImg.onload = function () { lbImg.classList.add("is-loaded"); };
    lbImg.src = item.src;
    lbImg.alt = caption(item.id);
    if (lbImg.complete) requestAnimationFrame(function () { lbImg.classList.add("is-loaded"); });
    $("#lbCaption").textContent = caption(item.id);
    $("#lbCount").textContent = String(lbIndex + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0");
  }
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", function () { showSlide(lbIndex - 1); });
  $("#lbNext").addEventListener("click", function () { showSlide(lbIndex + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showSlide(lbIndex - 1);
    if (e.key === "ArrowRight") showSlide(lbIndex + 1);
  });
  (function swipe() {
    var x0 = null, y0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showSlide(lbIndex + (dx < 0 ? 1 : -1));
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeLightbox();
      x0 = null;
    }, { passive: true });
  })();
  $("#lbSimilar").addEventListener("click", function () {
    state.ref = lbIndex;
    updateRef();
    closeLightbox();
    setTimeout(function () { $("#order").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }, 250);
  });

  /* ---------------- Шаги ---------------- */
  function renderSteps() {
    var list = $("#steps");
    var wasIn = $$(".step.in", list).length > 0;
    list.innerHTML = t("how.steps").map(function (s, i) {
      return '<li class="step' + (wasIn ? " in" : "") + '" style="--delay:' + i * 0.12 + 's">' +
        '<span class="step__num">' + (i + 1) + "</span>" +
        "<div><h3>" + esc(s.t) + "</h3><p>" + esc(s.d) + "</p></div></li>";
    }).join("");
  }

  /* ---------------- Форма ---------------- */
  var state = { occasion: null, palette: null, style: null, budget: null, method: "delivery", studio: 0, ref: null };
  var SWATCHES = [
    "linear-gradient(135deg,#F6D6DA,#EBC3E0)",
    "conic-gradient(#E0475B,#F2A33A,#D94C9C,#7A5CD6,#E0475B)",
    "#FFFFFF",
    "conic-gradient(#F3DCDD,#C7D3B4,#B9C7EA,#F6E1C3,#F3DCDD)"
  ];

  function chipGroup(container, name, labels, key, extra) {
    container.innerHTML = labels.map(function (label, i) {
      var val = extra && extra.values ? extra.values[i] : i;
      var sw = extra && extra.swatches ? '<span class="swatch" style="background:' + extra.swatches[i] + '"></span>' : "";
      var checked = String(state[key]) === String(val) ? " checked" : "";
      return '<label class="chip' + (checked ? " is-checked" : "") + '"><input type="radio" name="' + name + '" value="' + val + '"' + checked + ">" + sw + "<span>" + esc(label) + "</span></label>";
    }).join("");
  }

  function renderChips() {
    chipGroup($("#occasionChips"), "occasion", t("form.occasions"), "occasion");
    chipGroup($("#paletteChips"), "palette", t("form.palettes"), "palette", { swatches: SWATCHES });
    chipGroup($("#styleChips"), "style", t("form.styles"), "style");
    var budgetLabels = cfg.budgets.map(function (b) { return b + " " + t("form.currency"); }).concat(t("form.custom"));
    chipGroup($("#budgetChips"), "budget", budgetLabels, "budget", { values: cfg.budgets.map(String).concat("custom") });
    chipGroup($("#studioChips"), "studio", cfg.studios.map(function (s) { return "KVITY " + s.name; }), "studio");
  }

  $(".form").addEventListener("change", function (e) {
    var input = e.target;
    if (input.type !== "radio") return;
    var v = input.value;
    state[input.name] = (input.name === "budget") ? v : Number(v);
    $$('input[name="' + input.name + '"]').forEach(function (r) { r.closest(".chip").classList.toggle("is-checked", r.checked); });
    var chip = input.closest(".chip");
    chip.classList.remove("pop"); void chip.offsetWidth; chip.classList.add("pop");
    if (input.name === "budget") {
      var custom = $("#customBudget");
      custom.hidden = v !== "custom";
      if (v === "custom") $("#budgetCustom").focus();
    }
  });

  function renderTimes() {
    var sel = $("#time"), prev = sel.value;
    var slots = ["asap", "09:00–11:00", "11:00–13:00", "13:00–15:00", "15:00–17:00", "17:00–19:00"];
    sel.innerHTML = slots.map(function (s) {
      return '<option value="' + s + '">' + (s === "asap" ? esc(t("form.asap")) : s) + "</option>";
    }).join("");
    if (prev) sel.value = prev;
  }

  (function initDate() {
    var d = new Date();
    var iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $("#date").min = iso;
    $("#date").value = iso;
  })();

  var segment = $("#method");
  segment.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-method]");
    if (!b) return;
    state.method = b.dataset.method;
    $$("button", segment).forEach(function (x) { x.classList.toggle("is-active", x === b); });
    segment.classList.toggle("is-pickup", state.method === "pickup");
    $("#deliveryBox").classList.toggle("is-open", state.method === "delivery");
    $("#pickupBox").classList.toggle("is-open", state.method === "pickup");
  });

  function updateRef() {
    var box = $("#refBox");
    if (state.ref == null) { box.hidden = true; return; }
    var item = cfg.gallery[state.ref];
    box.hidden = false;
    $("#refImg").src = item.src;
    $("#refCaption").textContent = "#" + String(state.ref + 1).padStart(2, "0") + " · " + caption(item.id);
    $("#refRemove").setAttribute("aria-label", t("form.remove"));
  }
  $("#refRemove").addEventListener("click", function () { state.ref = null; updateRef(); });

  function fieldError(input, on) {
    var wrap = input.closest(".input");
    if (!wrap) return;
    var err = $(".error", wrap);
    wrap.classList.toggle("has-error", on);
    if (on && !err) { err = el("span", { "class": "error" }); wrap.appendChild(err); }
    if (err) { err.textContent = on ? t("form.required") : ""; if (!on) err.remove(); }
  }

  $("#orderForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var required = [$("#name"), $("#phone"), $("#date")];
    if (state.method === "delivery") required.push($("#address"));
    var firstBad = null;
    required.forEach(function (inp) {
      var bad = !inp.value.trim();
      fieldError(inp, bad);
      if (bad && !firstBad) firstBad = inp;
    });
    if (firstBad) { firstBad.focus({ preventScroll: true }); firstBad.scrollIntoView({ behavior: "smooth", block: "center" }); return; }

    var url = "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(buildMessage());
    toast(t("form.sent"));
    var win = window.open(url, "_blank", "noopener");
    if (!win) location.href = url;
  });
  $("#orderForm").addEventListener("input", function (e) {
    if (e.target.closest(".has-error") && e.target.value.trim()) fieldError(e.target, false);
  });

  function buildMessage() {
    var m = function (k) { return t("msg." + k); };
    var lines = [m("hello"), ""];
    if (state.occasion != null) lines.push("• " + m("occasion") + ": " + t("form.occasions")[state.occasion]);
    if (state.palette != null) lines.push("• " + m("palette") + ": " + t("form.palettes")[state.palette]);
    if (state.style != null) lines.push("• " + m("style") + ": " + t("form.styles")[state.style]);
    if (state.budget != null) {
      var b = state.budget === "custom" ? ($("#budgetCustom").value.trim() || "—") : state.budget;
      lines.push("• " + m("budget") + ": " + b + " " + t("form.currency"));
    }
    var time = $("#time").value;
    var dateStr = $("#date").value.split("-").reverse().join(".");
    lines.push("• " + m("date") + ": " + dateStr + ", " + (time === "asap" ? t("form.asap") : time));
    if (state.method === "delivery") {
      lines.push("• " + m("delivery") + ": " + $("#address").value.trim());
    } else {
      lines.push("• " + m("pickup") + ": KVITY " + cfg.studios[state.studio || 0].name);
    }
    var card = $("#card").value.trim();
    if (card) lines.push("• " + m("card") + ": «" + card + "»");
    if (state.ref != null) {
      var item = cfg.gallery[state.ref];
      var abs = new URL(item.src, location.href).href;
      lines.push("• " + m("example") + ": #" + String(state.ref + 1).padStart(2, "0") + " " + caption(item.id) + " — " + abs);
    }
    lines.push("");
    lines.push(m("name") + ": " + $("#name").value.trim());
    lines.push(m("phone") + ": " + $("#phone").value.trim());
    lines.push("");
    lines.push(m("thanks"));
    return lines.join("\n");
  }

  /* ---------------- Студии ---------------- */
  function renderStudios() {
    var grid = $("#studiosGrid");
    var loaded = {};
    $$(".map iframe", grid).forEach(function (f) { loaded[f.closest(".studio").dataset.id] = true; });
    grid.innerHTML = cfg.studios.map(function (s, i) {
      return '<article class="studio reveal" style="--delay:' + i * 0.12 + 's" data-id="' + s.id + '">' +
        '<div class="studio__body">' +
          '<div class="studio__top"><h3>' + esc(s.name) + '</h3>' +
          '<span class="studio__rating">' + icon("star") + "<strong>" + s.rating.toFixed(1) + "</strong><small>(" + s.reviews + " " + esc(t("studios.reviews")) + ")</small></span></div>" +
          '<p class="studio__line">' + icon("pin") + "<span>" + esc(s.address) + "</span></p>" +
          '<p class="studio__line">' + icon("clock") + "<span>" + esc(t("studios.daily")) + ", " + s.hours + "</span></p>" +
          '<div class="studio__actions">' +
            '<a class="btn btn--primary" target="_blank" rel="noopener" href="' + mapsDir(s.mapsQuery) + '">' + icon("route") + "<span>" + esc(t("studios.route")) + "</span></a>" +
            '<a class="btn btn--ghost" href="' + tel(s.phone) + '">' + icon("phone") + "<span>" + esc(t("studios.call")) + "</span></a>" +
          "</div>" +
        "</div>" +
        '<div class="map">' + icon("pin").replace('class="ico"', 'class="ico map__pin"') +
          '<button type="button" class="btn btn--ghost map__btn" style="background:var(--card)">' + esc(t("studios.map")) + "</button></div>" +
        "</article>";
    }).join("");
    $$(".studio", grid).forEach(function (card, i) {
      var load = function () {
        var map = $(".map", card);
        map.innerHTML = '<iframe title="' + esc(cfg.studios[i].name) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' +
          encodeURIComponent(cfg.studios[i].mapsQuery) + '&z=16&output=embed"></iframe>';
      };
      $(".map__btn", card).addEventListener("click", load);
      if (loaded[card.dataset.id]) load();
    });
  }

  /* ---------------- Отзывы ---------------- */
  function renderReviews() {
    $("#reviewsTrack").innerHTML = cfg.reviews.map(function (r, i) {
      return '<article class="review reveal" style="--delay:' + i * 0.1 + 's">' +
        '<div class="review__stars">' + new Array(r.stars + 1).join(icon("star")) + "</div>" +
        "<p>" + esc(r.text) + "</p>" +
        '<footer><span class="review__avatar">' + esc(r.name.charAt(0)) + "</span><span><strong>" + esc(r.name) + "</strong><small>" + esc(t("reviews.from")) + "</small></span></footer>" +
        "</article>";
    }).join("");
    $("#allReviews").href = cfg.googleReviewsUrl;
  }

  /* ---------------- Подвал и контакты ---------------- */
  function renderFooter() {
    var wa = "https://wa.me/" + cfg.whatsapp;
    $("#footerContacts").innerHTML =
      '<li><a href="' + tel(cfg.phone) + '">' + icon("phone") + esc(cfg.phone) + "</a></li>" +
      '<li><a href="' + wa + '" target="_blank" rel="noopener">' + icon("chat") + "WhatsApp</a></li>" +
      '<li><a href="' + cfg.telegram + '" target="_blank" rel="noopener">' + icon("send") + "Telegram</a></li>" +
      cfg.studios.map(function (s) {
        return '<li><a href="' + mapsDir(s.mapsQuery) + '" target="_blank" rel="noopener">' + icon("pin") + esc(s.name) + "</a></li>";
      }).join("");
    $("#socials").innerHTML =
      '<a href="' + cfg.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + icon("insta") + "</a>" +
      '<a href="' + cfg.telegram + '" target="_blank" rel="noopener" aria-label="Telegram">' + icon("send") + "</a>" +
      '<a href="' + wa + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon("chat") + "</a>";
    $("#legal").innerHTML =
      "<li>" + esc(cfg.legal.company) + "</li>" +
      "<li>CUI: " + esc(cfg.legal.cui) + "</li>" +
      '<li><a href="mailto:' + cfg.legal.email + '">' + esc(cfg.legal.email) + "</a></li>" +
      '<li><a href="#">' + esc(t("footer.privacy")) + "</a></li>" +
      '<li><a href="#">' + esc(t("footer.terms")) + "</a></li>" +
      '<li><a href="https://anpc.ro/" target="_blank" rel="noopener">' + esc(t("footer.anpc")) + "</a> · " +
      '<a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener">' + esc(t("footer.sal")) + "</a></li>";
    $$(".js-call").forEach(function (a) { a.href = tel(cfg.phone); });
    $$(".js-wa").forEach(function (a) { a.href = wa; });
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------------- Тост ---------------- */
  var toastTimer;
  function toast(msg) {
    var n = $("#toast");
    n.textContent = msg;
    n.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { n.classList.remove("is-visible"); }, 2600);
  }

  /* ---------------- Появление при скролле ---------------- */
  var seen = new WeakSet();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.classList.contains("stat")) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  function observeAll() {
    $$(".reveal, .reveal-img, [data-split], .work, .step, .draw-in, .stat").forEach(function (n) {
      if (n.classList.contains("hero__title")) return; // заголовок hero запускается после интро
      if (seen.has(n) && n.classList.contains("in")) return;
      seen.add(n);
      io.observe(n);
    });
    $$(".work", gallery).forEach(function (w, i) {
      var cols = window.innerWidth >= 1000 ? 4 : window.innerWidth >= 720 ? 3 : 2;
      w.style.setProperty("--delay", (i % cols) * 0.1 + "s");
    });
  }

  function countUp(stat) {
    var n = $(".count", stat);
    if (!n || reduceMotion) return;
    var target = parseFloat(n.dataset.count), dec = parseInt(n.dataset.decimals || "0", 10), t0 = null;
    (function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
      n.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* ---------------- Параллакс, рисование линий, шапка ---------------- */
  var header = $(".header"), sticky = $("#sticky"), hero = $(".hero"), orderSec = $("#order");
  var parallax = $$("[data-parallax]");
  var drawers = $$(".draw-scroll");
  var stepsWrap = $(".steps-wrap"), stepsLine = $(".steps__line");
  var lastY = window.scrollY, ticking = false;

  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;

    header.classList.toggle("is-scrolled", y > 10);
    header.classList.toggle("is-hidden", y > lastY && y > 500 && lb.hidden);
    lastY = y;

    var heroBottom = hero.offsetTop + hero.offsetHeight - vh * 0.4;
    var orderRect = orderSec.getBoundingClientRect();
    var formVisible = orderRect.top < vh * 0.8 && orderRect.bottom > vh * 0.2;
    sticky.classList.toggle("is-visible", y > heroBottom && !formVisible);

    if (!reduceMotion) {
      parallax.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var offset = (r.top + r.height / 2 - vh / 2) * parseFloat(img.dataset.parallax);
        img.style.translate = "0 " + offset.toFixed(1) + "px";
      });
    }
    drawers.forEach(function (svg) {
      var r = svg.getBoundingClientRect();
      var p = Math.min(Math.max((vh - r.top) / (vh * 0.4 + r.height), 0), 1);
      svg.style.setProperty("--p", reduceMotion ? 1 : p.toFixed(3));
    });
    if (stepsWrap) {
      var r2 = stepsWrap.getBoundingClientRect();
      var p2 = Math.min(Math.max((vh * 0.75 - r2.top) / r2.height, 0), 1);
      stepsLine.style.setProperty("--p", p2.toFixed(3));
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", function () { observeAll(); onScroll(); });

  /* ---------------- Волна на кнопках ---------------- */
  document.addEventListener("pointerdown", function (e) {
    var btn = e.target.closest(".btn");
    if (!btn || reduceMotion) return;
    var r = btn.getBoundingClientRect(), size = Math.max(r.width, r.height);
    var dot = el("span", { "class": "ripple" });
    dot.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + (e.clientX - r.left - size / 2) + "px;top:" + (e.clientY - r.top - size / 2) + "px";
    btn.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 700);
  });

  /* ---------------- Переключатель языка ---------------- */
  $(".langs").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-lang]");
    if (!b || b.dataset.lang === lang) return;
    applyLang(b.dataset.lang);
    var title = $(".hero__title");
    title.classList.add("in");
  });

  /* ---------------- Старт ---------------- */
  buildGallery();
  applyLang(lang);
  onScroll();

  var started = false;
  function start() {
    if (started) return;
    started = true;
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    // запускаем пословную анимацию заголовка hero
    requestAnimationFrame(function () { $(".hero__title").classList.add("in"); });
  }

  var introSeen = false;
  try { introSeen = sessionStorage.getItem("kvity-intro") === "1"; sessionStorage.setItem("kvity-intro", "1"); } catch (e) { /* без хранилища — просто показываем интро */ }

  if (reduceMotion || introSeen) {
    $(".intro").style.display = "none";
    start();
  } else {
    var heroImg = $(".hero__img");
    var minDelay = new Promise(function (r) { setTimeout(r, 1500); });
    var imgReady = new Promise(function (r) { if (heroImg.complete) r(); else { heroImg.onload = r; heroImg.onerror = r; } });
    var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([minDelay, imgReady, fontsReady]).then(start);
    setTimeout(start, 3500); // страховка на медленном интернете
  }
})();
