---
name: tweak
description: Zet een schuifjespaneel op een HTML-pagina (lettergrootte, spacing, kleuren, hoekradius, en een schakelaar per sectie), laat de gebruiker live finetunen in de browser en bak de gekozen waarden daarna terug in de CSS. Gebruik bij "/tweak", "ik wil het zelf bijstellen", "schuifjes", "finetunen", "laat me met de waarden spelen".
argument-hint: "[pad naar .html]"
---

# Tweak: schuifjes, dan bakken (tip 23)

Claude Design heeft een ingebouwd Tweaks-paneel. Deze skill doet hetzelfde voor elke HTML-pagina
in Claude Code: de gebruiker poetst met de hand, verbergt wat weg mag, en met **Bake** komen de
waarden in de bestanden.

## Starten

```bash
python3 .claude/skills/tweak/tweak.py pad/naar/pagina.html
```

Opties: `--port 8765` (standaard), `--no-open` (browser niet openen). Draai het als
achtergrondproces en geef de gebruiker de URL. Werkt de gebruiker in een cloud-sessie, zeg dan dat
dit lokaal moet draaien en geef het commando.

## Wat het paneel doet

- Leest alle CSS-variabelen uit `:root` (inline `<style>` en lokale `.css`-bestanden).
  Kleuren krijgen een kleurkiezer, maten een schuifje, de rest een tekstveld.
- **Algemeen**: basis-lettergrootte, regelhoogte, ruimte per sectie, hoekradius, achtergrond, tekstkleur.
- **Secties**: elke `header`, `nav`, `section`, `article`, `aside`, `footer`, elk element met
  `data-section`, en elke `div` direct in `body` of `main`. Vinkje uit verbergt de sectie;
  over de rij hoveren markeert hem op de pagina.
- **Reset** zet alles terug. **Bake** schrijft weg en herlaadt.

## Wat Bake schrijft

1. Gewijzigde variabelen in het eerste `:root`-blok waar ze staan (HTML of lokaal css-bestand).
2. Gewijzigde algemene instellingen in `<style id="tweak-baked">` in de `<head>`
   (vervangt een eerdere versie van dat blok).
3. Verborgen secties worden uit de HTML verwijderd.
4. Eerst een `.bak`-kopie van elk bestand dat verandert. Het paneel zelf komt nooit in het bestand.

## Tips voor betere schuifjes

Het paneel is zo goed als de variabelen van de pagina. Bouw je zelf een pagina, zet dan alle
merkwaarden als `:root`-variabelen (`--kleur-accent`, `--ruimte-sectie`, `--radius-m`,
`--tekst-basis`). Dan krijgt de gebruiker precies de knoppen die ertoe doen.

## React, Vue of een framework

Het script werkt op statische HTML. Voor een framework-project: zet de design tokens in één
CSS-bestand met `:root`-variabelen, bouw de pagina (`npm run build`), en draai tweak op de
geëxporteerde HTML om waarden te kiezen. Neem de gebakken variabelen daarna over in het
tokens-bestand van het project, en meld welke waarden je overnam.

## Na het bakken

Toon een korte diff van wat er veranderde. Vraag of de waarden ook in het design system moeten
(`design-systems/<actief>/DESIGN.md` en `tokens.css`).
