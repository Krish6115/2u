(() => {
  const { $, esc } = BD;
  const DRAFT = 'bd-draft-v1';
  let photos = []; // {src, cap}

  /* ----- repeatable text rows ----- */
  function makeList(host, o) {
    host.classList.add('rep');
    const rows = document.createElement('div');
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'btn-add'; add.textContent = '+ Add another';
    host.append(rows, add);
    const inputs = () => [...rows.querySelectorAll('.inp')];
    function addRow(v = '') {
      if (rows.children.length >= o.max) return;
      const row = document.createElement('div'); row.className = 'rep-row';
      const inp = document.createElement(o.multi ? 'textarea' : 'input');
      inp.className = 'inp'; inp.value = v; inp.maxLength = o.len || 400;
      inp.placeholder = o.ph[rows.children.length] || o.ph[o.ph.length - 1];
      if (o.multi) inp.rows = 3;
      inp.addEventListener('input', save);
      const x = document.createElement('button');
      x.type = 'button'; x.className = 'rm'; x.textContent = '×'; x.title = 'Remove';
      x.onclick = () => { if (rows.children.length > o.min) { row.remove(); save(); sync(); } else { inp.value = ''; save(); } };
      row.append(inp, x); rows.append(row); sync();
    }
    const sync = () => { add.hidden = rows.children.length >= o.max; };
    for (let i = 0; i < o.min; i++) addRow();
    add.onclick = () => { addRow(); inputs().at(-1).focus(); };
    return {
      get: () => inputs().map(i => i.value.trim()).filter(Boolean),
      set(arr) {
        rows.innerHTML = '';
        arr.forEach(v => addRow(v));
        while (rows.children.length < o.min) addRow();
      }
    };
  }

  const L = {
    prizes: makeList($('#listPrizes'), { min: 3, max: 6, len: 90, ph: ['The hard work you do, such a ground to look up to.', 'Your cute little chaos that I could never get tired of.', 'Something you love about her…'] }),
    story: makeList($('#listStory'), { min: 2, max: 6, multi: true, len: 700, ph: ["It's been almost three years of knowing you…", 'Then came…', 'And now…'] }),
    wishes: makeList($('#listWishes'), { min: 3, max: 8, len: 110, ph: ['A year full of small joys and reasons to celebrate yourself.', 'May every plan you make work out.', 'More laughter than you can handle.'] }),
    places: makeList($('#listPlaces'), { min: 3, max: 8, len: 40, ph: ['Our first coffee', 'The old bookstore', 'That one rooftop'] })
  };

  /* ----- photos ----- */
  async function shrink(file) {
    let bmp;
    try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { bmp = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); }); }
    const w0 = bmp.width, h0 = bmp.height, s = Math.min(1, 340 / Math.max(w0, h0));
    const c = document.createElement('canvas');
    c.width = Math.round(w0 * s); c.height = Math.round(h0 * s);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', .6);
  }
  function drawPhotos() {
    const box = $('#photoList');
    box.innerHTML = photos.map((p, i) => `
      <div class="ph"><img src="${p.src}" alt=""><input data-i="${i}" maxlength="40" placeholder="Caption (optional)" value="${esc(p.cap)}"><button type="button" class="rm" data-rm="${i}">×</button></div>`).join('');
    box.querySelectorAll('input').forEach(i => i.oninput = () => { photos[i.dataset.i].cap = i.value; save(); });
    box.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { photos.splice(+b.dataset.rm, 1); drawPhotos(); save(); });
  }
  $('#fPhotos').addEventListener('change', async e => {
    for (const f of [...e.target.files]) {
      if (photos.length >= 4) break;
      try { photos.push({ src: await shrink(f), cap: '' }); } catch { /* skip unreadable */ }
    }
    e.target.value = ''; drawPhotos(); save();
  });

  /* ----- collect / restore ----- */
  const v = id => $('#' + id).value.trim();
  function collect() {
    return {
      n: v('fName'), f: v('fFrom'), a: +v('fAge'), d: v('fBday'), l: $('#fLetter').value.trim(),
      p: L.prizes.get(), s: L.story.get(), w: L.wishes.get(), ph: photos, pl: L.places.get(),
      dk: { date: v('fDate'), cap: v('fDateCap') }, so: { url: v('fSong'), title: v('fSongTitle'), file: v('fSongFile') }
    };
  }
  function fill(d) {
    $('#fName').value = d.n || ''; $('#fFrom').value = d.f || ''; $('#fAge').value = d.a || '';
    $('#fBday').value = d.d || ''; $('#fLetter').value = d.l || '';
    L.prizes.set(d.p || []); L.story.set(d.s || []); L.wishes.set(d.w || []); L.places.set(d.pl || []);
    photos = (d.ph || []).slice(); drawPhotos();
    $('#fDate').value = d.dk?.date || ''; $('#fDateCap').value = d.dk?.cap || '';
    $('#fSong').value = d.so?.url || ''; $('#fSongTitle').value = d.so?.title || ''; $('#fSongFile').value = d.so?.file || '';
  }
  function save() { try { localStorage.setItem(DRAFT, JSON.stringify(collect())); } catch { /* quota */ } }
  try { const r = localStorage.getItem(DRAFT); if (r) fill(JSON.parse(r)); } catch { /* ignore */ }
  $('#form').addEventListener('input', save);

  $('#loadSample').onclick = () => { fill(BD.sample); save(); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  /* ----- submit ----- */
  function validate(d) {
    if (!d.n || !d.f) return 'Add both names.';
    if (!d.a || d.a < 1) return 'Add the age they are turning.';
    if (!d.d) return 'Pick the birthday date.';
    if (!d.l) return 'Write the letter (step 1).';
    if (d.p.length < 1) return 'Add at least one “what I love” line (step 2).';
    if (d.s.length < 1) return 'Add at least one story chapter (step 3).';
    if (d.w.length < 1) return 'Add at least one wish (step 4).';
    if (d.pl.length < 1) return 'Add at least one place (step 6).';
    if (!d.dk.date) return 'Pick the special date (step 7).';
    if (!d.so.file && !BD.ytId(d.so.url)) return 'Add a YouTube link or an audio file name (step 8).';
    return '';
  }
  $('#form').addEventListener('submit', async e => {
    e.preventDefault();
    const d = collect(), err = validate(d), box = $('#err');
    box.hidden = !err; box.textContent = err;
    if (err) { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const url = location.href.split('#')[0] + '#w=' + await BD.pack(d);
    $('#linkOut').value = url;
    $('#preview').href = url;
    $('#wa').href = 'https://wa.me/?text=' + encodeURIComponent('I made something for you 🎂 ' + url);
    $('#linkInfo').textContent = `Link size: ${(url.length / 1000).toFixed(1)}k characters.` +
      (url.length > 60000 ? ' That is long. Remove a photo if a chat app cuts it off.' : '');
    $('#form').hidden = true; $('#result').hidden = false; window.scrollTo(0, 0);
  });
  $('#copy').onclick = async () => {
    const i = $('#linkOut'); i.select();
    try { await navigator.clipboard.writeText(i.value); } catch { document.execCommand('copy'); }
    $('#copy').textContent = 'Copied ✓'; setTimeout(() => $('#copy').textContent = 'Copy link', 1800);
  };
  $('#back').onclick = () => { $('#result').hidden = true; $('#form').hidden = false; };
})();
