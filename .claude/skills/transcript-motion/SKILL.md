---
name: transcript-motion
description: Maak motion graphics bij een opgenomen video, getimed op wat er gezegd wordt. Woord-voor-woord-transcript met Whisper, de vijf momenten kiezen waar een animatie helpt, echte cijfers opzoeken, korte HTML-animaties in het design system bouwen en met HyperFrames naar MP4 renderen. Gebruik bij "maak animaties bij mijn video", "transcript", "motion graphics", "b-roll animaties", "lower thirds", of een aangeleverde video- of audio-opname.
argument-hint: "[video- of transcriptbestand]"
---

# Transcript naar motion graphics (tip 24)

De werkwijze uit de video: transcript met timestamps per woord, momenten kiezen, echte cijfers
erbij, HTML-animaties in het design system, renderen naar MP4, slepen in de montage.

Prompt van de gebruiker: *"Here's the word-level transcript of my video. Find the five moments where
an animation would help the viewer, research the real numbers for each, then build a short HTML
animation for each moment in my design system, timed to the timestamps, and render each one to MP4
with HyperFrames. Save them to /animations."*

## 1. Transcript met timestamps per woord (Whisper)

Whisper is gratis, open source en draait lokaal (https://github.com/openai/whisper). Vraag om
timestamps per woord, niet alleen per zin, zodat elke animatie op het juiste woord landt.

```bash
pip install -U openai-whisper          # vraagt ffmpeg
whisper video.mp4 --model medium --language nl --word_timestamps True --output_format json --output_dir transcript
```
Engelse video: `--language en`. Sneller op een laptop: `--model small`.
Het resultaat `transcript/video.json` heeft `segments[].words[]` met `word`, `start`, `end`.

Heeft de gebruiker al een transcript met woordtimestamps, sla deze stap over.

## 2. Vijf momenten kiezen

Lees het transcript en kies de vijf plekken waar een animatie de kijker echt helpt:
- een getal of statistiek (grafiek, teller)
- een vergelijking (voor en na, A tegen B)
- een proces of stappenreeks (diagram dat opbouwt)
- een naam, citaat of kernbegrip (kinetische typografie, lower third)
- een lijst (items die één voor één verschijnen)

Maak een tabel: moment, starttijd, eindtijd, het exacte woord waarop het begint, soort animatie,
waarom het helpt. Laat die tabel eerst goedkeuren.

## 3. Echte cijfers

Zoek voor elk moment met een claim of getal de echte bron op. Noteer bron en datum in
`animations/bronnen.md`. Klopt een getal uit de video niet, meld dat aan de gebruiker in plaats
van het stil te verbeteren.

## 4. HTML-animaties bouwen in het design system

- Lees het actieve design system: kleuren, fonts, motion-easing. Zo ziet het er niet uit als
  vibe-coded AI-design.
- Eén map per moment: `animations/01-<naam>/index.html`.
- Formaat van de montage aanhouden (meestal 1920×1080, 30 fps). Vraag bij twijfel.
- Timing: de animatie start op t=0 en duurt zo lang als het moment (eind min start, plus ongeveer
  0.5 s uitloop). Noteer de starttijd in de video in de bestandsnaam, bijvoorbeeld
  `01-omzet_00m42s.mp4`, zodat hij in de montage direct op de juiste plek valt.
- Animaties moeten deterministisch en zoekbaar (seekable) zijn: GSAP-timelines, geen
  `setTimeout`-ketens of willekeur.

## 5. Renderen met HyperFrames

HyperFrames (https://github.com/heygen-com/hyperframes) rendert HTML-animaties naar MP4.
Installeren voor Claude Code (eenmalig, op de machine van de gebruiker):

```bash
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
```
of zonder plugin: `npx hyperframes skills update` (installeert de kernskills).

Daarna: volg de `/hyperframes`-router. Die kent het compositieformaat (`data-*`-timing,
`class="clip"`) en het render-commando. Voor korte, losse animaties is de workflow
`/motion-graphics` van HyperFrames zelf het beste startpunt. Deze skill (`/transcript-motion`)
regelt de keuze en timing, die van HyperFrames de compositie en het renderen.

Is HyperFrames niet beschikbaar, render dan als terugval met Playwright-screenshots per frame en
ffmpeg, of lever de HTML-bestanden op en zeg eerlijk dat renderen nog moet.

## 6. Opleveren

`animations/` met per moment een MP4 (en de HTML-bron), plus `animations/overzicht.md`: tabel met
bestandsnaam, starttijd in de video, duur, wat het laat zien, bron van de cijfers.
