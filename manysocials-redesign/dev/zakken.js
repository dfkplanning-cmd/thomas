// Chipszakken als SVG: drie merkvoorstellen, elk met dezelfde vijf smaken.
// Zak.svg(merk, smaak, { naam }) geeft een losse <svg> terug (viewBox 240×320).
(() => {
  const SMAKEN = [
    { key: 'mango',   naam: 'Mango met chili',    r1: 'Mango',   r2: 'met chili' },
    { key: 'truffel', naam: 'Truffel en zeezout', r1: 'Truffel', r2: 'en zeezout' },
    { key: 'paprika', naam: 'Pittige paprika',    r1: 'Pittige', r2: 'paprika' },
    { key: 'honing',  naam: 'Honing en mosterd',  r1: 'Honing',  r2: 'en mosterd' },
    { key: 'limoen',  naam: 'Limoen en jalapeño', r1: 'Limoen',  r2: 'en jalapeño' },
  ];

  const MERKEN = {
    knap: {
      naam: 'KNAP', glans: .38,
      kleuren: [
        { bg: '#FFB000', blob: '#FF5A1F', stip: '#FF7A00' },
        { bg: '#6C3BF5', blob: '#2B1458', stip: '#8F6BFF' },
        { bg: '#FF2E3A', blob: '#FF9A1F', stip: '#FF6A4D' },
        { bg: '#FFD400', blob: '#FF8A00', stip: '#FFB000' },
        { bg: '#20CF6B', blob: '#C8F23C', stip: '#5BE38F' },
      ],
    },
    zilt: {
      naam: 'ZILT', glans: .12,
      kleuren: [
        { bg: '#C8681C' },
        { bg: '#22211E' },
        { bg: '#7F1D19' },
        { bg: '#B97F17' },
        { bg: '#1F4733' },
      ],
    },
    golf: {
      naam: 'golf.', glans: .26,
      kleuren: [
        { bg: '#FF9F1C', zon: '#FF4B1F', golf: '#FFD27A', tekst: '#1B1410' },
        { bg: '#2E2B29', zon: '#E7E0D3', golf: '#5A544E', tekst: '#F3EEE6' },
        { bg: '#F0412B', zon: '#8C1A12', golf: '#FF9C88', tekst: '#FFF4EF' },
        { bg: '#FFD23F', zon: '#E08E00', golf: '#FFF0A6', tekst: '#2A1E05' },
        { bg: '#A8E22F', zon: '#16753A', golf: '#E2FF86', tekst: '#0F2410' },
      ],
    },
  };

  const INK = '#1E0F24';
  const CREME = '#FFF7E6';
  let teller = 0;
  const f = n => +n.toFixed(2);

  // Omtrek met gekartelde sealranden boven en onder.
  const OMTREK = (() => {
    let d = 'M10 9';
    const stap = 220 / 30;
    for (let i = 0; i < 30; i++) { const x = 10 + i * stap; d += ` L${f(x + stap / 2)} 5 L${f(x + stap)} 9`; }
    d += ' L231 32 C239 100 239 220 231 288 L230 311';
    for (let i = 0; i < 30; i++) { const x = 230 - i * stap; d += ` L${f(x - stap / 2)} 315 L${f(x - stap)} 311`; }
    return d + ' L9 288 C1 220 1 100 9 32 Z';
  })();

  // Bobbelige cirkel (truffel).
  const bobbel = (r, n, a, seed = 1) => {
    let d = '';
    for (let i = 0; i <= n * 2; i++) {
      const t = (i / (n * 2)) * Math.PI * 2;
      const rr = r + (i % 2 ? a : -a * .4) + Math.sin(i * 1.7 * seed) * a * .3;
      const x = Math.cos(t) * rr, y = Math.sin(t) * rr;
      d += (i ? ' L' : 'M') + f(x) + ' ' + f(y);
    }
    return d + ' Z';
  };
  // Zachte golvende cirkel.
  const zacht = (r, n, a) => {
    let d = '';
    for (let i = 0; i <= 96; i++) {
      const t = (i / 96) * Math.PI * 2, rr = r + a * Math.sin(n * t);
      d += (i ? ' L' : 'M') + f(Math.cos(t) * rr) + ' ' + f(Math.sin(t) * rr);
    }
    return d + ' Z';
  };
  const zeshoek = (r, rot = 0) => {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const t = (Math.PI / 3) * i + rot;
      d += (i ? ' L' : 'M') + f(Math.cos(t) * r) + ' ' + f(Math.sin(t) * r);
    }
    return d + ' Z';
  };

  // Ingrediënten. modus 'vol' = stickerstijl met contour, 'lijn' = fijne lijntekening.
  const INGR = {
    mango: (m, c) => m === 'vol' ? `
      <g transform="rotate(-24)">
        <path d="M-6 -46 C 26 -48 42 -14 38 14 C 34 42 6 52 -14 46 C -38 38 -44 6 -38 -16 C -32 -36 -22 -45 -6 -46 Z" fill="#FFB52E" stroke="${INK}" stroke-width="3"/>
        <path d="M-2 -38 C 20 -38 32 -12 28 10 C 24 30 8 38 -4 36 C 12 22 18 -6 -2 -38 Z" fill="#FF8A1E" opacity=".9"/>
        <ellipse cx="-20" cy="-18" rx="6" ry="12" fill="#FFF3C4" opacity=".85" transform="rotate(20 -20 -18)"/>
        <path d="M-6 -46 C -10 -60 4 -70 22 -66 C 18 -54 8 -46 -6 -46 Z" fill="#2FBF62" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      </g>
      <g transform="translate(34 6) rotate(18)">
        <path d="M-6 -40 C 10 -30 14 -4 8 18 C 4 34 -6 46 -14 50 C -8 36 -4 16 -6 -4 C -8 -20 -14 -32 -6 -40 Z" fill="#FF2E3A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-3 -32 C 4 -24 6 -10 4 4" stroke="#FFD1C2" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M-8 -40 C -6 -50 4 -54 10 -50 C 6 -46 2 -42 -6 -38 Z" fill="#2FBF62" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      </g>` : `
      <g fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <g transform="rotate(-24)">
          <path d="M-6 -46 C 26 -48 42 -14 38 14 C 34 42 6 52 -14 46 C -38 38 -44 6 -38 -16 C -32 -36 -22 -45 -6 -46 Z"/>
          <path d="M-24 -20 C -28 0 -22 22 -6 34 M-14 -30 C -18 -8 -12 14 2 26 M-2 -34 C -4 -14 2 6 14 16" opacity=".55"/>
          <path d="M-6 -46 C -10 -60 4 -70 22 -66 C 18 -54 8 -46 -6 -46 Z M-4 -50 C 4 -56 12 -60 20 -64"/>
        </g>
        <g transform="translate(34 6) rotate(18)">
          <path d="M-6 -40 C 10 -30 14 -4 8 18 C 4 34 -6 46 -14 50 C -8 36 -4 16 -6 -4 C -8 -20 -14 -32 -6 -40 Z"/>
          <path d="M-8 -40 C -6 -50 4 -54 10 -50 C 6 -46 2 -42 -6 -38"/>
        </g>
      </g>`,
    truffel: (m, c) => m === 'vol' ? `
      <g transform="translate(-8 4)">
        <path d="${bobbel(36, 13, 4)}" fill="#4A3123" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="${bobbel(26, 10, 3, 2)}" fill="#5E3F2C" transform="translate(-6 -6)"/>
        <circle cx="-14" cy="-14" r="3" fill="#8A6247"/><circle cx="6" cy="-20" r="2.4" fill="#8A6247"/><circle cx="-4" cy="2" r="2.6" fill="#8A6247"/>
        <circle cx="14" cy="8" r="2.2" fill="#8A6247"/><circle cx="-18" cy="10" r="2" fill="#8A6247"/>
      </g>
      <g stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" fill="#FFFFFF">
        <rect x="30" y="-26" width="14" height="14" rx="2" transform="rotate(18 37 -19)"/>
        <rect x="40" y="2" width="11" height="11" rx="2" transform="rotate(-14 45 7)"/>
        <rect x="26" y="24" width="12" height="12" rx="2" transform="rotate(32 32 30)"/>
        <rect x="-46" y="-40" width="9" height="9" rx="2" transform="rotate(-20 -41 -35)"/>
      </g>` : `
      <g fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
        <path d="${bobbel(34, 13, 3.4)}" transform="translate(-8 4)"/>
        <path d="M-32 -6 L 10 -30 M-34 8 L 16 -20 M-30 20 L 20 -8 M-22 30 L 22 6 M-10 36 L 20 20" opacity=".5" transform="translate(-4 2)"/>
        <rect x="30" y="-26" width="13" height="13" rx="1.5" transform="rotate(18 37 -19)"/>
        <rect x="40" y="2" width="10" height="10" rx="1.5" transform="rotate(-14 45 7)"/>
        <rect x="26" y="24" width="11" height="11" rx="1.5" transform="rotate(32 32 30)"/>
      </g>`,
    paprika: (m, c) => m === 'vol' ? `
      <g transform="rotate(-10)">
        <path d="M-34 -14 C -42 22 -24 48 -10 44 C -2 52 10 52 16 44 C 32 50 46 24 38 -14 C 32 -38 -26 -40 -34 -14 Z" fill="#E11D2A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-4 -30 C 4 -6 4 22 -2 42 C 6 44 12 40 14 34 C 18 16 16 -10 8 -30 Z" fill="#B3121F" opacity=".8"/>
        <path d="M-24 -18 C -28 0 -24 18 -18 28" stroke="#FFB3A8" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M-12 -34 C -6 -30 10 -30 16 -34 C 10 -40 -6 -40 -12 -34 Z" fill="#1F9E4E" stroke="${INK}" stroke-width="2.6"/>
        <path d="M2 -36 C 2 -46 8 -54 18 -56" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M2 -36 C 2 -46 8 -54 18 -56" stroke="#2FBF62" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      </g>
      <g stroke="${INK}" stroke-width="2.4" stroke-linejoin="round">
        <path d="M44 -36 C 52 -26 56 -18 50 -8 C 46 -2 36 -4 36 -12 C 36 -20 44 -24 44 -36 Z" fill="#FFD400"/>
        <path d="M-46 22 C -40 30 -38 36 -42 42 C -46 46 -54 44 -54 38 C -54 32 -48 30 -46 22 Z" fill="#FFD400"/>
      </g>` : `
      <g fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" transform="rotate(-10)">
        <path d="M-34 -14 C -42 22 -24 48 -10 44 C -2 52 10 52 16 44 C 32 50 46 24 38 -14 C 32 -38 -26 -40 -34 -14 Z"/>
        <path d="M-4 -30 C 4 -6 4 22 -2 42 M-20 -24 C -26 0 -22 24 -12 38 M20 -26 C 26 -2 24 22 18 38" opacity=".55"/>
        <path d="M-12 -34 C -6 -30 10 -30 16 -34 C 10 -40 -6 -40 -12 -34 Z"/>
        <path d="M2 -36 C 2 -46 8 -54 18 -56"/>
      </g>`,
    honing: (m, c) => m === 'vol' ? `
      <g transform="translate(-14 -2) rotate(-28)">
        <rect x="-5" y="-66" width="10" height="56" rx="5" fill="#C9813E" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="0" cy="-10" rx="16" ry="6.5" fill="#E9A04A" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="0" cy="0" rx="20" ry="7" fill="#E9A04A" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="0" cy="10" rx="20" ry="7" fill="#E9A04A" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="0" cy="20" rx="16" ry="6.5" fill="#E9A04A" stroke="${INK}" stroke-width="3"/>
      </g>
      <path d="M-4 18 C 4 22 6 34 2 44 C 0 52 8 56 8 62 C 8 70 -6 70 -6 62 C -6 54 -2 50 -4 42 C -6 34 -12 26 -4 18 Z" fill="#FFB300" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      <g transform="translate(34 12)">
        <path d="M-22 18 C -26 4 -14 -6 -4 -2 C -6 -14 8 -20 14 -10 C 24 -12 30 0 24 8 C 30 14 26 24 16 22 L -16 24 C -22 24 -24 20 -22 18 Z" fill="#F1C40F" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M-8 6 C 0 0 10 2 14 8" stroke="#FFF3A6" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="-30" cy="-6" r="3" fill="#C78A00" stroke="${INK}" stroke-width="1.6"/>
        <circle cx="30" cy="-18" r="3" fill="#C78A00" stroke="${INK}" stroke-width="1.6"/>
        <circle cx="22" cy="34" r="2.6" fill="#C78A00" stroke="${INK}" stroke-width="1.6"/>
      </g>` : `
      <g fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
        <g transform="translate(-14 -2) rotate(-28)">
          <rect x="-5" y="-66" width="10" height="56" rx="5"/>
          <ellipse cx="0" cy="-10" rx="16" ry="6.5"/><ellipse cx="0" cy="0" rx="20" ry="7"/>
          <ellipse cx="0" cy="10" rx="20" ry="7"/><ellipse cx="0" cy="20" rx="16" ry="6.5"/>
        </g>
        <path d="M-4 18 C 4 22 6 34 2 44 C 0 52 8 56 8 62 C 8 70 -6 70 -6 62 C -6 54 -2 50 -4 42 C -6 34 -12 26 -4 18 Z"/>
        <g transform="translate(34 12)">
          <path d="M-22 18 C -26 4 -14 -6 -4 -2 C -6 -14 8 -20 14 -10 C 24 -12 30 0 24 8 C 30 14 26 24 16 22 L -16 24 C -22 24 -24 20 -22 18 Z"/>
          <circle cx="-30" cy="-6" r="2.6"/><circle cx="30" cy="-18" r="2.6"/>
        </g>
      </g>`,
    limoen: (m, c) => {
      const parten = [...Array(8)].map((_, i) => {
        const a1 = (i / 8) * Math.PI * 2 + .06, a2 = ((i + 1) / 8) * Math.PI * 2 - .06;
        return `M${f(Math.cos(a1) * 4)} ${f(Math.sin(a1) * 4)} L${f(Math.cos(a1) * 24)} ${f(Math.sin(a1) * 24)} A24 24 0 0 1 ${f(Math.cos(a2) * 24)} ${f(Math.sin(a2) * 24)} Z`;
      }).join(' ');
      return m === 'vol' ? `
      <g transform="translate(-14 -4)">
        <circle r="35" fill="#3FA535" stroke="${INK}" stroke-width="3"/>
        <circle r="30" fill="#E9FFB0"/>
        <path d="${parten}" fill="#B6EC3C"/>
        <circle r="3.4" fill="#E9FFB0"/>
      </g>
      <g transform="translate(34 18) rotate(-34)">
        <path d="M-10 -40 C 8 -36 14 -10 12 14 C 10 34 0 46 -8 48 C -18 46 -20 30 -18 10 C -16 -12 -22 -34 -10 -40 Z" fill="#128A3E" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-6 -30 C 2 -22 4 -2 2 14" stroke="#7FE0A0" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M-10 -40 C -10 -50 -2 -56 6 -54" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M-10 -40 C -10 -50 -2 -56 6 -54" stroke="#6FCB3E" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      </g>` : `
      <g fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
        <g transform="translate(-14 -4)"><circle r="34"/><circle r="29"/><path d="${parten}" opacity=".8"/></g>
        <g transform="translate(34 18) rotate(-34)">
          <path d="M-10 -40 C 8 -36 14 -10 12 14 C 10 34 0 46 -8 48 C -18 46 -20 30 -18 10 C -16 -12 -22 -34 -10 -40 Z"/>
          <path d="M-10 -40 C -10 -50 -2 -56 6 -54"/>
        </g>
      </g>`;
    },
  };

  // Eén chip met ribbels, in contourstijl voor KNAP.
  const chipVol = (x, y, r, s) => `
    <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="M-24 -6 C -22 -20 -6 -26 8 -22 C 22 -18 28 -4 24 8 C 20 20 4 26 -10 22 C -22 18 -26 6 -24 -6 Z" fill="#FFC23D" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M-18 -10 C -10 -6 -4 -14 4 -10 C 12 -6 16 -14 20 -10 M-20 0 C -12 4 -6 -4 2 0 C 10 4 14 -4 22 0 M-18 10 C -10 14 -4 6 4 10 C 12 14 16 6 18 10" stroke="#D98A1C" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`;

  // Gedeelde schaduw, glans, seal-ribbels en kreukels.
  const afwerking = (p, glans) => `
    <rect width="240" height="320" fill="url(#${p}h)"/>
    <rect width="240" height="320" fill="url(#${p}v)"/>
    <rect width="240" height="320" fill="url(#${p}r)"/>
    <rect x="0" y="0" width="240" height="33" fill="url(#${p}k)"/>
    <rect x="0" y="287" width="240" height="33" fill="url(#${p}k)"/>
    <path d="M9 33 C 80 36 160 36 231 33" stroke="#000" stroke-opacity=".28" stroke-width="1.6" fill="none"/>
    <path d="M9 35.5 C 80 38.5 160 38.5 231 35.5" stroke="#fff" stroke-opacity=".3" stroke-width="1.2" fill="none"/>
    <path d="M9 287 C 80 284 160 284 231 287" stroke="#000" stroke-opacity=".28" stroke-width="1.6" fill="none"/>
    <path d="M9 284.5 C 80 281.5 160 281.5 231 284.5" stroke="#fff" stroke-opacity=".22" stroke-width="1.2" fill="none"/>
    <g fill="none" stroke-linecap="round">
      <path d="M14 38 C 24 50 30 64 31 82 M226 38 C 216 52 212 66 212 80 M58 37 L 70 54 M64 37 L 72 47 M176 37 L 166 55 M120 36 L 116 50 M16 282 C 26 270 32 256 32 240 M224 282 C 214 270 210 256 210 242 M84 283 L 94 268 M160 283 L 150 270" stroke="#fff" stroke-opacity=".34" stroke-width="1.3"/>
      <path d="M16 38 C 26 50 32 64 33 82 M228 38 C 218 52 214 66 214 80 M60 37 L 72 54 M178 37 L 168 55 M18 282 C 28 270 34 256 34 240 M222 282 C 212 270 208 256 208 242 M86 283 L 96 268" stroke="#000" stroke-opacity=".16" stroke-width="1.3"/>
    </g>
    <path d="M28 48 C 18 120 18 200 30 272 C 38 200 38 120 44 48 Z" fill="url(#${p}g)" opacity="${glans}"/>
    <path d="M198 60 C 206 120 206 190 200 250 C 196 190 196 120 190 60 Z" fill="url(#${p}g)" opacity="${glans * .55}"/>`;

  const defs = (p) => `
    <clipPath id="${p}c"><path d="${OMTREK}"/></clipPath>
    <linearGradient id="${p}h" x1="0" x2="240" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".07" stop-color="#000" stop-opacity=".07"/>
      <stop offset=".15" stop-color="#fff" stop-opacity=".14"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset=".86" stop-color="#fff" stop-opacity=".06"/>
      <stop offset=".94" stop-color="#000" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".42"/>
    </linearGradient>
    <linearGradient id="${p}v" x1="0" x2="0" y1="0" y2="320" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".1" stop-color="#000" stop-opacity=".06"/>
      <stop offset=".115" stop-color="#fff" stop-opacity=".22"/><stop offset=".22" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset=".885" stop-color="#000" stop-opacity=".2"/>
      <stop offset=".9" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".22"/>
    </linearGradient>
    <radialGradient id="${p}r" cx=".5" cy=".5" r=".62">
      <stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset=".6" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".26"/>
    </radialGradient>
    <linearGradient id="${p}g" x1="0" x2="0" y1="48" y2="272" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff"/>
      <stop offset=".7" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="${p}k" width="3.6" height="10" patternUnits="userSpaceOnUse">
      <rect width="1.3" height="10" fill="#000" fill-opacity=".2"/><rect x="1.9" width=".9" height="10" fill="#fff" fill-opacity=".2"/>
    </pattern>`;

  // ---------- KNAP: luid, vrolijk, stickers ----------
  const knap = (s, i, k, p, naam) => `
    <rect width="240" height="320" fill="${k.bg}"/>
    <pattern id="${p}d" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4.5" cy="4.5" r="2.1" fill="${k.stip}"/></pattern>
    <path d="M120 40 L240 40 L240 150 C 200 120 160 110 120 40 Z" fill="url(#${p}d)" opacity=".7"/>
    <path d="M-10 168 C 30 140 70 190 120 164 C 170 138 206 150 250 136 L250 330 L-10 330 Z" fill="${k.blob}"/>
    <g transform="rotate(-6 120 74)">
      <text x="123.5" y="88" text-anchor="middle" font-family="'Bagel Fat One', 'Arial Black', sans-serif" font-size="64" fill="${INK}">KNAP</text>
      <text x="120" y="84" text-anchor="middle" font-family="'Bagel Fat One', 'Arial Black', sans-serif" font-size="64" fill="${CREME}" stroke="${INK}" stroke-width="3" paint-order="stroke" stroke-linejoin="round">KNAP</text>
    </g>
    <g transform="translate(120 106) rotate(-6)">
      <rect x="-44" y="-9" width="88" height="17" rx="8.5" fill="${INK}"/>
      <text y="3.4" text-anchor="middle" font-family="'DM Mono', ui-monospace, monospace" font-size="8.4" letter-spacing="1.6" fill="${CREME}">CHIPS · 150 G</text>
    </g>
    ${chipVol(50, 206, -18, .92)}
    <g transform="translate(118 184) scale(.82)">${INGR[s.key]('vol')}</g>
    ${chipVol(192, 200, 24, .8)}
    <g transform="translate(120 252) rotate(3)">
      <rect x="-86" y="-24" width="172" height="50" rx="12" fill="${CREME}" stroke="${INK}" stroke-width="3"/>
      <text y="-2" text-anchor="middle" font-family="'Bagel Fat One', 'Arial Black', sans-serif" font-size="21" fill="${INK}">${s.r1.toUpperCase()}</text>
      <text y="18" text-anchor="middle" font-family="'Bagel Fat One', 'Arial Black', sans-serif" font-size="15" fill="${k.blob === '#C8F23C' ? '#128A3E' : k.bg === '#FFD400' ? '#E07000' : k.bg}">${s.r2.toUpperCase()}</text>
    </g>
    ${naam ? `<g class="zak-naam" transform="translate(194 134) rotate(12)"><g class="zak-naam-in">
      <path d="${ster(34, 26, 14)}" fill="${CREME}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      <text y="-5" text-anchor="middle" font-family="'Caveat', 'Comic Sans MS', cursive" font-weight="700" font-size="14" fill="${INK}">van</text>
      <text y="12" text-anchor="middle" font-family="'Caveat', 'Comic Sans MS', cursive" font-weight="700" font-size="21" fill="${INK}">${naam}</text>
    </g></g>` : ''}`;

  const ster = (R, r, n) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const t = (Math.PI / n) * i - Math.PI / 2, rr = i % 2 ? r : R;
      d += (i ? ' L' : 'M') + f(Math.cos(t) * rr) + ' ' + f(Math.sin(t) * rr);
    }
    return d + ' Z';
  };

  // ---------- ZILT: mat, goudfolie, lijntekening ----------
  const zilt = (s, i, k, p, naam) => `
    <linearGradient id="${p}f" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9C7A35"/><stop offset=".32" stop-color="#F4DE9C"/><stop offset=".52" stop-color="#B8913F"/>
      <stop offset=".74" stop-color="#F8E8B6"/><stop offset="1" stop-color="#A88337"/>
    </linearGradient>
    <filter id="${p}n" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${i + 3}"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
    <rect width="240" height="320" fill="${k.bg}"/>
    <rect width="240" height="320" fill="${k.bg}" filter="url(#${p}n)" opacity=".35"/>
    <rect x="20" y="44" width="200" height="236" rx="3" fill="none" stroke="url(#${p}f)" stroke-width="1.1"/>
    <rect x="24.5" y="48.5" width="191" height="227" rx="1.5" fill="none" stroke="url(#${p}f)" stroke-width=".55"/>
    <text x="125" y="84" text-anchor="middle" font-family="'Instrument Serif', Georgia, serif" font-size="40" letter-spacing="10" fill="url(#${p}f)">ZILT</text>
    <text x="121.5" y="98" text-anchor="middle" font-family="'DM Mono', ui-monospace, monospace" font-size="6.2" letter-spacing="3" fill="url(#${p}f)">KETTLE CHIPS</text>
    <path d="M60 256 L60 166 A60 60 0 0 1 180 166 L180 256 Z" fill="#F4EDE1"/>
    <path d="M64 252 L64 166 A56 56 0 0 1 176 166 L176 252 Z" fill="none" stroke="${k.bg}" stroke-width=".6" opacity=".6"/>
    <g transform="translate(120 ${s.key === 'honing' ? 140 : 148}) scale(${s.key === 'honing' ? .6 : .7})">${INGR[s.key]('lijn', k.bg)}</g>
    <text x="120" y="208" text-anchor="middle" font-family="'Instrument Serif', Georgia, serif" font-style="italic" font-size="27" fill="${k.bg}">${s.r1}</text>
    <text x="120" y="226" text-anchor="middle" font-family="'Instrument Serif', Georgia, serif" font-style="italic" font-size="16" fill="${k.bg}">${s.r2}</text>
    <text x="121" y="243" text-anchor="middle" font-family="'DM Mono', ui-monospace, monospace" font-size="5.8" letter-spacing="1.6" fill="${k.bg}" opacity=".8">Nº 0${i + 1} · 150 G</text>
    ${naam
      ? `<g class="zak-naam"><g class="zak-naam-in"><text x="120" y="270" text-anchor="middle" font-family="'Instrument Serif', Georgia, serif" font-style="italic" font-size="13" fill="url(#${p}f)">van ${naam}</text></g></g>`
      : `<text x="121.5" y="268.5" text-anchor="middle" font-family="'DM Mono', ui-monospace, monospace" font-size="5.8" letter-spacing="2.4" fill="url(#${p}f)">HANDGESNEDEN</text>`}`;

  // ---------- golf.: één vorm per smaak, ribbels, kleine letters ----------
  const VORM = {
    mango: (c) => `<circle r="48" fill="${c}"/>`,
    truffel: (c) => `<path d="${zacht(45, 7, 3.6)}" fill="${c}"/>`,
    paprika: (c) => `<rect x="-38" y="-38" width="76" height="76" rx="22" fill="${c}" transform="rotate(45)"/>`,
    honing: (c) => `<path d="${zeshoek(50, 0)}" fill="${c}"/>`,
    limoen: (c, bg) => `<circle r="48" fill="${c}"/><g stroke="${bg}" stroke-width="3">${[...Array(4)].map((_, j) => `<line x1="${f(Math.cos(j * Math.PI / 4) * 48)}" y1="${f(Math.sin(j * Math.PI / 4) * 48)}" x2="${f(-Math.cos(j * Math.PI / 4) * 48)}" y2="${f(-Math.sin(j * Math.PI / 4) * 48)}"/>`).join('')}</g><circle r="9" fill="${bg}"/>`,
  };
  const golven = (kleur, y0) => {
    let out = '';
    for (let j = 0; j < 6; j++) {
      const y = y0 + j * 15;
      let d = `M-10 ${y}`;
      for (let x = -10; x <= 250; x += 10) d += ` L${x} ${f(y + Math.sin((x + j * 14) / 15) * 4)}`;
      for (let x = 250; x >= -10; x -= 10) d += ` L${x} ${f(y + 7.5 + Math.sin((x + j * 14) / 15) * 4)}`;
      out += `<path d="${d} Z" fill="${kleur}"/>`;
    }
    return out;
  };
  const golf = (s, i, k, p, naam) => `
    <rect width="240" height="320" fill="${k.bg}"/>
    <g transform="translate(160 172)">${VORM[s.key](k.zon, k.bg)}</g>
    <rect x="0" y="212" width="240" height="90" fill="${k.bg}"/>
    ${golven(k.golf, 214)}
    <text x="22" y="76" font-family="'Unbounded', 'Arial Black', sans-serif" font-weight="800" font-size="34" letter-spacing="-1.4" fill="${k.tekst}">golf.</text>
    <text x="214" y="62" text-anchor="end" font-family="'DM Mono', ui-monospace, monospace" font-size="10" fill="${k.tekst}">0${i + 1}<tspan opacity=".55">/05</tspan></text>
    <text x="22" y="106" font-family="'Unbounded', 'Arial Black', sans-serif" font-weight="600" font-size="17" letter-spacing="-.5" fill="${k.tekst}">${s.r1.toLowerCase()}</text>
    <text x="22" y="127" font-family="'Unbounded', 'Arial Black', sans-serif" font-weight="600" font-size="17" letter-spacing="-.5" fill="${k.tekst}">${s.r2.toLowerCase()}</text>
    <text x="22" y="146" font-family="'DM Mono', ui-monospace, monospace" font-size="7.4" letter-spacing=".6" fill="${k.tekst}" opacity=".75">ribbelchips · 150 g</text>
    ${naam ? `<g class="zak-naam" transform="translate(22 252)"><g class="zak-naam-in">
      <rect width="${f(42 + naam.length * 6.6)}" height="22" rx="11" fill="${k.tekst}"/>
      <text x="11" y="14.6" font-family="'Unbounded', 'Arial Black', sans-serif" font-weight="600" font-size="9" fill="${k.bg}">van ${naam.toLowerCase()}</text>
    </g></g>` : ''}`;

  const TEKEN = { knap, zilt, golf };

  const svg = (merk, i, opts = {}) => {
    const M = MERKEN[merk], s = SMAKEN[i], k = M.kleuren[i];
    const p = 'z' + (++teller) + '-';
    const naam = opts.naam ? String(opts.naam).replace(/[<>&"]/g, '') : '';
    const label = opts.label ?? `Een zak chips met de smaak ${s.naam.toLowerCase()}`;
    return `<svg class="zak-svg" viewBox="0 0 240 320" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(p)}</defs>
      <g clip-path="url(#${p}c)">${TEKEN[merk](s, i, k, p, naam)}${afwerking(p, M.glans)}</g>
      <path d="${OMTREK}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
    </svg>`;
  };

  // Losse chip voor het decor (geen merk).
  const chip = (hue = 0) => `<svg viewBox="-30 -30 60 60" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="ch${++teller}" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".55" stop-color="#F6C25A"/><stop offset="1" stop-color="#D9902E"/></radialGradient></defs>
    <path d="M-24 -6 C -22 -20 -6 -26 8 -22 C 22 -18 28 -4 24 8 C 20 20 4 26 -10 22 C -22 18 -26 6 -24 -6 Z" fill="url(#ch${teller})" style="filter:hue-rotate(${hue}deg)"/>
    <path d="M-18 -10 C -10 -6 -4 -14 4 -10 C 12 -6 16 -14 20 -10 M-20 0 C -12 4 -6 -4 2 0 C 10 4 14 -4 22 0 M-18 10 C -10 14 -4 6 4 10 C 12 14 16 6 18 10" stroke="#C98A2E" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <circle cx="-8" cy="-6" r="1" fill="#B5702A" opacity=".6"/><circle cx="9" cy="4" r=".9" fill="#B5702A" opacity=".6"/><circle cx="-2" cy="11" r=".8" fill="#B5702A" opacity=".6"/>
  </svg>`;

  // Klein rond merkteken voor de avatar in de chat.
  const logo = (merk) => {
    if (merk === 'zilt') return `<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="lg${++teller}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8913F"/><stop offset=".5" stop-color="#F4DE9C"/><stop offset="1" stop-color="#A88337"/></linearGradient></defs><rect width="40" height="40" fill="#22211E"/><text x="20" y="27.5" text-anchor="middle" font-family="'Instrument Serif', Georgia, serif" font-size="22" fill="url(#lg${teller})">Z</text></svg>`;
    if (merk === 'golf') return `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" fill="#FF9F1C"/><circle cx="27" cy="26" r="8" fill="#FF4B1F"/><text x="8" y="25" font-family="'Unbounded', 'Arial Black', sans-serif" font-weight="800" font-size="15" letter-spacing="-.8" fill="#1B1410">g.</text></svg>`;
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" fill="#FFB000"/><text x="21" y="29" text-anchor="middle" font-family="'Bagel Fat One', 'Arial Black', sans-serif" font-size="23" fill="${INK}">K</text><text x="20" y="28" text-anchor="middle" font-family="'Bagel Fat One', 'Arial Black', sans-serif" font-size="23" fill="${CREME}" stroke="${INK}" stroke-width="1.6" paint-order="stroke">K</text></svg>`;
  };

  window.Zak = { SMAKEN, MERKEN, svg, chip, logo };
})();
