# Overdracht: manysocials-presentaties

Startprompt voor een nieuwe sessie. Lees dit eerst, daarna de bronbestanden.

## Wat er staat

Twee presentaties, allebei gepubliceerd als Claude-artifact (privé, eigenaar dfkplanning):

| Pagina | Artifact | Bron | Build |
|---|---|---|---|
| Chips (manysocials-landingspagina, hip chipsmerk) | https://claude.ai/artifact/HTv6TvxifX55dgBCHyb2Ef | `dev/` (bron.html, pagina.css, pagina.js, zakken.js) | `python3 bouw.py` → `index.html` + `dev/voorbeeld-index.html` |
| New York Pizza, "De Pizza van Nederland" | https://claude.ai/artifact/4G6Huvy3whRoZUNE1e5xU1 | `dev-pizza/` (bron.html, pizza.css, pizza.js) | `python3 bouw.py pizza` → `pizza.html` + `dev-pizza/voorbeeld/index.html` |

- Origineel (niet aanraken): https://claude.ai/artifact/96z3ziE8rZiykqeu9W6mzy
- Per ongeluk aangemaakte kopie zonder beelden: https://claude.ai/artifact/4EoEMkDRqXbv3WZLEaLHsE (wachten op akkoord van de gebruiker om te verwijderen)
- Branch: `claude/exciting-lovelace-9iwvn4`

Publiceren: Artifact-tool met hetzelfde `file_path` (`manysocials-redesign/pizza.html` of `index.html`). In een nieuwe sessie eerst `action: read` op de URL en dan publiceren met `url`, anders ontstaat een nieuw artifact. Nieuwe beelden meesturen via `files` (`{"img/naam.webp": "manysocials-redesign/beeld/naam.webp"}`). De pizzapagina declareert de capability `sample` (live agent in de DM); bij een gewone herpublicatie `capabilities` weglaten, dan blijft die staan.

De chipspagina declareert sinds 2026-10-18 ook `sample` (zelf typen in de DM met de KNAP-agent, `REGELS` in `dev/pagina.js`, script als terugval).

KNAP is de gekozen verpakking: vrijstaande fotozakken in `beeld/knap/<smaak>.webp` (publiceren als `img/knap/...`), met een ronde "van <naam>"-sticker (gezicht uit `beeld/knap/sanne.jpg` of `beeld/gezicht-*.webp`). Makers in de band: Sanne, Jesse, Noor, Marije, Lars.

Foto's op de chipspagina (`beeld/chips/`, publiceren als `img/chips/...`, bron-PNG's in `Z:\Claude\manysocials-redesignotos\`): bank onder Onze diensten, maker/dm/tafel/finale als vier winactiekaarten onder het vlaggenschip, fabriek onder de live-inzendingen, straat naast Vragen, product (met Jesse) in de afsluiter.

Beelden staan in `beeld/`. Voor de lokale preview moeten ze ook in `dev-pizza/voorbeeld/img/` en `dev/img/` staan.

## Pizzapagina in het kort

- Hero: H1, telefoon in een fotorealistische hand (Krea), Instagram-DM met @newyorkpizza_nl. Het demogesprek duurt ongeveer 3 s (tempo `f = .2`), daarna krijgen de beelden de tijd: pizzakaart, veeg, pagina, pizza vliegt naar "Jouw pizza".
- Band onder de hero: zes persoonlijke pizza's. Kiezen wisselt meteen de storyfoto rechtsboven, het rondje op de kaart en het label, en de pizza vliegt uit de band naar het toneel.
  - Big T Hot Honey (Thomas), Citroen Marije, La Dolce Sanne, Pistache Jesse, Noor Royale, Peer Pressure Lars. Gezichten: `beeld/gezicht-*.webp` (GPT Image).
- Live typen: het invoerveld is echt. De agent (Claude via `sample`, `modelTier: quick`, JSON-antwoorden) vraagt naam, bodem, toppings en saus en maakt een pizza met de voornaam erin. Zonder Claude neemt `scriptAgent` het over. Prompt: `REGELS` in `pizza.js`.
- Secties: idee, mening (kop boven, iPhone-foto, 61% eronder), past, fases, oplevert, schaal, landen, samen (keukenfoto), stap (3 minuten, je eigen pizza), bronnen.

## Werkafspraken van de gebruiker

- Nederlands, direct en natuurlijk. Geen em/en dashes, geen "niet X maar Y", geen drieslagen als twee genoeg is, geen slotzin die samenvat.
- Inhoud alleen aanpassen als de gebruiker het vraagt; vormgeving mag vrij.
- Beelden: GPT Image (`openai/gpt-image-2.5-flare`) in iPhone-stijl, echt en niet afgezaagd. Nano Banana Pro en Topaz-upscale via Krea zijn ook gebruikt.
- Visueel, weinig tekst, weinig wit. Bij een keuze moet je direct iets zien gebeuren.
- Na elke wijziging: bouwen, testen met Playwright (`/opt/node22/lib/node_modules/playwright`, Chromium in `/opt/pw-browsers/chromium-1194`), publiceren, committen en pushen.

## Open beslissingen (wachten op de gebruiker)

1. Tegel "Data Innovation Award 2025" klopt niet met bron 7 ("Customer Data Awards 2025").
2. "De winnaars krijgen prijzengeld" direct na "De winnaar komt op de kaart".
3. Contactadres maarten@automatiflow.nl: zo bedoeld, of een manysocials-adres?
4. Vier keer "iedereen" rond de meningsectie.
5. Verwijderen van de kopie zonder beelden (zie boven).

## Nachtronde

Zie `NACHTLOG.md` voor wat er 's nachts is gedaan.
