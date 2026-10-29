/* Brand book: page numbers, running footers, contents, cross-references. Runs before printing. */
window.JASNOTA_AFTER = function () {
  'use strict';
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var total = pages.length;
  var chapters = [], byKey = {};
  pages.forEach(function (p, i) {
    var n = i + 1;
    p.dataset.n = n;
    if (p.dataset.ref) byKey[p.dataset.ref] = n;
    var ch = p.dataset.ch;
    if (ch) {
      var last = chapters[chapters.length - 1];
      if (!last || last.ch !== ch) chapters.push(last = { ch: ch, name: p.dataset.chn, items: [] });
      last.items.push({ t: p.dataset.t, n: n, no: (p.querySelector('.ph .no') || {}).textContent || '' });
    }
    if (p.hasAttribute('data-nofoot')) return;
    var f = document.createElement('footer');
    f.className = 'rf';
    f.innerHTML = '<span><span lang="mk">јаснота</span> — Brand guidelines · v2 · 2026</span><span>' + (ch ? ch + ' · ' + p.dataset.chn : '') + '</span><span>' + pad(n) + ' / ' + total + '</span>';
    p.appendChild(f);
  });
  var toc = document.getElementById('toc');
  if (toc) toc.innerHTML = chapters.map(function (c) {
    return '<div class="ch"><h4><span>' + c.ch + '</span>' + c.name + '</h4>' + c.items.map(function (it) {
      return '<a href="#p' + it.n + '"><span class="mono">' + it.no + '</span><span>' + it.t + '</span><span>' + pad(it.n) + '</span></a>';
    }).join('') + '</div>';
  }).join('');
  pages.forEach(function (p) { p.id = 'p' + p.dataset.n; });
  document.querySelectorAll('[data-ref]:not(.page)').forEach(function (el) { el.textContent = pad(byKey[el.dataset.ref] || 0); });
};
