(function () {
  "use strict";

  var cfg = window.KVITY_CONFIG;
  var I18N = window.KVITY_I18N;
  var LANGS = ["ro", "en", "ua"];
  var HTML_LANG = { ro: "ro", en: "en", ua: "uk" };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var icon = function (id) { return '<svg aria-hidden="true"><use href="#i-' + id + '"/></svg>'; };
  var tel = function (p) { return "tel:" + p.replace(/[^\d+]/g, ""); };
  // Маршрут и карточка — по точной метке студии в Google Maps
  var mapsDir = function (s) { return "https://www.google.com/maps/dir/?api=1&destination=" + s.lat + "," + s.lng + "&destination_place_id=" + s.placeId; };
  var mapsPlace = function (s) { return "https://www.google.com/maps/place/?q=place_id:" + s.placeId; };
  var pad2 = function (n) { return String(n).padStart(2, "0"); };
  var byId = {};
  cfg.gallery.forEach(function (g) { byId[g.id] = g; });
  // KV_BASE: копии сайта в подпапках (/v3/) берут фото из общей папки img/
  var file = function (id) { var g = byId[id]; return (window.KV_BASE || "") + "img/" + id + (g && g.slug ? "-" + g.slug : ""); };
  var small = function (id) { return file(id) + "-s.webp"; };
  var large = function (id) { return file(id) + ".webp"; };

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
    if (nav === "uk" || nav === "ru") return "ua"; // телефон на русском — почти всегда наши: украинский (просьба Алины)
    if (nav === "ro" || nav === "mo") return "ro";
    return "en"; // остальные языки (туристы: немцы, поляки…) — английский
  }

  function t(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, dict);
  }
  function caption(id) { return t("gallery.captions." + id) || ""; }
  // Полное описание фото для Google и экранных дикторов: подпись + кто и где
  function altText(id) {
    var g = byId[id];
    return caption(id) + " — " + t(g && g.cat === "balloons" ? "alts.balloons" : "alts.flowers");
  }

  function applyLang(next) {
    lang = next;
    dict = I18N[lang];
    store.set("kvity-lang", lang);
    document.documentElement.lang = HTML_LANG[lang];
    document.title = t("meta.title");
    $('meta[name="description"]').setAttribute("content", t("meta.description"));

    $$("[data-i18n]").forEach(function (n) { var v = t(n.dataset.i18n); if (v != null) n.textContent = v; });
    $$("[data-i18n-html]").forEach(function (n) { var v = t(n.dataset.i18nHtml); if (v != null) n.innerHTML = v; });
    $$("[data-i18n-ph]").forEach(function (n) { n.placeholder = t(n.dataset.i18nPh); });
    $$("[data-i18n-aria]").forEach(function (n) { n.setAttribute("aria-label", t(n.dataset.i18nAria)); });
    $$("[data-i18n-alt]").forEach(function (n) { n.alt = t(n.dataset.i18nAlt); });
    $$(".langs button").forEach(function (b) {
      var on = b.dataset.lang === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });

    renderCats();
    renderFilters();
    renderGallery(false);
    renderBalloonList();
    renderSteps();
    renderChips();
    renderTimes();
    renderChannels();
    renderStudios();
    renderRatings();
    renderFooter();
    updateRef();
    observeAll();
  }

  /* ---------------- Категории и фильтры ---------------- */
  var filter = "all";

  function renderCats() {
    $("#cats").innerHTML = cfg.categories.map(function (c) {
      return '<button type="button" class="cat reveal" data-cat="' + c + '">' +
        '<img src="' + small(cfg.categoryCovers[c]) + '" alt="" loading="lazy" width="640" height="853">' +
        "<span>" + esc(t("cats." + c)) + "</span></button>";
    }).join("");
  }
  $("#cats").addEventListener("click", function (e) {
    var b = e.target.closest(".cat");
    if (!b) return;
    setFilter(b.dataset.cat);
    $("#works").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  function countIn(cat) {
    return cat === "all" ? cfg.gallery.length : cfg.gallery.filter(function (g) { return g.cat === cat; }).length;
  }
  function renderFilters() {
    $("#filters").innerHTML = ["all"].concat(cfg.categories).map(function (c) {
      var on = c === filter;
      return '<button type="button" role="tab" class="filter' + (on ? " is-active" : "") + '" aria-selected="' + on + '" data-filter="' + c + '">' +
        esc(t("cats." + c)) + "<sup>" + countIn(c) + "</sup></button>";
    }).join("");
  }
  $("#filters").addEventListener("click", function (e) {
    var b = e.target.closest(".filter");
    if (b) setFilter(b.dataset.filter);
  });
  function setFilter(c) {
    if (c === filter) return;
    filter = c;
    renderFilters();
    renderGallery(true);
    var active = $(".filter.is-active");
    var bar = $("#filters");
    if (active && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: active.offsetLeft - 20, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  /* ---------------- Галерея ---------------- */
  var visible = [];
  function renderGallery(animate) {
    visible = cfg.gallery.filter(function (g) { return filter === "all" || g.cat === filter; });
    $("#gallery").innerHTML = visible.map(function (g, i) {
      var cap = caption(g.id);
      return '<figure class="work" role="button" tabindex="0" data-index="' + i + '" aria-label="' + esc(cap) + '"' +
        (animate ? ' style="--i:' + i + '"' : ' style="animation:none"') + ">" +
        '<div class="work__frame"><img src="' + small(g.id) + '" alt="' + esc(altText(g.id)) + '" loading="lazy" decoding="async" width="640" height="853"></div>' +
        "<figcaption>" + esc(cap) + "</figcaption></figure>";
    }).join("");
  }
  $("#gallery").addEventListener("click", function (e) {
    var w = e.target.closest(".work");
    if (w) openLightbox(+w.dataset.index);
  });
  $("#gallery").addEventListener("keydown", function (e) {
    var w = e.target.closest(".work");
    if (w && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openLightbox(+w.dataset.index); }
  });

  /* ---------------- Просмотр фото ---------------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbIndex = 0, lastFocus = null;
  function openLightbox(i) {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.documentElement.style.overflow = "hidden";
    showSlide(i);
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    $("#lbClose").focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    setTimeout(function () { lb.hidden = true; lbImg.classList.remove("is-loaded"); }, 380);
    if (lastFocus) lastFocus.focus();
  }
  function showSlide(i) {
    var n = visible.length;
    lbIndex = (i + n) % n;
    var g = visible[lbIndex];
    lbImg.classList.remove("is-loaded");
    lbImg.onload = function () { lbImg.classList.add("is-loaded"); };
    lbImg.src = large(g.id);
    lbImg.alt = altText(g.id);
    if (lbImg.complete && lbImg.naturalWidth) lbImg.classList.add("is-loaded");
    $("#lbCaption").textContent = caption(g.id);
    $("#lbCount").textContent = pad2(lbIndex + 1) + " / " + pad2(n);
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
    var g = visible[lbIndex];
    state.ref = g.id;
    state.what = g.cat === "balloons" ? 3 : g.cat === "baskets" ? 2 : 0;
    renderChips();
    updateRef();
    closeLightbox();
    setTimeout(function () { $("#order").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }, 250);
  });

  /* ---------------- Шары и шаги ---------------- */
  function renderBalloonList() {
    $("#balloonList").innerHTML = t("balloons.list").map(function (s) { return "<li>" + icon("check") + esc(s) + "</li>"; }).join("");
  }
  $$("[data-order-what]").forEach(function (a) {
    a.addEventListener("click", function () { state.what = +a.dataset.orderWhat; renderChips(); });
  });

  function renderSteps() {
    $("#steps").innerHTML = t("how.steps").map(function (s, i) {
      return '<li class="step reveal" style="--delay:' + i * 0.1 + 's"><span class="step__num">' + pad2(i + 1) + "</span>" +
        "<div><h3>" + esc(s.t) + "</h3><p>" + esc(s.d) + "</p></div></li>";
    }).join("");
  }

  /* ---------------- Форма ---------------- */
  var state = { what: null, occasion: null, palette: null, style: null, budget: null, method: "delivery", studio: 0, ref: null };
  var SWATCHES = [
    "linear-gradient(135deg,#F6DDD1,#EBC6D6)",
    "conic-gradient(#E0475B,#F2A33A,#D94C9C,#7A5CD6,#E0475B)",
    "linear-gradient(135deg,#6E1F33,#3E1A2B)",
    "conic-gradient(#F6DDD1,#C7D3B4,#B9C7EA,#F6E1C3,#F6DDD1)"
  ];

  function chipGroup(container, name, labels, key, opts) {
    opts = opts || {};
    container.innerHTML = labels.map(function (label, i) {
      var val = opts.values ? opts.values[i] : i;
      var checked = state[key] != null && String(state[key]) === String(val);
      var sw = opts.swatches ? '<span class="swatch" style="background:' + opts.swatches[i] + '"></span>' : "";
      return '<label class="chip' + (checked ? " is-checked" : "") + '"><input type="radio" name="' + name + '" value="' + val + '"' +
        (checked ? " checked" : "") + ">" + sw + "<span>" + esc(label) + "</span></label>";
    }).join("");
  }

  function renderChips() {
    chipGroup($("#whatChips"), "what", t("form.whats"), "what");
    chipGroup($("#occasionChips"), "occasion", t("form.occasions"), "occasion");
    chipGroup($("#paletteChips"), "palette", t("form.palettes"), "palette", { swatches: SWATCHES });
    chipGroup($("#styleChips"), "style", t("form.styles"), "style");
    var budgetLabels = cfg.budgets.map(function (b) { return b + " " + t("form.currency"); }).concat(t("form.custom"));
    chipGroup($("#budgetChips"), "budget", budgetLabels, "budget", { values: cfg.budgets.map(String).concat("custom") });
    chipGroup($("#studioChips"), "studio", cfg.studios.map(function (s) { return "KVITY " + s.name; }), "studio");
  }

  $("#orderForm").addEventListener("change", function (e) {
    var input = e.target;
    if (input.type !== "radio") return;
    state[input.name] = input.name === "budget" ? input.value : Number(input.value);
    $$('input[name="' + input.name + '"]').forEach(function (r) { r.closest(".chip").classList.toggle("is-checked", r.checked); });
    if (input.name === "budget") {
      $("#customBudget").hidden = input.value !== "custom";
      if (input.value === "custom") $("#budgetCustom").focus();
    }
  });

  // Интервалы — список Алины; morning/anytime/custom подписываются из form.slots, custom открывает поле «Бажаний час»
  var SLOTS = ["9:30–10:30", "10:30–11:30", "morning", "anytime", "custom"];
  var customTime = (function () {
    var box = document.createElement("label");
    box.className = "input";
    box.id = "customTimeBox";
    box.hidden = true;
    box.innerHTML = '<span></span><input type="text" id="timeCustom" maxlength="60">';
    $("#time").closest(".row").insertAdjacentElement("afterend", box);
    return box;
  })();
  function slotLabel(s) { return /^\d/.test(s) ? s : t("form.slots." + s); }
  function renderTimes() {
    var sel = $("#time"), prev = sel.value;
    sel.innerHTML = SLOTS.map(function (s) {
      return '<option value="' + s + '">' + esc(slotLabel(s)) + "</option>";
    }).join("");
    sel.value = prev && SLOTS.indexOf(prev) > -1 ? prev : "anytime";
    $("span", customTime).textContent = t("form.slots.customLabel");
    $("#timeCustom").placeholder = t("form.slots.customPh");
    customTime.hidden = sel.value !== "custom";
  }
  $("#time").addEventListener("change", function () {
    customTime.hidden = this.value !== "custom";
    if (!customTime.hidden) $("#timeCustom").focus();
  });

  (function initDate() {
    var d = new Date();
    var iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $("#date").min = iso;
    $("#date").value = iso;
  })();

  // Фото для натхнення (идея Алины): ссылка wa.me/t.me передаёт только текст, поэтому отмечаем галочку,
  // в заявку идёт строка «Надішлю фото-приклад», а само фото клиент прикрепляет в открывшемся чате.
  (function initInspo() {
    var fs = document.createElement("fieldset");
    fs.className = "field";
    fs.innerHTML = '<legend data-i18n="form.inspoTitle"></legend>' +
      '<div class="chips"><label class="chip" id="inspoChip"><input type="checkbox" id="inspo"><span data-i18n="form.inspo"></span></label></div>' +
      '<p class="form__note form__note--after"><small data-i18n="form.inspoNote"></small></p>';
    $("#styleChips").closest("fieldset").insertAdjacentElement("afterend", fs);
    $("#inspo").addEventListener("change", function () { $("#inspoChip").classList.toggle("is-checked", this.checked); });
    // Под кнопками: заявка — ещё не подтверждённый заказ (просьба Алины)
    var confirm = document.createElement("p");
    confirm.className = "form__hint form__confirm";
    confirm.setAttribute("data-i18n", "form.confirm");
    $(".form__hint").insertAdjacentElement("afterend", confirm);
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

  function refNumber(id) { return pad2(cfg.gallery.findIndex(function (g) { return g.id === id; }) + 1); }
  function updateRef() {
    var box = $("#refBox");
    if (state.ref == null) { box.hidden = true; return; }
    box.hidden = false;
    $("#refImg").src = small(state.ref);
    $("#refCaption").textContent = "#" + refNumber(state.ref) + " · " + caption(state.ref);
    $("#refRemove").setAttribute("aria-label", t("form.remove"));
  }
  $("#refRemove").addEventListener("click", function () { state.ref = null; updateRef(); });

  function fieldError(input, on) {
    var wrap = input.closest(".input");
    if (!wrap) return;
    var err = $(".error", wrap);
    wrap.classList.toggle("has-error", on);
    if (on && !err) { err = document.createElement("span"); err.className = "error"; wrap.appendChild(err); }
    if (err) { if (on) err.textContent = t("form.required"); else err.remove(); }
  }

  // Куда отправлять заявку (просьба Алины): румынский — только WhatsApp;
  // украинский и английский — сначала Telegram (тёмная кнопка), потом WhatsApp.
  function tgFirst() { return !!cfg.telegramOrders && lang !== "ro"; }
  function renderChannels() {
    var waBtn = $('#orderForm [data-channel="wa"]'), tgBtn = $('#orderForm [data-channel="tg"]');
    var both = tgFirst();
    tgBtn.hidden = !both;
    waBtn.parentNode.insertBefore(both ? tgBtn : waBtn, both ? waBtn : tgBtn);
    tgBtn.classList.toggle("btn--dark", both); tgBtn.classList.toggle("btn--line", !both);
    waBtn.classList.toggle("btn--dark", !both); waBtn.classList.toggle("btn--line", both);
    var hint = $(".form__hint");
    hint.setAttribute("data-i18n", both ? "form.hintBoth" : "form.hint");
    hint.textContent = t(both ? "form.hintBoth" : "form.hint");
  }
  var channel = "wa";
  $$("#orderForm [data-channel]").forEach(function (b) {
    b.addEventListener("click", function () { channel = b.dataset.channel; });
  });

  $("#orderForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (e.submitter && e.submitter.dataset.channel) channel = e.submitter.dataset.channel;
    var required = [$("#name"), $("#phone"), $("#date")];
    if (state.method === "delivery") required.push($("#address"));
    var firstBad = null;
    required.forEach(function (inp) {
      var bad = !inp.value.trim();
      fieldError(inp, bad);
      if (bad && !firstBad) firstBad = inp;
    });
    if (firstBad) {
      firstBad.focus({ preventScroll: true });
      firstBad.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      return;
    }
    var text = buildMessage();
    var url;
    if (channel === "tg" && cfg.telegramOrders) {
      // t.me/<ник>?text= открывает чат с готовым текстом; на всякий случай кладём текст и в буфер обмена
      url = "https://t.me/" + cfg.telegramOrders + "?text=" + encodeURIComponent(text);
      try { if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {}); } catch (err) { /* без буфера тоже работает */ }
      toast(t("form.sentTg"));
    } else {
      url = "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text);
      toast(t("form.sent"));
    }
    if ($("#inspo").checked) toast(t("form.sentPhoto"));
    channel = "wa";
    var win = window.open(url, "_blank", "noopener");
    if (!win) location.href = url;
  });
  $("#orderForm").addEventListener("input", function (e) {
    if (e.target.closest(".has-error") && e.target.value.trim()) fieldError(e.target, false);
  });

  function buildMessage() {
    var m = function (k) { return t("msg." + k); };
    var lines = [m("hello"), ""];
    if (state.what != null) lines.push("• " + m("what") + ": " + t("form.whats")[state.what]);
    if (state.occasion != null) lines.push("• " + m("occasion") + ": " + t("form.occasions")[state.occasion]);
    if (state.palette != null) lines.push("• " + m("palette") + ": " + t("form.palettes")[state.palette]);
    if (state.style != null) lines.push("• " + m("style") + ": " + t("form.styles")[state.style]);
    if (state.budget != null) {
      var b = state.budget === "custom" ? ($("#budgetCustom").value.trim() || "—") : state.budget;
      lines.push("• " + m("budget") + ": " + b + " " + t("form.currency"));
    }
    var time = $("#time").value;
    var timeText = time === "custom" ? ($("#timeCustom").value.trim() || slotLabel("custom")) : slotLabel(time);
    lines.push("• " + m("date") + ": " + $("#date").value.split("-").reverse().join(".") + ", " + timeText);
    if (state.method === "delivery") lines.push("• " + m("delivery") + ": " + $("#address").value.trim());
    else lines.push("• " + m("pickup") + ": KVITY " + cfg.studios[state.studio || 0].name);
    var card = $("#card").value.trim();
    if (card) lines.push("• " + m("card") + ": «" + card + "»");
    if ($("#inspo").checked) lines.push("• " + m("inspo"));
    if (state.ref != null) {
      lines.push("• " + m("example") + ": #" + refNumber(state.ref) + " " + caption(state.ref) + " — " + new URL(large(state.ref), location.href).href);
    }
    lines.push("", m("name") + ": " + $("#name").value.trim(), m("phone") + ": " + $("#phone").value.trim(), "", m("thanks"));
    return lines.join("\n");
  }

  /* ---------------- Студии и рейтинги ---------------- */
  var mapIO = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      loadMap(en.target);
      mapIO.unobserve(en.target);
    });
  }, { rootMargin: "400px 0px" }) : null;

  function loadMap(box) {
    if (box.querySelector("iframe")) return;
    var st = cfg.studios[+box.dataset.i];
    var f = document.createElement("iframe");
    f.title = "KVITY " + st.name;
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = "https://maps.google.com/maps?q=" + st.lat + "," + st.lng + "&z=16&hl=" + HTML_LANG[lang] + "&output=embed";
    f.onload = function () { box.classList.add("is-loaded"); };
    box.appendChild(f);
  }

  function renderStudios() {
    $("#studiosGrid").innerHTML = cfg.studios.map(function (s, i) {
      return '<article class="studio reveal" style="--delay:' + i * 0.12 + 's" data-id="' + s.id + '">' +
        '<div class="studio__body"><h3>' + esc(s.name) + "</h3>" +
        '<p class="studio__line">' + icon("pin") + "<span>" + esc(s.address) + "</span></p>" +
        '<p class="studio__line">' + icon("clock") + "<span>" + esc(t("studios.daily")) + ", " + s.hours + "</span></p>" +
        '<div class="studio__actions">' +
          '<a class="btn btn--dark" target="_blank" rel="noopener" href="' + mapsDir(s) + '">' + icon("route") + "<span>" + esc(t("studios.route")) + "</span></a>" +
          '<a class="btn btn--line" href="' + tel(s.phone) + '">' + icon("phone") + "<span>" + esc(t("studios.call")) + "</span></a>" +
        "</div></div>" +
        '<div class="map" data-i="' + i + '">' + icon("pin") + "</div>" +
        "</article>";
    }).join("");
    $$(".map", $("#studiosGrid")).forEach(function (box) {
      if (mapIO) mapIO.observe(box); else loadMap(box);
    });
  }

  function stars(r) {
    var out = "";
    for (var i = 1; i <= 5; i++) out += '<svg aria-hidden="true"' + (r >= i - 0.25 ? "" : ' class="is-off"') + '><use href="#i-star"/></svg>';
    return out;
  }
  function studioById(id) { return cfg.studios.filter(function (s) { return s.id === id; })[0]; }

  function renderRatings() {
    $("#ratings").innerHTML = cfg.studios.map(function (s, i) {
      return '<a class="rating reveal" style="--delay:' + i * 0.12 + 's" href="' + mapsPlace(s) + '" target="_blank" rel="noopener">' +
        '<span class="rating__num">' + s.rating.toFixed(1) + "</span>" +
        '<div><div class="rating__stars">' + stars(s.rating) + "</div>" +
        "<strong>KVITY " + esc(s.name) + "</strong><small>" + s.reviews + " " + esc(t("studios.reviews")) + "</small></div></a>";
    }).join("");
    $("#reviewsTrack").innerHTML = cfg.reviews.map(function (r, i) {
      var st = studioById(r.studio);
      return '<figure class="review reveal" style="--delay:' + (i % 3) * 0.1 + 's">' +
        '<div class="rating__stars">' + stars(5) + "</div>" +
        "<blockquote>" + esc(r.text) + "</blockquote>" +
        "<figcaption><strong>" + esc(r.name) + "</strong><span>Google · " + esc(st ? st.name : "") + "</span></figcaption></figure>";
    }).join("");
    $("#readReviews").href = mapsPlace(cfg.studios[1]);
  }

  /* ---------------- Подвал ---------------- */
  function renderFooter() {
    var wa = "https://wa.me/" + cfg.whatsapp;
    $("#footerContacts").innerHTML =
      '<li><a href="' + tel(cfg.phone) + '">' + icon("phone") + esc(cfg.phone) + "</a></li>" +
      '<li><a href="' + wa + '" target="_blank" rel="noopener">' + icon("chat") + "WhatsApp</a></li>" +
      '<li><a href="' + cfg.telegram + '" target="_blank" rel="noopener">' + icon("send") + "Telegram</a></li>" +
      cfg.studios.map(function (s) {
        return '<li><a href="' + mapsPlace(s) + '" target="_blank" rel="noopener">' + icon("pin") + esc(s.name) + "</a></li>";
      }).join("");
    $("#socials").innerHTML =
      '<a href="' + cfg.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + icon("insta") + "</a>" +
      '<a href="' + cfg.telegram + '" target="_blank" rel="noopener" aria-label="Telegram">' + icon("send") + "</a>" +
      '<a href="' + wa + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon("chat") + "</a>";
    $("#legal").innerHTML =
      "<li>" + esc(cfg.legal.company) + "</li>" +
      "<li>C.U.I.: " + esc(cfg.legal.cui) + "</li>" +
      (cfg.legal.email ? '<li><a href="mailto:' + cfg.legal.email + '">' + esc(cfg.legal.email) + "</a></li>" : "") +
      '<li><a href="#">' + esc(t("footer.privacy")) + "</a></li>" +
      '<li><a href="#">' + esc(t("footer.terms")) + "</a></li>" +
      '<li><a href="https://anpc.ro/" target="_blank" rel="noopener">ANPC</a> · ' +
      '<a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener">' + esc(t("footer.sal")) + "</a></li>" +
      '<li class="footer__note">' + esc(t("footer.cookies")) + "</li>";
    $$(".js-call").forEach(function (a) { a.href = tel(cfg.phone); });
    // Кнопка чата внизу экрана: на румынском WhatsApp, на украинском и английском Telegram менеджера
    var tgChat = tgFirst();
    $$(".js-wa").forEach(function (a) {
      a.href = tgChat ? "https://t.me/" + cfg.telegramOrders : wa;
      a.setAttribute("aria-label", tgChat ? "Telegram" : "WhatsApp");
      var use = $("use", a);
      if (use) use.setAttribute("href", tgChat ? "#i-send" : "#i-chat");
    });
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

  /* ---------------- Мягкое появление ---------------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }) : null;

  function observeAll() {
    $$(".reveal:not(.in), .reveal-img:not(.in)").forEach(function (n) {
      if (io) io.observe(n); else n.classList.add("in");
    });
  }

  /* ---------------- Шапка и липкая панель ---------------- */
  var header = $(".header"), sticky = $("#sticky"), hero = $(".hero"), orderSec = $("#order"), ticking = false;
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    header.classList.toggle("is-solid", y > 40);
    var r = orderSec.getBoundingClientRect();
    var formVisible = r.top < vh * 0.85 && r.bottom > vh * 0.15;
    sticky.classList.toggle("is-visible", y > hero.offsetHeight * 0.7 && !formVisible);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  $(".langs").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-lang]");
    if (b && b.dataset.lang !== lang) applyLang(b.dataset.lang);
  });

  /* ---------------- Старт ---------------- */
  applyLang(lang);
  onScroll();
})();
