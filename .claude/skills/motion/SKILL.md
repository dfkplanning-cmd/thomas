---
name: motion
description: Showcase-waardige animatie op websites met GSAP (GreenSock): scroll-gedreven secties, tekst die verschijnt tijdens het scrollen, een vastgepinde hero, smooth scrolling. Gebruik bij "voeg animatie toe", "scroll-effecten", "laat dit bewegen", "maak het levendiger", "pinned hero", "parallax", of motion in het design system.
argument-hint: "[pagina of sectie] [gewenst effect]"
---

# Motion met GSAP (tip 21)

Voor motion die aanvoelt als wereldklasse gebruik je GSAP: snel, betrouwbaar en de standaard bij
veel topbureaus. GSAP is sinds 2025 helemaal gratis, inclusief ScrollTrigger, ScrollSmoother en
SplitText. De lat: https://gsap.com/showcase.

Prompt van de gebruiker: *"Use GSAP for all motion on this site: scroll-driven sections, text
reveals on scroll, a pinned hero, smooth scrolling. The bar is gsap.com/showcase."*

## Inladen

Vanilla:
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js"></script>
<!-- alleen als je smooth scrolling wilt: -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollSmoother.min.js"></script>
```
React/Next: `npm i gsap @gsap/react` en de `useGSAP()`-hook (ruimt automatisch op).

## Basisregels

1. **Altijd** `prefers-reduced-motion` respecteren met `gsap.matchMedia()`.
2. Animeer alleen `transform` en `opacity` (en `clip-path` waar nodig). Geen `top`, `left`,
   `width`, `height`.
3. Duur en easing uit het design system. Standaard: 0.6 tot 1.0 s voor reveals, `power3.out` of
   `expo.out`. Geen bounce of elastic.
4. Content moet zonder JavaScript zichtbaar zijn: zet begintoestanden met GSAP, niet in CSS.
5. Eén groot moment per scherm. Niet alles tegelijk laten bewegen.

## Patronen

```js
gsap.registerPlugin(ScrollTrigger, SplitText);

const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // 1. Tekst die verschijnt tijdens het scrollen (per regel)
  document.querySelectorAll("[data-reveal-text]").forEach((el) => {
    const split = SplitText.create(el, { type: "lines", mask: "lines" });
    gsap.from(split.lines, {
      yPercent: 100, duration: 0.9, ease: "expo.out", stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // 2. Elementen die invliegen
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // 3. Vastgepinde hero die wegschaalt terwijl je scrolt
  gsap.timeline({
    scrollTrigger: { trigger: ".hero", start: "top top", end: "+=100%", scrub: true, pin: true },
  })
    .to(".hero__media", { scale: 1.15, ease: "none" }, 0)
    .to(".hero__title", { yPercent: -30, opacity: 0, ease: "none" }, 0);

  // 4. Horizontaal scrollende sectie
  const track = document.querySelector(".h-scroll__track");
  if (track) {
    gsap.to(track, {
      x: () => -(track.scrollWidth - innerWidth), ease: "none",
      scrollTrigger: { trigger: ".h-scroll", pin: true, scrub: 1, end: () => "+=" + track.scrollWidth, invalidateOnRefresh: true },
    });
  }
});
```

Smooth scrolling (ScrollSmoother) vraagt deze structuur:
```html
<div id="smooth-wrapper"><div id="smooth-content"> ...alle content... </div></div>
```
```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
mm.add("(prefers-reduced-motion: no-preference)", () => {
  ScrollSmoother.create({ smooth: 1, effects: true });
});
```
Vaste elementen (navbar) staan buiten `#smooth-wrapper`.

## Controleren

- Scrol de pagina helemaal door op desktop en op 390 px breed.
- Zet "beperk beweging" aan in het OS: alles moet zichtbaar en bruikbaar blijven.
- Geen layout shift, geen haperingen (DevTools Performance, 60 fps).
- Zet de gekozen duur en easing in sectie 8 van het design system.
