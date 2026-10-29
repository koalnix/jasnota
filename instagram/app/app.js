/* Јаснота — profile prototype interactions.
   Grid (with optional pins), post view with swipeable carousel and EN/MK captions, reel player that
   plays the on-screen text timeline, story viewer (tap, hold, auto-advance, progress bars), highlights,
   and the “first 3 seconds” stranger’s view. */
(function () {
  'use strict';
  var J = window.J;
  var $ = function (s) { return document.querySelector(s); };
  var scr = $('#scr'), vProfile = $('#vProfile');
  var PINS = ['p02', 'p03', 'p07'];
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state = { pins: false, lang: 'both', storySeen: false };
  var opener = [];   // focus return stack

  function newest() { return J.POSTS.slice().sort(function (a, b) { return b.n - a.n; }).map(function (p) { return p.id; }); }
  function order() {
    var n = newest();
    return state.pins ? PINS.concat(n.filter(function (id) { return PINS.indexOf(id) < 0; })) : n;
  }
  function avatar(cls) { return '<span class="avatar ' + (cls || '') + '">' + J.avatarInner() + '</span>'; }

  /* ---------------- profile ---------------- */
  $('#avInner').innerHTML = J.avatarInner();
  $('#hlRow').innerHTML = J.HIGHLIGHTS.map(function (h) {
    var sign = J.hlSign(h);
    return '<button type="button" class="hl" data-hl="' + h.id + '" aria-label="Highlight: ' + h.label + '"><div class="c"><div class="hlc">' + sign + '</div></div>' + h.label + '</button>';
  }).join('');

  function renderGrid() {
    $('#grid').innerHTML = order().map(function (id, i) {
      var p = J.post(id), pinned = state.pins && PINS.indexOf(id) > -1;
      var ic = pinned ? J.icon('pin', 'gi') : (J.fmtIcon(p) ? J.icon(J.fmtIcon(p), 'gi') : '');
      var label = (pinned ? 'Pinned. ' : '') + 'Post ' + p.n + ': ' + p.title.en + ', ' + J.FORMATS[p.fmt].toLowerCase() + ', ' + J.fmtDate(p.date);
      return '<button type="button" class="tile" data-id="' + id + '" aria-label="' + J.esc(label) + '"' + (i < 3 ? ' data-eye="4"' + (i === 0 ? ' data-eye-first' : '') : '') + '>' +
        J.slide(J.cover(p), '34', 'hide-tags') + ic + '</button>';
    }).join('');
  }
  renderGrid();
  $('#reelsGrid').innerHTML = newest().map(J.post).filter(function (p) { return p.fmt === 'reel'; }).map(function (p) {
    return '<button type="button" class="tile r916" data-id="' + p.id + '" aria-label="' + J.esc('Reel: ' + p.title.en + ', ' + p.reel.length) + '">' + J.slide(p.cover, '916', 'hide-tags') +
      '<span class="dur">' + J.icon('play') + p.reel.length.replace(' s', 's') + '</span></button>';
  }).join('');
  $('#tagged').innerHTML = '<div class="tile" aria-hidden="true">' + J.slide({ html: J.h.ph('stage', 'stage') + '<div class="pc on-photo"><p class="meta push">@chamber_orchestra_diva</p></div>', alt: '' }, '34', 'hide-tags') + '</div>' +
    '<p>Photos of Jasna from Orchestra DIVA’s concerts appear here when the orchestra tags her. Set tags to manual approval, so only ones she chooses are shown.</p>';

  /* tabs */
  var tabs = [['#tabGrid', '#pGrid'], ['#tabReels', '#pReels'], ['#tabTag', '#pTag']];
  tabs.forEach(function (t, i) {
    $(t[0]).addEventListener('click', function () { selectTab(i, true); });
    $(t[0]).addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); selectTab((i + (e.key === 'ArrowRight' ? 1 : 2)) % 3, true); }
    });
  });
  function selectTab(i, focus) {
    tabs.forEach(function (t, k) {
      $(t[0]).setAttribute('aria-selected', k === i ? 'true' : 'false');
      $(t[0]).tabIndex = k === i ? 0 : -1;
      $(t[1]).hidden = k !== i;
    });
    if (focus) $(tabs[i][0]).focus();
  }

  /* ---------------- layers ---------------- */
  function openLayer(el, from) {
    opener.push(from || document.activeElement);
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('in');
    var f = el.querySelector('[data-close], button');
    if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 40);
  }
  function closeLayer(el) {
    if (el.hidden) return;
    el.classList.remove('in');
    var done = function () { el.hidden = true; };
    if (RM) done(); else setTimeout(done, 460);
    var o = opener.pop();
    if (o && o.focus) o.focus({ preventScroll: true });
  }

  /* ---------------- post view ---------------- */
  var car = null, curPost = null;
  function captionHTML(p) {
    var tags = '<span class="tg">' + p.tags.map(function (t) { return '#' + t; }).join(' ') + '</span>';
    var en = J.esc(p.caption.en), mk = '<span lang="mk">' + J.esc(p.caption.mk) + '</span>';
    var body = state.lang === 'en' ? en : state.lang === 'mk' ? mk : en + '\n\n<span class="div78">' + J.DIVIDER + '</span>\n\n' + mk;
    return '<b>jasnota</b>' + (p.collab ? ' <b>' + p.collab + '</b>' : '') + ' ' + body + '\n\n' + tags;
  }
  function openPost(id, from) {
    var p = J.post(id); curPost = p;
    if (p.fmt === 'reel') { openReel(id, from); return; }
    var n = p.slides.length;
    var slides = p.slides.map(function (s) { return J.slide(s, '45'); }).join('');
    $('#pvBody').innerHTML =
      '<div class="pv-head">' + avatar() + '<div class="who"><b>jasnota</b>' + (p.collab ? ' and <b>' + p.collab + '</b>' : '') + (p.location ? '<small>' + p.location + '</small>' : '') + '</div><span class="icon-btn" aria-hidden="true">' + J.icon('dots') + '</span></div>' +
      '<div class="media" id="media" tabindex="0" aria-roledescription="carousel" aria-label="' + J.esc(p.title.en) + (n > 1 ? ', ' + n + ' slides. Use left and right arrows.' : '') + '">' +
        '<div class="track">' + slides + '</div>' +
        (n > 1 ? '<span class="count" aria-live="polite">1/' + n + '</span><button class="arr p" type="button" aria-label="Previous slide" disabled>' + J.icon('back') + '</button><button class="arr n" type="button" aria-label="Next slide">' + J.icon('next') + '</button>' : '') +
      '</div>' +
      '<div class="pv-actions"><span class="l" aria-hidden="true">' + J.icon('heart') + J.icon('comment') + J.icon('send') + '</span><span class="dots" aria-hidden="true">' + (n > 1 ? new Array(n + 1).join('<i></i>') : '') + '</span><span class="r" aria-hidden="true">' + J.icon('save') + '</span></div>' +
      '<div class="pv-cap"><div class="seg" role="group" aria-label="Caption language"><button type="button" data-cl="both">EN + МК</button><button type="button" data-cl="en">EN</button><button type="button" data-cl="mk">МК</button></div>' +
      '<p class="capt clamp" id="capt"></p><button class="more" type="button" id="more">more</button>' +
      '<p class="date">' + J.fmtDate(p.date, 'en', false).slice(4) + ' 2026 · ' + p.time + '</p>' +
      '<p class="alt"><span class="footnote">alt text, slide <span id="altN">1</span>:</span> <span id="altT"></span></p></div>';
    renderCaption(p);
    $('#pvBody').querySelectorAll('[data-cl]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-cl')); renderCaption(p); });
    });
    $('#more').addEventListener('click', function () { $('#capt').classList.remove('clamp'); $('#more').hidden = true; });
    car = carousel($('#media'), n, function (i) { $('#altN').textContent = i + 1; $('#altT').textContent = p.slides[i].alt; });
    $('#pvBody').scrollTop = 0;
    openLayer($('#vPost'), from);
  }
  function renderCaption(p) {
    var c = $('#capt'); if (!c) return;
    c.innerHTML = captionHTML(p);
    document.querySelectorAll('[data-cl]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cl') === state.lang ? 'true' : 'false'); });
  }
  function setLang(l) {
    state.lang = l;
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false'); });
  }

  function carousel(root, n, onChange) {
    var track = root.querySelector('.track'), i = 0, x0 = null, dx = 0, w = 1, moved = false;
    var prev = root.querySelector('.arr.p'), next = root.querySelector('.arr.n'), count = root.querySelector('.count');
    var dots = document.querySelectorAll('.pv-actions .dots i');
    function go(k) {
      i = Math.max(0, Math.min(n - 1, k));
      track.style.transition = '';
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === n - 1;
      if (count) count.textContent = (i + 1) + '/' + n;
      dots.forEach(function (d, k2) { d.classList.toggle('on', k2 === i); });
      if (onChange) onChange(i);
    }
    if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); go(i - 1); });
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); go(i + 1); });
    root.addEventListener('pointerdown', function (e) {
      if (n < 2 || e.target.closest('.arr')) return;
      x0 = e.clientX; dx = 0; moved = false; w = root.clientWidth; track.style.transition = 'none';
      root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove', function (e) {
      if (x0 === null) return;
      dx = e.clientX - x0; if (Math.abs(dx) > 4) moved = true;
      var edge = (i === 0 && dx > 0) || (i === n - 1 && dx < 0) ? 0.3 : 1;
      track.style.transform = 'translateX(calc(' + (-i * 100) + '% + ' + (dx * edge) + 'px))';
    });
    function end() {
      if (x0 === null) return;
      x0 = null;
      if (moved && Math.abs(dx) > w * 0.18) go(i + (dx < 0 ? 1 : -1)); else go(i);
    }
    root.addEventListener('pointerup', end);
    root.addEventListener('pointercancel', end);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    });
    go(0);
    return { go: go, get: function () { return i; } };
  }

  /* ---------------- reel player ---------------- */
  var rp = { p: null, t: 0, last: 0, raf: 0, paused: false, shot: -1, total: 0 };
  function secs(s) { return parseInt(s, 10) || 0; }
  function shotRange(s) { var m = s.t.split(/[–-]/); return [secs(m[0]), secs(m[1])]; }
  function openReel(id, from) {
    var p = J.post(id); rp.p = p; rp.t = 0; rp.shot = -1; rp.paused = false; rp.total = secs(p.reel.length);
    $('#reelUI').innerHTML =
      '<button class="icon-btn back" type="button" data-close aria-label="Back to profile">' + J.icon('back') + '</button><span class="ttl">Reels</span>' +
      '<span class="muted" aria-hidden="true">' + J.icon('sound') + '</span>' +
      '<div class="side" aria-hidden="true">' + J.icon('heart') + J.icon('comment') + J.icon('send') + J.icon('dots') + '</div>' +
      '<div class="bottom"><div class="who">' + avatar() + '<b>jasnota</b>' + (p.collab ? '<span>and <b>' + p.collab + '</b></span>' : '') + '<span class="f">Follow</span></div>' +
      '<p class="cl" style="margin:0">' + J.esc(p.caption.en.split('\n')[0]) + '</p>' +
      '<p class="au" style="margin:0">' + J.icon('music') + J.esc(p.reel.audio.split('.')[0]) + '</p></div>' +
      '<div class="pz" id="pz">' + J.icon('pause') + '</div><div class="prog"><i id="rprog"></i></div>';
    $('#reelUI').querySelector('[data-close]').addEventListener('click', closeReel);
    $('#vReel').setAttribute('aria-label', 'Reel: ' + p.title.en);
    openLayer($('#vReel'), from);
    rp.last = performance.now();
    cancelAnimationFrame(rp.raf);
    rp.raf = requestAnimationFrame(reelLoop);
  }
  function reelLoop(now) {
    var dt = (now - rp.last) / 1000; rp.last = now;
    if (!rp.paused) rp.t += dt;
    if (rp.t >= rp.total) rp.t = 0;
    var shots = rp.p.reel.shots, k = 0;
    for (var i = 0; i < shots.length; i++) { var r = shotRange(shots[i]); if (rp.t >= r[0] && rp.t < r[1]) { k = i; break; } if (rp.t >= r[1]) k = i; }
    if (k !== rp.shot) {
      rp.shot = k;
      $('#reelStage').innerHTML = '<div class="frame-wrap reelplay">' + J.reelFrame(shots[k], rp.p.reel) + '</div>';
    }
    var bar = $('#rprog'); if (bar) bar.style.width = (rp.t / rp.total * 100) + '%';
    rp.raf = requestAnimationFrame(reelLoop);
  }
  function toggleReel() {
    rp.paused = !rp.paused;
    var pz = $('#pz'); if (!pz) return;
    pz.innerHTML = J.icon(rp.paused ? 'pause' : 'play');
    pz.classList.add('on');
    clearTimeout(pz._t); if (!rp.paused) pz._t = setTimeout(function () { pz.classList.remove('on'); }, 600);
  }
  $('#reelTap').addEventListener('click', toggleReel);
  function closeReel() { cancelAnimationFrame(rp.raf); closeLayer($('#vReel')); }

  /* ---------------- story viewer ---------------- */
  var sv = { items: [], i: 0, el: 0, last: 0, raf: 0, paused: false, dur: 5000, held: false, holdT: 0, kind: '' };
  function openStories(items, head, from, kind) {
    sv.items = items; sv.i = 0; sv.kind = kind || '';
    $('#bars').innerHTML = items.map(function () { return '<span><i></i></span>'; }).join('');
    $('#storyHead').innerHTML = head + '<span class="sp"></span><button class="icon-btn" type="button" data-close aria-label="Close stories">' + J.icon('x') + '</button>';
    $('#storyHead').querySelector('[data-close]').addEventListener('click', closeStories);
    openLayer($('#vStory'), from);
    show(0);
  }
  function show(i) {
    sv.i = i; sv.el = 0; sv.paused = false; sv.last = performance.now();
    var it = sv.items[i];
    $('#storyStage').innerHTML = '<div class="frame-wrap">' + J.story(J.frameOf(it)) + '</div>';
    var f = J.frameOf(it);
    var alt = f && f.share ? 'shares the post ' + J.post(f.share).title.en : (f && f.alt) || '';
    $('#vStory').setAttribute('aria-label', 'Story ' + (i + 1) + ' of ' + sv.items.length + (alt ? ': ' + alt : ''));
    var tm = $('#storyHead').querySelector('.tm'); if (tm && it.time) tm.textContent = it.time;
    $('#bars').querySelectorAll('span').forEach(function (s, k) {
      s.classList.toggle('done', k < i);
      s.querySelector('i').style.transform = k < i ? 'scaleX(1)' : 'scaleX(0)';
    });
    cancelAnimationFrame(sv.raf);
    sv.raf = requestAnimationFrame(storyLoop);
  }
  function storyLoop(now) {
    var dt = now - sv.last; sv.last = now;
    if (!sv.paused) sv.el += dt;
    var bar = $('#bars').querySelectorAll('span')[sv.i];
    if (bar) bar.querySelector('i').style.transform = 'scaleX(' + Math.min(1, sv.el / sv.dur) + ')';
    if (sv.el >= sv.dur) { nextStory(); return; }
    sv.raf = requestAnimationFrame(storyLoop);
  }
  function nextStory() { if (sv.i < sv.items.length - 1) show(sv.i + 1); else closeStories(); }
  function prevStory() { show(Math.max(0, sv.i - 1)); }
  function pauseStory(on) { sv.paused = on; $('#pausedTag').classList.toggle('on', on); }
  function closeStories() {
    cancelAnimationFrame(sv.raf);
    if (sv.kind === 'today') { state.storySeen = true; $('#avBtn').classList.add('seen'); }
    pauseStory(false);
    closeLayer($('#vStory'));
  }
  /* tap / hold */
  [['#stPrev', prevStory], ['#stNext', nextStory]].forEach(function (z) {
    var b = $(z[0]);
    b.addEventListener('pointerdown', function () { sv.held = false; clearTimeout(sv.holdT); sv.holdT = setTimeout(function () { sv.held = true; pauseStory(true); }, 260); });
    b.addEventListener('pointerup', function () { clearTimeout(sv.holdT); if (sv.held) { pauseStory(false); sv.held = false; } });
    b.addEventListener('pointerleave', function () { clearTimeout(sv.holdT); if (sv.held) { pauseStory(false); sv.held = false; } });
    b.addEventListener('click', function (e) { if (sv.held) { e.preventDefault(); return; } z[1](); });
  });

  function todayStories(from) {
    var day = J.DAYS.filter(function (d) { return d.date === '2026-11-30'; })[0];
    openStories(day.items, avatar() + '<b>jasnota</b><small class="tm">' + day.items[0].time + '</small>', from, 'today');
  }
  function openHighlight(id, from) {
    var h = J.HIGHLIGHTS.filter(function (x) { return x.id === id; })[0];
    var sign = J.hlSign(h);
    openStories(h.items, '<span class="avatar hlav"><span class="hlc">' + sign + '</span></span><b>' + h.label + '</b><small lang="mk">' + h.mk + '</small>', from, 'hl');
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.tile[data-id]');
    if (t && !scr.classList.contains('eye')) { openPost(t.getAttribute('data-id'), t); return; }
    var hl = e.target.closest('[data-hl]');
    if (hl && !scr.classList.contains('eye')) { openHighlight(hl.getAttribute('data-hl'), hl); return; }
  });
  $('#vPost').querySelector('[data-close]').addEventListener('click', function () { closeLayer($('#vPost')); });
  $('#avBtn').addEventListener('click', function () { if (!scr.classList.contains('eye')) todayStories($('#avBtn')); });
  $('#todayBtn').addEventListener('click', function () { resetLayers(); todayStories($('#todayBtn')); });
  $('#hlBtn').addEventListener('click', function () { resetLayers(); openHighlight('jasna', $('#hlBtn')); });
  document.querySelectorAll('[data-pins]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.pins = b.getAttribute('data-pins') === 'on';
      document.querySelectorAll('[data-pins]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      renderGrid(); selectTab(0, false);
    });
  });
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); if (curPost && !$('#vPost').hidden) renderCaption(curPost); });
  });

  document.addEventListener('keydown', function (e) {
    var story = !$('#vStory').hidden, reel = !$('#vReel').hidden, post = !$('#vPost').hidden;
    if (e.key === 'Escape') {
      if (scr.classList.contains('eye')) { exitEye(); e.preventDefault(); return; }
      if (story) { closeStories(); e.preventDefault(); return; }
      if (reel) { closeReel(); e.preventDefault(); return; }
      if (post) { closeLayer($('#vPost')); e.preventDefault(); return; }
    }
    if (story) {
      if (e.key === 'ArrowRight') { e.preventDefault(); nextStory(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevStory(); }
      else if (e.key === ' ') { e.preventDefault(); pauseStory(!sv.paused); }
      return;
    }
    if (reel && e.key === ' ' && !e.target.closest('button[data-close]')) { e.preventDefault(); toggleReel(); return; }
    if (post && car && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.target.closest('#media, .seg')) {
      e.preventDefault(); car.go(car.get() + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });
  /* keep keyboard focus inside an open layer */
  document.addEventListener('focusin', function (e) {
    var open = ['#vStory', '#vReel', '#vPost'].map($).filter(function (l) { return !l.hidden; })[0];
    if (open && !open.contains(e.target) && scr.contains(e.target)) {
      var f = open.querySelector('[data-close]'); if (f) f.focus({ preventScroll: true });
    }
  });

  function resetLayers() {
    if (!$('#vStory').hidden) closeStories();
    if (!$('#vReel').hidden) closeReel();
    if (!$('#vPost').hidden) closeLayer($('#vPost'));
    opener = [];
  }

  /* ---------------- first 3 seconds ---------------- */
  var eyeT = [], eyeRaf = 0;
  function eye() {
    resetLayers(); exitEye(true);
    selectTab(0, false);
    vProfile.scrollTop = 0;
    scr.classList.add('eye');
    var bar = document.createElement('div'); bar.className = 'eye-bar'; bar.innerHTML = '<i></i>';
    var clock = document.createElement('div'); clock.className = 'eye-clock'; clock.textContent = '0.0 s';
    scr.appendChild(bar); scr.appendChild(clock);
    var notes = document.querySelectorAll('#eyeNotes li');
    var marks = { 1: vProfile.querySelectorAll('[data-eye="1"]'), 2: vProfile.querySelectorAll('[data-eye="2"]'), 3: vProfile.querySelectorAll('[data-eye="3"]'), 4: vProfile.querySelectorAll('[data-eye="4"]') };
    notes.forEach(function (n) { n.classList.remove('lit'); });
    [0, 700, 1400, 2100].forEach(function (ms, k) {
      eyeT.push(setTimeout(function () { notes[k].classList.add('lit'); marks[k + 1].forEach(function (m) { m.classList.add('lit'); }); }, ms));
    });
    var t0 = performance.now();
    (function tick(now) {
      var s = Math.min(3, (now - t0) / 1000);
      bar.firstChild.style.width = (s / 3 * 100) + '%';
      clock.textContent = s.toFixed(1) + ' s';
      if (s < 3) eyeRaf = requestAnimationFrame(tick);
      else { $('#eyeEnd').hidden = false; $('#eyeAgain').focus({ preventScroll: true }); }
    })(t0);
  }
  function exitEye(silent) {
    eyeT.forEach(clearTimeout); eyeT = []; cancelAnimationFrame(eyeRaf);
    scr.classList.remove('eye');
    scr.querySelectorAll('.eye-bar, .eye-clock').forEach(function (x) { x.remove(); });
    vProfile.querySelectorAll('.lit').forEach(function (x) { x.classList.remove('lit'); });
    $('#eyeEnd').hidden = true;
    if (!silent) { document.querySelectorAll('#eyeNotes li').forEach(function (n) { n.classList.remove('lit'); }); $('#eyeBtn').focus({ preventScroll: true }); }
  }
  $('#eyeBtn').addEventListener('click', eye);
  $('#eyeAgain').addEventListener('click', eye);
  $('#eyeExit').addEventListener('click', function () { exitEye(); });
})();
