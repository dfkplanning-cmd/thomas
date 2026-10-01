---
name: kie
description: Genereer beelden en video's voor een ontwerp via Kie AI (veel beeld- en videomodellen in één API, betalen per generatie), in de stijl van het design system. Gebruik bij "maak een hero-afbeelding", "genereer beeld", "maak een video", "productshot", of "koppel Kie". Bevat ook de eenmalige setup.
argument-hint: "[setup | wat je wilt genereren]"
---

# Beeld en video genereren (tip 08)

Claude maakt zelf geen beeld of video, maar kan een generator aansturen. Kie AI bundelt de meeste
grote modellen (Nano Banana, Flux, Veo, Kling, Seedance, Midjourney en meer) en je betaalt per
generatie. Er is geen officiële connector, wel een community MCP en CLI:
https://github.com/felores/kie-cli-mcp.

## Setup (eenmalig)

1. De gebruiker maakt een account op https://kie.ai en haalt een API-sleutel op
   (https://kie.ai/api-key).
2. Sleutel als omgevingsvariabele, nooit in een bestand dat in git komt:
   ```bash
   export KIE_AI_API_KEY="..."   # in ~/.zshrc of ~/.bashrc
   ```
3. MCP-server toevoegen op gebruikersniveau (dus niet in de repo), alleen beeld- en videotools
   om context te sparen:
   ```bash
   claude mcp add kie-ai --scope user \
     -e KIE_AI_API_KEY="$KIE_AI_API_KEY" \
     -e KIE_AI_TOOL_CATEGORIES=image,video \
     -- npx -y @felores/kie-ai-mcp-server
   ```
   Alternatief zonder MCP: `npm i -g @felores/kie-cli` en dan `kie-cli --help`.
4. Test met één beeld (zie hieronder) en meld de prijs uit https://kie.ai/pricing.

## Genereren

De MCP-server werkt met een plan en goedkeuring, zodat er nooit per ongeluk betaald wordt:

1. `list_models` om een model te kiezen. Standaard: een snel beeldmodel voor schetsen, het beste
   model pas voor de definitieve versie.
2. `prepare_media_generation` met één tot zes verzoeken. Laat de gebruiker het plan en de prijs zien.
3. Pas na expliciete goedkeuring: `submit_media_generation` met het plan-id.
4. Wacht op de taak (`wait_for_task` of `get_task_status`), download het resultaat naar
   `assets/generated/` met een beschrijvende bestandsnaam.

Via de CLI is het hetzelfde patroon: plan maken, dan `--approve <plan-id>`.

## Prompts in de huisstijl

Lees eerst het actieve design system (sectie 7, Iconen en beeld) en bouw de prompt op uit:
onderwerp, compositie en beeldverhouding, licht, kleurpalet (de merk-hex-codes in woorden),
stijl (foto, 3D, illustratie), wat er niet in mag.

Voorbeeld van de gebruiker: *"Generate a hero image for this section in the brand style, 16:9, no
text in the image."*

Regels:
- Geen tekst in gegenereerde beelden. Tekst hoort in HTML.
- Beeldverhouding passend bij de plek: hero 16:9 of 21:9, kaart 4:3, social 1:1 of 4:5, story 9:16.
- Bij een grote batch: eerst één proef, dan de rest.
- Lever voor het web ook een WebP-versie en zet `width` en `height` op de `<img>`.

## Kosten en veiligheid

- Kie rekent apart af, los van het Claude-abonnement. Elke generatie kost credits.
- De API-sleutel is een wachtwoord. Nooit in code, commits, screenshots of chats.

## Alternatief

Heeft de gebruiker in deze sessie een andere beeldgenerator gekoppeld (bijvoorbeeld de Krea-connector
met `generate_image` en `generate_video`), dan kan die hetzelfde werk doen. Vraag welke de voorkeur
heeft en volg dezelfde regels voor stijl, tekst en kosten.
