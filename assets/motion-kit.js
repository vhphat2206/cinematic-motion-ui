/* ==========================================================================
   motion-kit.js: small, dependency-free helpers for choreographed motion.
   Exposes window.MK. Every helper respects prefers-reduced-motion and leaves the page fully
   visible if anything fails.

   Optional head snippet for WAAPI intros: hides [data-mk] targets before first paint, with a
   4 s failsafe. Put it in its own script tag inside <head>:
     (function(r){try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&typeof r.animate==="function"){r.classList.add("mk-intro");window.__mkFailsafe=setTimeout(function(){r.classList.remove("mk-intro")},4000)}}catch(e){}})(document.documentElement);
   ========================================================================== */
(function (w, d) {
  "use strict";
  var reduced = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = {
    expo: "cubic-bezier(.16,1,.3,1)", draw: "cubic-bezier(.62,.04,.22,1)",
    wipe: "cubic-bezier(.77,0,.18,1)", settle: "cubic-bezier(.25,1,.5,1)"
  };
  function $$(s, root) { return typeof s === "string" ? Array.prototype.slice.call((root || d).querySelectorAll(s)) : (s.length != null ? Array.prototype.slice.call(s) : [s]); }

  /* 1. CSS entrances: mark finished elements, force-finish if animations never run. */
  function appear(root) {
    var els = $$(".appear", root);
    els.forEach(function (el) {
      el.addEventListener("animationend", function (e) { if (e.target === el) el.classList.add("is-in"); });
    });
    var done = function () { els.forEach(function (el) { el.classList.add("is-in"); }); };
    if (reduced) return done();
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      var running = d.getAnimations ? d.getAnimations().length : 0;
      if (!running) done();
    }); });
    // Belt and braces: whatever happens, everything is in after 4 s.
    setTimeout(done, 4000);
  }

  /* 2. WAAPI intro orchestration.
     MK.intro(function (add) { add(el, keyframes, {duration, delay, easing}); … }, {images: [img]})
     Waits for fonts + image decode (hard start at 1200 ms), plays once, then removes html.mk-intro
     and cancels every animation in the same frame so static CSS is the final state. */
  function intro(build, opts) {
    opts = opts || {};
    var root = d.documentElement;
    if (reduced || typeof root.animate !== "function") { root.classList.remove("mk-intro"); return; }
    var anims = [], started = false;
    function add(el, kf, o) { if (!el) return null; o = o || {}; o.fill = "both"; if (!o.easing) o.easing = EASE.expo; var a = el.animate(kf, o); anims.push(a); return a; }
    function play() {
      if (started) return; started = true;
      requestAnimationFrame(function () {
        try { build(add, EASE); } catch (err) { console.error(err); }
        clearTimeout(w.__mkFailsafe);
        root.classList.remove("mk-intro"); // fill:both now holds the from-states
        Promise.all(anims.map(function (a) { return a.finished; })).then(function () {
          anims.forEach(function (a) { a.cancel(); }); anims.length = 0;
        }, function () {});
      });
    }
    var waits = [d.fonts ? d.fonts.ready : 0];
    (opts.images || []).forEach(function (img) { if (img && img.decode) waits.push(img.decode().catch(function () {})); });
    Promise.all(waits).then(play, play);
    setTimeout(play, opts.hardStart || 1200);
  }

  /* 3. Masked lines: each [data-mk="mask"] wrapper's first child rises from 105%. */
  function maskLines(add, sel, o) {
    o = o || {};
    $$(sel).forEach(function (wrap, i) {
      var inner = wrap.firstElementChild || wrap;
      add(inner, [{ translate: "0 105%" }, { translate: "0 0" }],
        { duration: o.duration || 800, delay: (o.start || 0) + i * (o.step || 70), easing: EASE.expo });
    });
  }

  /* 4. Letters: split a word into spans with optional per-letter kerning (in em), rise each. */
  function letters(el, o) {
    o = o || {};
    var text = el.textContent; var kern = o.kerning || [];
    el.setAttribute("aria-label", text.trim());
    el.textContent = "";
    var spans = [];
    Array.prototype.forEach.call(text, function (ch, i) {
      var s = d.createElement("span");
      s.setAttribute("aria-hidden", "true");
      s.style.display = "inline-block";
      if (ch === " ") s.innerHTML = "&nbsp;"; else s.textContent = ch;
      if (kern[i]) s.style.marginLeft = kern[i] + "em";
      el.appendChild(s); spans.push(s);
    });
    return spans;
  }
  function riseLetters(add, spans, o) {
    o = o || {};
    spans.forEach(function (s, i) {
      add(s, [{ translate: "0 105%" }, { translate: "0 0" }],
        { duration: o.duration || 1000, delay: (o.start || 200) + i * (o.step || 38), easing: EASE.expo });
    });
  }

  /* 5. Draw SVG strokes outward from their midpoint. */
  function draw(add, paths, o) {
    o = o || {};
    $$(paths).forEach(function (p, i) {
      var L = p.getTotalLength();
      var from = o.fromMiddle === false
        ? { strokeDasharray: "0px " + L + "px", strokeDashoffset: "0px" }
        : { strokeDasharray: "0px " + L + "px", strokeDashoffset: (-L / 2) + "px" };
      add(p, [from, { strokeDasharray: L + "px " + L + "px", strokeDashoffset: "0px" }],
        { duration: o.duration || 1250, delay: (o.delays && o.delays[i] != null) ? o.delays[i] : (o.start || 100) + i * (o.step || 60), easing: EASE.draw });
    });
  }

  /* 6. Clip-path wipes. from: "left" | "center" | "bottom". */
  function wipe(add, el, o) {
    o = o || {};
    var start = { left: "inset(0 100% 0 0)", center: "inset(0 50% 0 50%)", bottom: "inset(100% 0 0 0)" }[o.from || "left"];
    $$(el).forEach(function (e, i) {
      add(e, [{ clipPath: start }, { clipPath: "inset(0 0% 0 0%)" }],
        { duration: o.duration || 750, delay: (o.delay || 0) + i * (o.step || 90), easing: EASE.wipe });
    });
  }

  /* 7. Magnet: element drifts toward the cursor inside a padding zone (fine pointers only). */
  function magnet(el, o) {
    o = o || {};
    if (reduced || !w.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var pad = o.padding || 120, strength = o.strength || 4;
    el.style.willChange = "transform";
    w.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var inside = Math.abs(e.clientX - cx) < r.width / 2 + pad && Math.abs(e.clientY - cy) < r.height / 2 + pad;
      el.style.transition = inside ? "transform .3s ease-out" : "transform .6s ease-in-out";
      el.style.transform = inside ? "translate3d(" + (e.clientX - cx) / strength + "px," + (e.clientY - cy) / strength + "px,0)" : "translate3d(0,0,0)";
    }, { passive: true });
  }

  /* 8. Reveal on scroll (opt-in hiding: CSS hides [data-reveal] only under html.mk-reveal). */
  function reveal(o) {
    o = o || {};
    var els = $$("[data-reveal]");
    if (reduced || !("IntersectionObserver" in w) || !els.length) return;
    d.documentElement.classList.add("mk-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-revealed"); io.unobserve(en.target); } });
    }, { rootMargin: o.rootMargin || "0px 0px -10% 0px", threshold: 0 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* 9. Opposing rows that move with scroll. rows: [{el, dir: 1|-1}] */
  function scrollRows(section, rows, o) {
    o = o || {};
    if (reduced) return;
    var factor = o.factor || 0.3, offset = o.offset || 200, ticking = false;
    function update() {
      ticking = false;
      var top = section.getBoundingClientRect().top + w.scrollY;
      var v = (w.scrollY - top + w.innerHeight) * factor;
      rows.forEach(function (r) { r.el.style.transform = "translate3d(" + (r.dir > 0 ? v - offset : -(v - offset)) + "px,0,0)"; });
    }
    rows.forEach(function (r) { r.el.style.willChange = "transform"; });
    w.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* 10. Character scroll reveal: opacity .2 → 1 across ['start 0.8', 'end 0.2']. */
  function charReveal(el) {
    var text = el.textContent;
    el.setAttribute("aria-label", text.trim());
    el.textContent = "";
    var chars = Array.prototype.map.call(text, function (ch) {
      var s = d.createElement("span"); s.setAttribute("aria-hidden", "true"); s.textContent = ch; el.appendChild(s); return s;
    });
    if (reduced) return;
    var n = chars.length, ticking = false;
    function update() {
      ticking = false;
      var r = el.getBoundingClientRect(), vh = w.innerHeight;
      var start = vh * 0.8, end = vh * 0.2;              // element top at 80% → element bottom at 20%
      var p = (start - r.top) / ((start - end) + r.height);
      p = Math.max(0, Math.min(1, p));
      chars.forEach(function (c, i) { var t = Math.max(0, Math.min(1, p * n - i)); c.style.opacity = (0.2 + 0.8 * t).toFixed(3); });
    }
    w.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* 11. Mobile menu: body.menu-open toggle with aria, Escape, link click and resize close. */
  function menu(burger, nav, o) {
    o = o || {};
    var bp = o.breakpoint || 901;
    function set(open) {
      d.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    burger.addEventListener("click", function () { set(!d.body.classList.contains("menu-open")); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    w.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    var mq = w.matchMedia("(min-width: " + bp + "px)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function (m) { if (m.matches) set(false); });
    return set;
  }

  w.MK = { reduced: reduced, EASE: EASE, appear: appear, intro: intro, maskLines: maskLines, letters: letters,
    riseLetters: riseLetters, draw: draw, wipe: wipe, magnet: magnet, reveal: reveal, scrollRows: scrollRows,
    charReveal: charReveal, menu: menu };
})(window, document);
