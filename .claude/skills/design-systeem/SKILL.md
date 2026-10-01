---
name: design-systeem
description: Maak, kies of mix een design system (kleuren, typografie, spacing, componenten, motion, toon). Gebruik bij "maak een design system", "zet dit om in een design system" (met deck, screenshot of URL), "gebruik deze stijl van Refero", "zoek drie stijlen die bij mijn bedrijf passen", "mix de typografie van A met de kleuren van B", of "maak een skill /<merk> die in die stijl bouwt".
argument-hint: "[maak | refero | top3 | mix | merkskill] [details]"
---

# Design system (tips 01, 02, 03, 04, 07)

Een design system is het regelboek voor hoe een merk eruitziet: kleuren, fonts, spacing en
componenten. Alles wat je daarna bouwt, begint hier. Design systems wonen in
`design-systems/<naam>/DESIGN.md`. Het actieve systeem staat in `design-systems/ACTIEF`
(één regel met de mapnaam).

Gebruik altijd [template.md](template.md) als vorm. Vul elke sectie met echte waarden: hex-codes,
pixelmaten, fontnamen, duur en easing van animaties. Geen "modern en strak", wel `#0F172A`.

## Kies de route

### A. Vanaf nul (tip 01)
Vraag in één bericht: wat doet het bedrijf, voor wie, drie woorden voor het gevoel, bestaande
assets (logo, fonts, kleuren). Maak dan het systeem. Stel daarna één font voor via `/lettertype`
en copy-regels via `/copy`.

### B. Vanuit iets dat de gebruiker mooi vindt (tip 01)
Prompt van de gebruiker: *"I love this. Turn it into a design system."*
- **Screenshot of deck**: lees kleuren (hex schatten en noemen als schatting), typografie
  (schreef of schreefloos, gewicht, verhoudingen), spacing-ritme, hoekradius, schaduw, iconstijl.
- **URL**: haal de pagina op en lees de CSS: custom properties, `font-family`, `border-radius`,
  `box-shadow`, `transition`. Echte waarden gaan boven schattingen.

### C. Een Refero-stijl gebruiken (tip 02)
De gebruiker plakt een design system van https://styles.refero.design. Prompt:
*"Use this design system for everything you build me from now on, with these tweaks: [tweaks]"*.
Zet het om naar de template, verwerk de tweaks en maak het actief.

### D. Top drie laten kiezen (tip 03)
Prompt: *"Go through styles.refero.design and find me the three design systems closest to my
business: [one line on what you do and who it's for]. Give me the three links and one line on why
each fits."*
Refero laadt met JavaScript, dus de pagina lezen kan dun uitvallen. Lukt het niet, zeg dat
eerlijk en vraag de gebruiker 10 tot 20 links te plakken. Kies daaruit de drie beste, met per stijl
één regel waarom.

### E. Mixen (tip 07)
Prompt: *"Take the typography from the first system and the colour palette and motion from the
second, and merge them into one system for [brand]."*
Schrijf in het nieuwe systeem per sectie op waar het vandaan komt. Controleer daarna het contrast
van tekstkleur op achtergrond (minimaal 4.5:1 voor broodtekst) en pas aan waar de mix botst.

### F. Merk-skill in Claude Code (tip 04)
Voorbeeldprompt: *"Make me a skill called /duolingo. Research Duolingo's visual style from
duolingo.com and its brand guidelines: colours, typography, corner radius, illustration and motion
style, tone of voice. Write it into the skill as a design system with exact hex codes and sizes.
Whenever I run /duolingo, build what I ask for in that style."*

Werkwijze:
1. Onderzoek het merk (site, brand guidelines). Alleen merken waar de gebruiker inspiratie uit mag
   halen, of het eigen merk. Kopieer geen logo's of beschermde assets.
2. Schrijf `design-systems/<merk>/DESIGN.md` volgens de template.
3. Maak `.claude/skills/<merk>/SKILL.md`:
   ```markdown
   ---
   name: <merk>
   description: Bouw wat de gebruiker vraagt in de stijl van <merk>. Gebruik bij "/<merk>" of "in <merk>-stijl".
   ---
   Lees eerst design-systems/<merk>/DESIGN.md en volg het exact (hex-codes, maten, radius, motion, toon).
   Bouw daarna wat de gebruiker vraagt. Geen eigen kleuren of fonts toevoegen.
   ```

## Na elke route

1. Schrijf `design-systems/<naam>/DESIGN.md` en, als het een web-project is, ook
   `design-systems/<naam>/tokens.css` met alle waarden als `:root`-variabelen (licht en donker).
2. Vraag of dit het actieve systeem wordt. Zo ja: zet de naam in `design-systems/ACTIEF`.
3. Laat een kleine proefpagina zien (`design-systems/<naam>/voorbeeld.html`): kop, alinea, knoppen,
   kaart, formulierveld, in licht en donker. Zo ziet de gebruiker direct of het klopt.
