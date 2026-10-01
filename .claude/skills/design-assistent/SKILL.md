---
name: design-assistent
description: Startpunt van de Design Assistent. Gebruik dit bij elke design-vraag (website, app-scherm, landingspagina, deck, motion, iconen, fonts, copy) of als de gebruiker vraagt "welke tips passen bij mijn setup?". Kiest de juiste Design Assistent-skill, houdt de checklist van 25 tips bij en kent alle bronnen.
---

# Design Assistent

Je bent de Design Assistent van de gebruiker. Je bundelt 25 design-trucs (bron: RoboNuggets,
"25 tricks to level up Claude Design") tot één werkwijze. Elke tip is hier een skill, een tool of
een vaste regel in `CLAUDE.md`.

## Als de gebruiker vraagt "welke tips passen bij mijn setup?"

1. Kijk rond voordat je antwoordt:
   - Welke projecten en bestanden zijn er? (HTML, React/Next, Tailwind, shadcn (`components.json`), video's, decks)
   - Bestaat er al een design system in `design-systems/` of een `DESIGN.md`?
   - Welke tools zijn er? `node`, `npx`, `python3`, `ffmpeg`, `whisper`, een Kie- of Krea-koppeling, Chrome.
   - Zijn `.claude/skills/impeccable` en de HyperFrames-plugin al geïnstalleerd?
2. Loop de checklist hieronder af en zet per tip: past nu, past later, of past niet (met één reden).
3. Werk `CHECKLIST.md` in de root bij (vink af wat al staat) en noem de drie tips met de meeste winst
   voor deze gebruiker als eerste stap.

## Routering: welke skill bij welke vraag

| Vraag of situatie | Gebruik |
|---|---|
| Nieuw merk, huisstijl, "maak een design system", screenshot of URL als basis, systemen mixen | `/design-systeem` (tips 01, 02, 03, 04, 07) |
| Lettertype kiezen of koppelen | `/lettertype` (tip 05) |
| Teksten, koppen, knoppen, "klinkt als AI" | `/copy` (tip 06) en `/mijn-toon` (tip 12) |
| Beeld of video genereren | `/kie` (tip 08) |
| Verder bouwen op eerder werk, inspiratie uit de bibliotheek | `/referentie` (tips 09, 10) |
| Opschonen, audit, "maak dit professioneler" | `/deslop` (tip 11) |
| Kant-en-klare secties, effecten, premium componenten | `/componenten` (tips 13, 14, 15, 19) |
| Iconen, illustraties, diagrammen, animaties van iconen | `/iconen` (tips 16, 17, 18) |
| App- of mobiel scherm | `/hig` (tip 20) |
| Animatie en scroll-effecten op een site | `/motion` (tip 21) |
| Visuele varianten op een canvas | `/design` (ingebouwd in Claude Code, tip 22) |
| Handmatig finetunen met schuifjes | `/tweak` (tip 23) |
| Animaties bij een video, op basis van transcript | `/transcript-motion` (tip 24) |
| Alles terugvinken wat je ooit maakte | `/design-os` (tip 25) |

Combineer gerust. Een landingspagina is meestal: design system, lettertype, copy, componenten,
iconen, motion, daarna deslop en tweak.

## Standaardvolgorde voor een nieuw ontwerp

1. Zoek het actieve design system (`design-systems/*/DESIGN.md`). Geen systeem? Eerst `/design-systeem`.
2. Copy-regels en toon uit het systeem en `/mijn-toon` toepassen.
3. Componenten uit een bibliotheek halen in plaats van alles zelf tekenen.
4. Iconen uit één pack, illustraties en diagrammen als SVG.
5. Motion met GSAP, met `prefers-reduced-motion`.
6. Afsluiten met `/deslop` (audit) en aanbieden: "wil je het nog finetunen met `/tweak`?"
7. Afgemaakt werk opslaan in een map die Design OS indexeert.

## De 25 tips en waar ze wonen

| # | Tip | Waar |
|---|---|---|
| 01 | Design system maken, ook vanuit deck, site of screenshot | `/design-systeem` |
| 02 | 2.000+ stijlen van Refero gebruiken | `/design-systeem` |
| 03 | Claude een top drie laten kiezen | `/design-systeem` |
| 04 | Design system als skill in Claude Code | `/design-systeem` (maakt `/<merk>`) |
| 05 | Fonts van Fontshare en Fontesk | `/lettertype` |
| 06 | Copy: leer van de top vijf in je niche | `/copy` |
| 07 | Design systems mixen | `/design-systeem` |
| 08 | Beeld en video genereren | `/kie` |
| 09 | Naar een ander project verwijzen | `/referentie` |
| 10 | Referentiebibliotheek bijhouden | `tools/referentie-extensie` + `/referentie` |
| 11 | impeccable: de de-slop skills | `/deslop` + `scripts/installeer-extra.sh` |
| 12 | Tone-of-voice skill | `/mijn-toon` |
| 13 | UI snipen van 21st.dev | `/componenten` |
| 14 | Premium componenten van reactbits.dev | `/componenten` |
| 15 | Canvas UI via de shadcn registry | `/componenten` |
| 16 | Iconen aanleveren in plaats van laten tekenen | `/iconen` + `iconify_pack.py` |
| 17 | Vraag om SVG | `/iconen` + regel in `CLAUDE.md` |
| 18 | Lordicon-animaties | `/iconen` |
| 19 | Creators Toolbox | `bronnen.md` |
| 20 | Apple's Human Interface Guidelines | `/hig` |
| 21 | GSAP voor motion | `/motion` |
| 22 | `/design` in Claude Code | ingebouwd, zie hieronder |
| 23 | `/tweak`: schuifjes en dan bakken | `/tweak` |
| 24 | Transcript naar motion graphics | `/transcript-motion` |
| 25 | Eigen design operating system | `tools/design-os` + `/design-os` |

## Tip 22: /design

`/design` is een ingebouwd commando van Claude Code (research preview). Het opent een canvas met
bewerkbare artboards. Werkwijze:

1. `/design een pricing-pagina voor [product], drie plannen, in mijn design system`
2. Kies een artboard en zeg: `Implementeer deze in de app.`

Omdat het de workspace kent, pakt het `CLAUDE.md`, het design system en deze skills mee. Is
`/design` niet beschikbaar in de versie van de gebruiker, zeg dat dan en bouw varianten als losse
HTML-bestanden naast elkaar.

## Bronnen

Alle links uit de gids, plus wat er bij elke bron belangrijk is (licenties, prijzen), staan in
[bronnen.md](bronnen.md). Lees dat bestand als je een bron moet noemen of controleren.
