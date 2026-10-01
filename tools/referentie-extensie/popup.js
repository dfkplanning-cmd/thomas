// Popup: maakt bij openen direct een screenshot van het zichtbare deel,
// laat je een notitie en tags kiezen en bewaart alles.
let shot = null;
let tab = null;
const chosen = new Set();

const $ = (id) => document.getElementById(id);

async function init() {
  const settings = await getSettings();
  applyTheme(settings.theme);
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  $("page-title").textContent = tab?.title || "";

  if (!settings.youtube && /(^|\.)youtube\.com$/.test(new URL(tab.url).hostname)) {
    $("status").textContent = "YouTube staat uit in de instellingen van de bibliotheek.";
    $("save").disabled = true;
    return;
  }

  try {
    shot = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
    $("shot").src = shot;
  } catch (err) {
    $("status").textContent = "Screenshot lukt niet op deze pagina (" + err.message + ").";
    $("save").disabled = true;
  }

  for (const tag of settings.tags) {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = tag;
    chip.addEventListener("click", () => {
      chosen.has(tag) ? chosen.delete(tag) : chosen.add(tag);
      chip.classList.toggle("on");
    });
    $("tags").appendChild(chip);
  }
  $("note").focus();
}

async function save() {
  if (!shot) return;
  $("save").disabled = true;
  const settings = await getSettings();
  const created = new Date();
  const base = `${stamp(created)}_${slugify(tab.title)}`;
  const folder = settings.folder.replace(/^\/+|\/+$/g, "");
  const ref = {
    id: base,
    url: tab.url,
    title: tab.title,
    site: new URL(tab.url).hostname.replace(/^www\./, ""),
    note: $("note").value.trim(),
    tags: [...chosen],
    created: created.toISOString(),
    image: `${base}.png`,
  };

  await refs.put({ ...ref, dataUrl: shot });

  const json = JSON.stringify(ref, null, 2);
  await chrome.downloads.download({ url: shot, filename: `${folder}/${base}.png`, conflictAction: "uniquify", saveAs: false });
  await chrome.downloads.download({
    url: "data:application/json;charset=utf-8," + encodeURIComponent(json),
    filename: `${folder}/${base}.json`, conflictAction: "uniquify", saveAs: false,
  });

  $("status").textContent = `Bewaard in Downloads/${folder}`;
  setTimeout(() => window.close(), 900);
}

$("save").addEventListener("click", save);
$("note").addEventListener("keydown", (e) => { if (e.key === "Enter") save(); });
$("open-gallery").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: chrome.runtime.getURL("gallery.html") });
});

init();
