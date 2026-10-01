/* Design Assistent /tweak paneel.
 * Wordt door tweak.py in de geserveerde pagina gezet, nooit op schijf.
 * Leest :root-variabelen, toont schuifjes en kleurkiezers, laat secties
 * verbergen en stuurt bij "Bake" alles naar de server. */
(() => {
  if (window.__tweakPanel) return;
  window.__tweakPanel = true;

  const root = document.documentElement;

  // ---------- helpers ----------
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);

  function toHex(value) {
    probe.style.color = "";
    probe.style.color = value;
    if (!probe.style.color) return null;
    const m = getComputedStyle(probe).color.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    if (parts.length > 3 && parts[3] < 1) return null; // transparantie: tekstveld
    return "#" + parts.slice(0, 3).map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
  }

  function classify(value) {
    const v = value.trim();
    const len = v.match(/^(-?\d*\.?\d+)(px|rem|em|%|vw|vh|ch)$/);
    if (len) return { kind: "length", num: parseFloat(len[1]), unit: len[2] };
    if (/^-?\d*\.?\d+$/.test(v)) return { kind: "number", num: parseFloat(v), unit: "" };
    if (!/^var\(/.test(v) && CSS.supports("color", v)) {
      const hex = toHex(v);
      if (hex) return { kind: "color", hex };
    }
    return { kind: "text" };
  }

  function collectVars() {
    const found = new Map();
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; } // externe sheet
      for (const rule of Array.from(rules || [])) {
        if (!(rule instanceof CSSStyleRule)) continue;
        if (!/(^|,)\s*:root\s*(,|$)/.test(rule.selectorText)) continue;
        for (const prop of Array.from(rule.style)) {
          if (prop.startsWith("--") && !found.has(prop)) {
            found.set(prop, rule.style.getPropertyValue(prop).trim());
          }
        }
      }
    }
    return found;
  }

  function sectionLabel(el) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? "#" + el.id : "";
    const cls = !id && el.classList.length ? "." + el.classList[0] : "";
    const h = el.querySelector("h1,h2,h3,h4");
    const text = (h ? h.textContent : el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
    return { name: tag + id + cls, text };
  }

  // ---------- state ----------
  const vars = collectVars();
  const initialVars = new Map(vars);
  const changedVars = new Map();
  const hidden = new Set();

  const bodyCS = getComputedStyle(document.body);
  const firstSection = document.querySelector("section, header, footer, [data-section]");
  const firstButton = document.querySelector("button, .btn, .button, input, .card");
  const globals = [
    { key: "fontScale", label: "Basis lettergrootte", unit: "%", min: 70, max: 150, step: 1,
      value: 100, rule: (v) => `html { font-size: ${v}%; }` },
    { key: "lineHeight", label: "Regelhoogte", unit: "", min: 1, max: 2.2, step: 0.05,
      value: Math.round((parseFloat(bodyCS.lineHeight) / parseFloat(bodyCS.fontSize) || 1.5) * 100) / 100,
      rule: (v) => `body { line-height: ${v}; }` },
    { key: "sectionSpace", label: "Ruimte per sectie", unit: "px", min: 0, max: 240, step: 2,
      value: firstSection ? parseFloat(getComputedStyle(firstSection).paddingTop) || 0 : 64,
      rule: (v) => `section, [data-section] { padding-top: ${v}px; padding-bottom: ${v}px; }` },
    { key: "radius", label: "Hoekradius", unit: "px", min: 0, max: 40, step: 1,
      value: firstButton ? parseFloat(getComputedStyle(firstButton).borderTopLeftRadius) || 0 : 8,
      rule: (v) => `button, .btn, .button, input, select, textarea, .card, [class*="card"] { border-radius: ${v}px; }` },
    { key: "bg", label: "Achtergrond", color: true, value: toHex(bodyCS.backgroundColor) || "#ffffff",
      rule: (v) => `body { background-color: ${v}; }` },
    { key: "fg", label: "Tekstkleur", color: true, value: toHex(bodyCS.color) || "#111111",
      rule: (v) => `body { color: ${v}; }` },
  ];
  for (const g of globals) g.initial = g.value;

  const liveStyle = document.createElement("style");
  liveStyle.id = "tweak-live";
  document.head.appendChild(liveStyle);

  function globalRules() {
    return globals.filter((g) => String(g.value) !== String(g.initial)).map((g) => g.rule(g.value));
  }
  function applyGlobals() { liveStyle.textContent = globalRules().join("\n"); }

  function setVar(name, value) {
    root.style.setProperty(name, value);
    if (value === initialVars.get(name)) changedVars.delete(name);
    else changedVars.set(name, value);
    updateCount();
  }

  // ---------- UI ----------
  const host = document.createElement("div");
  host.id = "tweak-host";
  host.style.cssText = "position:fixed;top:12px;right:12px;z-index:2147483647;";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
  <style>
    :host { all: initial; }
    * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
    .panel { width: 320px; max-height: calc(100vh - 24px); display: flex; flex-direction: column;
      background: #16161a; color: #ececf1; border: 1px solid #2c2c33; border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0,0,0,.35); font-size: 12px; overflow: hidden; }
    .panel.closed .body, .panel.closed .foot { display: none; }
    .head { display: flex; align-items: center; gap: 8px; padding: 10px 12px; cursor: grab; user-select: none;
      border-bottom: 1px solid #2c2c33; }
    .head b { font-size: 13px; flex: 1; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #ff6b2c; }
    .count { color: #9a9aa6; }
    .icon { background: none; border: 0; color: #9a9aa6; cursor: pointer; font-size: 14px; padding: 2px 4px; }
    .body { overflow: auto; padding: 4px 12px 12px; }
    h4 { margin: 14px 0 6px; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #ff8a4c; }
    .row { display: grid; grid-template-columns: 1fr auto; gap: 2px 8px; align-items: center; margin: 7px 0; }
    .row label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #c9c9d2; }
    .row output { color: #9a9aa6; font-variant-numeric: tabular-nums; }
    .row input[type=range] { grid-column: 1 / -1; width: 100%; accent-color: #ff6b2c; }
    .row input[type=color] { width: 36px; height: 22px; border: 1px solid #2c2c33; border-radius: 6px; background: none; padding: 0; }
    .row input[type=text] { grid-column: 1 / -1; width: 100%; background: #0f0f12; color: #ececf1;
      border: 1px solid #2c2c33; border-radius: 6px; padding: 5px 7px; font-size: 11px; }
    .sec { display: flex; gap: 8px; align-items: flex-start; padding: 5px 0; border-bottom: 1px dashed #2c2c33; cursor: pointer; }
    .sec input { margin-top: 2px; accent-color: #ff6b2c; }
    .sec small { display: block; color: #8a8a96; }
    .sec.off span { text-decoration: line-through; opacity: .55; }
    .empty { color: #8a8a96; margin: 4px 0; }
    .foot { display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid #2c2c33; }
    .foot button { flex: 1; border-radius: 8px; padding: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid #2c2c33; }
    .reset { background: transparent; color: #ececf1; }
    .bake { background: #ff6b2c; color: #16161a; border-color: #ff6b2c !important; }
    .msg { padding: 0 12px 10px; color: #9a9aa6; }
  </style>
  <div class="panel">
    <div class="head"><span class="dot"></span><b>Tweak</b><span class="count"></span>
      <button class="icon toggle" title="In- of uitklappen">▾</button></div>
    <div class="body"></div>
    <div class="foot"><button class="reset">Reset</button><button class="bake">Bake</button></div>
    <div class="msg"></div>
  </div>`;

  const panel = shadow.querySelector(".panel");
  const body = shadow.querySelector(".body");
  const msg = shadow.querySelector(".msg");
  const count = shadow.querySelector(".count");

  function updateCount() {
    const n = changedVars.size + globalRules().length + hidden.size;
    count.textContent = n ? `${n} wijziging${n === 1 ? "" : "en"}` : "";
  }

  function heading(text) {
    const h = document.createElement("h4");
    h.textContent = text;
    body.appendChild(h);
  }

  function rangeRow(label, value, min, max, step, unit, onInput) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<label></label><output></output><input type="range">`;
    row.querySelector("label").textContent = label;
    row.querySelector("label").title = label;
    const out = row.querySelector("output");
    const input = row.querySelector("input");
    Object.assign(input, { min, max, step, value });
    out.textContent = value + unit;
    input.addEventListener("input", () => { out.textContent = input.value + unit; onInput(input.value); });
    body.appendChild(row);
    return input;
  }

  function colorRow(label, hex, onInput) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<label></label><input type="color">`;
    row.querySelector("label").textContent = label;
    row.querySelector("label").title = label;
    const input = row.querySelector("input");
    input.value = hex;
    input.addEventListener("input", () => onInput(input.value));
    body.appendChild(row);
    return input;
  }

  function textRow(label, value, onInput) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<label></label><input type="text">`;
    row.querySelector("label").textContent = label;
    const input = row.querySelector("input");
    input.value = value;
    input.addEventListener("change", () => onInput(input.value));
    body.appendChild(row);
    return input;
  }

  function build() {
    body.innerHTML = "";
    const groups = { color: [], length: [], number: [], text: [] };
    for (const [name, value] of vars) groups[classify(value).kind].push([name, value]);

    heading("Kleuren");
    if (!groups.color.length) body.insertAdjacentHTML("beforeend", `<p class="empty">Geen kleurvariabelen in :root.</p>`);
    for (const [name, value] of groups.color) {
      colorRow(name, classify(value).hex, (v) => setVar(name, v));
    }

    heading("Maten en ruimte");
    if (!groups.length.length && !groups.number.length)
      body.insertAdjacentHTML("beforeend", `<p class="empty">Geen maatvariabelen in :root.</p>`);
    for (const [name, value] of [...groups.length, ...groups.number]) {
      const c = classify(value);
      const big = c.unit === "px" ? Math.max(c.num * 4, 64) : c.unit === "%" ? 200 : Math.max(c.num * 4, 4);
      const step = c.unit === "px" || c.unit === "%" ? 1 : 0.025;
      rangeRow(name, c.num, 0, Math.round(big * 100) / 100, step, c.unit, (v) => setVar(name, v + c.unit));
    }

    if (groups.text.length) {
      heading("Overige variabelen");
      for (const [name, value] of groups.text) textRow(name, value, (v) => setVar(name, v));
    }

    heading("Algemeen");
    for (const g of globals) {
      const apply = (v) => { g.value = g.color ? v : Number(v); applyGlobals(); updateCount(); };
      if (g.color) colorRow(g.label, g.value, apply);
      else rangeRow(g.label, g.value, g.min, g.max, g.step, g.unit, apply);
    }

    heading("Secties");
    const sections = document.querySelectorAll("[data-tweak-id]");
    if (!sections.length) body.insertAdjacentHTML("beforeend", `<p class="empty">Geen secties gevonden.</p>`);
    sections.forEach((el) => {
      const id = el.getAttribute("data-tweak-id");
      const depth = (() => { let d = 0, p = el.parentElement; while (p) { if (p.hasAttribute("data-tweak-id")) d++; p = p.parentElement; } return d; })();
      const { name, text } = sectionLabel(el);
      const row = document.createElement("label");
      row.className = "sec";
      row.style.paddingLeft = depth * 14 + "px";
      row.innerHTML = `<input type="checkbox" checked><span><b></b><small></small></span>`;
      row.querySelector("b").textContent = name;
      row.querySelector("small").textContent = text;
      const cb = row.querySelector("input");
      cb.addEventListener("change", () => {
        if (cb.checked) { hidden.delete(id); el.style.removeProperty("display"); row.classList.remove("off"); }
        else { hidden.add(id); el.style.setProperty("display", "none", "important"); row.classList.add("off"); }
        updateCount();
      });
      row.addEventListener("mouseenter", () => { el.style.outline = "2px dashed #ff6b2c"; el.style.outlineOffset = "-2px"; });
      row.addEventListener("mouseleave", () => { el.style.outline = ""; el.style.outlineOffset = ""; });
      body.appendChild(row);
    });
    updateCount();
  }

  shadow.querySelector(".toggle").addEventListener("click", () => panel.classList.toggle("closed"));

  shadow.querySelector(".reset").addEventListener("click", () => {
    for (const name of changedVars.keys()) root.style.removeProperty(name);
    changedVars.clear();
    for (const g of globals) g.value = g.initial;
    applyGlobals();
    document.querySelectorAll("[data-tweak-id]").forEach((el) => el.style.removeProperty("display"));
    hidden.clear();
    msg.textContent = "";
    build();
  });

  shadow.querySelector(".bake").addEventListener("click", async () => {
    const payload = { vars: Object.fromEntries(changedVars), rules: globalRules(), hidden: [...hidden] };
    if (!Object.keys(payload.vars).length && !payload.rules.length && !payload.hidden.length) {
      msg.textContent = "Niets om te bakken.";
      return;
    }
    msg.textContent = "Bakken...";
    try {
      const res = await fetch("/__tweak/bake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "onbekende fout");
      msg.textContent = `Gebakken. ${data.removed} sectie(s) verwijderd. Herladen...`;
      setTimeout(() => location.reload(), 700);
    } catch (err) {
      msg.textContent = "Bakken mislukt: " + err.message;
    }
  });

  // slepen aan de kop
  const head = shadow.querySelector(".head");
  head.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    const r = host.getBoundingClientRect();
    const dx = e.clientX - r.left, dy = e.clientY - r.top;
    const move = (ev) => {
      host.style.left = Math.max(0, ev.clientX - dx) + "px";
      host.style.top = Math.max(0, ev.clientY - dy) + "px";
      host.style.right = "auto";
    };
    const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  });

  build();
})();
