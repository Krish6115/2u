/* Candles: blow into the mic, or hold the button, to put them out. */
BD.candles = {
  html(d) {
    return `
    <div class="cake-stage">${BD.art.cake(5, true)}</div>
    <div class="csheet">
      <div class="crow"><span class="kick">Make a wish</span><span class="minis">${'<i></i>'.repeat(5)}</span></div>
      <h2 class="h2">Blow out the candles</h2>
      <div class="cbtns">
        <button class="cb mic">${BD.art.icons.mic}<span>Microphone</span></button>
        <button class="cb hold">${BD.art.icons.hold}<span>Hold</span></button>
      </div>
      <p class="cnote">The microphone only listens for your breath, right here on your device. Nothing is recorded.</p>
    </div>`;
  },

  init(el, d, onDone) {
    const $ = s => el.querySelector(s);
    const flames = [...el.querySelectorAll('.candle')];
    const minis = [...el.querySelectorAll('.minis i')];
    const kick = $('.csheet .kick');
    let out = 0, raf = 0, stream = null, actx = null, holdT = 0, holding = false;

    function snuff(n) {
      while (out < n && out < flames.length) {
        flames[out].classList.add('out'); minis[out].classList.add('off'); out++;
      }
      if (out >= flames.length) finish();
    }
    function finish() {
      if (el.classList.contains('done')) return;
      el.classList.add('done'); kick.textContent = 'Wish made';
      $('.mic').disabled = $('.hold').disabled = true;
      stopMic(); cancelAnimationFrame(raf);
      document.querySelector('.phone').classList.add('dark');
      onDone && onDone();
    }
    function stopMic() {
      stream && stream.getTracks().forEach(t => t.stop()); stream = null;
      actx && actx.close().catch(() => { }); actx = null;
      $('.mic').classList.remove('live'); $('.mic span').textContent = 'Microphone';
    }

    /* mic: detect sustained loud air noise */
    $('.mic').addEventListener('click', async () => {
      if (stream) { stopMic(); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      } catch {
        $('.cnote').textContent = 'Microphone is not available here (it needs https and your permission). Use Hold instead.';
        return;
      }
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const an = actx.createAnalyser(); an.fftSize = 1024;
      actx.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      $('.mic').classList.add('live'); $('.mic span').textContent = 'Blow now…';
      let base = 0, n = 0, blow = 0, last = performance.now();
      (function tick(now) {
        raf = requestAnimationFrame(tick);
        const dt = (now - last) / 1000; last = now;
        an.getFloatTimeDomainData(buf);
        let s = 0; for (const v of buf) s += v * v;
        const rms = Math.sqrt(s / buf.length);
        if (n < 25) { base = Math.max(base, rms); n++; return; } /* ~0.4s ambient calibration */
        const thr = Math.max(.07, base * 3 + .03);
        blow = rms > thr ? blow + dt : Math.max(0, blow - dt * .5);
        flames.forEach((f, i) => f.style.setProperty('--wob', Math.min(1, rms / thr)));
        snuff(Math.floor(blow / .22));
      })(performance.now());
    });

    /* hold: keep pressing for ~1.6s */
    const startHold = e => {
      e.preventDefault(); if (holding || el.classList.contains('done')) return;
      holding = true; const t0 = performance.now(); $('.hold').classList.add('live');
      (function tick() {
        if (!holding) return;
        const p = (performance.now() - t0) / 1600;
        snuff(Math.floor(p * flames.length));
        if (p < 1) holdT = requestAnimationFrame(tick);
      })();
    };
    const endHold = () => { holding = false; cancelAnimationFrame(holdT); $('.hold').classList.remove('live'); };
    const h = $('.hold');
    h.addEventListener('pointerdown', startHold);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => h.addEventListener(ev, endHold));
    h.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') startHold(e); });
    h.addEventListener('keyup', endHold);

    return {
      reset() {
        out = 0; flames.forEach(f => f.classList.remove('out')); minis.forEach(m => m.classList.remove('off'));
        el.classList.remove('done'); kick.textContent = 'Make a wish';
        $('.mic').disabled = $('.hold').disabled = false;
        document.querySelector('.phone').classList.remove('dark');
      },
      stop: stopMic
    };
  }
};
