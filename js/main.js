(async function boot() {
  const h = location.hash;
  try {
    if (h.startsWith('#w=')) return BD.startApp(await BD.unpack(h.slice(3)));
    const dm = h.match(/^#demo(\d+)$/);
    if (dm) { BD.startApp(JSON.parse(JSON.stringify(BD.sample))); BD.go(+dm[1]); return; }
    if (h === '#demo') return BD.startApp(JSON.parse(JSON.stringify(BD.sample)));
  } catch (e) {
    console.error(e);
    alert('This link looks broken. Ask for a fresh one.');
  }
  document.getElementById('setup').hidden = false;
})();
addEventListener('hashchange', () => location.reload());
