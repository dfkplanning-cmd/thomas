// manysocials: merkkeuze, telefoon met live Instagram-DM, kiesbare smaken, live-lijst en de ontwerpwerkbalk.
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
  let smaak = 0; // gekozen smaak in de band, standaard mango met chili

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
    for (let set = 0; set < 4; set++) for (let i = 0; i < 5; i++) {
      const verborgen = set ? ' tabindex="-1" aria-hidden="true"' : '';
      h += `<button type="button" class="band-zak" data-smaak="${i}" aria-pressed="${i === smaak}"${verborgen}>${Zak.svg(merk, i, { label: '' })}<span class="naam">${Zak.SMAKEN[i].naam}</span></button><div class="band-chip" aria-hidden="true">${Zak.chip(i * 7 - 10)}</div>`;
    }
    band.innerHTML = h;
  };

  const zetMerk = (m, wissel) => {
    merk = m;
    opslag.set('ms-merk', m);
    vulZakken(document, wissel);
    vulBand();
    $('#av').innerHTML = Zak.logo(m);
    document.documentElement.style.setProperty('--av-logo', `url("data:image/svg+xml,${encodeURIComponent(Zak.logo(m).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))}")`);
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
  // Alleen een echte klik wordt onthouden. Op een telefoon start de balk dicht, anders bedekt hij de telefoon in de hero.
  const toonKk = (aan, bewaar) => { kk.hidden = !aan; kkOpen.hidden = aan; if (bewaar) { opslag.set('ms-kk', aan ? 'open' : 'dicht'); kk.classList.add('los'); } };
  $('#kk-dicht').addEventListener('click', () => toonKk(false, true));
  kkOpen.addEventListener('click', () => toonKk(true, true));
  const kkKeuze = opslag.get('ms-kk') || (opslag.get('ms-kk-dicht') === '1' ? 'dicht' : '');
  toonKk(kkKeuze ? kkKeuze === 'open' : !matchMedia('(max-width: 700px)').matches, false);

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

  // ---------- Telefoon: Instagram-DM ----------
  const chat = $('#ig-chat'), invoer = $('#ig-invoer'), veld = $('#ig-veld'), getypt = $('#getypt'), stuur = $('#ig-stuur');
  const scherm = $('#scherm'), pop = $('#pop');
  let scrollY = 0;

  // De gekozen smaak in de sjablonen en de zwevende zak zetten.
  const zetSmaakInBeeld = () => {
    const s = Zak.SMAKEN[smaak];
    sjablonen[2].textContent = s.naam;
    const zak = $('[data-zak]', sjablonen[3]);
    zak.dataset.zak = smaak;
    zak.dataset.label = `Een zak chips met de smaak ${s.naam.toLowerCase()}`;
    $('.et b', sjablonen[3]).textContent = s.naam;
    $('[data-zak]', pop).dataset.zak = smaak;
    vulZakken(pop, false);
    $('.pop-label b', pop).textContent = s.naam;
    $$('.band-zak').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.smaak === smaak)));
  };

  // Aanraakpunt: zo zie je waar er getikt en geveegd wordt.
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
  const rimpel = (x, y) => {
    const r = document.createElement('span');
    r.className = 'rimpel'; r.style.left = x + 'px'; r.style.top = y + 'px';
    scherm.appendChild(r);
    setTimeout(() => r.remove(), 700);
  };

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
    vulZakken(n, false);
    return n;
  };
  const leeg = () => {
    draad.style.transition = 'none';
    draad.innerHTML = '';
    scrollY = 0;
    draad.style.transform = 'translateY(0)';
    void draad.offsetWidth;
    draad.style.transition = '';
    getypt.textContent = ''; invoer.classList.remove('tekst'); veld.classList.remove('actief');
    vinger.classList.remove('aan', 'druk', 'sleep');
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
  // Landplek links naast de telefoon, klein genoeg om de chat vrij te laten.
  const EIND = { x: -24, y: 118, s: .74 };
  const vlieg = async () => {
    const mijn = run;
    if (pop.classList.contains('geland')) {
      pop.classList.remove('geland');
      await pop.animate([{ opacity: 1 }, { transform: `translate(${EIND.x + 40}px, ${EIND.y + 60}px) rotate(-4deg) scale(${EIND.s * .7})`, opacity: 0 }], { duration: 240, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).finished.catch(() => {});
      if (mijn !== run) return;
    }
    pop.getAnimations().forEach(a => a.cancel());
    const tin = toneelIn.getBoundingClientRect();
    const b = $('.creatie-zak', draad).getBoundingClientRect();
    const bx = (b.left - tin.left) / schaal, by = (b.top - tin.top) / schaal, k = (b.width / schaal) / 230;
    pop.classList.remove('geland');
    pop.animate([
      { transform: `translate(${bx}px, ${by}px) rotate(-5deg) scale(${k})`, opacity: 0 },
      { opacity: 1, offset: .12 },
      { transform: `translate(${EIND.x - 24}px, ${EIND.y - 40}px) rotate(-15deg) scale(${EIND.s * 1.1})`, opacity: 1, offset: .68 },
      { transform: `translate(${EIND.x}px, ${EIND.y}px) rotate(-9deg) scale(${EIND.s})`, opacity: 1 },
    ], { duration: 1150, easing: 'cubic-bezier(.22,.9,.25,1)', fill: 'forwards' });
    // Alleen landen als er intussen geen andere smaak is gekozen.
    setTimeout(() => { if (mijn !== run) return; pop.classList.add('geland'); vonken(EIND.x + 115 * EIND.s, EIND.y + 150 * EIND.s); }, 900);
  };
  // De grote zak staat meteen geland naast de telefoon: veerkrachtig binnen, met vonken.
  const POP_EIND = `translate(${EIND.x}px, ${EIND.y}px) rotate(-9deg) scale(${EIND.s})`;
  const landPop = () => {
    pop.getAnimations().forEach(a => a.cancel());
    pop.classList.remove('geland');
    if (rust) { pop.animate([{ transform: POP_EIND, opacity: 1 }], { duration: 1, fill: 'forwards' }); pop.classList.add('geland'); return; }
    pop.animate([
      { transform: `translate(${EIND.x + 60}px, ${EIND.y + 120}px) rotate(6deg) scale(${EIND.s * .45})`, opacity: 0 },
      { opacity: 1, offset: .3 },
      { transform: POP_EIND, opacity: 1 },
    ], { duration: 550, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' });
    const mijn = run;
    setTimeout(() => { if (mijn !== run) return; pop.classList.add('geland'); vonken(EIND.x + 115 * EIND.s, EIND.y + 150 * EIND.s); }, 320);
  };
  const verbergPop = snel => {
    pop.classList.remove('geland');
    return pop.animate([{ opacity: snel ? 0 : 1 }, { transform: `translate(${EIND.x + 120 * EIND.s}px, ${EIND.y + 220 * EIND.s}px) rotate(-2deg) scale(${EIND.s * .4})`, opacity: 0 }], { duration: snel ? 1 : 600, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).finished;
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
    const typ = async tekst => {
      veld.classList.add('actief');
      for (const ch of tekst) {
        getypt.textContent += ch;
        invoer.classList.add('tekst');
        await pauze(55 + Math.random() * 65);
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
        await pauze(700);
        await typ('WIN');
        await verstuur(0);
        await pauze(500);
        await typtIndicator(1300);
        voegToe(1); scrollNaarOnder();
        await pauze(1700);
        await typ(Zak.SMAKEN[smaak].naam);
        await verstuur(2);
        await pauze(400);
        await typtIndicator(1000);
        const media = voegToe(3, ['genereren']);
        await pauze(1500);
        media.classList.remove('genereren'); media.classList.add('klaar');
        await pauze(800);
        voegToe(4);
        await pauze(500);
        await veeg();
        await pauze(450);
        const knop = voegToe(5); scrollNaarOnder();
        await pauze(1000);
        const k = inScherm(knop.firstElementChild);
        await tik(k.x + k.w / 2, k.y - scrollY + k.h / 2, () => { knop.classList.add('ingedrukt'); vlieg(); });
        setTimeout(() => knop.classList.remove('ingedrukt'), 260);
        await pauze(4200);
        await verbergPop(false);
        if (mijn !== run) throw AFGEBROKEN;
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

  // Kies een smaak in de band: het gesprek begint opnieuw met die smaak.
  band.addEventListener('click', e => {
    const b = e.target.closest('.band-zak');
    if (!b) return;
    smaak = +b.dataset.smaak;
    run++;
    draad.style.opacity = '';
    verbergPop(true);
    leeg();
    zetSmaakInBeeld();
    const r = toneel.getBoundingClientRect();
    if (r.top < -r.height * .35 || r.bottom > innerHeight + r.height * .6) toneel.scrollIntoView({ behavior: rust ? 'auto' : 'smooth', block: 'center' });
    landPop();
    if (rust) { sjablonen.forEach((s, i) => { const n = s.cloneNode(true); draad.appendChild(n); vulZakken(n, false); }); scrollNaarOnder(); }
    else gesprek(run, 2500);
  });

  zetSmaakInBeeld();
  if (rust) { scrollNaarOnder(); landPop(); }
  else {
    leeg();
    gesprek(run, 300);
    // De hero is meteen vol: de zak landt zodra de intro loopt.
    const start = run;
    const land = () => { if (start === run && !pop.classList.contains('geland')) landPop(); };
    const r = document.documentElement;
    if (!r.classList.contains('intro') || r.classList.contains('start')) setTimeout(land, 250);
    else new MutationObserver((m, o) => { if (r.classList.contains('start')) { o.disconnect(); setTimeout(land, 450); } }).observe(r, { attributes: true, attributeFilter: ['class'] });
  }
})();
