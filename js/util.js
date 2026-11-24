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

