/* Јаснота / Jasnota — application mockups (HTML/CSS/SVG). Used by the brand book and the showcase page.
   Each key returns one scene. Logos are written as <svg data-l="…"> and filled in by kit.js.
   Facts only from BRAND.md; the poster and ticket are example layouts with placeholder dates. */
(function () {
  'use strict';
  var l = function (k, cls, st) { return '<svg data-l="' + k + '"' + (cls ? ' class="' + cls + '"' : '') + (st ? ' style="' + st + '"' : '') + '></svg>'; };
  var t78 = '<i class="a"></i><i></i><b></b><i class="a"></i><i></i><b></b><i class="a"></i><i></i><i></i>';

  var M = {};

  /* ---------------------------------------------------------------- business cards */
  M.cards = function () {
    return '<div class="x-scene x-a43">' +
      '<div class="x-card x-card--front x-ink x-sh" style="left:40%;top:7%;width:56%;transform:rotate(3deg)"><div class="in">' +
        l('m', 'mark') + '<p class="url x-m">jasnota.mk</p>' +
      '</div></div>' +
      '<div class="x-card x-card--back x-paper x-sh" style="left:5%;top:42%;width:56%;transform:rotate(-2.2deg)"><div class="in">' +
        l('wl', 'wm x-cin') +
        '<div class="who"><p class="nm x-d">Jasna Dimitrovska</p><p class="nm-mk x-d x-i" lang="mk">Јасна Димитровска</p><p class="role x-t">Psychologist · Gestalt counsellor · Vocal artist</p></div>' +
        '<p class="ct x-m">zdravo@jasnota.mk<br>jasnota.mk · @jasnota<br>Bitola, Macedonia</p>' +
      '</div></div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- email signature */
  M.signature = function () {
    return '<div class="x-scene x-a43">' +
      '<div class="x-mail x-sh" style="left:7%;top:8%;width:86%">' +
        '<div class="bar"><i></i><i></i><i></i></div>' +
        '<div class="hd x-t"><b>From</b> Jasna Dimitrovska &lt;zdravo@jasnota.mk&gt;<br><b>Subject</b> Talk on music and feelings</div>' +
        '<div class="bd x-t"><p>Thank you for the invitation. I’d be glad to come. I’ll bring a short recording and leave time at the end for questions.</p><p>Warmly,<br>Jasna</p></div>' +
        '<div class="sig x-t"><div class="mk">' + l('m') + '</div><div>' +
          '<p class="n">Jasna Dimitrovska</p>' +
          '<p class="r">Psychologist · Gestalt counsellor · Vocal artist</p>' +
          '<p class="q">To hear yourself.</p>' +
          '<p class="l">jasnota.mk · @jasnota · Bitola, Macedonia</p>' +
        '</div></div>' +
      '</div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- letterhead + envelope */
  M.letterhead = function () {
    return '<div class="x-scene x-a43">' +
      '<div class="x-sheet x-sh-soft" style="left:8%;top:4.5%;width:48%">' +
        l('hl', 'lk') +
        '<p class="ad x-m">Jasna Dimitrovska<br>Bitola, Macedonia<br>zdravo@jasnota.mk<br>jasnota.mk</p>' +
        '<p class="dt x-m">Bitola, 2 November 2026</p>' +
        '<div class="tx x-t"><p>Dear organisers,</p>' +
          '<p>Thank you for the invitation to speak. I would like to talk about why sad songs can make us calmer: what happens when we let a piece of music hold a feeling for us, and why it helps that the song ends.</p>' +
          '<p>The talk takes forty minutes, with one short recording and time for questions. It explains; it is not therapy, and I will say so at the start.</p>' +
          '<p>With warm regards,</p>' +
          '<p class="sg">Jasna Dimitrovska</p><p class="x-m">Psychologist · Gestalt counsellor · Vocal artist</p></div>' +
        '<span class="fold" style="top:33.3%"></span>' +
        '<div class="ft x-m"><span>jasnota.mk · @jasnota</span><span>To hear yourself. · <span lang="mk">Да се слушнеш себеси.</span></span></div>' +
      '</div>' +
      '<div class="x-env x-sh" style="left:47%;top:58%;width:48%;transform:rotate(-2.5deg)">' +
        l('hl', 'lk') +
        '<p class="rt x-m">Jasna Dimitrovska · 7000 Bitola · Macedonia</p>' +
        '<p class="to x-m"><span>Name Surname</span><span>Street 00</span><span>0000 City</span></p>' +
      '</div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- poster (example layout) */
  M.poster = function () {
    return '<div class="x-scene x-a45" style="background:#141416">' +
      '<div class="x-poster x-sh" style="left:18%;top:9%;width:64%">' +
        '<div class="top x-m"><span>Orchestra DIVA · Bitola</span><span>7/8 · ♩ = 60</span></div>' +
        '<div class="staff"><i></i><i></i><i></i><i></i><i></i></div><span class="pt"></span>' +
        '<h4 class="x-d">One clear<br><em>note.</em></h4>' +
        '<p class="mk x-d x-i" lang="mk">Една јасна нота.</p>' +
        '<p class="who x-t">Jasna Dimitrovska, voice<br><span>with Orchestra DIVA</span></p>' +
        '<div class="when x-m"><span>DD.MM.2027 · 20:00<br>Venue to be announced</span>' + l('hl') + '</div>' +
      '</div>' +
      '<p class="x-tag" style="left:18%;bottom:3.4%">Example layout · placeholder date and venue</p>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- ticket (example layout) */
  M.ticket = function () {
    return '<div class="x-scene x-a43">' +
      '<div class="x-ticket x-sh" style="left:6%;top:16%;width:88%;transform:rotate(-2deg)">' +
        '<div class="main">' +
          '<p class="k x-m"><span>Admit one</span><span>Example layout</span></p>' +
          '<h5>One clear <em style="font-style:italic">note</em></h5>' +
          '<p class="by x-t">Jasna Dimitrovska with Orchestra DIVA</p>' +
          '<div class="t78">' + t78 + '</div>' +
          '<div class="row x-m"><span>Date<b>DD.MM.2027</b></span><span>Doors<b>19:30</b></span><span>Row<b>—</b></span><span>Seat<b>—</b></span></div>' +
        '</div>' +
        '<div class="stub">' + l('m') + '<p class="n x-m">№ 0001<br>Bitola</p></div>' +
      '</div>' +
      '<div class="x-ticket x-sh-soft" style="left:20%;top:62%;width:70%;transform:rotate(3deg);background:var(--bone)">' +
        '<div class="main"><p class="k x-m"><span>Admit one</span><span>Example layout</span></p><h5>One clear <em style="font-style:italic">note</em></h5><p class="by x-t">Jasna Dimitrovska with Orchestra DIVA</p></div>' +
        '<div class="stub">' + l('m') + '<p class="n x-m">№ 0002</p></div>' +
      '</div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- notebook */
  M.notebook = function () {
    return '<div class="x-scene x-a45" style="background:#121214">' +
      '<div class="x-book" style="left:21%;top:16%;width:56%">' +
        '<div class="edge"></div>' +
        '<div class="cv x-sh">' +
          '<div class="deb">' + l('m', 'lo') + l('m', 'hi') + '</div>' +
          '<div class="foil">' + l('wl') + '<p>liner notes</p></div>' +
          '<div class="spine"></div><div class="band"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- tote */
  M.tote = function () {
    var bag = '<svg class="bag" viewBox="0 0 380 640" aria-hidden="true">' +
      '<path d="M128 250 C128 70 252 70 252 250" fill="none" stroke="#bdb5a6" stroke-width="22"/>' +
      '<rect x="0" y="220" width="380" height="420" fill="#d9d2c4"/>' +
      '<rect x="0" y="220" width="380" height="16" fill="#cdc5b6"/>' +
      '<path d="M118 236 C118 40 262 40 262 236" fill="none" stroke="#d3cbbd" stroke-width="22"/>' +
      '<path d="M107 236 V266 M129 236 V266 M251 236 V266 M273 236 V266" stroke="#c4bcad" stroke-width="1.4"/>' +
      '<rect x="0" y="220" width="6" height="420" fill="#cbc3b4"/><rect x="374" y="220" width="6" height="420" fill="#c7bfb0"/>' +
      '</svg>';
    return '<div class="x-scene x-a45" style="background:#141416">' +
      '<div class="x-tote" style="left:17%;top:5%;width:66%;filter:drop-shadow(0 1.4cqi 2.6cqi rgba(0,0,0,.55))">' + bag +
        '<div class="pr">' + l('m') + '<p>To hear<br><em>yourself.</em></p><small lang="mk">Да се слушнеш себеси.</small></div>' +
      '</div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- vinyl single */
  M.vinyl = function () {
    return '<div class="x-scene x-a54">' +
      '<div class="x-disc x-sh-soft" style="left:40%;top:17.5%;width:52%"><div class="lb">' + l('m') + '<span>45 rpm · A</span></div></div>' +
      '<div class="x-sleeve x-sh" style="left:8%;top:15%;width:56%">' +
        '<p class="ti x-d">Zajdi, zajdi,<br>jasno <em>sonce</em></p>' +
        '<p class="mk x-d x-i" lang="mk">Зајди, зајди, јасно сонце</p>' +
        '<span class="sun"></span><span class="hz"></span><span class="ref"></span>' +
        '<div class="bt x-m"><span>Jasna Dimitrovska · voice<br>Traditional Macedonian song</span>' + l('wl') + '</div>' +
      '</div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- podcast / episode cover */
  M.podcast = function () {
    return '<div class="x-scene x-a11">' +
      '<div class="x-sq x-sh" style="left:15%;top:15%;width:70%">' +
        l('s04', 'sign') +
        '<p class="k x-m">Conversation · 06<br>38:40 · EN / МК</p>' +
        '<h5>What were you listening to at <em>seventeen?</em></h5>' +
        '<div class="bt x-m"><span>Jasnota · listening episodes</span>' + l('wl') + '</div>' +
      '</div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- instagram */
  var postLight = function (st) {
    return '<div class="x-post x-paper" style="' + st + '">' +
      l('m', 'mk', 'left:9cqi;top:8cqi;color:var(--ink)') +
      '<p class="mt" style="right:9cqi;top:9cqi;color:#5d5b57">№01 · 7/8</p>' +
      '<h5 style="top:44cqi;font-size:17cqi">A clear<br><em>note.</em></h5>' +
      '<p class="sub" lang="mk" style="top:82cqi;font-size:7cqi;color:#66645f">Јасна нота.</p>' +
      '<div class="bt" style="color:#5d5b57"><span>jasnota</span><span>→</span></div>' +
    '</div>';
  };
  var postPsycho = function (st) {
    return '<div class="x-post x-ink" style="' + st + '">' +
      l('m', 'mk', 'left:9cqi;top:8cqi;color:var(--bone)') +
      '<p class="mt" style="right:9cqi;top:9cqi;color:var(--ash)">Psycho-note №01</p>' +
      '<h5 style="top:40cqi;font-size:16cqi">Attunement</h5>' +
      '<p class="sub" style="top:62cqi;font-size:7.4cqi;color:#d9d5ce">One fork answers<br>another.</p>' +
      '<div class="bt" style="color:var(--ash)"><span>This explains; it isn’t therapy.</span><span>1/7</span></div>' +
    '</div>';
  };
  var story = function () {
    return '<div class="x-story x-ink" style="inset:0;width:100%">' +
      '<div class="prog"><i class="on"></i><i></i><i></i></div>' +
      '<div class="who"><b>' + l('m') + '</b>jasnota <span>20:30</span></div>' +
      '<p class="mt" style="left:8cqi;top:30cqi;color:var(--ash)">Song of the week №04</p>' +
      '<p class="x-d" style="position:absolute;left:8cqi;right:8cqi;top:37cqi;font-size:13cqi;line-height:.92">Zajdi, zajdi,<br>jasno <em>sonce</em></p>' +
      '<p class="x-d x-i" lang="mk" style="position:absolute;left:8.4cqi;top:68cqi;font-size:5.6cqi;color:var(--ash)">Зајди, зајди, јасно сонце</p>' +
      '<svg viewBox="0 0 168 30" style="position:absolute;left:8cqi;right:8cqi;top:96cqi;width:84cqi;height:auto" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">' + wave(42, 168, 30) + '</g></svg>' +
      '<p class="mt" style="left:8cqi;right:8cqi;top:110cqi;display:flex;justify-content:space-between;color:var(--ash)"><span>00:00</span><span>04:12</span></p>' +
      '<p class="x-t" style="position:absolute;left:8cqi;right:8cqi;top:124cqi;font-size:4.2cqi;line-height:1.45;color:#d9d5ce">An old song, sung with nothing but voice and silence.</p>' +
      l('s05', '', 'position:absolute;left:44cqi;bottom:12cqi;width:12cqi;height:12cqi;color:var(--ash)') +
    '</div>';
  };
  function wave(n, w, h) {
    var s = '', step = w / n;
    for (var i = 0; i < n; i++) {
      var x = step * i + step / 2;
      var a = Math.abs(Math.sin(i * 0.9) * 0.55 + Math.sin(i * 0.37) * 0.35 + Math.sin(i * 2.1) * 0.1);
      var hh = Math.max(1.2, a * (h * 0.9));
      s += '<path d="M' + x.toFixed(1) + ' ' + ((h - hh) / 2).toFixed(1) + 'V' + ((h + hh) / 2).toFixed(1) + '"' + (i < 10 ? '' : ' opacity=".38"') + '/>';
    }
    return s;
  }
  var phone = function (st, inner) {
    return '<div class="x-phone x-sh" style="' + st + '"><div class="scr"><span class="isl"></span>' + inner + '</div></div>';
  };
  M['ig-templates'] = function () {
    return '<div class="x-scene x-a1610">' +
      postLight('left:5%;top:15%;width:30%') +
      postPsycho('left:38%;top:15%;width:30%') +
      phone('left:72.5%;top:6.5%;width:23.5%', story()) +
    '</div>';
  };
  M['ig-post'] = function () {
    return '<div class="x-scene x-a45">' + postPsycho('left:12%;top:10%;width:76%;box-shadow:0 .15cqi .3cqi rgba(0,0,0,.35),0 1.4cqi 3.2cqi rgba(0,0,0,.5)') + '</div>';
  };
  M['ig-story'] = function () {
    return '<div class="x-scene x-a45">' + phone('left:30%;top:5%;width:40%', story()) + '</div>';
  };

  var hlSigns = [['Jasna', 's03'], ['Psycho-note', 'm'], ['Songs', 's02'], ['Stage', 's04'], ['Journal', '¶'], ['Rest', 's05']];
  M.hlc = function (sign) { return '<div class="x-hlc"><span>' + (sign === '¶' ? '<span class="pil">¶</span>' : l(sign)) + '</span></div>'; };
  function tile(kind, q) {
    if (kind === 'lt') return '<div class="x-tile lt">' + l('m', 'm', 'color:var(--ink)') + '<p class="q">' + q + '</p></div>';
    if (kind === 'q') return '<div class="x-tile">' + l('m', 'm') + '<p class="q">' + q + '</p></div>';
    if (kind === 'sg') return '<div class="x-tile">' + l(q, 'sg') + '</div>';
    if (kind === 'phl') return '<div class="x-tile ph"><span class="ph-l"></span><span class="play"></span></div>';
    return '<div class="x-tile ph"><span class="ph-r"></span></div>';
  }
  M['ig-profile'] = function () {
    var hls = hlSigns.map(function (h) { return '<div class="hl">' + M.hlc(h[1]) + h[0] + '</div>'; }).join('');
    var grid = [
      tile('lt', 'Silence is not <em>empty.</em>'), tile('q', 'Songs that <em>remember</em> us'), tile('phl'),
      tile('ph'), tile('sg', 's02'), tile('q', 'The voice I used to <em>hide</em>'),
      tile('q', 'Co-<em>regulation</em>'), tile('lt', 'One <em>note</em>'), tile('phl')
    ].join('');
    var inner = '<div class="x-status"><span>20:30</span><span><i></i></span></div>' +
      '<div class="x-prof">' +
        '<div class="un">jasnota <span>EN / МК</span></div>' +
        '<div class="tp"><div class="av">' + l('m') + '</div><div class="st"><span><b>15</b>posts</span><span><b>1,562</b>followers</span><span><b>212</b>following</span></div></div>' +
        '<div class="bio"><b>Jasna Dimitrovska · Jasnota</b><br>Psychologist · Gestalt counsellor<br>Vocal artist, @chamber_orchestra_diva<br>To hear yourself. <span lang="mk">Да се слушнеш себеси.</span><br>Bitola · EN / МК<br><span class="ln">jasnota.mk</span></div>' +
        '<div class="btn"><span>Follow</span><span>Message</span></div>' +
        '<div class="hls">' + hls + '</div>' +
        '<div class="grid">' + grid + '</div>' +
      '</div>';
    return '<div class="x-scene x-a34">' + phone('left:22%;top:4%;width:56%', inner) +
      '<p class="x-tag" style="left:4%;bottom:3%">Prototype numbers after month one</p></div>';
  };

  /* ---------------------------------------------------------------- website: laptop + phone */
  var webHome = '<div class="x-web"><span class="grain"></span>' +
    '<div class="hdr">' + l('hl', 'lk') + '<nav><span>Journal</span><span>Listen</span><span>About</span><span>Contact</span><span>en · мк</span></nav></div>' +
    '<div class="hero">' + l('m', 'mk') + l('wl', 'wm') + '<p class="cy" lang="mk">јаснота</p><p class="ln">Psychology you can hear.</p></div>' +
    '<div class="ft"><span>scroll slowly</span><span>00:00 / 07:08</span></div></div>';
  var webArticle = '<div class="x-status"><span>21:40</span><span><i></i></span></div>' +
    '<div class="x-art"><div class="hdr">' + l('hl') + '<span>menu</span></div>' +
    '<p class="meta">Journal · 02 · essay · 5 min</p>' +
    '<h5>Why sad songs make us <em>calmer</em></h5>' +
    '<p class="lede">When I’m sad, I don’t reach for cheerful music. I reach for the saddest song I know.</p>' +
    '<p class="num">I.</p>' +
    '<p class="bd">Sadness in music is safe: you can feel it all the way through, and then the song ends.</p></div>';
  M.web = function () {
    return '<div class="x-scene x-a1610">' +
      '<div class="x-laptop" style="left:3%;top:9%;width:75%;filter:drop-shadow(0 1.6cqi 2.4cqi rgba(0,0,0,.55))"><div class="lid"><div class="scr">' + webHome + '</div></div><div class="base"></div></div>' +
      phone('left:76%;top:12%;width:20%', webArticle) +
    '</div>';
  };
  M.laptop = function () {
    return '<div class="x-scene x-a1610"><div class="x-laptop" style="left:6%;top:9%;width:88%;filter:drop-shadow(0 1.6cqi 2.4cqi rgba(0,0,0,.55))"><div class="lid"><div class="scr">' + webHome + '</div></div><div class="base"></div></div></div>';
  };
  M['web-phone'] = function () {
    return '<div class="x-scene x-a45">' + phone('left:30%;top:5%;width:40%', webArticle) + '</div>';
  };

  /* ---------------------------------------------------------------- app icon + favicon */
  M.icons = function () {
    var apps = '';
    var cls = ['b', '', 'c', 'd', '', 'c', 'b', 'j', 'd', '', 'b', 'c'];
    cls.forEach(function (c) {
      apps += c === 'j' ? '<div class="ap j"><i>' + l('m') + '</i><span>Jasnota</span></div>' : '<div class="ap"><i class="' + c + '"></i><span>&nbsp;</span></div>';
    });
    var home = '<div class="x-home"><div class="x-status"><span>9:41</span><span><i></i></span></div><div class="grid">' + apps + '</div><div class="dock"><i></i><i></i><i></i><i></i></div></div>';
    return '<div class="x-scene x-a43">' +
      phone('left:6%;top:4%;width:31%', home) +
      '<div class="x-browser x-sh" style="left:44%;top:9%;width:51%">' +
        '<div class="tabs"><div class="dots"><i></i><i></i><i></i></div><div class="tab on">' + l('mf', '', 'background:#0a0a0b;color:#ece8e1;padding:.3cqi;border-radius:.4cqi') + 'Jasnota — To hear yourself</div><div class="tab"><i></i>New tab</div></div>' +
        '<div class="url"><span>jasnota.mk</span></div><div class="pg"></div>' +
      '</div>' +
      '<div style="left:44%;top:56%;width:51%;display:flex;align-items:flex-end;gap:4.4cqi">' +
        ['20', '11', '4', '2.6'].map(function (w, i) {
          var lab = ['1024', '180', '32', '16'][i];
          return '<figure style="display:flex;flex-direction:column;gap:1.4cqi"><span style="display:grid;place-items:center;width:' + w + 'cqi;height:' + w + 'cqi;background:#0a0a0b;border-radius:' + (i < 2 ? '22%' : '8%') + ';box-shadow:inset 0 0 0 1px #2a2a2e">' + l(i < 2 ? 'm' : 'mf', '', 'width:' + (i < 2 ? 56 : 100) + '%;height:' + (i < 2 ? 56 : 100) + '%;color:#ece8e1') + '</span><figcaption class="x-m" style="font-size:1.6cqi;color:var(--ash)">' + lab + '</figcaption></figure>';
        }).join('') +
      '</div>' +
    '</div>';
  };

  /* ---------------------------------------------------------------- presentation slides */
  M.slides = function () {
    return '<div class="x-scene x-a1610">' +
      '<div class="x-slide x-ink x-sh" style="left:4%;top:7%;width:62%">' +
        l('hl', 'lk', 'color:var(--bone)') + '<p class="k x-ash">Talk · 40 min</p>' +
        '<h5>Why sad songs<br>make us <em>calmer</em></h5>' +
        '<div class="bt"><span>Jasna Dimitrovska · psychologist, Gestalt counsellor, vocal artist</span><span>jasnota.mk</span></div>' +
      '</div>' +
      '<div class="x-slide x-ink x-sh" style="left:47%;top:52%;width:49%;box-shadow:inset 0 0 0 1px #2a2a2d,0 1.4cqi 3.2cqi rgba(0,0,0,.5)">' +
        '<p class="k x-ash">02 / 12</p>' +
        '<p class="no">I.</p>' +
        '<p class="bq">Sadness in music is safe. You can feel it all the way through, and then the song <em>ends.</em></p>' +
        '<p class="nt">One idea per slide. Roman numerals for movements; the fermata closes the talk.</p>' +
        l('s05', 'fm') +
      '</div>' +
      '<div class="x-slide x-paper x-sh-soft" style="left:6%;top:72%;width:30%">' +
        l('m', '', 'position:absolute;left:5cqi;top:5cqi;width:6cqi;height:6cqi;color:var(--ink)') +
        '<p class="x-d" style="position:absolute;left:5cqi;bottom:8cqi;font-size:9cqi;line-height:.9">Thank <em>you.</em></p>' +
      '</div>' +
    '</div>';
  };

  window.JASNOTA_MOCKS = M;
})();
