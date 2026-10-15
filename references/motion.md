# Motion

Generated pages animate everything the same way: `opacity 0 → 1, translateY(20px)`, 0.5 s, `ease`,
often hidden until an IntersectionObserver fires. Gallery pages *choreograph*: each element type has
its own entrance, delays follow reading order, one easing family ties it together, and nothing
depends on the animation succeeding.

Contents
- Easing tokens
- Entrance vocabulary (CSS)
- Choreography: the delay table
- Robustness rules
- WAAPI intro timelines (clip wipes, SVG draws, per-letter)
- Scroll motion
- Pointer motion
- Ambient motion
- Reduced motion

`assets/motion-kit.css` and `assets/motion-kit.js` implement everything below. Inline them into
single-file builds.

## Easing tokens

| Token | Curve | Use |
|---|---|---|
| `--ease-expo` | `cubic-bezier(.16, 1, .3, 1)` | Default for entrances: rises, scales, masks |
| `--ease-draw` | `cubic-bezier(.62, .04, .22, 1)` | SVG strokes, long lines |
| `--ease-wipe` | `cubic-bezier(.77, 0, .18, 1)` | `clip-path` reveals of panels and buttons |
| `--ease-settle` | `cubic-bezier(.25, 1, .5, 1)` | Small fades, labels, icons |
| `--ease-swift` | `cubic-bezier(.2, .8, .2, 1)` | Hover and press feedback |
| Framer equivalent | `[0.16, 1, 0.3, 1]` / `[0.25, 0.1, 0.25, 1]` | `transition={{ ease: … }}` |

Never `ease`, `ease-in-out` or `linear` for entrances. Linear is only for loops (marquees, rotation).

## Entrance vocabulary (CSS)

All keyframes define only the `from` state, so the element's own styles are the end state.

| Class | From | Typical use |
|---|---|---|
| `in-scale` | `opacity:0; scale(.84)` | Logo, nav pills, icon buttons |
| `in-soft` | `opacity:0; translateY(14px)` | Lede, secondary nav, captions |
| `in-mask` | `translateY(105%)` inside `overflow:hidden` wrapper | Headline lines, title letters, corner copy lines |
| `in-pop` | `scale(.9)` → 70% `scale(1.03)` → 1 | Badges, chips, character |
| `in-btn` | `opacity:0; translateY(18px) scale(.94)` | Primary CTA |
| `in-side` | `opacity:0; translateX(22px)` | Secondary CTA (arrives from beside the primary) |
| `in-rise` | `opacity:0; translateY(20px)` | Stats, footer items |
| `in-blur` | `opacity:.35; filter: blur(4px)` | Accent word, a beat after its line |
| `in-spin` | `scale(.2) rotate(-50deg)` → 65% `scale(1.2) rotate(8deg)` | Small sparkle / star icon |
| `in-media` | `opacity:0; scale(1.06); filter: blur(6px)` | Hero image or video (1.4–1.8 s) |
| `in-wipe-x` | `clip-path: inset(0 100% 0 0)` | Buttons, rules, image reveals |
| `in-wipe-c` | `clip-path: inset(0 50% 0 50%)` | Nav bar opening from its centre |

Durations: 1.05 s default, 1.25 s for ledes, 0.55–0.8 s for small labels, 1.15–1.35 s for strokes.

## Choreography: the delay table

Write the table in the spec. A typical one-screen hero (about 15 elements, finishing near 2.5 s):

| Element | Entrance | Delay (s) |
|---|---|---|
| Logo | in-scale | 0.08 |
| Nav items 1–4 | alternate in-scale / in-soft | 0.16, 0.28, 0.40, 0.52 |
| Header CTA / burger | in-scale | 0.34 |
| Badge (+ star in-spin at 0.28) | in-pop | 0.22 |
| Headline line 1 / 2 | in-mask | 0.42 / 0.62 |
| Accent word | in-blur | 0.72 (1.2 s) |
| Lede | in-soft | 0.82 (1.25 s) |
| Primary / secondary CTA | in-btn / in-side | 0.96 / 1.10 |
| Stats 1–3 | in-rise | 1.12, 1.28, 1.44 |

Per-letter: 30–45 ms between letters. Per-line: 60–90 ms. List items: `i × 0.1 s`. On phones,
multiply staggers by 0.8. Alternating entrance types between neighbours (scale, soft, scale, soft)
is what makes a row feel hand-timed instead of mechanical.

## Robustness rules

These are what separate a demo from something you can ship:

1. **Visible at rest.** `.appear` elements have `opacity: 1` in their normal styles. The hidden state
   exists only in the keyframe's `from`, applied during the delay by `animation-fill-mode: both`.
   If animations never run, the content is simply there.
2. **Finish cleanly.** On each element's `animationend`, add `.is-in` (`animation: none`), so
   nothing keeps a composited layer and hover effects aren't fighting a finished animation. The
   element's own styles are the end state, so force nothing else.
   Write keyframes with the individual properties `translate`, `scale` and `rotate` rather than
   `transform`. They compose with a transform the element already has (such as `translateX(-50%)`
   centring) instead of overwriting it mid-animation.
