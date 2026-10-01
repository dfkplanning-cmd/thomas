// Galerij: masonry-muur met zoeken, tagfilters, licht/donker en export.
const $ = (id) => document.getElementById(id);
let all = [];
let settings;
const activeTags = new Set();

function matches(ref, q) {
  if (activeTags.size && !ref.tags.some((t) => activeTags.has(t))) return false;
  if (!q) return true;
  const hay = [ref.title, ref.site, ref.note, ref.url, ...ref.tags].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

function renderFilters() {
  const counts = new Map();
  for (const r of all) for (const t of r.tags) counts.set(t, (counts.get(t) || 0) + 1);
  const tags = [...new Set([...settings.tags, ...counts.keys()])].filter((t) => counts.get(t));
  $("filters").innerHTML = "";
  for (const tag of tags) {
    const chip = document.createElement("button");
    chip.className = "chip" + (activeTags.has(tag) ? " on" : "");
    chip.textContent = `${tag} ${counts.get(tag)}`;
    chip.addEventListener("click", () => {
      activeTags.has(tag) ? activeTags.delete(tag) : activeTags.add(tag);
      renderFilters();
      render();
    });
    $("filters").appendChild(chip);
  }
}

async function copyImage(ref, btn) {
  try {
    const blob = await (await fetch(ref.dataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    btn.textContent = "Gekopieerd";
  } catch {
    btn.textContent = "Mislukt";
  }
  setTimeout(() => (btn.textContent = "Kopieer beeld"), 1400);
}

function render() {
  const q = $("search").value.trim();
  const list = all.filter((r) => matches(r, q));
  $("total").textContent = `${list.length} van ${all.length}`;
  $("empty").hidden = all.length > 0;
  const wall = $("wall");
  wall.innerHTML = "";
  for (const ref of list) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img loading="lazy" alt="">
      <div class="meta">
        <a target="_blank" rel="noopener"></a>
        <span class="muted site"></span>
        <span class="note"></span>
        <div class="chips tags"></div>
        <div class="actions">
          <button class="ghost copy">Kopieer beeld</button>
          <button class="ghost del">Verwijder</button>
        </div>
      </div>`;
    const img = card.querySelector("img");
    img.src = ref.dataUrl;
    img.addEventListener("click", () => { $("zoom").querySelector("img").src = ref.dataUrl; $("zoom").showModal(); });
    const a = card.querySelector("a");
    a.href = ref.url;
    a.textContent = ref.title || ref.url;
    card.querySelector(".site").textContent = `${ref.site} · ${new Date(ref.created).toLocaleDateString("nl-NL")}`;
    card.querySelector(".note").textContent = ref.note;
    for (const t of ref.tags) {
      const s = document.createElement("span");
      s.className = "chip";
      s.textContent = t;
      card.querySelector(".tags").appendChild(s);
    }
    card.querySelector(".copy").addEventListener("click", (e) => copyImage(ref, e.target));
    card.querySelector(".del").addEventListener("click", async () => {
      if (!confirm("Deze referentie uit de bibliotheek halen? (Bestanden in Downloads blijven staan.)")) return;
      await refs.remove(ref.id);
      await load();
    });
    wall.appendChild(card);
  }
}

async function load() {
  all = (await refs.all()).sort((a, b) => b.created.localeCompare(a.created));
  renderFilters();
  render();
}

$("search").addEventListener("input", render);
$("zoom").addEventListener("click", () => $("zoom").close());

$("theme").addEventListener("click", async () => {
  const order = ["auto", "light", "dark"];
  settings.theme = order[(order.indexOf(settings.theme) + 1) % order.length];
  applyTheme(settings.theme);
  $("theme").title = "Thema: " + settings.theme;
  await saveSettings(settings);
});

$("export").addEventListener("click", () => {
  const data = all.map(({ dataUrl, ...rest }) => rest);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `referenties-${stamp()}.json`;
  a.click();
});

$("settings-btn").addEventListener("click", () => {
  $("set-folder").value = settings.folder;
  $("set-tags").value = settings.tags.join(", ");
  $("set-youtube").checked = settings.youtube;
  $("settings").showModal();
});
$("set-save").addEventListener("click", async () => {
  settings.folder = $("set-folder").value.trim() || DEFAULT_SETTINGS.folder;
  settings.tags = $("set-tags").value.split(",").map((t) => t.trim()).filter(Boolean);
  settings.youtube = $("set-youtube").checked;
  await saveSettings(settings);
  renderFilters();
});

(async () => {
  settings = await getSettings();
  applyTheme(settings.theme);
  await load();
})();
