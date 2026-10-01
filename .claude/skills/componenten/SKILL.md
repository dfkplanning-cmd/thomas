---
name: componenten
description: Haal kant-en-klare, bewezen UI-componenten en effecten binnen in plaats van ze zelf te tekenen (21st.dev, React Bits, Canvas UI via de shadcn registry, Creators Toolbox) en stem ze af op het design system. Gebruik bij "voeg een hero/pricing/testimonial-sectie toe", "geplakte componentcode", "maak een glas- of particle-effect", "geanimeerde tekst", "cursor-effect", of bij het zoeken naar design-bronnen.
argument-hint: "[component of effect] [plek op de pagina]"
---

# Componenten (tips 13, 14, 15, 19)

Een bewezen sectie installeren is beter (en scheelt tokens) dan er een vanaf nul ontwerpen.
Wat je ook binnenhaalt: daarna altijd afstemmen op het actieve design system (kleuren, fonts,
radius, spacing, motion) en eigen beeld en tekst erin zetten.

## Welke bron

| Behoefte | Bron |
|---|---|
| Gewone secties: hero, pricing, features, testimonials, navbar, footer, formulieren | 21st.dev |
| Eigenwijze details: geanimeerde tekst, glaskaarten, cursor-effecten, achtergronden | React Bits |
| Grote visuele effecten: liquid, glass, shatter, particle reveal | Canvas UI |
| Iets anders (3D, mockups, logo's, icon-sets) | Creators Toolbox |

## 21st.dev (tip 13)

De gebruiker zoekt op https://21st.dev, sorteert op Most downloaded (zichtbaar in zoeken en
filters, niet op categoriepagina's), opent een component en kopieert de code of de
**Copy prompt** (agent-klaar, vaak makkelijker dan de code; codeweergave vraagt soms inloggen).

Prompt: *"Install this component and swap the images for ours, matched to my design system:
[paste component code]"*

Werkwijze:
1. Bekijk de afhankelijkheden (framer-motion, lucide-react, shadcn-onderdelen) en installeer ze.
2. Veel 21st.dev-componenten hebben een shadcn-installcommando
   (`npx shadcn@latest add "<registry-url>"`). Staat het op de pagina, gebruik dat.
3. Zet de component in `components/` volgens de projectstructuur.
4. Vervang kleuren door de tokens van het design system, fonts door de merkfonts, placeholders
   door echte content en beeld.

## React Bits (tip 14)

https://reactbits.dev (bron: https://github.com/DavidHDev/react-bits). Gebruik het
installcommando of de code van de componentpagina (varianten: JS of TS, CSS of Tailwind).

Prompt: *"Add this to the hero and match it to my design system: [paste component code]"*

Check de licentie op de componentpagina of in de repo voordat het in een betaald product gaat.

## Canvas UI (tip 15)

https://canvasui.dev heeft 35 effecten (liquid, glass, shatter, particle reveal en meer) en werkt
met de shadcn registry (https://ui.shadcn.com/docs/registry). De gebruiker noemt alleen het effect;
jij zoekt de component op en installeert hem.

Prompt: *"Add the particle reveal effect from Canvas UI to the hero heading. Install it through the
shadcn registry."*

Werkwijze:
1. Zoek het effect op canvasui.dev en pak het registry-installcommando van die pagina.
2. Nog geen shadcn in het project? `npx shadcn@latest init` (vraag eerst, het schrijft `components.json`).
3. Installeer via `npx shadcn@latest add ...`. De shadcn MCP is optioneel.
4. Licentie: MIT plus Commons Clause. Gebruiken in eigen werk mag, de effecten doorverkopen niet.

## Geen React in het project?

Bij een losse HTML-pagina: zet de component om naar vanilla HTML, CSS en JS (of een web
component). Animaties dan met GSAP (`/motion`). Zeg erbij als een effect zonder React te zwaar wordt.

## Creators Toolbox (tip 19)

https://creatorstoolbox.com/resources (meest populair: https://creatorstoolbox.com/most-popular-resources)
is één overzicht van 150+ gratis en betaalde design-bronnen. Uit de video:
- OriginKit: geanimeerde componenten
- ThreeUI: Three.js-effecten (freemium)
- Tabler Icons: SVG-iconen
- Logosystem: logogalerij
- Streetwear Mockups & Vectors Pack: mockup-kit (premium)
- Ook genoemd: Refero Styles (`/design-systeem`) en Slop by Impeccable (`/deslop`)

Niet alles is gratis. Check bij elke bron de licentie voordat je hem gebruikt.

## Afronden

Na het inbouwen: controleer licht en donker, mobiel (360 px), toetsenbord-focus en
`prefers-reduced-motion`. Vermeld in je antwoord welke component van welke bron komt en onder welke licentie.
