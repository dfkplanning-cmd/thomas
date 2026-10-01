# BasePage stijlgids

Hoe een BasePage eruitziet en werkt. Een BasePage is de werkpagina van een project: alle prompts, refs, audio, video en downloads op één plek, per aflevering. Je gebruikt hem dagelijks om prompts te kopiëren en bestanden te downloaden, ook op een Chromebook of telefoon.

Referentie: de Regietafel (https://claude.ai/artifact/UM2bt88izptDFRcTrgoRnV) en de BasePage TAG-supermarkt (https://claude.ai/artifact/QuThwo4sAEwnuUs8TGdbqf).

## Uitgangspunten

- Kopiëren en downloaden gaan voor alles. De kopieerknop is het grootste element op een kaart.
- Donker is de standaard. Er is altijd een lichte variant die het systeem volgt.
- Kleuren komen van de TAG-website. Typografie is Outfit, met Doto voor titel en nummers en Silkscreen voor de afleveringtabs.
- Geen schaduwen, geen verlopen. Vlakken met een dunne rand.
- Alles schaalt mee met één regelaar. Maten dus in `rem`, niet in `px`.
- Werkt op 400 px breed zonder dat er iets uit beeld schuift.

## Kleuren

Zet ze als variabelen op `:root`. De lichte variant komt in `@media (prefers-color-scheme: light)` onder `:root:not([data-theme="dark"])`, en nog een keer onder `:root[data-theme="light"]`.

| Variabele | Donker | Licht | Waarvoor |
|---|---|---|---|
| `--bg` | `#0b0b0e` | `#f3f5f7` | pagina |
| `--panel` | `#111115` | `#ffffff` | kaarten |
| `--sunk` | `#08080a` | `#e9ecf0` | promptvak, video, lege beelden |
| `--ink` | `#f2f2f2` | `#0b0b0e` | tekst |
| `--muted` | `#9a9aa5` | `#5a5a66` | lopende tekst, details |
| `--line` | `#1e1e24` | `#dcdfe5` | randen |
| `--line-strong` | `#2c2c35` | `#c4c8d0` | randen van knoppen en pillen |
| `--accent` | `#2bd4d4` | `#0a7a7a` | teal: actief, nummers, labels, kopieerknop |
| `--accent-fill` | `#0e2a2c` | `#ddf3f3` | vulling van teal pillen en actieve tab |
| `--accent-ink` | `#051314` | `#ffffff` | tekst op een teal knop |
| `--blue` | `#5aa8ff` | `#1d64c4` | pillen voor sets, props en audio |
| `--done` | `#4ade80` | `#15803d` | knop na "Gekopieerd" |

In licht is de teal donkerder, zodat witte tekst op de knop leesbaar blijft.

## Typografie

Laad via Google Fonts: Outfit (300 tot 700), Doto (800 tot 900), Silkscreen (400 en 700) en JetBrains Mono (400 en 600).

| Rol | Letter | Voorbeeld |
|---|---|---|
| Koppen en lopende tekst | Outfit | `TAG-supermarkt`, kaarttitels, knoppen |
| Grote titel en nummers | Doto, gewicht 900, in `--accent` | `STROOMSTORING`, `4.1`, `33,0`, codes in het cue-menu |
| Afleveringtabs | Silkscreen | `1 AANBIEDINGEN`, `4 STROOMSTORING` in de bovenbalk |
| Prompts, tijdcodes, rollen | JetBrains Mono | inhoud van `<pre>`, "Joep" voor een liedregel |
| Labels | Outfit 600, 0,6875rem, hoofdletters, spatiëring 0,22em, `--accent` | `CUES`, `REFS`, `HET LIED` |

De grote titel bestaat uit twee regels: de projectnaam in Outfit 500 en daaronder de afleveringstitel in Doto. Gebruik geen andere display-letter. Silkscreen, een pixelletter van dichte vierkante blokjes, is alleen voor de tabs. Hij loopt breed: controleer op 400 px dat de tabs passen.

## Opbouw van de pagina

1. **Bovenbalk**, sticky. Links het TAG-logo (32 px hoog, `tag-logo.png`) met "BasePage". Dan de afleveringtabs, met nummer en naam in Silkscreen. Rechts de schaalregelaar.
2. **Cue-menu** links, per aflevering. Elke sectie en serie is een regel met een code in Doto (`R` voor refs, `4.1` voor serie 1, `33,0` voor de montage) en een korte naam.
3. **Grip**: de dunne lijn tussen menu en inhoud. Slepen verandert de breedte.
4. **Inhoud**, per aflevering in deze volgorde:
   - kop: label, titel in twee regels, een korte alinea over het verhaal;
   - het lied: liedtekst met per regel wie zingt, en de muziekcues in grijs;
   - refs: beelden met naam, bestandsnaam en downloadknop;
   - series, elk als cuekaart (zie hieronder);
   - opening en slot, als die er zijn;
   - renders en montage.

Tussen secties staat een dunne lijn (`border-top: 1px solid var(--line)`).

## Onderdelen

**Kaart.** `background: var(--panel)`, rand 1px `--line`, hoeken 0,625rem, binnenruimte 1,125rem.

**Cuekaart (serie).** Bovenaan drie kolommen: het nummer in Doto (2,5rem, teal), de titel met de feiten eronder (stuk uit het lied, aantal tekens), en rechts de duur als teal pil (`7 SEC`). Daaronder de regels van die serie, dan de refs als pillen, dan het promptvak.

**Pillen.** Volledig rond, rand 1px.
- Duur en status: teal rand, `--accent-fill` vulling, teal tekst, hoofdletters met spatiëring.
- Cast: grijze rand (`--line-strong`), witte tekst, met een rond fotootje van 1,375rem.
- Sets, props en audio (BLACKOUT, CASH, Audio 1): grijze rand, tekst in `--blue`.

**Promptvak.** Achtergrond `--sunk`, rand 1px. Bovenin een balk met het label (bijvoorbeeld "Runway-prompt · Seedance 2.5") en rechts de kopieerknop. De prompt staat in een `<pre>` in JetBrains Mono 0,8125rem, met `white-space: pre-wrap`. Lange prompts zijn ingeklapt tot 13,125rem hoog, met eronder de knop "Hele prompt tonen" (wordt "Inklappen").

**Knoppen.**
- Kopieerknop (`.go`): teal vlak, tekst `--accent-ink`, de grootste knop op de kaart. Na een klik "Gekopieerd" in `--done`. Lukt het klembord niet, dan wordt de tekst geselecteerd met de melding "Geselecteerd, druk Ctrl+C".
- Gewone knop: transparant, rand `--line-strong`. Bij hover een teal rand en tekst.

**Video.** 16:9, rand 1px, hoeken 0,625rem, `preload="metadata"`.

**Varianten.** Een tweede versie van een prompt (Krea, ouder, Chinees) staat in een `<details>` onder de hoofdprompt, met een eigen kopieerknop.

## Gedrag

- **Schalen.** A−, een schuifje en A+, van 80 tot 140 % in stappen van 5. Zet `html { font-size: calc(var(--scale, 1) * 100%); }` en reken alles in `rem`. Een klik op het percentage zet het terug op 100 %.
- **Menu.** Standaard 156 px breed, versleepbaar tussen 112 en 320 px, ook met de pijltjestoetsen. "Inklappen" verbergt het menu. "Menu" in de bovenbalk of een dubbelklik op de grip haalt het terug.
- **Onthouden.** Schaal, menubreedte, in- of uitgeklapt en het laatste tabblad gaan in `localStorage`, altijd in `try/catch`. De pagina moet ook werken als dat mislukt.
- **Tabs.** Elk tabblad heeft een hash (`#muisjes`, `#stroom`) zodat je er direct naartoe kunt linken.
- **Telefoon** (onder 860 px). Eén kolom. Het menu wordt een horizontale strook met knoppen, de grip verdwijnt, de kopieerknop wordt over de volle breedte gezet en de schaalregelaar krijgt een eigen regel.

## Downloads

- Losse bestanden: een knop met `data-direct="bestandsnaam"`.
- Meerdere bestanden in één keer: `data-zip="naam.zip"` en `data-files="a.wav b.txt"`. De zip wordt in de browser gemaakt met JSZip (via cdnjs).
- Opslaan gaat via `window.claude.use("downloads")`. Is die er niet, verberg de knoppen dan en toon "Downloaden kan in deze weergave niet."
- De BasePage heeft de capability `downloads`. Laat die staan bij elke publicatie.

## Bestandsnamen

Kleine letters, woorden met streepjes, de duur in de naam.

- `<project>-serie-<n>-runway-u1.txt` en `...-krea-u1.txt` voor prompts (`u1`, `v2` is de versie)
- `<project>-serie-<n>-audio-<duur>s.wav`
- `<project>-serie-<n>-zwart-<duur>s.mp4` voor de zwarte video met audio (Video 1)
- `<project>-lied-volledig.mp3`
- renders in 4K blijven lokaal; op de pagina komt een 1080p-versie onder 15 MB

## Publiceren

- **Lees altijd eerst de live versie** (Artifact read) en bouw daarop verder. Meerdere sessies publiceren naar dezelfde pagina. Wie vanuit een oude lokale kopie publiceert, gooit andermans werk weg.
- **Typ nooit een prompt over.** Bewerk de HTML met een script en laat de inhoud van elke `<pre>` ongemoeid. Controleer na afloop dat het aantal `<pre>`-blokken gelijk is en dat de inhoud identiek is.
- Stuur alleen mee wat verandert. Bestanden die je niet meestuurt blijven staan.
- Het logo komt uit https://claude.ai/artifact/Gk7Su8Ms6xsrjtVr1cG6Lb, pad `tag-logo.png`. Kopieer het via `files` met `{artifact, path}`.
- Geen bestand groter dan 15 MB.
- Krijg je een conflict, voeg je wijziging dan samen met de versie die je terugkrijgt. Nooit forceren.

## Checklist voor een nieuwe aflevering

- [ ] Tab met nummer en titel, en een hash
- [ ] Cue-menu: verhaal, refs, elke serie met code en duur, montage
- [ ] Verhaal en liedtekst met tijden
- [ ] Refs met downloadknop, in de volgorde van het paneel in Runway
- [ ] Per serie: nummer, duur als pil, stuk uit het lied, regels, refs als pillen, prompt met kopieerknop, zwarte mp4 en audio
- [ ] Varianten in `<details>`
- [ ] Renders en montage
- [ ] Getest in donker, licht en op 400 px; kopiëren, inklappen, schalen en downloaden werken
