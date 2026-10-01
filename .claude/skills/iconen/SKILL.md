---
name: iconen
description: Iconen, illustraties, diagrammen en geanimeerde iconen. Gebruik bij elk ontwerp dat iconen nodig heeft, bij "maak een icoon", "diagram", "illustratie", "logo-schets", "geanimeerd icoon", "Lottie", of als de gebruiker een map met iconen of een Lottie-bestand aanlevert. Claude tekent zelf geen iconen: gebruik een pack.
argument-hint: "[pack | svg | lottie] [wat je nodig hebt]"
---

# Iconen, SVG en Lottie (tips 16, 17, 18)

## Tip 16: zelf tekenen? Nee. Pack gebruiken.

Claude tekent meestal geen goede iconen. Gebruik één pack in één stijl voor het hele ontwerp.

1. **Al een pack in het project?** Kijk in `assets/icons/`, het design system (sectie 7) en
   `package.json` (`lucide-react`, `@tabler/icons-react`, `@phosphor-icons/react`). Gebruik dat.
2. **Nog geen pack?** Kies er één die past bij het design system:
   | Pack (Iconify-prefix) | Stijl | Licentie |
   |---|---|---|
   | `tabler` | lijn 2px, vriendelijk, 6.000+ | MIT |
   | `lucide` | lijn, strak, neutraal | ISC |
   | `ph` (Phosphor) | zes gewichten, consistent | MIT |
   | `heroicons` | lijn en vlak, Tailwind-huis | MIT |
   | `mingcute` | rond, zacht | Apache 2.0 |
   | `iconoir` | dunne lijn, elegant | MIT |
3. **Download de hele set** (of een deel) als losse SVG's:
   ```bash
   python3 .claude/skills/iconen/iconify_pack.py --info tabler      # licentie en aantal
   python3 .claude/skills/iconen/iconify_pack.py tabler             # alles naar assets/icons/tabler
   python3 .claude/skills/iconen/iconify_pack.py ph --filter "-bold$" --out assets/icons/ph-bold
   ```
   Gebruikt npm, geen sleutel nodig. Licentie-info komt in `LICENSE.json`.
4. Zet de keuze in het design system (sectie 7).

Heeft de gebruiker zelf een map aangeleverd (Iconify, Flaticon), gebruik dan alleen die.
Prompt van de gebruiker: *"Use these icons across the whole design. Don't generate any icons yourself."*
Iconify-packs zijn gratis. Een hele pack van Flaticon downloaden vraagt meestal Premium.

Ontbreekt een icoon in het pack? Zoek een synoniem in dezelfde set (`--filter`). Pas als het echt
niet bestaat: teken het in exact dezelfde stijl (zelfde viewBox, lijndikte, linecaps), en meld dat.

## Tip 17: vraag om SVG

Iconen, logo's, diagrammen en vlakke illustraties maak je als SVG. Schaalt zonder te vervagen,
kleur is met de hand aan te passen, en het is te animeren.

Prompt van de gebruiker: *"Make the icons and the diagram as SVG, not raster. Keep the paths clean
so I can edit the colours and animate them later."*

Regels voor schone SVG:
- `viewBox` altijd, geen vaste `width`/`height` in het bestand (of `1em`).
- `currentColor` of CSS-variabelen in plaats van hardgecodeerde kleuren, zodat licht en donker werken.
- Logische groepen met `id` of `class` (`<g id="pijl">`), zodat je ze kunt animeren.
- Geen onnodige transforms, geen ingesloten bitmaps, coördinaten afgerond op 1 tot 2 decimalen.
- Tekst in diagrammen als `<text>` met het merkfont, niet als paden.
- Toegankelijk: `role="img"` en `<title>`, of `aria-hidden="true"` als het puur decoratief is.

Foto's en gedetailleerd artwork blijven PNG, JPG of WebP.

## Tip 18: Lordicon, geanimeerde iconen

https://lordicon.com heeft 9.700+ gratis geanimeerde iconen. De gebruiker filtert op Free,
downloadt als **Lottie (JSON)** en levert het bestand aan.

Prompt van de gebruiker: *"Place this animation above the section heading and play it once on load."*

Inbouwen (vanilla, met lottie-web):
```html
<div id="anim-sectie" class="lottie" aria-hidden="true" style="width:64px;height:64px"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
<script>
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const anim = lottie.loadAnimation({
    container: document.getElementById("anim-sectie"),
    renderer: "svg", loop: false, autoplay: !reduce,
    path: "assets/lottie/icoon.json",
  });
  if (reduce) anim.addEventListener("DOMLoaded", () => anim.goToAndStop(anim.totalFrames - 1, true));
</script>
```
In React: `lottie-react` of `@lottiefiles/dotlottie-react`.

Licentie: de gratis Lordicon-licentie is gebaseerd op CC BY-ND 4.0 met wijzigingen. Er is een gratis
account nodig, en gratis iconen vragen een bronvermelding op de site (details:
https://lordicon.com/licenses). Zet die vermelding in de footer en meld het aan de gebruiker.
