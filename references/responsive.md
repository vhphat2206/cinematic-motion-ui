# Responsive

A hero that looks perfect at 1440×900 often breaks at 1280×720 (most laptops with browser
chrome) and at 375×812. Plan both from the spec.

Contents
- Token-driven breakpoints
- Height breakpoints
- Desktop one-screen lock
- Artboard scaling (pixel-exact compositions)
- Mobile header and full-screen menu
- Pitfalls found in practice

## Token-driven breakpoints

Write every size as a custom property and override only tokens per breakpoint. Components never
get their own media queries for size, which keeps the proportions coherent.

```css
:root{ --h1:48px; --lede:15.5px; --nav-h:40px; --btn-h:40px; --hero-btn-h:42px;
       --pad-x:40px; --pad-y:22px; --hero-gap:85px; --copy-max:860px; --lede-max:470px; }
@media (min-width:1920px){ :root{ --h1:76px; --lede:20px; --pad-x:80px; --copy-max:1120px; --lede-max:620px; } }
@media (min-width:1600px) and (max-width:1919px){ :root{ --h1:64px; --lede:18px; --pad-x:64px; --copy-max:980px; } }
@media (min-width:1280px) and (max-width:1599px){ :root{ --h1:54px; --lede:16px; --pad-x:48px; } }
@media (min-width:901px)  and (max-width:1279px){ :root{ --h1:42px; --lede:15px; --pad-x:28px; --hero-gap:64px; } }
@media (max-width:900px){ :root{ --h1:36px; --lede:16px; --pad-x:16px; --hero-gap:36px; --btn-h:46px; --hero-btn-h:48px; } }
@media (max-width:560px){ :root{ --h1:34px; } }
```

Mega type (archetype C) uses `clamp()` or vw directly: `font-size: clamp(5rem, 18vw, 22rem)`.

## Height breakpoints

The detail most generated pages miss. On short desktop viewports, compress vertical rhythm before
anything collides:

```css
@media (min-width:901px) and (max-height:850px){ :root{ --pad-y:14px; --hero-gap:48px; --h1:40px; } }
@media (min-width:901px) and (max-height:720px){ :root{ --h1:34px; --lede:14px; --hero-gap:32px; --nav-h:30px; --btn-h:34px; } }
```

## Desktop one-screen lock

```css
@media (min-width:901px){ html,body{height:100%;overflow:hidden} .page{height:100vh;height:100dvh;overflow:hidden} }
```

Only for hero-only deliverables. Remove it on phones (`height:auto; overflow-y:auto`) so content
can scroll. Check at 1280×720 that nothing is clipped, because the lock hides overflow.

## Artboard scaling (pixel-exact compositions)

For archetype A layouts where elements sit at exact positions over a photograph:

```css
:root{
  --vw:100vw; --vh:100vh;
  --sc: max(calc(var(--vw)/1280), calc(var(--vh)/800));                 /* cover: scene, photo, drawn lines, title */
  --u : clamp(.72px, min(calc(var(--vw)/1280), calc(var(--vh)/800)), 3px); /* contain: UI chrome */
}
@supports (height:100dvh){ :root{ --vh:100dvh; } }
.scene{position:absolute;left:50%;top:50%;width:calc(1280*var(--sc));height:calc(800*var(--sc));transform:translate(-50%,-50%)}
.nav{top:calc(29.5*var(--u)); height:calc(53.7*var(--u)); … }
```

The scene behaves like `object-fit: cover` (lines stay locked to the photo's features), while the
chrome keeps its size and stays anchored to its own edge. At exactly the reference ratio, both
scales equal one reference pixel. On phones, redefine `--u` (`clamp(.72px, 100vw/470, 1px)`) and
re-anchor the chrome with 20-unit insets.

## Mobile header and full-screen menu

- Header becomes `grid-template-columns: 1fr auto auto` (logo, CTA, burger), or hide the CTA
  under 560 px.
- Burger: 42×42, 1 px border, three 16×1.5 px bars, 5 px gap; the bars morph to an X
  (`translateY(±6.5px) rotate(±45deg)`, middle bar fades).
- Overlay: fixed, full viewport, `background: rgba(8,8,8,.42)` plus `backdrop-filter: blur(24px)`,
  fading over 0.28 s. Links are full width, 56 px tall, 19 px type. Close on link click, on Escape and
  when resizing past the desktop breakpoint. Toggle `aria-expanded` and the label, and lock body scroll.
- Stats become a centred column; CTAs stack full-width under 560 px.
- Respect `env(safe-area-inset-*)` in header and footer padding (`viewport-fit=cover` in the meta).

## Pitfalls found in practice

- **A fixed overlay inside a grid header collapses.** If the nav is a grid item with
  `justify-self: center` on desktop, turning it into `position: fixed; inset: 0` on mobile still
  centres and shrink-wraps it (it came out 155 px wide on a 375 px screen). Set
  `justify-self: stretch; align-self: stretch` in the mobile rule.
- **Hiding copy on small screens with `opacity: 0`** leaves it in the accessibility tree (screen
  readers announce text nobody can see) and the runtime check reports it as hidden text. Use
  `display: none` for corner labels you drop on phones.
- **`100vh` on iOS** includes the URL bar. Use `100dvh` with a `100vh` fallback.
- **Masked lines clip descenders and italics.** Pad the mask wrapper (`.06em .15em .14em`).
- **Canvas backgrounds at DPR 3** burn battery. Cap `devicePixelRatio` at 2 and reduce particle
  counts under 600 px wide.
- **Backdrop blur over video** is expensive on low-end phones. Limit it to one or two elements.
