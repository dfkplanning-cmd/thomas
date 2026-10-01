---
name: deslop
description: Haal de AI-look uit een ontwerp en maak een goede draft professioneel. Audit hiërarchie, spacing, typografie, toegankelijkheid en lege staten, fix wat je vindt en toon voor en na. Gebruik bij "maak dit professioneler", "audit deze pagina", "dit ziet eruit als AI", "make this bolder", "make this quieter", of als afsluiter van elk ontwerp.
argument-hint: "[pagina of component] [audit | bolder | quieter]"
---

# De-slop (tip 11)

Impeccable (https://github.com/pbakaus/impeccable) is een gratis design-skill met 24 commando's en
61 detectorregels om een site te de-sloppen. Deze skill gebruikt impeccable als het geïnstalleerd
is, en anders de checklist hieronder.

## 1. Is impeccable geïnstalleerd?

Kijk of `.claude/skills/impeccable/` of `~/.claude/skills/impeccable/` bestaat.

- **Ja**: gebruik de commando's van impeccable:
  - `/impeccable audit <doel>`: toegankelijkheid, performance, responsive
  - `/impeccable critique <doel>`: hiërarchie, helderheid
  - `/impeccable polish <doel>`: laatste ronde, afstemming op het design system
  - `/impeccable bolder` en `/impeccable quieter`: harder of rustiger
  - Eerste keer in een project: `/impeccable init` (schrijft `PRODUCT.md`)
- **Nee**: bied installatie aan (`bash scripts/installeer-extra.sh impeccable`, of handmatig
  `npx impeccable install` in de root van het project) en ga intussen verder met de checklist.

Prompt van de gebruiker: *"Run impeccable on this page. Audit hierarchy, spacing, typography,
accessibility and empty states, fix what you find, and show me the before and after."*
Korte versies: *"Make this bolder."* en *"Make this quieter."*

## 2. Checklist (zonder impeccable, of als extra)

**Typografie**
- Geen Inter, Arial of systeemfont als merkfont (zie `/lettertype`).
- Duidelijke schaal: elke kop zichtbaar groter dan de volgende. Max. twee families.
- Broodtekst 16 px of meer, regellengte 60 tot 75 tekens.

**Kleur**
- Geen paars-naar-blauw-verloop als default. Geen puur zwart (#000) of puur grijs: altijd licht getint.
- Geen grijze tekst op een gekleurde achtergrond.
- Contrast: tekst 4.5:1, grote tekst en UI-randen 3:1.

**Layout en spacing**
- Eén spacing-schaal (4 of 8 px). Geen willekeurige marges.
- Geen kaart in een kaart. Niet alles in kaarten stoppen.
- Geen afgerond icoonvierkantje boven elke kop.
- Duidelijk één primaire actie per scherm.

**Motion**
- Geen bounce of elastic easing. Duur 150 tot 400 ms voor UI.
- `prefers-reduced-motion` gerespecteerd.

**Staten**
- Lege staten met uitleg en een actie. Laadstaten. Foutmeldingen die zeggen wat te doen.
- Hover, focus (zichtbare focus-ring) en disabled voor elk interactief element.

**Toegankelijkheid en techniek**
- Semantische HTML (`header`, `nav`, `main`, `section`, `button` voor knoppen).
- `alt` op beeld, labels op formuliervelden, tap-doelen minimaal 44 px.
- Responsive tot 360 px breed, geen horizontale scroll.
- Afbeeldingen met `width` en `height`, lazy loading onder de vouw.

**Copy**
- Geen AI-woorden (zie `/copy`). Eén idee per scherm.

## 3. Rapporteer

Laat per gevonden punt zien: wat er mis was, wat je veranderde, waar (bestand:regel). Maak bij
een pagina een screenshot voor en na als dat kan (Playwright of de browser). Bied daarna `/tweak`
aan voor handmatig finetunen.
