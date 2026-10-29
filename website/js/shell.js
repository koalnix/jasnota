/* ==========================================================================
   Jasnota — shared shell
   Language (Macedonian in HTML, English from js/i18n.js and data-en), smooth
   scroll (Lenis), page transitions + first-visit preloader (the "veil"),
   custom cursor, magnetic elements, the pillars disclosure, scroll scrubbers
   (split words, wipes, dips, footer wordmark), marquee, hover previews for
   lists, reading progress, newsletter form. Filters/search: js/library.js.
   Motion only when <html class="motion"> (set in <head> unless reduced motion
   or ?static). Everything is readable without JS.
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const outQuart = (t) => 1 - Math.pow(1 - t, 4);
  const outCubic = (t) => 1 - Math.pow(1 - t, 3);
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (s) => { s = Math.max(0, Math.round(s)); return pad(Math.floor(s / 60)) + ':' + pad(s % 60); };
  const parseDur = (v) => { if (!v) return 0; const m = String(v).match(/(\d+):(\d+)/); if (m) return +m[1] * 60 + +m[2]; const n = parseFloat(v); return isFinite(n) ? n * 60 : 0; };

  const SCRIPT = document.currentScript;
  const ROOT = new URL('../', SCRIPT ? SCRIPT.src : location.href).href;   // site root (…/website/)
  const STATIC = /[?&]static\b/.test(location.search);
  const MOTION = root.classList.contains('motion');
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);   // canvases: sharp on retina, never 3x
  const E_FILM = 'cubic-bezier(0.65, 0, 0.35, 1)';
  const E_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
  root.setAttribute('data-booted', '');

  // --vw excludes the scrollbar; only rewritten when the width really changes (the iOS toolbar resizes height only)
  let lastVW = -1;
  const setVW = () => { const w = root.clientWidth; if (w !== lastVW) { lastVW = w; root.style.setProperty('--vw', w / 100 + 'px'); } };
  setVW();
  window.addEventListener('resize', setVW);
  // iOS only applies :active (the touch feedback on rows and buttons) when a touch listener exists
  if (TOUCH) document.addEventListener('touchstart', () => {}, { passive: true });

  /* ================================================================== split words
     Splits an element into word spans, keeping inline markup (<em>, .accent).
     The visual copy is aria-hidden; a visually hidden plain copy is read instead. */
  function splitWords(el) {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const tmp = document.createElement('div');
    tmp.innerHTML = el.innerHTML;
    const out = document.createDocumentFragment();
    const words = [];
    let last = null;
    const visit = (node, wrap) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { out.appendChild(document.createTextNode(' ')); last = null; return; }
            const piece = wrap(document.createTextNode(tok));
            if (last) { last.appendChild(piece); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.appendChild(piece);
            out.appendChild(w);
            words.push(w);
            last = w;
          });
        } else if (n.nodeType === 1) {
          if (n.tagName === 'BR') { out.appendChild(document.createElement('br')); last = null; return; }
          visit(n, (inner) => { const c = n.cloneNode(false); c.appendChild(inner); return wrap(c); });
        }
      });
    };
    visit(tmp, (x) => x);
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    const vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    vis.appendChild(out);
    el.textContent = '';
    el.append(sr, vis);
    el._words = words;
    el.classList.add('is-split');
    return words;
  }

  /* ================================================================== i18n
     Macedonian is the source in the HTML (works without JS). English comes from:
       data-i18n="key"            → JASNOTA_I18N.en[key] (interface strings)
       data-i18n-attr="attr:key"  → the same, for attributes
       data-en="…"                → inline English for page copy (generated pages, static prose)
       data-en-content / data-en-label / data-en-placeholder → inline English for those attributes
       data-lang-block="mk|en"    → whole blocks per language; data-lang-fallback keeps the Macedonian
                                    block visible in English when a piece has no English version yet */
  const DICT = window.JASNOTA_I18N || { mk: {}, en: {} };
  const EN = DICT.en || {};
  const MK = Object.assign({}, DICT.mk || {});
  const i18nNodes = $$('[data-i18n]');
  const attrNodes = $$('[data-i18n-attr]');
  const enNodes = $$('[data-en]');
  const enAttrNodes = $$('[data-en-content], [data-en-label], [data-en-placeholder]');
  const splitNodes = $$('[data-split]');
  const blocks = $$('[data-lang-block]');
  const src = (n) => (n.tagName === 'TITLE' ? n.textContent : n.innerHTML.trim());
  i18nNodes.forEach((n) => { MK[n.dataset.i18n] = src(n); });
  attrNodes.forEach((n) => n.dataset.i18nAttr.split(';').forEach((pair) => {
    const [a, k] = pair.split(':');
    if (!(k in MK)) MK[k] = n.getAttribute(a) || '';
  }));
  enNodes.forEach((n) => { n._mk = src(n); });
  const EN_ATTRS = [['enContent', 'content'], ['enLabel', 'aria-label'], ['enPlaceholder', 'placeholder']];
  enAttrNodes.forEach((n) => { n._mkAttr = {}; EN_ATTRS.forEach(([d, a]) => { if (d in n.dataset) n._mkAttr[a] = n.getAttribute(a); }); });
  splitNodes.forEach((n) => { if (!n.hasAttribute('data-i18n') && !n.hasAttribute('data-en')) n._src = n.innerHTML; });

  let lang = root.lang === 'en' ? 'en' : 'mk';
  const t = (k) => (lang === 'en' ? EN[k] ?? MK[k] : MK[k] ?? EN[k]) ?? '';
  const langListeners = [];

  function setHTML(n, v) {
    if (n.tagName === 'TITLE') { if (document.title !== v) document.title = v; return; }
    if (n.innerHTML !== v) n.innerHTML = v;
  }

  function renderLang() {
    root.lang = lang;
    i18nNodes.forEach((n) => { const v = t(n.dataset.i18n); if (v !== '') setHTML(n, v); });
    attrNodes.forEach((n) => n.dataset.i18nAttr.split(';').forEach((pair) => {
      const [a, k] = pair.split(':');
      const v = t(k);
      if (v !== '') n.setAttribute(a, v);
    }));
    enNodes.forEach((n) => setHTML(n, lang === 'en' ? n.dataset.en : n._mk));
    enAttrNodes.forEach((n) => EN_ATTRS.forEach(([d, a]) => {
      if (d in n.dataset) n.setAttribute(a, lang === 'en' ? n.dataset[d] : n._mkAttr[a]);
    }));
    blocks.forEach((b) => { b.hidden = b.dataset.langBlock !== lang && !('langFallback' in b.dataset); });
    splitNodes.forEach((n) => {
      if (n._src !== undefined) n.innerHTML = n._src;
      splitWords(n);
    });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    langListeners.forEach((fn) => fn(lang));
    document.dispatchEvent(new CustomEvent('jasnota:lang', { detail: { lang } }));
  }

  function setLang(l, animate = true) {
    if (l === lang) return;
    try { localStorage.setItem('jasnota-lang', l); } catch (e) { /* storage blocked */ }
    if (!animate || !MOTION) { lang = l; renderLang(); return; }
    // a short dip: the page breathes out, changes language, breathes in
    const els = [$('main'), $('.ftr'), $('.hdr')].filter(Boolean);
    const outs = els.map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: E_FILM, fill: 'forwards' }));
    Promise.all(outs.map((a) => a.finished.catch(() => {}))).then(() => {
      // bilingual articles change length: keep the reader at the same point of the text
      const max0 = document.documentElement.scrollHeight - innerHeight;
      const ratio = blocks.length && max0 > 0 ? window.scrollY / max0 : -1;
      lang = l;
      renderLang();
      if (ratio >= 0) {
        const y = ratio * (document.documentElement.scrollHeight - innerHeight);
        if (lenis) { lenis.resize(); lenis.scrollTo(y, { immediate: true, force: true }); } else window.scrollTo(0, y);
      }
      els.forEach((el, i) => {
        const a = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 620, easing: E_OUT, fill: 'forwards' });
        a.finished.then(() => { a.cancel(); outs[i].cancel(); }, () => {});
      });
    });
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  renderLang();
  root.classList.remove('i18n-wait');

  /* ?static previews the reduced-motion site: keep it while browsing */
  if (STATIC) $$('a[href]').forEach((a) => {
    const u = new URL(a.href, location.href);
    if (u.origin === location.origin && u.href.startsWith(ROOT) && !u.searchParams.has('static')) { u.searchParams.set('static', ''); a.href = u.href.replace('static=', 'static'); }
  });

  /* ================================================================== frame loop + smooth scroll */
  const frameFns = [];
  const onFrame = (fn) => frameFns.push(fn);
  let lenis = null;
  let lastY = window.scrollY, vel = 0;
  if (MOTION && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
  }
  function frame(time) {
    if (lenis) lenis.raf(time);
    const y = window.scrollY;
    vel = lenis ? lenis.velocity : (y - lastY);
    lastY = y;
    for (let i = 0; i < frameFns.length; i++) frameFns[i](time, y);
  }
  if (window.gsap) {
    gsap.ticker.add((s) => frame(s * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const loop = (t) => { frame(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  const scrollToEl = (target, immediate) => {
    if (lenis) lenis.scrollTo(target, { duration: immediate ? 0 : 2.2, immediate: !!immediate, offset: target === 0 ? 0 : -24, easing: (x) => (x < 0.5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2) });
    else if (target === 0) window.scrollTo(0, 0);
    else target.scrollIntoView({ block: 'start' });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented) return;
    const u = new URL(a.href, location.href);
    if (u.pathname !== location.pathname || !u.hash) return;
    const target = u.hash === '#top' ? 0 : document.getElementById(decodeURIComponent(u.hash.slice(1)));
    if (target === null) return;
    if (a.classList.contains('skip')) { if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } return; }
    e.preventDefault();
    closeMenu();
    scrollToEl(target);
  });

  /* ================================================================== header: hides while you read down, returns when you scroll up */
  (() => {
    let prev = window.scrollY, acc = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY, d = y - prev;
      prev = y;
      if (!MOTION || root.classList.contains('menu-open')) return;
      acc = Math.sign(d) === Math.sign(acc) ? acc + d : d;
      if (y < 160) root.classList.remove('hdr-hidden');
      else if (acc > 40) root.classList.add('hdr-hidden');
      else if (acc < -24) root.classList.remove('hdr-hidden');
    }, { passive: true });
  })();

  /* ================================================================== mobile menu */
  let viaKeys = false;
  document.addEventListener('keydown', () => { viaKeys = true; }, true);
  document.addEventListener('pointerdown', () => { viaKeys = false; }, true);
  const menu = $('#menu');
  const menuBtn = $('.hdr__menu');
  let menuTimer = 0;
  function openMenu() {
    if (!menu) return;
    clearTimeout(menuTimer);
    menu.hidden = false;
    root.classList.add('menu-open');
    root.classList.remove('hdr-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    $('span', menuBtn).textContent = t('menu_close');
    if (lenis) lenis.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    // focus moves into the menu for keyboard users; a tap doesn't leave a focus ring on "Home"
    const first = $('a', menu);
    if (first && viaKeys) setTimeout(() => first.focus({ preventScroll: true }), MOTION ? 300 : 0);
  }
  function closeMenu(returnFocus) {
    if (!menu || menu.hidden) return;
    menu.classList.remove('is-open');
    root.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    $('span', menuBtn).textContent = t('menu_open');
    if (lenis) lenis.start();
    menuTimer = setTimeout(() => { menu.hidden = true; }, MOTION ? 900 : 0);
    if (returnFocus) menuBtn.focus();
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', () => (menu.hidden || !menu.classList.contains('is-open') && MOTION ? openMenu() : closeMenu()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(true); });
    langListeners.push(() => { $('span', menuBtn).textContent = t(root.classList.contains('menu-open') ? 'menu_close' : 'menu_open'); });
  }

  /* ================================================================== header: the three pillars (a small disclosure) */
  $$('.drop').forEach((drop) => {
    const btn = $('.drop__btn', drop), panel = $('.drop__panel', drop);
    let timer = 0, hoverAt = 0;
    const set = (open) => {
      clearTimeout(timer);
      if (open === (btn.getAttribute('aria-expanded') === 'true')) return;
      btn.setAttribute('aria-expanded', String(open));
      if (open) { panel.hidden = false; requestAnimationFrame(() => drop.classList.add('is-open')); }
      else { drop.classList.remove('is-open'); timer = setTimeout(() => { panel.hidden = true; }, MOTION ? 450 : 0); }
    };
    btn.addEventListener('click', () => { if (performance.now() - hoverAt > 700) set(btn.getAttribute('aria-expanded') !== 'true'); });
    if (FINE) {
      drop.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { if (btn.getAttribute('aria-expanded') !== 'true') hoverAt = performance.now(); set(true); } });
      drop.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') timer = setTimeout(() => set(false), 220); });
    }
    document.addEventListener('click', (e) => { if (!drop.contains(e.target)) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
    drop.addEventListener('focusout', (e) => { if (!drop.contains(e.relatedTarget)) set(false); });
    window.addEventListener('scroll', () => { if (root.classList.contains('hdr-hidden')) set(false); }, { passive: true });
  });

  /* ================================================================== veil: page transitions + first-visit preloader */
  const veil = $('.veil');
  const V = veil && {
    lines: $$('.veil__lines i', veil),
    bands: $$('.veil__bands i', veil),
    mark: $('.veil__mark', veil),
    paths: $$('.veil__mark path', veil),
    to: $('.veil__to', veil),
    point: $('.veil__point', veil),
    tc: $('.veil__tc', veil),
    tcNow: $('.veil__tc b', veil),
  };
  const anims = [];
  const play = (el, kf, opt) => { const a = el.animate(kf, Object.assign({ fill: 'forwards' }, opt)); anims.push(a); return a; };
  const clearVeil = () => {
    anims.splice(0).forEach((a) => a.cancel());
    veil.classList.remove('is-on');
    root.classList.remove('is-arriving', 'is-first');
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const fontsReady = (max) => Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(max)]);

  function destLabel(url) {
    const rel = url.href.startsWith(ROOT) ? url.pathname.slice(new URL(ROOT).pathname.length) : '';
    const seg = rel.split('/')[0];
    const key = {
      '': 'nav_home', 'index.html': 'nav_home', articles: 'nav_articles', concepts: 'nav_concepts', myths: 'nav_myths',
      sources: 'nav_sources', map: 'nav_map', method: 'nav_method', about: 'nav_about', contact: 'nav_contact',
      'psychology-of-music': 'p1', musicians: 'p2', 'what-science-says': 'p3',
    }[seg];
    return key ? t(key) : '';
  }

  let leaving = false;
  function leave(url) {
    if (leaving) return;
    leaving = true;
    try { sessionStorage.setItem('jasnota-go', '1'); } catch (e) { /* ignore */ }
    if (lenis) lenis.stop();
    closeMenu();
    anims.splice(0).forEach((a) => a.cancel());
    veil.classList.add('is-on');
    V.to.textContent = '→ ' + destLabel(url);
    V.lines.forEach((l, i) => {
      play(l, [{ transform: 'scaleX(0)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 1 }], { duration: 300, delay: i * 32, easing: E_FILM });
      play(l, [{ opacity: 1 }, { opacity: 0.16 }], { duration: 300, delay: 470, easing: 'linear', composite: 'replace' });
    });
    V.bands.forEach((b, i) => play(b, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 380, delay: 150 + i * 26, easing: E_FILM }));
    play(V.mark, [{ opacity: 0 }, { opacity: 1 }], { duration: 10, delay: 380 });
    V.paths.forEach((p, i) => play(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 300, delay: 380 + i * 50, easing: E_OUT }));
    play(V.to, [{ opacity: 0, transform: 'translate(-50%, 4px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 300, delay: 470, easing: E_OUT });
    setTimeout(() => { location.href = url.href; }, 720);
    setTimeout(() => { leaving = false; }, 2500);
  }

  function enter() {
    // arriving: the veil is already black with the mark drawn (CSS, before first paint)
    veil.classList.add('is-on');
    root.classList.remove('is-arriving');
    V.bands.forEach((b) => { b.style.transform = 'none'; });
    V.mark.style.opacity = 1; V.paths.forEach((p) => { p.style.strokeDashoffset = 0; });
    V.lines.forEach((l) => { l.style.transform = 'none'; l.style.opacity = 0.16; });
    play(V.mark, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px) scale(0.96)' }], { duration: 300, easing: E_FILM });
    const order = [2, 1, 3, 0, 4];   // open from the middle line outward
    let end;
    V.bands.forEach((b, i) => {
      const d = Math.abs(i - 2);
      end = play(b, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { duration: 460, delay: 120 + d * 60, easing: E_FILM });
    });
    V.lines.forEach((l, i) => play(l, [{ transform: 'scaleX(1)', transformOrigin: '100% 50%', opacity: 0.4 }, { transform: 'scaleX(0)', transformOrigin: '100% 50%', opacity: 0.4 }], { duration: 420, delay: 160 + order.indexOf(i) * 40, easing: E_FILM }));
    const done = () => {
      V.bands.forEach((b) => { b.style.transform = ''; });
      V.lines.forEach((l) => { l.style.transform = ''; l.style.opacity = ''; });
      V.mark.style.opacity = ''; V.paths.forEach((p) => { p.style.strokeDashoffset = ''; });
    };
    // a cancelled animation (leaving again mid-way) rejects `finished`: that is fine
    return end.finished.then(() => { done(); clearVeil(); }, done);
  }

  function preloader(handoff) {
    // first visit: a point of light, a timecode counting to 07:08; then the point becomes the page
    veil.classList.add('is-on');
    const t0 = performance.now(), DUR = 1700, TOTAL = 7 * 60 + 8;
    const count = new Promise((res) => {
      const step = (now) => {
        const p = clamp((now - t0) / DUR);
        V.tcNow.textContent = fmt(outCubic(p) * TOTAL);
        if (p < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
    return Promise.all([count, fontsReady(2600)]).then(() => {
      try { sessionStorage.setItem('jasnota-seen', '1'); } catch (e) { /* ignore */ }
      root.classList.remove('is-first');
      V.point.style.opacity = 1; V.tc.style.opacity = 1;
      V.bands.forEach((b) => { b.style.transform = 'none'; });
      play(V.tc, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: E_FILM });
      if (handoff) {
        // home: the canvas underneath draws the same point in the same place
        handoff();
        V.bands.forEach((b) => play(b, [{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 150, easing: E_FILM }));
        return play(V.point, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 700, easing: 'linear' }).finished;
      }
      // elsewhere: the point stretches into a string, then the staff opens
      const mid = V.lines[2];
      play(V.point, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 120 });
      play(mid, [{ transform: 'scaleX(0)', transformOrigin: '50% 50%', opacity: 0.9 }, { transform: 'scaleX(1)', transformOrigin: '50% 50%', opacity: 0.9 }], { duration: 560, easing: E_FILM });
      let end;
      V.bands.forEach((b, i) => { end = play(b, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { duration: 560, delay: 480 + Math.abs(i - 2) * 70, easing: E_FILM }); });
      play(mid, [{ opacity: 0.9 }, { opacity: 0 }], { duration: 500, delay: 700, composite: 'replace' });
      return end.finished;
    }).then(() => {
      V.point.style.opacity = ''; V.tc.style.opacity = '';
      V.bands.forEach((b) => { b.style.transform = ''; });
      clearVeil();
    }, () => { V.point.style.opacity = ''; V.tc.style.opacity = ''; V.bands.forEach((b) => { b.style.transform = ''; }); });
  }

  function isTransitionLink(a, e) {
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download') || a.dataset.noTransition !== undefined) return false;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !/^https?:$/.test(u.protocol)) return false;
    if (!u.href.startsWith(ROOT)) return false;
    if (u.pathname === location.pathname && u.search === location.search) return false;   // same page (hash links scroll)
    return u;
  }
  if (veil && MOTION) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      const u = isTransitionLink(a, e);
      if (!u) return;
      e.preventDefault();
      leave(u);
    });
    window.addEventListener('pageshow', (e) => {
      if (e.persisted && (veil.classList.contains('is-on') || leaving)) { leaving = false; if (lenis) lenis.start(); anims.splice(0).forEach((a) => a.cancel()); enter(); }
    });
  }

  /* ready: resolves when the page is visible (after the preloader or the arriving transition) */
  let readyResolve;
  const ready = new Promise((r) => { readyResolve = r; });
  const handoffs = [];
  function boot() {
    let p, from = 'direct';
    if (veil && root.classList.contains('is-first')) {
      from = 'preloader';
      p = preloader(handoffs.length ? () => handoffs.forEach((f) => f()) : null);
    } else if (veil && root.classList.contains('is-arriving')) {
      from = 'arrive';
      p = fontsReady(450).then(enter);
    } else {
      root.classList.remove('is-first', 'is-arriving');
      p = Promise.resolve();
    }
    // page scripts may register a handoff before the preloader finishes; the reveals start a moment later
    p.then(() => readyResolve(from));
    setTimeout(() => { if (from !== 'direct') document.dispatchEvent(new CustomEvent('jasnota:veil-out')); }, 0);
  }
  // deferred page scripts (home.js) run before DOMContentLoaded: they can register a handoff first
  if (document.readyState === 'loading' || document.readyState === 'interactive') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else setTimeout(boot, 0);

  /* ================================================================== cursor */
  const cursor = $('.cursor');
  if (MOTION && FINE && cursor) {
    root.classList.add('has-cursor');
    const label = $('.cursor__label', cursor);
    let x = -100, y = -100, tx = -100, ty = -100, seen = false, state = '';
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!seen) { x = tx; y = ty; seen = true; cursor.classList.remove('is-hidden'); }
    }, { passive: true });
    onFrame(() => {
      if (!seen) return;
      x += (tx - x) * 0.24; y += (ty - y) * 0.24;
      cursor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    });
    const setState = (s, text) => {
      const key = s + '|' + (text || '');
      if (key === state) return;
      state = key;
      cursor.classList.toggle('is-link', s === 'link');
      cursor.classList.toggle('is-label', s === 'label');
      cursor.classList.toggle('is-hidden', s === 'hidden');
      if (text) label.textContent = text;
    };
    let overEl = null;
    const resolve = () => {
      const el = overEl;
      if (!el) return setState('');
      const c = el.closest('[data-cursor], a, button, input, textarea, select, label, [role="slider"]');
      if (!c) return setState('');
      if (c.matches('input, textarea, select')) return setState('hidden');
      if (c.dataset.cursor) return setState('label', t('cur_' + c.dataset.cursor) || c.dataset.cursor);
      setState('link');
    };
    document.addEventListener('pointerover', (e) => {
      overEl = e.target;
      if (!seen && e.pointerType === 'mouse') { x = tx = e.clientX; y = ty = e.clientY; seen = true; cursor.classList.remove('is-hidden'); }
      resolve();
    });
    document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
    root.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
    root.addEventListener('pointerenter', () => { cursor.classList.remove('is-hidden'); state = ''; resolve(); });
    langListeners.push(() => { state = ''; resolve(); });
    cursor.classList.add('is-hidden');
  }

  /* ================================================================== magnetic */
  const magnets = [];
  function magnetize(el) {
    if (!(MOTION && FINE) || el._mag) return;
    if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
    const kids = el.children;
    const inner = kids.length === 1 && kids[0].tagName !== 'svg' ? kids[0] : null;
    if (inner && getComputedStyle(inner).display === 'inline') inner.style.display = 'inline-block';
    const s = parseFloat(el.dataset.magnetic) || 0.32;
    el._mag = { el, inner, s, x: 0, y: 0, vx: 0, vy: 0, ix: 0, iy: 0, tx: 0, ty: 0, active: false };
    magnets.push(el._mag);
  }
  if (MOTION && FINE) {
    $$('[data-magnetic]').forEach(magnetize);
    let px = -1e4, py = -1e4, moved = false;
    window.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; moved = true; }, { passive: true });
    let idle = 0;
    onFrame(() => {
      if (moved) idle = 0; else idle++;
      if (idle > 90 && magnets.every((m) => !m.active)) return;
      moved = false;
      // read
      for (const m of magnets) {
        const r = m.el.getBoundingClientRect();
        const w = r.width, h = r.height;
        if (r.bottom < -50 || r.top > innerHeight + 50) { m.tx = m.ty = 0; continue; }
        const cx = r.left - m.x + w / 2, cy = r.top - m.y + h / 2;
        const padX = Math.min(48, Math.max(18, w * 0.4)), padY = Math.min(48, Math.max(18, h * 0.6));
        const dx = px - cx, dy = py - cy;
        const inside = Math.abs(dx) < w / 2 + padX && Math.abs(dy) < h / 2 + padY;
        m.tx = inside ? dx * m.s : 0;
        m.ty = inside ? dy * m.s : 0;
      }
      // spring + write
      for (const m of magnets) {
        m.vx = (m.vx + (m.tx - m.x) * 0.14) * 0.74;
        m.vy = (m.vy + (m.ty - m.y) * 0.14) * 0.74;
        m.x += m.vx; m.y += m.vy;
        const still = Math.abs(m.x) < 0.05 && Math.abs(m.y) < 0.05 && Math.abs(m.vx) < 0.05 && !m.tx;
        if (still && !m.active) continue;
        m.active = !still;
        if (still) { m.x = m.y = m.vx = m.vy = 0; }
        m.el.style.transform = still ? '' : `translate3d(${m.x.toFixed(2)}px, ${m.y.toFixed(2)}px, 0)`;
        if (m.inner) m.inner.style.transform = still ? '' : `translate3d(${(m.x * 0.45).toFixed(2)}px, ${(m.y * 0.45).toFixed(2)}px, 0)`;
      }
    });
  }

  /* ================================================================== scrubbers: progress from element edges vs viewport
     from/to = [edge, fraction of viewport height]; p = 0 when `from` edge sits at that line, 1 when `to` does */
  const scrubbers = [];
  function scrub(el, from, to, fn) {
    const s = { el, from, to, fn, p: -1 };
    scrubbers.push(s);
    return s;
  }
  // two passes: every rect is read first, then every style written, so a frame never forces layout twice
  const due = [];
  function runScrubbers(force) {
    const vh = innerHeight;
    due.length = 0;
    for (const s of scrubbers) {
      const r = s.el.getBoundingClientRect();
      if (!force && (r.bottom < -vh * 0.5 || r.top > vh * 1.5) && s.p >= 0) continue;
      const e1 = r[s.from[0]], e2 = r[s.to[0]];
      const a = vh * s.from[1] - e1, b = (e2 - vh * s.to[1]) - (e1 - vh * s.from[1]);
      const p = clamp(b === 0 ? 0 : a / b);
      if (Math.abs(p - s.p) < 0.0005 && !force) continue;
      s.p = p; s.r = r;
      due.push(s);
    }
    for (let i = 0; i < due.length; i++) due[i].fn(due[i].p, due[i].r);
  }
  let lastScrubY = -1, resizeQ = false;
  if (MOTION) {
    onFrame((t, y) => { if (y !== lastScrubY) { lastScrubY = y; runScrubbers(false); } });
    window.addEventListener('resize', () => {
      if (resizeQ) return;
      resizeQ = true;
      requestAnimationFrame(() => { resizeQ = false; runScrubbers(true); });
    });
    langListeners.push(() => requestAnimationFrame(() => runScrubbers(true)));
  }

  /* split words light up as they cross the reading line (not the home film, which runs its own) */
  if (MOTION) $$('[data-split]:not([data-split="film"])').forEach((el) => {
    scrub(el, ['top', 0.9], ['bottom', 0.5], (p) => {
      const ws = el._words || [];
      const n = ws.length, spread = 2.2;
      ws.forEach((w, i) => {
        const v = clamp((p * (n + spread) - i) / spread);
        w.style.opacity = (0.12 + 0.88 * v).toFixed(3);
      });
    });
  });

  /* wipes: a hairline sweeps across between sections, a timecode rides its tip */
  if (MOTION) $$('[data-wipe]').forEach((el) => {
    const line = $('.wipe__line', el), tc = $('.wipe__tc', el);
    const total = parseDur(el.dataset.wipe) || 0;
    scrub(el, ['top', 0.96], ['top', 0.45], (p) => {
      const e = outCubic(p);
      line.style.transform = `scaleX(${e.toFixed(4)})`;
      if (tc) { tc.style.opacity = p.toFixed(3); if (total) tc.textContent = fmt(e * total); }
    });
  });

  /* dips: a section rises out of black and sinks back into it */
  if (MOTION) $$('[data-dip]').forEach((el) => {
    scrub(el, ['top', 1], ['bottom', 0], (p, r) => {
      const vh = innerHeight;
      const inO = range(vh - r.top, vh * 0.05, vh * 0.55);
      const outO = range(r.bottom, vh * 0.04, vh * 0.42);
      const o = Math.min(inO, outO);
      el.style.opacity = o.toFixed(3);
      // its own compositor layer only while it is actually fading (no repaint of the block every frame)
      const wc = o > 0.001 && o < 0.999 ? 'opacity' : '';
      if (el._wc !== wc) { el._wc = wc; el.style.willChange = wc; }
    });
  });

  /* parallax inside clipped frames */
  if (MOTION) $$('[data-parallax]').forEach((el) => {
    const k = parseFloat(el.dataset.parallax) || 0.08;
    scrub(el.parentElement, ['top', 1], ['bottom', 0], (p) => {
      el.style.transform = `translate3d(0, ${((p - 0.5) * k * 200).toFixed(2)}%, 0) scale(${1 + k})`;
    });
  });

  /* ================================================================== reveals (IntersectionObserver, once) */
  const revealEls = $$('[data-reveal]');
  if (MOTION && 'IntersectionObserver' in window) {
    // a clip-path of inset(100%) has no visible area, so clipped elements are watched through their parent
    const watch = new Map();
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      (watch.get(en.target) || []).forEach((el) => el.classList.add('is-in'));
      io.unobserve(en.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    ready.then(() => revealEls.forEach((el) => {
      const w = el.dataset.reveal === 'clip' ? el.parentElement : el;
      watch.set(w, (watch.get(w) || []).concat(el));
      io.observe(w);
    }));
  } else if (MOTION) root.classList.add('no-reveal');

  /* ================================================================== footer: the wordmark rises in 2 + 2 + 3, and Bitola's clock */
  const word = $('[data-word]');
  if (word) {
    const build = () => {
      const txt = lang === 'mk' ? 'јаснота' : 'jasnota';
      word.textContent = '';
      word.setAttribute('lang', lang);
      [...txt].forEach((ch, i) => { const s = document.createElement('span'); s.textContent = ch; s.dataset.g = i < 2 ? 0 : i < 4 ? 1 : 2; word.appendChild(s); });
      word._letters = $$('span', word);
    };
    build();
    langListeners.push(build);
    if (MOTION) scrub($('.ftr'), ['top', 1], ['bottom', 1], (p) => {
      (word._letters || []).forEach((s, i) => {
        const st = 0.3 + (+s.dataset.g) * 0.12 + i * 0.025;
        const v = outQuart(range(p, st, st + 0.42));
        s.style.transform = `translate3d(0, ${((1 - v) * 105).toFixed(2)}%, 0)`;
      });
    });
  }
  const clocks = $$('[data-clock]');
  if (clocks.length) {
    let f = null;
    try { f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Skopje', hour: '2-digit', minute: '2-digit', hour12: false }); } catch (e) { /* no tz data */ }
    const tick = () => { const s = f ? f.format(new Date()) : 'CET'; clocks.forEach((c) => { c.textContent = s; }); };
    tick();
    if (f) setInterval(tick, 15000);
  }

  /* ================================================================== newsletter (no provider yet: thank-you state only) */
  $$('form.letter').forEach((form) => {
    const msg = $('.letter__msg', form), input = $('input[type="email"]', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = input.value.trim() !== '' && input.checkValidity();
      msg.textContent = t(ok ? 'nl_ok' : 'nl_bad');
      msg.style.color = ok ? '' : 'var(--ash)';
      form.classList.toggle('is-sent', ok);
      if (ok) input.value = '';
    });
  });

  /* ================================================================== hover previews for typographic lists (fine pointers) */
  function previewPath(seed) {
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const f1 = 0.02 + rnd() * 0.05, f2 = 0.08 + rnd() * 0.12, ph = rnd() * 6;
    const kind = seed % 3;
    let d = '';
    for (let x = 0; x <= 280; x += 2) {
      const u = x / 280;
      let env;
      if (kind === 0) env = Math.exp(-u * 3.2);
      else if (kind === 1) env = Math.sin(Math.PI * u) * 0.9;
      else { const b = (u * 7) % 7; env = b < 2 ? 1 - (b % 2) * 0.4 : b < 4 ? 0.8 - ((b - 2) % 2) * 0.4 : 0.9 - ((b - 4) / 3) * 0.6; }
      const y = 75 + env * 52 * (Math.sin(x * f1 + ph) * 0.65 + Math.sin(x * f2) * 0.35);
      d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
    }
    return d;
  }
  const pv = $('.preview');
  if (FINE && pv && $('.index[data-preview]')) {
    root.classList.add('has-preview');
    const pvNo = $('.preview__no', pv), pvX = $('.preview__x', pv), pvPath = $('.preview__svg path', pv);
    let px = 0, py = 0, tx = 0, ty = 0, minX = 0, live = false;
    onFrame(() => {
      if (!live) return;
      const k = MOTION ? 0.14 : 1;
      px += (tx - px) * k; py += (ty - py) * k;
      pv.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
      if (Math.abs(tx - px) + Math.abs(ty - py) < 0.3 && !pv.classList.contains('is-on')) live = false;
    });
    const place = (e) => {
      tx = clamp(Math.max(e.clientX + 40, minX), 16, innerWidth - 316);
      ty = clamp(e.clientY - 150, 70, innerHeight - 300);
      live = true;
    };
    $$('.index[data-preview]').forEach((index) => {
      index.addEventListener('mouseover', (e) => {
        const a = e.target.closest('.row__a');
        if (!a || a === index._cur) return;
        index._cur = a;
        pvNo.textContent = $('.row__no', a).textContent + ' · ' + $('.row__kind', a).textContent;
        pvX.textContent = $('.row__x', a).textContent;
        pvPath.setAttribute('d', previewPath(+($('.row__no', a).textContent) + 2));
        const rg = document.createRange();
        rg.selectNodeContents($('.row__t', a));
        minX = rg.getBoundingClientRect().right + 56;
        if (!pv.classList.contains('is-on')) { place(e); px = tx; py = ty; }
        pv.classList.add('is-on');
      });
      index.addEventListener('mousemove', place);
      index.addEventListener('mouseleave', () => { pv.classList.remove('is-on'); index._cur = null; });
    });
    let lx = -1, ly = -1;
    window.addEventListener('pointermove', (e) => { lx = e.clientX; ly = e.clientY; }, { passive: true });
    window.addEventListener('scroll', () => {
      if (!pv.classList.contains('is-on') || lx < 0) return;
      const el = document.elementFromPoint(lx, ly);
      if (!el || !el.closest('.index[data-preview] .row__a')) { pv.classList.remove('is-on'); $$('.index[data-preview]').forEach((i) => { i._cur = null; }); }
    }, { passive: true });
  }

  /* ================================================================== marquee: drifts on its own, leans and hurries with your scroll */
  $$('.marquee').forEach((mq) => {
    if (!MOTION) return;
    const track = $('.marquee__track', mq);
    const items = $$('.marquee__item', track);
    let x = 0, w = 0, skew = 0, dir = -1, visible = true;
    const measure = () => { w = items[0].getBoundingClientRect().width; };
    measure();
    window.addEventListener('resize', measure);
    langListeners.push(() => requestAnimationFrame(measure));
    if (document.fonts) document.fonts.ready.then(measure);
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; mq.classList.toggle('is-live', visible); }, { rootMargin: '25% 0px' }).observe(mq);
    let last = performance.now();
    onFrame((time) => {
      const dt = Math.min(0.05, (time - last) / 1000); last = time;
      if (!visible || !w) return;
      if (Math.abs(vel) > 0.5) dir = vel > 0 ? -1 : 1;
      const speed = 38 + Math.min(Math.abs(vel) * 26, 1400);
      x += dir * speed * dt;
      if (x <= -w) x += w; else if (x > 0) x -= w;
      skew += (clamp(-vel * 0.35, -9, 9) - skew) * 0.1;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    });
  });

  /* ================================================================== copy buttons */
  $$('[data-copy]').forEach((b) => b.addEventListener('click', () => {
    const done = () => { const s = $('span', b) || b; s.textContent = t('copied'); setTimeout(() => { s.textContent = t('copy'); }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, () => {});
  }));

  /* ================================================================== reading progress (articles): a staff line + timecode */
  const prog = $('.progress');
  if (prog) {
    const line = $('.progress__line i', prog), tc = $('.progress__t', prog);
    const art = $(prog.dataset.for || 'main');
    const total = parseDur(prog.dataset.total) || 240;
    const upd = () => {
      const r = art.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
      line.style.transform = `scaleX(${p.toFixed(4)})`;
      const f = fmt(p * total);
      if (tc.textContent !== f) tc.textContent = f;
      prog.classList.toggle('is-done', p > 0.995);
    };
    let queued = false;
    const q = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; upd(); }); };
    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    langListeners.push(q);
    upd();
  }

  /* ================================================================== public API for page scripts */
  window.Jasnota = {
    t, splitWords, scrub, onFrame, magnetize, ready, MOTION, FINE, TOUCH, DPR, ROOT,
    get lang() { return lang; },
    get lenis() { return lenis; },
    get velocity() { return vel; },
    onLang: (fn) => langListeners.push(fn),
    setLang,
    handoff: (fn) => handoffs.push(fn),
    refresh: () => runScrubbers(true),
  };
  if (document.fonts) document.fonts.ready.then(() => runScrubbers(true));
  window.addEventListener('load', () => runScrubbers(true));
})();
