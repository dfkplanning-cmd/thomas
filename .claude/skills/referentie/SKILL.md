---
name: referentie
description: Bouw verder op eerder werk of op bewaarde inspiratie. Gebruik bij "gebruik het design system van project X", "zoals we bij [project] deden", een geplakte Claude Design-project-URL, "kijk in mijn referenties", "zoek inspiratie voor een hero", of als de gebruiker een nieuw ontwerp begint terwijl er al afgemaakt werk bestaat.
argument-hint: "[projectmap of URL | zoekterm voor de referentiebibliotheek]"
---

# Referenties (tips 09 en 10)

## Tip 09: naar een ander project verwijzen

Begin nooit met een leeg blad als er al werk bestaat.

**Claude Design-project**: de gebruiker kopieert de URL van het afgemaakte project en plakt:
*"Use this project's design system, assets and decisions for everything we build here: [URL]"*

**Claude Code**: *"Find my past session where we built [project], and use its design system and
assets for this build."*

Werkwijze in Claude Code:
1. Vraag naar de projectmap. Een map is betrouwbaarder dan oude sessies zoeken.
2. Zoek daarin: `design-systems/`, `DESIGN.md`, `PRODUCT.md`, `tokens.css`, `tailwind.config.*`,
   `:root`-variabelen, `assets/`, `public/`, fonts en iconen.
3. Vat samen wat je overneemt (kleuren, fonts, radius, componenten, toon) en wat niet.
4. Kopieer het design system naar `design-systems/<naam>/` in dit project en zet het actief.
   Kopieer assets alleen als de gebruiker dat wil.

## Tip 10: de referentiebibliotheek

Smaak wordt beter naarmate je meer goed werk ziet. De gebruiker bewaart inspiratie van Dribbble,
Awwwards, X en waar dan ook met de Chrome-extensie in `tools/referentie-extensie/`
(één klik: screenshot, URL, titel, notitie, tags).

De bestanden staan standaard in `~/Downloads/DesignAssistent/referenties/`, per referentie een
`.png` en een `.json`:
```json
{ "url": "...", "title": "...", "site": "...", "note": "...", "tags": ["hero"], "created": "...", "image": "....png" }
```

Als de gebruiker inspiratie zoekt:
1. Lees de `.json`-bestanden en filter op tags, notitie, site en titel.
2. Bekijk de bijbehorende screenshots (Read op de `.png`).
3. Benoem per referentie wat je meeneemt (layout, typografie, ritme, kleurgebruik, motion) en
   vertaal dat naar het actieve design system. Niet kopiëren, wel de principes gebruiken.

De map wordt ook geïndexeerd door Design OS (`/design-os`), dan kun je op inhoud zoeken.

## Extensie installeren

1. Open `chrome://extensions` en zet Developer mode aan.
2. Klik Load unpacked en kies `tools/referentie-extensie/`.
3. Pin het icoon. Sneltoets: Alt+Shift+S. De bibliotheek open je via de link in de popup.
