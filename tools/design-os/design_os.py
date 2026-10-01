#!/usr/bin/env python3
"""Design OS: één pagina met al je ontwerpen, beelden, video's en elementen.

Commando's:
    python3 tools/design-os/design_os.py init       # stelt de drie vragen, schrijft config.json
    python3 tools/design-os/design_os.py index      # scant de mappen (snel, gratis)
    python3 tools/design-os/design_os.py describe   # laat een vision-model elk beeld beschrijven
    python3 tools/design-os/design_os.py serve      # opent de pagina op http://127.0.0.1:8790

`describe` gebruikt de Anthropic API (pip install anthropic, plus ANTHROPIC_API_KEY of
`ant auth login`). Beschrijvingen worden bewaard en alleen opnieuw gemaakt als een bestand
verandert. Begin met één map: de eerste keer kost het even tijd en wat modelgebruik.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import mimetypes
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import webbrowser
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

HERE = Path(__file__).resolve().parent
CONFIG_PATH = HERE / "config.json"
INDEX_DIR = HERE / ".index"
INDEX_PATH = INDEX_DIR / "index.json"
UI_PATH = HERE / "index.html"

IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"}
VIDEO_EXT = {".mp4", ".mov", ".webm", ".m4v"}
MODEL_3D_EXT = {".glb", ".gltf"}
SKIP_DIRS = {".git", "node_modules", ".next", "dist", "build", ".cache", "__pycache__", ".index"}

DEFAULT_CONFIG = {
    "folders": ["~/Downloads/DesignAssistent"],
    "design_folders": [],
    "theme": "auto",
    "search_focus": "inhoud",
    "model": "claude-opus-5-5",
    "max_file_mb": 200,
}

DESCRIBE_SCHEMA = {
    "type": "object",
    "properties": {
        "description": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "colors": {"type": "array", "items": {"type": "string"}},
        "kind": {"type": "string"},
    },
    "required": ["description", "tags", "colors", "kind"],
    "additionalProperties": False,
}

DESCRIBE_PROMPT = (
    "Je indexeert een design-bibliotheek. Beschrijf dit bestand zodat iemand het later "
    "terugvindt door te zoeken op wat erin staat. Geef: description (1 tot 2 zinnen, Nederlands, "
    "concreet: onderwerp, compositie, stijl, sfeer, tekst die erin staat), tags (5 tot 10 korte "
    "Nederlandse zoekwoorden, kleine letters), colors (2 tot 5 hoofdkleuren als hex), kind "
    "(een van: foto, illustratie, ui, logo, icoon, diagram, mockup, 3d, typografie, overig)."
)


# ---------------------------------------------------------------- config

def load_config() -> dict:
    cfg = dict(DEFAULT_CONFIG)
    if CONFIG_PATH.exists():
        cfg.update(json.loads(CONFIG_PATH.read_text(encoding="utf-8")))
    return cfg


def expand(p: str) -> Path:
    return Path(os.path.expandvars(os.path.expanduser(p))).resolve()


def cmd_init(args) -> int:
    cfg = load_config()
    print("Design OS instellen. Enter = huidige waarde houden.\n")
    folders = input(f"1. Welke mappen indexeren? (komma-gescheiden)\n   [{', '.join(cfg['folders'])}] ").strip()
    if folders:
        cfg["folders"] = [f.strip() for f in folders.split(",") if f.strip()]
    designs = input(
        f"   Welke daarvan bevatten afgemaakte ontwerpen (HTML-pagina's, exports)?\n"
        f"   [{', '.join(cfg['design_folders']) or 'geen'}] "
    ).strip()
    if designs:
        cfg["design_folders"] = [f.strip() for f in designs.split(",") if f.strip()]
    theme = input(f"2. Donker, licht of auto? [{cfg['theme']}] ").strip().lower()
    if theme in {"donker", "dark"}:
        cfg["theme"] = "dark"
    elif theme in {"licht", "light"}:
        cfg["theme"] = "light"
    elif theme == "auto":
        cfg["theme"] = "auto"
    focus = input(
        f"3. Waar zoek je het meest op? inhoud / naam / kleur / tags [{cfg['search_focus']}] "
    ).strip().lower()
    if focus in {"inhoud", "naam", "kleur", "tags"}:
        cfg["search_focus"] = focus
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\nOpgeslagen in {CONFIG_PATH}")
    return 0


# ---------------------------------------------------------------- index

def load_index() -> dict:
    if INDEX_PATH.exists():
        return json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    return {"items": {}, "updated": None}


def save_index(index: dict) -> None:
    INDEX_DIR.mkdir(exist_ok=True)
    index["updated"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    tmp = INDEX_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(INDEX_PATH)


def is_lottie(path: Path) -> bool:
    if path.stat().st_size > 5_000_000:
        return False
    try:
        head = path.read_text(encoding="utf-8", errors="ignore")[:4000]
    except OSError:
        return False
    return '"layers"' in head and '"v"' in head and '"fr"' in head


def html_title(path: Path) -> str:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")[:20000]
    except OSError:
        return ""
    m = re.search(r"<title[^>]*>(.*?)</title>", text, re.S | re.I)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def classify(path: Path, in_design_folder: bool) -> str | None:
    ext = path.suffix.lower()
    if ext in {".html", ".htm"}:
        return "ontwerp" if in_design_folder else None
    if ext in IMAGE_EXT:
        if path.with_suffix(".json").exists():
            return "referentie"
        return "ontwerp" if in_design_folder else "beeld"
    if ext in VIDEO_EXT:
        return "video"
    if ext == ".svg" or ext in MODEL_3D_EXT:
        return "element"
    if ext == ".json" and is_lottie(path):
        return "element"
    return None


def sidecar(path: Path) -> dict:
    """Metadata uit de referentie-extensie (zelfde naam, .json)."""
    side = path.with_suffix(".json")
    if path.suffix.lower() == ".json" or not side.exists():
        return {}
    try:
        data = json.loads(side.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return {k: data.get(k) for k in ("url", "title", "note", "tags", "site") if data.get(k)}


def item_id(path: Path) -> str:
    return hashlib.sha1(str(path).encode()).hexdigest()[:16]


def cmd_index(args) -> int:
    cfg = load_config()
    index = load_index()
    old = index["items"]
    items: dict = {}
    design_roots = [expand(d) for d in cfg["design_folders"]]
    max_bytes = cfg["max_file_mb"] * 1024 * 1024

    for folder in cfg["folders"] + cfg["design_folders"]:
        root = expand(folder)
        if not root.is_dir():
            print(f"Overgeslagen (bestaat niet): {root}")
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
            for name in filenames:
                path = Path(dirpath) / name
                try:
                    st = path.stat()
                except OSError:
                    continue
                if st.st_size > max_bytes:
                    continue
                in_design = any(r == path or r in path.parents for r in design_roots)
                category = classify(path, in_design)
                if not category:
                    continue
                iid = item_id(path)
                if iid in items:
                    continue
                prev = old.get(iid, {})
                fresh = prev.get("mtime") == st.st_mtime and prev.get("size") == st.st_size
                item = {
                    "id": iid,
                    "path": str(path),
                    "name": path.name,
                    "folder": str(path.parent),
                    "ext": path.suffix.lower().lstrip("."),
                    "category": category,
                    "size": st.st_size,
                    "mtime": st.st_mtime,
                    "lottie": path.suffix.lower() == ".json",
                }
                if path.suffix.lower() in {".html", ".htm"}:
                    item["title"] = html_title(path)
                item.update(sidecar(path))
                if fresh:
                    for key in ("description", "ai_tags", "colors", "kind"):
                        if key in prev:
                            item[key] = prev[key]
                items[iid] = item

    index["items"] = items
    save_index(index)
    counts: dict = {}
    for it in items.values():
        counts[it["category"]] = counts.get(it["category"], 0) + 1
    todo = sum(1 for it in items.values() if "description" not in it and describable(it))
    print(f"Geïndexeerd: {len(items)} bestanden {counts}")
    print(f"Nog te beschrijven: {todo}  (python3 {Path(__file__).name} describe)")
    return 0


# ---------------------------------------------------------------- describe

def describable(item: dict) -> bool:
    ext = "." + item["ext"]
    return ext in IMAGE_EXT or ext in VIDEO_EXT or ext in {".svg", ".html", ".htm"}


def image_block(data: bytes, media_type: str) -> dict:
    return {"type": "image", "source": {"type": "base64", "media_type": media_type,
                                         "data": base64.standard_b64encode(data).decode()}}


def shrink(path: Path) -> tuple[bytes, str] | None:
    """Verkleint naar max 1568 px (scheelt tokens). Zonder Pillow: alleen kleine bestanden."""
    try:
        from PIL import Image  # type: ignore
    except ImportError:
        media = mimetypes.guess_type(path.name)[0] or ""
        if media in {"image/png", "image/jpeg", "image/gif", "image/webp"} and path.stat().st_size < 4_500_000:
            return path.read_bytes(), media
        return None
    try:
        with Image.open(path) as im:
            im.seek(0)
            im = im.convert("RGB")
            im.thumbnail((1568, 1568))
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=85)
            return buf.getvalue(), "image/jpeg"
    except Exception:
        return None


def video_frame(path: Path) -> tuple[bytes, str] | None:
    if not shutil.which("ffmpeg"):
        return None
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / "frame.jpg"
        cmd = ["ffmpeg", "-loglevel", "error", "-ss", "1", "-i", str(path), "-frames:v", "1",
               "-vf", "scale='min(1280,iw)':-2", str(out)]
        if subprocess.run(cmd).returncode != 0 or not out.exists():
            return None
        return out.read_bytes(), "image/jpeg"


def content_for(item: dict) -> list | None:
    path = Path(item["path"])
    ext = "." + item["ext"]
    extra = ""
    if item.get("note"):
        extra = f"\nNotitie van de gebruiker: {item['note']}"
    if ext in IMAGE_EXT:
        img = shrink(path)
        return [image_block(*img), {"type": "text", "text": DESCRIBE_PROMPT + extra}] if img else None
    if ext in VIDEO_EXT:
        frame = video_frame(path)
        if not frame:
            return None
        return [image_block(*frame), {"type": "text", "text": DESCRIBE_PROMPT + "\nDit is een frame uit een video." + extra}]
    if ext == ".svg":
        svg = path.read_text(encoding="utf-8", errors="ignore")[:30000]
        return [{"type": "text", "text": DESCRIBE_PROMPT + "\nHet bestand is deze SVG-code:\n\n" + svg}]
    if ext in {".html", ".htm"}:
        html = path.read_text(encoding="utf-8", errors="ignore")
        text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()[:6000]
        return [{"type": "text", "text": DESCRIBE_PROMPT + "\nHet is een HTML-ontwerp met deze tekst:\n\n" + text}]
    return None


def cmd_describe(args) -> int:
    try:
        import anthropic
    except ImportError:
        print("Installeer eerst de SDK: pip install anthropic", file=sys.stderr)
        return 1
    cfg = load_config()
    index = load_index()
    if not index["items"]:
        print("Index is leeg. Draai eerst: index")
        return 1
    todo = [it for it in index["items"].values() if describable(it) and ("description" not in it or args.force)]
    if args.limit:
        todo = todo[: args.limit]
    if not todo:
        print("Alles is al beschreven.")
        return 0
    print(f"{len(todo)} bestanden beschrijven met {cfg['model']}...")

    client = anthropic.Anthropic()
    done = 0
    for n, item in enumerate(todo, 1):
        content = content_for(item)
        if content is None:
            print(f"  [{n}/{len(todo)}] overgeslagen (formaat): {item['name']}")
            continue
        try:
            response = client.beta.messages.create(
                model=cfg["model"],
                max_tokens=2000,
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",
                output_config={"effort": "low", "format": {"type": "json_schema", "schema": DESCRIBE_SCHEMA}},
                messages=[{"role": "user", "content": content}],
            )
        except anthropic.AuthenticationError:
            print("Geen geldige API-sleutel. Zet ANTHROPIC_API_KEY of draai `ant auth login`.", file=sys.stderr)
            return 1
        except TypeError as exc:
            if "authentication" in str(exc).lower():
                print("Geen API-sleutel gevonden. Zet ANTHROPIC_API_KEY of draai `ant auth login`.", file=sys.stderr)
                return 1
            raise
        except anthropic.RateLimitError:
            print("  Rate limit bereikt. Wat klaar is, is bewaard; draai describe later opnieuw.")
            break
        except anthropic.APIStatusError as exc:
            print(f"  [{n}/{len(todo)}] API-fout {exc.status_code}: {item['name']}")
            continue
        except anthropic.APIConnectionError:
            print("  Geen verbinding met de API. Gestopt; wat klaar is, is bewaard.")
            break
        if response.stop_reason == "refusal":
            print(f"  [{n}/{len(todo)}] geweigerd: {item['name']}")
            continue
        text = next((b.text for b in response.content if b.type == "text"), "")
        try:
            data = json.loads(text)
        except ValueError:
            print(f"  [{n}/{len(todo)}] onleesbaar antwoord: {item['name']}")
            continue
        item["description"] = data["description"]
        item["ai_tags"] = [t.lower() for t in data["tags"]]
        item["colors"] = data["colors"]
        item["kind"] = data["kind"]
        done += 1
        print(f"  [{n}/{len(todo)}] {item['name']}: {data['description'][:80]}")
        if done % 10 == 0:
            save_index(index)
    save_index(index)
    print(f"Klaar: {done} beschreven.")
    return 0


# ---------------------------------------------------------------- serve

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def _send(self, body: bytes, ctype: str, status: int = 200, extra: dict | None = None):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        url = urlparse(self.path)
        if url.path == "/":
            return self._send(UI_PATH.read_bytes(), "text/html; charset=utf-8")
        if url.path == "/api/index":
            cfg = load_config()
            index = load_index()
            payload = {
                "items": list(index["items"].values()),
                "updated": index.get("updated"),
                "theme": cfg["theme"],
                "search_focus": cfg["search_focus"],
            }
            return self._send(json.dumps(payload, ensure_ascii=False).encode(), "application/json")
        if url.path == "/file":
            iid = parse_qs(url.query).get("id", [""])[0]
            item = load_index()["items"].get(iid)
            if not item or not Path(item["path"]).is_file():
                return self._send(b"niet gevonden", "text/plain", 404)
            return self._file(Path(item["path"]))
        return self._send(b"niet gevonden", "text/plain", 404)

    def _file(self, path: Path):
        ctype = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        if ctype == "text/html":
            ctype = "text/html; charset=utf-8"
        size = path.stat().st_size
        rng = self.headers.get("Range")
        start, end = 0, size - 1
        status = 200
        if rng and (m := re.match(r"bytes=(\d*)-(\d*)", rng)):
            if m.group(1):
                start = int(m.group(1))
                end = int(m.group(2)) if m.group(2) else size - 1
            else:
                start = max(0, size - int(m.group(2)))
            end = min(end, size - 1)
            status = 206
        length = end - start + 1
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(length))
        self.send_header("Accept-Ranges", "bytes")
        if status == 206:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        with path.open("rb") as f:
            f.seek(start)
            remaining = length
            while remaining > 0:
                chunk = f.read(min(1 << 16, remaining))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    return
                remaining -= len(chunk)


def cmd_serve(args) -> int:
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    url = f"http://127.0.0.1:{args.port}/"
    print(f"Design OS draait op {url}  (Ctrl+C om te stoppen)")
    if not args.no_open:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Design OS")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init", help="mappen, thema en zoekfocus instellen")
    sub.add_parser("index", help="mappen scannen")
    d = sub.add_parser("describe", help="beelden laten beschrijven door een vision-model")
    d.add_argument("--limit", type=int, default=0, help="maximaal zoveel bestanden (0 = alles)")
    d.add_argument("--force", action="store_true", help="ook al beschreven bestanden opnieuw doen")
    s = sub.add_parser("serve", help="de pagina openen")
    s.add_argument("--port", type=int, default=8790)
    s.add_argument("--no-open", action="store_true")
    args = parser.parse_args()
    return {"init": cmd_init, "index": cmd_index, "describe": cmd_describe, "serve": cmd_serve}[args.cmd](args)


if __name__ == "__main__":
    sys.exit(main())
