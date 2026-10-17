# Nachtlog

## Samenvatting voor de ochtend

Drie rondes agents, alles gepubliceerd op de vaste links en gecommit.
- Pizza: https://claude.ai/artifact/4G6Huvy3whRoZUNE1e5xU1
- Chips: https://claude.ai/artifact/HTv6TvxifX55dgBCHyb2Ef

Belangrijkste verschil met gisteravond: de keuzeband staat op beide pagina's op het eerste scherm, en een keuze is direct zichtbaar (pizzapagina in de telefoon, chipszak met vonken). Foto's bij "mening" en "Wie doet wat" zijn omgewisseld. Mobiel is veel korter door swipe-rijen en twee kolommen.

Nog voor de gebruiker:
1. De vijf open beslissingen in OVERDRACHT.md (award, winnaar/winnaars, contactadres, vier keer "iedereen", kopie zonder beelden verwijderen).
2. Stembalkjes in de live-lijst van de chipspagina (suggereert data die niet in de tekst staat).
3. Chips: de zak landt nu kleiner links van de telefoon. Liever de oude plek? Eén instelling (`EIND` in pagina.js).
4. Donker thema: vlaggenschippaneel (chips) en zwarte kaart 7 (pizza) vallen weg tegen de achtergrond.
5. Pizza op 390 px: het ingeklapte werkbalkknopje ligt over het label "Jouw pizza".
6. De live agent is alleen met het script getest; de echte Claude-agent werkt pas op claude.ai.

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

## Ronde 2, pizza (gepubliceerd)

Na een art-directorreview:
- Band "Kies een pizza" volledig op het eerste scherm (1440x900, 1366x768, 1280x720, 1024x768); bandpizza's op desktop naast hun naam.
- Pizza kiezen toont meteen de pizzapagina in de telefoon; na 4,5 s begint het gesprek opnieuw.
- Presentatiebalk: op mobiel ingeklapt, op desktop schuift hij boven de band.
- Mobiel: metachips in één scrollrij, fases als swipe-carrousel, tegels in twee kolommen.
- Wat het oplevert: gezichten, pizzaschijfjes en een grote nduja in de zwarte kaart.
- Volgende stap: Big T-foto met Thomas als badge (geen herhaling van finale.webp).
- Schaal en landen naast de kop, Het idee met lichtere voordelen.
- Bekend: in donker valt de zwarte kaart 7 weg tegen de achtergrond.

## Ronde 3, regressie (gepubliceerd)

Volledige test op 5 schermmaten, licht/donker, reduced motion: geen fouten, geen overloop, niets blijft onzichtbaar. Opgelost:
- Pizza: terug met pijltjes/PageUp werkte niet (rekenfout in de sectienavigatie).
- Pizza: zonder beweging waren 1 tot 4 bandpizza's onbereikbaar; band scrolt nu zijwaarts.
- Beide: op touch bleef de band stilstaan na een tik (hover-pauze alleen nog op apparaten met muis).
- Chips: link "Werkwijze" zette de kop onder de navigatie (scroll-padding).
- Chips: chat bleef 5 s leeg na een smaakklik; start nu meteen.
- Chips: werkbalk schuift boven de band, zoals op de pizzapagina.
- Pizza: "Probeer het zelf" verdwijnt direct als het laatste bericht komt.
