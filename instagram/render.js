/* Јаснота — Instagram mini-site runtime (v3: the platform account).
   Shared by every page in /instagram/: helpers, icon sprite, the carousel TEMPLATE SYSTEM (one strict
   sequence per format), story-frame templates, caption builder and the photo-slot loader.

   Data lives in data.js (posts are structured: { t: 'text', h: …, p: … }); J.compose(post) turns them into
   rendered slides { html, alt, light } so every page and the prototype share one renderer.
   References come from refs.js (generated from research/content-bank/sources.json).

   Photo slots: any element with data-slot="…" is an art-directed placeholder. At runtime we read
   ../photos/manifest.json and load only the slots it lists, so nothing that doesn't exist is ever requested. */
(function () {
  'use strict';
  var J = window.J = window.J || {};
  var script = document.currentScript;
  var here = script ? script.src : location.href;
  J.base = new URL('./', here).href;            // …/instagram/
  J.root = new URL('../', here).href;           // project root
  J.photoBase = new URL('../photos/', here).href;

  /* ---------- tiny helpers ---------- */
  J.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  J.strip = function (s) { return String(s || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&'); };
  var MON = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              mk: ['јан', 'фев', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'ное', 'дек'] };
  var MONL = ['јануари', 'февруари', 'март', 'април', 'мај', 'јуни', 'јули', 'август', 'септември', 'октомври', 'ноември', 'декември'];
  var DOW = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mk: ['нед', 'пон', 'вто', 'сре', 'чет', 'пет', 'саб'] };
  J.MONL = MONL;
  J.date = function (iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  J.iso = function (d) { return d.getFullYear() + '-' + J.pad(d.getMonth() + 1) + '-' + J.pad(d.getDate()); };
  J.fmtDate = function (iso, lang, long) {
    lang = lang || 'mk';
    var d = J.date(iso);
    var s = DOW[lang][d.getDay()] + ' ' + d.getDate() + ' ' + MON[lang][d.getMonth()];
    return long ? s + ' ' + d.getFullYear() : s;
  };
  J.longDate = function (iso) { var d = J.date(iso); return d.getDate() + ' ' + MONL[d.getMonth()] + ' ' + d.getFullYear(); };
  J.dow = function (iso, lang) { return DOW[lang || 'mk'][J.date(iso).getDay()]; };
  J.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  J.addDays = function (iso, n) { var d = J.date(iso); d.setDate(d.getDate() + n); return J.iso(d); };

  /* ---------- markup helpers ---------- */
  var h = J.h = {
    mark: function (w, st) { return '<span class="mark" aria-hidden="true" style="width:' + (w || 7) + 'cqi;' + (st || '') + '"></span>'; },
    meta: function (t, st) { return '<p class="meta"' + (st ? ' style="' + st + '"' : '') + '>' + t + '</p>'; },
    /* photo placeholder: kind = CSS drawing, slot = photo file in /photos/ (AI stand-ins are labelled in notes) */
    ph: function (kind, slot, inner) {
      return '<div class="ph ' + kind + '"' + (slot ? ' data-slot="' + slot + '"' : '') + ' aria-hidden="true">' + (inner || '') +
        (slot ? '<span class="slot-tag">photo · ' + slot + '.jpg</span>' : '') + '</div>';
    }
  };

  /* ---------- icon sprite ---------- */
  var SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
    '<symbol id="i-car" viewBox="0 0 24 24"><rect x="3" y="7" width="13" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3h11a2 2 0 0 1 2 2v12" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>' +
    '<symbol id="i-reel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 8.5h18M9 3l3 5.5M15 3l3 5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 11.5v6l5-3z" fill="currentColor"/></symbol>' +
    '<symbol id="i-grid" viewBox="0 0 24 24"><path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>' +
    '<symbol id="i-tag" viewBox="0 0 24 24"><path d="M4 4h16v13h-5l-3 3-3-3H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 15.5c1-1.8 2.6-2.6 4.5-2.6s3.5.8 4.5 2.6" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>' +
    '<symbol id="i-back" viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-next" viewBox="0 0 24 24"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-dots" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="19" cy="12" r="1.7" fill="currentColor"/></symbol>' +
    '<symbol id="i-person" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 20c1-4 3.8-6 7-6s6 2 7 6M19 7v6M16 10h6" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>' +
    '<symbol id="i-pin" viewBox="0 0 24 24"><path d="M9 3h6l-1 6 4 4H6l4-4zM12 13v8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.2 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.1 0 5.3 2.9 4.3 6.2-1.5 4.7-9 9.3-9 9.3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-comment" viewBox="0 0 24 24"><path d="M20.5 12a8.5 8.5 0 1 1-3.2-6.6A8.4 8.4 0 0 1 20.5 12zM20.5 12l1 7.5-5-2.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-send" viewBox="0 0 24 24"><path d="M21.5 3 2.5 10l7.5 3.2L21.5 3zM10 13.2l3.3 7.8 8.2-18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-save" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-5-6 5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-x" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>' +
    '<symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></symbol>' +
    '<symbol id="i-pause" viewBox="0 0 24 24"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/></symbol>' +
    '<symbol id="i-link" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>' +
    '<symbol id="i-rest" viewBox="0 0 40 24"><path d="M2 6h36" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="12" y="6" width="16" height="7" fill="currentColor"/></symbol>' +
    '</svg>';
  J.icon = function (id, cls) { return '<svg class="ico ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#i-' + id + '"/></svg>'; };
  function injectSprite() {
    if (!document.getElementById('i-car')) document.body.insertAdjacentHTML('afterbegin', SPRITE);
  }

  /* =================================================================
     BRAND ATOMS ON SLIDES
     ================================================================= */
  /* evidence labels (EDITORIAL.md §3): three bars, filled by strength; an open question is dashed */
  J.EV = {
    strong:   { mk: 'силни докази', en: 'strong evidence', n: 3 },
    moderate: { mk: 'умерени докази', en: 'moderate evidence', n: 2 },
    early:    { mk: 'рани/ограничени докази', en: 'early/limited evidence', n: 1 },
    open:     { mk: 'отворено прашање', en: 'open question', n: 0 }
  };
  J.ev = function (k) {
    var e = J.EV[k]; if (!e) return '';
    return '<span class="ev ev-' + k + '"><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>' + e.mk + '</span>';
  };
  /* the pillar glyph: the 7/8 bar (2 + 2 + 3) with the pillar's group filled — I, II or III */
  J.glyph = function (pillar) {
    return '<span class="pg g' + pillar + '" aria-hidden="true"><i></i><i></i><b></b><i></i><i></i><b></b><i></i><i></i><i></i></span>';
  };
  J.cite = function (ids) {   /* (Author, year; Author, year) from ref ids, or a literal string */
    if (!ids) return '';
    if (typeof ids === 'string') return ids;
    return ids.map(function (id) { var r = J.REFS[id]; return r ? r.cite : id; }).join('; ');
  };
  J.doiShort = function (doi) { return doi ? 'doi.org/' + doi : ''; };

  /* =================================================================
     CAROUSEL TEMPLATES — 4:5, 1080 × 1350. Units are cqi (1cqi = 10.8 px at export).
     Every slide: 8cqi margin, footer = pillar glyph · label · counter. Nothing sits above a headline.
     ================================================================= */
  function ft(p, left, right) {
    return '<div class="ft">' + J.glyph(p.pillar) + '<span class="fl">' + left + '</span><span class="fr">' + right + '</span></div>';
  }
  function evcite(s) {
    var out = '';
    if (s.ev) out += J.ev(s.ev);
    if (s.c) out += '<span class="ci">' + J.esc(J.cite(s.c)) + '</span>';
    return out ? '<div class="evc">' + out + '</div>' : '';
  }
  /* cover headline size: as large as the longest word allows, at most four lines */
  function headSize(html, cap, width) {
    var t = J.strip(html), longest = 0, w = width || 84;
    t.split(/\s+/).forEach(function (x) { longest = Math.max(longest, x.length); });
    var s = Math.min(cap || (t.length <= 6 ? 26 : 21), w / (Math.max(longest, 1) * 0.5));
    if (t.length * 0.5 * s / w > 3.6) s = 3.6 * w / (t.length * 0.5);
    return s.toFixed(1);
  }
  function hsize(html) {
    var t = J.strip(html), longest = 0;
    t.split(/\s+/).forEach(function (w) { longest = Math.max(longest, w.length); });
    return Math.min(t.length > 34 ? 7.2 : 8.4, 84 / (Math.max(longest, 1) * 0.5)).toFixed(1);
  }
  function H(html) { return '<h3 class="q hd" style="font-size:' + hsize(html) + 'cqi">' + html + '</h3>'; }
  function li(items) {
    return '<ol class="li">' + items.map(function (x) {
      var t = typeof x === 'string' ? x : x.t;
      var c = typeof x === 'string' ? '' : (x.c ? ' <span class="ci">(' + J.esc(J.cite(x.c)) + ')</span>' : '');
      return '<li><span>' + t + c + '</span></li>';
    }).join('') + '</ol>';
  }
  J.FMT = {
    text:    { mk: 'текст', en: 'long read', key: 'text' },
    study:   { mk: 'приказ на студија', en: 'study summary', key: 'study' },
    concept: { mk: 'поим', en: 'concept', key: 'concept' },
    myth:    { mk: 'мит или наука', en: 'myth vs science', key: 'myth' }
  };

  var T = J.T = {
    /* ---- covers: one per format ---- */
    'cover-text': function (s, p) {
      return '<div class="pc tp cover">' + h.mark(7) + '<div class="push">' +
        '<h2 class="q cv" style="font-size:' + headSize(s.h, s.size) + 'cqi">' + s.h + '</h2>' +
        '<p class="dek">' + s.dek + '</p></div>' + ft(p, 'текст · ' + p.slides.length + ' слајда', '→') + '</div>';
    },
    'cover-study': function (s, p) {
      return '<div class="pc tp cover">' +
        '<div class="specimen"><span class="tk a"></span><span class="tk b"></span><span class="tk c"></span><span class="tk d"></span>' +
        '<h2 class="q cv" style="font-size:' + headSize(s.h, s.size || 19, 72) + 'cqi">' + s.h + '</h2>' +
        '<p class="dek">' + s.dek + '</p>' +
        '<p class="spec-c">' + s.cite + '</p></div>' +
        ft(p, 'приказ на студија', '→') + '</div>';
    },
    'cover-concept': function (s, p) {
      return '<div class="pc tp cover">' + h.mark(7) + '<div class="push dict">' +
        '<h2 class="q cv" style="font-size:' + headSize(s.h, s.size || 19) + 'cqi">' + s.h + '</h2>' +
        '<p class="en"><em>(англ. ' + s.en + ')</em></p>' +
        '<p class="dek">' + s.dek + '</p></div>' +
        ft(p, 'поим · ' + s.no, '→') + '</div>';
    },
    'cover-myth': function (s, p) {
      return '<div class="pc tp cover myth"><span class="qm" aria-hidden="true">„</span><div class="push">' +
        '<h2 class="q cv claim" style="font-size:' + headSize(s.h, s.size || 15) + 'cqi">' + s.h + '</h2>' +
        '<p class="dek">' + s.dek + '</p></div>' +
        ft(p, 'мит или наука?', '→') + '</div>';
    },

    /* ---- inner slides ---- */
    text: function (s, p, i) {
      return '<div class="pc tp">' + H(s.h) + '<p class="body b">' + s.p + '</p>' +
        '<div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    num: function (s, p, i) {
      return '<div class="pc tp">' + '<p class="big" style="font-size:' + (s.size || (J.strip(s.num).length > 7 ? 17 : 24)) + 'cqi">' + s.num + '</p>' +
        '<h3 class="q hd sm">' + s.h + '</h3><p class="body b">' + s.p + '</p>' +
        '<div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    list: function (s, p, i) {
      return '<div class="pc tp">' + H(s.h) + li(s.items) + '<div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    grid8: function (s, p, i) {
      return '<div class="pc tp">' + H(s.h) + '<ol class="g8">' + s.items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' +
        (s.p ? '<p class="body b" style="margin-top:5cqi">' + s.p + '</p>' : '') +
        '<div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    evlist: function (s, p, i) {
      return '<div class="pc tp">' + H(s.h) + '<div class="evl">' + s.items.map(function (x) {
        return '<div class="evi"><p class="body b">' + x.t + '</p><div class="evc">' + (x.ev ? J.ev(x.ev) : '') + (x.c ? '<span class="ci">' + J.esc(J.cite(x.c)) + '</span>' : '') + '</div></div>';
      }).join('') + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    card: function (s, p, i) {
      return '<div class="pc tp">' + H(s.h) + '<dl class="sc">' + s.rows.map(function (r) {
        return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
      }).join('') + '</dl><div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    bars: function (s, p, i) {
      return '<div class="pc tp">' + H(s.h) + '<div class="hb">' + s.bars.map(function (b) {
        return '<div class="r"><span class="l">' + b[0] + '</span><span class="v">' + b[2] + '</span><span class="t"><i style="width:' + b[1] + '%"></i></span></div>';
      }).join('') + '</div><p class="body b">' + s.p + '</p><div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    compare: function (s, p, i) {
      return '<div class="pc tp">' + (s.h ? H(s.h) : '') + '<div class="cmp">' + [s.a, s.b].map(function (x) {
        return '<div><h4 class="q">' + x.h + '</h4><p class="body b">' + x.p + '</p></div>';
      }).join('') + '</div>' + (s.p ? '<p class="body b cmp-p">' + s.p + '</p>' : '') +
        '<div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    verdict: function (s, p, i) {
      return '<div class="pc tp verdict"><div class="stamp' + (s.v === 'мит' ? ' myth' : '') + '"><span>' + s.v + '</span></div>' +
        (s.sub ? '<p class="vsub">' + s.sub + '</p>' : '') +
        '<h3 class="q hd" style="font-size:' + hsize(s.h) + 'cqi">' + s.h + '</h3>' +
        '<div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    def: function (s, p, i) {
      return '<div class="pc tp">' + H(s.h) + '<p class="body b xl">' + s.p + '</p>' + (s.note ? '<p class="body note">' + s.note + '</p>' : '') +
        '<div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    known: function (s, p, i) {
      function blk(t, arr, cls) { return '<div class="kn ' + cls + '"><h4 class="q">' + t + '</h4>' + li(arr) + '</div>'; }
      return '<div class="pc tp">' + blk('Што знаеме', s.known, 'yes') + blk('Што сè уште не знаеме', s.unknown, 'no') +
        (s.not ? '<p class="body not">' + s.not + '</p>' : '') +
        (s.help ? '<div class="push"><p class="help">' + s.help + '</p></div>' : '') + ft(p, 'јаснота', i) + '</div>';
    },
    takeaway: function (s, p, i) {
      return '<div class="pc tp">' + H(s.h) + li(s.items) + '<div class="push">' + evcite(s) + '</div>' + ft(p, 'јаснота', i) + '</div>';
    },
    /* last slide, always: Извори. Paper, short APA, DOI in mono. Splits itself above 6 references. */
    sources: function (s, p, i) {
      var refs = s.ids.map(function (id) { return J.REFS[id]; }).filter(Boolean);
      var size = refs.length <= 4 ? 3.4 : 2.95;
      return '<div class="pc tp src">' + '<h3 class="q hd">' + (s.cont ? 'Извори <em>(продолжение)</em>' : 'Извори') + '</h3>' +
        '<ol class="refs" style="--rs:' + size + 'cqi">' + refs.map(function (r) {
          return '<li><span class="r">' + J.esc(r.slide) + (r.doi ? ' <span class="doi">' + J.doiShort(r.doi) + '</span>' : '') + '</span></li>';
        }).join('') + '</ol>' +
        '<div class="push">' + (s.eth ? '<p class="eth">' + s.eth + '</p>' : '') + (s.more ? '<p class="more">' + s.more + '</p>' : '') + '</div>' +
        ft(p, 'јаснота', i) + '</div>';
    }
  };

  /* =================================================================
     ALT TEXT (MK) — generated from the same data, so it always says what the slide says.
     ================================================================= */
  var TONE_MK = { ink: 'Црна позадина', staff: 'Црна позадина со тенки линии од нотен систем', paper: 'Светла (хартиена) позадина' };
  function a(t) { return J.strip(t).replace(/\s+/g, ' ').trim(); }
  function altFor(s, p, n, N, tone) {
    var bits = ['Слајд ' + n + ' од ' + N + '. ' + TONE_MK[(tone === 'staff' && n > 1) ? 'ink' : tone] + '.'];
    var evt = function (x) { return (x.ev ? ' Ознака: ' + J.EV[x.ev].mk + '.' : '') + (x.c ? ' Извор: ' + J.cite(x.c) + '.' : ''); };
    switch (s.t) {
      case 'cover-text': case 'cover-study': case 'cover-concept':
        bits.push('Насловна. Голем наслов: ' + a(s.h) + '.' + (s.en ? ' (англ. ' + s.en + ').' : '') + ' Поднаслов: ' + a(s.dek) + '.' + (s.cite ? ' ' + a(s.cite) + '.' : '')); break;
      case 'cover-myth':
        bits.push('Насловна. Тврдење во наводници: ' + a(s.h) + ' Под него: ' + a(s.dek)); break;
      case 'num':
        bits.push('Голема бројка: ' + a(s.num) + '. ' + a(s.h) + '. ' + a(s.p) + evt(s)); break;
      case 'list': case 'takeaway':
        bits.push('Наслов: ' + a(s.h) + '. Листа: ' + s.items.map(function (x) { return a(typeof x === 'string' ? x : x.t); }).join(' ') + evt(s)); break;
      case 'grid8':
        bits.push('Наслов: ' + a(s.h) + '. Осум нумерирани ставки: ' + s.items.map(a).join(', ') + '.' + (s.p ? ' ' + a(s.p) : '') + evt(s)); break;
      case 'evlist':
        bits.push('Наслов: ' + a(s.h) + '. ' + s.items.map(function (x) { return a(x.t) + evt(x); }).join(' ')); break;
      case 'card':
        bits.push('Картичка на студијата. ' + s.rows.map(function (r) { return a(r[0]) + ': ' + a(r[1]) + '.'; }).join(' ') + evt(s)); break;
      case 'bars':
        bits.push('Наслов: ' + a(s.h) + '. Хоризонтални столбови: ' + s.bars.map(function (b) { return a(b[0]) + ' ' + a(b[2]); }).join(', ') + '. ' + a(s.p) + evt(s)); break;
      case 'compare':
        bits.push((s.h ? 'Наслов: ' + a(s.h) + '. ' : '') + 'Две колони. ' + a(s.a.h) + ': ' + a(s.a.p) + ' ' + a(s.b.h) + ': ' + a(s.b.p) + (s.p ? ' ' + a(s.p) : '') + evt(s)); break;
      case 'verdict':
        bits.push('Печат со пресуда: ' + a(s.v).toUpperCase() + '.' + (s.sub ? ' ' + a(s.sub) + '.' : '') + ' ' + a(s.h) + evt(s)); break;
      case 'def':
        bits.push('Наслов: ' + a(s.h) + '. ' + a(s.p) + (s.note ? ' ' + a(s.note) : '') + evt(s)); break;
      case 'known':
        bits.push('Што знаеме: ' + s.known.map(function (x) { return a(typeof x === 'string' ? x : x.t); }).join(' ') + ' Што сè уште не знаеме: ' + s.unknown.map(function (x) { return a(typeof x === 'string' ? x : x.t); }).join(' ') + (s.not ? ' ' + a(s.not) : '') + (s.help ? ' ' + a(s.help) : '')); break;
      case 'sources':
        bits.push('Извори: ' + s.ids.map(function (id) { var r = J.REFS[id]; return r ? r.cite : id; }).join('; ') + '.' + (s.eth ? ' ' + a(s.eth) : '')); break;
      default:
        bits.push('Наслов: ' + a(s.h) + '. ' + a(s.p || '') + evt(s));
    }
    if (s.bg) bits.push('Во позадина: затемнета атмосферска илустрација (' + s.bg.alt + ').');
    return bits.join(' ').replace(/\s+/g, ' ').replace(/([?!.…“])\./g, '$1').replace(/\.\./g, '.');
  }

  /* =================================================================
     COMPOSE — structured post → rendered slides
     tone by pillar: I = ink · II = ink + stave lines (cover) · III = paper. Sources slide is always paper.
     ================================================================= */
  J.toneOf = function (p) { return p.pillar === 3 ? 'paper' : p.pillar === 2 ? 'staff' : 'ink'; };
  J.compose = function (p) {
    var src = [];
    p.src.forEach(function (s) {
      if (s.t === 'sources' && s.ids.length > 6) {       /* split long lists, keep the slide readable */
        var half = Math.ceil(s.ids.length / 2);
        src.push(Object.assign({}, s, { ids: s.ids.slice(0, half), eth: '', more: '' }));
        src.push(Object.assign({}, s, { ids: s.ids.slice(half), cont: true }));
      } else src.push(s);
    });
    p.slides = src.map(function () { return {}; });   /* length is known before rendering (covers print it) */
    var N = src.length, tone = J.toneOf(p);
    src.forEach(function (s, k) {
      var light = tone === 'paper' || s.t === 'sources';
      var counter = J.pad(k + 1) + ' / ' + J.pad(N);
      var inner = T[s.t](s, p, counter);
      var bg = '';
      if (s.bg) bg = h.ph(s.bg.kind, s.bg.slot) + '<span class="veil" aria-hidden="true"></span>';
      var staff = (tone === 'staff' && k === 0) ? '<span class="staff" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>' : '';
      p.slides[k] = {
        light: light,
        cls: 'tv t-' + s.t + ' tone-' + (s.t === 'sources' ? 'paper' : tone) + (bg ? ' has-bg' : ''),
        html: bg + staff + inner,
        alt: altFor(s, p, k + 1, N, s.t === 'sources' ? 'paper' : tone),
        t: s.t
      };
    });
    return p;
  };

  /* ---------- renderers ---------- */
  /* ratio: '45' (4:5 feed), '34' (3:4 grid crop), '916' (story) */
  J.slide = function (s, ratio, extraCls) {
    var cls = 'post r' + (ratio || '45') + (s.light ? ' light' : '') + (s.cls ? ' ' + s.cls : '') + (extraCls ? ' ' + extraCls : '');
    return '<div class="' + cls + '" role="img" aria-label="' + J.esc(s.alt || '') + '">' + s.html + '</div>';
  };
  J.cover = function (p) { return p.slides[0]; };
  J.fmtLabel = function (p) { return J.FMT[p.fmt].mk + ' · ' + p.slides.length + ' слајда'; };
  J.post = function (id) {
    var all = J.POSTS || [];
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
  /* avatar: the mark on ink. The account is the platform, not a person: no portrait slot. */
  J.avatarInner = function () { return '<span class="mark" aria-hidden="true"></span>'; };

  /* =================================================================
     STORY FRAMES — 9:16, 1080 × 1920. Top and bottom 13% stay clear for the interface.
     ================================================================= */
  function st(inner, cls) { return '<div class="pc storypc' + (cls ? ' ' + cls : '') + '">' + inner + '</div>'; }
  function linkSt(t) { return '<span class="lnk">' + J.icon('link') + t + '</span>'; }
  var SF = J.SF = {
    teaser: function (f) {
      var p = J.post(f.post);
      var bg = f.bg ? h.ph(f.bg.kind, f.bg.slot) + '<span class="veil" aria-hidden="true"></span>' : '';
      return { cls: f.bg ? 'has-bg' : '', alt: 'Сторија, тема на неделата. ' + a(f.q) + ' ' + 'Вечерва во ' + J.POST_TIME + ': ' + a(p.title) + '.' + (f.bg ? ' Во позадина: атмосферска илустрација (' + f.bg.alt + ').' : ''),
        html: bg + st(h.mark(9) + '<div class="push"><p class="q s">' + f.q + '</p>' +
          '<p class="body b" style="margin-top:5cqi">Вечерва во ' + J.POST_TIME + ': нов карусел.</p>' +
          '<div class="tease-card">' + J.glyph(p.pillar) + '<span>' + p.title + '</span></div></div>') };
    },
    share: function (f) {
      var p = J.post(f.post), c = J.cover(p);
      return { cls: 'sharest', alt: 'Сторија што ја споделува објавата: ' + a(p.title) + '. ' + a(f.note || ''),
        html: st('<p class="share-note">' + (f.note || 'Нов карусел') + '</p>' +
          '<div class="share-card"><div class="share-head"><span class="av"><span class="mark" aria-hidden="true"></span></span>jasnota</div>' +
          J.slide(c, '45', 'mini') + '</div>' + (f.sticker ? '<div style="align-self:center">' + f.sticker + '</div>' : ''), 'center') };
    },
    source: function (f) {
      var r = J.REFS[f.id] || {};
      return { light: true, cls: 'paperst', alt: 'Сторија, извор на неделата. ' + (r.cite || '') + '. ' + a(f.line) + (f.ev ? ' Ознака: ' + J.EV[f.ev].mk + '.' : '') + ' Линк до DOI.',
        html: st('<p class="q s">Извор на <em>неделата</em></p>' +
          '<div class="src-card"><p class="sc-c">' + J.esc(r.cite || '') + '</p><p class="sc-t">' + J.esc(r.short || '') + '</p>' +
          '<p class="body b">' + f.line + '</p>' + (f.ev ? '<div class="evc">' + J.ev(f.ev) + '</div>' : '') + '</div>' +
          '<div class="push">' + linkSt(J.doiShort(r.doi)) + '</div>') };
    },
    question: function (f) {
      return { alt: 'Сторија со кутија за прашања: ' + a(f.q) + ' ' + a(f.note || ''),
        html: st(h.mark(9) + '<div class="push"><div class="sticker"><p class="sq">' + f.q + '</p><div class="field">' + (f.ph || 'напиши прашање…') + '</div></div>' +
          (f.note ? '<p class="meta" style="margin-top:4cqi;text-align:center">' + f.note + '</p>' : '') + '</div>') };
    },
    poll: function (f) {
      return { alt: 'Сторија со анкета: ' + a(f.q) + ' Опции: ' + a(f.a) + '; ' + a(f.b) + '.',
        html: st('<div style="margin-block:auto"><div class="sticker"><p class="sq">' + f.q + '</p><div class="opts">' +
          '<div class="opt"><span class="bar" style="width:' + f.pa + '%"></span><span>' + f.a + '</span><span class="pct">' + f.pa + '%</span></div>' +
          '<div class="opt"><span class="bar" style="width:' + (100 - f.pa) + '%"></span><span>' + f.b + '</span><span class="pct">' + (100 - f.pa) + '%</span></div></div></div>' +
          '<p class="meta" style="margin-top:4cqi;text-align:center">' + (f.note || 'резултатите се пример') + '</p></div>') };
    },
    quiz: function (f) {
      return { alt: 'Сторија со квиз: ' + a(f.q) + ' Опции: ' + f.opts.map(a).join('; ') + '. Точен одговор: ' + a(f.opts[f.right]) + '.',
        html: st(h.mark(9, 'color:var(--ash)') + '<div class="push"><div class="sticker quiz"><p class="sq">' + f.q + '</p><div class="opts">' +
          f.opts.map(function (o, i) { return '<div class="opt' + (i === f.right ? ' right' : '') + '"><span class="l">' + 'АБВ'[i] + '</span><span>' + o + '</span></div>'; }).join('') + '</div></div>' +
          (f.note ? '<p class="meta" style="margin-top:4cqi;text-align:center">' + f.note + '</p>' : '') + '</div>') };
    },
    answers: function (f) {
      return { alt: 'Сторија: ' + a(f.h) + ' Три анонимни одговори од читатели, објавени со дозвола (во прототипот: празни места).',
        html: st('<p class="q s">' + f.h + '</p><div class="push replies"><p class="rq">' + f.q + '</p>' +
          f.items.map(function (x) { return '<p class="ra">' + x + '</p>'; }).join('') +
          '<p class="meta" style="margin-top:2cqi">анонимно, само со дозвола на авторот на прашањето</p></div>') };
    },
    method: function () {
      var rows = ['strong', 'moderate', 'early', 'open'].map(function (k) {
        var d = { strong: 'доследни наоди од повеќе мета-анализи или многу репликации', moderate: 'добри прегледи или повеќе студии, но со ограничувања', early: 'поединечни или мали студии, нереплицирани наоди', open: 'доказите се противречни или недостигаат' }[k];
        return '<div class="m-row">' + J.ev(k) + '<p class="body">' + d + '</p></div>';
      }).join('');
      return { alt: 'Сторија: Како работиме. Секое тврдење добива ознака за доказите: силни докази, умерени докази, рани/ограничени докази, отворено прашање, со објаснување за секоја.',
        html: st('<p class="q s">Колку <em>сигурно</em> знаеме?</p><p class="body b" style="margin-top:3cqi">Секое тврдење на Јаснота носи ознака.</p><div class="push m-list">' + rows + '</div>') };
    },
    process: function () {
      var steps = ['прашање', 'пребарување извори', 'проверка на наодите', 'пишување', 'референци', 'уредување и обликување'];
      return { alt: 'Сторија: Како настанува секоја објава, во шест чекори: ' + steps.join(', ') + '. Секоја бројка е проверена во изворот.',
        html: st('<p class="q s">Од прашање до <em>објава</em></p><ol class="steps6">' + steps.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' +
          '<div class="push"><p class="body b">Секоја бројка е проверена во изворот, не во туѓо препричување.</p></div>') };
    },
    corrections: function () {
      return { alt: 'Сторија: Кога грешиме. Грешките ги исправаме видливо, со датум. Пријави грешка во порака.',
        html: st('<p class="q s">Кога <em>грешиме</em></p><div class="push"><p class="body b">Грешките ги исправаме брзо и видливо: во коментар под објавата, со датум и со тоа што е сменето. Ако нова студија ја менува сликата, ја менуваме и ознаката за доказите.</p>' +
          '<p class="body b" style="margin-top:4cqi">Забележа грешка? Напиши ни во порака.</p></div>') };
    },
    about: function () {
      return { alt: 'Сторија: За Јаснота. Јаснота е информативна и едукативна платформа за поврзаноста меѓу музиката, психолошкото искуство и однесувањето, со научно засновани текстови и јасни извори. Уредува: Јасна Димитровска, психолог.',
        html: st(h.mark(11) + '<div class="push"><p class="q s">Психологијата зад <em>музиката</em></p>' +
          '<p class="body b" style="margin-top:4cqi">Информативна и едукативна платформа за поврзаноста меѓу музиката, психолошкото искуство и однесувањето. Научно засновани текстови, со јасни извори, на македонски.</p>' +
          '<p class="meta" style="margin-top:5cqi">уредува: Јасна Димитровска, психолог</p></div>') };
    },
    care: function () {
      return { alt: 'Сторија: Јаснота објаснува, не лекува. Ова не е дијагноза, терапија ни индивидуален совет. Ако ти е тешко, разговарај со психолог, психотерапевт или лекар. Во итна опасност: 112.',
        html: st('<p class="q s">Објаснуваме. Не <em>лекуваме.</em></p>' +
          '<p class="body b" style="margin-top:5cqi">Содржините на Јаснота не се дијагноза, терапија ни индивидуален совет, и не нудиме сесии.</p>' +
          '<div class="push"><p class="body b">Ако ти е тешко, разговарај со психолог, психотерапевт или лекар.</p><p class="body b" style="margin-top:3cqi">Во итна опасност: <b>112</b>.</p></div>') };
    },
    contact: function () {
      return { alt: 'Сторија: Соработки. Истражувачи, музички педагози, музикотерапевти и институции: пишете на zdravo@jasnota.mk.',
        html: st('<p class="q s">Работиш на ова <em>и ти?</em></p><p class="body b" style="margin-top:4cqi">Истражувачи, музички педагози, музикотерапевти, психолози, ансамбли и институции: пишете ни за соработка, извори или исправки.</p>' +
          '<div class="push">' + linkSt('zdravo@jasnota.mk') + '</div>') };
    },
    glossary: function (f) {
      return { alt: 'Сторија: Поимник на Јаснота. Сите поими на едно место, на веб-страницата. Линк-налепница.',
        html: st('<p class="q s">Поимник</p><ol class="jlist">' + f.items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol><div class="push">' + linkSt('jasnota.mk · поимник') + '</div>') };
    }
  };
  J.frame = function (f) {   /* story item → { html, alt, light, cls } */
    if (!f) return null;
    if (f._r) return f._r;
    var r = SF[f.k](f);
    f._r = r;
    return r;
  };
  J.story = function (f) {
    var r = J.frame(f); if (!r) return '';
    return '<div class="post r916 story' + (r.light ? ' light' : '') + (r.cls ? ' ' + r.cls : '') + '" role="img" aria-label="' + J.esc(r.alt || '') + '">' + r.html + '</div>';
  };

  /* =================================================================
     CAPTIONS — Macedonian in full, the 7/8 divider, one English line, 3–6 hashtags
     ================================================================= */
  J.DIVIDER = '·· ·· ···';
  J.publishedCaption = function (p) {
    return p.caption.mk + '\n\n' + J.DIVIDER + '\n' + 'EN: ' + p.caption.en + '\n\n' + p.tags.map(function (t) { return '#' + t; }).join(' ');
  };
  J.link = function (path) { return J.root + path; };

  /* ---------- photo slots ---------- */
  var cache = {};   // slot -> undefined (unknown) | 'pending' | url | false
  function setPhoto(el, url) {
    if (el.classList.contains('has-photo')) return;
    el.style.backgroundImage = 'url("' + url + '")';
    el.classList.add('has-photo');
  }
  /* /photos/manifest.json (written by `node website/tools/build-journal.mjs`) says which slots have a photo,
     so we never request a file that isn't there. */
  var manifest = null, waiting = [];
  fetch(J.photoBase + 'manifest.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (m) { manifest = m || {}; var w = waiting; waiting = []; w.forEach(function (s) { probe(s); }); });
  function probe(slot) {
    if (manifest === null) { if (waiting.indexOf(slot) < 0) waiting.push(slot); cache[slot] = 'pending'; return; }
    if (!manifest[slot]) { cache[slot] = false; return; }
    cache[slot] = 'pending';
    var url = J.photoBase + manifest[slot];
    var img = new Image();
    img.onload = function () {
      cache[slot] = url;
      document.querySelectorAll('[data-slot="' + slot + '"]').forEach(function (el) { setPhoto(el, url); });
    };
    img.onerror = function () { cache[slot] = false; };
    img.src = url;
  }
  J.applyPhotos = function (root) {
    (root || document).querySelectorAll('[data-slot]').forEach(function (el) {
      var s = el.getAttribute('data-slot');
      if (!s) return;
      if (cache[s] === undefined) probe(s);
      else if (cache[s] && cache[s] !== 'pending') setPhoto(el, cache[s]);
    });
  };

  J.copy = function (text, btn) {
    function done() { if (btn) { var t = btn.textContent; btn.textContent = 'Копирано'; setTimeout(function () { btn.textContent = t; }, 1600); } }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    else {
      var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      ta.remove();
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    injectSprite();
    J.applyPhotos(document);
    var t = null;
    new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(function () { J.applyPhotos(document); }, 30);
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
