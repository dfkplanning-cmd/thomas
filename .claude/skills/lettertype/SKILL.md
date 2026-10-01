---
name: lettertype
description: Kies een lettertype of kop/broodtekst-paar dat bij het merk past, met licentiecheck, en verwerk het in het design system en de code. Gebruik bij "welk font", "andere letter", "typografie", "font pairing", of als een ontwerp nog een standaardfont (Inter, Arial, system-ui, Roboto) gebruikt.
---

# Lettertype (tip 05)

Het snelste teken van een vibe-coded ontwerp is het font: beginners laten staan wat Claude kiest.
Dus: nooit Inter, Arial, Roboto of alleen `system-ui` als merkfont, tenzij de gebruiker dat expliciet wil.

## Stappen

1. **Lees het merk**: open het actieve design system (`design-systems/ACTIEF`). Drie woorden voor het gevoel.
2. **Stel twee of drie opties voor**, met per optie één regel waarom het past. Begin bij Fontshare
   (gratis, ook commercieel). Fontesk alleen met licentiecheck.
3. **Paar nodig?** Kies een kop- en broodtekstfont met contrast in karakter maar verwante
   verhoudingen. Fontjoy (https://fontjoy.com) helpt bij twijfel.
4. **Licentie**: noem de licentie bij elk font. Fontshare: ITF Free Font License, commercieel vrij.
   Fontesk: per font, lees de fontpagina voordat het live gaat.
5. **Verwerk het**: zet het font in `DESIGN.md` (sectie Typografie) en in de code.

Prompt die de gebruiker kan geven: *"Use Switzer for all headings and body text."*

## Fontshare-shortlist

| Font | Karakter | Goed voor |
|---|---|---|
| Switzer | neutraal, scherp, Zwitsers | SaaS, tools, alles wat rustig moet |
| Satoshi | modern geometrisch, vriendelijk | startups, apps |
| General Sans | strak, iets warmer dan Switzer | portfolio's, bureaus |
| Cabinet Grotesk | uitgesproken, krappe koppen | koppen met karakter |
| Clash Display | groot en eigenwijs | hero's, posters (alleen koppen) |
| Supreme | technisch, breed gewichtsbereik | dashboards, data |
| Chillax | zacht, speels | consumentenmerken, lifestyle |
| Gambetta | klassieke schreef | redactioneel, premium |
| Sentient | warme, leesbare schreef | lange teksten, blogs |
| Zodiak | contrastrijke display-schreef | mode, luxe koppen |

Paren die werken: Clash Display + Satoshi, Gambetta + Switzer, Cabinet Grotesk + General Sans,
Zodiak + Supreme.

Controleer bij twijfel op https://www.fontshare.com of een font (nog) bestaat en welke gewichten er zijn.

## Inladen

Fontshare CSS (snel, voor prototypes):
```html
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap" rel="stylesheet">
```
```css
:root { --font-body: "Switzer", ui-sans-serif, system-ui, sans-serif; }
```

Productie: download de WOFF2-bestanden, zet ze in `assets/fonts/` en laad ze met `@font-face`
plus `font-display: swap`. In Next.js: `next/font/local`.

## Typografieregels

- Maximaal twee families, plus eventueel een mono.
- Broodtekst 16 tot 18 px, regelhoogte 1.5 tot 1.65, regellengte 60 tot 75 tekens.
- Koppen strakker: regelhoogte 1.05 tot 1.2, letterafstand licht negatief bij grote maten.
- Gebruik een vaste schaal (bv. 1.25 of 1.333) en zet die in het design system.
