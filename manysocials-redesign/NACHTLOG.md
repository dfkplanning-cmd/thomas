# Nachtlog

Per ronde: wat de agents vonden, wat is aangepast en gepubliceerd.

## Ronde 0 (avond)

- QA interacties pizza: 8 bugs gevonden en opgelost (onzichtbare chat na uitfaden, spatie op Verstuur, scrollen met de vinger, label op mobiel, losse vluchten, bandmarkering bij eigen pizza, voornaam, dubbele verzending).
- QA chips: 1 bug opgelost (lege telefoon na snelle smaakkeuze).
- Tekstcheck: agentprompt aangescherpt, "je" in de afsluiter. Inhoudelijke punten staan als open beslissing in OVERDRACHT.md.

## Ronde 1, chips (gepubliceerd)

- Vonken na een snelle smaakklik opgelost (run-token in `vlieg()`).
- Band op mobiel: smallere fade (44px), label boven de zakken, alle zakken tikbaar. Bij reduced motion scrolt de band zijwaarts.
- Focus pauzeert de band; bandknoppen weer als knop aangekondigd (role group i.p.v. list).
- Minder wit tussen "Ons vlaggenschip" en de live-inzendingen.
- Voor de gebruiker: in donker is het vlaggenschippaneel donker op donker (leesbaar, minder opvallend).

## Ronde 1, pizza (gepubliceerd)

- Foto's omgewisseld op verzoek: keuken bovenaan bij "mening", vrienden op de bank bij "Wie doet wat". Uitsnede zo dat er geen gezichten wegvallen.
- Regels die op één woord eindigden gebalanceerd; "Wat het oplevert" zonder lege cel op 1024; contactblok 2x2; hero-label en landenrij passen op mobiel.
- Contrast: donkerder groen voor kleine tekst op licht, rood #D93825, "Vertrouwelijk" leesbaar in licht en donker.
- Toegankelijkheid: bandknoppen weer echte knoppen, beschrijvingen bij de twee foto's, focusring op invoerveld en snelknoppen.
- Lichtere beelden: mening-iphone.webp (354 KB), keuken-licht.webp (341 KB).
- Voor de gebruiker: bij reduced motion staat "Probeer het zelf" over de onderkant van de pizzakaart; de kleurkiezer linksonder dekt op mobiel het begin van de band.

## Ronde 2, chips (gepubliceerd)

Na een art-directorreview:
- Smaak kiezen toont meteen de zak met vonken; de zak landt nu kleiner links van de telefoon zodat het chatscherm vrij blijft (terug te zetten via `EIND` in pagina.js).
- Band boven de vouw op 1440x900 en 1280x720; telefoon vanaf de eerste seconde gevuld.
- Merkwisselaar start ingeklapt op mobiel (keuze wordt onthouden onder `ms-kk`); bug opgelost waardoor heropenen 1,5 s onzichtbaar bleef.
- Diensten: echte zakken in Beheer en Klantinteractie, op mobiel een swipe-carrousel.
- Afsluiter: waaier van drie zakken in plaats van dezelfde mangozak als het vlaggenschip.
- Werkwijze met voortgangsringen, minder wit bij Werkwijze en Vragen.
- Overgeslagen (vraag voor de gebruiker): stembalkjes in de live-lijst.
