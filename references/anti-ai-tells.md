# Anti AI tells

People spot generated pages within a second. They aren't analysing; they recognise a cluster of
defaults they have seen hundreds of times. Removing the cluster is most of the work. Replacing it
with decisions is the rest.

Contents
- Visual tells (with replacements)
- Second-order tells: the "tasteful AI" look
- Motion tells
- Copy tells (EN and VI phrase lists)
- Structural tells
- The squint test (use on screenshots)

`scripts/audit.py` detects many of these statically.

## Visual tells

| Tell | Why it reads as AI | Do instead |
|---|---|---|
| Purple/indigo → pink/blue gradients (`#8b5cf6`, `#6366f1`, `#a855f7`, `#ec4899`, Tailwind `from-purple-500 to-pink-500`) | It's the default "AI" palette of 2023–25 templates | Take the palette from the media or the brand; one accent at most |
| Blurred glowing orbs behind the hero (`absolute rounded-full blur-3xl opacity-30`) | Template filler that stands in for an idea | A real media layer (photo, video, generative field) |
| Inter/Poppins/Montserrat everywhere at weight 700 | No typographic decision was made | A pair from `typography.md`, weight 500 for large sans, tight tracking |
| Uniform `rounded-2xl shadow-xl` cards | Component-library default | A radius system per archetype; tone steps instead of shadows |
| Glassmorphism on every surface | Trend applied without reason | Glass on 1–2 controls over media |
| Gradient text on several headings | Decoration standing in for hierarchy | One emphasis device per headline |
| Lucide/Heroicons in rounded squares above feature titles | The most common generated section | Custom inline SVG, or no icons |
| Emoji in headings and buttons (✨🚀⚡) | Chat-style decoration | Typographic marks (✦ drawn as SVG), or nothing |
| Grey placeholder boxes, random stock photos | Unfinished | `media.md` decision order |
| Neon cyan or purple on black for anything "tech" | The cyberpunk default | Monochrome with a cool hover tint (archetype B) |
| Perfectly centred everything | No composition | Bottom-anchored copy, corners, asymmetry |
| Same padding everywhere (`py-24` for every section) | Spacing without rhythm | Tokenised gaps that vary by role |

## Second-order tells: the "tasteful AI" look

Once everyone avoids purple gradients, a second layer of defaults appears. It comes from the same
gallery prompts this skill learned from, copied thousands of times. In blind reviews (Oct 2026),
art directors flagged these on otherwise good pages and rated a stock gallery template as *more*
AI-looking than pages that avoided them:

| Trope | What reviewers said | Do instead |
|---|---|---|
| Sans headline with one serif-italic word ("Train *AI agents* on…", "The bugs *don't*.") | "the common AI-template tic", "the usual serif-italic move" | Scale or weight contrast, a line break, a concept-tied mark, or a single family set with conviction |
| Small pill badge above the headline ("✦ New", "Introducing…") | "template structure" | Put the label in the nav, a corner, or drop it |
| Three stats in a row at the bottom, or a numbered 01/02/03 strip | "a full checklist of current template tropes" | One fact, a small spec table, corner copy, or nothing |
| Glass pill nav, chrome + frosted button pair, grainy monochrome silk wave | "attractive but interchangeable", "stock motion-gallery material" | Materials and media that come from the subject (paper, code, water, metal of the actual product) |
| Mono micro-copy slogans in all four corners | "cheesy", "put-on" | Corner copy only when it carries real information (coordinates, time, issue number) |
| Hand-drawn underline under a key word | "a common AI 'tasteful' move" | A mark that means something in context (a red-pen squiggle under the actual bug) |
| AI-rendered imagery with obvious tells (book covers with fake titles, flat SVG "landscapes") | "covers look AI-generated", "flat and vector-like" | Real or carefully generated photography; textured, layered generative art |

What reviewers rewarded instead: **one concept that unifies image and type** (the dot under "ặ"
becomes a water drop; an architect's section drawing laid on the horizon; the product's own diff as
the hero image), **specific copy with a point of view**, **restraint and negative space**, and
**details that only this subject would have** (local time, survey coordinates, the bug that
double-charges a card).

## Motion tells

| Tell | Do instead |
|---|---|
| Every element fades up 20 px, 0.5 s, `ease`, same delay or a uniform 0.1 s stagger | Entrance vocabulary per element type, a delay table, expo-out |
| Content hidden until scroll (`opacity-0` plus an observer) | Visible at rest; hidden state added by JS only |
| `animate-bounce` arrows, pulsing CTA glows, floating cards on a loop | Ambient motion only in the media layer |
| Parallax on every image | One depth effect, on the hero subject |
| Typewriter headline | Masked line rise or letter rise |
| Hover: `scale-105` on everything | Shine sweep, border and glow change, magnet on one object |
| Counters animating fake numbers | Real numbers only, and count-up only if reduced motion is off |

## Copy tells

Generated copy names the category instead of the thing. Ban list (the audit flags these):

EN: unlock, unleash (unless it's the brand's real voice), elevate, empower, revolutionize,
supercharge, seamless(ly), effortless(ly), next-gen(eration), cutting-edge, game-changer,
transform your, take … to the next level, in today's fast-paced world, harness the power,
all-in-one platform, built for the future, your journey, dive into, look no further,
"Get Started" and "Learn More" as the only CTAs, "Trusted by 10,000+", lorem ipsum.

VI: nâng tầm, đột phá, toàn diện, giải pháp tối ưu, trải nghiệm tuyệt vời, khám phá ngay,
hành trình của bạn, kỷ nguyên số, dẫn đầu xu hướng, vượt trội, chỉ với vài cú nhấp chuột,
mở khóa tiềm năng, đồng hành cùng bạn, "Bắt đầu ngay" as the only CTA.

Do instead:
- Use the subject's nouns and a concrete verb: "Resorts drawn from the tide line", "Read every pull
  request before your team does", "Mười phút lặng mỗi sáng, không thông báo".
- Make CTAs say what happens: "Book a site visit", "Run it on a repo", "Nghe bài đầu tiên".
- Write micro-copy in the brand's voice (Parallex: "We don't fake art. / We make impacts.").
- Numbers come from the user. Otherwise use facts, not claims.

## Structural tells

- Badge → H1 → paragraph → two buttons → logo strip → three feature cards → testimonial
  carousel → pricing table → FAQ → footer, all centred. Even if each part is good, the sequence
  says "template". For a hero deliverable, stop at the hero. For landing pages, vary the section
  forms (sticky stack, horizontal marquee, editorial two-column, single giant statement).
- A navbar with five equal links plus "Sign in" and a gradient "Get started".
- A footer with four columns of links nobody asked for.

## The squint test

Look at each screenshot, then answer honestly:

1. **Blur your eyes.** Is there one dominant shape (the media or the word) and a clear reading
   path? Or is it a centred stack of evenly weighted blocks?
2. **Cover the logo.** Could this page belong to any other company in the category? If yes, the
   media, copy or type isn't specific enough.
3. **Find the decision.** Point to three things a designer clearly chose (a kerning tweak, a corner
   layout, a scrim shape, an odd but right size). If you can't, make some.
4. **Count the effects.** Gradient + glow + glass + shadow + emoji: more than two on one element is
   decoration.
5. **Watch the first 2 seconds** (screenshot at 0.3 s, 1 s and the end state if you can). Does it
   assemble in a meaningful order, or does everything just fade in together?
6. **Read the words aloud.** Would the actual founder say this sentence? Any phrase from the ban
   list?
7. **Check the edges.** At 1280×720 and 375 px, is anything clipped, crowded or overlapping?
