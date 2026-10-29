/* Јаснота — Instagram mini-site runtime.
   Shared by every page in /instagram/: icon sprite, slide / story / reel-frame renderers,
   caption builder, photo-slot loader.

   Photo slots: any element with data-slot="portrait" (etc.) is an art-directed placeholder.
   At runtime we read ../photos/manifest.json and load only the slots it lists (jpg or png). If one loads, the
   placeholder becomes the photo; otherwise the placeholder stays. */
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
  J.strip = function (s) { return String(s || '').replace(/<[^>]+>/g, ''); };
  var MON = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              mk: ['јан', 'фев', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'ное', 'дек'] };
  var DOW = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mk: ['нед', 'пон', 'вто', 'сре', 'чет', 'пет', 'саб'] };
  J.date = function (iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  J.fmtDate = function (iso, lang, long) {
    lang = lang || 'en';
    var d = J.date(iso);
    var s = DOW[lang][d.getDay()] + ' ' + d.getDate() + ' ' + MON[lang][d.getMonth()];
    return long ? s + ' ' + d.getFullYear() : s;
  };
  J.dow = function (iso, lang) { return DOW[lang || 'en'][J.date(iso).getDay()]; };
  J.pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------- markup helpers used by the data file ---------- */
  var h = J.h = {
    mark: function (w, st) { return '<span class="mark" aria-hidden="true" style="width:' + (w || 7) + 'cqi;' + (st || '') + '"></span>'; },
    meta: function (t, st, lang) { return '<p class="meta"' + (lang ? ' lang="' + lang + '"' : '') + (st ? ' style="' + st + '"' : '') + '>' + t + '</p>'; },
    q: function (t, cls, st, lang) { return '<p class="q ' + (cls || '') + '"' + (lang ? ' lang="' + lang + '"' : '') + (st ? ' style="' + st + '"' : '') + '>' + t + '</p>'; },
    mk: function (t, st) { return '<p class="q xs mkline" lang="mk"' + (st ? ' style="' + st + '"' : '') + '><em>' + t + '</em></p>'; },
    body: function (t, st, cls) { return '<p class="body ' + (cls || 'b') + '"' + (st ? ' style="' + st + '"' : '') + '>' + t + '</p>'; },
    row: function (a, b, st) { return '<div class="row"' + (st ? ' style="' + st + '"' : '') + '>' + a + b + '</div>'; },
    /* photo placeholder: kind = CSS drawing, slot = photo file to supply */
    ph: function (kind, slot, inner) {
      return '<div class="ph ' + kind + '"' + (slot ? ' data-slot="' + slot + '"' : '') + ' aria-hidden="true">' + (inner || '') +
        (slot ? '<span class="slot-tag">photo · ' + slot + '.jpg</span>' : '') + '</div>';
    },
    wave: function (st) {
      return '<svg class="g wave" viewBox="0 0 120 30" aria-hidden="true"' + (st ? ' style="' + st + '"' : '') + '><path d="M2 14.0V16.0M6 13.7V16.3M10 11.9V18.1M14 13.8V16.2M18 11.9V18.1M22 9.0V21.0M26 11.4V18.6M30 13.1V16.9M34 11.8V18.2M38 10.1V19.9M42 11.5V18.5M46 12.4V17.6M50 10.2V19.8M54 10.2V19.8M58 10.3V19.7M62 9.7V20.3M66 5.9V24.1M70 6.8V23.2M74 10.6V19.4M78 6.6V23.4M82 6.4V23.6M86 8.3V21.7M90 13.4V16.6M94 9.9V20.1M98 10.6V19.4M102 12.3V17.7M106 13.6V16.4M110 14.0V16.0M114 14.0V16.0M118 14.0V16.0"/></svg>';
    },
    rest: function (w, st) {
      return '<svg viewBox="0 0 40 24" aria-hidden="true" style="width:' + (w || 14) + 'cqi;' + (st || '') + '"><path d="M2 6h36" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="12" y="6" width="16" height="7" fill="currentColor"/></svg>';
    },
    b78: function (labels) {
      labels = labels || ['in', 'hold', 'out'];
      return '<div class="b78" aria-hidden="true">' +
        '<div><span class="d a"></span><span class="d"></span><p class="meta">' + labels[0] + '</p></div>' +
        '<div><span class="d a"></span><span class="d"></span><p class="meta">' + labels[1] + '</p></div>' +
        '<div><span class="d a c"></span><span class="d"></span><span class="d"></span><p class="meta">' + labels[2] + '</p></div></div>';
    },
    metronomes: function (st) {
      return '<svg class="g" viewBox="0 0 200 104" aria-hidden="true"' + (st ? ' style="' + st + '"' : '') + '><g class="stroke" stroke-width="1.2" stroke-linejoin="round"><path d="M30 94 L44 20 L60 20 L74 94 Z"/><path d="M126 94 L140 20 L156 20 L170 94 Z"/><path d="M52 84 L36 8"/><path d="M148 84 L164 8"/><path d="M8 98 H192" stroke-width="1"/></g><g class="stroke" stroke-width=".8" stroke-dasharray="2 3" style="color:#8c8a85"><path d="M52 84 L68 8"/><path d="M148 84 L132 8"/></g></svg>';
    },
    forks: function () {
      return '<svg class="g" viewBox="0 0 200 110" aria-hidden="true"><g class="stroke" stroke-width="2.4"><path d="M24 14 V44 A16 16 0 0 0 56 44 V14"/><path d="M40 8 V50"/><path d="M40 60 V100"/><path d="M144 14 V44 A16 16 0 0 0 176 44 V14"/><path d="M160 8 V50"/><path d="M160 60 V100"/></g><g class="stroke" stroke-width=".9" stroke-dasharray="2 4" style="color:#8c8a85"><path d="M70 30 Q100 18 130 30"/><path d="M74 42 Q100 32 126 42"/><path d="M78 54 Q100 46 122 54"/></g></svg>';
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
    '<symbol id="i-music" viewBox="0 0 24 24"><path d="M9 18V6l11-2v12" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="17.5" cy="16" r="2.5" fill="currentColor"/></symbol>' +
    '<symbol id="i-pinloc" viewBox="0 0 24 24"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.3" fill="currentColor"/></symbol>' +
    '<symbol id="i-sound" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>' +
    '<symbol id="i-rest" viewBox="0 0 40 24"><path d="M2 6h36" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="12" y="6" width="16" height="7" fill="currentColor"/></symbol>' +
    '</svg>';
  J.icon = function (id, cls) { return '<svg class="ico ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#i-' + id + '"/></svg>'; };
  function injectSprite() {
    if (!document.getElementById('i-car')) document.body.insertAdjacentHTML('afterbegin', SPRITE);
  }

  /* ---------- renderers ---------- */
  /* ratio: '45' (4:5 feed), '34' (3:4 grid), '916' (9:16 reel / story) */
  J.slide = function (s, ratio, extraCls) {
    var cls = 'post r' + (ratio || '45') + (s.light ? ' light' : '') + (extraCls ? ' ' + extraCls : '');
    return '<div class="' + cls + '" role="img" aria-label="' + J.esc(s.alt || '') + '">' + s.html + '</div>';
  };
  J.cover = function (p) { return p.fmt === 'reel' ? p.cover : p.slides[0]; };
  J.fmtLabel = function (p) {
    if (p.fmt === 'carousel') return 'Carousel · ' + p.slides.length + ' slides';
    if (p.fmt === 'reel') return 'Reel · 9:16 · ' + p.reel.length;
    return 'Single · 4:5';
  };
  J.fmtIcon = function (p) { return p.fmt === 'carousel' ? 'car' : p.fmt === 'reel' ? 'reel' : ''; };

  /* a reel frame: placeholder footage + burned-in on-screen text (EN, MK beneath) */
  J.reelFrame = function (shot, reel) {
    var bg = shot.art ? shot.art : h.ph(shot.ph || 'grainy', shot.slot || '');
    var os = '';
    if (shot.os && shot.os.en) {
      os = '<div class="os"><p class="os-en">' + shot.os.en + '</p>' + (shot.os.mk ? '<p class="os-mk" lang="mk">' + shot.os.mk + '</p>' : '') + '</div>';
    }
    return '<div class="post r916 frame' + (shot.light ? ' light' : '') + '" role="img" aria-label="' + J.esc('Reel frame ' + shot.t + ': ' + J.strip(shot.shot)) + '">' + bg +
      '<div class="pc reelpc">' + os + '<p class="meta tc">' + shot.t + '</p></div></div>';
  };

  /* story frame */
  J.story = function (f) {
    if (!f) return '';
    if (f.share) return J.shareFrame(f);
    return '<div class="post r916 story' + (f.light ? ' light' : '') + '" role="img" aria-label="' + J.esc(f.alt || '') + '">' + f.html + '</div>';
  };
  J.shareFrame = function (f) {
    var p = J.post(f.share);
    if (!p) return '';
    var c = J.cover(p);
    var note = f.note ? '<p class="share-note">' + f.note.en + (f.note.mk ? '<span lang="mk">' + f.note.mk + '</span>' : '') + '</p>' : '';
    return '<div class="post r916 story share" role="img" aria-label="' + J.esc('Story sharing the post: ' + p.title.en) + '">' +
      '<div class="pc" style="justify-content:center;gap:5cqi">' + note +
      '<div class="share-card"><div class="share-head"><span class="av"><span class="mark" aria-hidden="true"></span></span>jasnota</div>' +
      J.slide(c, p.fmt === 'reel' ? '34' : '45', 'mini') + '</div>' +
      (f.sticker || '') + '</div></div>';
  };

  /* caption as published: EN, the 7/8 divider, MK, hashtags */
  J.DIVIDER = '·· ·· ···';
  J.publishedCaption = function (p) {
    return p.caption.en + '\n\n' + J.DIVIDER + '\n\n' + p.caption.mk + '\n\n' + p.tags.map(function (t) { return '#' + t; }).join(' ');
  };
  J.post = function (id) {
    var all = J.POSTS || [];
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
  /* avatar: the mark on ink, replaced by profile.jpg when it exists */
  J.avatarInner = function () {
    return '<span class="mark" aria-hidden="true"></span><div class="ph ifphoto" data-slot="profile" aria-hidden="true"></div>';
  };
  /* highlight cover sign: a brand sign as a mask, or a typographic glyph */
  J.hlSign = function (hl) {
    if (hl.sign === 'pilcrow') return '<span class="pil">¶</span>';
    return '<span class="sg ' + hl.sign + '"></span>';
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
      document.dispatchEvent(new CustomEvent('jasnota:photo', { detail: { slot: slot, url: url } }));
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
  J.hasPhoto = function (slot) { return !!(cache[slot] && cache[slot] !== 'pending'); };

  /* ---------- language toggles (captions / bilingual blocks) ---------- */
  J.bindLangToggles = function (root) {
    (root || document).querySelectorAll('[data-langtoggle]').forEach(function (g) {
      if (g._bound) return; g._bound = true;
      var target = document.getElementById(g.getAttribute('data-langtoggle'));
      g.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          var l = b.getAttribute('data-l');
          g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          if (target) target.setAttribute('data-show', l);
        });
      });
    });
  };

  J.copy = function (text, btn) {
    function done() { if (btn) { var t = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = t; }, 1600); } }
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
