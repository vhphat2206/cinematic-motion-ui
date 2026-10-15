# Typography

Type is where pages most often give away that a model made them: one family (Inter, Poppins or
Montserrat) at weight 700, default tracking, line-height 1.2, centred. Gallery pages use two faces
that disagree, tight display tracking and deliberate line breaks.

Contents
- Pairings by archetype
- Vietnamese glyph coverage (check before you choose)
- Scale and spacing rules
- Optical details that read as hand-made
- Overused faces

## Pairings by archetype

All of these are on Google Fonts. "VI" means the family ships a Vietnamese subset (verified against
the Google Fonts CSS API, Oct 2026).

| Archetype | Display / headline | Accent | Body / UI | Micro-copy |
|---|---|---|---|---|
| A Cinematic | Archivo 400–500 (VI) or a high-contrast serif title | — | Inter Tight (VI) | IBM Plex Mono (VI), JetBrains Mono (VI) |
| B Dark tech | Inter / Inter Tight 500 (VI), Geist 500 (VI) | Instrument Serif *italic* (no VI → Newsreader *italic* (VI)) | same as display | Geist Mono (VI) |
| C Editorial | Bodoni Moda / Gloock (no VI → Playfair (VI, the 2023 optical-size family), Noto Serif Display (VI)), or Archivo 800 at width 62–125 (VI), Anton (VI) | — | Inter Tight (VI) | IBM Plex Mono (VI) |
| D Character | Bricolage Grotesque 700–800 (VI), Kanit 800–900 (VI), Familjen Grotesk (VI) | — | same family at 400 | — |
| E Product | Inter Tight 500 (VI), Schibsted Grotesk (no VI → Hanken Grotesk (VI), Onest (VI)) | Newsreader *italic* (VI) | same family | tabular numerals |
| F HUD | Mona Sans / Hubot Sans wide (VI), Unbounded (VI) | — | Inter (VI) | Geist Mono (VI), Space Mono (VI) |
| G Expressive | UnifrakturMaguntia, Pirata One, Rubik Glitch, Monoton (none VI) → for VI use Big Shoulders Display (VI), Chakra Petch (VI), Saira Condensed (VI) with effects | — | Inter Tight (VI) | Space Mono (VI) |

How to use an accent face: a serif italic dropped onto one word of a sans headline is now the most
recognisable "tasteful AI" tic (see `anti-ai-tells.md` § Second-order tells), so treat the accent
column as optional. Better uses of a second face: a whole line or the mega wordmark in it, a mono
voice for data and labels, or a contrasting face for the brand name only. If you do accent a word,
it must be the word that carries the concept, sized `1.05–1.1em` (serif italics look small next to
grotesks), and the rest of the page must not repeat the trick.

## Vietnamese glyph coverage

If any visible text is Vietnamese, every face that renders it must have the Vietnamese subset.
Otherwise the browser substitutes a fallback for the accented letters and you get words in two
fonts, which looks broken.

Safe (VI subset): Inter, Inter Tight, Geist, Geist Mono, Be Vietnam Pro, Archivo, Anton,
Big Shoulders Display, Newsreader, Fraunces, Playfair, Playfair Display, Cormorant Garamond,
EB Garamond, Literata, Lora, Spectral, Crimson Pro, Noto Serif Display, Bricolage Grotesque,
Familjen Grotesk, Kanit, Manrope, Plus Jakarta Sans, Montserrat, Unbounded, Hanken Grotesk, Onest,
Lexend, Mona Sans, Hubot Sans, Roboto Flex, Epilogue, Darker Grotesque, Alexandria, Afacad Flux,
Chakra Petch, Oswald, Barlow Condensed, Saira Condensed, Encode Sans Condensed, IBM Plex Mono,
JetBrains Mono, Space Mono, Space Grotesk.

Not safe (no VI subset): Instrument Serif, Instrument Sans, Bodoni Moda, Gloock,
Libre Caslon Display, Italiana, Schibsted Grotesk, Sora, Poppins, DM Sans, DM Serif Display, DM Mono,
Martian Mono, Syne, Funnel Display, Host Grotesk, Young Serif, Red Hat Display, Bebas Neue,
Sofia Sans Condensed, and all the expressive faces in row G.

Check others with:
`curl -s -A "Mozilla/5.0 Chrome/126" "https://fonts.googleapis.com/css2?family=Font+Name" | grep -c "/\* vietnamese \*/"`
(1 or more = supported).

A face without VI is fine for a Latin-only word or brand name (a logo wordmark, "PARALLAX") even on
a Vietnamese page.

## Scale and spacing rules

| Role | Size (desktop 1440) | Tracking | Line-height |
|---|---|---|---|
| Mega word (archetype C) | 14–25 vw | −0.04 to −0.06em | 0.8–0.9 |
| Hero headline | 44–76 px (tokenised per breakpoint) | −0.035 to −0.05em | 1.0–1.12 |
| Lede | 15–18 px | −0.01 to −0.015em | 1.5–1.6 |
| Nav / buttons | 13–15 px | −0.01 to −0.02em | 1 |
| Badge | 12–13.5 px | −0.01em | 1 |
| Mono micro-copy | 11–14 px uppercase | −0.025em to +0.12em | 1.25 |

- Tracking tightens as size grows. Applying the same letter-spacing to every size is a tell.
- Line-height under 1.15 for anything above 40 px. Add
  `padding: .06em .15em .14em` to masked line wrappers so descenders and italic overhangs aren't
  clipped by `overflow: hidden`.
- Lede width 440–560 px. Long ledes kill the composition.
- Use `font-feature-settings: "ss01", "cv11"` (Inter's single-storey a and alternate digits) or
  `font-variant-numeric: tabular-nums` for prices and stats when the face supports it.

## Optical details that read as hand-made

- **Per-letter kerning on display words.** Wrap each letter in a span with an individual
  `margin-left` in scene units, set `font-kerning: none` and keep an `aria-label` on the parent
  (`<h1 aria-label="Parallax"><span aria-hidden="true" style="--k:1.5">P</span>…`). Even ±1–3 px
  per pair makes a wordmark look drawn.
- **Optical offsets.** Shift a logo up 3–5 px, nudge a centred nav 5 px left to balance a heavy
  right side, give button labels a 1 px top pad. Real designers make these corrections; generated
  layouts never do.
- **Mixed weights in the logo**: `Vesper` 600 plus `.ai` 400.
- **Deliberate line breaks**: break headlines by meaning with explicit line elements, not by
  container width.
- **Curly quotes and real dashes**: ’ “ ” — – ×. Straight quotes in display type look unfinished.

## Overused faces

These aren't banned, but as the *only* face they read as AI or template output: Inter alone, Poppins,
Montserrat, Space Grotesk, Plus Jakarta Sans, Sora, Manrope, Outfit, Playfair Display headlines
over Montserrat body, Cormorant Garamond "luxury". Using one is fine when paired with a strong
second face and real spacing decisions.
