(() => {
  const { esc, $, $$, art, paras, roman } = Object.assign({}, BD, { art: BD.art });
  const NAMES = ['The letter', 'What I love', 'Our story', 'Wishes', 'Moments', 'Places', 'Our date', 'Our song', 'The candles', 'The wish'];
  const WORDS = ['wonderful', 'amazing', 'bright', 'generous'];
  const ICONS = ['💌', '🕹️', '📖', '🫙', '📸', '🗺️', '📅', '💿'];

  BD.startApp = function (d) {
    d.a = +d.a || 0;
    $('#setup').hidden = true;
    const app = $('#app'); app.hidden = false;
    const digits = String(d.a).split('');
    const half = Math.ceil(digits.length / 2);
    const balloon = x => `<span class="balloon" data-t="${x}">${x}</span>`;
    const dt = new Date(d.d + 'T00:00');
    const pill = dt.toLocaleDateString('en', { month: 'long', day: 'numeric' }).toUpperCase();
    const when = new Date((d.dk.date || d.d) + 'T00:00');

    /* ---------- scene markup ---------- */
    const S = [];
    S[0] = `<div class="intro">
      <div class="pill">${art.icons.cal}<span>${esc(pill)}</span></div>
      <h1 class="hb">Happy birthday,<br><span class="nm">${esc(d.n)}!</span></h1>
      <p class="hand cyc">for being so <span class="cw" id="cw">${WORDS[0]}</span></p>
      <p class="sub">${esc(d.f)} threw a little party just for you.</p>
      <div class="stage"><div class="bl">${digits.slice(0, half).map(balloon).join('')}</div>${art.cake(3)}<div class="br">${digits.slice(half).map(balloon).join('')}</div></div>
      <button class="cta" id="openGift">${art.icons.gift}<span>Open my gift</span></button></div>`;

    S[1] = `<div class="env" id="env">${art.envelope}<span class="pull">${art.icons.up}<em>Pull up to read</em></span></div>
      <div class="lsheet" id="lsheet"><span class="grip"></span>
        <div class="lhead"><div><span class="kick">Open the envelope</span><h2 class="h2">A letter for you</h2></div>
        <div class="lbtns"><button data-a="x">${art.icons.down}</button><button data-a="x">${art.icons.x}</button></div></div>
        <div class="lbody"><p class="dear hand">Dear ${esc(d.n)},</p>${paras(d.l)}</div></div>`;

    S[2] = BD.claw.html(d);

    const chapters = d.s;
    S[3] = `<div class="bk-wrap"><span class="kick">Chapter by chapter</span><h2 class="h2">Our story</h2>
      <div class="book" id="book">
        <div class="bk-cover" id="bkCover"><div class="gifts">${art.gift(86)}</div><div class="bk-label"><em class="hand">Once upon a time…</em><b>Our story</b><i>· · · · · ·</i></div></div>
        <div class="bk-page" id="bkPage" hidden><span class="chap hand"></span><div class="txt"></div><span class="tbc hand"></span>
          <button class="pgn prev" hidden>${art.icons.prev}</button><button class="pgn nxt"></button></div>
      </div><p class="tap">Tap the book to open it</p></div>`;

    S[4] = `<div class="head"><span class="kick">Make a wish</span><h2 class="h2">Wishes for your new year</h2></div>
      <div class="jar" id="jar">${art.jar}</div>
      <div class="notes" id="notes"></div>
      <div class="wbar"><button class="pillbtn red" id="wishBtn">✦ <span>Make a wish</span></button></div>`;

    S[5] = `<div class="head"><span class="kick">Say cheese!</span><h2 class="h2">Our moments</h2></div>
      <div class="booth"><div class="sign"><span>Photo booth</span></div>
        <div class="awn"></div>
        <div class="bbody"><div class="bscreen"><div class="curtain l"></div><div class="curtain r"></div>${art.camera}<div class="plabel">Your photos will print here</div></div>
          <div class="dots4"><i></i><i></i><i></i><i></i></div><div class="bslot"></div>
          <div class="side l"><i></i><i></i><i></i></div><button class="side r" id="printBtn" title="Print photos">${art.heart('#d81b60', 20)}</button></div>
        <div class="strip" id="strip"></div></div>
      <p class="tap" id="boothTip">${d.ph.length ? 'Tap the heart to print your photos' : 'Photos coming soon'}</p>
      <div class="lightbox" id="lb" hidden><button class="lbx">${art.icons.x}</button><img alt=""><p class="hand"></p><div class="lbn"><button data-d="-1">${art.icons.prev}</button><button data-d="1">${art.icons.next}</button></div></div>`;

    S[6] = `<div class="mapbox">${art.map}</div>
      <div class="psheet"><span class="grip"></span><span class="kick">Where we have been</span><h2 class="h2">Our places</h2>
        <ol class="places">${d.pl.map((p, i) => `<li data-i="${i}"><b>${i + 1}</b><span>${esc(p)}</span></li>`).join('')}</ol></div>`;

    S[7] = `<div class="cal"><div class="ring l"></div><div class="ring r"></div><div class="heartst">${art.heart('#e0245e', 34)}</div>
        <div class="paper"><small>${esc(when.toLocaleDateString('en', { weekday: 'long' }))}</small>
        <b class="dn">${when.getDate()}</b><span class="mo">${esc(when.toLocaleDateString('en', { month: 'long' }))}</span><span class="yr">${when.getFullYear()}</span></div></div>
      <div class="dsheet"><span class="kick">Mark the calendar</span><h2 class="h2">A date to keep</h2><p class="hand">${esc(d.dk.cap)}</p></div>`;

    S[8] = `<div class="deck"><div class="record" id="rec">${art.vinyl}<button class="hbtn" id="songHeart" title="Play">${art.heart('#e0245e', 34)}</button></div>
        <div class="arm" id="arm"><i class="piv"></i><i class="bar"></i><i class="hd"></i></div><span class="tdot"></span></div>
      <div class="ssheet"><span class="kick">Press play</span><h2 class="h2">Our song</h2>
        <p class="stitle">${esc(d.so.title || '')}</p>
        <div class="srow"><button class="playb" id="playB">${art.icons.play}</button><span class="sstat" id="sstat">Tap the heart to play on YouTube</span></div></div>`;

    S[9] = BD.candles.html(d);

    S[10] = `<div class="fin"><div class="bl big">${balloon(digits.join(''))}</div>
      <span class="kick">Wish made</span><h1 class="hb">Happy birthday,<br><span class="nm">${esc(d.n)}!</span></h1>
      <p class="hand with">With all my love,<br>${esc(d.f)}</p>
      <div class="ico8">${ICONS.map(i => `<i>${i}</i>`).join('')}</div>
      <button class="pillbtn" id="again">${art.icons.replay}<span>Watch again</span></button></div>`;

    const dots = Array.from({ length: 10 }, () => '<i></i>').join('');
    app.innerHTML = `<div class="phone" id="phone">
      ${Array.from({ length: 11 }, (_, i) => `<div class="bg bg${i}"></div>`).join('')}
      ${art.logo}
      ${S.map((h, i) => `<section class="scene s${i}${i === 0 ? ' intro-s' : ''}" data-i="${i}">${h}</section>`).join('')}
      <nav class="nav off"><button class="nbtn prev">${art.icons.prev}</button>
        <div class="nmid"><div class="nlabel"><span class="nl"></span><small class="nc"></small></div><div class="dots">${dots}</div></div>
        <button class="nbtn next">${art.icons.next}</button></nav></div>`;

    const phone = $('#phone'), scenes = $$('.scene', phone), bgs = $$('.bg', phone);
    const nav = $('.nav', phone);
    let cur = 0;
    const hooks = {};

    function go(i) {
      i = Math.max(0, Math.min(10, i));
      scenes.forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('before', k < i); });
      bgs.forEach((b, k) => b.classList.toggle('on', k === i));
      nav.classList.toggle('off', i === 0);
      $('.nl', nav).textContent = i ? NAMES[i - 1] : '';
      $('.nc', nav).textContent = i ? `${i}/10` : '';
      $$('.dots i', nav).forEach((x, k) => { x.className = k + 1 < i ? 'done' : k + 1 === i ? 'cur' : ''; });
      $('.prev', nav).disabled = false;
      $('.next', nav).disabled = i === 10;
      phone.dataset.step = i;
      const prev = cur; cur = i;
      if (hooks.leave[prev]) hooks.leave[prev]();
      if (hooks.enter[i]) hooks.enter[i]();
    }
    $('.prev', nav).onclick = () => go(cur - 1);
    $('.next', nav).onclick = () => go(cur + 1);
    hooks.enter = {}; hooks.leave = {};

    /* ---- 0 intro ---- */
    let wi = 0; const cw = $('#cw');
    setInterval(() => { cw.classList.add('swap'); setTimeout(() => { wi = (wi + 1) % WORDS.length; cw.textContent = WORDS[wi]; cw.classList.remove('swap'); }, 350); }, 2600);
    $('#openGift').onclick = () => { BD.confetti(scenes[0], 30); setTimeout(() => go(1), 350); };
    hooks.enter[0] = () => BD.confetti(scenes[0], 22);

    /* ---- 1 letter ---- */
    const sheet = $('#lsheet'), env = $('#env');
    const openL = () => { sheet.classList.add('open'); env.classList.add('opened'); };
    const closeL = () => { sheet.classList.remove('open'); env.classList.remove('opened'); };
    $$('[data-a="x"]', sheet).forEach(b => b.onclick = closeL);
    let sy = 0;
    env.addEventListener('pointerdown', e => { sy = e.clientY; });
    env.addEventListener('pointerup', e => { if (sy - e.clientY > 25 || Math.abs(sy - e.clientY) < 8) openL(); });
    hooks.enter[1] = () => setTimeout(() => cur === 1 && openL(), 650);

    /* ---- 2 claw ---- */
    BD.claw.init(scenes[2], d);

    /* ---- 3 book ---- */
    {
      const cover = $('#bkCover'), page = $('#bkPage'), book = $('#book');
      let ci = 0;
      const nxt = $('.nxt', page), prv = $('.prev', page);
      function show() {
        const t = chapters[ci], last = ci === chapters.length - 1;
        $('.chap', page).textContent = 'Chapter ' + roman(ci + 1);
        const ps = String(t).split(/\n+/).filter(Boolean);
        $('.txt', page).innerHTML = ps.map((p, k) => k ? `<p>${esc(p)}</p>` : `<p><span class="drop">${esc(p[0])}</span>${esc(p.slice(1))}</p>`).join('');
        $('.txt', page).scrollTop = 0;
        $('.tbc', page).innerHTML = last ? 'The end ' + art.heart('#e0245e', 14) : 'To be continued… ' + art.heart('#e0245e', 14);
        nxt.innerHTML = last ? '↺' : roman(ci + 2).toLowerCase();
        prv.hidden = ci === 0;
        page.classList.remove('flip'); void page.offsetWidth; page.classList.add('flip');
      }
      cover.onclick = () => { cover.hidden = true; page.hidden = false; $('.tap', scenes[3]).hidden = true; ci = 0; show(); };
      nxt.onclick = () => { if (ci < chapters.length - 1) { ci++; show(); } else { page.hidden = true; cover.hidden = false; $('.tap', scenes[3]).hidden = false; } };
      prv.onclick = () => { ci--; show(); };
    }

    /* ---- 4 wish jar ---- */
    {
      const g = $('#jarStars'); let sh = '';
      for (let i = 0; i < 30; i++) {
        const x = 46 + Math.random() * 128, y = 96 + Math.random() * 118, s = .5 + Math.random() * .8;
        sh += `<path class="tw" style="animation-delay:${(Math.random() * 2).toFixed(2)}s" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})" d="M0-9l2.600 6 6.400.6-4.800 4.300 1.500 6.300L0 4.600-5.700 8.200l1.500-6.300-4.800-4.300 6.400-.6z" fill="${['#ffd36e', '#ffb3cf', '#fff0a8', '#ffc4a8'][i % 4]}"/>`;
      }
      g.innerHTML = sh;
      const notes = $('#notes'), btn = $('#wishBtn'), jar = $('#jar');
      let n = 0;
      function burst() {
        jar.classList.remove('shake'); void jar.offsetWidth; jar.classList.add('shake');
        for (let i = 0; i < 16; i++) {
          const s = document.createElement('i'); s.className = 'spark'; s.textContent = '★';
          s.style.cssText = `--dx:${(Math.random() - .5) * 220}px;--dy:${-80 - Math.random() * 160}px;color:${['#ffd36e', '#ff8fb1', '#fff'][i % 3]};animation-delay:${Math.random() * .25}s`;
          jar.appendChild(s); setTimeout(() => s.remove(), 1800);
        }
      }
      btn.onclick = () => {
        burst();
        if (n < d.w.length) {
          const c = document.createElement('div'); c.className = 'note'; c.textContent = d.w[n];
          notes.appendChild(c); notes.scrollTop = notes.scrollHeight; n++;
          if (n >= d.w.length) $('span', btn).textContent = 'Make a wish again';
        }
      };
    }

    /* ---- 5 photo booth ---- */
    {
      const strip = $('#strip'), lb = $('#lb'), btn = $('#printBtn'); let li = 0, printed = false;
      const showLb = i => { li = (i + d.ph.length) % d.ph.length; $('img', lb).src = d.ph[li].src; $('p', lb).textContent = d.ph[li].cap || ''; lb.hidden = false; };
      btn.onclick = () => {
        if (!d.ph.length || printed) { if (printed) showLb(0); return; }
        printed = true; $('#boothTip').textContent = 'Tap the photos to see them bigger';
        strip.innerHTML = d.ph.map((p, i) => `<img src="${p.src}" style="animation-delay:${i * .35}s" data-i="${i}" alt="">`).join('');
        strip.classList.add('out'); BD.confetti(scenes[5], 18);
      };
      strip.addEventListener('click', e => { const i = e.target.dataset.i; if (i != null) showLb(+i); });
      $('.lbx', lb).onclick = () => lb.hidden = true;
      $$('.lbn button', lb).forEach(b => b.onclick = () => showLb(li + +b.dataset.d));
      lb.addEventListener('click', e => { if (e.target === lb) lb.hidden = true; });
    }

    /* ---- 6 places ---- */
    {
      const svg = $('.map-svg', scenes[6]), route = $('#route', svg), pin = $('#pin', svg), dotsG = $('#mapDots', svg);
      const L = route.getTotalLength(), n = d.pl.length, pts = [];
      for (let i = 0; i < n; i++) { const p = route.getPointAtLength(n === 1 ? L * .5 : L * i / (n - 1)); pts.push(p); }
      dotsG.innerHTML = pts.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#fff" stroke="#e0245e" stroke-width="2.5"/>`).join('');
      const sel = i => {
        pin.style.transform = `translate(${pts[i].x}px,${pts[i].y}px)`;
        $$('.places li', scenes[6]).forEach((li, k) => li.classList.toggle('sel', k === i));
      };
      $$('.places li', scenes[6]).forEach(li => li.onclick = () => sel(+li.dataset.i));
      sel(0);
    }

    /* ---- 8 song: heart or play opens the YouTube link in a new tab ---- */
    {
      const id = BD.ytId(d.so.url), url = 'https://www.youtube.com/watch?v=' + id;
      const rec = $('#rec'), arm = $('#arm'), stat = $('#sstat');
      const play = () => {
        window.open(url, '_blank', 'noopener');
        rec.classList.add('spin'); arm.classList.add('on'); stat.textContent = 'Playing on YouTube';
      };
      $('#songHeart').onclick = play; $('#playB').onclick = play;
    }

    /* ---- 9 candles ---- */
    const cd = BD.candles.init(scenes[9], d, () => { BD.confetti(scenes[9], 20); setTimeout(() => cur === 9 && go(10), 2200); });
    hooks.leave[9] = () => cd.stop();

    /* ---- 10 finale ---- */
    hooks.enter[10] = () => BD.confetti(scenes[10], 50);
    $('#again').onclick = () => location.reload();

    BD.go = go;
    go(0);
  };
})();
