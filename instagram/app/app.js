/* Јаснота — profile prototype interactions (v3).
   Grid of 12 carousels, post view with swipeable carousel, Macedonian caption + EN line, per-slide alt text,
   story viewer (tap, hold to pause, auto-advance, progress bars), seven highlights, “first 3 seconds”. */
(function () {
  'use strict';
  var J = window.J;
  var $ = function (s) { return document.querySelector(s); };
  var scr = $('#scr'), vProfile = $('#vProfile');
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var opener = [];   // focus return stack
  var NOW = J.POSTS[J.POSTS.length - 1];   // the profile on the day of week 12

  function newest() { return J.POSTS.slice().sort(function (a, b) { return b.n - a.n; }); }
  function avatar(cls) { return '<span class="avatar ' + (cls || '') + '">' + J.avatarInner() + '</span>'; }

  /* ---------------- profile ---------------- */
  $('#avInner').innerHTML = J.avatarInner();
  $('#stats').innerHTML = '<div><b>' + J.STATS.posts + '</b><span>објави</span></div><div><b>' + J.STATS.followers + '</b><span>следбеници</span></div><div><b>' + J.STATS.following + '</b><span>следи</span></div>';
  $('#bioTop').innerHTML = '<p class="n">' + J.esc(J.NAME) + '</p><p class="cat">' + J.CATEGORY + '</p><p>' + J.esc(J.BIO[0]) + '</p>';
  $('#bioRest').innerHTML = J.BIO.slice(1).map(function (l) { return '<p>' + J.esc(l) + '</p>'; }).join('') + '<p class="link"><svg class="ico" aria-hidden="true"><use href="#i-link"/></svg>' + J.LINK + '</p>';
  $('#hlRow').innerHTML = J.HIGHLIGHTS.map(function (h) {
    return '<button type="button" class="hl" data-hl="' + h.id + '" aria-label="Highlight: ' + h.label + '"><div class="c"><div class="hlc tone-' + h.tone + '">' + J.hlSign(h) + '</div></div>' + h.label + '</button>';
  }).join('');

  $('#grid').innerHTML = newest().map(function (p, i) {
    var label = 'Објава ' + p.n + ': ' + p.title + ', ' + J.fmtLabel(p) + ', ' + J.fmtDate(p.date, 'mk', true);
    return '<button type="button" class="tile" data-id="' + p.id + '" aria-label="' + J.esc(label) + '"' + (i < 3 ? ' data-eye="4"' + (i === 0 ? ' data-eye-first' : '') : '') + '>' +
      J.slide(J.cover(p), '34', 'hide-tags') + J.icon('car', 'gi') + '</button>';
  }).join('');

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
    var f = el.querySelector('[data-close]') || el.querySelector('button');
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
  var car = null;
  function captionHTML(p) {
    return '<b>jasnota</b> ' + J.esc(p.caption.mk) + '\n\n<span class="div78">' + J.DIVIDER + '</span>\n<span lang="en">EN: ' + J.esc(p.caption.en) + '</span>\n\n<span class="tg">' + p.tags.map(function (t) { return '#' + t; }).join(' ') + '</span>';
  }
  function openPost(id, from) {
    var p = J.post(id), n = p.slides.length;
    var slides = p.slides.map(function (s) { return J.slide(s, '45'); }).join('');
    $('#pvBody').innerHTML =
      '<div class="pv-head">' + avatar() + '<div class="who"><b>jasnota</b><small>' + J.FMT[p.fmt].mk + ' · столб ' + J.PILLARS[p.pillar].roman + '</small></div><span class="icon-btn" aria-hidden="true">' + J.icon('dots') + '</span></div>' +
      '<div class="media" id="media" tabindex="0" aria-roledescription="carousel" aria-label="' + J.esc(p.title) + ', ' + n + ' слајда. Use left and right arrows.">' +
        '<div class="track">' + slides + '</div>' +
        '<span class="count" aria-live="polite">1/' + n + '</span><button class="arr p" type="button" aria-label="Previous slide" disabled>' + J.icon('back') + '</button><button class="arr n" type="button" aria-label="Next slide">' + J.icon('next') + '</button>' +
      '</div>' +
      '<div class="pv-actions"><span class="l" aria-hidden="true">' + J.icon('heart') + J.icon('comment') + J.icon('send') + '</span><span class="dots" aria-hidden="true">' + new Array(n + 1).join('<i></i>') + '</span><span class="r" aria-hidden="true">' + J.icon('save') + '</span></div>' +
      '<div class="pv-cap" lang="mk">' +
      '<p class="capt clamp" id="capt">' + captionHTML(p) + '</p><button class="more" type="button" id="more">повеќе</button>' +
      '<p class="date">' + J.longDate(p.date) + ' · ' + p.time + '</p>' +
      '<p class="alt"><span class="footnote">alt текст, слајд <span id="altN">1</span>:</span> <span id="altT"></span></p></div>';
    $('#more').addEventListener('click', function () { $('#capt').classList.remove('clamp'); $('#more').hidden = true; });
    car = carousel($('#media'), n, function (i) { $('#altN').textContent = i + 1; $('#altT').textContent = p.slides[i].alt; });
    J.applyPhotos($('#pvBody'));
    $('#pvBody').scrollTop = 0;
    openLayer($('#vPost'), from);
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

  /* ---------------- story viewer ---------------- */
  /* items: [{ f: frame, time?: 'HH:MM' }] */
  var sv = { items: [], i: 0, el: 0, last: 0, raf: 0, paused: false, dur: 5500, held: false, holdT: 0, kind: '' };
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
    var it = sv.items[i], r = J.frame(it.f);
    $('#storyStage').innerHTML = '<div class="frame-wrap">' + J.story(it.f) + '</div>';
    J.applyPhotos($('#storyStage'));
    $('#vStory').setAttribute('aria-label', 'Story ' + (i + 1) + ' of ' + sv.items.length + ': ' + (r ? r.alt : ''));
    var tm = $('#storyHead').querySelector('.tm'); if (tm) tm.textContent = it.time || '';
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
    if (sv.kind === 'week') $('#avBtn').classList.add('seen');
    pauseStory(false);
    closeLayer($('#vStory'));
  }
  [['#stPrev', prevStory], ['#stNext', nextStory]].forEach(function (z) {
    var b = $(z[0]);
    b.addEventListener('pointerdown', function () { sv.held = false; clearTimeout(sv.holdT); sv.holdT = setTimeout(function () { sv.held = true; pauseStory(true); }, 260); });
    b.addEventListener('pointerup', function () { clearTimeout(sv.holdT); if (sv.held) { pauseStory(false); sv.held = false; } });
    b.addEventListener('pointerleave', function () { clearTimeout(sv.holdT); if (sv.held) { pauseStory(false); sv.held = false; } });
    b.addEventListener('click', function (e) { if (sv.held) { e.preventDefault(); return; } z[1](); });
  });

  /* this week’s stories: Monday’s two, so far (it is Monday evening of week 12) */
  function weekStories(from) {
    var items = NOW.stories.filter(function (s) { return s.date === NOW.date; }).map(function (s) { return { f: s.f, time: s.time }; });
    openStories(items, avatar() + '<b>jasnota</b><small class="tm">' + items[0].time + '</small>', from, 'week');
  }
  function openHighlight(id, from) {
    var h = J.HIGHLIGHTS.filter(function (x) { return x.id === id; })[0];
    openStories(h.items.map(function (f) { return { f: f }; }), '<span class="avatar hlav"><span class="hlc tone-' + h.tone + '">' + J.hlSign(h) + '</span></span><b lang="mk">' + h.label + '</b>', from, 'hl');
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.tile[data-id]');
    if (t && !scr.classList.contains('eye')) { openPost(t.getAttribute('data-id'), t); return; }
    var hl = e.target.closest('[data-hl]');
    if (hl && !scr.classList.contains('eye')) { openHighlight(hl.getAttribute('data-hl'), hl); return; }
    var op = e.target.closest('[data-open]');
    if (op) { resetLayers(); exitEye(true); openPost(op.getAttribute('data-open'), op); }
  });
  $('#vPost').querySelector('[data-close]').addEventListener('click', function () { closeLayer($('#vPost')); });
  $('#avBtn').addEventListener('click', function () { if (!scr.classList.contains('eye')) weekStories($('#avBtn')); });
  $('#todayBtn').addEventListener('click', function () { resetLayers(); exitEye(true); weekStories($('#todayBtn')); });
  $('#hlBtn').addEventListener('click', function () { resetLayers(); exitEye(true); openHighlight('metod', $('#hlBtn')); });

  document.addEventListener('keydown', function (e) {
    var story = !$('#vStory').hidden, post = !$('#vPost').hidden;
    if (e.key === 'Escape') {
      if (scr.classList.contains('eye')) { exitEye(); e.preventDefault(); return; }
      if (story) { closeStories(); e.preventDefault(); return; }
      if (post) { closeLayer($('#vPost')); e.preventDefault(); return; }
    }
    if (story) {
      if (e.key === 'ArrowRight') { e.preventDefault(); nextStory(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevStory(); }
      else if (e.key === ' ') { e.preventDefault(); pauseStory(!sv.paused); }
      return;
    }
    if (post && car && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.target.closest('#media')) {
      e.preventDefault(); car.go(car.get() + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });
  /* keep keyboard focus inside an open layer */
  document.addEventListener('focusin', function (e) {
    var open = ['#vStory', '#vPost'].map($).filter(function (l) { return !l.hidden; })[0];
    if (open && !open.contains(e.target) && scr.contains(e.target)) {
      var f = open.querySelector('[data-close]'); if (f) f.focus({ preventScroll: true });
    }
  });

  function resetLayers() {
    if (!$('#vStory').hidden) closeStories();
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
