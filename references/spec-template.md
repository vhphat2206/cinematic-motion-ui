# Spec template

Premium prompt galleries sell *specifications*, not ideas: one hero screen is described in
15–40 KB of exact values (fonts with fallbacks, every colour, the layer order, every hover state,
a motion table, a breakpoint table, even "count the path elements, there must be 12"). Writing a
compact version of that before coding is what keeps the build from sliding back to defaults.

Contents
- Direction card (step 1)
- Build spec (step 2)
- Prompt form (when the user wants a prompt for another builder)
- Worked example (abridged)

---

## Direction card

```
Subject & audience : <who, in the user's nouns>
Archetype          : <A–G> because <one reason>
Mood               : <three words; not modern/clean/sleek>
Palette            : bg #…  ink #…  muted #…  accent #… (used on: …)
Type               : display <face, weight, tracking> · accent <face> · UI <face> · micro <face>
Signature moment   : <one sentence someone would retell>
Media              : <user asset | generative: which | slot + generation prompt>
Language           : <en | vi | …>  → glyph check: <faces OK?>
```

## Build spec

Keep each section short; values, not sentences.

```
1. Scope
   - Deliverable: <single HTML file | component in src/... | route>
   - Out of scope: <what NOT to add: extra sections, forms, pricing, footer, WebGL…>

2. Tokens (reference width 1440)
   --bg --ink --muted --line --accent
   --display --lede --nav --btn --btn-h --badge --micro
   --pad-x --pad-y --hero-gap --copy-max --lede-max
   radius system: <e.g. 0 / 6 / 999>

3. Layer stack (back → front) and markup order
   bg · media (+ ::after scrim: <gradient>) · page grid (auto 1fr auto) · grain (z 100)
   body > .grain, .media, .page > header, main.hero, footer

4. Components (each with every state)
   Header   : <grid 1fr|auto|1fr | corner layout> …
   Logo     : <mark svg description, wordmark weights>
   Nav      : <items, material, hover, active>
   CTA(s)   : <solid: … hover: …> <ghost: … hover: …>
   Badge    : …
   Headline : line 1 "…" / line 2 "…", accent word(s): …
   Lede     : "…"
   Footer   : <stats | corner copy | chips> (+ which are placeholders)
   Mobile menu: <burger size, overlay, link style, close behaviour>

5. Motion table
   | element | entrance | delay | duration |
   | logo    | scale .84→1 | .08 | 1.05 |
   | …       | …           | …   | …    |
   Ambient : <media loop, speed>
   Hover   : <what, duration>
   Scroll  : <none | effect + range>
   Reduced : <what stays, what stops>

6. Breakpoints (token overrides)
   ≥1920 · ≥1600 · 1280–1599 · 901–1279 · ≥901 & max-height 850 · ≥901 & max-height 720 · ≤900 · ≤560

7. JS (only this)
   1. … 2. …

8. Self-check
   <e.g. "all text visible with JS disabled", "no horizontal scroll at 375", "accent used ≤3 times">
```

## Prompt form

When the user wants a prompt to paste into another builder (Lovable, Bolt, v0, AI Studio, Claude),
turn the spec into prose-with-values in this order. These prompts work because they leave the
builder nothing to guess:

1. Opening line: "Recreate this exact <single-viewport hero / landing page> for <Brand>. Document
   title: `…`. Language `…`. <stack: one HTML file with inline CSS and a small script | React + TS +
   Tailwind + Framer Motion>." Then the out-of-scope list ("No extra sections, cards, forms…; do not
   add WebGL; do not invent asset URLs").
2. Anti-flash: background colour on `html, body` as the very first rule.
3. Fonts: exact families, weights, `font-display`, the Google Fonts URL, and fallback stacks.
4. Assets: exact URLs or file names, and "no other images; all icons are inline SVG".
5. Tokens block.
6. Layer stack and markup order.
7. Each component: CSS values and every state.
8. Motion: keyframes, the element/delay table, easing curves, the fallback rules and reduced motion.
9. Responsive table.
10. "JS (only this)" list.
11. Output rule and self-check ("Count the path elements. If not 12, the file is wrong.").

## Worked example (abridged)

```
Subject & audience : Mộc Kiln, a wood-fired ceramics studio in Bát Tràng; for collectors and restaurants
Archetype          : C (the name is short and the pieces have strong silhouettes)
Mood               : ash-glazed, patient, tactile
Palette            : bg #ece6dc  ink #1d1a17  muted #7b7268  accent #b4532a (kiln flame; used on the
                     single CTA and the hover underline only)
Type               : display Playfair 400 opsz 144, −0.05em, 22vw · UI Inter Tight 400 · micro
                     IBM Plex Mono 400 uppercase 12px +0.06em (all VI)
Signature moment   : a cut-out vase stands in front of the giant word "MỘC"; on load the letters
                     rise one by one behind it while the vase settles from 1.06 to 1 and un-blurs
Media              : user's vase photo (cut-out PNG) + a slow grain layer; no video
Language           : vi → Playfair, Inter Tight, IBM Plex Mono all VI ✓
```
