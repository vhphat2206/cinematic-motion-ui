/* runtime_check.js: evaluate in the page (browser JS tool / DevTools console / Playwright
   page.evaluate) about 3 s after load, once the entrance has finished. Returns a JSON report.
   Evaluate the whole file; the last expression is the report object.

   What it checks
   - hiddenText     : visible-area text whose effective opacity < 0.1 or visibility hidden
                      (closed mobile menus show up here: that is expected, just confirm it)
   - overflowX      : horizontal scroll and the elements sticking out of the viewport
   - viewportClip   : a one-screen lock (overflow hidden at 100vh) that is cutting off content
   - textClipped    : overflow:hidden boxes whose text is wider/taller than the box
   - running        : animations still running (fine for media loops, not for UI)
   - brokenMedia    : images that failed, videos without muted/playsinline/poster
   - fonts          : faces used by headings and body, and whether they actually loaded
   - tapTargets     : links/buttons under 40 px on narrow viewports
   - headline       : h1 metrics, for a quick typography sanity check
*/
(function () {
  var vw = innerWidth, vh = innerHeight, out = { viewport: vw + "x" + vh };
  function label(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    if (el.classList && el.classList.length) s += "." + Array.prototype.slice.call(el.classList, 0, 2).join(".");
    return s;
  }
  function effOpacity(el) {
    var o = 1;
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.visibility === "hidden" || cs.display === "none") return 0;
      o *= parseFloat(cs.opacity);
    }
    return o;
  }
  function decorative(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      if (n.getAttribute("aria-hidden") === "true") return true;
      if (n.classList && (n.classList.contains("sr-only") || n.classList.contains("visually-hidden"))) return true;
    }
    return false;
  }
  var all = Array.prototype.slice.call(document.body.querySelectorAll("*"));
  var textEls = all.filter(function (el) {
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|SVG|PATH)$/i.test(el.tagName)) return false;
    return Array.prototype.some.call(el.childNodes, function (c) { return c.nodeType === 3 && c.textContent.trim().length > 1; });
  });

  // hidden text. Text inside a closed menu/overlay (a hidden nav, dialog or *menu* container) is
  // expected and reported separately so it doesn't read as a bug.
  function closedMenu(el) {
    for (var n = el; n && n.nodeType === 1 && n !== document.body; n = n.parentElement) {
      var cs = getComputedStyle(n);
      var hiddenHere = cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.1;
      var menuish = /^(NAV|DIALOG)$/.test(n.tagName) || n.getAttribute("role") === "dialog" ||
        /menu|drawer|overlay|sheet/i.test((n.id || "") + " " + (typeof n.className === "string" ? n.className : ""));
      if (hiddenHere && menuish) return true;
    }
    return false;
  }
  var hidden = textEls.filter(function (el) {
    if (decorative(el)) return false;
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    return effOpacity(el) < 0.1;
  });
  out.hiddenText = hidden.filter(function (el) { return !closedMenu(el); }).slice(0, 8)
    .map(function (el) { return label(el) + ' "' + el.textContent.trim().slice(0, 40) + '"'; });
  out.closedMenuText = hidden.filter(closedMenu).length;

  // horizontal overflow
  var sw = document.documentElement.scrollWidth;
  out.overflowX = { scrollWidth: sw, hasScroll: sw > vw + 1, offenders: [] };
  if (sw > vw + 1) {
    out.overflowX.offenders = all.filter(function (el) {
      var cs = getComputedStyle(el); if (cs.position === "fixed" || decorative(el)) return false;
      var r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1);
    }).slice(0, 6).map(function (el) { var r = el.getBoundingClientRect(); return label(el) + " [" + Math.round(r.left) + "→" + Math.round(r.right) + "]"; });
  }

  // one-screen lock clipping content: a viewport-tall overflow:hidden box with real, visible text
  // positioned past its bottom edge (oversized decorative layers for parallax don't count)
  out.viewportClip = [];
  all.concat([document.documentElement, document.body]).forEach(function (el) {
    var cs = getComputedStyle(el);
    if (!/(hidden|clip)/.test(cs.overflowY) || decorative(el)) return;
    if (!(el.clientHeight >= vh * 0.9 && el.scrollHeight > el.clientHeight + 2)) return;
    var box = el === document.documentElement || el === document.body ? { bottom: vh } : el.getBoundingClientRect();
    var cut = textEls.filter(function (t) {
      if (!el.contains(t) || decorative(t) || effOpacity(t) < 0.1) return false;
      var r = t.getBoundingClientRect(); return r.height > 0 && r.bottom > box.bottom + 2;
    });
    if (cut.length) out.viewportClip.push(label(el) + " cuts off " + cut.length + " text element(s), e.g. " + label(cut[0]) + ' "' + cut[0].textContent.trim().slice(0, 30) + '"');
  });
  out.viewportClip = out.viewportClip.slice(0, 4);

  // clipped text inside overflow hidden boxes (masks included: a few px is normal)
  out.textClipped = textEls.filter(function (el) {
    var cs = getComputedStyle(el); if (decorative(el)) return false;
    if (!/(hidden|clip)/.test(cs.overflow + cs.overflowX + cs.overflowY)) return false;
    return el.scrollWidth > el.clientWidth + 4 || el.scrollHeight > el.clientHeight + 6;
  }).slice(0, 6).map(function (el) { return label(el) + ' "' + el.textContent.trim().slice(0, 30) + '"'; });

  // animations still running
  var anims = document.getAnimations ? document.getAnimations() : [];
  var running = anims.filter(function (a) { return a.playState === "running"; });
  out.running = { count: running.length, items: running.slice(0, 6).map(function (a) {
    var t = a.effect && a.effect.target; var it = a.effect && a.effect.getTiming ? a.effect.getTiming().iterations : 1;
    return (a.animationName || a.transitionProperty || "waapi") + " on " + (t ? label(t) : "?") + (it === Infinity ? " (infinite)" : "");
  }) };

  // media
  out.brokenMedia = [];
  Array.prototype.forEach.call(document.images, function (img) {
    if (img.complete && img.naturalWidth === 0) out.brokenMedia.push("img failed: " + (img.currentSrc || img.src).slice(0, 80));
  });
  Array.prototype.forEach.call(document.querySelectorAll("video"), function (v) {
    var miss = ["muted", "playsInline", "poster"].filter(function (k) { return k === "muted" ? !v.muted : !v[k]; });
    if (miss.length) out.brokenMedia.push("video " + label(v) + " missing " + miss.join(","));
  });

  // fonts actually rendering
  function primary(el) { return getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim(); }
  var probe = ["h1", "h1 em", "h1 i", "h2", "p", "a", "button", "body"].map(function (s) { return document.querySelector(s); }).filter(Boolean);
  var fams = {};
  probe.forEach(function (el) {
    var f = primary(el), cs = getComputedStyle(el);
    if (fams[f]) return;
    var generic = /^(system-ui|-apple-system|sans-serif|serif|monospace|ui-)/.test(f);
    fams[f] = generic ? "generic" : (document.fonts && document.fonts.check(cs.fontStyle + " " + cs.fontWeight + " 16px \"" + f + "\"") ? "loaded" : "NOT LOADED (fallback rendering)");
  });
  out.fonts = fams;

  // tap targets on narrow screens
  out.tapTargets = [];
  if (vw < 600) {
    out.tapTargets = Array.prototype.slice.call(document.querySelectorAll("a,button")).filter(function (el) {
      var r = el.getBoundingClientRect(); if (!r.width || effOpacity(el) < 0.1) return false;
      return r.height < 40 || r.width < 40;
    }).slice(0, 6).map(function (el) { var r = el.getBoundingClientRect(); return label(el) + " " + Math.round(r.width) + "x" + Math.round(r.height); });
  }

  // headline
  var h1 = document.querySelector("h1");
  if (h1) {
    var c = getComputedStyle(h1);
    out.headline = { text: h1.textContent.trim().replace(/\s+/g, " ").slice(0, 80), font: primary(h1), size: c.fontSize,
      weight: c.fontWeight, tracking: c.letterSpacing, leading: c.lineHeight };
  }
  out.entrance = document.querySelectorAll(".appear").length ? document.querySelectorAll(".appear.is-in").length + "/" + document.querySelectorAll(".appear").length + " finished" : "n/a";
  out.verdict = (out.hiddenText.length || out.overflowX.hasScroll || out.viewportClip.length || out.brokenMedia.length) ? "FIX ISSUES" : "OK (now look at the screenshot)";
  return out;
})();
