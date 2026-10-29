/* Јаснота — builders for the mini-site pages: 12 weeks, calendar, per-post log, hub grid and template gallery.
   Requires render.js + refs.js + data.js. Each builder runs only if its mount point exists. */
(function () {
  'use strict';
  var J = window.J, esc = J.esc;

  /* preparation before week 1 (the account is new) and the weekly review */
  J.PREP = [
    { date: '2026-10-29', title: 'Create @jasnota', note: 'New account from Jasna’s phone (Add account), own e-mail, 2FA. Fallbacks @jasnota.mk, @jasnota_mk.' },
    { date: '2026-10-30', title: 'Professional account, profile', note: 'Business · Education. Name, bio, link, mark as picture, saved replies, comment filters.' },
    { date: '2026-10-30', title: 'Facebook Page', note: 'A Page for Jasnota from Jasna’s profile (not a second profile): name, Education, intro, cover, profile picture. See facebook/.' },
    { date: '2026-10-31', title: 'Highlights before launch', note: 'Post the 6 method / about frames as stories, save them into Како работиме and За Јаснота, set the covers.' },
    { date: '2026-11-01', title: 'Schedule week 1', note: 'Carousel for Mon 19:30, teaser for 12:00. Re-read the sources slide one last time.' }
  ];
  var HOLIDAYS = { '2026-12-08': 'Св. Климент Охридски', '2027-01-01': 'Нова година', '2027-01-07': 'Божиќ', '2027-01-19': 'Богојавление' };
  J.REVIEW_DOW = 4;   /* Thursday: the post has had three days */

  function chip(t, on) { return '<span class="chip' + (on ? ' on' : '') + '">' + t + '</span>'; }
  function refList(ids) {
    return '<ol class="reflist">' + ids.map(function (id) {
      var r = J.REFS[id]; if (!r) return '';
      return '<li>' + esc(r.apa.replace(/\s*https?:\/\/\S+$/, '')) + (r.doi ? ' <a href="https://doi.org/' + esc(r.doi) + '" rel="noopener">doi.org/' + esc(r.doi) + '</a>' : '') + '</li>';
    }).join('') + '</ol>';
  }
  function allSourceIds(p) {
    var ids = [];
    p.src.forEach(function (s) { if (s.t === 'sources') s.ids.forEach(function (i) { if (ids.indexOf(i) < 0) ids.push(i); }); });
    return ids;
  }
  J.allSourceIds = allSourceIds;

  /* ---------------- caption box (MK, the 7/8 divider, one EN line, tags) ---------------- */
  J.captionBox = function (p) {
    return '<div class="cap-box">' +
      '<div class="cap-tools"><span class="mono-s">опис · ' + J.publishedCaption(p).length + ' / 2.200 знаци</span><button type="button" class="btn" data-copy="' + p.id + '">Копирај опис</button></div>' +
      '<p class="cap-text" lang="mk">' + esc(p.caption.mk) + '<span class="div78">' + J.DIVIDER + '</span><span class="en" lang="en">EN: ' + esc(p.caption.en) + '</span>\n<span class="tags">' + esc(p.tags.map(function (t) { return '#' + t; }).join(' ')) + '</span></p></div>';
  };

  /* ---------------- one week, fully shown ---------------- */
  function weekCard(p) {
    var N = p.slides.length;
    var vis = p.slides.map(function (s, i) {
      return '<figure class="w45">' + J.slide(s, '45') + '<figcaption>' + J.pad(i + 1) + ' / ' + J.pad(N) + ' · ' + slotName(p, i) + '</figcaption></figure>';
    }).join('');
    var alts = '<ol class="alts">' + p.slides.map(function (s) { return '<li lang="mk">' + esc(s.alt) + '</li>'; }).join('') + '</ol>';
    var ids = allSourceIds(p);
    var kv = '<dl class="kv">' +
      '<dt>објава</dt><dd>' + J.fmtDate(p.date, 'mk', true) + ', ' + p.time + '<br><small>Stories: Mon 12:00 teaser, Mon 19:35 repost, Wed 12:00 source, Fri 12:00 interaction.</small></dd>' +
      '<dt>столб</dt><dd>' + J.PILLARS[p.pillar].roman + ' · ' + J.PILLARS[p.pillar].mk + '<br><small>Tone: ' + J.TONES[J.toneOf(p)].en.toLowerCase() + '.</small></dd>' +
      '<dt>формат</dt><dd>' + J.FMT[p.fmt].mk + ' · ' + N + ' слајда' + (p.web ? '<br><small>Web twin: the full text goes up on the site the same day; caption says “линкот во био”.</small>' : '<br><small>Instagram only for now; no web text yet, so the caption has no link line.</small>') + '</dd>' +
      (p.rq ? '<dt>прашање</dt><dd lang="mk">' + esc(p.rq) + '</dd>' : '') +
      (p.why ? '<dt>why now</dt><dd>' + esc(p.why) + '</dd>' : '') +
      (p.ethics ? '<dt>ethics</dt><dd>' + esc(p.ethics) + '</dd>' : '') +
      '<dt>хаштагови</dt><dd>' + p.tags.length + ' · ' + p.tags.map(function (t) { return '#' + t; }).join(' ') + '</dd>' +
      '<dt>извори</dt><dd>' + refList(ids) + '</dd>' +
      '<dt>alt текст</dt><dd>' + alts + '</dd>' +
      (p.notes ? '<dt>notes</dt><dd>' + esc(p.notes) + '</dd>' : '') +
      '</dl>';
    return '<article class="card" id="' + p.id + '">' +
      '<div class="card-h"><h3 lang="mk">' + esc(p.title) + '</h3><span class="num">' + J.pad(p.n) + ' · ' + J.fmtDate(p.date, 'mk') + ' · ' + p.time + '</span>' +
      '<div class="chips">' + chip(J.FMT[p.fmt].mk, true) + chip('столб ' + J.PILLARS[p.pillar].roman) + chip(N + ' слајда') + (p.web ? chip('+ текст на веб') : '') + '</div></div>' +
      '<div class="strip">' + vis + '</div>' +
      '<div class="facts">' + J.captionBox(p) + kv + '</div>' + storiesRow(p) + '</article>';
  }
  function slotName(p, i) {
    var s = p.src[i] || p.src[p.src.length - 1], t = p.slides[i].t;
    return ({ 'cover-text': 'корица', 'cover-study': 'корица', 'cover-concept': 'корица', 'cover-myth': 'тврдење', verdict: 'пресуда', card: 'картичка', bars: 'резултат', known: 'знаеме / не знаеме', sources: 'извори', takeaway: 'што да земеме', def: 'дефиниција', compare: 'споредба' })[t] || 'содржина';
  }
  function storiesRow(p) {
    return '<p class="day-sub">Stories · optional · ' + p.stories.length + ' frames this week</p><div class="stories-row">' +
      p.stories.map(function (s) {
        return '<figure>' + J.story(s.f) + '<figcaption><b>' + J.dow(s.date) + ' ' + s.time + '</b> · ' + esc(s.label) + '</figcaption></figure>';
      }).join('') + '</div>';
  }

  /* a week of the calendar without a designed carousel yet (the launch topic until its slides land) */
  function pendingCard(f) {
    var P = J.PILLARS[f.pillar] || J.PILLARS[1];
    return '<article class="card pending" id="' + f.key + '"><div class="card-h"><h3 lang="mk">' + esc(f.title) + '</h3><span class="num">' + J.fmtDate(f.date, 'mk') + ' · ' + J.POST_TIME + '</span>' +
      '<div class="chips">' + chip('во подготовка', true) + chip('столб ' + P.roman) + (f.slug ? chip('+ текст на веб') : '') + '</div></div>' +
      '<div class="pending-body"><div class="pending-frame" aria-hidden="true"><span class="mark"></span><span class="mono-s">карусел · во подготовка</span></div>' +
      '<div class="prose"><p><b lang="mk">' + esc(J.strip(f.title).split(':')[0]) + ' — во подготовка.</b> ' +
      (f.placeholder
        ? 'The launch topic, rooted in Jasna’s workshop of the same name. When the calendar entry with its <code>social.ig.slides</code> lands (and <code>node instagram/tools/sync-social.mjs</code> runs), the carousel appears here, drawn by the same templates, and the twelve weeks below move one week later.'
        : 'The calendar has this week but no carousel yet. Add <code>social.ig.slides</code> to the calendar item and rerun the sync; the slides are drawn by the same templates.') +
      '</p><p><a href="../kit/#' + f.key + '">Пакет за објава →</a></p></div></div></article>';
  }
  function buildWeeks(mount) {
    var html = '';
    J.FLOW.forEach(function (f) {
      var p = f.post, n = f.placeholder ? '00' : J.pad(f.week);
      var id = f.placeholder ? 'week-launch' : 'week-' + f.week;
      html += '<section class="week-block" id="' + id + '"><div class="week-h"><h2 class="display">' + (f.placeholder ? 'Недела <em>01</em> <small class="mono-s">нова</small>' : 'Недела <em>' + n + '</em>') + '</h2><span class="mono-s">' + J.longDate(f.date) + ' · ' + (J.PILLARS[f.pillar] || J.PILLARS[1]).mk + '</span></div>' +
        (p ? weekCard(p) : pendingCard(f)) + '</section>';
    });
    mount.innerHTML = html;
  }

  /* ---------------- calendar: Nov 2026 – Jan 2027 ---------------- */
  function buildCalendar(mount) {
    var months = [[2026, 10], [2026, 11], [2027, 0]];
    var head = ['пон', 'вто', 'сре', 'чет', 'пет', 'саб', 'нед'].map(function (d, i) { return '<div class="dh' + (i === 0 ? ' g2' : '') + '">' + d + (i === 0 ? ' · објава' : i === 3 ? ' · преглед' : '') + '</div>'; }).join('');
    var html = '';
    months.forEach(function (ym, mi) {
      var first = new Date(ym[0], ym[1], 1), start = new Date(first);
      start.setDate(1 - ((first.getDay() + 6) % 7));
      var last = new Date(ym[0], ym[1] + 1, 0), cells = '';
      var n = Math.ceil(((first.getDay() + 6) % 7 + last.getDate()) / 7) * 7;
      for (var i = 0; i < n; i++) {
        var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i), iso = J.iso(d);
        var inMonth = d.getMonth() === ym[1];
        var showItems = inMonth || (mi === 0 && d < first && iso >= '2026-10-29');   /* prep days before November, once */
        var items = '';
        if (showItems) {
          J.PREP.filter(function (x) { return x.date === iso; }).forEach(function (x) {
            items += '<a class="it prep" data-fmt="ops" data-pillar="acc" href="../profile/#create"><span class="th">prep</span><span class="tt">' + esc(x.title) + '<small>' + esc(x.note) + '</small></span></a>';
          });
          J.FLOW.forEach(function (f) {   /* the article goes up first, in the morning */
            if (f.date === iso) {
              items += '<a class="it web' + (f.onSite ? '' : ' warn') + '" data-fmt="web" data-pillar="' + f.pillar + '" href="../kit/#' + f.key + '"><span class="th">веб</span><span class="tt" lang="mk">Текст на веб' +
                '<small>' + J.WEB_TIME + ' · ' + (f.onSite ? 'готов на веб' : f.slug ? 'уште не е на веб' : 'текстот уште не е напишан') + '</small></span></a>';
            }
          });
          J.POSTS.filter(function (p) { return p.date === iso; }).forEach(function (p) {
            items += '<a class="it" data-fmt="' + p.fmt + '" data-pillar="' + p.pillar + '" href="../month/#' + p.id + '"><span class="th">' + J.slide(J.cover(p), '34', 'hide-tags') + '</span><span class="tt" lang="mk">' + esc(p.title) +
              '<small>' + p.time + ' · ' + J.FMT[p.fmt].mk + ' · столб ' + J.PILLARS[p.pillar].roman + '</small></span></a>';
          });
          J.FLOW.forEach(function (f) {
            if (J.fbDate(f) === iso) {
              items += '<a class="it fb' + (f.onSite ? '' : ' warn') + '" data-fmt="fb" data-pillar="' + f.pillar + '" href="../facebook/#fb-' + f.key + '"><span class="th">f</span><span class="tt" lang="mk">Facebook' +
                '<small>' + J.FB_TIME + ' · ' + (f.fb && f.fb.text_mk ? 'текст + фото + линк' : 'текстот наскоро') + '</small></span></a>';
            }
          });
          J.POSTS.forEach(function (p) {
            p.stories.forEach(function (s) {
              if (s.date !== iso) return;
              items += '<a class="it story" data-fmt="story" data-pillar="' + p.pillar + '" href="../month/#' + p.id + '"><span class="th">' + s.time.slice(0, 2) + '</span><span class="tt">Сторија<small>' + s.time + ' · ' + esc(s.label) + '</small></span></a>';
            });
          });
          if (d.getDay() === J.REVIEW_DOW && iso >= J.addDays(J.POSTS[0].date, 3) && iso <= J.addDays(J.POSTS[J.POSTS.length - 1].date, 3)) {
            items += '<a class="it prep rev" data-fmt="ops" data-pillar="acc" href="../metrics/#ritual"><span class="th">20′</span><span class="tt">Неделен преглед<small>10:00 · log + one decision</small></span></a>';
          }
        }
        var hol = HOLIDAYS[iso] && inMonth ? '<span class="hol">' + HOLIDAYS[iso] + '</span>' : '';
        cells += '<div class="cell' + (!inMonth ? ' out' : '') + (!items ? ' empty' : '') + '" data-date="' + iso + '">' +
          '<div class="dn">' + d.getDate() + '<small>' + J.dow(iso) + '</small></div>' + hol + items + '</div>';
      }
      html += '<section class="cal-month"><h2 class="sub-h">' + J.MONL[ym[1]].replace(/^./, function (c) { return c.toUpperCase(); }) + ' <em>' + ym[0] + '</em></h2><div class="cal">' + head + cells + '</div></section>';
    });
    mount.innerHTML = html;

    var state = { pillar: { 1: true, 2: true, 3: true, acc: true }, fmt: { text: true, study: true, concept: true, myth: true, story: true, ops: true, web: true, fb: true } };
    function apply() {
      mount.querySelectorAll('.it').forEach(function (a) {
        a.hidden = !(state.pillar[a.getAttribute('data-pillar')] && state.fmt[a.getAttribute('data-fmt')]);
      });
      mount.querySelectorAll('.cell').forEach(function (c) { c.classList.toggle('none', !c.querySelector('.it:not([hidden])')); });
      var shown = mount.querySelectorAll('.it:not([hidden])').length;
      var posts = mount.querySelectorAll('.it:not([hidden]):not(.story):not(.prep):not(.web):not(.fb)').length;
      var c = document.getElementById('calCount'); if (c) c.textContent = posts + ' карусели · ' + shown + ' ставки';
    }
    document.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        var kind = b.getAttribute('data-filter'), key = b.getAttribute('data-key');
        if (key === '*') {
          Object.keys(state[kind]).forEach(function (k) { state[kind][k] = true; });
        } else {
          /* first click from "all on" isolates that key; later clicks toggle */
          var allOn = Object.keys(state[kind]).every(function (k) { return state[kind][k]; });
          if (allOn) { Object.keys(state[kind]).forEach(function (k) { state[kind][k] = (k === key); }); }
          else state[kind][key] = !state[kind][key];
          if (!Object.keys(state[kind]).some(function (k) { return state[kind][k]; })) Object.keys(state[kind]).forEach(function (k) { state[kind][k] = true; });
        }
        document.querySelectorAll('[data-filter="' + kind + '"]').forEach(function (x) {
          var k = x.getAttribute('data-key'), all = Object.keys(state[kind]).every(function (z) { return state[kind][z]; });
          x.setAttribute('aria-pressed', k === '*' ? (all ? 'true' : 'false') : (state[kind][k] && !all ? 'true' : 'false'));
        });
        apply();
      });
    });
    apply();
  }

  /* ---------------- per-post log (metrics) ---------------- */
  function buildLog(mount) {
    var KEY = 'jasnota-ig-log-v3';
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} }
    var nums = [['reach', 'досег'], ['saves', 'зачувувања'], ['shares', 'споделувања'], ['talk', 'значајни коментари / прашања'], ['contacts', 'професионални контакти']];
    mount.innerHTML = J.POSTS.map(function (p) {
      var k = p.id;
      var checks = J.CHECKS.map(function (c, i) {
        var ck = k + ':c' + i;
        return '<label><input type="checkbox" data-k="' + ck + '"' + (saved[ck] ? ' checked' : '') + '><span lang="mk">' + esc(c) + '</span></label>';
      }).join('');
      var done = J.CHECKS.filter(function (c, i) { return saved[k + ':c' + i]; }).length;
      return '<tr><td data-h="објава"><b>' + J.pad(p.n) + '</b> <span lang="mk">' + esc(p.title) + '</span><br><small class="footnote">' + J.fmtDate(p.date, 'mk') + ' · ' + J.FMT[p.fmt].mk + '</small></td>' +
        '<td data-h="навреме"><label class="ontime"><input type="checkbox" data-k="' + k + ':ontime"' + (saved[k + ':ontime'] ? ' checked' : '') + ' aria-label="Објавено навреме, недела ' + p.n + '"> да</label></td>' +
        '<td data-h="извори"><details class="chk"><summary><span data-count="' + k + '">' + done + '</span> / ' + J.CHECKS.length + '</summary><div>' + checks + '</div></details></td>' +
        nums.map(function (c) { var kk = k + ':' + c[0]; return '<td data-h="' + c[1] + '"><input inputmode="numeric" aria-label="' + esc(c[1] + ', недела ' + p.n) + '" data-k="' + kk + '" value="' + esc(saved[kk] || '') + '"></td>'; }).join('') +
        '<td data-h="белешка"><input class="wide" aria-label="Белешка, недела ' + p.n + '" data-k="' + k + ':note" value="' + esc(saved[k + ':note'] || '') + '"></td></tr>';
    }).join('');
    function onChange(e) {
      var k = e.target.getAttribute('data-k'); if (!k) return;
      saved[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      if (/:c\d+$/.test(k)) {
        var id = k.split(':')[0];
        var n = J.CHECKS.filter(function (c, i) { return saved[id + ':c' + i]; }).length;
        var el = mount.querySelector('[data-count="' + id + '"]'); if (el) el.textContent = n;
      }
      save(); summary();
    }
    mount.addEventListener('input', onChange);
    mount.addEventListener('change', onChange);
    function summary() {
      var el = document.getElementById('logSummary'); if (!el) return;
      var today = J.iso(new Date());
      var due = J.POSTS.filter(function (p) { return p.date <= today; }).length;
      var on = J.POSTS.filter(function (p) { return saved[p.id + ':ontime']; }).length;
      var full = J.POSTS.filter(function (p) { return J.CHECKS.every(function (c, i) { return saved[p.id + ':c' + i]; }); }).length;
      var sum = function (f) { return J.POSTS.reduce(function (a, p) { return a + (parseInt(saved[p.id + ':' + f], 10) || 0); }, 0); };
      var N = J.POSTS.length;
      el.innerHTML = '<div><b>' + on + ' / ' + N + '</b><span>weeks published on time' + (due ? ' (' + due + ' due so far)' : '') + '</span></div>' +
        '<div><b>' + full + ' / ' + N + '</b><span>posts with the full source checklist</span></div>' +
        '<div><b>' + sum('talk') + '</b><span>meaningful comments and questions</span></div>' +
        '<div><b>' + sum('contacts') + '</b><span>professional contacts made</span></div>';
    }
    summary();
    var csv = document.getElementById('logCsv');
    if (csv) csv.addEventListener('click', function () {
      var rows = [['week', 'date', 'title', 'on_time', 'checks'].concat(nums.map(function (c) { return c[0]; })).concat(['note'])];
      J.POSTS.forEach(function (p) {
        rows.push([p.n, p.date, p.title, saved[p.id + ':ontime'] ? 1 : 0, J.CHECKS.filter(function (c, i) { return saved[p.id + ':c' + i]; }).length]
          .concat(nums.map(function (c) { return saved[p.id + ':' + c[0]] || ''; })).concat([saved[p.id + ':note'] || '']));
      });
      J.copy(rows.map(function (r) { return r.map(function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n'), csv);
    });
  }

  /* ---------------- hub grid (index.html): newest first ---------------- */
  J.buildMoodGrid = function (mount) {
    var list = J.POSTS.slice().sort(function (a, b) { return b.n - a.n; });
    mount.innerHTML = list.map(function (p) {
      return '<button type="button" class="tile" data-id="' + p.id + '" data-pillar="' + p.pillar + '" aria-label="' + esc('Објава ' + p.n + ': ' + p.title + ', ' + J.fmtLabel(p)) + '">' +
        J.slide(J.cover(p), '34', 'hide-tags') + J.icon('car', 'gi') + '<span class="code" aria-hidden="true">' + J.PILLARS[p.pillar].roman + ' · ' + J.FMT[p.fmt].mk + '</span></button>';
    }).join('');
  };

  /* ---------------- template gallery (index.html) ---------------- */
  function buildTemplates(mount) {
    var rows = [
      { id: 'w01', name: 'Текст', seq: 'cover → 4–5 content slides → Што знаеме / не знаеме → Извори', note: 'The long read’s carousel twin. Headline in Cormorant, one italic word; body in Onest ≤ 230 characters a slide; every claim ends with its evidence label and in-text citation. Slide 6 is always the honest one: what we know, what we don’t, and when to see a professional.' },
      { id: 'w02', name: 'Приказ на студија', seq: 'cover (specimen frame) → study card → result → limitations → replication / what came next → знаеме → Извори', note: 'One paper, read like a lab card. The cover is framed by four crop marks; the study card is always the same table (who · tasks · design · measures); results are drawn, never decorated; limitations get their own slide.' },
      { id: 'w08', name: 'Поим', seq: 'cover (dictionary entry) → definition → how common / measured → example from music → (local study) → Извори', note: 'A term set like a dictionary entry: lowercase, the English term in brackets, a hairline, the plain-language gloss. Examples from music are marked as illustrations, not findings.' },
      { id: 'w04', name: 'Мит или наука', seq: 'cover (the claim, in quotes) → verdict stamp → what science says ×3 → Извори', note: 'The claim stands alone on the cover, so the swipe is the reveal. The verdict stamp is the only place cinnabar appears in the whole feed.' }
    ];
    mount.innerHTML = rows.map(function (r) {
      var p = J.post(r.id);
      return '<div class="tpl-fmt"><div class="tpl-h"><h3 class="display">' + r.name + '</h3><p class="spec">' + r.seq + '</p><p class="note">' + r.note + '</p></div>' +
        '<div class="strip">' + p.slides.map(function (s, i) { return '<figure class="w45">' + J.slide(s, '45') + '<figcaption>' + J.pad(i + 1) + ' · ' + slotName(p, i) + '</figcaption></figure>'; }).join('') + '</div></div>';
    }).join('');
  }

  /* ---------------- zoom dialog for frames ---------------- */
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
    if ((m = document.getElementById('monthMount'))) buildWeeks(m);
    if ((m = document.getElementById('calMount'))) buildCalendar(m);
    if ((m = document.getElementById('logMount'))) buildLog(m);
    if ((m = document.getElementById('tplMount'))) buildTemplates(m);
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
