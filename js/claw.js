/* Claw machine: joystick moves the claw left/right, GRAB drops it. Catch each glowing capsule and drop it in the chute. */
BD.claw = {
  html(d) {
    const { esc, art } = { esc: BD.esc, art: BD.art };
    return `
    <div class="head claw-head"><div class="ctitle"><h2 class="h2">What I love about you</h2>
      <button class="rbtn on" data-v="game" title="Game">${art.icons.pad}</button>
      <button class="rbtn" data-v="list" title="Reasons found">${art.icons.list}</button></div></div>
    <div class="claw-wrap">
      <div class="machine">
        ${BD.claw.roof()}
        <div class="m-body">
          <div class="m-post l"></div><div class="m-post r"></div>
          <div class="m-glass">
            <div class="neon"><svg viewBox="0 0 64 58"><path d="M32 54C6 36 6 12 20 8c6-1.500 11 2 12 8 1-6 6-9.500 12-8 14 4 14 28-12 46z" fill="none" stroke="#ff5c93" stroke-width="3" stroke-linejoin="round"/></svg></div>
            <canvas class="cv" width="780" height="600"></canvas>
            <div class="pop" hidden><span class="pheart">♥</span><p></p>${art.gift(46)}</div>
            <div class="reasons" hidden><h3>Reasons I love you</h3><ol></ol></div>
          </div>
        </div>
        ${BD.claw.base()}
      </div>
      <div class="panel">
        <div class="pad"><i class="ar u">▲</i><i class="ar d">▼</i><i class="ar l">◀</i><i class="ar r">▶</i><b class="knob"></b></div>
        <div class="stat"><span class="sh">♥</span><div><b class="cnt">0 of ${d.p.length} found</b><small class="last">Move the joystick, then press GRAB.</small></div></div>
        <button class="grab">GRAB</button>
      </div>
    </div>`;
  },

  roof() {
    let bulbs = '';
    for (let i = 0; i < 15; i++) {
      const t = i / 14, x = 24 + t * 312, y = 70 - 54 * Math.pow(Math.sin(Math.PI * t), .75);
      bulbs += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#fff6c8" filter="url(#bg)" class="bulb" style="animation-delay:${(i % 3) * .4}s"/>`;
    }
    return `<svg class="m-roof" viewBox="0 0 360 100"><defs>
      <linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a6f6"/><stop offset="1" stop-color="#9b72de"/></linearGradient>
      <filter id="bg" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <path d="M4 100V66Q4 16 62 10Q180-6 298 10Q356 16 356 66V100Z" fill="url(#rf)"/>
      <path d="M20 60Q22 24 70 18Q180 4 290 18" stroke="#fff" stroke-opacity=".35" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="0" y="84" width="360" height="16" rx="8" fill="#b08ae8"/><rect x="0" y="84" width="360" height="5" rx="2.500" fill="#d9c2fa"/>
      ${bulbs}
      <rect x="86" y="38" width="188" height="36" rx="18" fill="#fff0f5" stroke="#fff" stroke-width="3"/><rect x="86" y="38" width="188" height="36" rx="18" fill="none" stroke="#f3b6cc" stroke-width="1.500"/>
      <text x="180" y="63" text-anchor="middle" font-family="Playfair Display,serif" font-style="italic" font-weight="800" font-size="20" fill="#c2185b">♥ Love prizes ♥</text></svg>`;
  },
  base() {
    return `<svg class="m-base" viewBox="0 0 360 84"><defs>
      <pattern id="st" width="14" height="10" patternUnits="userSpaceOnUse"><rect width="7" height="10" fill="#f6b0c9"/><rect x="7" width="7" height="10" fill="#fac8d9"/></pattern></defs>
      <path d="M2 30H358V70Q358 82 344 82H16Q2 82 2 70Z" fill="url(#st)"/>
      <rect x="0" y="4" width="360" height="30" rx="12" fill="#fdecd9"/><rect x="0" y="4" width="360" height="9" rx="4" fill="#fff6ea"/>
      <ellipse cx="66" cy="22" rx="17" ry="6.500" fill="#7a4a9a"/><rect x="62.500" y="-12" width="7" height="34" fill="#b58ad6"/>
      <circle cx="66" cy="-14" r="11" fill="#e0245e"/><circle cx="62" cy="-18" r="3.500" fill="#fff" opacity=".7"/>
      <ellipse cx="236" cy="22" rx="22" ry="8" fill="#fff"/><ellipse cx="236" cy="19" rx="16" ry="6.500" fill="#ef3f72"/><ellipse cx="236" cy="17" rx="9" ry="3" fill="#ff9ab8"/>
      <rect x="286" y="40" width="54" height="30" rx="5" fill="#fff4f8" stroke="#7a4a9a" stroke-width="5"/>
      <rect x="40" y="48" width="5" height="22" rx="2.500" fill="#fff" opacity=".8"/></svg>`;
  },

  init(el, d) {
    const $ = s => el.querySelector(s);
    const cv = $('.cv'), ctx = cv.getContext('2d');
    ctx.scale(3, 3);
    const W = 260, H = 200, HOLE = 214, HOME = 60, REACH = 128, TOP = 34;
    const msgs = d.p, total = msgs.length;
    let cx = HOME, cy = TOP, open = 0, dir = 0, busy = false, found = 0, order = msgs.map((_, i) => i).sort(() => Math.random() - .5);
    let prize = null, carried = false, falling = null, popT = 0;

    /* cached ball pile */
    const pile = document.createElement('canvas'); pile.width = 780; pile.height = 600;
    (() => {
      const p = pile.getContext('2d'); p.scale(3, 3);
      const cols = ['#f8a0c0', '#ffd98a', '#9fe0cc', '#c4a8f2', '#ffb09a', '#96ccf0', '#fff0f5', '#f6b8d8'];
      let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
      const balls = [];
      for (let i = 0; i < 120; i++) balls.push([rnd() * W, 152 + rnd() * 52, 8 + rnd() * 4, cols[(rnd() * cols.length) | 0]]);
      balls.sort((a, b) => a[1] - b[1]).forEach(([x, y, r, c]) => {
        p.fillStyle = 'rgba(120,50,110,.18)'; p.beginPath(); p.ellipse(x + 1, y + r * .7, r, r * .45, 0, 0, 7); p.fill();
        const g = p.createRadialGradient(x - r / 3, y - r / 3, 1, x, y, r);
        g.addColorStop(0, '#fff'); g.addColorStop(.3, c); g.addColorStop(1, c);
        p.fillStyle = g; p.beginPath(); p.arc(x, y, r, 0, 7); p.fill();
        p.fillStyle = 'rgba(255,255,255,.75)'; p.beginPath(); p.ellipse(x - r / 3, y - r / 2.4, r / 4, r / 6, -.6, 0, 7); p.fill();
      });
    })();

    function spawn() {
      if (found >= total) { prize = null; return; }
      let x; do { x = 28 + Math.random() * 130; } while (Math.abs(x - cx) < 34);
      prize = { x, y: 146, i: order[found] };
    }
    spawn();

    function capsule(x, y, r, a = 1) {
      ctx.save(); ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(x - r / 3, y - r / 3, 1, x, y, r);
      g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#d5f5e8'); g.addColorStop(1, '#9fdcc4');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#f06292'; ctx.font = `${r}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('♥', x, y + 1);
      ctx.restore();
    }

    function drawClaw() {
      ctx.strokeStyle = '#d9c7ee'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, cy); ctx.stroke();
      const off = 20 - open * 15;
      ctx.lineCap = 'round';
      [-1, 1].forEach(sg => {
        ctx.strokeStyle = '#b9a4d6'; ctx.lineWidth = 3.4;
        ctx.beginPath(); ctx.moveTo(cx + sg * 8, cy + 8);
        ctx.quadraticCurveTo(cx + sg * (off + 6), cy + 18, cx + sg * off * .8, cy + 34); ctx.stroke();
        ctx.strokeStyle = '#f3a7c4'; ctx.lineWidth = 3.4;
        ctx.beginPath(); ctx.moveTo(cx + sg * off * .8, cy + 30); ctx.lineTo(cx + sg * (off * .8 - sg * 3), cy + 37); ctx.stroke();
      });
      const g = ctx.createLinearGradient(cx - 11, cy, cx + 11, cy);
      g.addColorStop(0, '#f48fb1'); g.addColorStop(.5, '#ffc6da'); g.addColorStop(1, '#e16d98');
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(cx - 11, cy - 2, 22, 14, 6); ctx.fill();
    }

    let last = 0;
    function frame(t) {
      requestAnimationFrame(frame);
      const dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
      if (!el.classList.contains('on')) return;
      ctx.clearRect(0, 0, W, H);
      /* rail */
      ctx.fillStyle = 'rgba(167,132,214,.35)'; ctx.fillRect(8, 8, W - 16, 5);
      ctx.drawImage(pile, 0, 0, W, H);
      /* chute ring */
      ctx.fillStyle = 'rgba(90,40,100,.6)'; ctx.beginPath(); ctx.ellipse(HOLE, 156, 24, 7, 0, 0, 7); ctx.fill();
      ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.ellipse(HOLE, 156, 26, 8, 0, 0, 7); ctx.stroke();
      ctx.strokeStyle = '#f48fb1'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.ellipse(HOLE, 156, 26, 8, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      if (dir && !busy) cx = Math.max(14, Math.min(W - 14, cx + dir * 95 * dt));
      if (prize && !carried && !falling) {
        const pulse = 1 + Math.sin(t / 220) * .06;
        ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(prize.x, prize.y, 19 * pulse, 0, 7); ctx.fill();
        capsule(prize.x, prize.y, 13);
      }
      if (carried && prize) capsule(cx, cy + 32, 12);
      if (falling) capsule(HOLE, falling.y, 12, falling.a);
      drawClaw();
    }
    requestAnimationFrame(frame);

    /* ---- controls ---- */
    const knob = $('.knob'), pad = $('.pad');
    let lastX = 0, t0 = 0;
    function stick(e) {
      const r = pad.getBoundingClientRect();
      let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; }
      knob.style.transform = `translate(${x * 16}px,${y * 16}px)`;
      lastX = x;
      dir = Math.abs(x) > .12 ? Math.sign(x) : 0;
    }
    let dragging = false;
    const rel = () => { dragging = false; dir = 0; knob.style.transform = ''; };
    pad.addEventListener('pointerdown', e => {
      dragging = true; t0 = performance.now();
      try { pad.setPointerCapture(e.pointerId); } catch { /* window listeners still track it */ }
      stick(e);
    });
    addEventListener('pointermove', e => { if (dragging) stick(e); });
    addEventListener('pointerup', () => {
      if (!dragging) return;
      /* a quick click nudges the claw a little so a plain click always does something */
      if (performance.now() - t0 < 250 && !busy && Math.abs(lastX) > .12) cx = Math.max(14, Math.min(W - 14, cx + Math.sign(lastX) * 18));
      rel();
    });
    addEventListener('pointercancel', () => { if (dragging) rel(); });
    addEventListener('blur', rel);
    pad.addEventListener('lostpointercapture', () => { if (dragging) rel(); });
    const keys = new Set();
    addEventListener('keydown', e => {
      if (!el.classList.contains('on')) return;
      if (e.key === 'ArrowLeft') { dir = -1; knob.style.transform = 'translate(-14px,0)'; }
      if (e.key === 'ArrowRight') { dir = 1; knob.style.transform = 'translate(14px,0)'; }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); grab(); }
    });
    addEventListener('keyup', e => { if (e.key.startsWith('Arrow')) rel(); });

    const setStat = (a, b) => { $('.cnt').textContent = a; $('.last').textContent = b; };
    function showPop(txt) {
      const p = $('.pop'); p.querySelector('p').textContent = txt; p.hidden = false;
      p.classList.remove('in'); void p.offsetWidth; p.classList.add('in');
      clearTimeout(popT); popT = setTimeout(() => p.hidden = true, 3600);
    }
    $('.pop').onclick = () => { $('.pop').hidden = true; };

    async function grab() {
      if (busy || found >= total) return;
      busy = true; $('.pop').hidden = true;
      await BD.tween(cy, REACH, 850, v => cy = v);
      await BD.tween(open, 1, 420, v => open = v);
      const hit = prize && Math.abs(prize.x - cx) < 17;
      if (hit) carried = true;
      await BD.tween(cy, TOP, 850, v => cy = v);
      await BD.tween(cx, HOLE, 800, v => cx = v);
      await BD.tween(open, 0, 300, v => open = v);
      if (hit) {
        carried = false; falling = { y: cy + 32, a: 1 };
        const i = prize.i; prize = null;
        await BD.tween(falling.y, 164, 420, v => falling.y = v, t => t * t);
        await BD.tween(1, 0, 260, v => falling.a = v);
        falling = null; found++;
        showPop(msgs[i]);
        setStat(found >= total ? 'You found every reason!' : `${found} of ${total} found`, msgs[i]);
        renderList();
        if (found >= total) { BD.confetti(el, 40); } else spawn();
      } else {
        setStat(`${found} of ${total} found`, 'So close! Line up with the glowing capsule.');
      }
      await BD.tween(cx, HOME, 700, v => cx = v);
      busy = false;
    }
    $('.grab').addEventListener('click', grab);

    /* ---- reasons list ---- */
    const got = [];
    function renderList() {
      got.length = 0;
      order.slice(0, found).forEach(i => got.push(msgs[i]));
      $('.reasons ol').innerHTML = got.map(m => `<li>${BD.esc(m)}</li>`).join('') || '<li class="none">Nothing yet. Grab a capsule!</li>';
    }
    renderList();
    el.querySelectorAll('.rbtn').forEach(b => b.onclick = () => {
      el.querySelectorAll('.rbtn').forEach(x => x.classList.toggle('on', x === b));
      $('.reasons').hidden = b.dataset.v !== 'list';
    });
  }
};
