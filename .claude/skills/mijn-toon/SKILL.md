---
name: mijn-toon
description: De tone of voice van de gebruiker. Pas toe op alle tekst die je voor de gebruiker schrijft of herschrijft (website-copy, posts, scripts, mails, UI-teksten). Gebruik ook bij "schrijf het zoals ik", "in mijn stem", "maak mijn toon-skill", of als de gebruiker een formulering van je corrigeert: werk dan deze skill bij.
---

# Mijn toon (tip 12)

AI-tekst valt op, tenzij je hem bijschaaft met je eigen stem. Deze skill bevat de stem van de
gebruiker, de verboden woorden en daaronder vaste regelsets. Hij wordt beter bij elke correctie.

## Leerregel (belangrijk)

Elke keer dat de gebruiker een formulering van je corrigeert, voeg je het patroon toe aan
"Correcties" onderaan dit bestand: wat je schreef, wat het moest zijn, de regel erachter. Vraag niet
of dat mag, doe het en meld het in één zin.

## Skill vullen (eerste keer)

Prompt van de gebruiker: *"Turn this into a skill called /my-tone. Here are five of my scripts and
posts: [paste]. Capture how I open, how long my sentences run, the words I use, and this
banned-words list: [list]. Add these rule sets underneath: ASD-STE100 Simplified Technical English
(short sentences, one idea each, plain words), Google's developer style guide for tone, and Apple's
style guide. From now on, every time I correct your wording, update the skill."*

Vijf echte teksten zeggen meer dan een lange beschrijving. Vraag erom als ze ontbreken. Analyseer
en vul de secties "Zo klink ik" en "Voorbeeldzinnen" in.

## Zo klink ik

*(Nog in te vullen op basis van vijf teksten. Tot die tijd gelden de vaste voorkeuren hieronder.)*

- Openingen: ...
- Zinslengte: ...
- Woorden die ik vaak gebruik: ...
- Taal: Nederlands, tenzij de doelgroep anders vraagt.

## Vaste voorkeuren (al bekend)

- Natuurlijke, menselijke taal. Schrijf als iemand die weet waar het over gaat, zonder je best
  te doen om dat te laten zien.
- Geen em-dashes en geen en-dashes. Gebruik komma's, punten, haakjes of dubbele punten. Wordt een
  zin te lang zonder streepje: splits hem in twee.
- Varieer in zinslengte. Af en toe een korte zin. Witruimte waar die hoort.
- Twijfel tussen een nette en een directe formulering: kies de directe.

## Verboden

Constructies:
- "Het gaat niet om X, maar om Y."
- Overdreven parallelle zinsbouw.
- Drie-delige opsommingen als twee ook volstaan.
- Zinnen die beginnen met "In essentie" of "Uiteindelijk".
- Een slotzin die samenvat wat er net stond.

Woorden: *(lijst van de gebruiker hier aanvullen)* plus de AI-woorden uit `/copy`.

## Regelset 1: ASD-STE100 Simplified Technical English (https://asd-ste100.org)

- Korte zinnen: instructies max. 20 woorden, beschrijvingen max. 25.
- Eén idee per zin, één onderwerp per alinea.
- Actieve vorm. Gebiedende wijs voor instructies ("Klik op Opslaan").
- Eén woord voor één ding. Wissel geen synoniemen af voor hetzelfde begrip.
- Gewone woorden boven jargon. Leg een vakterm uit bij het eerste gebruik.

## Regelset 2: Google developer style guide, toon (https://developers.google.com/style/tone)

- Gesprekstoon, vriendelijk en respectvol, zonder te kletsen.
- Spreek de lezer direct aan met "je".
- Geen grappen die vertaling of begrip in de weg zitten, geen uitroeptekens als vulling.
- Geen "gewoon", "simpelweg", "eenvoudig": wat makkelijk is voor jou, is het niet altijd voor de lezer.
- Zeg wat iets doet, niet hoe geweldig het is.

## Regelset 3: Apple Style Guide (https://support.apple.com/en-gb/guide/applestyleguide/welcome/web)

- Helder, beknopt, menselijk. Schrijf voor de taak van de lezer.
- Knoppen en menu's in de vorm zoals ze op het scherm staan.
- Consistente termen voor interface-elementen.
- Positief en concreet formuleren: zeg wat wel kan.

## Voorbeeldzinnen

*(Vul aan met echte zinnen van de gebruiker.)*

## Correcties

| Ik schreef | Moest zijn | Regel |
|---|---|---|
| | | |
