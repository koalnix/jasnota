/* Jasnota — shared shell partials (head, header + veil, footer + scripts).
   Injected by tools/build-journal.mjs between marker comments in every page:
     <!-- shell:head --> … <!-- /shell:head -->
     <!-- shell:top -->  … <!-- /shell:top -->
     <!-- shell:foot --> … <!-- /shell:foot -->
   `r` is the relative prefix to the site root ('' | '../' | '../../'); `page` marks the current nav item. */

export const MARK = '<svg class="mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path d="M28 14 V44 A22 22 0 0 0 72 44 V14"/><path d="M50 6 V52"/><path d="M50 64 V94"/></svg>';

const NAV = [
  ['journal', 'journal/', 'nav_journal', 'Journal'],
  ['listen', 'listen/', 'nav_listen', 'Listen'],
  ['about', 'about/', 'nav_about', 'About'],
  ['contact', 'contact/', 'nav_contact', 'Contact'],
];

/* Runs before first paint: motion on/off, language, arrival/first-visit flags. */
const BOOT = `(function(d,w){var h=d.documentElement,c=h.classList;c.add('js');
var st=/[?&]static\\b/.test(location.search),rm=w.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!st&&!rm)c.add('motion');
var l=null;try{l=localStorage.getItem('jasnota-lang')}catch(e){}
if(l!=='en'&&l!=='mk'){var n=(navigator.languages&&navigator.languages[0])||navigator.language||'';l=/^mk\\b/i.test(n)?'mk':'en'}
h.lang=l;if(l==='mk')c.add('i18n-wait');
if(c.contains('motion')){try{var s=sessionStorage;if(s.getItem('jasnota-go')){c.add('is-arriving');s.removeItem('jasnota-go')}else if(!s.getItem('jasnota-seen'))c.add('is-first')}catch(e){}}
function q(v){if(v)['ready','finished','updateCallbackDone'].forEach(function(k){v[k]&&v[k].catch(function(){})})}
w.addEventListener('pageswap',function(e){q(e.viewTransition)});
w.addEventListener('unhandledrejection',function(e){var r=e.reason;if(r&&(r.name==='AbortError'||r.name==='InvalidStateError')&&/transition/i.test(r.message||''))e.preventDefault()});
w.addEventListener('pagereveal',function(e){q(e.viewTransition)});
setTimeout(function(){if(!h.hasAttribute('data-booted'))c.remove('i18n-wait','is-arriving','is-first')},3500)})(document,window);`;

export function head(r) {
  return `
  <meta name="author" content="Jasna Dimitrovska">
  <meta name="theme-color" content="#0a0a0b">
  <meta name="color-scheme" content="dark">
  <link rel="icon" href="${r}assets/brand/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&amp;family=Onest:wght@300;400;500&amp;family=JetBrains+Mono:wght@300;400&amp;display=swap">
  <link rel="stylesheet" href="${r}assets/brand/tokens.css">
  <link rel="stylesheet" href="${r}css/shell.css">
  <script>${BOOT}</script>
  `;
}

export function top(r, page) {
  const links = NAV.map(([id, href, key, label]) =>
    `<a href="${r}${href}" data-magnetic${id === page ? ' aria-current="page"' : ''}><span data-i18n="${key}">${label}</span></a>`).join('\n      ');
  const menuLinks = [['home', '', 'nav_home', 'Home'], ...NAV].map(([id, href, key, label], i) =>
    `<li><a href="${(r + href) || './'}"${id === page ? ' aria-current="page"' : ''}><span><span class="mono">0${i + 1}</span><span data-i18n="${key}">${label}</span></span></a></li>`).join('\n        ');
  return `
  <div class="veil" aria-hidden="true">
    <div class="veil__bands"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="veil__lines"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="veil__center">
      <span class="veil__point"></span>
      <svg class="veil__mark" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><path pathLength="1" d="M28 14 V44 A22 22 0 0 0 72 44 V14"/><path pathLength="1" d="M50 6 V52"/><path pathLength="1" d="M50 64 V94"/></svg>
      <span class="veil__to mono"></span>
    </div>
    <span class="veil__tc mono"><b>00:00</b> / 07:08</span>
  </div>
  <a class="skip" href="#main" data-i18n="skip">Skip to content</a>
  <header class="hdr">
    <a class="hdr__brand" href="${r || './'}" data-magnetic data-i18n-attr="aria-label:brand_home" aria-label="Jasnota, home">
      ${MARK}
      <span class="hdr__word" aria-hidden="true" data-mk="јаснота">jasnota</span>
    </a>
    <nav class="hdr__nav" data-i18n-attr="aria-label:nav_label" aria-label="Main">
      ${links}
    </nav>
    <div class="lang" role="group" data-i18n-attr="aria-label:lang_label" aria-label="Language">
      <button type="button" data-lang="en" aria-pressed="true" lang="en" data-magnetic><span>en</span></button>
      <button type="button" data-lang="mk" aria-pressed="false" lang="mk" data-magnetic><span>мк</span></button>
    </div>
    <button type="button" class="hdr__menu" aria-expanded="false" aria-controls="menu" data-magnetic><span data-i18n="menu_open">menu</span></button>
  </header>
  <div class="menu" id="menu" hidden>
    <ul class="menu__links" role="list">
        ${menuLinks}
    </ul>
    <div class="menu__foot">
      <a href="mailto:zdravo@jasnota.mk">zdravo@jasnota.mk</a>
      <div class="lang" role="group" data-i18n-attr="aria-label:lang_label" aria-label="Language">
        <button type="button" data-lang="en" aria-pressed="true" lang="en"><span>en</span></button>
        <button type="button" data-lang="mk" aria-pressed="false" lang="mk"><span>мк</span></button>
      </div>
    </div>
  </div>
  `;
}