3. **Failsafe.** After two `requestAnimationFrame`s, if `document.getAnimations()` is empty
   (animations disabled or unsupported), add `.is-in` to everything.
4. **WAAPI intros**: add the intro class to `<html>` in a tiny inline script in `<head>` *only* if
   motion is allowed and `Element.animate` exists; set a 4 s timeout that removes it regardless.
   Start after `document.fonts.ready` and the hero image's `decode()`, with a hard start at
   1200 ms so a slow font never delays the page. When all animations finish, remove the class and
   `cancel()` the animations in the same frame, so the static CSS is the final state.
5. **No scroll-reveal that hides content by default.** If you reveal on scroll, the hidden state
   must be added by JS (`.js-reveal` on `<html>`), so content is visible with JS off and to crawlers.
6. **Animate only `transform`, `opacity`, `filter`, `clip-path`.** Never width, height, top or left.

## WAAPI intro timelines

Use the Web Animations API when timings depend on measurement (path lengths, letter counts) or
when many elements share one orchestrated timeline. `assets/motion-kit.js` exports helpers:

- `MK.maskLines(selector, {start, step, duration})` rises inner spans of masked lines.
- `MK.letters(el, {start, step})` splits a word into kerned letter spans and rises them.
- `MK.draw(paths, {delays, duration, fromMiddle: true})` draws strokes outward from the midpoint
  (`stroke-dasharray: 0 L; stroke-dashoffset: -L/2` → `L L; 0`).
- `MK.wipe(el, {from: 'center' | 'left', delay})` reveals with a clip-path wipe.
- `MK.intro(buildFn)` handles readiness (fonts, image decode, 1200 ms hard start), the failsafe,
  and the final cleanup.

## Scroll motion

Use scroll motion on long landing pages, not inside a one-screen hero.

- **Reveal once**: IntersectionObserver with `rootMargin: "0px 0px -10% 0px"`, unobserve after the
  first reveal, reusing the entrance vocabulary.
- **Scroll-linked (native)**: `animation-timeline: view(); animation-range: entry 0% cover 40%;`
  inside `@supports (animation-timeline: view())`, with no hidden state outside the `@supports`.
- **Opposing marquee rows**: two rows of tiles, each repeated three times, translated by
  `±(scrollY − sectionTop + innerHeight) × 0.3`, passive listener plus `requestAnimationFrame`,
  `will-change: transform`.
- **Character scroll reveal**: each character's opacity goes from 0.2 to 1 as the paragraph moves
  through `['start 0.8', 'end 0.2']`. Keep an invisible copy for layout and screen readers.
- **Sticky stacking cards**: cards `position: sticky; top: 6–8rem` inside tall containers, each
  offset `i × 28px`, scaling to `1 − (n − 1 − i) × 0.03` as the next card arrives.
- **Section overlap**: alternate dark and light sections with `border-radius: 40–60px` top corners
  and `margin-top: −40px` so each section slides over the previous one.

## Pointer motion

- **Shine sweep** on buttons and pills: a pseudo-element gradient
  (`115deg, transparent 20–30%, rgba(255,255,255,.16–.45) 48–50%, transparent 70–76%`) moves from
  `translateX(-130%)` to `130%` over 0.6–0.65 s on hover.
- **Magnet**: the element follows the cursor within a padding zone (100–150 px) at
  `offset / strength` (strength 3–6). Transitions: `transform .3s ease-out` while active,
  `.6s ease-in-out` on release. Disable on touch (`(hover: hover) and (pointer: fine)`).
- **Spotlight**: a radial gradient whose centre follows the pointer, on a single surface only.
- **Tilt**: ±4–6° `rotateX/rotateY` with `perspective: 900px` on one hero object. Never on
  every card.

## Ambient motion

Ambient motion belongs to the media layer: video loops, the particle wave, shader fields, slow
gradient drift (6–12 s, `ease-in-out`, `infinite`). Foreground elements don't pulse, bounce, float
or glow on a loop. `animate-bounce` and pulsing CTA glows are template signals.

For gradient text that drifts, register the custom properties so they interpolate:

```css
@property --gx { syntax: "<percentage>"; inherits: false; initial-value: 44%; }
@property --gy { syntax: "<percentage>"; inherits: false; initial-value: 35%; }
.drift { background-image: radial-gradient(80% 110% at var(--gx) var(--gy), #d0b2ff, #ffeed8 43%, #e8400d 88%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: drift 6s ease-in-out infinite; }
@keyframes drift { 33% { --gx: 61%; --gy: 50%; } 66% { --gx: 30%; --gy: 60%; } }
```

Add a duplicate layer with `filter: blur(10px); mix-blend-mode: screen; opacity: .8` behind it
for a glow.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .appear { opacity: 1; transform: none; filter: none; clip-path: none; }
}
```

In JS, skip WAAPI intros entirely, render one static frame of canvas or shader backgrounds, and
pause videos at a good frame (or show the poster).
