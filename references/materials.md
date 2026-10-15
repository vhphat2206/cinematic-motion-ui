# Materials

Surfaces that read as crafted rather than defaulted. Every recipe has an explicit hover state.
Use a material on one to three controls per screen. Glass on every card is a template look.

Contents
- Liquid-metal pill (dark)
- Chrome solid button
- Frosted glass ghost button
- Solid panel button (archetype A)
- Metal badge
- Gradient pill (archetype D)
- Glass widget (archetype F)
- Text treatments: steel gradient, drifting radial, muted accent
- Hairlines, scrims, grain
- Radius systems

## Liquid-metal pill (dark)

```css
.pill{position:relative;overflow:hidden;display:inline-flex;align-items:center;height:40px;padding:0 18px;
  border-radius:7px;border:1px solid rgba(198,198,198,.55);color:#f3f3f3;font-size:14px;letter-spacing:-.01em;
  background:linear-gradient(105deg,#050505 0%,#2a2a2a 48%,#4a4a4a 100%);
  transition:background .35s ease,border-color .35s ease,box-shadow .35s ease}
.pill::before{content:"";position:absolute;inset:0;transform:translateX(-120%);transition:transform .6s ease;
  background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.16) 50%,transparent 70%)}
.pill:hover{border-color:rgba(235,235,235,.9);box-shadow:0 0 18px rgba(200,210,230,.18);
  background:linear-gradient(105deg,#111 0%,#3a3a3a 45%,#6a6a6a 100%)}
.pill:hover::before{transform:translateX(120%)}
```

## Chrome solid button

```css
.btn{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;
  height:42px;padding:0 18px;border-radius:6px;font-weight:500;letter-spacing:-.02em;line-height:1;white-space:nowrap;
  transition:background .35s,border-color .35s,box-shadow .35s,color .35s}
.btn::after{content:"";position:absolute;inset:0;z-index:-1;transform:translateX(-130%);transition:transform .65s ease;
  background:linear-gradient(115deg,transparent 20%,rgba(255,255,255,.45) 48%,transparent 76%)}
.btn:hover::after{transform:translateX(130%)}
.btn-chrome{color:#111;border:1px solid #fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.95);
  background:linear-gradient(180deg,#fff 0%,#e7e7e7 48%,#cfcfcf 100%)}
.btn-chrome:hover{border-color:#f2f6ff;background:linear-gradient(180deg,#fff 0%,#f3f6ff 42%,#d5def2 100%);
  box-shadow:inset 0 1px 0 #fff,0 0 22px rgba(186,208,255,.35),0 8px 18px rgba(255,255,255,.12)}
```

`isolation: isolate` plus `z-index: -1` keeps the shine above the button's background and below
its label.

## Frosted glass ghost button

```css
.btn-glass{color:#fff;border:1px solid rgba(198,198,198,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.12);
  background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(0,0,0,.5) 46%,rgba(150,170,200,.1));
  -webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}
.btn-glass:hover{border-color:rgba(220,230,255,.8);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 0 24px rgba(170,200,255,.28)}
```

On light media, swap to `rgba(255,255,255,.55)` tint, ink `#111`, border `rgba(0,0,0,.08)`.

## Solid panel button (archetype A)

Flat black (or white) rectangles, mono uppercase label, no radius, invert on hover in 0.2 s. A
1 px optical top pad on the label. Pair with a clip-path wipe entrance.

```css
.panel-btn{display:flex;align-items:center;justify-content:center;width:142px;height:45px;background:#000;color:#fff;
  font:400 14px/1 var(--mono);letter-spacing:-.025em;text-transform:uppercase;padding-top:1px;transition:background .2s,color .2s}
.panel-btn:hover{background:#fff;color:#000}
```

## Metal badge

```css
.badge{display:inline-flex;align-items:center;gap:8px;padding:9px 15px;border-radius:5px;color:#f2f2f2;font-size:12.5px;
  background:linear-gradient(90deg,#7d7d7d 0%,#2a2a2a 52%,#0a0a0a 100%)}
.badge svg{width:16px;height:16px;filter:drop-shadow(0 0 3px rgba(255,255,255,.45))}
```

Light version: `linear-gradient(90deg,#fff,#ece9e4)`, 1 px border `rgba(0,0,0,.06)`, ink `#222`.

## Gradient pill (archetype D)

```css
.pill-grad{border-radius:999px;padding:14px 40px;color:#fff;font-weight:500;letter-spacing:.12em;text-transform:uppercase;
  background:linear-gradient(123deg,#18011F 7%,#B600A8 37%,#7621B0 72%,#BE4C00 100%);
  box-shadow:0 4px 4px rgba(181,1,167,.25),inset 4px 4px 12px #7721B1;outline:2px solid #fff;outline-offset:-3px}
```

Swap the stops to the brand's hue family. Keep a dark start and a warm end, which gives it depth.

## Glass widget (archetype F)

```css
.widget{border-radius:22px;padding:14px 16px;color:#fff;border:1px solid rgba(255,255,255,.22);
  background:linear-gradient(160deg,rgba(255,255,255,.18),rgba(255,255,255,.04));
  -webkit-backdrop-filter:blur(20px) saturate(140%);backdrop-filter:blur(20px) saturate(140%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 10px 30px rgba(0,0,0,.18)}
```

## Text treatments

- **Steel gradient** (large display words on dark):
  `background:linear-gradient(180deg,#646973 0%,#BBCCD7 100%); -webkit-background-clip:text; color:transparent`.
- **Drifting radial with glow**: see `references/motion.md` § Ambient motion. Use it on one word only.
- **Muted accent**: the accent word in `#9a9a9a` on dark (or `#7b7268` on bone). Quieter than a
  gradient and usually better.

## Hairlines, scrims, grain

- Hairlines: 1 px at `rgba(255,255,255,.12–.16)` on dark, `rgba(0,0,0,.08–.15)` on light. Prefer a
  tone step between surfaces over a line plus a shadow.
- Scrims sit in the media's `::after`:
  `radial-gradient(120% 70% at 50% 100%, rgba(0,0,0,.85) 10%, transparent 60%), linear-gradient(180deg, rgba(0,0,0,.55), transparent 22%)`.
  Tune the stops by looking at the screenshot. Text must clear WCAG AA against the darkest *and*
  lightest part of the media behind it.
- Grain: a fixed layer at `z-index: 100`, `pointer-events: none`, `opacity: .06–.10`,
  `mix-blend-mode: overlay`, with an SVG `feTurbulence` data URI (see `assets/starter.html`).
  Oversize it (`inset: -50%`) if you animate it with `steps()` jitter.

## Radius systems

| Archetype | Radii |
|---|---|
| A Cinematic | 0 everywhere |
| B Dark tech | 5–7 px controls, 0 layout |
| C Editorial | 0, or full pills for chips only |
| D Character | 999 px pills, 24–40 px cards |
| E Product | 10–14 px cards, 999 px buttons or 8 px |
| F HUD | 18–28 px widgets, 999 px icon buttons |
| G Expressive | 0 or brutal 2 px |

Choose one row and stay in it.
