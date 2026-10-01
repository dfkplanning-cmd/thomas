---
name: design-os
description: Het eigen design operating system van de gebruiker. Eén lokale pagina die elk afgemaakt ontwerp als tegel toont, elk beeld en elke video indexeert met een beschrijving van een vision-model, laat zoeken op inhoud, naam, kleur of tag, en elk bestand met één klik naar een Claude-chat kopieert. Gebruik bij "/design-os", "waar was dat ontwerp", "zoek in mijn assets", "open mijn bibliotheek", "indexeer mijn map".
argument-hint: "[init | index | describe | serve]"
---

# Design OS (tip 25)

Hier komt alles samen: ontwerpen, gegenereerde beelden en video's, referenties en de
elementenbibliotheek (SVG-iconen, Lottie-animaties, 3D-bestanden). De tool staat in
`tools/design-os/`.

Oorspronkelijke prompt: *"Build me a local design OS: one HTML page that shows every finished design
as a tile, indexes every image and video on my machine by describing what's in it with a vision
model, lets me search by content, and copies any asset into a Claude chat with one click. Ask me
three questions first: which folders, dark or light, and what I search by most."*

## Eerste keer: de drie vragen

Stel deze drie vragen in één bericht (of laat de gebruiker `init` draaien, dat vraagt hetzelfde):
1. **Welke mappen?** En welke daarvan bevatten afgemaakte ontwerpen (HTML-pagina's, exports)?
   Tip: begin met één map. De referentie-extensie bewaart in `~/Downloads/DesignAssistent/referenties`.
2. **Donker of licht?** (of auto, volgt het systeem)
3. **Waar zoek je het meest op?** inhoud, naam, kleur of tags. Dat bepaalt de zoekweging.

Schrijf de antwoorden naar `tools/design-os/config.json`:
```json
{
  "folders": ["~/Downloads/DesignAssistent"],
  "design_folders": ["~/Projecten/ontwerpen"],
  "theme": "dark",
  "search_focus": "inhoud",
  "model": "claude-opus-5-5",
  "max_file_mb": 200
}
```

## Commando's

```bash
python3 tools/design-os/design_os.py index      # scant de mappen, snel en gratis
python3 tools/design-os/design_os.py describe   # vision-model beschrijft elk beeld (kost modelgebruik)
python3 tools/design-os/design_os.py serve      # http://127.0.0.1:8790
```

- `describe` vraagt `pip install anthropic` en een API-sleutel (`ANTHROPIC_API_KEY` of
  `ant auth login`). Optioneel `pip install pillow` (verkleint beelden, scheelt tokens) en
  `ffmpeg` (beschrijft video's via een frame). Probeer eerst `describe --limit 20`.
- Beschrijvingen worden bewaard in `tools/design-os/.index/` en alleen opnieuw gemaakt als een
  bestand verandert. `--force` doet alles opnieuw.
- Het model staat in `config.json`. Wil de gebruiker het goedkoper, dan kan daar een kleiner
  model staan.

## Wat de pagina doet

- Tabs: Ontwerpen, Beelden, Video, Elementen, Referenties.
- Zoeken op wat erin staat, op naam, op tag, en op kleur (typ een hex-code zoals `#e8590c`,
  of klik een kleurstaal).
- **Kopieer voor Claude**: beelden gaan als PNG naar het klembord (direct plakken in een chat),
  SVG, HTML en Lottie als code, de rest als pad met beschrijving.
- Video's spelen bij hover, HTML-ontwerpen tonen een live miniatuur. Klik voor groot.
- `/` springt naar het zoekveld.

## Als Claude zelf iets zoekt

Lees `tools/design-os/.index/index.json` direct: elk item heeft `path`, `category`, `description`,
`ai_tags`, `colors`, `kind`, en bij referenties `url`, `note`, `tags`. Bekijk de beste treffers met
Read voordat je ze gebruikt.

## Gewoonte

Na elk afgemaakt ontwerp: bewaar de export in een geïndexeerde map en draai `index`. Zo begint
elke nieuwe build bij je eigen werk.
