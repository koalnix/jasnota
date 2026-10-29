/* Јаснота — builders for the Facebook page, the posting kit and the Facebook log (metrics).
   Requires render.js + refs.js + data.js + social.js + flow.js. Each builder runs only if its mount point exists. */
(function () {
  'use strict';
  var J = window.J, esc = J.esc;

  /* photos for a week's Facebook post. Only face-free photos are used on Facebook (consent covers the website;
     people's faces stay off the Page): the resilience workshop's colour-and-emotion chart on a table.
     Weeks without such a photo attach their link-preview image (the typographic title card) instead. */
  J.FB_FACEFREE = ['website/assets/portfolio/ws-resilience-emotions.jpg'];
  J.FB_PHOTOS = {
    'rhythm-of-resilience': ['website/assets/portfolio/ws-resilience-emotions.jpg'],
    launch: ['website/assets/portfolio/ws-resilience-emotions.jpg']
  };
  function photosOf(f) {
    var note = (f.fb && f.fb.photo_note) || '', out = [];
    (note.match(/[\w./-]+\.(?:jpe?g|png|webp)/gi) || []).forEach(function (n) {
      var p = /^(website|photos|instagram)\//.test(n) ? n : 'website/assets/portfolio/' + n.split('/').pop();
      if (J.FB_FACEFREE.indexOf(p) > -1 && out.indexOf(p) < 0) out.push(p);
    });
    if (!out.length) out = (J.FB_PHOTOS[f.slug] || J.FB_PHOTOS[f.key] || []).slice();
    return { files: out, note: note, card: !out.length && f.og ? f.og : null };
  }
  function label(f) { return f.placeholder ? 'Недела 01 · нова' : 'Недела ' + J.pad(f.week); }
  function when(iso, time) { return J.fmtDate(iso, 'mk') + ' · ' + time; }
  function linkify(t) {
    return esc(t).replace(/(https?:\/\/[^\s<]+)/g, function (u) { return '<a href="' + u + '" rel="noopener" target="_blank">' + u + '</a>'; });
  }
  var ICON = {
    globe: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 8h13M8 1.5c2 2.2 2 10.8 0 13M8 1.5c-2 2.2-2 10.8 0 13" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>',
    like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v10H4V10zM7 10l4-7c1.6 0 2.4 1 2 2.6L12.3 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 1 1-3.2-6.6A8.4 8.4 0 0 1 20.5 12zM20.5 12l1 7.5-5-2.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5l7 7-7 7v-4c-5 0-8 1.5-11 5 1-6 4-10 11-11z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    dots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="19" cy="12" r="1.7" fill="currentColor"/></svg>'
  };
  var WARN = '<p class="warn-line" lang="mk">статијата уште не е објавена — не објавувај на FB пред веб-текстот</p>';

  /* =================================================================
     FACEBOOK: one feed post per week
     ================================================================= */
  function fbPost(f, variant) {
    var text = J.fbText(f);
    var txt = text
      ? '<div class="fb-txt fb-clamp" lang="mk">' + linkify(text) + '</div><div class="fb-more"><button type="button" data-more>Види повеќе</button></div>'
      : '<div class="fb-txt fb-placeholder" lang="mk">Текстот за Facebook (≈120–250 зборови, social.fb.text_mk) ќе стои тука по синхронизацијата.\n\n' + esc(J.fbLinkLabel(f)) + ' <span class="fb-lnk">' + esc(f.share ? f.share.facebook : '[линк до статијата]') + '</span></div>';
    var media;
    if (variant === 'photos') {
      var ph = photosOf(f), files = ph.files.length ? ph.files.slice(0, 3) : (ph.card ? [ph.card] : []);
      var slots = files.length ? files.map(function (src) {
        return '<img src="' + esc(J.root + src) + '" alt="" loading="lazy" data-fallback="' + esc(ph.note || 'фото од работилницата') + '">';
      }) : ['<div class="fb-slotph" lang="mk">' + esc(ph.note || 'фото: од работилницата или темата, само со согласност') + '</div>'];
      media = '<div class="fb-photos fb-n' + slots.length + '">' + slots.join('') + '</div>';
    } else {
      var ttl = J.strip(f.title);
      media = (f.onSite ? '<a class="fb-card" href="' + esc(f.share.facebook) + '" target="_blank" rel="noopener">' : '<div class="fb-card fb-dim">') +
        '<img src="' + esc(J.ogSrc(f)) + '" alt="" loading="lazy" width="1200" height="630">' +
        '<div class="fb-meta"><div class="fb-dom">' + esc(J.PUBLIC_HOST) + '</div><div class="fb-ttl" lang="mk">' + esc(ttl) + ' — Јаснота</div></div>' +
        (f.onSite ? '</a>' : '</div>');
    }
    return '<div class="fbp" role="img" aria-label="' + esc('Пример: објава на Facebook, ' + J.strip(f.title)) + '">' +
      '<div class="fb-ph"><span class="fb-av"></span><div><div class="fb-who">Јаснота</div><div class="fb-when">' + J.fmtDate(J.fbDate(f), 'mk') + ' во ' + J.FB_TIME + ' · ' + ICON.globe + '</div></div><span class="fb-dots">' + ICON.dots + '</span></div>' +
      txt + media +
      '<div class="fb-stats"><span>12</span><span>2 споделувања</span></div>' +
      '<div class="fb-bar"><span>' + ICON.like + 'Ми се допаѓа</span><span>' + ICON.comment + 'Коментирај</span><span>' + ICON.share + 'Сподели</span></div></div>';
  }
  function buildFacebook(mount) {
    mount.innerHTML = J.FLOW.map(function (f) {
      var hasPhotos = photosOf(f).files.length > 0;
      var variant = hasPhotos ? 'photos' : 'link';
      var st = J.articleState(f);
      var dbg = f.url ? 'https://developers.facebook.com/tools/debug/?q=' + encodeURIComponent(f.url) : '';
      return '<section class="fb-week" id="fb-' + f.key + '" data-key="' + f.key + '">' +
        '<div class="mock">' + (st.ok ? '' : WARN) + '<div class="fbp-mount">' + fbPost(f, variant) + '</div>' +
        '<p class="fb-hint" data-hint>' + hint(variant) + '</p></div>' +
        '<div class="side"><p class="num">' + label(f) + ' · веб ' + when(f.date, J.WEB_TIME) + ' · FB ' + when(J.fbDate(f), J.FB_TIME) + '</p>' +
        '<h3 lang="mk">' + esc(J.strip(f.title)) + '</h3>' +
        (st.ok ? '<span class="ok-line">' + st.mk + '</span>' : '') +
        '<div class="seg" role="group" aria-label="Варијанта на објавата"><button type="button" data-variant="photos" aria-pressed="' + (variant === 'photos') + '">фото + линк во текст</button><button type="button" data-variant="link" aria-pressed="' + (variant === 'link') + '">линк-картичка</button></div>' +
        '<dl class="kv" style="margin-top:var(--s-3)">' +
        '<dt>фото</dt><dd>' + (photosOf(f).files.length ? '<b>' + photosOf(f).files.map(function (x) { return x.split('/').pop(); }).join(', ') + '</b> <small>само фотографии без лица на Facebook</small>' : '<small>нема фотографија без лица: објави со линк-картичката (OG-сликата)</small>') +
          (f.fb && f.fb.photo_note ? '<br><small lang="mk">белешка од календарот: ' + esc(f.fb.photo_note) + '</small>' : '') + '</dd>' +
        '<dt>линк</dt><dd>' + (f.share ? '<span class="mono-s">' + esc(f.share.facebook) + '</span>' : '<small>статијата уште нема адреса</small>') + '</dd>' +
        '<dt>картичка</dt><dd>' + (f.og ? '<a href="' + esc(J.root + f.og) + '" target="_blank" rel="noopener">OG слика 1200 × 630 ↗</a>' : '<small>OG сликата се прави со веб-текстот (node website/tools/build.mjs)</small>') +
        (dbg && f.onSite ? '<br><a href="' + esc(dbg) + '" target="_blank" rel="noopener">Sharing Debugger ↗</a> <small>провери ја картичката пред објава</small>' : '') + '</dd>' +
        '</dl><p class="links-row"><a href="../kit/#' + f.key + '">пакет за објава →</a>' + (f.post ? '<a href="../month/#' + f.post.id + '">каруселот на Instagram →</a>' : '') + '</p></div></section>';
    }).join('');
    mount.addEventListener('click', function (e) {
      var b = e.target.closest('[data-variant]');
      if (b) {
        var sec = b.closest('.fb-week'), f = J.FLOW.filter(function (x) { return x.key === sec.getAttribute('data-key'); })[0], v = b.getAttribute('data-variant');
        sec.querySelector('.fbp-mount').innerHTML = fbPost(f, v);
        sec.querySelector('[data-hint]').innerHTML = hint(v);
        sec.querySelectorAll('[data-variant]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        fallbacks(sec);
        return;
      }
      var m = e.target.closest('[data-more]');
      if (m) { var t = m.parentNode.previousElementSibling; t.classList.remove('fb-clamp'); m.parentNode.remove(); }
    });
    fallbacks(mount);
  }
  function hint(v) {
    return v === 'photos'
      ? 'Со фотографии Facebook не прикажува картичка за линкот: линкот останува син, во текстот. Тоа е најблиску до одлуката „текст + фотографии + директен линк“.'
      : 'Без фотографии Facebook ја прикажува OG-сликата на статијата, насловот и доменот. Подобро за кликови; Facebook ја чита страницата при првото споделување.';
  }
  function fallbacks(root) {
    root.querySelectorAll('img[data-fallback]').forEach(function (img) {
      img.addEventListener('error', function () {
        var d = document.createElement('div'); d.className = 'fb-slotph'; d.lang = 'mk'; d.textContent = img.getAttribute('data-fallback');
        img.replaceWith(d);
      }, { once: true });
    });
  }

  /* =================================================================
     POSTING KIT: one card per week, three steps
     ================================================================= */
  var KIT_KEY = 'jasnota-kit-v1';
  function store() { try { return JSON.parse(localStorage.getItem(KIT_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KIT_KEY, JSON.stringify(o)); } catch (e) {} }
  J.KIT_TEXT = {};
  function copyBtn(id, text, lbl, disabled) {
    J.KIT_TEXT[id] = text;
    return '<button type="button" class="btn" data-kit-copy="' + id + '"' + (disabled ? ' disabled' : '') + '>' + (lbl || 'Копирај') + '</button>';
  }
  function buildKit(mount) {
    var saved = store();
    var html = J.FLOW.map(function (f) {
      var P = J.PILLARS[f.pillar] || J.PILLARS[1], st = J.articleState(f), k = f.key;
      var chk = function (n, t, sub) {
        var on = !!saved[k + ':s' + n];
        return '<label class="chk"><input type="checkbox" data-kit="' + k + ':s' + n + '"' + (on ? ' checked' : '') + '><b lang="mk">' + t + '</b><small>' + sub + '</small></label>';
      };
      var cls = function (n) { return saved[k + ':s' + n] ? ' class="done"' : ''; };
      var cap = J.igCaption(f), fbt = J.fbText(f);
      var monthHref = f.post ? '../month/#' + f.post.id : '../month/#' + (f.placeholder ? 'week-launch' : 'week-' + f.week);
      var og = f.og ? J.root + f.og : null;
      return '<article class="kit' + (f.placeholder ? ' placeholder' : '') + '" id="' + k + '">' +
        '<div><p class="k-n">' + (f.placeholder ? '<em>01</em>' : J.pad(f.week)) + '</p>' +
        '<h3 lang="mk">' + esc(J.strip(f.title)) + '</h3>' +
        '<p class="k-meta">' + J.fmtDate(f.date, 'mk', true) + ' · столб ' + P.roman + ' · ' + (J.FMT[f.fmt] ? J.FMT[f.fmt].mk : f.fmt) + (f.placeholder ? ' · во подготовка' : '') + '</p>' +
        '<p class="k-meta" style="margin-top:6px">' + (st.ok ? '<span class="ok-line">' + st.mk + '</span>' : '<span style="color:var(--cinnabar)">статијата уште не е на веб</span>') + '</p>' +
        '<div class="k-og">' + (og
          ? '<img src="' + esc(og) + '" alt="' + esc('Слика за преглед на линкот: ' + J.strip(f.title)) + '" loading="lazy" width="1200" height="630"><div class="copyrow"><a class="btn" href="' + esc(og) + '" download="jasnota-' + esc(f.slug) + '.png">Преземи OG слика</a><span class="charcount">1200 × 630 PNG</span></div>'
          : '<p class="muted-note">OG сликата (1200 × 630) настанува автоматски со веб-текстот: node website/tools/build.mjs</p>') + '</div></div>' +
        '<ol class="ksteps">' +
        '<li' + cls(1) + '>' + chk(1, 'Објави го текстот на веб', J.fmtDate(f.date, 'mk') + ' · ' + J.WEB_TIME) + '<div class="body">' +
          (f.url ? '<p class="url">' + esc(f.url) + '</p><div class="copyrow">' + copyBtn(k + ':url', f.url, 'Копирај адреса') +
            (f.onSite ? '<a class="btn" href="' + esc(J.root + 'website/articles/' + f.slug + '/') + '" target="_blank" rel="noopener">Отвори ↗</a><a class="btn" href="https://developers.facebook.com/tools/debug/?q=' + encodeURIComponent(f.url) + '" target="_blank" rel="noopener">Провери картичка ↗</a>' : '') + '</div>'
            : '<p class="muted-note">Статијата уште нема датотека (research/content-bank/articles/). Адресата ќе биде …/articles/&lt;slug&gt;/</p>') +
          (st.ok ? '' : '<p class="muted-note">Потоа: node website/tools/import-content.mjs → node website/tools/build.mjs → node instagram/tools/sync-social.mjs, и објави (push).</p>') + '</div></li>' +
        '<li' + cls(2) + '>' + chk(2, 'Instagram', J.fmtDate(f.date, 'mk') + ' · ' + J.POST_TIME) + '<div class="body">' +
          '<div class="capbox' + (cap ? '' : ' empty') + '" lang="mk">' + esc(cap || 'Описот за Instagram ќе дојде со каруселот (social.ig.caption_mk).') + '</div>' +
          '<div class="copyrow">' + copyBtn(k + ':ig', cap, 'Копирај опис', !cap) + '<span class="charcount' + (cap.length > 2200 ? ' over' : '') + '">' + cap.length + ' / 2.200</span></div>' +
          '<p class="links-row"><a href="' + monthHref + '">слајдовите (' + (f.post ? f.post.slides.length : '–') + ') и alt-текстот →</a><a href="../link/">линкот во био →</a></p>' +
          (f.share ? '<p class="url"><small>линкот во био води до</small><br>' + esc(f.share.instagram) + '</p><div class="copyrow">' + copyBtn(k + ':igl', f.share.instagram, 'Копирај линк') + '</div>' : '') +
          '</div></li>' +
        '<li' + cls(3) + '>' + chk(3, 'Facebook', J.fmtDate(J.fbDate(f), 'mk') + ' · ' + J.FB_TIME) + '<div class="body">' +
          (st.ok ? '' : WARN) +
          '<div class="capbox' + (fbt ? '' : ' empty') + '" lang="mk">' + esc(fbt || 'Текстот за Facebook ќе дојде од календарот (social.fb.text_mk); линкот со UTM се додава сам.') + '</div>' +
          '<div class="copyrow">' + copyBtn(k + ':fb', fbt, 'Копирај текст + линк', !fbt) + (f.fb && f.fb.text_mk ? '<span class="charcount">' + String(f.fb.text_mk).trim().split(/\s+/).length + ' збора</span>' : '') + '</div>' +
          (f.fb && f.fb.photo_note ? '<p class="muted-note" lang="mk">фото: ' + esc(f.fb.photo_note) + '</p>' : '') +
          '<p class="links-row"><a href="../facebook/#fb-' + k + '">како ќе изгледа во фидот →</a></p></div></li>' +
        '</ol></article>';
    }).join('');
    mount.innerHTML = html;
    mount.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-kit'); if (!k) return;
      var o = store(); o[k] = e.target.checked; save(o);
      e.target.closest('li').classList.toggle('done', e.target.checked);
      count();
    });
    mount.addEventListener('click', function (e) {
      var b = e.target.closest('[data-kit-copy]'); if (!b || b.disabled) return;
      J.copy(J.KIT_TEXT[b.getAttribute('data-kit-copy')] || '', b);
    });
    function count() {
      var el = document.getElementById('kitCount'); if (!el) return;
      var o = store(), weeks = J.FLOW.filter(function (f) { return !f.placeholder; });
      var done = weeks.filter(function (f) { return o[f.key + ':s1'] && o[f.key + ':s2'] && o[f.key + ':s3']; }).length;
      var live = weeks.filter(function (f) { return f.onSite; }).length;
      el.textContent = weeks.length + ' недели · ' + live + ' текстови на веб · ' + done + ' недели целосно објавени';
    }
    count();
  }

  /* =================================================================
     METRICS: the Facebook log (per week)
     ================================================================= */
  function buildFbLog(mount) {
    var KEY = 'jasnota-fb-log-v1', saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
    var nums = [['reach', 'досег'], ['clicks', 'кликови на линкот'], ['shares', 'споделувања']];
    var rows = J.FLOW.filter(function (f) { return !f.placeholder; });
    function ctr(k) { var r = parseInt(saved[k + ':reach'], 10), c = parseInt(saved[k + ':clicks'], 10); return r > 0 && c >= 0 ? (100 * c / r).toFixed(1).replace('.', ',') + '%' : '–'; }
    mount.innerHTML = rows.map(function (f) {
      var k = f.key;
      return '<tr><td data-h="објава"><b>' + J.pad(f.week) + '</b> <span lang="mk">' + esc(J.strip(f.title)) + '</span><br><small class="footnote">FB ' + J.fmtDate(J.fbDate(f), 'mk') + (f.onSite ? '' : ' · текстот уште не е на веб') + '</small></td>' +
        '<td data-h="објавено"><label class="ontime"><input type="checkbox" data-k="' + k + ':posted"' + (saved[k + ':posted'] ? ' checked' : '') + ' aria-label="Објавено на Facebook, недела ' + f.week + '"> да</label></td>' +
        nums.map(function (c) { var kk = k + ':' + c[0]; return '<td data-h="' + c[1] + '"><input inputmode="numeric" aria-label="' + esc(c[1] + ', недела ' + f.week) + '" data-k="' + kk + '" value="' + esc(saved[kk] || '') + '"></td>'; }).join('') +
        '<td data-h="CTR" data-ctr="' + k + '">' + ctr(k) + '</td>' +
        '<td data-h="белешка"><input class="wide" aria-label="Белешка, недела ' + f.week + '" data-k="' + k + ':note" value="' + esc(saved[k + ':note'] || '') + '"></td></tr>';
    }).join('');
    function onChange(e) {
      var k = e.target.getAttribute('data-k'); if (!k) return;
      saved[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (x) {}
      var id = k.split(':')[0], cell = mount.querySelector('[data-ctr="' + id + '"]'); if (cell) cell.textContent = ctr(id);
      summary();
    }
    mount.addEventListener('input', onChange);
    mount.addEventListener('change', onChange);
    function sum(f) { return rows.reduce(function (a, r) { return a + (parseInt(saved[r.key + ':' + f], 10) || 0); }, 0); }
    function summary() {
      var el = document.getElementById('fbSummary'); if (!el) return;
      var reach = sum('reach'), clicks = sum('clicks');
      el.innerHTML = '<div><b>' + rows.filter(function (r) { return saved[r.key + ':posted']; }).length + ' / ' + rows.length + '</b><span>weeks posted on Facebook</span></div>' +
        '<div><b>' + clicks + '</b><span>link clicks to the website</span></div>' +
        '<div><b>' + (reach ? (100 * clicks / reach).toFixed(1).replace('.', ',') + '%' : '–') + '</b><span>clicks per reach (CTR)</span></div>' +
        '<div><b>' + sum('shares') + '</b><span>shares</span></div>';
    }
    summary();
    var csv = document.getElementById('fbCsv');
    if (csv) csv.addEventListener('click', function () {
      var out = [['week', 'fb_date', 'title', 'posted', 'reach', 'link_clicks', 'shares', 'ctr', 'note']];
      rows.forEach(function (f) { var k = f.key; out.push([f.week, J.fbDate(f), J.strip(f.title), saved[k + ':posted'] ? 1 : 0, saved[k + ':reach'] || '', saved[k + ':clicks'] || '', saved[k + ':shares'] || '', ctr(k), saved[k + ':note'] || '']); });
      J.copy(out.map(function (r) { return r.map(function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n'), csv);
    });
  }

  /* generic: copy the text of an element (data-copy-el="id") */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy-el]'); if (!b) return;
    var el = document.getElementById(b.getAttribute('data-copy-el')); if (el) J.copy(el.textContent.trim(), b);
  });

  document.addEventListener('DOMContentLoaded', function () {
    var m;
    if ((m = document.getElementById('fbMount'))) buildFacebook(m);
    if ((m = document.getElementById('kitMount'))) buildKit(m);
    if ((m = document.getElementById('fbLogMount'))) buildFbLog(m);
    document.querySelectorAll('[data-len-of]').forEach(function (el) {
      var src = document.getElementById(el.getAttribute('data-len-of')), max = +el.getAttribute('data-max');
      if (!src) return;
      var n = src.textContent.trim().length;
      el.textContent = n + ' / ' + max + ' знаци';
      el.classList.toggle('over', n > max);
    });
    if (location.hash && (document.getElementById('fbMount') || document.getElementById('kitMount'))) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) { var go = function () { t.scrollIntoView(); }; setTimeout(go, 60); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(go, 30); }); }
    }
  });
})();
