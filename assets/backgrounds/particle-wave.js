/* ParticleWave(canvas, options): a perspective field of points shaped by layered sines.
   Archetype B (dark tech) media layer. Reads as a luminous fabric or sound wave.
   Options (all optional):
     color   [r,g,b]         point colour                        default [235,238,245]
     rows    number          depth rows                          default 46 (auto-reduced <600px)
     cols    number          points per row                      default 170
     speed   number          time multiplier                     default 1
     amp     number          wave height (fraction of viewport)  default 1
     horizon number          vertical centre (0–1)               default 0.40
     spread  number          horizontal spread                   default 0.75
     size    number          base point size in CSS px           default 1.5
   Honours prefers-reduced-motion (one still frame), pauses when hidden, caps DPR at 2.
   Returns { stop() }. */
function ParticleWave(canvas, o) {
  o = o || {};
  var ctx = canvas.getContext("2d");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var col = (o.color || [235, 238, 245]).join(",");
  var speed = o.speed == null ? 1 : o.speed, amp = o.amp == null ? 1 : o.amp;
  var horizon = o.horizon == null ? 0.40 : o.horizon, spread = o.spread == null ? 0.75 : o.spread;
  var baseSize = o.size || 1.5;
  var W, H, dpr, rows, cols, raf = 0, running = true, dead = false;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    W = canvas.width = Math.max(1, Math.round(r.width * dpr));
    H = canvas.height = Math.max(1, Math.round(r.height * dpr));
    var small = r.width < 600;
    rows = Math.round((o.rows || 46) * (small ? 0.6 : 1));
    cols = Math.round((o.cols || 170) * (small ? 0.55 : 1));
    if (reduced) frame(4000);
  }
  function frame(ms) {
    var t = ms / 1000 * speed;
    ctx.clearRect(0, 0, W, H);
    for (var j = 0; j < rows; j++) {
      var z = j / (rows - 1), persp = 1 / (1 + z * 1.4);
      for (var i = 0; i < cols; i++) {
        var x = i / (cols - 1) * 2 - 1;
        var y = (Math.sin(x * 2.3 + t * .55 + z * 2.1) * .22 + Math.sin(x * 5.2 - t * .35 + z) * .06 + Math.cos(z * 3 + t * .25) * .05) * amp;
        var sx = W / 2 + x * W * spread * persp;
        var sy = H * horizon + y * H * .9 * persp + (z - .5) * H * .22;
        var a = (.08 + .55 * persp) * (1 - Math.abs(x) * .55);
        var s = (baseSize * persp + .4) * dpr;
        ctx.fillStyle = "rgba(" + col + "," + a.toFixed(3) + ")";
        ctx.fillRect(sx, sy, s, s);
      }
    }
  }
  function loop(ms) { if (!running) return; frame(ms); raf = requestAnimationFrame(loop); }
  resize();
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (reduced || dead) return;
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (!running) { running = true; raf = requestAnimationFrame(loop); }
  });
  if (!reduced) raf = requestAnimationFrame(loop);
  return { stop: function () { dead = true; running = false; cancelAnimationFrame(raf); removeEventListener("resize", resize); } };
}
