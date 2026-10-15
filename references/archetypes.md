# Archetypes

Seven compositions recur across the ~440 premium hero templates on motionsites.ai. Pick one per page.
Mixing two usually produces the average you are trying to avoid; if you must, take the composition
from one and only the palette from another.

Contents
- A. Cinematic full-bleed
- B. Dark monochrome tech
- C. Editorial mega-type
- D. Character stage
- E. Bright product / service
- F. HUD over scene
- G. Expressive display
- Choosing quickly

Each entry gives a composition sketch, type, palette starting points (adjust, don't copy), materials,
the signature motion, the media and the traps.

---

## A. Cinematic full-bleed

*A photograph or film still is the page. The UI is a thin frame of text at the edges.*

When: fashion, hospitality, architecture, real estate, travel, creative agencies, personal brands,
anything with a strong image.

```
┌───────────────────────────────────────────────┐
│ EVERY SPARK IS        [px ═══]     WE FORM IT │  ← mono micro-copy in corners,
│ A FRESH IMPACT.                 INTO SOMETHING│    compact black nav centred
│                                               │
│              (full-bleed photo)               │
│        ◜ thin arcs / lines drawn over ◝       │
│                  P A R A L L A X              │  ← title small or huge, letters
│                                               │    kerned individually
│ [SEE CAMPAIGN ]                               │
│ [VIEW ALL     ]                  THEN WE RUN  │
│ WE DON'T FAKE ART.               IT IN PRINT  │
└───────────────────────────────────────────────┘
```

- Type: mono for micro-copy (11–14 px, uppercase, −0.02em to +0.08em) plus one display face for the
  title. Or a high-contrast serif title with a light grotesk for the rest.
- Palette: take it from the photograph. Ink is usually pure white or near-black; panels are solid
  black or solid white, never translucent grey.
- Materials: solid black panels and buttons that invert on hover. No glass, no gradients.
- Signature motion: the copy lines rise out of masks in quadrants, the nav wipes open from its
  centre, buttons wipe from the left, and thin SVG lines draw outward from their midpoints. The
  photo itself is already there at t=0 and never moves.
- Media: one strong portrait, landscape or interior; video loops of 5–10 s also work.
- Responsive: artboard scaling (`references/responsive.md` § Artboard) keeps the photo in cover
  mode while the chrome stays anchored to its edges.
- Traps: putting the text in a dark card; centring everything; adding a second photo.

## B. Dark monochrome tech

*Black field, a luminous abstract form (wave, particles, fibre, bloom), grey type.*

When: AI, developer tools, infrastructure, security, data, fintech that wants gravity.

```
┌───────────────────────────────────────────────┐
│ ◐ Vesper.ai    [Benefits][How][FAQ][Pricing]  [Start] │  ← 1fr|auto|1fr grid,
│                                               │    metal pills
│        ~~~~ particle / light wave ~~~~        │
│                                               │
│            ✦ Operational AI Infrastructure    │  ← metal badge
│        Train *AI agents* on your              │  ← sans 500 + serif italic,
│           workflows in minutes.               │    muted
│      grey lede, max 470 px                    │
│        [Start for free] [See it in action]    │  ← chrome solid + glass ghost
│                                               │
│ ▣ 4.2M+ workflows   ▣ 92% less manual   ▣ 180+ teams │
└───────────────────────────────────────────────┘
```

- Type: Inter, Inter Tight or Geist at weight 500 with −0.045em tracking. The gallery original adds
  an Instrument Serif italic word in muted grey; that move is now so widely copied that it reads as
  AI (see `anti-ai-tells.md` § Second-order tells). Get contrast from scale, a mono voice, or the
  product itself instead.
- Palette: `#000` or `#050505` background, `#fff` ink, `#9a9a9a` muted, `#d8d8d8` stats. Accent at
  most one cool tint in hover glows (`rgba(186,208,255,.35)`).
- Materials: liquid-metal pills, a chrome solid button, a frosted ghost button, a metal badge with a
  sparkle icon, grain.
- Signature motion: an entrance table of about 15 elements, 0.08 s to 1.44 s, with mixed entrance
  types; the serif word un-blurs a beat after its line rises.
- Media: particle wave or point cloud (`assets/backgrounds/particle-wave.js`), a dark shader field,
  or a monochrome video loop.
- Traps: neon cyan or purple on black (the "cyberpunk default"); glowing orbs; a feature-card grid
  under the hero; shipping the sketch above unchanged. The badge + serif-italic + three-stat recipe
  is the most copied hero on the web. Keep the craft (materials, motion, scrims) and replace at least
  two of those elements with something from the subject. The strongest B pages in testing made the
  product the image, e.g. a real code diff with the bug marked in red.

## C. Editorial mega-type

*A single word, set enormous, interlocks with the subject: the title sits behind a statue, books
fan out in front of it, or letters are cut by the frame.*

When: publishing, fashion, galleries, studios, luxury goods, music, any brand with a strong name.

```
┌───────────────────────────────────────────────┐
│ Foliom        Catalog  Editions  Hub    [Build list] │
│                                               │
│      F o l i o m          ← 18–25vw serif or grotesk,
│   ╱╱╱ subject in front ╲╲╲    subject overlaps lower half
│                                               │
│   (Romance)(Short story)(Memoir)(Classic)     │  ← small chips or one line
└───────────────────────────────────────────────┘
```

- Type: the display face is the whole identity. Use a high-contrast serif (Bodoni Moda, Gloock,
  Instrument Serif at weight 400) or a heavy grotesk or condensed face (Archivo at 800–900 with its
  width axis, Anton, Big Shoulders). Body is a quiet sans at 13–15 px.
- Palette: two values only (black and bone, or white and ink) plus the subject's own colour.
- Materials: none. Hairline rules (1 px at 15–20 % alpha) and plain text links.
- Signature motion: letters rise one by one (38 ms stagger) or the word's tracking eases from wide
  to tight; the subject scales from 1.06 to 1 with a slight blur-in; a depth layer (subject cut-out
  over text) is the "wow".
- Media: a subject with a clean silhouette. A cut-out PNG layered in front of the word is the
  classic trick; overlap is what makes it feel art-directed.
- Traps: the word fitting neatly inside the frame (crop or bleed it); mixing in decorative fonts.

## D. Character stage

*A 3D character or mascot on a saturated solid stage, talking to the visitor.*

When: playful consumer apps, education, creative studios, kids and family, games, personal
portfolios with a 3D avatar.

```
┌───────────────────────────────────────────────┐
│ Mentora°                 Live  Courses  Pricing  [Join] │
│ Hey there, I'm your                            │
│ guide. Tell me what      (3D character,        │
│ you want to learn →       60% of the height,   │
│ [chip][chip][chip]         right of centre)    │
│                                               │
└───────────────────────────────────────────────┘
```

- Type: a friendly but tight grotesk (Bricolage Grotesque, Familjen Grotesk, Kanit at 800–900
  uppercase for big names) at sizes that feel like dialogue. Avoid rounded "kids" fonts unless the
  audience really is children.
- Palette: one saturated stage colour (tomato `#e8483b`, cobalt `#2b4bff`, lime `#c6f432`) plus
  white or black ink. The character supplies the other colours.
- Materials: pills with a soft inner shadow, chips. A gradient pill CTA works here
  (`references/materials.md` § Gradient pill).
- Signature motion: the character pops in (scale 0.9 → 1.03 → 1) with a magnetic hover that
  follows the cursor; speech-bubble lines type or rise in; chips stagger.
- Media: a rendered character (PNG with alpha, or a short loop). If none is available, use type and
  colour alone rather than an emoji or a clip-art blob.
- Traps: Pixar-style character plus a SaaS feature grid; pastel gradients behind the character.

## E. Bright product / service

*Light page, the product photographed beautifully, information set like a catalogue.*

When: cars, dental and medical clinics, real estate listings, e-commerce, devices, food, services.

```
┌───────────────────────────────────────────────┐
│ ■ brand           Fleet  Experience  Contact [Reserve] │
│                                               │
│      A private collection, not a car park:    │  ← one serif or grotesk line,
│      S-Class to Continental GT, each detailed │    a few words in italic
│                                               │
│   🚗──────── product on white ────────🚗       │
│  ‹  Mercedes S-Class   [spec] [spec]  $300 [Reserve] › │  ← info rail
└───────────────────────────────────────────────┘
```

- Type: a neutral grotesk (Inter Tight, Schibsted Grotesk, Geist) with optional italic serif
  accents; tabular numerals for prices and specs.
- Palette: `#f4f4f2` to `#ffffff` background, `#111` ink, one brand accent used on the primary
  button only. Shadows soft and low (`0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06)`).
- Materials: white cards with hairline borders, black solid buttons, segmented controls.
- Signature motion: the product slides in on a long ease (1.2 s) as the info rail wipes up; a
  carousel crossfades products with a short horizontal drift.
- Media: product cut-outs on white or studio shots with a consistent light direction.
- Traps: three equal feature cards under the hero; blue "trust" gradients; stock smiling people.

## F. HUD over scene

*A 3D or aerial scene with glass widgets (gauges, counters, toggles) floating at its edges.*

When: mobility, energy, smart cities, space, IoT, logistics, games, anything with live data.

```
┌───────────────────────────────────────────────┐
│ [▲ Axle] (Home)(City)(Design)(Projects)   [Book ⌗] │
│ ┌─────┐                                  ( + ) │
│ │ 4K  │      (isometric city / planet)    ( ◎ ) │
│ │ -42 │                                       │
│ │ 88% │   Less friction.                      │
│ └─────┘   More possibility.     ┌──────────┐  │
│                                 │ caption  │  │
└───────────────────────────────────────────────┘
```

- Type: a technical grotesk or mono for numbers (Geist Mono, IBM Plex Mono, Martian Mono) with a
  big rounded grotesk statement.
- Palette: the scene's palette plus white glass. Orange or electric accents on data only.
- Materials: frosted glass widgets (`backdrop-filter: blur(16–24px)`, 1 px white at 18–30 % alpha,
  radius 18–28 px), circular icon buttons.
- Signature motion: widgets fly in from their own edges with a slight overshoot; numbers count up
  (respect reduced motion); gauges draw their arcs.
- Media: an isometric or aerial render, a planet, a 3D map. Video loops of a slow camera drift work.
- Traps: too many widgets (3–5 is enough); fake real-time data presented as real.

## G. Expressive display

*A distinctive display face (blackletter, distorted, retro, brutal) over a strong scene.*

When: music, fashion drops, gaming, streetwear, festivals, "unleash" energy brands.

- Type: one expressive face for the headline only (UnifrakturMaguntia, Pirata One, Rubik Glitch,
  Bagel Fat One, Monoton), with a plain grotesk everywhere else.
- Palette: high contrast, often black or white with the scene's colour.
- Motion: a glitch or character scramble on the headline (once, 600–900 ms); a hard cut rather
  than a fade for the scene; marquee strips.
- Traps: using the expressive face for body text; adding more than one expressive device.

---

## Choosing quickly

| The brief has… | Archetype |
|---|---|
| A strong photo or video of the subject | A |
| An abstract or technical product, no photography | B (or F if there is live data) |
| A great name or word, a cultural product | C |
| A mascot, a 3D character, a playful audience | D |
| A physical product or service that people compare | E |
| Data, maps, vehicles, space, live state | F |
| A loud, youth or culture brand | G |

When unsure between two, pick the one whose **signature moment** you can describe more vividly.
