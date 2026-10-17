// manysocials: merkkeuze, telefoon met live gesprek en duim, band, live-lijst en de ontwerpwerkbalk.
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rust = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wacht = ms => new Promise(r => setTimeout(r, ms));
  const opslag = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  // Navigatierand bij scrollen
  const nav = $('#nav');
  const randje = () => nav.classList.toggle('scroll', window.scrollY > 8);
  window.addEventListener('scroll', randje, { passive: true });
  randje();

  // De agendalink voor "Demo inplannen" volgt; tot die tijd scrollen de knoppen naar de afsluiter.
  const DEMO_URL = '';
  if (DEMO_URL) $$('[data-demo]').forEach(a => { a.href = DEMO_URL; a.target = '_blank'; a.rel = 'noopener'; });

  // ---------- Merk en zakken ----------
  const draad = $('#draad');
  const sjablonen = [...draad.children].map(n => n.cloneNode(true));
  let merk = opslag.get('ms-merk');
  if (!Zak.MERKEN[merk]) merk = 'knap';
  const STUDIO = { knap: ['#FFF3D6', '#FFC870'], zilt: ['#F3EBDD', '#D8C3A1'], golf: ['#FFEFD2', '#FFC266'] };

  const vulZakken = (root, wissel) => {
    $$('[data-zak]', root).forEach(el => {
      const opts = { naam: el.dataset.naam };
      if (el.hasAttribute('data-label')) opts.label = el.dataset.label;
      el.innerHTML = Zak.svg(merk, +el.dataset.zak, opts);
      if (wissel) el.firstElementChild.classList.add('wissel');
    });
    $$('.creatie', root).forEach(c => { c.style.setProperty('--studio-a', STUDIO[merk][0]); c.style.setProperty('--studio-b', STUDIO[merk][1]); });
  };

  const band = $('#band-rij');
  const vulBand = () => {
    let h = '';
    for (let set = 0; set < 4; set++) for (let i = 0; i < 5; i++) h += `<div class="band-zak">${Zak.svg(merk, i, { label: '' })}</div><div class="band-chip">${Zak.chip(i * 7 - 10)}</div>`;
    band.innerHTML = h;
  };

  const zetMerk = (m, wissel) => {
    merk = m;
    opslag.set('ms-merk', m);
    vulZakken(document, wissel);
    vulBand();
    $('#av').innerHTML = Zak.logo(m);
    $$('.kk-merk').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.merk === m)));
    $$('.ov-merk').forEach(r => r.classList.toggle('actief', r.dataset.merk === m));
    $$('[data-kies]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kies === m)));
    $$('[data-mini="actief"]').forEach(el => { el.innerHTML = Zak.svg(m, 0, { label: '' }); });
  };

  $$('[data-chip]').forEach(el => { el.innerHTML = Zak.chip(+el.dataset.chip); });
  $$('[data-mini]').forEach(el => { if (el.dataset.mini !== 'actief') el.innerHTML = Zak.svg(el.dataset.mini, 0, { label: '' }); });
  $$('[data-rij]').forEach(rij => {
    rij.innerHTML = Zak.SMAKEN.map((s, i) => `<div>${Zak.svg(rij.dataset.rij, i)}</div>`).join('');
  });
  zetMerk(merk, false);

  // ---------- Werkbalk: merk en steunkleur ----------
  $$('.kk-merk').forEach(b => b.addEventListener('click', () => zetMerk(b.dataset.merk, true)));
  const namen = { '#00B884': 'Mint (nu)', '#FFE600': 'Signaalgeel', '#FFD45C': 'Boter', '#C6F432': 'Lime', '#B8E986': 'Pistache', '#3FD0C9': 'Turquoise', '#7FD1FF': 'IJsblauw', '#5AA9FF': 'Hemelsblauw', '#FF9EC4': 'Roze', '#B9A7FF': 'Lavendel', '#E6D3AE': 'Zand' };
  const zetKleur = k => {
    if (!namen[k]) k = '#00B884';
    document.documentElement.style.setProperty('--accent', k);
    $('#kk-naam').textContent = namen[k] + ' ' + k;
    $$('#kk-knoppen button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kleur === k)));
    opslag.set('ms-kleur', k);
  };
  $$('#kk-knoppen button').forEach(b => b.addEventListener('click', () => zetKleur(b.dataset.kleur)));
  zetKleur(opslag.get('ms-kleur') || '#00B884');
  const kleurPaneel = $('#kk-kleuren'), kleurKnop = $('#kk-kleur');
  kleurKnop.addEventListener('click', () => { const open = kleurPaneel.hidden; kleurPaneel.hidden = !open; kleurKnop.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('click', e => { if (!kleurPaneel.hidden && !e.target.closest('#kk')) { kleurPaneel.hidden = true; kleurKnop.setAttribute('aria-expanded', 'false'); } });
  const kk = $('#kk'), kkOpen = $('#kk-open');
  const toonKk = aan => { kk.hidden = !aan; kkOpen.hidden = aan; opslag.set('ms-kk-dicht', aan ? '0' : '1'); };
  $('#kk-dicht').addEventListener('click', () => toonKk(false));
  kkOpen.addEventListener('click', () => toonKk(true));
  toonKk(opslag.get('ms-kk-dicht') !== '1');

  const dlg = $('#overzicht');
  $('#kk-alle').addEventListener('click', () => { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); });
  $('#ov-sluit').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  $$('[data-kies]').forEach(b => b.addEventListener('click', () => { zetMerk(b.dataset.kies, true); dlg.close(); }));

  // ---------- Toneel: schalen en diepte ----------
  const toneel = $('#toneel'), toneelIn = $('#toneel-in');
  let schaal = 1;
  const meet = () => { schaal = toneel.clientWidth / 560; toneelIn.style.setProperty('--s', schaal); };
  if ('ResizeObserver' in window) new ResizeObserver(meet).observe(toneel);
  meet();

  if (!rust && matchMedia('(pointer: fine)').matches) {
    const hero = $('.hero');
    hero.addEventListener('pointermove', e => {
      const r = toneel.getBoundingClientRect();
      const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.4)));
      const py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.4)));
      toneelIn.style.setProperty('--px', px.toFixed(3));
      toneelIn.style.setProperty('--py', py.toFixed(3));
    });
    hero.addEventListener('pointerleave', () => { toneelIn.style.setProperty('--px', 0); toneelIn.style.setProperty('--py', 0); });
  }

  // ---------- Live-lijst ----------
  const rijen = $('#feed-rijen');
  if (!rust) setInterval(() => {
    if (document.hidden) return;
    const laatste = rijen.lastElementChild;
    laatste.classList.remove('nieuw'); void laatste.offsetWidth; laatste.classList.add('nieuw');
    rijen.prepend(laatste);
  }, 2600);

  // ---------- Telefoon: gesprek met duim ----------
  const chat = $('#wa-chat'), invoer = $('#wa-invoer'), veld = $('#wa-veld'), getypt = $('#wa-getypt');
  const actie = $('#wa-actie'), sub = $('#wa-sub'), tel = $('.tel'), pop = $('#pop');
  const duim = $('#duim'), duimS = $('#duim-schaduw'), duimSPos = $('#duim-schaduw-pos');
  const SPIL = { x: 330, y: 560 }, LENGTE = 134;
  const RUST = { a: -14, s: .92, d: 0 };
  const staat = { ...RUST };
  let scrollY = 0;

  const zetDuim = () => {
    duim.setAttribute('transform', `rotate(${staat.a.toFixed(2)}) scale(${(1 - staat.d * .035).toFixed(3)} ${staat.s.toFixed(3)})`);
    duimS.setAttribute('transform', `rotate(${staat.a.toFixed(2)}) scale(1 ${staat.s.toFixed(3)})`);
    const o = 16 - staat.d * 12;
    duimSPos.setAttribute('transform', `translate(${(SPIL.x + o * .5).toFixed(1)} ${(SPIL.y + o).toFixed(1)})`);
    duimS.style.opacity = (1 - staat.d * .35).toFixed(2);
  };
  const glad = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const uit = p => 1 - Math.pow(1 - p, 3);
  const beweeg = (naar, ms, ease = glad) => new Promise(res => {
    const van = { ...staat }, t0 = performance.now();
    const stap = t => {
      const p = Math.min(1, (t - t0) / ms), e = ease(p);
      for (const k in naar) staat[k] = van[k] + (naar[k] - van[k]) * e;
      zetDuim();
      p < 1 ? requestAnimationFrame(stap) : res();
    };
    requestAnimationFrame(stap);
  });
  const richt = (x, y) => {
    const dx = x - SPIL.x, dy = y - SPIL.y;
    return { a: Math.atan2(dx, -dy) * 180 / Math.PI, s: Math.max(.6, Math.min(1.2, Math.hypot(dx, dy) / LENGTE)) };
  };
  // Positie van een element in telefooncoördinaten (zonder transforms, dus los van draaiing en schaal).
  const inTel = el => {
    let x = 0, y = 0, n = el;
    while (n && n !== tel) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  const rimpel = (x, y) => {
    const r = document.createElement('span');
    r.className = 'rimpel'; r.style.left = x + 'px'; r.style.top = y + 'px';
    tel.appendChild(r);
    setTimeout(() => r.remove(), 700);
  };
  const tik = async (x, y, opDruk) => {
    await beweeg({ ...richt(x, y), d: 0 }, 560);
    await beweeg({ d: 1 }, 110);
    rimpel(x, y);
    if (opDruk) opDruk();
    await beweeg({ d: 0 }, 170);
  };
  const naarRust = () => beweeg(RUST, 520);

  // Zichtbaarheid: het gesprek pauzeert buiten beeld.
  let zichtbaar = true, wachtrij = [];
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => {
    zichtbaar = e.isIntersecting;
    if (zichtbaar) { wachtrij.forEach(f => f()); wachtrij = []; }
  }).observe(toneel);
  const pauze = async ms => { await wacht(ms); if (!zichtbaar || document.hidden) await new Promise(r => { wachtrij.push(r); const c = () => { if (!document.hidden && zichtbaar) { document.removeEventListener('visibilitychange', c); r(); } }; document.addEventListener('visibilitychange', c); }); };

  const scrollNaarOnder = () => {
    scrollY = Math.max(0, draad.offsetHeight - chat.clientHeight);
    draad.style.transform = `translateY(${-scrollY}px)`;
  };
  const voegToe = (i, extra) => {
    const n = sjablonen[i].cloneNode(true);
    n.classList.add('in');
    if (extra) n.classList.add(...extra);
    draad.appendChild(n);
    vulZakken(n, false);
    return n;
  };
  const typtIndicator = async ms => {
    sub.textContent = 'typt…'; sub.classList.add('typt');
    const n = document.createElement('div');
    n.className = 'msg bot typen in';
    n.innerHTML = '<p><i></i><i></i><i></i></p>';
    draad.appendChild(n);
    scrollNaarOnder();
    await pauze(ms);
    n.remove();
    sub.textContent = 'online'; sub.classList.remove('typt');
  };
  const typ = async tekst => {
    veld.classList.add('actief');
    for (const ch of tekst) {
      getypt.textContent += ch;
      invoer.classList.add('tekst');
      await wacht(60 + Math.random() * 75);
    }
    await pauze(260);
  };
  const verstuur = async i => {
    const a = inTel(actie);
    await tik(a.x + a.w * .62, a.y + a.h / 2, () => { actie.classList.remove('tik'); void actie.offsetWidth; actie.classList.add('tik'); });
    getypt.textContent = ''; invoer.classList.remove('tekst'); veld.classList.remove('actief');
    const n = voegToe(i);
    scrollNaarOnder();
    naarRust();
    return n;
  };
  const veeg = async () => {
    const start = richt(222, 486), eind = richt(268, 404);
    await beweeg({ ...start, d: 0 }, 420);
    await beweeg({ d: 1 }, 110);
    scrollNaarOnder();
    await beweeg({ ...eind }, 640, uit);
    await beweeg({ d: 0 }, 150);
    await naarRust();
  };
  const vonken = (x, y) => {
    const kleuren = ['var(--accent)', '#FFC23D', '#FF5A1F', '#FFFFFF', '#6C3BF5'];
    for (let i = 0; i < 14; i++) {
      const v = document.createElement('span');
      v.className = 'vonk';
      v.style.left = x + 'px'; v.style.top = y + 'px';
      v.style.background = kleuren[i % kleuren.length];
      const hoek = (i / 14) * Math.PI * 2 + Math.random() * .4, af = 90 + Math.random() * 90, sch = .5 + Math.random();
      toneelIn.appendChild(v);
      v.animate([
        { transform: 'translate(0,0) scale(0)', opacity: 1 },
        { transform: `translate(${Math.cos(hoek) * af * .7}px, ${Math.sin(hoek) * af * .7}px) scale(${sch})`, opacity: 1, offset: .5 },
        { transform: `translate(${Math.cos(hoek) * af}px, ${Math.sin(hoek) * af + 30}px) scale(0)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }).onfinish = () => v.remove();
    }
  };
  const EIND = { x: 8, y: 66 };
  const vlieg = () => {
    const tin = toneelIn.getBoundingClientRect();
    const b = $('.creatie-zak', draad).getBoundingClientRect();
    const bx = (b.left - tin.left) / schaal, by = (b.top - tin.top) / schaal, k = (b.width / schaal) / 230;
    pop.classList.remove('geland');
    pop.animate([
      { transform: `translate(${bx}px, ${by}px) rotate(-5deg) scale(${k})`, opacity: 0 },
      { opacity: 1, offset: .12 },
      { transform: `translate(${EIND.x - 24}px, ${EIND.y - 40}px) rotate(-15deg) scale(1.1)`, opacity: 1, offset: .68 },
      { transform: `translate(${EIND.x}px, ${EIND.y}px) rotate(-9deg) scale(1)`, opacity: 1 },
    ], { duration: 1150, easing: 'cubic-bezier(.22,.9,.25,1)', fill: 'forwards' });
    setTimeout(() => { pop.classList.add('geland'); vonken(EIND.x + 115, EIND.y + 150); }, 900);
  };
  const terug = () => {
    pop.classList.remove('geland');
    return pop.animate([{ opacity: 1 }, { transform: `translate(${EIND.x + 120}px, ${EIND.y + 220}px) rotate(-2deg) scale(.4)`, opacity: 0 }], { duration: 600, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).finished;
  };
  const leeg = () => {
    draad.style.transition = 'none';
    draad.innerHTML = '';
    scrollY = 0;
    draad.style.transform = 'translateY(0)';
    void draad.offsetWidth;
    draad.style.transition = '';
  };

  const gesprek = async () => {
    await wacht(1900);
    while (true) {
      await pauze(700);
      await typ('WIN');
      const m1 = await verstuur(0);
      await pauze(600);
      $('.t', m1)?.classList.add('gelezen');
      await typtIndicator(1300);
      voegToe(1); scrollNaarOnder();
      await pauze(1700);
      await typ('Mango met chili');
      const m2 = await verstuur(2);
      await pauze(500);
      $('.t', m2)?.classList.add('gelezen');
      await typtIndicator(1000);
      const media = voegToe(3, ['genereren']);
      await pauze(1500);
      media.classList.remove('genereren'); media.classList.add('klaar');
      await pauze(1000);
      await veeg();
      await pauze(450);
      const knop = voegToe(4); scrollNaarOnder();
      await pauze(1000);
      const k = inTel(knop.firstElementChild);
      await tik(k.x + k.w * .74, k.y - scrollY + k.h / 2, () => { knop.classList.add('ingedrukt'); vlieg(); });
      setTimeout(() => knop.classList.remove('ingedrukt'), 260);
      await naarRust();
      await pauze(4200);
      await terug();
      draad.style.transition = 'opacity .45s';
      draad.style.opacity = '0';
      await wacht(480);
      leeg();
      draad.style.opacity = '';
    }
  };

  zetDuim();
  if (rust) {
    scrollNaarOnder();
  } else {
    leeg();
    gesprek();
  }
})();
