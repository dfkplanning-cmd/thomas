// Gedeelde opslag voor popup en galerij (zelfde extensie-origin).
const DB_NAME = "design-assistent-referenties";
const STORE = "refs";

const DEFAULT_SETTINGS = {
  folder: "DesignAssistent/referenties",
  tags: ["hero", "typografie", "kleur", "navigatie", "pricing", "animatie", "mobiel", "iconen", "landing", "dashboard"],
  youtube: true,
  theme: "auto",
};

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: "id" });
      store.createIndex("created", "created");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const result = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(result && "result" in result ? result.result : result);
    t.onerror = () => reject(t.error);
  });
}

const refs = {
  put: (ref) => tx("readwrite", (s) => s.put(ref)),
  remove: (id) => tx("readwrite", (s) => s.delete(id)),
  all: () => tx("readonly", (s) => s.getAll()),
};

async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

async function saveSettings(settings) {
  await chrome.storage.local.set({ settings });
}

function slugify(text) {
  return (text || "pagina")
    .toLowerCase()
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 50) || "pagina";
}

function stamp(date = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}_${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "auto" ? "" : theme;
}
