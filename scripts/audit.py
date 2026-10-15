#!/usr/bin/env python3
"""Static audit for AI-template tells and motion robustness in web UI source.

Usage:
    python3 audit.py <file-or-directory> [more paths…] [--json]

Scans .html .htm .css .scss .js .jsx .ts .tsx .vue .svelte .astro .mdx files (skipping node_modules,
dist, build, .next). Prints findings grouped by severity:

  HIGH    : very likely to read as AI-made or to break (fix these)
  MEDIUM  : common template signals (fix, or keep deliberately and say why)
  LOW     : polish

Exit code 1 if any HIGH finding exists, else 0. Heuristic: a clean report does not mean the page is
good. Always look at screenshots.
"""
import json
import os
import re
import sys

EXTS = {".html", ".htm", ".css", ".scss", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".astro", ".mdx"}
SKIP_DIRS = {"node_modules", "dist", "build", ".next", ".git", ".svelte-kit", "out", "coverage", "vendor"}

COPY_EN = [
    r"\bunlock(?:ing)? (?:the|your)\b", r"\belevate (?:your|the)\b", r"\bempower(?:s|ing)? (?:your|you|teams)\b",
    r"\brevolutioni[sz]e\b", r"\bsupercharge\b", r"\bseamless(?:ly)?\b", r"\beffortless(?:ly)?\b",
    r"\bnext[- ]gen(?:eration)?\b", r"\bcutting[- ]edge\b", r"\bgame[- ]chang(?:er|ing)\b",
    r"\btransform your\b", r"\bto the next level\b", r"\bfast[- ]paced (?:world|digital)\b",
    r"\bharness the power\b", r"\ball[- ]in[- ]one platform\b", r"\bbuilt for the future\b",
    r"\blook no further\b", r"\bdive (?:into|deep)\b", r"\blorem ipsum\b", r"\bin today's\b",
    r"\bunleash (?:the|your)\b", r"\bstreamline your\b", r"\bboost your\b",
]
COPY_VI = [
    r"nâng tầm", r"đột phá", r"toàn diện", r"giải pháp tối ưu", r"trải nghiệm tuyệt vời", r"khám phá ngay",
    r"hành trình của bạn", r"kỷ nguyên số", r"dẫn đầu xu hướng", r"vượt trội", r"chỉ với vài cú nhấp",
    r"mở khóa tiềm năng", r"đồng hành cùng bạn", r"tối ưu hóa trải nghiệm",
]
AI_PURPLES = ["#8b5cf6", "#7c3aed", "#6d28d9", "#a855f7", "#9333ea", "#6366f1", "#4f46e5", "#818cf8",
              "#c084fc", "#ec4899", "#d946ef", "#a78bfa"]
OVERUSED_FONTS = ["Poppins", "Montserrat", "Space Grotesk", "Plus Jakarta Sans", "Sora", "Manrope", "Outfit"]
NO_VI_FONTS = ["Instrument Serif", "Instrument Sans", "Bodoni Moda", "Gloock", "Libre Caslon Display", "Italiana",
               "Schibsted Grotesk", "Sora", "Poppins", "DM Sans", "DM Serif Display", "DM Mono", "Martian Mono",
               "Syne", "Funnel Display", "Host Grotesk", "Young Serif", "Red Hat Display", "Bebas Neue",
               "UnifrakturMaguntia", "Pirata One", "Rubik Glitch", "Bagel Fat One", "Monoton"]
EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿\U0001F680-\U0001F6FF]")
VI_CHARS = re.compile(r"[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]", re.I)


def files_in(paths):
    for p in paths:
        if os.path.isfile(p):
            yield p
        else:
            for root, dirs, fs in os.walk(p):
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
                for f in fs:
                    if os.path.splitext(f)[1].lower() in EXTS:
                        yield os.path.join(root, f)


def line_of(text, idx):
    return text.count("\n", 0, idx) + 1


def visible_text(src):
    """Rough visible text: strip <script>/<style> blocks and tags (good enough for phrase checks)."""
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", src, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return s


