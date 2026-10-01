#!/usr/bin/env python3
"""Design Assistent /tweak: schuifjes op een HTML-pagina, daarna bakken.

Gebruik:
    python3 .claude/skills/tweak/tweak.py pad/naar/pagina.html [--port 8765] [--no-open]

Wat het doet:
  * Serveert de map van de pagina op localhost, zodat relatieve assets werken.
  * Injecteert in de geserveerde kopie (niet op schijf) het tweak-paneel en
    een data-tweak-id op elke sectie, zodat je secties kunt verbergen.
  * Bij "Bake" schrijft het de gekozen waarden terug:
      - gewijzigde CSS-variabelen in het eerste :root-blok waar ze staan
        (inline <style> of een lokaal gelinkt .css-bestand);
      - algemene instellingen in een <style id="tweak-baked">-blok;
      - verborgen secties worden uit de HTML verwijderd.
    Er wordt eerst een .bak-kopie gemaakt. Het paneel zelf komt nooit op schijf.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import threading
import webbrowser
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

HERE = Path(__file__).resolve().parent
PANEL_JS = HERE / "panel.js"

SECTION_TAGS = {"header", "nav", "section", "footer", "aside", "article"}
CONTAINER_PARENTS = {"body", "main"}
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


class SectionFinder(HTMLParser):
    """Vindt secties en hun exacte positie (start en einde) in de bron."""

    def __init__(self, source: str):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.line_offsets = [0]
        for m in re.finditer("\n", source):
            self.line_offsets.append(m.end())
        self.stack: list[dict] = []
        self.sections: list[dict] = []
        self.styles: list[tuple[int, int]] = []  # (start, end) van inhoud <style>
        self._style_start: int | None = None
        self.stylesheets: list[str] = []
        self.head_close: int | None = None

    def _offset(self) -> int:
        line, col = self.getpos()
        return self.line_offsets[line - 1] + col

    def handle_starttag(self, tag, attrs):
        start = self._offset()
        text = self.get_starttag_text() or ""
        attrs_d = dict(attrs)
        if tag == "link" and "stylesheet" in (attrs_d.get("rel") or "").lower():
            href = attrs_d.get("href") or ""
            if href and not re.match(r"^(https?:)?//", href):
                self.stylesheets.append(href)
        if tag == "style":
            self._style_start = start + len(text)
        if tag in VOID_TAGS or text.endswith("/>"):
            return
        parent = self.stack[-1]["tag"] if self.stack else None
        is_section = (
            tag in SECTION_TAGS
            or "data-section" in attrs_d
            or (parent in CONTAINER_PARENTS and tag == "div")
        )
        node = {
            "tag": tag,
            "start": start,
            "tag_end": start + len(text),
            "section": is_section,
        }
        self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        # <x/> zonder inhoud: nooit een sectie
        attrs_d = dict(attrs)
        if tag == "link" and "stylesheet" in (attrs_d.get("rel") or "").lower():
            href = attrs_d.get("href") or ""
            if href and not re.match(r"^(https?:)?//", href):
                self.stylesheets.append(href)

    def handle_endtag(self, tag):
        pos = self._offset()
        close = self.source.find(">", pos)
        end = close + 1 if close != -1 else pos
        if tag == "style" and self._style_start is not None:
            self.styles.append((self._style_start, pos))
            self._style_start = None
        if tag == "head" and self.head_close is None:
            self.head_close = pos
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]["tag"] == tag:
                node = self.stack[i]
                del self.stack[i:]
                if node["section"]:
                    node["end"] = end
                    self.sections.append(node)
                break


def analyse(source: str) -> SectionFinder:
    finder = SectionFinder(source)
    finder.feed(source)
    finder.close()
    finder.sections.sort(key=lambda n: n["start"])
    for i, node in enumerate(finder.sections):
        node["id"] = i
    return finder


def served_html(source: str) -> str:
    """Bron + data-tweak-id op elke sectie + het paneel-script."""
    finder = analyse(source)
    out = source
    for node in sorted(finder.sections, key=lambda n: n["tag_end"], reverse=True):
        insert_at = node["tag_end"] - 1
        if out[insert_at - 1] == "/":
            insert_at -= 1
        out = out[:insert_at] + f' data-tweak-id="{node["id"]}"' + out[insert_at:]
    script = '<script src="/__tweak/panel.js" defer></script>'
    idx = out.lower().rfind("</body>")
    if idx == -1:
        return out + script
    return out[:idx] + script + out[idx:]


ROOT_BLOCK = re.compile(r":root\s*\{([^}]*)\}")


def replace_var(css: str, name: str, value: str) -> tuple[str, bool]:
    """Vervangt --name in het eerste :root-blok dat hem bevat."""
    pattern = re.compile(r"(" + re.escape(name) + r"\s*:\s*)([^;}]+)")
    for block in ROOT_BLOCK.finditer(css):
        body = block.group(1)
        m = pattern.search(body)
        if m:
            start = block.start(1) + m.start(2)
            end = block.start(1) + m.end(2)
            return css[:start] + value + css[end:], True
    return css, False


def bake(html_path: Path, payload: dict) -> dict:
    source = html_path.read_text(encoding="utf-8")
    shutil.copyfile(html_path, html_path.with_suffix(html_path.suffix + ".bak"))
    finder = analyse(source)
    report = {"vars_inline": [], "vars_css": [], "vars_new": [], "removed": 0}

    variables: dict = payload.get("vars") or {}
    remaining = dict(variables)

    # 1. Variabelen in inline <style>-blokken
    edits: list[tuple[int, int, str]] = []
    for start, end in finder.styles:
        css = source[start:end]
        changed = False
        for name, value in list(remaining.items()):
            css, ok = replace_var(css, name, value)
            if ok:
                changed = True
                report["vars_inline"].append(name)
                del remaining[name]
        if changed:
            edits.append((start, end, css))

    # 2. Variabelen in lokaal gelinkte css-bestanden
    for href in finder.stylesheets:
        if not remaining:
            break
        css_path = (html_path.parent / unquote(href.split("?")[0])).resolve()
        if not css_path.is_file() or html_path.parent.resolve() not in css_path.parents:
            continue
        css = css_path.read_text(encoding="utf-8")
        changed = False
        for name, value in list(remaining.items()):
            css, ok = replace_var(css, name, value)
            if ok:
                changed = True
                report["vars_css"].append(f"{name} ({css_path.name})")
                del remaining[name]
        if changed:
            shutil.copyfile(css_path, css_path.with_suffix(css_path.suffix + ".bak"))
            css_path.write_text(css, encoding="utf-8")

    # 3. Verborgen secties verwijderen (buitenste wint)
    hidden = {int(i) for i in payload.get("hidden") or []}
    spans = sorted(
        (n["start"], n["end"]) for n in finder.sections if n["id"] in hidden and "end" in n
    )
    merged: list[tuple[int, int]] = []
    for s, e in spans:
        if merged and s < merged[-1][1]:
            continue
        merged.append((s, e))
    for s, e in merged:
        edits.append((s, e, ""))
        report["removed"] += 1

    # 4. Algemene instellingen + variabelen die nergens stonden
    rules: list[str] = []
    if remaining:
        decls = "".join(f"\n  {k}: {v};" for k, v in remaining.items())
        rules.append(f":root {{{decls}\n}}")
        report["vars_new"] = list(remaining)
    rules.extend(payload.get("rules") or [])

    # Edits van achter naar voor toepassen zodat offsets kloppen
    edits.sort(key=lambda t: t[0], reverse=True)
    out = source
    last_start = len(out) + 1
    for start, end, text in edits:
        if end > last_start:  # overlap (bv. <style> binnen verwijderde sectie)
            continue
        out = out[:start] + text + out[end:]
        last_start = start

    out = re.sub(r'\s*<style id="tweak-baked">.*?</style>', "", out, flags=re.S)
    if rules:
        block = '<style id="tweak-baked">\n' + "\n".join(rules) + "\n</style>\n"
        idx = out.lower().find("</head>")
        out = out[:idx] + block + out[idx:] if idx != -1 else block + out

    html_path.write_text(out, encoding="utf-8")
    return report


def make_handler(html_path: Path):
    root = html_path.parent

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(root), **kwargs)

        def log_message(self, fmt, *args):  # stil, behalve fouten
            if args and str(args[1]).startswith(("4", "5")):
                super().log_message(fmt, *args)

        def _send(self, body: bytes, ctype: str, status: int = 200):
            self.send_response(status)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            path = urlparse(self.path).path
            if path == "/__tweak/panel.js":
                return self._send(PANEL_JS.read_bytes(), "text/javascript; charset=utf-8")
            if path in ("/", "/" + html_path.name):
                html = served_html(html_path.read_text(encoding="utf-8"))
                return self._send(html.encode("utf-8"), "text/html; charset=utf-8")
            return super().do_GET()

        def do_POST(self):
            if urlparse(self.path).path != "/__tweak/bake":
                return self._send(b"not found", "text/plain", 404)
            length = int(self.headers.get("Content-Length", "0"))
            try:
                payload = json.loads(self.rfile.read(length) or b"{}")
                report = bake(html_path, payload)
                print("Gebakken:", json.dumps(report, ensure_ascii=False))
                self._send(json.dumps({"ok": True, **report}).encode(), "application/json")
            except Exception as exc:  # fout terug naar het paneel
                self._send(json.dumps({"ok": False, "error": str(exc)}).encode(), "application/json", 500)

    return Handler


def main() -> int:
    parser = argparse.ArgumentParser(description="Tweak-paneel voor een HTML-pagina")
    parser.add_argument("html", help="pad naar het HTML-bestand")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-open", action="store_true", help="browser niet openen")
    args = parser.parse_args()

    html_path = Path(args.html).resolve()
    if not html_path.is_file():
        print(f"Bestand niet gevonden: {html_path}", file=sys.stderr)
        return 1

    server = ThreadingHTTPServer(("127.0.0.1", args.port), make_handler(html_path))
    url = f"http://127.0.0.1:{args.port}/{html_path.name}"
    print(f"Tweak draait op {url}  (Ctrl+C om te stoppen)")
    if not args.no_open:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
