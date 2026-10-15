# Media

On galleries like MotionSites, most of the "wow" is the media: AI-generated stills and short video
loops with a consistent cinematic look (stills from image models, loops from video models). The UI
is designed around a specific image, not on top of a generic one.

Contents
- Decision order
- Generative backgrounds in this skill
- Using video well
- Using photographs well
- Writing generation prompts for the user
- What never to do

## Decision order

1. **User or project assets.** Look in the repo (`public/`, `assets/`, `static/`) and the brief.
2. **Generative layer** from `assets/backgrounds/`. Real motion that matches the palette, and it
   never looks like a placeholder:
   - `particle-wave.js`: a perspective field of points shaped by layered sines (archetype B).
   - `shader-field.js`: a WebGL domain-warped noise field in 2–4 colours with grain; slow and
     liquid, it works as a "dusk sky", "ink in water" or "molten metal" depending on colours (A, B, F).
   - `rings.js`: hairline arcs drawn from their midpoints, on their own or over a photo (A, C).
   Each one exposes options (colours, density, speed). Read the header comment in the file.
3. **Media slot.** When the concept needs a specific photo or video you can't produce, build the
   slot fully (correct aspect, scrim, layering, entrance) with a generative fallback inside it, and
   write the generation prompt (below) in a comment next to it and in your report.

## Generative backgrounds in this skill

Usage pattern (single file): paste the file's contents into a `<script>` at the end of `<body>`,
then call it:

```html
<div class="media" aria-hidden="true"><canvas id="bg"></canvas></div>
<script>/* contents of particle-wave.js */</script>
<script>ParticleWave(document.getElementById('bg'), { color: [235,238,245], rows: 46, cols: 170, speed: 1 });</script>
```

All three honour `prefers-reduced-motion` (one still frame), pause when the tab is hidden, cap DPR
at 2 and resize with the viewport. `shader-field.js` falls back to a CSS gradient when WebGL is
unavailable.

## Using video well

```html
<video class="hero-video" autoplay muted loop playsinline preload="metadata" poster="poster.jpg"
       aria-hidden="true" tabindex="-1"><source src="loop.mp4" type="video/mp4"></video>
```

- 5–10 s seamless loops, 1080p max for heroes, H.264 MP4 (plus WebM if you like), under about 4 MB.
- Always `muted playsinline` (iOS won't autoplay otherwise), always a poster (the first paint is
  the poster).
- `object-fit: cover; object-position` chosen for the subject (`center 30%` for faces).
- Crossfade from poster to video over 300 ms once it can play.
- Reduced motion: pause the video and keep the poster.
- Never put text over the busiest region of the loop. Look at several frames.

## Using photographs well

- One photograph per hero. Two photographs compete.
- The layout follows the photo: put text in the photo's negative space and draw lines that respond
  to its shapes (Parallex's rings echo the collar and the head).
- Cut-outs (PNG with alpha) in front of mega type create depth (archetype C).
- Serve `width`/`height` attributes and `decoding="async"`, and `fetchpriority="high"` on the hero image.

## Writing generation prompts for the user

Give one prompt per asset, specific about subject, lens, light, palette and composition (where the
negative space must be). Template:

```
<subject doing/being something specific>, <setting>, <time of day / light quality>,
<camera: 35mm / 85mm portrait / aerial drone / macro>, <composition: subject in right third,
empty sky upper-left for headline>, <palette: slate blue, bone, a single warm accent>,
<texture: film grain, soft halation>, editorial, cinematic, photographic, no text, no logo
Video: <one slow camera move: dolly-in 5% / orbit 10° / drift left>, seamless 6-second loop, 24 fps
```

Example: *"Sculptural black porcelain vase on raw clay, wood-fired kiln glow behind, late afternoon
side light, 85mm, vase in lower centre with empty upper half for a giant title, palette bone,
charcoal, ember orange, fine film grain, editorial still life, photographic, no text."*

## Generated illustration quality

Code-drawn scenes (SVG mountains, canvas landscapes) read as flat vector clip-art unless you add
atmospheric perspective (each layer lighter and lower-contrast with distance), texture (noise,
grain, subtle gradients inside shapes), irregular silhouettes (seeded noise, not regular polygons)
and light that agrees across layers (one sun direction, reflections that match). For a real place
or product, a photograph or a carefully generated still beats any code-drawn scene. Build the media
slot and give the user the generation prompt.

## What never to do

- Random stock URLs (`source.unsplash.com`, `picsum.photos`, `placehold.co`, `via.placeholder.com`):
  broken or irrelevant images in production, and an instant sign of an unfinished template.
- Grey rectangles labelled "Image".
- Blurred gradient orbs (`blur-3xl` circles in purple, pink or blue) as the hero media.
- Emoji or clip-art as illustrations.
- A dark overlay at 60 % over the whole photo "for readability". Use a shaped scrim instead.
