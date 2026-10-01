# [Merknaam] design system

> Bron: [vanaf nul | screenshot | URL | Refero-link | mix van X en Y]
> Laatst bijgewerkt: [datum]

## 1. Merk in één alinea
Wat het bedrijf doet, voor wie, en welk gevoel het ontwerp moet geven (drie woorden).

## 2. Kleur
| Rol | Licht | Donker | Gebruik |
|---|---|---|---|
| achtergrond | #...... | #...... | pagina |
| oppervlak | #...... | #...... | kaarten, panelen |
| tekst | #...... | #...... | broodtekst |
| tekst-zacht | #...... | #...... | bijschriften |
| accent | #...... | #...... | primaire knop, links |
| accent-tekst | #...... | #...... | tekst op accent |
| lijn | #...... | #...... | randen, scheidingen |
| succes / waarschuwing / fout | #...... | #...... | status |

Regels: accent spaarzaam (max. één primaire actie per scherm). Contrast tekst op achtergrond
minimaal 4.5:1, grote tekst 3:1.

## 3. Typografie
- Koppen: [font], [gewichten]. Bron en licentie: [link].
- Broodtekst: [font], [gewichten].
- Mono (optioneel): [font].

| Stijl | Grootte | Regelhoogte | Gewicht | Letterafstand |
|---|---|---|---|---|
| display | px | | | |
| h1 | px | | | |
| h2 | px | | | |
| h3 | px | | | |
| body | px | | | |
| small | px | | | |
| label | px | | | |

## 4. Ruimte en layout
- Basiseenheid: [4 of 8] px. Schaal: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Maximale contentbreedte: [px]. Kolommen: [n]. Gutter: [px].
- Sectie-ruimte desktop / mobiel: [px] / [px].
- Breakpoints: [px].

## 5. Vorm
- Hoekradius: klein [px], middel [px], groot [px], pil.
- Randen: [dikte] [kleur-rol].
- Schaduw: [waarden], wanneer wel en niet.

## 6. Componenten
Per component: anatomie, maten, staten (rust, hover, focus, actief, uit, laden, leeg, fout).
- Knop (primair, secundair, tekst)
- Invoerveld
- Kaart
- Navigatie
- Badge / tag
- [projectspecifiek]

## 7. Iconen en beeld
- Iconpack: [naam], [stijl: lijn of vlak], [lijndikte]. Nooit zelf iconen tekenen.
- Illustraties en diagrammen: SVG, in de merkkleuren.
- Fotografie: [stijl, licht, onderwerp]. Gegenereerd beeld: [promptstijl].

## 8. Motion
- Bibliotheek: GSAP (+ ScrollTrigger waar nodig).
- Duur: micro [ms], standaard [ms], groot [ms].
- Easing: [bv. power2.out / expo.out]. Geen bounce of elastic.
- Altijd `prefers-reduced-motion` respecteren.

## 9. Toon en copy
- Toon in drie woorden.
- Copy-regels (uit `/copy`): één idee per scherm, knoppen met een werkwoord, geen AI-woorden.
- Verboden woorden: [lijst].
- Voorbeelden voor en na.

## 10. Niet doen
Lijst met dingen die dit merk nooit doet.