def audit(paths):
    findings = []
    corpus = {}
    for f in files_in(paths):
        try:
            corpus[f] = open(f, encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
    allsrc = "\n".join(corpus.values())
    low_all = allsrc.lower()

    def add(sev, rule, msg, f=None, line=None):
        findings.append({"severity": sev, "rule": rule, "message": msg, "file": f, "line": line})

    for f, src in corpus.items():
        low = src.lower()
        ext = os.path.splitext(f)[1].lower()
        text = visible_text(src) if ext in {".html", ".htm", ".vue", ".svelte", ".astro"} else src

        # Copy clichés
        for pat in COPY_EN + COPY_VI:
            for m in re.finditer(pat, text, flags=re.I):
                add("MEDIUM", "copy-cliche", f'Cliché phrase "{m.group(0)}": use the subject\'s concrete nouns and verbs', f,
                    line_of(src, src.lower().find(m.group(0).lower())))
                break
        for m in re.finditer(r">\s*(Get Started|Learn More|Bắt đầu ngay)\s*<", src, flags=re.I):
            add("LOW", "generic-cta", f'Generic CTA "{m.group(1)}": say what happens next', f, line_of(src, m.start()))

        # Placeholder media
        for pat in [r"picsum\.photos", r"source\.unsplash\.com", r"placehold\.co", r"via\.placeholder\.com",
                    r"placeholder\.com", r"dummyimage\.com", r"placekitten"]:
            m = re.search(pat, low)
            if m:
                add("HIGH", "placeholder-media", f"Placeholder/random stock image service ({m.group(0)})", f, line_of(src, m.start()))

        # AI palette
        hits = [c for c in AI_PURPLES if c in low]
        tw = re.findall(r"\b(?:from|via|to)-(?:purple|violet|indigo|fuchsia|pink)-\d{3}\b", src)
        if len(hits) >= 2 or (hits and tw) or len(tw) >= 2:
            add("HIGH", "ai-palette", f"Default 'AI' purple/indigo/pink palette ({', '.join(hits + tw[:3])})", f)

        # Glow orbs
        for m in re.finditer(r"rounded-full[^\"'>]*blur-(?:2xl|3xl)|blur-(?:2xl|3xl)[^\"'>]*rounded-full", src):
            add("HIGH", "glow-orb", "Blurred gradient orb used as decoration", f, line_of(src, m.start()))
            break
        if re.search(r"border-radius:\s*50%[^}]*filter:\s*blur\((?:[4-9]\d|\d{3})px\)", low, flags=re.S):
            add("HIGH", "glow-orb", "Blurred circle (filter: blur ≥ 40px) used as decoration", f)

        # Emoji in headings / buttons
        for m in re.finditer(r"<(h[1-3]|button|a)\b[^>]*>(.*?)</\1>", src, flags=re.S | re.I):
            if EMOJI.search(m.group(2)):
                add("MEDIUM", "emoji-ui", f"Emoji inside <{m.group(1)}>", f, line_of(src, m.start()))
                break

        # Second-order "tasteful AI" tells (need judgement, so LOW)
        for m in re.finditer(r"<h1\b[^>]*>(.*?)</h1>", src, flags=re.S | re.I):
            if re.search(r"<(em|i)\b", m.group(1), flags=re.I):
                add("LOW", "accent-word-trope", "Headline contains an <em>/<i> accent word. A serif-italic accent inside a sans headline is the most recognisable 'tasteful AI' tic; keep it only if it carries the concept", f, line_of(src, m.start()))
                break
        if re.search(r">\s*(?:✦|✨|★)?\s*(?:New|Introducing|Now live|Mới)\b[^<]{0,40}<", src):
            add("LOW", "badge-trope", "'New / Introducing' pill above the headline is template furniture", f)

        # Template motion
        for cls in ["animate-bounce", "animate-pulse", "animate-ping"]:
            if cls in src:
                add("MEDIUM", "template-motion", f"{cls} on UI: keep ambient motion in the media layer", f, line_of(src, src.find(cls)))
        if re.search(r"transition:\s*all\b", low):
            add("LOW", "transition-all", "transition: all, list the properties", f, line_of(low, low.find("transition: all")))

        # Uniform radius / shadows (Tailwind)
        n2xl = len(re.findall(r"\brounded-(?:2xl|3xl)\b", src))
        nsh = len(re.findall(r"\bshadow-(?:xl|2xl)\b", src))
        if n2xl >= 6:
            add("MEDIUM", "uniform-radius", f"rounded-2xl/3xl used {n2xl}×: pick a radius system for the archetype", f)
        if nsh >= 4:
            add("MEDIUM", "heavy-shadows", f"shadow-xl/2xl used {nsh}×: prefer tone steps", f)
        if len(re.findall(r"\bmd:grid-cols-3\b|\blg:grid-cols-3\b", src)) >= 2:
            add("MEDIUM", "three-card-grid", "Multiple 3-column card grids: the most common generated section", f)

        # Fake proof
        if re.search(r"★★★★★|⭐⭐⭐⭐⭐|trusted by\s+[\d,.]+\s*\+?|[\d,.]+\+?\s+(?:happy\s+)?(?:customers|users|clients)\b", text, flags=re.I):
            add("MEDIUM", "unverified-proof", "Ratings/'trusted by N' claims: only use numbers the user supplied", f)

        # Fonts without Vietnamese glyphs on a Vietnamese page
        if VI_CHARS.search(text):
            for fam in NO_VI_FONTS:
                if re.search(re.escape(fam), src) or re.search(re.escape(fam.replace(" ", "+")), src):
                    add("HIGH", "font-no-vietnamese", f'"{fam}" has no Vietnamese subset but the page has Vietnamese text', f)

    # Cross-file checks
    if corpus:
        anim_present = bool(re.search(r"@keyframes|\.animate\(|animation\s*:|framer-motion|motion/react|gsap", allsrc))
        if anim_present and "prefers-reduced-motion" not in low_all and "usereducedmotion" not in low_all:
            add("HIGH", "no-reduced-motion", "Animations present but no prefers-reduced-motion handling")
        if anim_present and not re.search(r"cubic-bezier|\[0?\.\d+,\s*[\d.]+,\s*0?\.\d+,\s*[\d.]+\]|ease-expo|power\d", allsrc):
            add("MEDIUM", "default-easing", "No custom easing curve found: entrances use default ease")
        # Content hidden at rest, revealed only by JS
        hidden_rest = re.search(r"\.(?:reveal|fade-?in|animate-on-scroll|hidden-init)\s*\{[^}]*opacity:\s*0", low_all)
        tw_hidden = len(re.findall(r'class(?:Name)?="[^"]*\bopacity-0\b[^"]*"', allsrc))
        if hidden_rest or tw_hidden >= 3:
            add("HIGH", "hidden-at-rest", "Content is opacity:0 at rest and depends on JS to appear: make the hidden state opt-in (keyframe 'from' with fill-mode both, or an html.js-* class)")
        fams = set(m.strip(" '\"").split(",")[0].strip(" '\"") for m in re.findall(r"font-family\s*:\s*([^;}{]+)", allsrc))
        fams |= set(m.replace("+", " ") for m in re.findall(r"family=([A-Za-z+]+)", allsrc))
        fams = {x for x in fams if x and not x.startswith("var(") and x.lower() not in {"inherit", "system-ui", "sans-serif", "serif", "monospace", "-apple-system"}}
        if len(fams) == 1:
            only = next(iter(fams))
            sev = "MEDIUM" if only in OVERUSED_FONTS + ["Inter"] else "LOW"
            add(sev, "single-typeface", f'Only one typeface ("{only}"): pair it with a contrasting face')
        for fam in OVERUSED_FONTS:
            if fam in fams and len(fams) <= 2:
                add("LOW", "overused-font", f'"{fam}" is common in generated pages: make sure it is a deliberate choice')
        if "<video" in low_all:
            for m in re.finditer(r"<video\b[^>]*>", allsrc, flags=re.I):
                tag = m.group(0).lower()
                missing = [a for a in ["muted", "playsinline", "poster"] if a not in tag]
                if missing:
                    add("MEDIUM", "video-attrs", f"<video> missing {', '.join(missing)} (iOS autoplay / first paint)")
                    break
        if re.search(r"<html", low_all) and "viewport" not in low_all:
            add("HIGH", "no-viewport", "Missing <meta name=viewport>")
    return findings


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    as_json = "--json" in sys.argv
    if not args:
        print(__doc__)
        sys.exit(2)
    fs = audit(args)
    order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    fs.sort(key=lambda x: order[x["severity"]])
    if as_json:
        print(json.dumps({"findings": fs, "counts": {k: sum(1 for f in fs if f["severity"] == k) for k in order}}, ensure_ascii=False, indent=2))
    else:
        if not fs:
            print("No findings. Now look at the screenshots: a clean audit is necessary, not sufficient.")
        for f in fs:
            loc = ""
            if f["file"]:
                loc = f"  ({os.path.basename(f['file'])}{':' + str(f['line']) if f['line'] else ''})"
            print(f"[{f['severity']:<6}] {f['rule']}: {f['message']}{loc}")
        c = {k: sum(1 for f in fs if f["severity"] == k) for k in order}
        print(f"\n{c['HIGH']} high · {c['MEDIUM']} medium · {c['LOW']} low")
    sys.exit(1 if any(f["severity"] == "HIGH" for f in fs) else 0)


if __name__ == "__main__":
    main()
