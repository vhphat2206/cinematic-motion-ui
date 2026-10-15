# React, Next, Tailwind and Framer Motion

The method is the same. These are the places where the framework changes the implementation.

Contents
- Keep entrances in CSS
- Tailwind setup for tokens and keyframes
- Framer Motion for scroll and interaction
- Components worth extracting
- Next.js specifics

## Keep entrances in CSS

Framer Motion's `initial={{ opacity: 0 }}` is rendered into the server HTML. If hydration is slow
or fails, the hero stays invisible: exactly the fragility the robustness rules forbid. So:

- Hero entrances: CSS keyframes with `animation-fill-mode: both` and a delay custom property
  (`style={{ '--d': '0.42s' } as React.CSSProperties}`), plus the `.is-in` cleanup from
  `assets/motion-kit.css`. Add the failsafe (`motion-kit.js` → `MK.appear()`) in a `useEffect`.
- Framer Motion: scroll-linked effects (`useScroll`, `useTransform`), gestures, layout animations,
  and reveals *below* the fold, where `whileInView` with `viewport={{ once: true, amount: 0.2 }}` is fine.

## Tailwind setup

Put tokens in CSS variables (they need breakpoint overrides, which Tailwind arbitrary values
handle poorly) and reference them with arbitrary values: `text-[length:var(--h1)]`,
`h-[var(--btn-h)]`, `tracking-[-0.045em]`, `leading-[1.12]`.

Tailwind v4 (`@theme` in CSS):

```css
@import "tailwindcss";
@theme {
  --font-display: "Inter Tight", system-ui, sans-serif;
  --font-accent: "Newsreader", Georgia, serif;
  --ease-expo: cubic-bezier(.16,1,.3,1);
  --animate-in-mask: in-mask 1.05s var(--ease-expo) both;
}
@keyframes in-mask { from { transform: translateY(105%); } }
```

Tailwind v3: extend `theme.fontFamily`, `transitionTimingFunction` and `keyframes`/`animation` in
`tailwind.config.js`, and keep `motion-kit.css` as a global stylesheet.

Avoid the default-looking utilities that read as template: `rounded-2xl shadow-xl`,
`bg-gradient-to-r from-purple-500 to-pink-500`, `animate-bounce`, `blur-3xl` orbs.

## Framer Motion recipes

```tsx
const EASE = [0.16, 1, 0.3, 1] as const;

// FadeIn below the fold
export function FadeIn({ children, delay = 0, y = 30, x = 0, as = "div" }: Props) {
  const C = motion.create(as);
  return (
    <C initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }}
       viewport={{ once: true, margin: "50px", amount: 0 }}
       transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}>{children}</C>
  );
}

// Character scroll reveal
const ref = useRef(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
// each char i of n: opacity = useTransform(scrollYProgress, [i/n, (i+1)/n], [0.2, 1])

// Sticky stacking card i of n
const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.03]);
<motion.div style={{ scale, top: `calc(6rem + ${i * 28}px)` }} className="sticky" />
```

Use the `motion` package (`import { motion } from "motion/react"`) for new projects, or
`framer-motion` if the project already depends on it.

## Components worth extracting

`<MaskLine delay>` · `<Letters text kerning>` · `<MetalPill>` · `<ChromeButton>` · `<GlassButton>`
· `<Magnet padding strength>` · `<Grain />` · `<Scrim variant>` · `<HeroMedia src poster fallback>`

Keep them dumb (styling plus one behaviour each) and the composition in the page component, so the
archetype stays visible in one file.

## Next.js specifics

- Fonts via `next/font/google` with `subsets: ['latin', 'vietnamese']` when the page has Vietnamese.
  `next/font` fails at build time if the subset doesn't exist, which is a useful guard.
- Hero images via `next/image` with `priority`, `sizes="100vw"` and `fill` in a sized container.
- Canvas and WebGL backgrounds in a `"use client"` component, mounted in `useEffect`, with
  cleanup that cancels the RAF and removes listeners.
- Put the anti-flash background on `<html>` in `layout.tsx` (`className="bg-black"`) so the page never
  flashes white before CSS loads.
