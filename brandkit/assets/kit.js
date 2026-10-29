/* Јаснота / Jasnota — brand kit runtime (book + showcase).
   1. injects the shared SVG defs (assets/logos.js, generated from /brand/logo),
   2. fills every [data-mock] with its mockup (assets/mockups.js),
   3. turns every <svg data-l="…"> into a crisp vector logo via <use>,
   4. fills every [data-ev="0–3"] with the evidence meter and its label (Macedonian unless data-evl="en";
      data-evt overrides the text, data-evt="" leaves the meter alone).
   Logo keys: m mark · mf small-cut mark · s02–s06 secondary signs · wl/wc wordmark Latin/Cyrillic ·
   hl/hc horizontal lockup · vl/vc stacked lockup. The j/ј dot follows --dot (default currentColor). */
(function () {
  'use strict';
  var L = window.JASNOTA_LOGOS, M = window.JASNOTA_MOCKS || {};
  function logos(root) {
    root.querySelectorAll('svg[data-l]').forEach(function (el) {
      var k = el.getAttribute('data-l');
      if (!L.vb[k]) return;
      el.setAttribute('viewBox', L.vb[k]);
      if (!el.hasAttribute('role')) el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<use href="#k-' + k + '"/>';
    });
  }
  var EV = {
    mk: ['отворено прашање', 'рани/ограничени докази', 'умерени докази', 'силни докази'],
    en: ['open question', 'early/limited evidence', 'moderate evidence', 'strong evidence']
  };
  function evidence(root) {
    root.querySelectorAll('[data-ev]').forEach(function (el) {
      var n = Math.max(0, Math.min(3, +el.getAttribute('data-ev') || 0));
      var en = el.getAttribute('data-evl') === 'en';
      var t = el.hasAttribute('data-evt') ? el.getAttribute('data-evt') : EV[en ? 'en' : 'mk'][n];
      el.classList.add('ev');
      if (!en) el.setAttribute('lang', 'mk');
      el.innerHTML = '<span class="m" aria-hidden="true"><i></i><i></i><i></i></span><span class="t">' + t + '</span>';
      if (!t) el.setAttribute('aria-label', EV[en ? 'en' : 'mk'][n]);
    });
  }
  function run() {
    document.body.insertAdjacentHTML('afterbegin', L.defs);
    document.querySelectorAll('[data-mock]').forEach(function (el) {
      var f = M[el.getAttribute('data-mock')];
      if (f) el.innerHTML = typeof f === 'function' ? f(el.dataset) : f;
    });
    logos(document);
    evidence(document);
    mkB(document.body);
    if (window.JASNOTA_AFTER) window.JASNOTA_AFTER();
    document.documentElement.setAttribute('data-kit', 'ready');
  }
  /* keep the Macedonian б in its standard shape while г д п т take the local (SRB) forms — see kit.css */
  function mkB(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeValue.indexOf('б') < 0) return NodeFilter.FILTER_REJECT;
        var el = n.parentElement;
        if (!el || el.closest('svg, script, style, .x-b')) return NodeFilter.FILTER_REJECT;
        var l = el.closest('[lang]');
        return l && /^mk/i.test(l.getAttribute('lang')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach(function (n) {
      var f = document.createDocumentFragment();
      n.nodeValue.split(/(б)/).forEach(function (part) {
        if (!part) return;
        if (part === 'б') { var s = document.createElement('span'); s.className = 'x-b'; s.textContent = part; f.appendChild(s); }
        else f.appendChild(document.createTextNode(part));
      });
      n.parentNode.replaceChild(f, n);
    });
  }
  window.JASNOTA_KIT = { logos: logos, evidence: evidence, mkB: mkB, EV: EV };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
