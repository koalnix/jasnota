/* ==========================================================================
   Jasnota — home: the film
   I silence · II manifesto · III three voices · IV 7/8 · V about · VI song ·
   VII journal · VIII coda. GSAP 3.12.5 + ScrollTrigger; Lenis comes from the
   shell (window.Jasnota). Degrades to a static page without motion or libs.
   ========================================================================== */
(() => {
  'use strict';

  const J = window.Jasnota;
  if (!J) return;
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const outCubic = (t) => 1 - Math.pow(1 - t, 3);
  const outQuart = (t) => 1 - Math.pow(1 - t, 4);

  const MOTION = J.MOTION && !!(window.gsap && window.ScrollTrigger && J.lenis);
  if (!MOTION) { root.classList.remove('motion'); return; }

  const lenis = J.lenis;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ------------------------------------------------------------------ sound: off by default, never autoplays.
     A tuning-fork-like A440, plus very soft 7/8 ticks while the bar plays. */
  const Sound = (() => {
    const btn = $('.sound');
    const label = $('.sound__label');
    let on = false, gain = null;
    const bus = () => {
      const ctx = J.Audio.ensure();
      if (!ctx) return null;
      if (!gain) { gain = ctx.createGain(); gain.gain.value = 0; gain.connect(J.Audio.out); }
      return ctx;
    };
    function fork(freq = 440) { if (on && gain) J.Audio.fork(freq, 0.16, 0, gain); }
    function tick(accent) {
      if (!on || !gain) return;
      const ctx = J.Audio.ctx;
      J.Audio.note(accent ? 1318.5 : 987.8, accent ? 0.05 : 0.022, ctx.currentTime + 0.01, accent ? 0.22 : 0.12, gain, 'triangle');
    }
    const renderLabel = () => { label.textContent = J.t(on ? 'snd_on' : 'snd_off'); };
    btn.addEventListener('click', () => {
      const ctx = bus();
      if (!ctx) return;
      on = !on;
      btn.setAttribute('aria-pressed', String(on));
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.08);
      renderLabel();
      if (on) fork();
    });
    J.onLang(renderLabel);
    return { fork, tick };
  })();

  /* Each pinned scene: section is tall, .stage is sticky. render(p, enter):
     enter = 0→1 while the section rises into view, p = 0→1 while the stage is held. */
  function pinnedScene(sel, render) {
    const el = $(sel);
    const sc = { el, p: 0, enter: 0, render };
    const update = (s) => {
      const vh = innerHeight;
      const y = s.scroll() - s.start;
      sc.enter = clamp(y / vh);
      sc.p = clamp((y - vh) / Math.max(1, s.end - s.start - vh));
      render(sc.p, sc.enter);
    };
    ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom bottom', onUpdate: update, onRefresh: update });
    return sc;
  }
  const fadeIO = (enter, p, outStart = 0.94) => range(enter, 0.38, 1) * (1 - range(p, outStart, 1));
  const setOp = (el, v) => { const s = v.toFixed(3); if (el._op !== s) { el._op = s; el.style.opacity = s; } };

  /* ------------------------------------------------------------------ I. silence */
  (() => {
    const stage = $('.opening .stage');
    const canvas = $('.opening__canvas');
    const c = canvas.getContext('2d');
    const mark = $('.opening__mark');
    const lockup = $('.opening__lockup');
    const hint = $('.opening__hint');
    const wms = $$('.wm').map((wm) => $$('.wm-g', wm).map((g) => $$('span', g)));
    const alt = $('.opening__alt');
    const line = $('.opening__line');
    const brand = $('.hdr__brand');
    const st = { p: 0, amp: 0, intro: 0, hint: 0, plucked: false, visible: true, last: performance.now() / 1000 };
    let W = 0, H = 0, dpr = 1, mCx = 0, mCy = 0, mH = 0;

    function measure() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth; H = stage.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      const sr = stage.getBoundingClientRect(), mr = mark.getBoundingClientRect();
      mCx = mr.left - sr.left + mr.width / 2; mCy = mr.top - sr.top + mr.height / 2; mH = mr.height;
    }

    function draw() {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - st.last);
      st.last = now;
      if (!st.visible) return;
      const p = st.p;
      if (hint) setOp(hint, st.hint * (1 - range(p, 0, 0.035)));
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, W, H);

      const A = inOut(range(p, 0.035, 0.24));   // point → string
      const D = inOut(range(p, 0.5, 0.64));     // string → the stem of the mark
      const E = range(p, 0.61, 0.7);            // hand over to the real mark
      const alpha = st.intro * (1 - E);
      if (alpha <= 0.002) return;

      const cx = lerp(W / 2, mCx, D), cy = lerp(H / 2, mCy, D);
      let half = lerp(0, Math.min(W * 0.4, 600), A);
      half = lerp(half, mH * 0.44, D);
      const ang = lerp(0, Math.PI / 2, D);

      // the string sings when plucked, and keeps singing while you scroll
      const vib = range(p, 0.2, 0.25) * (1 - range(p, 0.44, 0.53));
      if (p > 0.245 && !st.plucked) { st.plucked = true; st.amp = Math.max(st.amp, 1); Sound.fork(); }
      if (p < 0.2) st.plucked = false;
      st.amp = Math.min(1.25, st.amp + Math.min(Math.abs(lenis.velocity) * 0.01, 0.07) * vib);
      st.amp *= Math.pow(0.42, dt);
      const ampPx = st.amp * vib * Math.min(H * 0.085, 64);

      c.save();
      c.translate(cx, cy);
      c.rotate(ang);
      const pointness = 1 - A;
      if (pointness > 0.01) {
        const breath = 1 + Math.sin(now * 1.6) * 0.12;
        const r = 30 * breath;
        const g = c.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, `rgba(236,232,225,${0.28 * pointness * alpha})`);
        g.addColorStop(1, 'rgba(236,232,225,0)');
        c.fillStyle = g;
        c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
        c.fillStyle = `rgba(246,244,239,${alpha})`;
        c.beginPath(); c.arc(0, 0, 1.2 + 1.5 * pointness, 0, Math.PI * 2); c.fill();
      }
      if (half > 1.5) {
        const N = 120;
        const phase0 = now * Math.PI * 2 * 4.6;
        const copies = ampPx > 0.6 ? 6 : 1;
        for (let k = 0; k < copies; k++) {
          const ph = phase0 + (k * Math.PI * 2) / copies;
          c.beginPath();
          for (let i = 0; i <= N; i++) {
            const u = i / N;
            const x = -half + u * 2 * half;
            const y = ampPx * Math.sin(Math.PI * u) * Math.sin(ph) + ampPx * 0.22 * Math.sin(Math.PI * 2 * u) * Math.sin(ph * 2.01 + 0.7);
            if (i) c.lineTo(x, y); else c.moveTo(x, y);
          }
          c.strokeStyle = `rgba(236,232,225,${(k === 0 ? 0.95 : 0.14) * alpha})`;
          c.lineWidth = k === 0 ? 1.15 : 1;
          if (k === 0) { c.shadowColor = 'rgba(236,232,225,0.55)'; c.shadowBlur = 10; }
          c.stroke();
          c.shadowBlur = 0;
        }
        const ends = range(A, 0.6, 1) * (1 - D);
        if (ends > 0.01) {
          c.fillStyle = `rgba(236,232,225,${0.8 * ends * alpha})`;
          c.fillRect(-half - 1, -5, 1, 10);
          c.fillRect(half, -5, 1, 10);
        }
      }
      c.restore();
    }

    function render(p) {
      st.p = p;
      // the mark opens from its stem outward
      const m = outCubic(range(p, 0.6, 0.71));
      setOp(mark, m > 0 ? 1 : 0);
      mark.style.clipPath = `inset(0 ${(50 * (1 - m)).toFixed(2)}% 0 ${(50 * (1 - m)).toFixed(2)}%)`;
      // ja · sn · ota — the wordmark arrives in 2 + 2 + 3, in whichever script you read
      const e = 0.021, s0 = 0.665;
      wms.forEach((groups) => groups.forEach((g, gi) => {
        const start = s0 + gi * 2 * e;
        g.forEach((l, li) => {
          const v = range(p, start + li * e * 0.3, start + li * e * 0.3 + e * 2.2);
          setOp(l, v);
          l.style.transform = `translate3d(0, ${((1 - outQuart(v)) * 0.32).toFixed(3)}em, 0)`;
        });
      }));
      setOp(alt, range(p, s0 + 7 * e, s0 + 10 * e));
      setOp(line, range(p, s0 + 8.5 * e, s0 + 11.5 * e));
      setOp(brand, range(p, 0.86, 0.93));
      const out = range(p, 0.955, 1);
      setOp(lockup, 1 - out);
      lockup.style.transform = `scale(${(1 - out * 0.035).toFixed(4)})`;
    }

    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    ScrollTrigger.create({ trigger: '.opening', start: 'top bottom', end: 'bottom top', onToggle: (s) => { st.visible = s.isActive; } });
    gsap.ticker.add(draw);
    // the point of light: handed over from the preloader, or faded up on arrival
    let started = false;
    const start = (dur, delay) => {
      if (started) return; started = true;
      gsap.to(st, { intro: 1, duration: dur, delay, ease: 'power2.inOut' });
      gsap.to(st, { hint: 1, duration: 1.6, delay: delay + dur * 0.9, ease: 'power1.out' });
    };
    J.handoff(() => start(0.5, 0));
    J.ready.then((from) => start(from === 'arrive' ? 1.4 : 2.6, from === 'arrive' ? 0 : 0.25));
    return pinnedScene('.opening', render);
  })();

  /* ------------------------------------------------------------------ II. manifesto */
  (() => {
    const stage = $('.manifest .stage');
    const s1 = $('.stanza--1'), s2 = $('.stanza--2');
    const words = (s) => $$('.mline', s).flatMap((l) => l._words || []);
    function light(ws, q) {
      const n = ws.length, spread = 1.8;
      ws.forEach((w, i) => {
        const v = clamp((q * (n + spread) - i) / spread);
        const key = v.toFixed(3);
        if (w._v === key) return;
        w._v = key;
        w.style.opacity = (0.1 + 0.9 * v).toFixed(3);
        w.style.transform = `translate3d(0, ${((1 - outCubic(v)) * 0.09).toFixed(3)}em, 0)`;
      });
    }
    pinnedScene('.manifest', (p, enter) => {
      setOp(stage, fadeIO(enter, p));
      light(words(s1), range(p, 0.02, 0.44));
      const o1 = range(p, 0.47, 0.55);
      setOp(s1, 1 - o1);
      s1.style.transform = `translate3d(0, ${(-o1 * innerHeight * 0.05).toFixed(1)}px, 0)`;
      const i2 = range(p, 0.53, 0.6);
      setOp(s2, i2);
      s2.style.transform = `translate3d(0, ${((1 - outCubic(i2)) * innerHeight * 0.04).toFixed(1)}px, 0)`;
      light(words(s2), range(p, 0.58, 0.87));
    });
  })();

  /* ------------------------------------------------------------------ III. three voices */
  (() => {
    const section = $('.voices');
    const stage = $('.voices .stage');
    const track = $('.voices__track');
    const panels = $$('.panel', track);
    const nums = panels.map((pn) => $('.movement__num', pn));
    const bodies = panels.map((pn) => $('.movement__body', pn) || pn.firstElementChild);
    const score = $('.voices__score');
    const svg = $('.voices__svg');
    const wave = $('.voices__wave');
    const staffG = $('.voices__staff');
    const tip = $('.voices__tip');
    const NS = 'http://www.w3.org/2000/svg';
    let vw = 0, trackW = 0, dist = 0, H = 120, ys = [], step = 3;

    const defs = document.createElementNS(NS, 'defs');
    const cp = document.createElementNS(NS, 'clipPath');
    cp.setAttribute('id', 'wave-clip');
    const cr = document.createElementNS(NS, 'rect');
    cr.setAttribute('x', '0'); cr.setAttribute('y', '-400'); cr.setAttribute('height', '1000'); cr.setAttribute('width', '0');
    cp.appendChild(cr); defs.appendChild(cp); svg.prepend(defs);
    wave.setAttribute('clip-path', 'url(#wave-clip)');

    // one function per movement: silence → breath → tone → 2+2+3
    function F(k, x) {
      const A = H * 0.2;
      if (k <= 0) return 0;
      if (k === 1) return A * 0.85 * Math.sin((2 * Math.PI * x) / (vw * 0.24)) * (0.55 + 0.45 * Math.sin((2 * Math.PI * x) / (vw * 0.95)));
      if (k === 2) { const l = Math.max(18, vw * 0.05); return A * (Math.sin((2 * Math.PI * x) / l) * 0.8 + Math.sin((4 * Math.PI * x) / l + 1) * 0.22); }
      const bar = vw * 0.3, b = ((x % bar) / bar) * 7;
      let gi, g0, gl;
      if (b < 2) { gi = 0; g0 = 0; gl = 2; } else if (b < 4) { gi = 1; g0 = 2; gl = 2; } else { gi = 2; g0 = 4; gl = 3; }
      const local = (b - g0) / gl;
      const barNo = Math.floor(x / bar);
      const amp = [1, 0.62, 0.86][gi] * (0.8 + 0.2 * Math.sin(barNo * 1.7));
      return -A * 1.05 * amp * Math.sin(Math.PI * local) * (gi === 1 ? -0.8 : 1) + Math.sin(x * 0.09) * 1.2;
    }
    function build() {
      vw = root.clientWidth;
      trackW = panels.length * vw;
      dist = Math.max(0, trackW - vw);
      H = score.clientHeight || 120;
      svg.setAttribute('viewBox', `0 0 ${trackW} ${H}`);
      svg.setAttribute('width', trackW);
      staffG.textContent = '';
      const gap = Math.round(H * 0.11);
      for (let i = -2; i <= 2; i++) {
        const ln = document.createElementNS(NS, 'line');
        const y = H / 2 + i * gap;
        ln.setAttribute('x1', 0); ln.setAttribute('x2', trackW);
        ln.setAttribute('y1', y); ln.setAttribute('y2', y);
        staffG.appendChild(ln);
      }
      step = vw < 700 ? 2 : 3;
      ys = [];
      let d = '';
      for (let x = 0; x <= trackW; x += step) {
        const u = x / vw;
        const k = Math.floor(u), f = u - k;
        const tBlend = inOut(range(f, 0.82, 1));
        const y = H / 2 + lerp(F(k, x), F(k + 1, x), tBlend);
        ys.push(y);
        d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
      }
      wave.setAttribute('d', d);
    }
    ScrollTrigger.addEventListener('refreshInit', () => {
      root.style.setProperty('--vw', root.clientWidth / 100 + 'px');
      section.style.height = '';
      const w = root.clientWidth;
      const d = Math.max(0, (panels.length - 1) * w);
      section.style.height = Math.round(innerHeight * 1.2 + d * 1.1) + 'px';
    });
    ScrollTrigger.addEventListener('refresh', build);
    build();

    pinnedScene('.voices', (p, enter) => {
      setOp(stage, fadeIO(enter, p, 0.95));
      const q = range(p, 0.02, 0.92);
      const x = -q * dist;
      track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
      const tipX = clamp(-x + vw * (0.5 + 0.44 * q), 0, trackW);
      cr.setAttribute('width', tipX.toFixed(1));
      const y = ys[Math.min(ys.length - 1, Math.round(tipX / step))] || H / 2;
      tip.style.transform = `translate3d(${tipX.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      panels.forEach((pn, k) => {
        const left = k * vw + x;
        const d = left / vw;
        if (nums[k]) nums[k].style.transform = `translate3d(${(-left * 0.32).toFixed(1)}px, 0, 0)`;
        if (bodies[k] && k > 0) {
          setOp(bodies[k], 1 - clamp(Math.abs(d) * 1.25 - 0.12) * 0.88);
          bodies[k].style.transform = `translate3d(${(left * 0.08).toFixed(1)}px, 0, 0)`;
        }
      });
    });
  })();

  /* ------------------------------------------------------------------ IV. 7/8 */
  (() => {
    const stage = $('.meter .stage');
    const beats = $$('.beat');
    const num = $('.meter__num'), den = $('.meter__den');
    const h = $('.meter__h'), para = $('.meter__p');
    const SLOTS = [7, 9, 11, 14, 16, 18];   // accents of bars 2 and 3: 1 · 3 · 5
    let last = -1, lastWords = null;
    const timers = new WeakMap();
    function hit(i) {
      const b = beats[i];
      b.classList.add('hit');
      clearTimeout(timers.get(b));
      timers.set(b, setTimeout(() => b.classList.remove('hit'), 110));
    }
    function arrivals(beat) {
      num.classList.toggle('on', beat >= 0);
      den.classList.toggle('on', beat >= 2);
      (h._words || []).forEach((w, i) => w.classList.toggle('on', beat >= SLOTS[Math.min(i, SLOTS.length - 1)]));
      para.classList.toggle('on', beat >= 19);
    }
    pinnedScene('.meter', (p, enter) => {
      setOp(stage, fadeIO(enter, p, 0.95));
      const bp = range(p, 0.03, 0.9);
      const beat = bp <= 0 ? -1 : Math.min(20, Math.floor(bp * 21));
      if (beat !== last || h._words !== lastWords) {
        if (beat >= 0 && beat !== last) {
          hit(beat % 7);
          if (beat > last) Sound.tick(beat % 7 === 0 || beat % 7 === 2 || beat % 7 === 4);
        }
        arrivals(beat);
        last = beat;
        lastWords = h._words;
      }
    });
  })();

  /* ------------------------------------------------------------------ V. about */
  gsap.fromTo('.portrait__frame',
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top 92%', end: 'top 28%', scrub: true } });
  gsap.fromTo('.portrait__img',
    { yPercent: -7, scale: 1.16 },
    { yPercent: 7, scale: 1, ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.about__h .ln > span',
    { yPercent: 108 },
    { yPercent: 0, ease: 'none', stagger: 0.22, scrollTrigger: { trigger: '.about__h', start: 'top 90%', end: 'top 48%', scrub: true } });
  gsap.fromTo('.about__text > p',
    { opacity: 0 },
    { opacity: 1, ease: 'none', stagger: 0.25, scrollTrigger: { trigger: '.about__lead', start: 'top 92%', end: 'top 40%', scrub: true } });

  /* ------------------------------------------------------------------ VI. song: the block slides in from the right as the heading settles */
  gsap.fromTo('.tease-listen .song',
    { opacity: 0, x: () => innerWidth * 0.06 },
    { opacity: 1, x: 0, ease: 'none', scrollTrigger: { trigger: '.tease-listen', start: 'top 80%', end: 'top 25%', scrub: true } });

  /* ------------------------------------------------------------------ VII. journal */
  gsap.fromTo('.journal__h',
    { xPercent: 7, opacity: 0 },
    { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.journal', start: 'top 85%', end: 'top 25%', scrub: true } });
  $$('.journal .row').forEach((row) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 96%', end: 'top 70%', scrub: true } });
    tl.fromTo(row, { '--ln': 0 }, { '--ln': 1, ease: 'none', duration: 1 }, 0)
      .fromTo($('.row__t', row), { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', ease: 'none', duration: 0.9 }, 0.1)
      .fromTo([$('.row__no', row), $('.row__kind', row), $('.row__dur', row)], { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.5 }, 0.45);
  });

  /* ------------------------------------------------------------------ VIII. coda — the words come together */
  (() => {
    const hEl = $('.coda__h');
    const note = $('.coda__note');
    const update = (s) => {
      const q = s.progress;
      const e = outCubic(q);
      const ws = hEl._words || [];
      const mid = (ws.length - 1) / 2;
      ws.forEach((w, i) => {
        w.style.transform = `translate3d(${((i - mid) * (1 - e) * root.clientWidth * 0.07).toFixed(1)}px, 0, 0)`;
        w.style.opacity = (0.12 + 0.88 * range(q, i * 0.08, 0.6 + i * 0.08)).toFixed(3);
      });
      setOp(note, range(q, 0.65, 1));
    };
    ScrollTrigger.create({ trigger: '.coda', start: 'top 85%', end: 'top 15%', onUpdate: update, onRefresh: update });
  })();

  /* ------------------------------------------------------------------ HUD: timecode, staff, tempo (rests when the footer arrives) */
  (() => {
    const now = $('.tc-now'), fill = $('.hud__fill'), dot = $('.hud__dot'), staff = $('.hud__staff'), tempoEl = $('.tempo');
    const TOTAL = 7 * 60 + 8;
    let staffW = staff.offsetWidth, lastTc = '', tempo = 60, lastTempo = 60;
    const pad = (n) => String(n).padStart(2, '0');
    const draw = (p) => {
      const sec = Math.round(p * TOTAL);
      const tc = pad(Math.floor(sec / 60)) + ':' + pad(sec % 60);
      if (tc !== lastTc) { now.textContent = tc; lastTc = tc; }
      fill.style.transform = `scaleX(${p.toFixed(4)})`;
      dot.style.transform = `translate3d(${(p * staffW).toFixed(1)}px, 0, 0)`;
    };
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => draw(s.progress), onRefresh: (s) => { staffW = staff.offsetWidth; draw(s.progress); } });
    gsap.ticker.add(() => {
      const target = 60 + Math.min(Math.abs(lenis.velocity) * 2.4, 120);
      tempo += (target - tempo) * 0.06;
      const r = Math.round(tempo);
      if (r !== lastTempo) { tempoEl.textContent = r; lastTempo = r; }
    });
    ScrollTrigger.create({ trigger: '.marquee', start: 'top bottom', onToggle: (s) => root.classList.toggle('past-film', s.isActive), end: () => '+=' + document.documentElement.scrollHeight });
    const ftr = $('.ftr');
    if (ftr && 'IntersectionObserver' in window) new IntersectionObserver(([en]) => root.classList.toggle('hud-off', en.isIntersecting)).observe(ftr);
  })();

  /* ------------------------------------------------------------------ language change → re-split (shell) → re-measure */
  J.onLang(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
