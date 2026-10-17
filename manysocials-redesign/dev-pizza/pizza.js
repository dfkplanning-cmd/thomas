// De Pizza van Nederland: voortgangsbalk, pizza's uit de foto's, kies een pizza in de band, en de Instagram-DM in de hand.
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rust = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wacht = ms => new Promise(r => setTimeout(r, ms));
  const opslag = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  // ---------- Balk: rand en voortgang bij scrollen ----------
  const balk = $('#balk'), voortgang = $('#balk-voortgang');
  const opScroll = () => {
    balk.classList.toggle('scroll', window.scrollY > 8);
    const max = document.documentElement.scrollHeight - innerHeight;
    voortgang.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  };
  window.addEventListener('scroll', opScroll, { passive: true });
  window.addEventListener('resize', opScroll);
  opScroll();

  // Presenteren met het toetsenbord: pijl omlaag of PageDown naar het volgende onderdeel.
  const secties = $$('main > section, main > .band');
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest('input, textarea, select, button, a, summary, [contenteditable]')) return;
    const vooruit = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
    const terug = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (!vooruit && !terug) return;
    const y = window.scrollY + 72;
    const tops = secties.map(s => s.getBoundingClientRect().top + window.scrollY);
    const doel = vooruit ? tops.find(t => t > y + 4) : [...tops].reverse().find(t => t < y - 4);
    if (doel === undefined) return;
    e.preventDefault();
    window.scrollTo({ top: Math.max(0, doel - 60), behavior: rust ? 'auto' : 'smooth' });
  });

  // Voetnoten openen de ingeklapte bronnen.
  const bronnen = $('.bronnen-d');
  $$('a[href^="#bron-"]').forEach(a => a.addEventListener('click', () => { bronnen.open = true; }));

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
    const S = 1 / (2 * p.r);                     // fotobreedte gedeeld door cirkeldiameter
    const H = S * p.h / p.w;                      // fotohoogte gedeeld door cirkeldiameter
    const lx = .5 - p.cx * S, ly = .5 - p.cy * H; // verschuiving als deel van de cirkel
    el.style.backgroundImage = `url(${p.src})`;
    el.style.backgroundSize = `${(S * 100).toFixed(2)}% ${(H * 100).toFixed(2)}%`;
    el.style.backgroundPosition = `${(lx / (1 - S) * 100).toFixed(2)}% ${(ly / (1 - H) * 100).toFixed(2)}%`;
  };
  $$('[data-pizza]').forEach(el => zetPizza(el, el.dataset.pizza));

  // De pizza's die je in de band kunt kiezen. Nduja is de pizza uit het voorstel.
  const KEUZES = [
    { key: 'daan', titel: 'Hot Honey Hustle',       naam: 'Nduja & hot honey',              toppings: 'Nduja en hot honey',              bestel: 'Bestel Pepperoni Hot Honey' },
    { key: 'parmaham', titel: 'La Dolce Burrata',   naam: 'Parmaham, burrata & rucola',     toppings: 'Parmaham, burrata en rucola',     bestel: 'Bestel je eigen pizza' },
    { key: 'mortadella', titel: 'Pistache Paradiso', naam: 'Mortadella, pistache & burrata', toppings: 'Mortadella, pistache en burrata', bestel: 'Bestel je eigen pizza' },
    { key: 'bresaola', titel: 'Rucola Royale',   naam: 'Bresaola, rucola & Parmezaan',   toppings: 'Bresaola, rucola en Parmezaan',   bestel: 'Bestel je eigen pizza' },
    { key: 'gorgonzola', titel: 'Peer Pressure', naam: 'Gorgonzola, peer & walnoot',     toppings: 'Gorgonzola, peer en walnoot',     bestel: 'Bestel je eigen pizza' },
    { key: 'ricotta', titel: 'Citroen Crush',    naam: 'Ricotta, courgette & citroen',   toppings: 'Ricotta, courgette en citroen',   bestel: 'Bestel je eigen pizza' },
  ];
  let keuze = KEUZES[0];

  const band = $('#band-rij');
  for (let set = 0; set < 3; set++) KEUZES.forEach(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'band-pizza';
    b.dataset.keuze = k.key;
    b.setAttribute('role', 'listitem');
    b.setAttribute('aria-pressed', String(k === keuze));
    if (set > 0) { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
    b.innerHTML = `<span class="pizza"></span><span class="naam"><b class="bijnaam">${k.titel}</b>${k.naam.replace(/&/g, '&amp;')}</span>`;
    zetPizza(b.firstElementChild, k.key);
    band.appendChild(b);
  });

  // Losse ingrediënten voor het decor.
  const INGR = {
    basilicum: '<svg viewBox="-20 -20 40 40"><defs><linearGradient id="ib" x1="0" y1="-16" x2="0" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4CC25E"/><stop offset="1" stop-color="#1F7A33"/></linearGradient></defs><path d="M0 -17 C 13 -10 14 7 0 17 C -14 7 -13 -10 0 -17 Z" fill="url(#ib)"/><path d="M0 -15 C 1 -4 1 6 0 15 M0 -6 L6 -10 M0 1 L-6 -3 M0 7 L6 4" stroke="#17602A" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
    peper: '<svg viewBox="-20 -20 40 40"><path d="M-12 -9 C 1 -14 15 -2 11 15 C 7 4 -2 -2 -12 -3 Z" fill="#D7261E"/><path d="M-6 -9 C 2 -9 8 -3 9 4" stroke="#FF8A7A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M-12 -8 C -16 -10 -16 -15 -11 -17" stroke="#2E9E45" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
    salami: '<svg viewBox="-20 -20 40 40"><circle r="15" fill="#B3261E"/><circle r="15" fill="none" stroke="#7E1712" stroke-width="2"/><g fill="#F2B8A8" opacity=".85"><circle cx="-5" cy="-6" r="2.2"/><circle cx="6" cy="-3" r="1.8"/><circle cx="-2" cy="6" r="2"/><circle cx="7" cy="7" r="1.5"/><circle cx="-8" cy="3" r="1.4"/></g></svg>',
  };
  $$('[data-ingr]').forEach(el => { el.innerHTML = INGR[el.dataset.ingr]; });

  // ---------- Steunkleur, licht en donker ----------
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

  // ---------- Telefoon: Instagram-DM ----------
  const draad = $('#draad');
  const sjablonen = [...draad.children].map(n => n.cloneNode(true));
  const chat = $('#ig-chat'), invoer = $('#ig-invoer'), veld = $('#ig-veld'), getypt = $('#getypt'), stuur = $('#ig-stuur');
  const scherm = $('#scherm'), pop = $('#pop'), bestel = $('#bestel');
  const paginaKaart = $('.pagina .pizzakaart', scherm);
  let scrollY = 0;

  // Het gekozen recept in de sjablonen, de pagina en de zwevende pizza zetten.
  const fotoVan = k => PIZZA[k.key].src;
  const zetKeuzeInBeeld = () => {
    sjablonen[4].textContent = keuze.toppings;
    [sjablonen[9], paginaKaart].forEach(kaart => {
      kaart.style.setProperty('--img', `url(${fotoVan(keuze)})`);
      $('.n', kaart).textContent = keuze.titel.toUpperCase();
      $('.s', kaart).textContent = keuze.naam;
    });
    bestel.textContent = keuze.bestel;
    zetPizza($('#pop-pizza'), keuze.key);
    $('#pop-naam').textContent = keuze.naam;
    zetPizza($('#p-keuze'), keuze.key);
    $('#p-naam').textContent = keuze.naam;
    $('#p-titel').textContent = keuze.titel;
    $('#pop-titel').textContent = keuze.titel;
    $$('.band-pizza').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.keuze === keuze.key)));
  };

  // Aanraakpunt in plaats van een duim: zo zie je waar er getikt en geveegd wordt.
  const vinger = document.createElement('span');
  vinger.className = 'vinger';
  vinger.setAttribute('aria-hidden', 'true');
  scherm.appendChild(vinger);
  const inScherm = el => {
    let x = 0, y = 0, n = el;
    while (n && n !== scherm) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  const plaats = (x, y) => { vinger.style.left = x + 'px'; vinger.style.top = y + 'px'; };

  let run = 0;
  const AFGEBROKEN = Symbol('afgebroken');
  let isZichtbaar = true, wachtrij = [];
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => {
    isZichtbaar = e.isIntersecting;
    if (isZichtbaar) { wachtrij.forEach(f => f()); wachtrij = []; }
  }).observe(toneel);
  const maakPauze = mijn => async ms => {
    await wacht(ms);
    if (!isZichtbaar || document.hidden) await new Promise(r => {
      wachtrij.push(r);
      const c = () => { if (!document.hidden && isZichtbaar) { document.removeEventListener('visibilitychange', c); r(); } };
      document.addEventListener('visibilitychange', c);
    });
    if (mijn !== run) throw AFGEBROKEN;
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
  const rimpel = (x, y) => {
    const r = document.createElement('span');
    r.className = 'rimpel'; r.style.left = x + 'px'; r.style.top = y + 'px';
    scherm.appendChild(r);
    setTimeout(() => r.remove(), 700);
  };
  const leeg = () => {
    draad.style.transition = 'none';
    draad.innerHTML = '';
    scrollY = 0;
    draad.style.transform = 'translateY(0)';
    void draad.offsetWidth;
    draad.style.transition = '';
    getypt.textContent = ''; invoer.classList.remove('tekst'); veld.classList.remove('actief');
    scherm.classList.remove('op-pagina');
    vinger.classList.remove('aan', 'druk', 'sleep');
  };

  const EIND = { x: 0, y: 70 };
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
  const vlieg = () => {
    const tin = toneelIn.getBoundingClientRect();
    const b = paginaKaart.getBoundingClientRect();
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
  const verbergPop = (snel) => {
    pop.classList.remove('geland');
    return pop.animate([{ opacity: snel ? 0 : 1 }, { transform: `translate(${EIND.x + 140}px, ${EIND.y + 260}px) rotate(-460deg) scale(.35)`, opacity: 0 }], { duration: snel ? 1 : 650, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).finished;
  };

  const gesprek = async (mijn, eersteWacht) => {
    const pauze = maakPauze(mijn);
    const tik = async (x, y, opDruk) => {
      plaats(x, y);
      vinger.classList.add('aan');
      await pauze(260);
      vinger.classList.add('druk');
      rimpel(x, y);
      if (opDruk) opDruk();
      await pauze(170);
      vinger.classList.remove('druk');
      await pauze(160);
      vinger.classList.remove('aan');
    };
    const typtIndicator = async ms => {
      const n = document.createElement('div');
      n.className = 'typen in-anim';
      n.innerHTML = '<i></i><i></i><i></i>';
      draad.appendChild(n);
      scrollNaarOnder();
      try { await pauze(ms); } finally { n.remove(); }
    };
    const kies = async (opts, tekst, antwoord) => {
      const knop = [...opts.children].find(o => o.textContent === tekst);
      const k = inScherm(knop);
      await tik(k.x + k.w / 2, k.y - scrollY + k.h / 2, () => knop.classList.add('gekozen'));
      opts.classList.add('weg');
      await pauze(320);
      opts.remove();
      voegToe(antwoord);
      scrollNaarOnder();
    };
    const typ = async tekst => {
      veld.classList.add('actief');
      for (const ch of tekst) {
        getypt.textContent += ch;
        invoer.classList.add('tekst');
        await pauze(55 + Math.random() * 60);
      }
      await pauze(240);
    };
    const verstuur = async i => {
      const a = inScherm(stuur);
      await tik(a.x + a.w / 2, a.y + a.h / 2, () => { stuur.classList.remove('tik'); void stuur.offsetWidth; stuur.classList.add('tik'); });
      getypt.textContent = ''; invoer.classList.remove('tekst'); veld.classList.remove('actief');
      voegToe(i);
      scrollNaarOnder();
    };
    const veeg = async () => {
      const x = chat.offsetLeft + chat.clientWidth * .62;
      const y0 = chat.offsetTop + chat.clientHeight * .78, y1 = chat.offsetTop + chat.clientHeight * .36;
      vinger.classList.add('sleep');
      plaats(x, y0);
      vinger.classList.add('aan');
      await pauze(240);
      vinger.classList.add('druk');
      scrollNaarOnder();
      plaats(x, y1);
      await pauze(720);
      vinger.classList.remove('druk', 'aan');
      await pauze(200);
      vinger.classList.remove('sleep');
    };

    try {
      await pauze(eersteWacht);
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
        await typ(keuze.toppings);
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
        const k = inScherm(kaart);
        await tik(k.x + k.w * .6, k.y - scrollY + k.h * .55, () => scherm.classList.add('op-pagina'));
        await pauze(1100);
        vlieg();
        await pauze(2200);
        const b = inScherm(bestel);
        await tik(b.x + b.w / 2, b.y + b.h / 2, () => bestel.classList.add('ingedrukt'));
        setTimeout(() => bestel.classList.remove('ingedrukt'), 280);
        await pauze(3600);
        await verbergPop(false);
        scherm.classList.remove('op-pagina');
        await pauze(700);
        draad.style.transition = 'opacity .45s';
        draad.style.opacity = '0';
        await pauze(480);
        leeg();
        draad.style.opacity = '';
      }
    } catch (e) {
      if (e !== AFGEBROKEN) throw e;
    }
  };

  // Meteen zien dat je kiest: de pizza vliegt uit de band naar het toneel en landt met een knal.
  const herstart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const toonKeuze = bron => {
    const doel = $('#p-keuze'), label = $('#p-label');
    if (bron.classList.contains('band-pizza')) herstart(bron, 'net');
    herstart(scherm, 'wissel');
    const land = () => { herstart(doel, 'land'); herstart(doel.parentElement, 'knal'); herstart(label, 'wissel'); };
    // Midden en echte breedte: de pizza's draaien, dus de bounding box is groter dan de schijf.
    const vanEl = bron.querySelector('.pizza') || bron, vr = vanEl.getBoundingClientRect(), nr = doel.getBoundingClientRect();
    const vw = vanEl.offsetWidth, nw = doel.offsetWidth * schaal;
    const vx = vr.left + vr.width / 2, vy = vr.top + vr.height / 2, nx = nr.left + nr.width / 2, ny = nr.top + nr.height / 2;
    const zichtbaar = ny > 0 && ny < innerHeight && vy < innerHeight;
    if (rust || !zichtbaar || !doel.animate) { land(); return; }
    const vlieg = document.createElement('div');
    vlieg.className = 'vlieg-pizza';
    Object.assign(vlieg.style, { left: nx - nw / 2 + 'px', top: ny - nw / 2 + 'px', width: nw + 'px', height: nw + 'px' });
    zetPizza(vlieg, keuze.key);
    document.body.appendChild(vlieg);
    doel.style.visibility = 'hidden';
    const dx = vx - nx, dy = vy - ny, k = vw / nw;
    vlieg.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${k}) rotate(0deg)` },
      { transform: `translate(${dx * .45}px, ${dy * .45 - 140}px) scale(${(k + 1.25) / 2}) rotate(200deg)`, offset: .55 },
      { transform: 'translate(0, 0) scale(1) rotate(360deg)' },
    ], { duration: 720, easing: 'cubic-bezier(.45, 0, .2, 1)' }).onfinish = () => { vlieg.remove(); doel.style.visibility = ''; land(); };
  };


  // ---------- Zelf typen: een echte DM met de pizza-agent ----------
  // Claude antwoordt via de sample-capability; zonder die (of zonder toestemming) neemt een eenvoudig script het over.
  const invoerVeld = $('#ig-input'), hint = $('#zelf-hint');
  const GROET = 'Welke pizza moeten wij nog maken? Eerst: welke bodem?';
  const REGELS = `Je bent de DM-assistent van New York Pizza op Instagram (@newyorkpizza_nl) in de campagne "De Pizza van Nederland": iedereen bedenkt via de DM zijn eigen pizza en de beste komt echt op de kaart.
Schrijf kort en informeel Nederlands, hooguit twee zinnen, hooguit één emoji. Vraag één ding tegelijk, in deze volgorde: bodem (New York Style, Italiaans dun of Bloemkool), toppings, saus.
Zodra bodem, toppings en saus bekend zijn: bedenk een pakkende pizzanaam van twee of drie woorden (Engels of Nederlands, speels), zeg dat ze meedoen en zo een kortingscode ontvangen, en geef de pizza mee. Daarna mag de klant een nieuwe pizza bedenken.
Blijf bij pizza en deze campagne; stuur andere onderwerpen vriendelijk terug. Verzin geen prijzen, codes of beloftes. Ongepaste toppings weiger je met humor.
Antwoord met alleen JSON in deze vorm:
{"tekst": "je bericht", "opties": ["max 3 korte snelknoppen, of leeg"], "pizza": null}
of, als de pizza af is:
{"tekst": "je bericht", "opties": [], "pizza": {"titel": "Naam Van De Pizza", "toppings": "Nduja & hot honey", "foto": "daan"}}
Kies bij "foto" de foto die het meest lijkt: daan (pittig, salami, nduja, vlees), parmaham (ham, burrata, rucola), mortadella (mortadella, pistache, romig), bresaola (rundvlees, rucola, Parmezaan), gorgonzola (kaas, peer, noten, zoet), ricotta (groente, vegetarisch, citroen, fris).`;
  const TREF = [
    ['daan', ['nduja', 'salami', 'pepperoni', 'chorizo', 'chili', 'jalape', 'pittig', 'worst', 'kip', 'gehakt', 'spek']],
    ['mortadella', ['mortadella', 'pistache']],
    ['parmaham', ['ham', 'parma', 'burrata', 'prosciutto']],
    ['bresaola', ['bresaola', 'rund', 'parmezaan', 'rucola', 'biefstuk']],
    ['gorgonzola', ['gorgonzola', 'kaas', 'peer', 'noot', 'noten', 'honing', 'brie', 'geit']],
    ['ricotta', ['ricotta', 'courgette', 'citroen', 'groente', 'vega', 'spinazie', 'paprika', 'champignon', 'ui', 'tomaat', 'olijf', 'ananas']],
  ];
  let live = false, liveId = 0, bezig = false, beurten = [], agent = null, stap = 0, recept = {};
  if (window.claude && claude.use) claude.use('sample').then(s => { agent = s; }, () => {});

  const bubbel = (tekst, kant) => {
    const n = document.createElement('div');
    n.className = `bub ${kant} in-anim` + (kant === 'in' ? ' met-av' : '');
    n.textContent = tekst;
    draad.appendChild(n);
    scrollNaarOnder();
  };
  const snelknoppen = lijst => {
    if (!Array.isArray(lijst) || !lijst.length) return;
    const o = document.createElement('div');
    o.className = 'opts in-anim';
    lijst.slice(0, 3).forEach(t => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'opt'; b.textContent = String(t).slice(0, 30);
      o.appendChild(b);
    });
    draad.appendChild(o);
    scrollNaarOnder();
  };
  const maakPizza = p => {
    const key = KEUZES.some(k => k.key === p.foto) ? p.foto : 'daan';
    const naam = String(p.toppings || '').slice(0, 60) || 'Jouw pizza';
    keuze = { key, titel: String(p.titel || 'Jouw pizza').slice(0, 40), naam, toppings: naam, bestel: 'Bestel je eigen pizza' };
    zetKeuzeInBeeld();
    const kaart = sjablonen[9].cloneNode(true);
    kaart.classList.add('in-anim', 'genereren');
    draad.appendChild(kaart);
    scrollNaarOnder();
    setTimeout(() => { kaart.classList.remove('genereren'); if (live) toonKeuze(kaart); }, 1600);
  };

  const scriptAgent = () => {
    const t = beurten[beurten.length - 1].content;
    if (stap === 0) { recept.bodem = t; stap = 1; return { tekst: 'Lekker. En wat moet erop?' }; }
    if (stap === 1) { recept.toppings = t; stap = 2; return { tekst: 'Welke saus eronder?', opties: ['Tomaat', 'BBQ', 'Crème fraîche'] }; }
    stap = 0;
    const l = recept.toppings.toLowerCase();
    const foto = (TREF.find(([, w]) => w.some(x => l.includes(x))) || ['daan'])[0];
    const toppings = recept.toppings.charAt(0).toUpperCase() + recept.toppings.slice(1);
    return { tekst: 'Super dat je meedeed! Je ontvangt zo een kortingscode. Hier alvast een afbeelding van je pizza.', pizza: { titel: KEUZES.find(k => k.key === foto).titel, toppings, foto } };
  };
  const vraagAgent = async () => {
    if (agent) {
      try {
        const r = await agent.json([{ role: 'user', content: REGELS }, ...beurten.slice(-14)], { modelTier: 'quick', cache: false });
        if (r && typeof r.tekst === 'string' && r.tekst.trim()) return r;
      } catch (e) {
        if (!['upstream_error', 'invalid_json', 'rate_limited', 'cancelled'].includes(e && e.code)) agent = null;
      }
    }
    return scriptAgent();
  };

  const stuurBericht = async tekst => {
    tekst = String(tekst).trim().slice(0, 200);
    if (!live || !tekst || bezig) return;
    const mijn = liveId;
    bezig = true;
    $$('.opts', draad).forEach(o => o.remove());
    bubbel(tekst, 'uit');
    beurten.push({ role: 'user', content: tekst });
    const stippen = document.createElement('div');
    stippen.className = 'typen in-anim';
    stippen.innerHTML = '<i></i><i></i><i></i>';
    draad.appendChild(stippen);
    scrollNaarOnder();
    const [r] = await Promise.all([vraagAgent(), wacht(700)]);
    stippen.remove();
    bezig = false;
    if (mijn !== liveId) return;
    const tekstIn = String(r.tekst).slice(0, 400);
    bubbel(tekstIn, 'in');
    beurten.push({ role: 'assistant', content: tekstIn + (r.pizza ? ` [pizza: ${r.pizza.titel}, ${r.pizza.toppings}]` : '') });
    snelknoppen(r.opties);
    if (r.pizza && typeof r.pizza === 'object') maakPizza(r.pizza);
  };

  const startLive = () => {
    if (live) return;
    live = true; liveId++; run++;
    verbergPop(true);
    leeg();
    scherm.classList.add('live');
    beurten = [{ role: 'assistant', content: GROET }];
    stap = 0; recept = {};
    bubbel(GROET, 'in');
    snelknoppen(['New York Style', 'Italiaans dun', 'Bloemkool']);
  };
  function stopLive() {
    if (!live) return;
    live = false; liveId++; bezig = false;
    scherm.classList.remove('live');
    invoerVeld.value = '';
    invoerVeld.blur();
  }
  const verstuurVeld = () => { const t = invoerVeld.value; invoerVeld.value = ''; invoer.classList.remove('tekst'); stuurBericht(t); };

  invoerVeld.addEventListener('pointerdown', startLive);
  invoerVeld.addEventListener('focus', startLive);
  invoerVeld.addEventListener('input', () => invoer.classList.toggle('tekst', !!invoerVeld.value.trim()));
  invoerVeld.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); verstuurVeld(); } });
  stuur.addEventListener('click', () => { if (live) { verstuurVeld(); invoerVeld.focus(); } });
  stuur.addEventListener('keydown', e => { if (live && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); verstuurVeld(); } });
  hint.addEventListener('click', () => invoerVeld.focus());
  draad.addEventListener('click', e => {
    if (!live) return;
    const opt = e.target.closest('.opt');
    if (opt && !bezig) {
      opt.classList.add('gekozen');
      stuurBericht(opt.textContent);
      if (matchMedia('(pointer: fine)').matches) invoerVeld.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('.pizzakaart')) { scherm.classList.add('op-pagina'); vlieg(); }
  });
  $('.adres', scherm).addEventListener('click', () => { if (live) { verbergPop(false); scherm.classList.remove('op-pagina'); } });
  chat.addEventListener('wheel', e => {
    if (!live) return;
    e.preventDefault();
    const max = Math.max(0, draad.offsetHeight - chat.clientHeight);
    scrollY = Math.min(max, Math.max(0, scrollY + e.deltaY));
    draad.style.transform = `translateY(${-scrollY}px)`;
  }, { passive: false });

  // Kies een pizza in de band: het gesprek begint opnieuw met die pizza.
  band.addEventListener('click', e => {
    const b = e.target.closest('.band-pizza');
    if (!b) return;
    const nieuw = KEUZES.find(k => k.key === b.dataset.keuze);
    if (!nieuw) return;
    stopLive();
    keuze = nieuw;
    run++;
    toonKeuze(b);
    draad.style.opacity = '';
    verbergPop(true);
    leeg();
    zetKeuzeInBeeld();
    const r = toneel.getBoundingClientRect();
    if (r.top < -r.height * .35 || r.bottom > innerHeight + r.height * .6) toneel.scrollIntoView({ behavior: rust ? 'auto' : 'smooth', block: 'center' });
    if (rust) { sjablonen.forEach((s, i) => { if (i !== 1 && i !== 6) draad.appendChild(s.cloneNode(true)); }); scrollNaarOnder(); }
    else gesprek(run, 300);
  });

  zetKeuzeInBeeld();
  if (rust) scrollNaarOnder();
  else { leeg(); gesprek(run, 1900); }
})();
