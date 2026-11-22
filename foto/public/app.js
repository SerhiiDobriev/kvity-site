/*
 * KVITY — конструктор фото. Внутри — настоящий сайт (та же страница, что на kvity.tutormate.site),
 * её фото перетаскиваются прямо на картинки сайта, подписи под букетами правятся на месте.
 * Живой сайт не меняется: раскладка хранится на сервере конструктора, «Готово» отдаёт её Сергею.
 */
(function () {
  "use strict";

  var q = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var CATS = [["bouquets", "Збірні букети"], ["mono", "Моно букети"], ["xl", "Size XL+"], ["baskets", "Кошики"], ["wedding", "Весілля"], ["balloons", "Кулі"], ["christmas", "Різдвяна колекція"]];
  var CAT_NAME = {}; CATS.forEach(function (c) { CAT_NAME[c[0]] = c[1]; });
  // Постоянные фото сайта: место → [селектор, название, размер файла]
  var FIXED = {
    hero: [".hero__media img", "Перший екран", ""],
    balloonsMain: [".balloons__img--main img", "Кулі: велике фото", "-s"],
    balloonsSide: [".balloons__img--side img", "Кулі: мале фото", "-s"],
    about: [".about__media img", "Про нас", ""],
    order: [".order__visual img", "Біля форми замовлення", ""],
    cta: [".cta__bg img", "Фон унизу сторінки", ""]
  };

  var S = { version: 0, photos: [], layout: { single: {}, gallery: [] }, done: null };
  var mode = "edit";      // edit | preview
  var gFilter = "all";    // фильтр галереи в режиме правки
  var sel = null;         // выбранное касанием фото из полоски: pid
  var uploading = [];
  var onlyFree = false;
  var frame = q("#frame"), D = null, W = null;

  /* ================= Сервер ================= */
  function api(path, opt) {
    opt = opt || {};
    return fetch("api/" + path, Object.assign({ credentials: "same-origin" }, opt)).then(function (r) {
      if (r.status === 403) { showLogin(); throw new Error("login"); }
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    });
  }
  var saveTimer = null, saving = false, dirty = false;
  function scheduleSave() { dirty = true; status("Зберігаю…"); clearTimeout(saveTimer); saveTimer = setTimeout(save, 700); }
  function save() {
    if (saving) { saveTimer = setTimeout(save, 400); return; }
    saving = true; dirty = false;
    api("state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ layout: S.layout }) })
      .then(function (r) { S.version = r.version; if (!dirty) status("Збережено"); })
      .catch(function () { status("Не збереглося — перевірте інтернет"); dirty = true; saveTimer = setTimeout(save, 4000); })
      .then(function () { saving = false; });
  }
  function setState(st) {
    S = st;
    S.layout = S.layout || {};
    S.layout.single = S.layout.single || {};
    if (!Array.isArray(S.layout.gallery)) S.layout.gallery = [];
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible" || dirty || saving || drag || uploading.length) return;
    if (D && D.activeElement && D.activeElement.classList && D.activeElement.classList.contains("kve-cap")) return;
    api("state").then(function (st) { if (st.version > S.version) { setState(st); renderAll(); } }).catch(function () {});
  });

  /* ================= Мелочи ================= */
  function status(t, ok) { var el = q("#status"); el.textContent = t; el.classList.toggle("is-done", !!ok); }
  var toastT;
  function toast(t) { var el = q("#toast"); el.textContent = t; el.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove("is-on"); }, 2600); }
  function when(iso) {
    var d = new Date(iso), p = function (x) { return String(x).padStart(2, "0"); };
    return p(d.getDate()) + "." + p(d.getMonth() + 1) + " о " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  var small = function (pid) { return "/foto/img/" + pid + "-s.jpg"; };
  var big = function (pid) { return "/foto/img/" + pid + ".jpg"; };
  function ph(line1, line2) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#EFE7E2"/>' +
      '<rect x="8" y="8" width="284" height="384" fill="none" stroke="#D9B8AA" stroke-width="3" stroke-dasharray="10 8"/>' +
      '<text x="150" y="190" font-family="Jost,sans-serif" font-size="19" font-weight="600" fill="#A3685A" text-anchor="middle">' + esc(line1) + "</text>" +
      (line2 ? '<text x="150" y="220" font-family="Jost,sans-serif" font-size="15" fill="#8a7b75" text-anchor="middle">' + esc(line2) + "</text>" : "") + "</svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  var PH_EMPTY = ph("тут буде фото");
  function uses(pid) {
    var n = 0, L = S.layout;
    Object.keys(L.single).forEach(function (k) { if (L.single[k] === pid) n++; });
    L.gallery.forEach(function (g) { if (g.p === pid) n++; });
    return n;
  }

  /* ================= Сайт внутри ================= */
  var siteHtml = null;
  function loadSite() {
    var keepY = W ? W.scrollY : 0;
    (siteHtml ? Promise.resolve(siteHtml) : fetch("/", { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (t) { siteHtml = t; return t; }))
      .then(function (html) {
        frame.onload = function () { onSiteLoad(keepY); };
        frame.srcdoc = buildDoc(html);
      }).catch(function () { toast("Не вдалося відкрити сайт"); });
  }
  function buildDoc(html) {
    var L = S.layout, d = { mode: mode, fixed: {}, PH: PH_EMPTY };
    if (mode === "preview") {
      d.gallery = L.gallery.map(function (g, i) { return { id: "c" + i, slug: g.p || "", cat: g.cat }; });
      d.caps = {}; L.gallery.forEach(function (g, i) { d.caps["c" + i] = g.cap || ""; });
      d.covers = {};
      CATS.forEach(function (c) {
        var first = L.gallery.filter(function (g) { return g.cat === c[0] && g.p; })[0];
        d.covers[c[0]] = L.single["cover-" + c[0]] || (first && first.p) || "none";
      });
      Object.keys(FIXED).forEach(function (k) { d.fixed[k] = L.single[k] ? "/foto/img/" + L.single[k] + FIXED[k][2] + ".jpg" : PH_EMPTY; });
    }
    // Перед main.js: её галерея и обложки вместо нынешних
    var over = "(function(){var D=" + JSON.stringify(d) + ",F=" + JSON.stringify(FIXED) + ",c=window.KVITY_CONFIG,I=window.KVITY_I18N;" +
      "if(D.mode==='preview'){c.gallery=D.gallery;c.categoryCovers=D.covers;" +
      "Object.keys(I).forEach(function(l){I[l].gallery=I[l].gallery||{};I[l].gallery.captions=Object.assign({},I[l].gallery.captions,D.caps);});}" +
      "else{c.gallery=[];c.categoryCovers={};c.categories.forEach(function(k){c.categoryCovers[k]='none';});}" +
      "Object.keys(F).forEach(function(k){var el=document.querySelector(F[k][0]);if(!el)return;el.removeAttribute('srcset');el.removeAttribute('loading');" +
      "el.src=D.fixed[k]||D.PH;});})();";
    var blob = URL.createObjectURL(new Blob([over], { type: "text/javascript" }));
    var head = '<base href="' + location.origin + '/"><script>window.KV_BASE="/foto/";' + (mode === "edit" ? "window.KV_ALL_CATS=1;" : "") +
      // язык — украинский, и выбор языка здесь не сохраняется на её настоящем сайте
      'try{var gi=Storage.prototype.getItem,si=Storage.prototype.setItem;Storage.prototype.getItem=function(k){return k==="kvity-lang"?"ua":gi.apply(this,arguments)};' +
      'Storage.prototype.setItem=function(k){if(k!=="kvity-lang")return si.apply(this,arguments)}}catch(e){}' +
      'document.addEventListener("error",function(e){var t=e.target;if(t.tagName==="IMG"&&!t.dataset.ph&&/\\/foto\\/img\\//.test(t.src)){t.dataset.ph=1;t.removeAttribute("srcset");t.src=' + JSON.stringify(PH_EMPTY) + ';}},true);<\/script>' +
      (mode === "edit" ? "<style>" + EDIT_CSS + "</style>" : "");
    return html.replace(/<head>/i, "<head>" + head)
      .replace(/<link rel="preload" as="image"[^>]*>/i, "")
      .replace(/(<script src="js\/main\.js)/, '<script src="' + blob + '" defer><\/script>$1');
  }
  var EDIT_CSS = [
    ".work{animation:none!important;cursor:default}",
    "#sticky{display:none!important}",
    ".kve-card{position:relative}",
    ".kve-card .work__frame{cursor:grab;touch-action:pan-x pan-y;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}",
    ".kve-card img,[data-kve-slot]{-webkit-user-drag:none;-webkit-touch-callout:none}",
    ".kve-card:hover .work__frame img{transform:none}",
    ".kve-x{position:absolute;top:6px;right:6px;z-index:3;width:28px;height:28px;border:0;border-radius:50%;background:rgba(255,255,255,.94);font-size:18px;line-height:28px;padding:0;color:#1F1C1B;box-shadow:0 1px 4px rgba(0,0,0,.25);cursor:pointer}",
    ".kve-cat{position:absolute;top:6px;left:6px;z-index:3;max-width:calc(100% - 46px);font:500 12px/1 Jost,sans-serif;padding:6px 4px;border:0;border-radius:999px;background:rgba(255,255,255,.94);color:#1F1C1B;box-shadow:0 1px 4px rgba(0,0,0,.2)}",
    ".kve-cap{display:block;min-height:1.4em;outline:none;border-bottom:1px dashed rgba(31,28,27,.3);cursor:text;-webkit-user-select:text;user-select:text;color:#1F1C1B!important}",
    ".kve-cap:empty::before{content:'Додайте підпис…';color:#b9aca6}",
    ".kve-cap:focus{border-bottom:1.5px solid #A3685A;background:#fff}",
    ".kve-add .work__frame{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:2px dashed #E3C3B5;background:#fff;color:#A3685A;text-align:center;font-size:.85rem;padding:12px;line-height:1.3}",
    ".kve-add .work__frame b{font-size:2rem;font-weight:300;line-height:1}",
    ".kve-dragging{opacity:.35}",
    ".kve-hit{outline:4px solid #A3685A!important;outline-offset:-4px}",
    ".kve-card.kve-hit,.kve-add.kve-hit{outline-offset:3px}",
    "body.kve-picking [data-kve-slot],body.kve-picking .kve-card .work__frame,body.kve-picking .kve-add .work__frame{outline:2px dashed #A3685A;outline-offset:-2px}"
  ].join("");

  function onSiteLoad(keepY) {
    D = frame.contentDocument; W = frame.contentWindow;
    if (!D) return;
    if (keepY) W.scrollTo(0, keepY);
    if (mode !== "edit") return;
    D.body.classList.toggle("kve-picking", !!sel);
    renderSite();
    D.addEventListener("click", onSiteClick, true);
    D.addEventListener("keydown", onSiteKey, true);
    D.addEventListener("input", onSiteInput, true);
    D.addEventListener("change", onSiteChange, true);
    D.addEventListener("focusout", function (e) { if (e.target.classList && e.target.classList.contains("kve-cap")) e.target.textContent = e.target.textContent.trim(); }, true);
    D.addEventListener("pointerdown", function (e) { onDown(e, true); });
    D.addEventListener("pointermove", function (e) { onMove(e, true); });
    D.addEventListener("pointerup", function (e) { onUp(e, true); });
    D.addEventListener("pointercancel", function (e) { onCancel(e); });
    D.addEventListener("touchmove", function (e) { if (drag && drag.started) e.preventDefault(); }, { passive: false });
    D.addEventListener("contextmenu", function (e) { if (e.target.closest(".kve-card, [data-kve-slot]")) e.preventDefault(); });
    D.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  // Картинки сайта: постоянные места и обложки категорий
  function renderSite() {
    if (!D || mode !== "edit") return;
    var L = S.layout;
    Object.keys(FIXED).forEach(function (k) {
      var img = q(FIXED[k][0], D); if (!img) return;
      img.dataset.kveSlot = k;
      var pid = L.single[k];
      var src = pid ? "/foto/img/" + pid + FIXED[k][2] + ".jpg" : ph(FIXED[k][1], "перетягніть фото сюди");
      if (img.getAttribute("src") !== src) { img.removeAttribute("srcset"); img.dataset.ph = ""; img.src = src; }
    });
    Array.prototype.forEach.call(D.querySelectorAll(".cat[data-cat]"), function (b) {
      var img = q("img", b); if (!img) return;
      var k = "cover-" + b.dataset.cat, pid = L.single[k];
      img.dataset.kveSlot = k;
      var src = pid ? small(pid) : ph("Обкладинка", "«" + (CAT_NAME[b.dataset.cat] || "") + "»");
      if (img.getAttribute("src") !== src) { img.dataset.ph = ""; img.src = src; }
    });
    renderFilters(); renderGallery();
  }
  function catLabel(c) {
    var I = W.KVITY_I18N && W.KVITY_I18N.ua;
    return (I && I.cats && I.cats[c]) || CAT_NAME[c] || c;
  }
  function renderFilters() {
    var box = q("#filters", D); if (!box) return;
    var G = S.layout.gallery;
    box.innerHTML = ["all"].concat(CATS.map(function (c) { return c[0]; })).map(function (c) {
      var n = c === "all" ? G.length : G.filter(function (g) { return g.cat === c; }).length;
      return '<button type="button" role="tab" class="filter' + (c === gFilter ? " is-active" : "") + '" data-filter="' + c + '">' +
        esc(catLabel(c)) + "<sup>" + n + "</sup></button>";
    }).join("");
  }
  function renderGallery() {
    var box = q("#gallery", D); if (!box) return;
    var html = "";
    S.layout.gallery.forEach(function (g, i) {
      if (gFilter !== "all" && g.cat !== gFilter) return;
      html += '<figure class="work kve-card" data-i="' + i + '"><div class="work__frame"><img src="' + (g.p ? small(g.p) : ph("немає фото", "перетягніть сюди")) +
        '" alt="" draggable="false"></div>' +
        '<select class="kve-cat" aria-label="Категорія">' + CATS.map(function (c) {
          return '<option value="' + c[0] + '"' + (c[0] === g.cat ? " selected" : "") + ">" + esc(catLabel(c[0])) + "</option>";
        }).join("") + "</select>" +
        '<button type="button" class="kve-x" aria-label="Прибрати">×</button>' +
        '<figcaption class="kve-cap" spellcheck="false">' + esc(g.cap || "") + "</figcaption></figure>";
    });
    html += '<figure class="work kve-add"><div class="work__frame"><b>+</b>Перетягніть сюди фото,<br>щоб додати ' +
      (gFilter === "all" ? "роботу" : "в «" + esc(catLabel(gFilter)) + "»") + "</div></figure>";
    box.innerHTML = html;
    Array.prototype.forEach.call(box.querySelectorAll(".kve-cap"), function (el) {
      try { el.contentEditable = "plaintext-only"; } catch (e) { el.contentEditable = "true"; }
      if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
    });
  }

  // Что под точкой (координаты конструктора)
  function hitAt(x, y) {
    var tr = q("#tray").getBoundingClientRect();
    if (y >= tr.top && x >= tr.left && x <= tr.right) return { pool: true };
    if (!D || mode !== "edit") return null;
    var fr = frame.getBoundingClientRect();
    if (x < fr.left || x > fr.right || y < fr.top || y > fr.bottom) return null;
    return hitLocal(x - fr.left, y - fr.top);
  }
  function hitLocal(lx, ly) {
    var el = D.elementFromPoint(lx, ly);
    if (el) {
      var card = el.closest(".kve-card");
      if (card) return { card: +card.dataset.i, el: card };
      var add = el.closest(".kve-add");
      if (add) return { add: true, el: add };
      var cat = el.closest(".cat[data-cat]");
      if (cat) return { slot: "cover-" + cat.dataset.cat, el: q("img", cat) };
    }
    // постоянные фото часто накрыты текстом — ищем по рамке картинки
    var keys = Object.keys(FIXED);
    for (var i = 0; i < keys.length; i++) {
      var img = q(FIXED[keys[i]][0], D); if (!img) continue;
      var r = (img.parentElement || img).getBoundingClientRect();
      if (lx >= r.left && lx <= r.right && ly >= r.top && ly <= r.bottom) return { slot: keys[i], el: img };
    }
    return null;
  }

  /* ================= Действия ================= */
  function place(src, to) {
    var L = S.layout, G = L.gallery;
    if (!to || to.pool) return false;
    if (src.pid != null && src.card == null) { // фото из полоски
      if (to.slot) L.single[to.slot] = src.pid;
      else if (to.card != null) G[to.card].p = src.pid;
      else if (to.add) G.push({ p: src.pid, cat: gFilter === "all" ? "bouquets" : gFilter, cap: "" });
    } else if (src.card != null) {               // карточка галереи
      var item = G[src.card];
      if (to.card != null) { if (to.card === src.card) return false; G.splice(src.card, 1); G.splice(to.card, 0, item); }
      else if (to.add) { G.splice(src.card, 1); G.push(item); }
      else if (to.slot && item.p) L.single[to.slot] = item.p;
      else return false;
    }
    scheduleSave(); renderSite(); renderPool();
    return true;
  }
  function removeCard(i) {
    var g = S.layout.gallery[i];
    if ((g.cap || g.p) && !confirm("Прибрати цю роботу з галереї?" + (g.cap ? "\nПідпис теж зникне." : ""))) return;
    S.layout.gallery.splice(i, 1);
    scheduleSave(); renderSite(); renderPool();
  }
  function removePhoto(pid) {
    if (!confirm("Видалити це фото зовсім? Воно зникне з усіх місць на сайті.")) return;
    api("photos/" + pid, { method: "DELETE" }).then(function (st) { setState(st); renderAll(); toast("Фото видалено"); })
      .catch(function () { toast("Не вдалося видалити"); });
  }

  /* ================= Касания на сайте ================= */
  function onSiteClick(e) {
    var t = e.target;
    if (t.closest(".kve-cap, .kve-cat")) { e.stopPropagation(); return; }
    if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopPropagation(); return; }
    var x = t.closest(".kve-x");
    if (x) { e.preventDefault(); e.stopPropagation(); removeCard(+x.closest(".kve-card").dataset.i); return; }
    if (t.closest(".langs")) { e.preventDefault(); e.stopPropagation(); toast("Мову можна перемкнути в «Переглянути»"); return; }
    var f = t.closest("#filters .filter");
    if (f) { e.preventDefault(); e.stopPropagation(); gFilter = f.dataset.filter; renderFilters(); renderGallery(); return; }
    var hit = hitLocal(e.clientX, e.clientY);
    var ctrl = t.closest("a, button, input, select, textarea, label");
    if (hit && (!ctrl || ctrl.closest(".cat") || !hit.slot || (hit.slot !== "cta" && hit.slot !== "hero"))) {
      e.preventDefault(); e.stopPropagation();
      tapSite(hit, e);
      return;
    }
    if (t.closest("#gallery, #cats")) { e.preventDefault(); e.stopPropagation(); }
  }
  function tapSite(hit, e) {
    if (sel) {
      var pid = sel; setSel(null);
      place({ pid: pid }, hit);
      return;
    }
    if (hit.slot && S.layout.single[hit.slot]) {
      var fr = frame.getBoundingClientRect();
      openMenu(fr.left + e.clientX, fr.top + e.clientY, hit.slot);
    } else if (hit.add || hit.slot) toast("Перетягніть сюди фото знизу — або торкніться фото, а потім цього місця");
  }
  function onSiteKey(e) {
    var t = e.target;
    if (t.classList && t.classList.contains("kve-cap")) {
      e.stopPropagation();
      if (e.key === "Enter") { e.preventDefault(); t.blur(); }
    }
  }
  function onSiteInput(e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains("kve-cap")) return;
    var i = +t.closest(".kve-card").dataset.i;
    S.layout.gallery[i].cap = t.textContent.replace(/\s+/g, " ").trim().slice(0, 300);
    scheduleSave();
  }
  function onSiteChange(e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains("kve-cat")) return;
    e.stopPropagation();
    S.layout.gallery[+t.closest(".kve-card").dataset.i].cat = t.value;
    scheduleSave(); renderFilters();
    if (gFilter !== "all") { renderGallery(); toast("Перенесено в «" + catLabel(t.value) + "»"); }
  }
  var menuSlot = null;
  function openMenu(x, y, slot) {
    menuSlot = slot;
    var m = q("#menu"); m.hidden = false;
    var w = m.offsetWidth, h = m.offsetHeight;
    m.style.left = Math.max(8, Math.min(innerWidth - w - 8, x - w / 2)) + "px";
    m.style.top = Math.max(8, Math.min(innerHeight - h - 8, y + 10)) + "px";
  }
  q("#menuRemove").addEventListener("click", function () {
    q("#menu").hidden = true;
    if (menuSlot) { delete S.layout.single[menuSlot]; scheduleSave(); renderSite(); renderPool(); }
  });
  q("#menuCancel").addEventListener("click", function () { q("#menu").hidden = true; });

  /* ================= Полоска с фото ================= */
  function tile(pid) {
    var n = uses(pid);
    if (onlyFree && n) return "";
    return '<div class="tile' + (sel === pid ? " is-selected" : "") + '" data-pid="' + pid + '"><img src="' + small(pid) + '" alt="" loading="lazy" draggable="false">' +
      (n ? '<span class="tile__badge">' + (n > 1 ? "✓" + n : "✓") + "</span>" : "") +
      '<button type="button" class="tile__x" aria-label="Видалити фото">×</button></div>';
  }
  function renderPool() {
    q("#count").textContent = S.photos.length ? "· " + S.photos.length : "";
    var html = uploading.map(function (u) {
      return '<div class="tile tile--loading' + (u.error ? " tile--error" : "") + '" data-msg="' + esc(u.msg) + '"><img src="' + u.url + '" alt=""></div>';
    }).join("") + S.photos.slice().reverse().map(function (p) { return tile(p.id); }).join("");
    if (!S.photos.length && !uploading.length) html = '<label class="tray__empty" for="files">Натисніть, щоб додати фото<br>(можна вибрати багато одразу)</label>';
    else if (!html) html = '<div class="tray__empty">Усі фото вже на сайті</div>';
    q("#pool").innerHTML = html;
  }
  function renderAll() { renderSite(); renderPool(); renderDone(); }
  function renderDone() { if (S.done && S.done.version === S.version) status("Надіслано " + when(S.done.at), true); }

  function setSel(pid) {
    sel = pid;
    q("#hint").hidden = !sel;
    if (D && D.body) D.body.classList.toggle("kve-picking", !!sel);
    renderPool();
  }
  q("#hintCancel").addEventListener("click", function () { setSel(null); });
  q("#pool").addEventListener("click", function (e) {
    if (suppressClick) { suppressClick = false; return; }
    var x = e.target.closest(".tile__x");
    if (x) { removePhoto(x.closest(".tile").dataset.pid); return; }
    var t = e.target.closest(".tile[data-pid]");
    if (t) setSel(sel === t.dataset.pid ? null : t.dataset.pid);
  });
  q("#onlyFree").addEventListener("change", function () { onlyFree = this.checked; renderPool(); });

  /* ================= Перетаскивание ================= */
  // Мышь — сразу; палец — после короткого удержания (иначе это прокрутка).
  // Источники: фото из полоски (pid) или карточка галереи на сайте (card).
  var drag = null, suppressClick = false;
  function pt(e, fromSite) {
    if (!fromSite) return { x: e.clientX, y: e.clientY };
    var fr = frame.getBoundingClientRect();
    return { x: e.clientX + fr.left, y: e.clientY + fr.top };
  }
  function onDown(e, fromSite) {
    suppressClick = false;
    if (e.button > 0 || drag || mode !== "edit") return;
    var src, el;
    if (fromSite) {
      if (e.target.closest(".kve-x, .kve-cat, .kve-cap")) return;
      var card = e.target.closest(".kve-card");
      if (!card || !e.target.closest(".work__frame")) return;
      src = { card: +card.dataset.i, pid: S.layout.gallery[+card.dataset.i].p }; el = card;
    } else {
      var t = e.target.closest("#pool .tile[data-pid]");
      if (!t || e.target.closest(".tile__x")) return;
      src = { pid: t.dataset.pid }; el = t;
    }
    var p = pt(e, fromSite);
    drag = { src: src, el: el, x0: p.x, y0: p.y, x: p.x, y: p.y, touch: e.pointerType !== "mouse", started: false, id: e.pointerId };
    if (drag.touch) drag.timer = setTimeout(startDrag, 330);
  }
  function onMove(e, fromSite) {
    if (!drag || e.pointerId !== drag.id) return;
    var p = pt(e, fromSite);
    drag.x = p.x; drag.y = p.y;
    if (!drag.started) {
      var moved = Math.abs(drag.x - drag.x0) + Math.abs(drag.y - drag.y0);
      if (drag.touch && moved > 10) { clearTimeout(drag.timer); drag = null; }
      else if (!drag.touch && moved > 6) startDrag();
      return;
    }
    if (e.cancelable) e.preventDefault();
    moveGhost(); findTarget();
  }
  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    clearTimeout(drag.timer);
    var d = drag; drag = null;
    if (d.started) endDrag(d, true);
  }
  function onCancel(e) {
    if (!drag || e.pointerId !== drag.id) return;
    clearTimeout(drag.timer);
    var d = drag; drag = null;
    if (d.started) endDrag(d, false);
  }
  document.addEventListener("pointerdown", function (e) { onDown(e, false); });
  document.addEventListener("pointermove", function (e) { onMove(e, false); });
  document.addEventListener("pointerup", function (e) { onUp(e, false); });
  document.addEventListener("pointercancel", onCancel);
  document.addEventListener("touchmove", function (e) { if (drag && drag.started) e.preventDefault(); }, { passive: false });
  document.addEventListener("contextmenu", function (e) { if (e.target.closest(".tile")) e.preventDefault(); });

  function startDrag() {
    if (!drag) return;
    if (drag.src.card != null && !drag.src.pid && !drag.touch) { /* пустую карточку тоже можно двигать */ }
    drag.started = true;
    if (navigator.vibrate) try { navigator.vibrate(15); } catch (e) { /* нет */ }
    var g = document.createElement("div");
    g.className = "ghost";
    g.innerHTML = drag.src.pid ? '<img src="' + small(drag.src.pid) + '" alt="">' : "";
    document.body.appendChild(g);
    drag.ghost = g;
    drag.el.classList.add(drag.src.card != null ? "kve-dragging" : "is-dragging");
    document.body.classList.add("dragging");
    if (sel) setSel(null);
    q("#menu").hidden = true;
    moveGhost(); findTarget(); autoScroll();
  }
  function moveGhost() { drag.ghost.style.left = drag.x + "px"; drag.ghost.style.top = drag.y + "px"; }
  function clearHits() {
    if (D) Array.prototype.forEach.call(D.querySelectorAll(".kve-hit"), function (el) { el.classList.remove("kve-hit"); });
    q("#tray").classList.remove("is-target");
  }
  function findTarget() {
    clearHits();
    var h = hitAt(drag.x, drag.y);
    if (h && h.pool) { h = null; }
    if (h && drag.src.card != null && h.card === drag.src.card) h = null;
    drag.to = h;
    if (h && h.el) h.el.classList.add("kve-hit");
  }
  function autoScroll() {
    if (!drag || !drag.started) return;
    if (W && mode === "edit") {
      var fr = frame.getBoundingClientRect(), sp = 0;
      if (drag.x >= fr.left && drag.x <= fr.right) {
        if (drag.y < fr.top + 80 && drag.y > fr.top - 40) sp = -Math.ceil((fr.top + 80 - drag.y) / 5);
        else if (drag.y > fr.bottom - 80 && drag.y < fr.bottom + 10) sp = Math.ceil((drag.y - fr.bottom + 80) / 5);
      }
      if (sp) { W.scrollBy(0, sp); findTarget(); }
    }
    requestAnimationFrame(autoScroll);
  }
  function endDrag(d, drop) {
    d.ghost.remove();
    d.el.classList.remove("is-dragging", "kve-dragging");
    document.body.classList.remove("dragging");
    clearHits();
    suppressClick = true;
    if (drop && d.to) place(d.src, d.to);
  }

  /* ================= Загрузка фото ================= */
  q("#files").addEventListener("change", function () { addFiles(this.files); this.value = ""; });
  var dragDepth = 0;
  function hasFiles(e) { return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], "Files") > -1; }
  window.addEventListener("dragenter", function (e) { if (hasFiles(e)) { dragDepth++; q("#drop").hidden = false; e.preventDefault(); } });
  window.addEventListener("dragleave", function (e) { if (hasFiles(e) && --dragDepth <= 0) { dragDepth = 0; q("#drop").hidden = true; } });
  window.addEventListener("dragover", function (e) { if (hasFiles(e)) e.preventDefault(); });
  window.addEventListener("drop", function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault(); dragDepth = 0; q("#drop").hidden = true; addFiles(e.dataTransfer.files);
  });

  var queue = [], active = 0;
  function addFiles(list) {
    var files = Array.prototype.filter.call(list, function (f) { return /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name); });
    if (!files.length) return toast("Тут немає фото");
    files.forEach(function (f) {
      var u = { file: f, url: "", msg: "чекає…" };
      try { u.url = URL.createObjectURL(f); } catch (e) { /* без превью */ }
      uploading.push(u); queue.push(u);
    });
    renderPool(); q("#pool").scrollLeft = 0;
    pump();
  }
  function pump() {
    while (active < 2 && queue.length) { active++; upload(queue.shift()).then(next, next); }
    function next() { active--; if (queue.length) pump(); else if (!active) finish(); }
  }
  function finish() {
    var bad = uploading.filter(function (u) { return u.error; }).length;
    renderPool();
    toast(bad ? "Не вдалося додати фото: " + bad + ". Спробуйте ще раз." : "Фото додано — тепер перетягніть їх на сайт");
    if (bad) setTimeout(function () { uploading = uploading.filter(function (u) { return !u.error; }); renderPool(); }, 6000);
  }
  function upload(u) {
    u.msg = "готую…"; renderPool();
    var id = Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 7);
    return decode(u.file).then(function (img) {
      var w = img.naturalWidth, h = img.naturalHeight;
      return Promise.all([shrink(img, 640, .82), shrink(img, 2000, .88)]).then(function (b) {
        u.msg = "надсилаю…"; renderPool();
        return api("photos/" + id + "?size=s", { method: "POST", body: b[0], headers: { "Content-Type": "image/jpeg" } }).then(function () {
          return api("photos/" + id + "?name=" + encodeURIComponent(u.file.name) + "&w=" + w + "&h=" + h,
            { method: "POST", body: b[1], headers: { "Content-Type": "image/jpeg" } });
        });
      });
    }).then(function (r) {
      S.photos.push({ id: id, name: u.file.name, added: new Date().toISOString() });
      if (r && r.version) S.version = Math.max(S.version, r.version);
      uploading.splice(uploading.indexOf(u), 1);
      if (u.url) setTimeout(function () { URL.revokeObjectURL(u.url); }, 3000);
      renderPool();
    }).catch(function (err) {
      console.warn(err); u.error = true; u.msg = "не вдалося"; renderPool();
      throw err;
    });
  }
  function decode(file) {
    return new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = function () { rej(new Error("decode")); };
      img.src = URL.createObjectURL(file);
    });
  }
  function shrink(img, max, quality) {
    var w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
    var c = document.createElement("canvas");
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return new Promise(function (res, rej) { c.toBlob(function (b) { b ? res(b) : rej(new Error("blob")); }, "image/jpeg", quality); });
  }

  /* ================= Режимы, устройство, «Готово» ================= */
  q("#modeBtn").addEventListener("click", function () {
    if (dirty) { clearTimeout(saveTimer); save(); }
    mode = mode === "edit" ? "preview" : "edit";
    this.textContent = mode === "edit" ? "Переглянути" : "← Редагувати";
    document.body.classList.toggle("preview", mode === "preview");
    setSel(null); q("#menu").hidden = true;
    loadSite();
  });
  q("#device").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    q("#device .is-on").classList.remove("is-on"); b.classList.add("is-on");
    frame.classList.toggle("is-phone", b.dataset.w !== "0");
  });
  if (innerWidth > 700) frame.classList.add("is-phone");

  q("#doneBtn").addEventListener("click", function () {
    if (!S.photos.length) return toast("Спочатку додайте фото");
    var empty = Object.keys(FIXED).filter(function (k) { return !S.layout.single[k]; }).map(function (k) { return FIXED[k][1]; });
    if (!S.layout.gallery.length) empty.push("Роботи (галерея)");
    var noCap = S.layout.gallery.filter(function (g) { return !g.cap; }).length;
    q("#doneEmpty").textContent = (empty.length ? "Ще порожні: " + empty.join(", ") + ". Там залишимо нинішні фото. " : "") +
      (noCap ? "Без підпису робіт: " + noCap + "." : "");
    q("#doneModal").hidden = false;
  });
  q("#doneCancel").addEventListener("click", function () { q("#doneModal").hidden = true; });
  q("#doneSend").addEventListener("click", function () {
    var b = this; b.disabled = true;
    clearTimeout(saveTimer);
    api("done", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ layout: S.layout }) })
      .then(function (st) { setState(st); dirty = false; renderPool(); renderDone(); q("#doneModal").hidden = true; toast("Дякуємо! Сергій отримав ваш вибір"); })
      .catch(function () { toast("Не вдалося надіслати — перевірте інтернет"); })
      .then(function () { b.disabled = false; });
  });
  document.addEventListener("pointerdown", function (e) { if (!e.target.closest("#menu")) q("#menu").hidden = true; }, true);

  /* ================= Вход по паролю ================= */
  function showLogin() {
    if (!q("#login").hidden) return;
    q("#login").hidden = false;
    setTimeout(function () { q("#pw").focus(); }, 50);
  }
  q("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = q("#loginForm .btn"); btn.disabled = true; q("#loginErr").textContent = "";
    fetch("api/login", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: q("#pw").value }) })
      .then(function (r) {
        if (r.ok) { q("#login").hidden = true; q("#pw").value = ""; start(); return; }
        q("#loginErr").textContent = r.status === 429 ? "Забагато спроб. Зачекайте 10 хвилин." : "Неправильний пароль";
        q("#pw").select();
      })
      .catch(function () { q("#loginErr").textContent = "Немає зв'язку. Перевірте інтернет."; })
      .then(function () { btn.disabled = false; });
  });

  /* ================= Старт ================= */
  function start() {
    api("state").then(function (st) {
      setState(st);
      renderPool(); status(S.savedAt ? "Збережено" : ""); renderDone();
      loadSite();
    }).catch(function (e) {
      if (e.message === "login") return;
      q("#stage").innerHTML = '<p style="padding:24px;text-align:center">Не вдалося завантажити. Оновіть сторінку.</p>';
    });
  }
  start();
  window.addEventListener("beforeunload", function (e) { if (dirty || uploading.length) { e.preventDefault(); e.returnValue = ""; } });
})();
