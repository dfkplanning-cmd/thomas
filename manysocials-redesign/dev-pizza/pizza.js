// De Pizza van Nederland: balk met paginanummer, pizza's uit de foto's, de telefoon met Instagram-DM en duim, en de steunkleur.
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rust = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wacht = ms => new Promise(r => setTimeout(r, ms));
  const opslag = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  // ---------- Balk: rand bij scrollen en het slidenummer van de sectie in beeld ----------
  const balk = $('#balk'), nr = $('#balk-nr');
  const randje = () => balk.classList.toggle('scroll', window.scrollY > 8);
  window.addEventListener('scroll', randje, { passive: true });
  randje();
  const secties = $$('section[data-nr]');
  if ('IntersectionObserver' in window) {
    const zichtbaar = new Map();
    const io = new IntersectionObserver(items => {
      items.forEach(i => zichtbaar.set(i.target, i.intersectionRatio));
      let beste = null, max = 0;
      zichtbaar.forEach((r, s) => { if (r > max) { max = r; beste = s; } });
      if (beste) nr.textContent = beste.dataset.nr;
    }, { threshold: [0, .15, .3, .5, .7, .9] });
    secties.forEach(s => io.observe(s));
  }

  // Presenteren met het toetsenbord: pijl omlaag of PageDown naar de volgende sectie.
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest('input, textarea, select, button, a, [contenteditable]')) return;
    const vooruit = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
    const terug = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (!vooruit && !terug) return;
    const y = window.scrollY + 72;
    const tops = secties.map(s => s.getBoundingClientRect().top + window.scrollY);
    let doel = vooruit ? tops.find(t => t > y + 4) : [...tops].reverse().find(t => t < y - 4);
    if (doel === undefined) return;
    e.preventDefault();
    window.scrollTo({ top: Math.max(0, doel - 60), behavior: rust ? 'auto' : 'smooth' });
  });

  // ---------- Pizza's: elke foto zo schalen dat de pizza precies de cirkel vult ----------
  const MAP = 'img/voor/new-york-pizza/';
  const PIZZA = {
    nduja:      { src: MAP + 'nduja.jpg',      w: 600, h: 800, cx: .500, cy: .547, r: .38 },
    parmaham:   { src: MAP + 'parmaham.jpg',   w: 600, h: 800, cx: .515, cy: .612, r: .385 },
    mortadella: { src: MAP + 'mortadella.jpg', w: 600, h: 800, cx: .500, cy: .615, r: .405 },
    bresaola:   { src: MAP + 'bresaola.jpg',   w: 600, h: 800, cx: .500, cy: .540, r: .372 },
    gorgonzola: { src: MAP + 'gorgonzola.jpg', w: 600, h: 800, cx: .490, cy: .593, r: .35 },
    ricotta:    { src: MAP + 'ricotta.jpg',    w: 600, h: 800, cx: .515, cy: .632, r: .385 },
    daan:       { src: 'img/pizza-nduja.jpg',  w: 781, h: 1400, cx: .492, cy: .647, r: .38 },
  };
  const zetPizza = (el, key) => {
    const p = PIZZA[key];
    const S = p.w / (2 * p.r * p.w);            // fotobreedte gedeeld door cirkeldiameter
    const H = S * p.h / p.w;                      // fotohoogte gedeeld door cirkeldiameter
    const lx = .5 - p.cx * S, ly = .5 - p.cy * H; // verschuiving als deel van de cirkel
    el.style.backgroundImage = `url(${p.src})`;
    el.style.backgroundSize = `${(S * 100).toFixed(2)}% ${(H * 100).toFixed(2)}%`;
    el.style.backgroundPosition = `${(lx / (1 - S) * 100).toFixed(2)}% ${(ly / (1 - H) * 100).toFixed(2)}%`;
  };
  $$('[data-pizza]').forEach(el => zetPizza(el, el.dataset.pizza));
  const band = $('#band-rij');
  const volgorde = ['nduja', 'parmaham', 'mortadella', 'daan', 'bresaola', 'gorgonzola', 'ricotta'];
  for (let set = 0; set < 4; set++) volgorde.forEach(k => { const d = document.createElement('div'); d.className = 'pizza'; zetPizza(d, k); band.appendChild(d); });

  // Losse ingrediënten voor het decor.
  const INGR = {
    basilicum: '<svg viewBox="-20 -20 40 40"><defs><linearGradient id="ib" x1="0" y1="-16" x2="0" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4CC25E"/><stop offset="1" stop-color="#1F7A33"/></linearGradient></defs><path d="M0 -17 C 13 -10 14 7 0 17 C -14 7 -13 -10 0 -17 Z" fill="url(#ib)"/><path d="M0 -15 C 1 -4 1 6 0 15 M0 -6 L6 -10 M0 1 L-6 -3 M0 7 L6 4" stroke="#17602A" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
    peper: '<svg viewBox="-20 -20 40 40"><path d="M-12 -9 C 1 -14 15 -2 11 15 C 7 4 -2 -2 -12 -3 Z" fill="#D7261E"/><path d="M-6 -9 C 2 -9 8 -3 9 4" stroke="#FF8A7A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M-12 -8 C -16 -10 -16 -15 -11 -17" stroke="#2E9E45" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
    salami: '<svg viewBox="-20 -20 40 40"><circle r="15" fill="#B3261E"/><circle r="15" fill="none" stroke="#7E1712" stroke-width="2"/><g fill="#F2B8A8" opacity=".85"><circle cx="-5" cy="-6" r="2.2"/><circle cx="6" cy="-3" r="1.8"/><circle cx="-2" cy="6" r="2"/><circle cx="7" cy="7" r="1.5"/><circle cx="-8" cy="3" r="1.4"/></g></svg>',
  };
  $$('[data-ingr]').forEach(el => { el.innerHTML = INGR[el.dataset.ingr]; });

  // ---------- Steunkleur ----------
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

  // Licht of donker. Licht is de standaard, ook als het systeem op donker staat.
  const themaKnop = $('#kk-thema');
  const zetThema = donker => {
    document.documentElement.classList.toggle('donker', donker);
    themaKnop.setAttribute('aria-pressed', String(donker));
    const label = donker ? 'Lichte modus' : 'Donkere modus';
    themaKnop.setAttribute('aria-label', label);
    themaKnop.title = label;
    opslag.set('ms-thema', donker ? 'donker' : 'licht');
  };
  themaKnop.addEventListener('click', () => zetThema(!document.documentElement.classList.contains('donker')));
  zetThema(opslag.get('ms-thema') === 'donker');

  // ---------- 61% telt op als hij in beeld komt ----------
  const stat = $('[data-tel]');
  if (stat && !rust && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const doel = +stat.dataset.tel, t0 = performance.now();
      const stap = t => { const p = Math.min(1, (t - t0) / 1400); stat.textContent = Math.round(doel * (1 - Math.pow(1 - p, 3))) + '%'; if (p < 1) requestAnimationFrame(stap); };
      requestAnimationFrame(stap);
    }, { threshold: .6 });
    io.observe(stat);
  }

  // ---------- Toneel: schalen en diepte ----------
  const toneel = $('#toneel'), toneelIn = $('#toneel-in');
  let schaal = 1;
  const meet = () => { schaal = toneel.clientWidth / 560; toneelIn.style.setProperty('--s', schaal); };
  if ('ResizeObserver' in window) new ResizeObserver(meet).observe(toneel);
  meet();
  if (!rust && matchMedia('(pointer: fine)').matches) {
    const hero = $('.cover');
    hero.addEventListener('pointermove', e => {
      const r = toneel.getBoundingClientRect();
      toneelIn.style.setProperty('--px', Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.4))).toFixed(3));
      toneelIn.style.setProperty('--py', Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.4))).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => { toneelIn.style.setProperty('--px', 0); toneelIn.style.setProperty('--py', 0); });
  }

  // ---------- Telefoon: Instagram-DM met duim ----------
  const draad = $('#draad');
  const sjablonen = [...draad.children].map(n => n.cloneNode(true));
  const chat = $('#ig-chat'), invoer = $('#ig-invoer'), veld = $('#ig-veld'), getypt = $('#getypt'), stuur = $('#ig-stuur');
  const scherm = $('#scherm'), tel = $('.tel'), pop = $('#pop'), bestel = $('#bestel');
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

  let isZichtbaar = true, wachtrij = [];
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => {
    isZichtbaar = e.isIntersecting;
    if (isZichtbaar) { wachtrij.forEach(f => f()); wachtrij = []; }
  }).observe(toneel);
  const pauze = async ms => {
    await wacht(ms);
    if (!isZichtbaar || document.hidden) await new Promise(r => {
      wachtrij.push(r);
      const c = () => { if (!document.hidden && isZichtbaar) { document.removeEventListener('visibilitychange', c); r(); } };
      document.addEventListener('visibilitychange', c);
    });
  };

  const scrollNaarOnder = () => {
    scrollY = Math.max(0, draad.offsetHeight - chat.clientHeight);
    draad.style.transform = `translateY(${-scrollY}px)`;
  };
  const voegToe = (i, extra = []) => {
    const n = sjablonen[i].cloneNode(true);
    n.classList.add('in-anim', ...extra);
    draad.appendChild(n);
    return n;
  };
  const typtIndicator = async ms => {
    const n = document.createElement('div');
    n.className = 'typen in-anim';
    n.innerHTML = '<i></i><i></i><i></i>';
    draad.appendChild(n);
    scrollNaarOnder();
    await pauze(ms);
    n.remove();
  };
  const kies = async (opts, tekst, antwoord) => {
    const knop = [...opts.children].find(o => o.textContent === tekst);
    const k = inTel(knop);
    await tik(k.x + k.w / 2, k.y - scrollY + k.h / 2, () => knop.classList.add('gekozen'));
    await wacht(160);
    opts.classList.add('weg');
    await wacht(320);
    opts.remove();
    voegToe(antwoord);
    scrollNaarOnder();
    naarRust();
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
    const a = inTel(stuur);
    await tik(a.x + a.w * .55, a.y + a.h / 2, () => { stuur.classList.remove('tik'); void stuur.offsetWidth; stuur.classList.add('tik'); });
    getypt.textContent = ''; invoer.classList.remove('tekst'); veld.classList.remove('actief');
    voegToe(i);
    scrollNaarOnder();
    naarRust();
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
    const kleuren = ['var(--accent)', '#FFC23D', '#E8412C', '#FFFFFF', '#2E9E45'];
    for (let i = 0; i < 14; i++) {
      const v = document.createElement('span');
      v.className = 'vonk';
      v.style.left = x + 'px'; v.style.top = y + 'px';
      v.style.background = kleuren[i % kleuren.length];
      const hoek = (i / 14) * Math.PI * 2 + Math.random() * .4, af = 100 + Math.random() * 90, sch = .5 + Math.random();
      toneelIn.appendChild(v);
      v.animate([
        { transform: 'translate(0,0) scale(0)', opacity: 1 },
        { transform: `translate(${Math.cos(hoek) * af * .7}px, ${Math.sin(hoek) * af * .7}px) scale(${sch})`, opacity: 1, offset: .5 },
        { transform: `translate(${Math.cos(hoek) * af}px, ${Math.sin(hoek) * af + 30}px) scale(0)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }).onfinish = () => v.remove();
    }
  };
  // De pizza draait uit de video op de persoonlijke pagina het toneel op.
  const EIND = { x: 0, y: 70 };
  const vlieg = () => {
    const tin = toneelIn.getBoundingClientRect();
    const b = $('.pagina .pizzakaart', scherm).getBoundingClientRect();
    const d = Math.min(b.width, b.height) * .8;
    const bx = (b.left + (b.width - d) / 2 - tin.left) / schaal, by = (b.top + (b.height - d) * .62 - tin.top) / schaal, k = (d / schaal) / 220;
    pop.classList.remove('geland');
    pop.animate([
      { transform: `translate(${bx}px, ${by}px) rotate(0deg) scale(${k})`, opacity: 0 },
      { opacity: 1, offset: .12 },
      { transform: `translate(${EIND.x - 20}px, ${EIND.y - 50}px) rotate(-250deg) scale(1.1)`, opacity: 1, offset: .7 },
      { transform: `translate(${EIND.x}px, ${EIND.y}px) rotate(-372deg) scale(1)`, opacity: 1 },
    ], { duration: 1300, easing: 'cubic-bezier(.22,.9,.25,1)', fill: 'forwards' });
    setTimeout(() => { pop.classList.add('geland'); vonken(EIND.x + 110, EIND.y + 110); }, 1000);
  };
  const terug = () => {
    pop.classList.remove('geland');
    return pop.animate([{ opacity: 1 }, { transform: `translate(${EIND.x + 140}px, ${EIND.y + 260}px) rotate(-460deg) scale(.35)`, opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).finished;
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
      await pauze(600);
      await typtIndicator(1000);
      voegToe(0); const o1 = voegToe(1); scrollNaarOnder();
      await pauze(1500);
      await kies(o1, 'Italiaans dun', 2);
      await pauze(400);
      await typtIndicator(900);
      voegToe(3); scrollNaarOnder();
      await pauze(900);
      await typ('Nduja en hot honey');
      await verstuur(4);
      await pauze(400);
      await typtIndicator(900);
      voegToe(5); const o2 = voegToe(6); scrollNaarOnder();
      await pauze(1300);
      await kies(o2, 'Tomaat', 7);
      await pauze(400);
      await typtIndicator(1300);
      voegToe(8); scrollNaarOnder();
      await pauze(700);
      const kaart = voegToe(9, ['genereren']);
      await pauze(1600);
      kaart.classList.remove('genereren');
      await pauze(900);
      await veeg();
      await pauze(500);
      const k = inTel(kaart);
      await tik(k.x + k.w * .7, k.y - scrollY + k.h * .55, () => scherm.classList.add('op-pagina'));
      await naarRust();
      await pauze(900);
      vlieg();
      await pauze(2200);
      const b = inTel(bestel);
      await tik(b.x + b.w * .72, b.y + b.h / 2, () => bestel.classList.add('ingedrukt'));
      setTimeout(() => bestel.classList.remove('ingedrukt'), 280);
      await naarRust();
      await pauze(3600);
      await terug();
      scherm.classList.remove('op-pagina');
      await wacht(700);
      draad.style.transition = 'opacity .45s';
      draad.style.opacity = '0';
      await wacht(480);
      leeg();
      draad.style.opacity = '';
    }
  };

  zetDuim();
  if (rust) scrollNaarOnder();
  else { leeg(); gesprek(); }
})();
