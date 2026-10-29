/* Јаснота — Instagram moodboard interactions: beat overlay, lightbox, launch grid. */
(function () {
  var feed = document.getElementById('feed');
  if (!feed) return;
  var posts = Array.prototype.slice.call(feed.querySelectorAll('.post'));
  var groupLabel = { a: 'group of 2 · ·', b: '· group of 2 ·', c: '· · group of 3' };

  /* beat overlay + mini schema */
  var mini = document.getElementById('mini');
  posts.forEach(function (p) {
    var d = p.dataset;
    var b = document.createElement('span');
    b.className = 'beat';
    b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<span>#' + d.n + ' · bar ' + d.bar + '</span><span class="gl">' + groupLabel[d.g] + '</span><span class="big">' + d.b + '</span>';
    p.appendChild(b);
    p.setAttribute('tabindex', '0');
    p.setAttribute('role', 'button');
    p.setAttribute('aria-label', 'Post ' + d.n + ', ' + d.fmt);
    if (mini) {
      var i = document.createElement('i');
      i.dataset.g = d.g;
      i.dataset.b = d.b;
      if (p.classList.contains('light')) i.className = 'l';
      mini.appendChild(i);
    }
  });

  var t = document.getElementById('beatToggle');
  if (t) t.addEventListener('click', function () {
    var on = feed.classList.toggle('show-beat');
    t.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  var g = document.getElementById('guideToggle');
  var tpl = document.getElementById('tpl');
  if (g && tpl) g.addEventListener('click', function () {
    var on = tpl.classList.toggle('show-guides');
    g.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  /* launch grid: posts 9 → 1, the profile on Mon 16 Nov */
  var lg = document.getElementById('launchGrid');
  if (lg) posts.filter(function (p) { return +p.dataset.n <= 9; }).forEach(function (p) {
    var c = p.cloneNode(true);
    c.setAttribute('aria-label', 'Post ' + p.dataset.n);
    c.addEventListener('click', function () { open(p); });
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(p); } });
    lg.appendChild(c);
  });

  /* lightbox */
  var lb = document.getElementById('lb');
  var stage = document.getElementById('lbStage');
  var last = null;
  function open(p) {
    if (!lb || !lb.showModal) return;
    last = document.activeElement;
    stage.innerHTML = '';
    var c = p.cloneNode(true);
    c.removeAttribute('tabindex'); c.removeAttribute('role');
    var bt = c.querySelector('.beat'); if (bt) bt.remove();
    stage.appendChild(c);
    var d = p.dataset;
    document.getElementById('lbMeta').textContent = '#' + (d.n < 10 ? '0' + d.n : d.n) + '  ·  ' + d.fmt + '  ·  ' + d.pillar;
    var cap = p.querySelector('.cap');
    document.getElementById('lbCap').textContent = cap ? cap.textContent.trim() : '';
    document.getElementById('lbWhy').textContent = d.why || '';
    lb.showModal();
  }
  posts.forEach(function (p) {
    p.addEventListener('click', function () { open(p); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(p); } });
  });
  if (lb) {
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { if (last && last.focus) last.focus(); });
  }
})();
