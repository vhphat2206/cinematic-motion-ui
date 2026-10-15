#!/usr/bin/env python3
"""Inline the motion kit and generative backgrounds into a single-file page.

Usage:
    python3 inline_kit.py <source.html> <output.html>
    python3 inline_kit.py --starter            # regenerate assets/starter.html from starter.src.html

Placeholders replaced (put them inside <style> / <script> tags):
    /*@@MOTION_KIT_CSS@@*/        -> assets/motion-kit.css
    /*@@MOTION_KIT_JS@@*/         -> assets/motion-kit.js
    /*@@BG:particle-wave@@*/      -> assets/backgrounds/particle-wave.js
    /*@@BG:shader-field@@*/       -> assets/backgrounds/shader-field.js
    /*@@BG:rings@@*/              -> assets/backgrounds/rings.js
Fails if a placeholder is unknown, so a typo never ships silently.
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))


def read(*p):
    text = open(os.path.join(ASSETS, *p), encoding="utf-8").read().strip()
    # A literal </script> or </style> inside inlined code closes the tag early and breaks the page.
    if "</script" in text.lower() or "</style" in text.lower():
        sys.exit(f"{'/'.join(p)} contains a closing </script> or </style> tag and cannot be inlined safely")
    return text


def inline(src):
    def sub(m):
        key = m.group(1)
        if key == "MOTION_KIT_CSS":
            return read("motion-kit.css")
        if key == "MOTION_KIT_JS":
            return read("motion-kit.js")
        if key.startswith("BG:"):
            name = key[3:]
            path = os.path.join(ASSETS, "backgrounds", name + ".js")
            if not os.path.exists(path):
                sys.exit(f"unknown background '{name}' (have: {', '.join(sorted(f[:-3] for f in os.listdir(os.path.join(ASSETS, 'backgrounds'))))})")
            return read("backgrounds", name + ".js")
        sys.exit(f"unknown placeholder @@{key}@@")
    return re.sub(r"/\*@@([A-Z_]+|BG:[a-z0-9-]+)@@\*/", sub, src)


def main():
    if sys.argv[1:] == ["--starter"]:
        src, out = os.path.join(ASSETS, "starter.src.html"), os.path.join(ASSETS, "starter.html")
    elif len(sys.argv) == 3:
        src, out = sys.argv[1], sys.argv[2]
    else:
        print(__doc__)
        sys.exit(2)
    html = inline(open(src, encoding="utf-8").read())
    open(out, "w", encoding="utf-8").write(html)
    print(f"wrote {out} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
