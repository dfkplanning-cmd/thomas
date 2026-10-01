#!/usr/bin/env python3
"""Download één complete Iconify-iconset als losse SVG-bestanden.

Gebruik:
    python3 .claude/skills/iconen/iconify_pack.py tabler                 # alles
    python3 .claude/skills/iconen/iconify_pack.py lucide --out assets/icons/lucide
    python3 .claude/skills/iconen/iconify_pack.py ph --filter "-duotone"  # alleen namen met dit stuk
    python3 .claude/skills/iconen/iconify_pack.py --info tabler           # licentie en aantal

Werkt via npm (pakket @iconify-json/<set>), dus geen API-sleutel nodig.
Populaire sets in één stijl: tabler, lucide, ph (Phosphor), heroicons, mingcute,
iconoir, solar, ri (Remix), material-symbols, fluent.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path


def fetch_set(prefix: str) -> dict:
    with tempfile.TemporaryDirectory() as tmp:
        result = subprocess.run(
            ["npm", "pack", f"@iconify-json/{prefix}", "--silent", "--pack-destination", tmp],
            capture_output=True, text=True,
        )
        if result.returncode != 0:
            sys.exit(f"Iconset '{prefix}' niet gevonden via npm.\n{result.stderr.strip()}")
        tgz = next(Path(tmp).glob("*.tgz"))
        with tarfile.open(tgz) as tar:
            data = json.load(tar.extractfile("package/icons.json"))
            info = json.load(tar.extractfile("package/info.json")) if "package/info.json" in tar.getnames() else {}
    data["_info"] = info
    return data


def to_svg(icon: dict, default_w: int, default_h: int) -> str:
    w = icon.get("width", default_w)
    h = icon.get("height", default_h)
    left = icon.get("left", 0)
    top = icon.get("top", 0)
    body = icon["body"]
    transforms = []
    if icon.get("hFlip"):
        transforms.append(f"translate({w + 2 * left} 0) scale(-1 1)")
    if icon.get("vFlip"):
        transforms.append(f"translate(0 {h + 2 * top}) scale(1 -1)")
    rotate = icon.get("rotate", 0) % 4
    if rotate:
        transforms.append(f"rotate({rotate * 90} {left + w / 2} {top + h / 2})")
    if transforms:
        body = f'<g transform="{" ".join(transforms)}">{body}</g>'
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" '
        f'viewBox="{left} {top} {w} {h}">{body}</svg>\n'
    )


def resolve(data: dict, name: str) -> dict | None:
    icons, aliases = data.get("icons", {}), data.get("aliases", {})
    if name in icons:
        return icons[name]
    alias = aliases.get(name)
    if not alias:
        return None
    parent = resolve(data, alias["parent"])
    return {**parent, **{k: v for k, v in alias.items() if k != "parent"}} if parent else None


def main() -> int:
    parser = argparse.ArgumentParser(description="Download een Iconify-iconset als SVG's")
    parser.add_argument("prefix", help="naam van de set, bv. tabler, lucide, ph")
    parser.add_argument("--out", help="doelmap (standaard assets/icons/<prefix>)")
    parser.add_argument("--filter", help="alleen iconen waarvan de naam dit bevat (regex)")
    parser.add_argument("--aliases", action="store_true", help="ook aliassen als bestand schrijven")
    parser.add_argument("--info", action="store_true", help="alleen info tonen")
    args = parser.parse_args()

    data = fetch_set(args.prefix)
    info = data["_info"]
    lic = info.get("license", {})
    print(f"{info.get('name', args.prefix)}: {info.get('total', len(data['icons']))} iconen, "
          f"licentie {lic.get('title', '?')} ({lic.get('url', '')})")
    if args.info:
        return 0

    names = list(data["icons"])
    if args.aliases:
        names += list(data.get("aliases", {}))
    if args.filter:
        rx = re.compile(args.filter)
        names = [n for n in names if rx.search(n)]

    out = Path(args.out or f"assets/icons/{args.prefix}")
    out.mkdir(parents=True, exist_ok=True)
    w, h = data.get("width", 16), data.get("height", 16)
    written = 0
    for name in names:
        icon = resolve(data, name)
        if not icon:
            continue
        (out / f"{name}.svg").write_text(to_svg(icon, w, h), encoding="utf-8")
        written += 1

    (out / "LICENSE.json").write_text(json.dumps(info, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{written} SVG's geschreven naar {out}/ (licentie-info in LICENSE.json)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
