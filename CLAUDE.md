# Design Assistent

Deze repo is de Design Assistent van de gebruiker: een set Claude Code-skills en tools die de
25 trucs uit "25 tricks to level up Claude Design" (RoboNuggets) uitvoeren. Startpunt voor elke
design-vraag is de skill `/design-assistent`.

## Vaste regels bij elk ontwerp

1. **Design system eerst.** Lees het actieve systeem (`design-systems/ACTIEF` wijst naar
   `design-systems/<naam>/DESIGN.md`). Geen systeem? Maak er eerst een met `/design-systeem`.
   Gebruik alleen kleuren, fonts, radius en spacing uit het systeem.
2. **Geen standaardfont.** Nooit Inter, Arial, Roboto of alleen `system-ui` als merkfont
   (`/lettertype`).
3. **Copy zonder AI-taal.** Copy-regels uit het design system, toon uit `/mijn-toon`
   (`/copy` voor nieuwe pagina's).
4. **Iconen nooit zelf tekenen.** Gebruik het pack uit het design system (`/iconen`).
5. **Iconen, logo's, diagrammen en vlakke illustraties als SVG**, met schone paden en
   `currentColor` of CSS-variabelen.
6. **Componenten binnenhalen** in plaats van alles zelf ontwerpen (`/componenten`).
7. **Motion met GSAP**, altijd met `prefers-reduced-motion` (`/motion`).
8. **App- of mobiel scherm?** Volg `/hig` (44 pt tap-doelen, typeschaal, contrast).
9. **Afsluiten** met `/deslop`, en bied `/tweak` aan om met de hand te finetunen.
10. **Licenties checken** bij fonts, componenten, iconen en Lottie. Noem de licentie in je antwoord.
11. **Geheimen** (Kie, Anthropic) alleen als omgevingsvariabele, nooit in een bestand in git.

## Structuur

- `.claude/skills/`: de skills (één map per slash-commando)
- `design-systems/`: design systems, één map per merk, plus `ACTIEF`
- `tools/referentie-extensie/`: Chrome-extensie voor de referentiebibliotheek (tip 10)
- `tools/design-os/`: Design OS (tip 25)
- `scripts/installeer-extra.sh`: installeert impeccable, HyperFrames en de Python-pakketten
- `CHECKLIST.md`: de 25 tips en hun status voor deze gebruiker

## Schrijfstijl naar de gebruiker

Nederlands, natuurlijk en direct. Geen em-dashes of en-dashes.
