/* Rings(svg, options): hairline arcs that draw themselves outward from their midpoints.
   Use alone over a dark field, or over a photo to echo its shapes (a collar, a horizon, a dome).
   For pixel-exact arcs locked to a photo, draw your own <path>s in the photo's coordinate system
   (viewBox = photo size, preserveAspectRatio matching object-fit) and call Rings.draw(paths).
   Options (all optional):
     center  [x,y]       arc centre as viewport fractions             default [0.5, 0.44]
     radii   [..]        radii as fractions of min(vw, vh)            default [.30,.38,.47,.57]
     from    degrees     start angle (0 = right, 90 = down)           default 200
     to      degrees     end angle                                    default 340
     taper   degrees     each outer ring shortens by this per side    default 6
     stroke  css colour                                               default "rgba(255,255,255,.22)"
     width   px                                                       default 1
     start   ms first delay, step ms between rings, duration ms       defaults 100, 90, 1350
   Redraws (without animation) on resize. Honours prefers-reduced-motion. */
function Rings(svg, o) {
  o = o || {};
  var NS = "http://www.w3.org/2000/svg";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var c = o.center || [0.5, 0.44], radii = o.radii || [.30, .38, .47, .57];
  var a0 = o.from == null ? 200 : o.from, a1 = o.to == null ? 340 : o.to, taper = o.taper == null ? 6 : o.taper;
  svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
  function build() {
    var w = svg.clientWidth || innerWidth, h = svg.clientHeight || innerHeight;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML = "";
    var cx = w * c[0], cy = h * c[1], base = Math.min(w, h);
    return radii.map(function (f, i) {
      var r = base * f, s = (a0 + i * taper) * Math.PI / 180, e = (a1 - i * taper) * Math.PI / 180;
      var large = Math.abs(e - s) > Math.PI ? 1 : 0;
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", "M" + (cx + r * Math.cos(s)).toFixed(2) + " " + (cy + r * Math.sin(s)).toFixed(2) +
        " A" + r.toFixed(2) + " " + r.toFixed(2) + " 0 " + large + " 1 " + (cx + r * Math.cos(e)).toFixed(2) + " " + (cy + r * Math.sin(e)).toFixed(2));
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", o.stroke || "rgba(255,255,255,.22)");
      p.setAttribute("stroke-width", o.width || 1);
      p.setAttribute("vector-effect", "non-scaling-stroke");
      svg.appendChild(p);
      return p;
    });
  }
  var paths = build();
  if (!reduced) Rings.draw(paths, { start: o.start, step: o.step, duration: o.duration });
  var t; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(build, 150); });
  return paths;
}
/* Rings.draw(paths, {start, step, duration, delays}): midpoint-outward stroke draw via WAAPI. */
Rings.draw = function (paths, o) {
  o = o || {};
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  Array.prototype.forEach.call(paths, function (p, i) {
    if (!p.animate) return;
    var L = p.getTotalLength();
    var delay = o.delays ? o.delays[i] : (o.start == null ? 100 : o.start) + i * (o.step == null ? 90 : o.step);
    p.animate([{ strokeDasharray: "0px " + L + "px", strokeDashoffset: (-L / 2) + "px" },
               { strokeDasharray: L + "px " + L + "px", strokeDashoffset: "0px" }],
      { duration: o.duration || 1350, delay: delay, easing: "cubic-bezier(.62,.04,.22,1)", fill: "both" })
      .finished.then(function (a) { a.cancel(); }, function () {});
  });
};
