/* Јаснота — builders for the mini-site pages (month plan, calendar, review scorecard, moodboard grid).
   Requires render.js + data.js. Each builder runs only if its mount point exists. */
(function () {
  'use strict';
  var J = window.J, esc = J.esc;

  J.PREP = [
    { date: '2026-10-29', title: 'Check @jasnota is free; archive old posts', note: 'Archive, never delete. Secure @jasnota on Threads, TikTok, YouTube too.' },
    { date: '2026-10-30', title: 'Tell current followers', note: 'One story on @jasna.dzasna: this account becomes Jasnota on Monday.' },
    { date: '2026-10-31', title: 'Switch: public, Creator, @jasnota', note: 'Name, bio, link, category, picture. Upload highlight covers.' },
    { date: '2026-11-01', title: 'Rest. Schedule day one', note: 'Three launch posts drafted and scheduled 20:20 / 20:25 / 20:30.' }
  ];
  var FRAME_PILLAR = { S01: 'about', S02: 'about', S03: 'sound', S04: 'psycho', S05: 'sound', S06: 'songs', S07: 'rest', S08: 'songs', S09: 'songs', S10: 'songs', S11: 'sound', S12: 'sound', S13: 'psycho', S14: 'psycho', S15: 'songs', S16: 'songs', S17: 'psycho', S18: 'rest', S19: 'songs', S20: 'songs', S21: 'sound', S22: 'sound', S24: 'sound' };
  J.storyPillar = function (it) { return it.share ? J.post(it.share).pillar : (FRAME_PILLAR[it.f] || 'sound'); };
  J.storyLabel = function (it) {
    if (it.share) return 'shares №' + J.pad(J.post(it.share).n);
    var f = J.FRAMES[it.f]; return f && f.sticker !== 'none' ? f.sticker + ' sticker' : 'frame';
  };
  var PILLAR_ORDER = ['about', 'sound', 'psycho', 'songs', 'rest'];
  var FMT_ORDER = ['single', 'carousel', 'reel', 'story', 'prep'];

  function chip(t, on) { return '<span class="chip' + (on ? ' on' : '') + '">' + t + '</span>'; }

  /* ---------------- caption box ---------------- */
  J.captionBox = function (p, uid) {
    var id = 'cap-' + uid;
    var tags = p.tags.map(function (t) { return '#' + t; }).join(' ');
    return '<div class="cap-box" id="' + id + '" data-show="both">' +
      '<div class="cap-tools"><div class="seg" data-langtoggle="' + id + '" role="group" aria-label="Caption language">' +
      '<button type="button" data-l="both" aria-pressed="true">EN + MK</button><button type="button" data-l="en" aria-pressed="false">EN</button><button type="button" data-l="mk" aria-pressed="false">MK</button></div>' +
      '<button type="button" class="btn" data-copy="' + p.id + '">Copy caption</button></div>' +
      '<p class="cap-text"><span data-l="en">' + esc(p.caption.en) + '</span><span class="div78">' + J.DIVIDER + '</span><span data-l="mk" lang="mk">' + esc(p.caption.mk) + '</span>\n<span class="tags">' + esc(tags) + '</span></p></div>';
  };

  /* ---------------- one post card ---------------- */
  function card(p) {
    var vis = '';
    if (p.fmt === 'reel') {
      vis += '<figure class="w916">' + J.slide(p.cover, '916') + '<figcaption>cover · 9:16 (grid shows the centre 3:4)</figcaption></figure>';
      p.reel.shots.forEach(function (s) { vis += '<figure class="w916s">' + J.reelFrame(s, p.reel) + '<figcaption>' + s.t + '</figcaption></figure>'; });
    } else {
      p.slides.forEach(function (s, i) { vis += '<figure class="w45">' + J.slide(s, '45') + '<figcaption>' + (p.slides.length > 1 ? 'slide ' + (i + 1) + '/' + p.slides.length : 'single · 4:5 · 1080 × 1350') + '</figcaption></figure>'; });
    }
    var alts = p.fmt === 'reel' ? '<p>' + esc(p.cover.alt) + '</p>' :
      (p.slides.length > 1 ? '<ol>' + p.slides.map(function (s) { return '<li>' + esc(s.alt) + '</li>'; }).join('') + '</ol>' : esc(p.slides[0].alt));
    var photos = (p.photos || []).map(function (s) { var x = J.SHOTS[s]; return '<li><b>' + s + '.jpg</b> — ' + esc(x.shot) + '</li>'; }).join('');
    var kv = '<dl class="kv">' +
      '<dt>when</dt><dd>' + J.fmtDate(p.date, 'en', true) + ', ' + p.time + '</dd>' +
      '<dt>format</dt><dd>' + J.fmtLabel(p) + (p.collab ? '<br><small>Collab post with @' + p.collab + '</small>' : '') + '</dd>' +
      '<dt>pillar</dt><dd>' + J.PILLARS[p.pillar].en + ' <small lang="mk">· ' + J.PILLARS[p.pillar].mk + '</small></dd>' +
      '<dt>goal</dt><dd>' + p.goal.join(' · ') + '</dd>' +
      '<dt>grid</dt><dd>Bar ' + p.bar + ', beat ' + p.b + (p.light ? ' — downbeat, on paper' : '') + '<br><small>' + esc(p.why) + '</small></dd>' +
      (p.link ? '<dt>drives to</dt><dd><a href="' + J.link(p.link.path) + '">' + p.link.label + '</a><br><small>Caption says “jasnota.mk, link in bio”; same-day story carries a link sticker.</small></dd>' : '') +
      '<dt>hashtags</dt><dd>' + p.tags.length + ' · ' + p.tags.map(function (t) { return '#' + t; }).join(' ') + '</dd>' +
      '<dt>audio</dt><dd>' + esc(p.fmt === 'reel' ? p.reel.audio : 'None (static post).') + '</dd>' +
      '<dt>alt text</dt><dd>' + alts + '</dd>' +
      (photos ? '<dt>photos</dt><dd><ul>' + photos + '</ul></dd>' : '') +
      (p.usertags ? '<dt>tags</dt><dd>@' + p.usertags.join(', @') + '</dd>' : '') +
      (p.location ? '<dt>location</dt><dd>' + p.location + '</dd>' : '') +
      (p.notes ? '<dt>notes</dt><dd>' + esc(p.notes) + '</dd>' : '') +
      '</dl>';
    var reel = '';
    if (p.fmt === 'reel') {
      reel = '<div style="margin-top:var(--s-4)"><p class="day-sub">Shot list and on-screen text · ' + p.reel.length + ' · ' + p.reel.split + ' (2 + 2 + 3)</p><table class="shots"><thead><tr><th>Time</th><th>Shot</th><th>Sound</th><th>On screen</th></tr></thead><tbody>' +
        p.reel.shots.map(function (s) { return '<tr><td>' + s.t + '</td><td>' + esc(s.shot) + '</td><td>' + esc(s.sound) + '</td><td class="os">' + (s.os ? esc(s.os.en) + '<small lang="mk">' + esc(s.os.mk) + '</small>' : '—') + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    }
    return '<article class="card" id="' + p.id + '">' +
      '<div class="card-h"><h3>' + esc(p.title.en) + '</h3><span class="num">№' + J.pad(p.n) + ' · ' + J.fmtDate(p.date) + ' · ' + p.time + '</span>' +
      '<div class="chips">' + chip(J.FORMATS[p.fmt].toLowerCase(), true) + chip(J.PILLARS[p.pillar].en.toLowerCase()) + p.goal.map(function (g) { return chip(g); }).join('') + (p.collab ? chip('collab') : '') + '</div></div>' +
      '<div class="strip zoomable-strip">' + vis + '</div>' +
      '<div class="facts">' + J.captionBox(p, p.id) + kv + '</div>' + reel + '</article>';
  }

  function storiesRow(day) {
    if (!day || !day.items.length) return '';
    return '<p class="day-sub">Stories · ' + day.items.length + ' frame' + (day.items.length > 1 ? 's' : '') + '</p><div class="stories-row">' +
      day.items.map(function (it) {
        var f = J.frameOf(it);
        return '<figure>' + J.story(f) + '<figcaption><b>' + it.time + '</b> · ' + esc(J.storyLabel(it)) + (it.f ? ' · ' + it.f : '') + '</figcaption></figure>';
      }).join('') + '</div>';
  }

  /* ---------------- month page ---------------- */
  function buildMonth(mount) {
    var weeks = [
      { n: 1, from: '2026-11-02', to: '2026-11-08', title: 'Week one: <em>launch</em>' },
      { n: 2, from: '2026-11-09', to: '2026-11-15', title: 'Week two: <em>roots</em>' },
      { n: 3, from: '2026-11-16', to: '2026-11-22', title: 'Week three: <em>the research</em>' },
      { n: 4, from: '2026-11-23', to: '2026-11-29', title: 'Week four: <em>the voice</em>' },
      { n: 5, from: '2026-11-30', to: '2026-12-01', title: 'The <em>turn</em>' }
    ];
    var html = '';
    weeks.forEach(function (w) {
      var posts = J.POSTS.filter(function (p) { return p.date >= w.from && p.date <= w.to; });
      html += '<section class="week-block" id="week-' + w.n + '"><div class="week-h"><h2 class="display">' + w.title + '</h2><span class="mono-s">' + J.fmtDate(w.from) + ' – ' + J.fmtDate(w.to) + ' · ' + posts.length + ' feed</span></div>';
      J.DAYS.filter(function (d) { return d.date >= w.from && d.date <= w.to; }).forEach(function (d) {
        var dp = J.POSTS.filter(function (p) { return p.date === d.date; });
        var dt = J.date(d.date);
        if (d.rest) {
          html += '<div class="day-row rest" id="d-' + d.date + '"><div class="dlabel"><b>' + dt.getDate() + '</b>' + J.dow(d.date) + ' · Nov<span class="th">rest</span></div><div class="dcontent">' +
            '<svg viewBox="0 0 40 24" aria-hidden="true"><use href="#i-rest"/></svg>Sunday is a written rest. No posts, no stories. Reply to comments if you want to; nothing new.</div></div>';
          return;
        }
        html += '<div class="day-row" id="d-' + d.date + '"><div class="dlabel"><b>' + dt.getDate() + '</b>' + J.dow(d.date) + ' · ' + (dt.getMonth() === 10 ? 'Nov' : 'Dec') + '<span class="th">' + esc(d.theme) + '</span></div><div class="dcontent">' +
          dp.map(card).join('') + storiesRow(d) + '</div></div>';
      });
      html += '</section>';
    });
    mount.innerHTML = html;

    var shots = document.getElementById('shotlist');
    if (shots) {
      shots.innerHTML = Object.keys(J.SHOTS).map(function (k) {
        var s = J.SHOTS[k];
        return '<tr><td>' + k + '.jpg</td><td><b>' + esc(s.title) + '</b><br>' + esc(s.shot) + '</td><td>' + esc(s.use) + '</td></tr>';
      }).join('');
    }
  }

  /* ---------------- calendar ---------------- */
  function buildCalendar(mount) {
    var start = new Date(2026, 9, 26), cells = '';
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d, i) {
      cells += '<div class="dh' + (i === 0 || i === 2 || i === 4 ? ' g2' : '') + '">' + d + (i === 0 ? ' · think' : i === 2 ? ' · explain' : i === 4 ? ' · listen' : '') + '</div>';
    });
    for (var i = 0; i < 42; i++) {
      var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      var iso = d.getFullYear() + '-' + J.pad(d.getMonth() + 1) + '-' + J.pad(d.getDate());
      var items = '';
      J.PREP.filter(function (x) { return x.date === iso; }).forEach(function (x) {
        items += '<a class="it prep" data-fmt="prep" data-pillar="about" href="../profile/#switch"><span class="th">prep</span><span class="tt">' + esc(x.title) + '<small>' + esc(x.note) + '</small></span></a>';
      });
      J.POSTS.filter(function (p) { return p.date === iso; }).forEach(function (p) {
        items += '<a class="it" data-fmt="' + p.fmt + '" data-pillar="' + p.pillar + '" href="../month/#' + p.id + '"><span class="th">' + J.slide(J.cover(p), '34', 'hide-tags') + '</span><span class="tt">' + esc(p.title.en) +
          '<small>' + p.time + ' · ' + p.fmt + ' · ' + J.PILLARS[p.pillar].en.toLowerCase() + '</small></span></a>';
      });
      var day = null;
      J.DAYS.forEach(function (x) { if (x.date === iso) day = x; });
      if (day) day.items.forEach(function (it) {
        items += '<a class="it story" data-fmt="story" data-pillar="' + J.storyPillar(it) + '" href="../month/#d-' + iso + '"><span class="th">' + it.time.slice(0, 2) + '</span><span class="tt">Story<small>' + it.time + ' · ' + esc(J.storyLabel(it)) + '</small></span></a>';
      });
      var inPlan = iso >= '2026-10-29' && iso <= '2026-12-01';
      var isRest = day && day.rest;
      cells += '<div class="cell' + (d.getMonth() !== 10 ? ' out' : '') + (isRest ? ' rest' : '') + (!items && !isRest ? ' empty' : '') + '" data-date="' + iso + '">' +
        '<div class="dn">' + d.getDate() + '<small>' + (isRest ? 'rest' : (d.getMonth() === 10 ? '' : J.fmtDate(iso).slice(4))) + '</small></div>' + items +
        (isRest ? '<svg class="restmark" viewBox="0 0 40 24" aria-hidden="true"><use href="#i-rest"/></svg>' : '') + (!inPlan && !items ? '' : '') + '</div>';
    }
    mount.innerHTML = cells;

    var state = { pillar: {}, fmt: {} };
    PILLAR_ORDER.forEach(function (k) { state.pillar[k] = true; });
    FMT_ORDER.forEach(function (k) { state.fmt[k] = true; });
    function apply() {
      mount.querySelectorAll('.it').forEach(function (a) {
        a.hidden = !(state.pillar[a.getAttribute('data-pillar')] && state.fmt[a.getAttribute('data-fmt')]);
      });
      var shown = mount.querySelectorAll('.it:not([hidden])').length;
      var c = document.getElementById('calCount'); if (c) c.textContent = shown + ' items shown';
    }
    document.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        var kind = b.getAttribute('data-filter'), key = b.getAttribute('data-key');
        if (key === '*') {
          Object.keys(state[kind]).forEach(function (k) { state[kind][k] = true; });
          document.querySelectorAll('[data-filter="' + kind + '"]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-key') === '*' ? 'false' : 'true'); });
        } else {
          /* first click from "all on" isolates that key; later clicks toggle */
          var allOn = Object.keys(state[kind]).every(function (k) { return state[kind][k]; });
          if (allOn) { Object.keys(state[kind]).forEach(function (k) { state[kind][k] = (k === key); }); }
          else state[kind][key] = !state[kind][key];
          if (!Object.keys(state[kind]).some(function (k) { return state[kind][k]; })) Object.keys(state[kind]).forEach(function (k) { state[kind][k] = true; });
          document.querySelectorAll('[data-filter="' + kind + '"]').forEach(function (x) {
            var k = x.getAttribute('data-key');
            if (k !== '*') x.setAttribute('aria-pressed', state[kind][k] ? 'true' : 'false');
          });
        }
        apply();
      });
    });
    apply();
  }

  /* ---------------- review scorecard ---------------- */
  function buildScore(mount) {
    var KEY = 'jasnota-ig-score';
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
    var cols = ['reach', 'saves', 'shares', 'follows', 'link taps'];
    mount.innerHTML = J.POSTS.map(function (p) {
      return '<tr><td data-h="post">№' + J.pad(p.n) + ' ' + esc(p.title.en) + '<br><small class="footnote">' + J.fmtDate(p.date) + ' · ' + p.fmt + '</small></td><td data-h="goal">' + p.goal.join(', ') + '</td>' +
        cols.map(function (c) { var k = p.id + ':' + c; return '<td data-h="' + c + '"><input inputmode="numeric" aria-label="' + esc(c + ' for post ' + p.n) + '" data-k="' + k + '" value="' + esc(saved[k] || '') + '"></td>'; }).join('') + '</tr>';
    }).join('');
    mount.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k'); if (!k) return;
      saved[k] = e.target.value;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (err) {}
    });
  }

  /* ---------------- moodboard grid (index.html) ---------------- */
  J.buildMoodGrid = buildMoodGrid;
  function buildMoodGrid(mount) {
    mount.removeAttribute('data-generate');
    var list = J.POSTS.slice().sort(function (a, b) { return b.n - a.n; });
    mount.innerHTML = list.map(function (p) {
      var c = J.cover(p);
      var icon = J.fmtIcon(p) ? '<svg class="fi" aria-hidden="true"><use href="#i-' + J.fmtIcon(p) + '"/></svg>' : '';
      return '<article class="post hide-tags' + (p.light ? ' light' : '') + '" data-n="' + p.n + '" data-bar="' + p.bar + '" data-b="' + p.b + '" data-g="' + p.g + '" data-fmt="' + esc(J.fmtLabel(p)) + '" data-pillar="' + esc(J.PILLARS[p.pillar].en) + '" data-why="' + esc(p.why) + '">' +
        icon + c.html + '<p class="cap">' + esc(J.publishedCaption(p)) + '</p></article>';
    }).join('');
  }

  /* ---------------- zoom dialog for frames (month page) ---------------- */
  function bindZoom() {
    var dlg = document.getElementById('zoom');
    if (!dlg || !dlg.showModal) return;
    var stage = dlg.querySelector('.zstage'), txt = dlg.querySelector('.ztext'), last = null;
    document.addEventListener('click', function (e) {
      var fig = e.target.closest('.strip figure, .stories-row figure');
      if (!fig) return;
      var post = fig.querySelector('.post'); if (!post) return;
      last = fig;
      stage.innerHTML = '';
      var c = post.cloneNode(true); c.classList.remove('hide-tags'); stage.appendChild(c);
      stage.className = 'zstage ' + (post.classList.contains('r916') ? 'tall' : 'wide');
      txt.textContent = post.getAttribute('aria-label') || '';
      dlg.showModal();
    });
    document.querySelectorAll('.strip figure, .stories-row figure').forEach(function (f) {
      f.tabIndex = 0; f.setAttribute('role', 'button');
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.click(); } });
    });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { if (last) last.focus(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var m;
    if ((m = document.getElementById('monthMount'))) buildMonth(m);
    if ((m = document.getElementById('calMount'))) buildCalendar(m);
    if ((m = document.getElementById('scoreMount'))) buildScore(m);
    if ((m = document.getElementById('feed')) && m.hasAttribute('data-generate')) buildMoodGrid(m);
    J.bindLangToggles(document);
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-copy]'); if (!b) return;
      J.copy(J.publishedCaption(J.post(b.getAttribute('data-copy'))), b);
    });
    bindZoom();
    /* content is generated, so the browser's own jump to #id happens too early: redo it once layout settles */
    if (location.hash) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) {
        var go = function () { t.scrollIntoView(); };
        setTimeout(go, 60);
        window.addEventListener('load', function () { setTimeout(go, 30); });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(go, 30); });
      }
    }
  });
})();
