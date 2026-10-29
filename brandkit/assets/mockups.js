/* Јаснота / Jasnota — templates and application mockups (HTML/CSS/SVG), v2: the educational platform.
   Used by the brand book (print), the showcase page (web) and assets/frame.html (1080 px PNG exports).
   Each key returns one piece of HTML. Logos are written as <svg data-l="…">, evidence labels as <span data-ev="0–3">;
   kit.js fills both. Example content comes from research/content-bank (calendar weeks 1–12, the pilot texts,
   verified sources). Nothing here is an announcement. */
(function () {
  'use strict';
  var l = function (k, cls, st) { return '<svg data-l="' + k + '"' + (cls ? ' class="' + cls + '"' : '') + (st ? ' style="' + st + '"' : '') + '></svg>'; };
  var ev = function (n, cls, st, en) { return '<span data-ev="' + n + '"' + (en ? ' data-evl="en"' : '') + (cls ? ' class="' + cls + '"' : '') + (st ? ' style="' + st + '"' : '') + '></span>'; };
  var M = {};

  /* ================================================================ Instagram carousel, 4:5 */
  /* frame: background class, slide position n/of, pillar + format line */
  function ig(cls, meta, n, of, inner, opt) {
    opt = opt || {};
    var light = /pp/.test(cls);
    var pg = '';
    for (var i = 1; i <= of; i++) pg += '<i' + (i === n ? ' class="on"' : '') + '></i>';
    var end = opt.end ? l('s05', '', 'width:3.6cqi;height:3.6cqi;color:currentColor') : '';
    return '<div class="x-ig solo ' + cls + '" lang="mk"' + (opt.st ? ' style="' + opt.st + '"' : '') + '>' +
      l('m', 'mk', 'color:' + (light ? 'var(--ink)' : 'var(--bone)')) +
      '<p class="mt">' + meta + '</p>' + inner +
      '<div class="ft">' + l('wc') + '<span class="r">' + end + '<span class="pg">' + pg + '</span><span>' + n + '/' + of + '</span></span></div>' +
    '</div>';
  }
  var W1 = 'II · текст';

  /* the five slide types, shown with week 1 (pillar II, text): music performance anxiety */
  M['ig-cover'] = function (o) {
    return ig('', W1, 1, 6,
      '<p class="tt">Трема: што навистина <em>знаеме</em></p>' +
      '<p class="sb" style="top:72cqi">за музичката анксиозност при изведба. Што покажуваат истражувањата, колку сме сигурни и што сè уште не знаеме.</p>', o);
  };
  M['ig-content'] = function (o) {
    return ig('', W1, 2, 6,
      '<p class="rn">I.</p>' +
      '<p class="h">Колку е <em>честа?</em></p>' +
      '<div class="bd" style="top:47cqi"><p>Систематски преглед на 43 студии кај професионални музичари: проценките се движат од 16,5% до 60% <span class="ci">(Fernholz et al., 2019)</span>.</p>' +
      '<p>Опсегот е широк затоа што студиите мерат на различни начини. Поточно е да се каже „честа е“ отколку да се наведе една бројка.</p></div>', o);
  };
  M['ig-evidence'] = function (o) {
    return ig('nt', W1, 3, 6,
      ev(2, '', 'position:absolute;left:8cqi;top:24cqi;font-size:3.6cqi') +
      '<p class="h" style="top:32cqi">Тремата е честа и кај <em>професионалците.</em></p>' +
      '<div class="bd" style="top:60cqi"><p>Доследен наод во повеќе прегледи. Точната бројка е непозната: студиите користат различни дефиниции, прашалници и прагови.</p></div>' +
      '<div class="lg">' + ev(3) + ev(2, 'on') + ev(1) + ev(0) + '</div>', o);
  };
  M['ig-known'] = function (o) {
    return ig('pp', W1, 5, 6,
      '<div class="kw" style="top:22cqi"><p class="hd">' + l('s03') + '<b>Што знаеме</b></p><ul>' +
        '<li>Тремата е честа и кај професионалците.</li><li>Катастрофизирањето е поврзано со посилна трема.</li><li>КБТ-пристапите се најистражувани.</li></ul></div>' +
      '<div class="kw" style="top:66cqi"><p class="hd">' + l('s05') + '<b>Што сè уште не знаеме</b></p><ul>' +
        '<li>Кој пристап е најдобар за кого.</li><li>Дали преоценувањето ја подобрува изведбата.</li><li>Колку е честа во Македонија: речиси нема податоци.</li></ul></div>', o);
  };
  M['ig-sources'] = function (o) {
    return ig('pp', W1, 6, 6,
      '<p class="h" style="top:20cqi">Извори</p>' +
      '<ul class="src" style="top:32cqi">' +
        '<li>Brooks, A. W. (2014). Get excited: Reappraising pre-performance anxiety as excitement. <i>Journal of Experimental Psychology: General, 143</i>(3), 1144–1158. <span class="doi">doi.org/10.1037/a0035325</span></li>' +
        '<li>Fernholz, I., et al. (2019). Performance anxiety in professional musicians: A systematic review on prevalence, risk factors and clinical treatment effects. <i>Psychological Medicine, 49</i>(14), 2287–2306. <span class="doi">doi.org/10.1017/S0033291719001910</span></li>' +
        '<li>Kenny, D. T. (2011). <i>The psychology of music performance anxiety</i>. Oxford University Press.</li>' +
      '</ul>' +
      '<p class="nt-note">Ова не е дијагноза ниту терапија. Ако тремата ве спречува да настапувате, разговарајте со психолог, психотерапевт или лекар. Сите 19 извори: jasnota.mk</p>', { st: o && o.st, end: true });
  };

  /* one cover per format */
  M['ig-f-text'] = function (o) {
    return ig('', 'I · текст', 1, 7,
      '<p class="tt">Зошто музиката нè <em>допира</em></p>' +
      '<p class="sb" style="top:64cqi">Механизми, морници и парадоксот на тажната песна.</p>', o);
  };
  M['ig-f-study'] = function (o) {
    return ig('', 'III · приказ на студија', 1, 6,
      '<p class="ref" style="top:22cqi;color:var(--ash)">Brooks (2014) · N = 113–218</p>' +
      '<p class="tt" style="top:31cqi">„Возбуден/а сум“: една студија под <em>лупа</em></p>' +
      ev(1, '', 'position:absolute;left:8cqi;bottom:18cqi'), o);
  };
  M['ig-f-concept'] = function (o) {
    return ig('pp', 'II · поим', 1, 5,
      '<p class="tt" style="top:30cqi;font-size:12.6cqi">Феноменот на <em>измамник</em></p>' +
      '<p class="ref" style="top:62cqi;color:var(--ash-light)">impostor phenomenon</p>' +
      '<p class="sb" style="top:72cqi">Кога сопствениот успех се доживува како среќа или грешка, а не како заслуга.</p>', o);
  };
  M['ig-f-myth'] = function (o) {
    return ig('', 'III · мит vs наука', 1, 6,
      '<p class="ref" style="top:22cqi;color:var(--ash)">Тврдење</p>' +
      '<p class="tt" style="top:30cqi"><span class="strike">Моцарт нè прави попаметни.</span></p>' +
      '<p class="ref" style="top:76cqi;color:var(--bone)">Пресуда: мит</p>' +
      ev(3, '', 'position:absolute;left:8cqi;top:83cqi'), o);
  };
  M['ig-f-list'] = function (o) {
    return ig('pp', 'II · листа за читање', 1, 6,
      '<p class="tt" style="top:24cqi;font-size:9.6cqi">Трема: пет извори <em>за почеток</em></p>' +
      '<ol class="rl" style="top:58cqi"><li>Kenny (2011) · книга</li><li>Fernholz et al. (2019) · систематски преглед</li><li>Burin &amp; Osório (2017) · критички преглед</li><li>Kenny (2005) · преглед на третмани</li><li>Brooks (2014) · експерименти</li></ol>', o);
  };

  /* small covers for pillar pages and the profile grid */
  M['ig-w6'] = function (o) { return ig('', 'I · текст', 1, 6, '<p class="tt">Што слушавте на <em>седумнаесет?</em></p><p class="sb" style="top:68cqi">Музика, меморија и идентитет.</p>', o); };
  M['ig-w5'] = function (o) { return ig('', 'II · текст', 1, 6, '<p class="tt" style="font-size:10.4cqi">Перфекционизмот кај <em>музичарите</em></p><p class="sb" style="top:66cqi">Кога високите стандарди помагаат, а кога пречат.</p>', o); };
  M['ig-w7'] = function (o) { return ig('', 'III · приказ на студија', 1, 6, '<p class="ref" style="top:22cqi;color:var(--ash)">Salimpoor et al. (2011)</p><p class="tt" style="top:31cqi">Допамин и <em>морници</em></p>' + ev(2, '', 'position:absolute;left:8cqi;bottom:18cqi'), o); };
  M['ig-w9'] = function (o) { return ig('', 'III · мит vs наука', 1, 6, '<p class="ref" style="top:22cqi;color:var(--ash)">Тврдење</p><p class="tt" style="top:30cqi;font-size:9.8cqi"><span class="strike">Музиката во позадина помага при учење.</span></p><p class="ref" style="top:84cqi;color:var(--bone)">Пресуда: мит</p>', o); };
  M['ig-w11'] = function (o) { return ig('', 'I · текст', 1, 6, '<p class="tt">Пеењето <em>заедно</em></p><p class="sb" style="top:56cqi">Што знаеме за музиката и поврзаноста.</p>', o); };
  M['ig-w12'] = function (o) { return ig('pp', 'III · поим', 1, 5, '<p class="tt" style="font-size:10cqi">Музикотерапија и „музичка <em>медицина</em>“</p><p class="sb" style="top:74cqi">Што е што.</p>', o); };

  /* ================================================================ Instagram stories, 9:16 */
  function st(cls, mode, inner, light) {
    return '<div class="x-st ' + (mode === 'fill' ? 'fill' : 'solo') + ' ' + cls + '" lang="mk">' +
      l('m', 'mk', 'color:' + (light ? 'var(--ink)' : 'var(--bone)')) + inner + '</div>';
  }
  M['st-question'] = function (mode) {
    return st('', mode,
      '<p class="mt">Прашања за науката</p>' +
      '<p class="tt">Што сакате да знаете за <em>тремата?</em></p>' +
      '<div class="stk" style="top:96cqi"><p class="q">Прашај нè нешто</p><p class="a">Напиши прашање…</p></div>' +
      '<p class="bd" style="top:136cqi">Одговараме со извори, не со совети.</p>' +
      '<div class="ft">' + l('wc') + '<span>@jasnota</span></div>');
  };
  M['st-poll'] = function (mode) {
    return st('', mode,
      '<p class="mt">Мит или наука?</p>' +
      '<p class="tt">„Вистинските професионалци немаат <em>трема</em>.“</p>' +
      '<div class="stk" style="top:104cqi"><div class="o"><span>Мит</span><span>Наука</span></div></div>' +
      '<p class="bd" style="top:128cqi">Одговорот, со ознака за доказите и со извори, во следната приказна.</p>' +
      '<div class="ft">' + l('wc') + '<span>@jasnota</span></div>');
  };
  M['st-source'] = function (mode) {
    return st('pp', mode,
      '<p class="mt">Извор на неделата</p>' +
      '<p class="tt" style="font-size:8.6cqi;line-height:1">Во една голема онлајн анкета, тажната музика најчесто будела <em>носталгија</em>, не тага.</p>' +
      ev(2, '', 'position:absolute;left:9cqi;top:104cqi') +
      '<p class="apa" style="top:112cqi">Taruffi, L., &amp; Koelsch, S. (2014). The paradox of music-evoked sadness: An online survey. <i>PLOS ONE, 9</i>(10), Article e110490.<span class="doi">doi.org/10.1371/journal.pone.0110490</span></p>' +
      '<div class="ft">' + l('wc') + '<span>@jasnota</span></div>', true);
  };

  /* ================================================================ devices */
  var phone = function (pos, inner) {
    return '<div class="x-phone" style="' + pos + '"><div class="bz"><div class="scr"><span class="isl"></span>' + inner + '</div></div></div>';
  };
  var storyUI = function (light, n) {
    var p = ''; for (var i = 0; i < 3; i++) p += '<i' + (i === n ? ' class="on"' : '') + '></i>';
    return '<div class="x-igui' + (light ? ' lt' : '') + '"><div class="prog">' + p + '</div><div class="who"><b>' + l('m') + '</b>jasnota <span>2 ч</span></div></div>';
  };
  M['st-phones'] = function () {
    return '<div class="x-scene x-a1610">' +
      phone('left:5%;top:6%;width:26%', storyUI(false, 0) + M['st-question']('fill')) +
      phone('left:37%;top:6%;width:26%', storyUI(false, 1) + M['st-poll']('fill')) +
      phone('left:69%;top:6%;width:26%', storyUI(true, 2) + M['st-source']('fill')) +
    '</div>';
  };

  /* ================================================================ Instagram profile (the platform account) */
  var hlSigns = [['За Јаснота', 'm'], ['Музика', 'I'], ['Музичари', 'II'], ['Наука', 'III'], ['Прашања', 's04'], ['Поими', 's03']];
  M.hlc = function (sign) { return '<div class="x-hlc"><span>' + (/^I+$/.test(sign) ? '<span class="pil">' + sign + '</span>' : l(sign)) + '</span></div>'; };
  M.hlrow = function () {
    return '<div class="hlrow" lang="mk">' + hlSigns.map(function (h) { return '<div class="hl">' + M.hlc(h[1]) + '<span>' + h[0] + '</span></div>'; }).join('') + '</div>';
  };
  M['ig-profile'] = function () {
    var hls = hlSigns.map(function (h) { return '<div class="hl">' + M.hlc(h[1]) + h[0] + '</div>'; }).join('');
    var t = function (k) { return '<div class="x-tile">' + M[k]() + '</div>'; };
    var grid = ['ig-w9', 'ig-f-concept', 'ig-w7', 'ig-w6', 'ig-w5', 'ig-f-myth', 'ig-f-text', 'ig-f-study', 'ig-cover'].map(t).join('');
    var inner = '<div class="x-status"><span>9:41</span><span><i></i></span></div>' +
      '<div class="x-prof" lang="mk">' +
        '<div class="un">jasnota <span>мк · en</span></div>' +
        '<div class="tp"><div class="av">' + l('m') + '</div><div class="st"><span><b>9</b>објави</span><span><b>—</b>следбеници</span><span><b>—</b>следи</span></div></div>' +
        '<div class="bio"><b>Јаснота · Психологијата зад музиката</b><br>Едукативна платформа. Научно засновано, со извори.<br>Информира; не е терапија ни совет.<br>Уредува: Јасна Димитровска · Битола<br><span class="ln">jasnota.mk</span></div>' +
        '<div class="btn"><span>Следи</span><span>Порака</span></div>' +
        '<div class="hls">' + hls + '</div>' +
        '<div class="grid">' + grid + '</div>' +
      '</div>';
    return '<div class="x-scene x-a34">' + phone('left:22%;top:4%;width:56%', inner) + '</div>';
  };

  /* ================================================================ article page (web) */
  var awDesk = '<div class="x-aw" lang="mk">' +
    '<div class="hdr">' + l('hc') + '<nav><span>Текстови</span><span>Столбови</span><span>Поими</span><span>За Јаснота</span><span>мк · en</span></nav></div>' +
    '<div class="side"><b>II · Психолошкиот свет на музичарот</b><br>текст · 6 мин<br>2 ноември 2026<br><br>Јасна Димитровска</div>' +
    '<div class="main">' +
      '<h5>Трема: што навистина знаеме за музичката <em>анксиозност</em> при изведба</h5>' +
      '<p class="dek">Што велат истражувањата за тоа колку е честа тремата, зошто се јавува и што навистина помага – и каде доказите сè уште се тенки.</p>' +
      '<p class="by"><span>19 извори · 4 ознаки за доказите</span><span>мк · en</span></p>' +
      '<div class="tx"><p>Ладни дланки, срце што чука побрзо од метрономот, сува уста токму пред фраза што бара здив. Многу музичари го познаваат ова чувство – од ученици на првиот годишен концерт до членови на професионални оркестри.</p></div>' +
      '<h6>Колку е честа?</h6>' +
      '<div class="tx" style="margin-top:1cqi"><p>Тука треба да бидеме внимателни со бројките. Систематскиот преглед на 43 студии кај професионални музичари покажа преваленца некаде меѓу 16,5% и 60% <span class="ci">(Fernholz et al., 2019)</span>. Опсегот е широк затоа што студиите користат различни дефиниции, прашалници и прагови.</p></div>' +
      '<div class="evc">' + ev(2) + '<p>Дека музичката анксиозност е честа и кај професионалците е доследен наод во повеќе прегледи. Точната преваленца е непозната поради различните методи на мерење.</p></div>' +
    '</div>' +
    '<div class="aside"><b>Во текстот</b><p>Што е музичка анксиозност<br>Колку е честа?<br>Телото и умот<br>Што помага<br>Што знаеме · што не</p><b>Поим</b><p>музичка анксиозност при изведба<br>(music performance anxiety, MPA)</p></div>' +
  '</div>';
  var awEnd = '<div class="x-status"><span>9:41</span><span><i></i></span></div>' +
    '<div class="x-am" lang="mk"><div class="hdr">' + l('hc') + '<span>мени</span></div>' +
    '<div class="blk"><p class="hd">' + l('s03') + '<b>Што знаеме</b></p><ul><li>Тремата е честа и кај професионалците; проценките се од 16,5% до 60%.</li><li>Когнитивно-бихевиоралните пристапи се најистражувани.</li></ul></div>' +
    '<div class="blk"><p class="hd">' + l('s05') + '<b>Што сè уште не знаеме</b></p><ul><li>Кој пристап е најдобар за кого.</li><li>Како изгледа тремата кај музичарите во Македонија.</li></ul></div>' +
    '<div class="blk"><p class="hd"><b>Извори</b></p><ul class="src"><li>Brooks, A. W. (2014). Get excited: Reappraising pre-performance anxiety as excitement.<span class="doi">https://doi.org/10.1037/a0035325</span></li></ul></div>' +
    '<p class="note">Ова не е дијагноза ниту терапија, ниту индивидуален совет.</p>' + l('s05', 'end') + '</div>';
  M.article = function () {
    return '<div class="x-scene x-a1610">' +
      '<div class="x-laptop" style="left:3%;top:8%;width:75%;filter:drop-shadow(0 1.6cqi 2.4cqi rgba(0,0,0,.55))"><div class="lid"><div class="scr">' + awDesk + '</div></div><div class="base"></div></div>' +
      phone('left:76%;top:10%;width:20%', awEnd) +
    '</div>';
  };
  M['article-phone'] = function () { return '<div class="x-scene x-a45">' + phone('left:30%;top:5%;width:40%', awEnd) + '</div>'; };

  /* ================================================================ newsletter header, citation card */
  M.newsletter = function () {
    return '<div class="x-nl solo" lang="mk">' + l('hc', 'lk') +
      '<p class="mt">Билтен · бр. 01<br>ноември 2026</p>' +
      '<div class="staff"><i></i><i></i><i></i><i></i><i></i></div><span class="pt"></span>' +
      '<p class="tt">Психологијата зад <em>музиката</em></p>' +
      '<p class="rt">jasnota.mk · @jasnota</p></div>';
  };
  M['citation-card'] = function () {
    return '<div class="x-cc solo" lang="mk">' + l('m', 'mk', 'color:var(--ink)') + '<p class="mt">Цитат · II</p>' +
      '<p class="q">Кај професионалните музичари, проценките за тремата се движат од <em>16,5% до 60%</em>, зависно од тоа како се мери.</p>' +
      ev(2) +
      '<p class="apa">Fernholz, I., et al. (2019). Performance anxiety in professional musicians: A systematic review on prevalence, risk factors and clinical treatment effects. <i>Psychological Medicine, 49</i>(14), 2287–2306.<span class="doi">https://doi.org/10.1017/S0033291719001910</span></p></div>';
  };

  /* ================================================================ talks and lectures: slides */
  M.slides = function () {
    return '<div class="x-scene x-a1610" lang="mk">' +
      '<div class="x-slide x-ink x-sh" style="left:4%;top:6%;width:60%">' +
        l('hc', 'lk', 'color:var(--bone)') + '<p class="k x-ash">Предавање · 40 мин</p>' +
        '<h5>Трема: што навистина <em>знаеме</em></h5>' +
        '<div class="bt"><span>Јасна Димитровска · уредничка, Јаснота</span><span>jasnota.mk</span></div>' +
      '</div>' +
      '<div class="x-slide x-ink x-sh" style="left:40%;top:40%;width:56%;box-shadow:inset 0 0 0 1px #2a2a2d,0 1.4cqi 3.2cqi rgba(0,0,0,.5)">' +
        '<p class="k x-ash">07 / 18</p><p class="no">II.</p>' + ev(1) +
        '<p class="bq">„Возбуден/а сум“ ја зголемува возбудата. Дали ја подобрува и <em>изведбата</em>, не знаеме.</p>' +
        '<p class="nt">Ефектот врз изведбата не се потврди во директната репликација. <span class="ci">(Brooks, 2014; Poynter &amp; Smith Pasqualini, 2025)</span></p>' +
      '</div>' +
      '<div class="x-slide x-paper x-sh-soft" style="left:8%;top:68%;width:30%">' +
        l('m', '', 'position:absolute;left:5cqi;top:5cqi;width:6cqi;height:6cqi;color:var(--ink)') +
        '<p class="x-d" style="position:absolute;left:5cqi;bottom:9cqi;font-size:9cqi;line-height:.9">Извори и <em>прашања.</em></p>' +
        l('s05', '', 'position:absolute;right:5cqi;bottom:9cqi;width:5cqi;height:5cqi;color:var(--ink)') +
      '</div>' +
    '</div>';
  };

  /* ================================================================ partnership one-pager, A4 */
  M.partner = function () {
    return '<div class="x-scene x-a34" style="background:#141416">' +
      '<div class="x-a4 x-sh" style="left:11%;top:8.6%;width:78%" lang="mk">' +
        l('hc', 'lk') + '<p class="mt">Соработка<br>2026</p>' + l('s04', 'sg') +
        '<h5>Психологијата и музиката, <em>јасно</em> и со извори.</h5>' +
        '<p class="ld">Јаснота е информативна и едукативна платформа што ја истражува и објаснува поврзаноста меѓу музиката, психолошкото искуство и човековото однесување преку научно засновани содржини. Пишуваме на македонски, за музичари, студенти и пошироката јавност.</p>' +
        '<div class="cols">' +
          '<div><b>Што нудиме</b><ul><li>Разбирливи текстови со проверени извори и ознаки за доказите</li><li>Видливост за домашните истражувања и стручњаци</li><li>Македонска верзија на меѓународни наоди</li></ul></div>' +
          '<div><b>Што бараме</b><ul><li>Стручен преглед на текстови пред објава</li><li>Споделување истражувања и податоци</li><li>Гостински текстови и заеднички теми</li></ul></div>' +
          '<div><b>Нашите граници</b><ul><li>Без дијагноза, терапија и индивидуален совет</li><li>Без реклами во едукативната содржина</li><li>Видливи исправки</li></ul></div>' +
        '</div>' +
        '<p class="now">Во почетната фаза објавуваме по еден текст неделно и ги мапираме сродните професионалци и организации во Македонија и регионот.</p>' +
        '<div class="ft"><span><b>Јасна Димитровска</b>уредничка и авторка</span><span style="text-align:right">zdravo@jasnota.mk · jasnota.mk<br>@jasnota · Битола, Македонија</span></div>' +
      '</div>' +
    '</div>';
  };

  /* ================================================================ business card, email signature, notebook */
  M.cards = function () {
    return '<div class="x-scene x-a43" lang="mk">' +
      '<div class="x-card x-card--front x-ink x-sh" style="left:40%;top:7%;width:56%;transform:rotate(3deg)"><div class="in">' +
        l('m', 'mark') + '<p class="url x-m">jasnota.mk</p>' +
      '</div></div>' +
      '<div class="x-card x-card--back x-paper x-sh" style="left:5%;top:42%;width:56%;transform:rotate(-2.2deg)"><div class="in">' +
        l('wc', 'wm x-cin') +
        '<div class="who"><p class="nm x-d">Јасна Димитровска</p><p class="nm-mk x-d x-i" lang="en">Jasna Dimitrovska</p><p class="role x-t">Уредничка и авторка · <span lang="en">Editor &amp; author</span></p></div>' +
        '<p class="ct x-m">zdravo@jasnota.mk<br>jasnota.mk · @jasnota<br>Битола, Македонија</p>' +
      '</div></div>' +
    '</div>';
  };
  M.signature = function () {
    return '<div class="x-scene x-a43" lang="mk">' +
      '<div class="x-mail x-sh" style="left:7%;top:8%;width:86%">' +
        '<div class="bar"><i></i><i></i><i></i></div>' +
        '<div class="hd x-t"><b>Од</b> Јасна Димитровска &lt;zdravo@jasnota.mk&gt;<br><b>Тема</b> Стручен преглед на текст за тремата</div>' +
        '<div class="bd x-t"><p>Почитувани,</p><p>подготвуваме текст за музичката анксиозност при изведба и би ни значел ваш стручен поглед пред објавата. Ви го праќаме нацртот со сите извори.</p><p>Со почит,<br>Јасна</p></div>' +
        '<div class="sig x-t"><div class="mk">' + l('m') + '</div><div>' +
          '<p class="n">Јасна Димитровска</p>' +
          '<p class="r">Уредничка · Јаснота — Психологијата зад музиката</p>' +
          '<p class="l">jasnota.mk · @jasnota · Битола, Македонија</p>' +
        '</div></div>' +
      '</div>' +
    '</div>';
  };
  M.notebook = function () {
    return '<div class="x-scene x-a43" style="background:#121214">' +
      '<div class="x-book" style="left:31%;top:9%;width:38%">' +
        '<div class="edge"></div>' +
        '<div class="cv x-sh">' +
          '<div class="deb">' + l('m', 'lo') + l('m', 'hi') + '</div>' +
          '<div class="foil">' + l('wc') + '<p lang="mk">белешки за истражување</p></div>' +
          '<div class="spine"></div><div class="band"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  /* ================================================================ app icon + favicon */
  M.icons = function () {
    var apps = '';
    ['b', '', 'c', 'd', '', 'c', 'b', 'j', 'd', '', 'b', 'c'].forEach(function (c) {
      apps += c === 'j' ? '<div class="ap j"><i>' + l('m') + '</i><span lang="mk">Јаснота</span></div>' : '<div class="ap"><i class="' + c + '"></i><span>&nbsp;</span></div>';
    });
    var home = '<div class="x-home"><div class="x-status"><span>9:41</span><span><i></i></span></div><div class="grid">' + apps + '</div><div class="dock"><i></i><i></i><i></i><i></i></div></div>';
    return '<div class="x-scene x-a43">' +
      phone('left:6%;top:4%;width:31%', home) +
      '<div class="x-browser x-sh" style="left:44%;top:9%;width:51%">' +
        '<div class="tabs"><div class="dots"><i></i><i></i><i></i></div><div class="tab on" lang="mk">' + l('mf', '', 'background:#0a0a0b;color:#ece8e1;padding:.3cqi;border-radius:.4cqi') + 'Јаснота — Психологијата зад музиката</div><div class="tab"><i></i>New tab</div></div>' +
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

  window.JASNOTA_MOCKS = M;
})();
