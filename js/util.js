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

