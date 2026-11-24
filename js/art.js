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

