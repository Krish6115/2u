BD.art = {};

BD.art.logo = `<svg class="logo" viewBox="0 0 40 40"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8fb1"/><stop offset="1" stop-color="#d81b60"/></linearGradient></defs>
<path d="M20 33 C6 23 6 11 14 9.5 C17.5 9 19.4 11 20 13 C20.6 11 22.5 9 26 9.5 C34 11 34 23 20 33Z" fill="url(#lg)"/>
<path d="M13 13c2-2 4-1.5 5 0" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".7"/>
<path d="M33 5l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#ffd36e"/></svg>`;

BD.art.gift = (s = 44) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><rect x="8" y="26" width="32" height="18" rx="3" fill="#b9e3cf"/><rect x="21" y="26" width="6" height="18" fill="#f06292"/><rect x="6" y="18" width="36" height="10" rx="3" fill="#ffb74d"/><rect x="21" y="18" width="6" height="10" fill="#e53935"/><path d="M24 18c-8-10-14-4-9 0zM24 18c8-10 14-4 9 0z" fill="#e53935"/></svg>`;

BD.art.cake = (candles = 3, big = false) => {
  const cols = ['#f48fb1', '#80cbc4', '#ffd36e', '#b39ddb', '#ff8a80'];
  const mac = ['#a6e3cf', '#ffd2a8', '#d9c0f5', '#f9b6cc', '#fff0a8'];
  const BASE = 147, H = big ? 46 : 40;
  const xs = candles === 5 ? [98, 124, 150, 176, 202] : [120, 150, 180];
  const candleSVG = xs.map((x, i) => {
    const top = BASE - H, fy = top - 9;
    return `<g class="candle" style="--i:${i}">
    <ellipse cx="${x}" cy="${BASE}" rx="6.5" ry="2.4" fill="#000" opacity=".12"/>
    <rect x="${x - 4}" y="${top}" width="8" height="${H}" rx="2.4" fill="#fffafc"/>
    ${[0.25, 0.5, 0.75].map(k => `<path d="M${x - 4} ${top + H * k}l8 -5" stroke="${cols[i % 5]}" stroke-width="3.2"/>`).join('')}
    <rect x="${x - 4}" y="${top}" width="3" height="${H}" rx="1.5" fill="#fff" opacity=".6"/>
    <path d="M${x} ${top}v-4" stroke="#5a3a3a" stroke-width="1.4"/>
    <g class="flame"><ellipse cx="${x}" cy="${fy}" rx="13" ry="15" fill="#ffd36e" opacity=".3"/>
    <path d="M${x} ${fy - 10}c7 7 7 15 0 19c-7-4-7-12 0-19z" fill="#ffb300"/><path d="M${x} ${fy - 3}c3.500 3.500 3.500 7.500 0 10c-3.500-2.500-3.500-6.500 0-10z" fill="#fff3b0"/></g>
    <path class="smoke" d="M${x} ${fy + 4}c-8-10 8-16 0-26c-8-10 8-14 0-24" stroke="#e8e0e4" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`;
  }).join('');

  const edgeY = (cx, cy, rx, ry, x) => cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  const drips = (cx, cy, rx, ry, n, col, len) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = cx - rx + 6 + (rx * 2 - 12) * i / (n - 1), y = edgeY(cx, cy, rx, ry, x);
      const l = len * (0.45 + 0.55 * ((i * 7 % 5) / 4));
      s += `<rect x="${(x - 5).toFixed(1)}" y="${(y - 6).toFixed(1)}" width="10" height="${(l + 6).toFixed(1)}" rx="5" fill="${col}"/>`;
    }
    return s;
  };
  const arc = (cx, cy, rx, ry, a0, a1, n) => Array.from({ length: n }, (_, i) => {
    const a = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

  const macs = arc(150, 216, 96, 21, 8, 172, 9).map(([x, y], i) =>
    `<g><ellipse cx="${x.toFixed(1)}" cy="${(y + 1).toFixed(1)}" rx="12" ry="9" fill="${mac[i % 5]}"/><rect x="${(x - 12).toFixed(1)}" y="${(y - 1).toFixed(1)}" width="24" height="3.400" fill="#fff" opacity=".9"/><ellipse cx="${(x - 3).toFixed(1)}" cy="${(y - 4).toFixed(1)}" rx="7" ry="2.800" fill="#fff" opacity=".35"/></g>`).join('');
  const kisses = arc(150, 150, 62, 14, 12, 168, 8).map(([x, y], i) => {
    const c = i % 2 ? '#fff' : '#ffc4d8';
    return `<g><path d="M${(x - 8).toFixed(1)} ${(y + 4).toFixed(1)}q0-14 8-19q8 5 8 19z" fill="${c}"/><path d="M${(x - 5).toFixed(1)} ${(y - 2).toFixed(1)}q1-6 4-9" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".8"/></g>`;
  }).join('');
  const sprinkles = Array.from({ length: 40 }, (_, i) => {
    const x = 58 + (i * 53 % 184), y = 244 + (i * 37 % 42);
    return `<rect x="${x}" y="${y}" width="7" height="2.800" rx="1.400" fill="${cols[i % 5]}" transform="rotate(${(i * 41) % 180} ${x} ${y})"/>`;
  }).join('');
  const beads = Array.from({ length: 16 }, (_, i) => {
    const x = 55 + i * 13.3;
    return `<circle cx="${x.toFixed(1)}" cy="${(edgeY(150, 296, 105, 22, x) - 2).toFixed(1)}" r="5.500" fill="${i % 3 ? '#fff' : '#f6c1d6'}"/>`;
  }).join('');

  return `<svg class="cake-svg" viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg">
  <defs>
   <linearGradient id="gl" x1="0" x2="1"><stop offset="0" stop-color="#c7a8ee"/><stop offset=".45" stop-color="#e6d6fa"/><stop offset="1" stop-color="#b394e0"/></linearGradient>
   <linearGradient id="gp" x1="0" x2="1"><stop offset="0" stop-color="#f59fc0"/><stop offset=".45" stop-color="#ffd3e2"/><stop offset="1" stop-color="#ee86ad"/></linearGradient>
   <radialGradient id="gh" cx=".35" cy=".3"><stop offset="0" stop-color="#ff9aa6"/><stop offset="1" stop-color="#d81b3c"/></radialGradient></defs>
  <ellipse cx="150" cy="322" rx="132" ry="16" fill="#000" opacity=".1"/>
  <path d="M136 312h28l8 20h-44z" fill="#ece0f1"/>
  <ellipse cx="150" cy="310" rx="132" ry="19" fill="#fff"/><ellipse cx="150" cy="307" rx="122" ry="14" fill="#f6eef8"/>
  <path d="M45 212V296A105 22 0 0 0 255 296V212Z" fill="url(#gl)"/>
  <ellipse cx="150" cy="212" rx="105" ry="24" fill="#eadcfb"/>
  ${drips(150, 212, 105, 24, 14, '#fff', 30)}
  <path d="M45 212A105 24 0 0 0 255 212" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/>
  ${sprinkles}${beads}
  <path d="M80 150V214A70 16 0 0 0 220 214V150Z" fill="url(#gp)"/>
  <ellipse cx="150" cy="150" rx="70" ry="17" fill="#ffe0ec"/>
  ${drips(150, 150, 70, 17, 10, '#fff', 24)}
  <path d="M80 150A70 17 0 0 0 220 150" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
  ${candleSVG}
  ${kisses}
  <g transform="translate(150 150)"><path d="M0 14c-17-11-17-26-6-27 4 0 6 2 6 5 0-3 2-5 6-5 11 1 11 16-6 27z" fill="url(#gh)"/><path d="M-9-9c2-3 5-3 7-1" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".8"/></g>
  ${macs}
  </svg>`;
};

BD.art.envelope = `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" class="env-svg"><defs>
<linearGradient id="e1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6a8c0"/><stop offset="1" stop-color="#e68ba9"/></linearGradient>
<linearGradient id="e2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9c0d2"/><stop offset="1" stop-color="#f093b1"/></linearGradient>
<radialGradient id="e3" cx=".35" cy=".3"><stop offset="0" stop-color="#f0485f"/><stop offset="1" stop-color="#a5102d"/></radialGradient></defs>
<path d="M0 40h400v260H0z" fill="url(#e1)"/><path d="M0 300L200 170L400 300z" fill="#f2a0ba" opacity=".5"/>
<path d="M0 40Q200 10 400 40L400 70Q200 250 0 70z" fill="url(#e2)"/>
<path d="M0 40Q200 10 400 40" stroke="#fff" stroke-opacity=".5" fill="none" stroke-width="2"/>
<circle cx="200" cy="170" r="28" fill="url(#e3)"/><circle cx="200" cy="170" r="21" fill="none" stroke="#7d0a22" stroke-opacity=".35" stroke-width="2"/>
<path d="M200 182c-11-7-11-16-4-17 2 0 4 1 4 3 0-2 2-3 4-3 7 1 7 10-4 17z" fill="#ff8fa3"/></svg>`;

BD.art.jar = `<svg viewBox="0 0 220 250" class="jar-svg"><defs>
<radialGradient id="jg" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#fff2c4" stop-opacity=".95"/><stop offset=".7" stop-color="#ffd6e6" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></radialGradient>
<linearGradient id="jc" x1="0" x2="1"><stop offset="0" stop-color="#c99560"/><stop offset=".5" stop-color="#e6bb8a"/><stop offset="1" stop-color="#b8844f"/></linearGradient></defs>
<ellipse cx="110" cy="236" rx="70" ry="9" fill="#000" opacity=".1"/>
<path d="M62 62c-22 14-38 40-38 80 0 50 34 86 86 86s86-36 86-86c0-40-16-66-38-80z" fill="url(#jg)" stroke="#fff" stroke-width="3" stroke-opacity=".8"/>
<path d="M40 130c2-26 14-44 30-56" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>
<g id="jarStars"></g>
<rect x="68" y="46" width="84" height="22" rx="6" fill="#f1e4ff" stroke="#fff" stroke-width="2"/>
<path d="M72 34h76l4 16H68z" fill="url(#jc)"/><rect x="72" y="22" width="76" height="16" rx="8" fill="url(#jc)"/>
<path d="M66 60h88" stroke="#b39ddb" stroke-width="9" stroke-linecap="round"/>
<path d="M110 60c-20-18-34-6-22 4 8 6 20 0 22-4zM110 60c20-18 34-6 22 4-8 6-20 0-22-4z" fill="#c7a8f0"/><circle cx="110" cy="60" r="6" fill="#b08ae0"/></svg>`;

BD.art.camera = `<svg viewBox="0 0 150 110" class="cam"><rect x="6" y="14" width="138" height="92" rx="16" fill="#8fd6bd"/><rect x="6" y="14" width="138" height="30" rx="14" fill="#a9e6d0"/>
<rect x="18" y="26" width="42" height="26" rx="6" fill="#fff"/><circle cx="104" cy="62" r="34" fill="#6f4fc8"/><circle cx="104" cy="62" r="26" fill="#2c2144"/><circle cx="104" cy="62" r="14" fill="#4a3a7a"/><circle cx="98" cy="55" r="5" fill="#fff" opacity=".8"/>
<circle cx="132" cy="26" r="7" fill="#f06292"/><path d="M68 14l6-10h28l6 10z" fill="#74c4aa"/></svg>`;

BD.art.map = `<svg viewBox="0 0 320 220" class="map-svg"><defs><filter id="ms"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity=".22"/></filter></defs>
<g filter="url(#ms)"><polygon points="14,52 112,30 112,196 14,214" fill="#d6ecd3"/><polygon points="112,30 214,50 214,206 112,196" fill="#f6f1de"/><polygon points="214,50 306,26 306,190 214,206" fill="#cfe5f2"/></g>
<path d="M30 80q40-12 70 4M30 150q50 12 70-6M130 60q40 30 60 0M130 150q36 24 70 10M232 80q30-20 60-6M232 150q30 12 56-6" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".85"/>
<circle cx="256" cy="120" r="22" fill="#9ed0ea" opacity=".7"/><circle cx="52" cy="120" r="14" fill="#b6dcb1" opacity=".8"/>
<path id="route" d="M40 160C80 90 130 190 168 120S250 150 286 66" stroke="#e53960" stroke-width="3.4" stroke-dasharray="1 8" stroke-linecap="round" fill="none"/>
<g id="mapDots"></g>
<g id="pin" style="transition:transform .7s cubic-bezier(.5,1.4,.5,1)"><path d="M0 0c-16-18-16-40 0-44 16 4 16 26 0 44z" transform="translate(0 4) scale(1.1)" fill="#e0245e"/><circle cx="0" cy="-30" r="8" fill="#fff"/><path d="M0 -24c-6-4-6-9-2-10 1 0 2 1 2 2 0-1 1-2 2-2 4 1 4 6-2 10z" fill="#e0245e"/></g></svg>`;

BD.art.vinyl = `<svg viewBox="0 0 200 200" class="vinyl-svg"><defs><radialGradient id="vg" cx=".4" cy=".35"><stop offset="0" stop-color="#e2cdfa"/><stop offset=".6" stop-color="#c3a0ee"/><stop offset="1" stop-color="#a77ee0"/></radialGradient></defs>
<circle cx="100" cy="100" r="98" fill="url(#vg)"/>
${[88, 78, 68, 58].map(r => `<circle cx="100" cy="100" r="${r}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>`).join('')}
<circle cx="100" cy="100" r="36" fill="#f7b3c9"/><circle cx="100" cy="100" r="34" fill="none" stroke="#fff" stroke-opacity=".6" stroke-dasharray="2 4"/>
<path d="M60 40a80 80 0 0 1 60-12" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round" fill="none"/></svg>`;

BD.art.heart = (c = '#e0245e', s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21C3 14.5 3 7 7.5 6c2.2-.4 3.8 1 4.5 2.6C12.7 7 14.300 5.600 16.500 6 21 7 21 14.500 12 21z" fill="${c}"/></svg>`;

BD.art.icons = {
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8M7.500 8a2.500 2.500 0 0 1 0-5C11 3 12 8 12 8s1-5 4.500-5a2.500 2.500 0 0 1 0 5"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  pad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.500 12.500h5"/><circle cx="16" cy="11.500" r="1"/><circle cx="18.500" cy="14" r="1"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.700L3 8"/><path d="M3 3v5h5"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg>',
  hold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 8h16M4 12h16M4 16h10"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s7-6.500 7-12a7 7 0 0 0-14 0c0 5.500 7 12 7 12zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>'
};