export function foot(r, withGsap) {
  const gsap = withGsap ? `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>` : '';
  return `
  <footer class="ftr">
    <div class="ftr__grid">
      <div class="ftr__col">
        <h2 data-i18n="ft_pages">Pages</h2>
        <ul class="ftr__list" role="list">
          <li><a href="${r || './'}" data-magnetic><span data-i18n="nav_home">Home</span></a></li>
          <li><a href="${r}journal/" data-magnetic><span data-i18n="nav_journal">Journal</span></a></li>
          <li><a href="${r}listen/" data-magnetic><span data-i18n="nav_listen">Listen</span></a></li>
          <li><a href="${r}about/" data-magnetic><span data-i18n="nav_about">About</span></a></li>
          <li><a href="${r}contact/" data-magnetic><span data-i18n="nav_contact">Contact</span></a></li>
        </ul>
      </div>
      <div class="ftr__col">
        <h2 data-i18n="ft_write">Write and follow</h2>
        <ul class="ftr__list" role="list">
          <li><a href="mailto:zdravo@jasnota.mk" data-magnetic data-cursor="write"><span>zdravo@jasnota.mk</span></a></li>
          <li><a href="https://www.instagram.com/jasnota" rel="noopener" target="_blank" data-magnetic><span>Instagram @jasnota</span></a></li>
        </ul>
      </div>
      <form class="letter ftr__letter" novalidate>
        <p class="ftr__lede" data-i18n="ft_lede">One letter a month. <em>No noise.</em></p>
        <label class="letter__label" for="ftr-email" data-i18n="ft_label">New entries, the song of the week, nothing else.</label>
        <div class="letter__row">
          <input id="ftr-email" name="email" type="email" autocomplete="email" required data-i18n-attr="placeholder:ft_ph" placeholder="your email">
          <button type="submit" data-magnetic><span><span data-i18n="ft_btn">Subscribe</span><span class="arr" aria-hidden="true">→</span></span></button>
        </div>
        <p class="letter__msg" role="status" aria-live="polite"></p>
      </form>
    </div>
    <p class="ftr__word" aria-hidden="true" data-word>jasnota</p>
    <div class="ftr__base mono">
      <span data-i18n="ft_copy">© 2026 Jasnota · Jasna Dimitrovska</span>
      <span><span data-i18n="ft_place">Bitola, North Macedonia</span> · <span class="tc" data-clock></span></span>
      <span>7/8 <span class="dot">·</span> 2+2+3 <span class="dot">·</span> <span data-i18n="ft_end">07:08, end</span></span>
    </div>
  </footer>

  <div class="mini" role="region" data-i18n-attr="aria-label:mini_label" aria-label="Now playing">
    <button type="button" class="mini__play" data-i18n-attr="aria-label:pl_pause" aria-label="Pause"><span class="player__icon" aria-hidden="true"></span></button>
    <span class="mini__meta"><span class="mini__t"></span><span class="mini__k mono" data-i18n="mini_label">now playing</span></span>
    <span class="mini__time mono"></span>
    <button type="button" class="mini__x" data-i18n-attr="aria-label:mini_stop" aria-label="Stop">×</button>
    <span class="mini__bar" aria-hidden="true"><i></i></span>
  </div>
  <div class="preview" aria-hidden="true">
    <div class="preview__frame"><svg class="preview__svg" viewBox="0 0 280 150" preserveAspectRatio="none"><path d=""/></svg><span class="preview__no mono"></span></div>
    <p class="preview__x"></p>
  </div>
  <div class="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"><span class="cursor__label"></span></span></div>
  <div class="grain" aria-hidden="true"></div>

  ${gsap}
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
  <script src="${r}js/i18n.js" defer></script>
  <script src="${r}js/shell.js" defer></script>
  `;
}

/* Replace the content between <!-- name --> and <!-- /name --> (markers kept). */
export function inject(html, name, content) {
  const re = new RegExp(`(<!-- ${name} -->)[\\s\\S]*?(<!-- /${name} -->)`);
  if (!re.test(html)) return null;
  return html.replace(re, (_, a, b) => `${a}${content}${b}`);
}
