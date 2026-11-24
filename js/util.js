window.BD = window.BD || {};

BD.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
BD.$ = (s, r = document) => r.querySelector(s);
BD.$$ = (s, r = document) => [...r.querySelectorAll(s)];
BD.sleep = ms => new Promise(r => setTimeout(r, ms));

BD.roman = n => {
  const m = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let o = '';
  for (const [v, s] of m) while (n >= v) { o += s; n -= v; }
  return o;
};

BD.paras = t => String(t || '').split(/\n+/).map(p => p.trim()).filter(Boolean)
  .map(p => `<p>${BD.esc(p)}</p>`).join('');

BD.ytId = url => {
  if (!url) return '';
  const m = String(url).trim().match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : '');
};

/* ---------- link packing: JSON -> deflate -> base64url ---------- */
function toB64u(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64u(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function pipe(bytes, stream) {
  const w = stream.writable.getWriter();
  w.write(bytes); w.close();
  return new Uint8Array(await new Response(stream.readable).arrayBuffer());
}
BD.pack = async obj => {
  const raw = new TextEncoder().encode(JSON.stringify(obj));
  if (window.CompressionStream) return 'z' + toB64u(await pipe(raw, new CompressionStream('deflate-raw')));
  return 'r' + toB64u(raw);
};
BD.unpack = async str => {
  const bytes = fromB64u(str.slice(1));
  const raw = str[0] === 'z' ? await pipe(bytes, new DecompressionStream('deflate-raw')) : bytes;
  return JSON.parse(new TextDecoder().decode(raw));
};

/* ---------- confetti ---------- */
BD.confetti = (parent, n = 36) => {
  const cols = ['#f48fb1', '#ffd36e', '#b39ddb', '#80cbc4', '#ff8a80', '#fff'];
  const box = document.createElement('div');
  box.className = 'confetti';
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    s.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % cols.length]};` +
      `--x:${(Math.random() - .5) * 120}px;--r:${Math.random() * 720}deg;` +
      `animation-delay:${Math.random() * .6}s;animation-duration:${2.4 + Math.random() * 2}s;` +
      `width:${5 + Math.random() * 5}px;height:${8 + Math.random() * 8}px`;
    box.appendChild(s);
  }
  parent.appendChild(box);
  setTimeout(() => box.remove(), 5500);
};

BD.tween = (from, to, ms, fn, ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) =>
  new Promise(res => {
    const t0 = performance.now();
    (function step(now) {
      const t = Math.min(1, (now - t0) / ms);
      fn(from + (to - from) * ease(t));
      t < 1 ? requestAnimationFrame(step) : res();
    })(t0);
  });

BD.sample = {
  n: 'Kimchi', f: 'Krishna', a: 26, d: '2026-11-25',
  l: "Happy birthday, my favourite human.\n\nI hope you know how precious you are to me. Beyond all our stupid conversations, teasing and random nonsense, I genuinely care about you more than I can put into words.\n\nYou deserve the kind of happiness that stays, and I hope this year brings you all of it.",
  p: ['The hard work you do, such a ground to look up to.', 'Your cute little chaos that I could never get tired of.', 'The way you make everyone around you feel at home.'],
  s: ["It's been almost three years of knowing you, and I'm genuinely glad life somehow brought you into mine.", 'Then came the late-night chats that never seemed to end.', 'And here we are, still going.'],
  w: ['A year full of small joys and reasons to celebrate yourself.', 'May every plan you make find a way to work out.', 'More laughter than you know what to do with.'],
  ph: [], pl: ['Our first coffee', 'The old bookstore', 'Marine Drive', 'That one rooftop'],
  dk: { date: '2023-12-14', cap: 'The day we first properly talked.' },
  so: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Our song' }
};
