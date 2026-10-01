---
name: hig
description: Apple's Human Interface Guidelines als regelboek met alle getallen (tap-doelen, typeschaal, marges, contrast, balkhoogtes). Pas toe zodra je een app-scherm, mobiel scherm, iOS/iPadOS-ontwerp of mobiele weergave van een site ontwerpt of beoordeelt. Gebruik ook bij "/hig", "is dit goed op mobiel", "app-design".
---

# Human Interface Guidelines (tip 20)

Apple publiceert de HIG gratis: https://developer.apple.com/design/human-interface-guidelines.
De getallen hieronder volg je in plaats van te gokken. Ze zijn geschreven voor Apple-platforms,
maar de kern (tap-doelen, typeschaal, contrast) maakt elk mobiel scherm beter. Voor Android-apps
gelden de Material-equivalenten (tussen haakjes).

Twijfel je over een detail dat hier niet staat, haal dan de betreffende HIG-pagina op en voeg het
getal hier toe.

## Tap-doelen

- Minimaal **44 × 44 pt** voor alles wat je aantikt (Android: 48 × 48 dp). visionOS: 60 pt.
- Ook als het icoon kleiner is: vergroot het raakvlak met padding.
- Ruimte tussen bediening: ongeveer 12 pt rond elementen met een rand of vlak, ongeveer 24 pt
  rond elementen zonder.

## Typeschaal iOS (Dynamic Type, standaardgrootte "Large")

| Stijl | Grootte (pt) | Regelhoogte (pt) | Gewicht |
|---|---|---|---|
| Large Title | 34 | 41 | Regular |
| Title 1 | 28 | 34 | Regular |
| Title 2 | 22 | 28 | Regular |
| Title 3 | 20 | 25 | Regular |
| Headline | 17 | 22 | Semibold |
| Body | 17 | 22 | Regular |
| Callout | 16 | 21 | Regular |
| Subheadline | 15 | 20 | Regular |
| Footnote | 13 | 18 | Regular |
| Caption 1 | 12 | 16 | Regular |
| Caption 2 | 11 | 13 | Regular |

- Nooit kleiner dan **11 pt** op iOS. macOS: standaard broodtekst 13 pt, minimaal 10 pt.
- Ondersteun Dynamic Type: tekst moet meeschalen tot de grootste toegankelijkheidsmaten zonder
  afgekapt te worden. Op het web: `rem`-eenheden, layout die meegroeit.
- Systeemfont SF Pro (`-apple-system` op het web) tenzij het merk een eigen font heeft. Merkfont
  dan in dezelfde schaal.

## Marges, layout en ritme

- Zijmarges: **16 pt** op iPhone (compact width), **20 pt** op iPad (regular width).
- Werk op een 8 pt-raster (4 pt voor fijne stappen).
- Respecteer de safe area (notch, Dynamic Island, home-indicator). Web:
  `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)`
  met `viewport-fit=cover`.
- Belangrijkste inhoud bovenaan en in het midden. Primaire acties binnen duimbereik (onderste helft).

## Balken en navigatie (iOS)

| Element | Hoogte |
|---|---|
| Navigatiebalk (standaard titel) | 44 pt |
| Navigatiebalk met Large Title | 96 pt (inklappend naar 44) |
| Tabbalk | 49 pt, plus de safe area onderaan |
| Toolbar | 44 pt |

- Tabbalk: 3 tot 5 tabs. Tabs zijn voor navigatie, niet voor acties.
- Één primaire actie per scherm. Destructieve acties in rood en met bevestiging.

## Kleur en contrast

- Tekst tot en met 17 pt: contrast minimaal **4.5:1**. Tekst vanaf 18 pt (of vet): minimaal **3:1**.
- Kleur nooit als enige drager van betekenis: ook een icoon, label of vorm.
- Ondersteun licht en donker. Gebruik semantische kleuren (achtergrond, label, secundair label)
  in plaats van vaste hex-waarden waar het platform dat biedt.
- Tik- en hover-staten zichtbaar, focus zichtbaar voor toetsenbord en Switch Control.

## Beweging

- Respecteer "Beperk beweging" (`prefers-reduced-motion`): vervang schuiven en zoomen door een fade.
- Animatie ondersteunt begrip (waar komt dit vandaan, waar gaat het heen), geen decoratie.

## Iconen en beeld

- SF Symbols-stijl: lijndikte afgestemd op het font-gewicht van de tekst ernaast.
- App-icoon: geen tekst, geen foto, één herkenbare vorm.

## Controle bij elk mobiel scherm

1. Alle tap-doelen 44 pt of meer?
2. Typeschaal uit de tabel, niets onder 11 pt?
3. Marges 16 pt, safe area gerespecteerd?
4. Contrast 4.5:1 (of 3:1 bij grote tekst)?
5. Werkt het met de grootste tekstgrootte en in donker?
6. Beperk-beweging-modus netjes?

Rapporteer afwijkingen met het getal erbij ("knop is 32 pt, moet 44 pt").
