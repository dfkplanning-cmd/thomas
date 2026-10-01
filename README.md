# Design Assistent

Mijn Design Assistent voor Claude Code. Alle 25 trucs uit *25 tricks to level up Claude Design*
(RoboNuggets) uitgewerkt tot skills, tools en vaste regels. Open deze map in Claude Code en begin
met:

```
/design-assistent welke tips passen bij mijn setup?
```

## Wat erin zit

**Skills** (`.claude/skills/`, aan te roepen als slash-commando):

| Commando | Tips | Wat het doet |
|---|---|---|
| `/design-assistent` | alle | Startpunt: kiest de juiste skill, checklist, alle bronnen |
| `/design-systeem` | 01, 02, 03, 04, 07 | Design system maken (ook van screenshot, deck of URL), Refero-stijlen, top drie, mixen, merk-skill |
| `/lettertype` | 05 | Font of fontpaar kiezen met licentiecheck |
| `/copy` | 06 | Copy-regels uit de top vijf van je niche |
| `/kie` | 08 | Beeld en video genereren via Kie AI, inclusief setup |
| `/referentie` | 09, 10 | Verder bouwen op eerder werk en op je referentiebibliotheek |
| `/deslop` | 11 | Audit en opschonen, met impeccable als dat geïnstalleerd is |
| `/mijn-toon` | 12 | Jouw tone of voice, leert van elke correctie |
| `/componenten` | 13, 14, 15, 19 | 21st.dev, React Bits, Canvas UI, Creators Toolbox |
| `/iconen` | 16, 17, 18 | Icon-packs downloaden, schone SVG, Lordicon-animaties |
| `/hig` | 20 | Apple's HIG met alle getallen |
| `/motion` | 21 | GSAP: scroll-reveals, pinned hero, smooth scrolling |
| `/design` | 22 | Ingebouwd in Claude Code, uitleg in `/design-assistent` |
| `/tweak` | 23 | Schuifjespaneel op elke HTML-pagina, daarna bakken |
| `/transcript-motion` | 24 | Whisper-transcript naar motion graphics met HyperFrames |
| `/design-os` | 25 | Je eigen design operating system |

**Tools:**

- `.claude/skills/tweak/tweak.py`: het tweak-paneel. `python3 .claude/skills/tweak/tweak.py pagina.html`
- `.claude/skills/iconen/iconify_pack.py`: download een hele iconset als SVG's. `python3 .claude/skills/iconen/iconify_pack.py tabler`
- `tools/referentie-extensie/`: Chrome-extensie. Eén klik bewaart screenshot, URL, titel en notitie; met galerij, zoeken, tags, licht en donker.
- `tools/design-os/`: Design OS. Tegels van al je ontwerpen, beelden, video's en elementen, zoeken op inhoud, kopiëren naar Claude.

**Regels die altijd gelden** staan in `CLAUDE.md`: design system eerst, geen standaardfont, geen
zelfgetekende iconen, SVG, GSAP, licenties checken.

## Installeren

1. **Skills**: niets te doen. Claude Code laadt `.claude/skills/` automatisch in deze map.
   Wil je ze in al je projecten? Kopieer de mappen naar `~/.claude/skills/`.
2. **Externe onderdelen** (impeccable, HyperFrames, Python-pakketten):
   ```bash
   bash scripts/installeer-extra.sh
   ```
3. **Chrome-extensie**: `chrome://extensions`, Developer mode aan, Load unpacked, kies
   `tools/referentie-extensie/`. Sneltoets Alt+Shift+S.
4. **Design OS**:
   ```bash
   python3 tools/design-os/design_os.py init       # drie vragen: mappen, thema, zoekfocus
   python3 tools/design-os/design_os.py index
   python3 tools/design-os/design_os.py describe --limit 20   # optioneel, vraagt ANTHROPIC_API_KEY
   python3 tools/design-os/design_os.py serve
   ```
5. **Kie AI** (beeld en video): zeg `/kie setup` in Claude Code. Eigen API-sleutel nodig, Kie rekent apart af.

## Eerste stappen

1. `/design-assistent welke tips passen bij mijn setup?`
2. `/design-systeem` voor je eigen merk, of plak een screenshot met "I love this. Turn it into a design system."
3. `/mijn-toon` vullen met vijf eigen teksten.
4. Bouw iets, sluit af met `/deslop` en `/tweak`.

Bekijk `CHECKLIST.md` voor de status per tip.

Bron: *25 Claude Design Tricks Guide*, RoboNuggets (https://www.skool.com/robonuggets).
