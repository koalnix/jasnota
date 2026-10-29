/* Јаснота — hub page (index.html): the profile mock-up, pillar code overlay, pillars, tones,
   story gallery and the post lightbox. Requires render.js + refs.js + data.js (+ pages.js). */
(function () {
  'use strict';
  var J = window.J, esc = J.esc, $ = function (s) { return document.getElementById(s); };
  if (!$('feed')) return;

  /* ---------- profile header ---------- */
  $('moodAv').innerHTML = J.avatarInner();
  $('moodStats').innerHTML = '<div><b>' + J.STATS.posts + '</b><span>објави</span></div><div><b>' + J.STATS.followers + '</b><span>следбеници</span></div><div><b>' + J.STATS.following + '</b><span>следи</span></div>';
  $('moodBio').innerHTML = '<p class="n">' + esc(J.NAME) + '</p><p class="cat">' + J.CATEGORY + '</p>' + J.BIO.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '<p class="link">' + J.LINK + '</p>';
  $('moodHl').innerHTML = J.HIGHLIGHTS.map(function (h) {
    return '<div class="hl"><div class="c"><div class="hlc tone-' + h.tone + '">' + J.hlSign(h) + '</div></div>' + h.label + '</div>';
  }).join('');

  /* ---------- grid + schema ---------- */
  var feed = $('feed');
  J.buildMoodGrid(feed);
  var mini = $('mini');
  if (mini) mini.innerHTML = J.POSTS.slice().sort(function (a, b) { return b.n - a.n; }).map(function (p) {
    return '<i class="t-' + J.toneOf(p) + '" data-b="' + J.PILLARS[p.pillar].roman + '"></i>';
  }).join('');
  var t = $('codeToggle');
  if (t) t.addEventListener('click', function () {
    var on = feed.classList.toggle('show-code');
    t.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  /* ---------- pillars ---------- */
  var pm = $('pillarMount');
  if (pm) pm.innerHTML = [1, 2, 3].map(function (k) {
    var P = J.PILLARS[k], posts = J.POSTS.filter(function (p) { return p.pillar === k; });
    return '<article class="pillar">' +
      '<div class="name"><h3 class="display" lang="mk">' + P.mk.replace(/(\S+)$/, '<em>$1</em>') + '</h3><p class="en">' + P.en + '</p><p class="en">' + P.note + '</p>' +
      '<p class="mix"><b>' + posts.length + ' / 12</b> weeks · tone: ' + J.TONES[P.tone].en.toLowerCase() + '</p></div>' +
      '<div class="what"><div class="pthumbs">' + posts.map(function (p) { return '<a href="month/#' + p.id + '" aria-label="' + esc('Недела ' + p.n + ': ' + p.title) + '">' + J.slide(J.cover(p), '34', 'hide-tags') + '</a>'; }).join('') + '</div></div>' +
      '<div class="ideas-col"><ul class="ideas">' + posts.map(function (p) {
        return '<li><span class="t" lang="mk">' + esc(p.title.split(':')[0]) + '</span><span class="f">' + J.pad(p.n) + ' · ' + J.FMT[p.fmt].mk + '</span><span class="d" lang="mk">' + esc(p.rq) + '</span></li>';
      }).join('') + '</ul></div></article>';
  }).join('');

  /* ---------- tones ---------- */
  var tm = $('toneMount');
  if (tm) tm.innerHTML = ['w03', 'w01', 'w02'].map(function (id) { return J.slide(J.cover(J.post(id)), '45', 'atom'); }).join('');

  /* ---------- story gallery: one of every frame design ---------- */
  var sm = $('storyMount');
  if (sm) {
    var w1 = J.post('w01'), w4 = J.post('w04'), w7 = J.post('w07'), w8 = J.post('w08');
    var frames = [
      [w1.stories[0].f, 'тема на неделата · Mon 12:00 · atmosphere image is an AI stand-in'],
      [w1.stories[1].f, 'репост на каруселот · Mon 19:35'],
      [w1.stories[2].f, 'извор на неделата · Wed 12:00 · DOI link sticker'],
      [w1.stories[3].f, 'кутија за прашања · Fri 12:00'],
      [w4.stories[3].f, 'анкета: следниот мит'],
      [w7.stories[3].f, 'квиз'],
      [w8.stories[3].f, 'ваши прашања · anonymous, with permission'],
      [{ k: 'method' }, 'highlight · Како работиме'],
      [{ k: 'process' }, 'highlight · Како работиме'],
      [{ k: 'about' }, 'highlight · За Јаснота'],
      [{ k: 'care' }, 'highlight · За Јаснота · referral'],
      [{ k: 'contact' }, 'highlight · За Јаснота · professional contacts']
    ];
    sm.innerHTML = frames.map(function (f) { return '<figure>' + J.story(f[0]) + '<figcaption>' + esc(f[1]) + '</figcaption></figure>'; }).join('');
  }

  /* ---------- lightbox: the whole carousel + caption ---------- */
  var lb = $('lb'), stage = $('lbStage'), last = null;
  function open(id, from) {
    if (!lb || !lb.showModal) return;
    var p = J.post(id); last = from;
    stage.innerHTML = p.slides.map(function (s) { return J.slide(s, '45'); }).join('');
    stage.scrollLeft = 0;
    $('lbMeta').textContent = J.pad(p.n) + '  ·  ' + J.fmtDate(p.date, 'mk', true) + ' ' + p.time + '  ·  ' + J.fmtLabel(p) + '  ·  столб ' + J.PILLARS[p.pillar].roman;
    $('lbCap').textContent = J.publishedCaption(p);
    $('lbWhy').textContent = p.why;
    lb.showModal();
  }
  feed.addEventListener('click', function (e) { var b = e.target.closest('.tile'); if (b) open(b.getAttribute('data-id'), b); });
  if (lb) {
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { if (last && last.focus) last.focus(); });
  }
})();
