/* ShaderField(canvas, options): a WebGL domain-warped noise field with film grain.
   Slow and liquid. Depending on colours it reads as dusk sky, ink in water, molten metal, aurora
   or fog over water. Archetypes A, B and F media layer, or a fallback inside a media slot.
   Options (all optional):
     colors  ["#hex", …]  2–4 colours from dark to light   default ["#05070a","#1b2a33","#6f8c96","#d9e2e4"]
     speed   number       time multiplier                   default 1  (keep ≤ 1.5; slow is premium)
     scale   number       noise scale                       default 1.6
     warp    number       domain-warp strength              default 1.2
     grain   number       film grain 0–0.2                  default 0.06
     focus   [x,y]        bright area centre, 0–1 uv        default [0.5, 0.25]
     vignette number      edge darkening 0–1                default 0.55
     mouse   boolean      subtle parallax toward pointer    default true
   Falls back to a CSS gradient of the same colours if WebGL is unavailable.
   Honours prefers-reduced-motion (one still frame), pauses when hidden, caps DPR at 1.5.
   Returns { stop() }. */
function ShaderField(canvas, o) {
  o = o || {};
  var colors = (o.colors || ["#05070a", "#1b2a33", "#6f8c96", "#d9e2e4"]).slice(0, 4);
  while (colors.length < 4) colors.push(colors[colors.length - 1]);
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false }) || canvas.getContext("experimental-webgl");
  if (!gl) {
    canvas.style.background = "radial-gradient(120% 90% at 50% 20%, " + colors[3] + " 0%, " + colors[2] + " 25%, " + colors[1] + " 55%, " + colors[0] + " 100%)";
    return { stop: function () {} };
  }
  function hex(h) { h = h.replace("#", ""); if (h.length === 3) h = h.replace(/./g, "$&$&"); var n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  var vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var fs = [
    "precision highp float;",
    "uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 c0,c1,c2,c3;uniform float sc,wp,gr,vg;uniform vec2 fc;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);",
    " return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,-.6,.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/r;vec2 p=(gl_FragCoord.xy-.5*r)/min(r.x,r.y)*sc+m*.15;",
    " float T=t*.05;",
    " vec2 q=vec2(fbm(p+vec2(0.,T)),fbm(p+vec2(5.2,1.3)-T));",
    " vec2 w=vec2(fbm(p+wp*q+vec2(1.7,9.2)+.15*T),fbm(p+wp*q+vec2(8.3,2.8)-.126*T));",
    " float f=fbm(p+wp*w);",
    " float d=distance(uv,vec2(fc.x,1.-fc.y));",
    " f=clamp(f*1.15+.35*(1.-smoothstep(0.,.9,d))-.12,0.,1.);",
    " vec3 col=mix(c0,c1,smoothstep(.0,.38,f));col=mix(col,c2,smoothstep(.35,.7,f));col=mix(col,c3,smoothstep(.68,1.,f)*.85);",
    " float v=smoothstep(1.15,.25,length(uv-.5)*1.4);col*=mix(1.,v,vg);",
    " col+=(h(gl_FragCoord.xy+fract(t*7.13))-.5)*gr;",
    " gl_FragColor=vec4(col,1.);}"
  ].join("\n");
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  var prog = gl.createProgram();
  try { gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); }
  catch (e) { console.warn("ShaderField:", e); canvas.style.background = colors[1]; return { stop: function () {} }; }
  gl.useProgram(prog);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var U = {}; ["r", "t", "m", "c0", "c1", "c2", "c3", "sc", "wp", "gr", "vg", "fc"].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });
  colors.forEach(function (c, i) { gl.uniform3fv(U["c" + i], hex(c)); });
  gl.uniform1f(U.sc, o.scale || 1.6); gl.uniform1f(U.wp, o.warp == null ? 1.2 : o.warp);
  gl.uniform1f(U.gr, o.grain == null ? 0.06 : o.grain); gl.uniform1f(U.vg, o.vignette == null ? 0.55 : o.vignette);
  var focus = o.focus || [0.5, 0.25]; gl.uniform2f(U.fc, focus[0], focus[1]);
  var speed = o.speed == null ? 1 : o.speed, mx = 0, my = 0, tx = 0, ty = 0, raf = 0, running = true, dead = false;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5), r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(U.r, canvas.width, canvas.height);
    if (reduced) draw(20000);
  }
  function draw(ms) {
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    gl.uniform1f(U.t, ms / 1000 * speed); gl.uniform2f(U.m, mx, my);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function loop(ms) { if (!running) return; draw(ms); raf = requestAnimationFrame(loop); }
  if (o.mouse !== false && !reduced && matchMedia("(pointer: fine)").matches) {
    addEventListener("pointermove", function (e) { tx = e.clientX / innerWidth - .5; ty = .5 - e.clientY / innerHeight; }, { passive: true });
  }
  resize(); addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (reduced || dead) return;
    if (document.hidden) { running = false; cancelAnimationFrame(raf); } else if (!running) { running = true; raf = requestAnimationFrame(loop); }
  });
  if (!reduced) raf = requestAnimationFrame(loop);
  return { stop: function () { dead = true; running = false; cancelAnimationFrame(raf); removeEventListener("resize", resize); } };
}
