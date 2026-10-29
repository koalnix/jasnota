/* Jasnota — shared shell partials (head, header + veil, footer + scripts).
   Injected by tools/build.mjs between marker comments in every page:
     <!-- shell:head --> … <!-- /shell:head -->
     <!-- shell:top -->  … <!-- /shell:top -->
     <!-- shell:foot --> … <!-- /shell:foot -->
   `r` is the relative prefix to the site root ('' | '../' | '../../'); `page` marks the current nav item.
   Macedonian is the default: every label is Macedonian in the HTML, English comes from js/i18n.js. */

export const SITE_URL = (process.env.SITE_URL || 'https://jasnota.mk/').replace(/\/?$/, '/');

export const MARK = '<svg class="mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path d="M28 14 V44 A22 22 0 0 0 72 44 V14"/><path d="M50 6 V52"/><path d="M50 64 V94"/></svg>';

export const PILLARS = [
  { n: 1, roman: 'I', slug: 'psychology-of-music', key: 'p1', mk: 'Психологијата на музиката', en: 'The psychology of music' },
  { n: 2, roman: 'II', slug: 'musicians', key: 'p2', mk: 'Психолошкиот свет на музичарот', en: 'The musician\'s mind' },
  { n: 3, roman: 'III', slug: 'what-science-says', key: 'p3', mk: '„Што вели науката?“', en: 'What does science say?' },
];

// [id, href, i18n key, Macedonian label]
const NAV = [
  ['articles', 'articles/', 'nav_articles', 'Текстови'],
  ['pillars', null, 'nav_pillars', 'Столбови'],
  ['concepts', 'concepts/', 'nav_concepts', 'Поимник'],
  ['map', 'map/', 'nav_map', 'Мапа'],
  ['about', 'about/', 'nav_about', 'За Јаснота'],
  ['contact', 'contact/', 'nav_contact', 'Соработка'],
];
const MORE = [
  ['myths', 'myths/', 'nav_myths', 'Митови и наука'],
  ['sources', 'sources/', 'nav_sources', 'Извори'],
  ['method', 'method/', 'nav_method', 'Како работиме'],
];

/* Runs before first paint: motion on/off, language (Macedonian unless the reader chose English), arrival flags. */
const BOOT = `(function(d,w){var h=d.documentElement,c=h.classList;c.add('js');
var st=/[?&]static\\b/.test(location.search),rm=w.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!st&&!rm)c.add('motion');
var l=null;try{l=localStorage.getItem('jasnota-lang')}catch(e){}
if(l!=='en')l='mk';
h.lang=l;if(l==='en')c.add('i18n-wait');
if(c.contains('motion')){try{var s=sessionStorage;if(s.getItem('jasnota-go')){c.add('is-arriving');s.removeItem('jasnota-go')}else if(!s.getItem('jasnota-seen'))c.add('is-first')}catch(e){}}
function q(v){if(v)['ready','finished','updateCallbackDone'].forEach(function(k){v[k]&&v[k].catch(function(){})})}
w.addEventListener('pageswap',function(e){q(e.viewTransition)});
w.addEventListener('unhandledrejection',function(e){var r=e.reason;if(r&&(r.name==='AbortError'||r.name==='InvalidStateError')&&/transition/i.test(r.message||''))e.preventDefault()});
w.addEventListener('pagereveal',function(e){q(e.viewTransition)});
setTimeout(function(){if(!h.hasAttribute('data-booted'))c.remove('i18n-wait','is-arriving','is-first','motion')},3500)})(document,window);`;

export const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': SITE_URL + '#org',
  name: 'Јаснота',
  alternateName: 'Jasnota',
  url: SITE_URL,
  logo: SITE_URL + 'assets/brand/mark.svg',
  description: 'Информативна и едукативна платформа за психологијата зад музиката.',
  slogan: 'Психологијата зад музиката',
  email: 'zdravo@jasnota.mk',
  sameAs: ['https://www.instagram.com/jasnota'],
  founder: { '@type': 'Person', '@id': SITE_URL + 'about/#jasna', name: 'Јасна Димитровска', alternateName: 'Jasna Dimitrovska' },
  address: { '@type': 'PostalAddress', addressLocality: 'Битола', addressCountry: 'MK' },
  inLanguage: ['mk', 'en'],
};

export const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

/* path: the page's path from the site root ('' for home, 'about/' …) */
export function head(r, { gsap = false, path = '', index = true } = {}) {
  return `
  <meta name="author" content="Јасна Димитровска">
  <meta name="theme-color" content="#0a0a0b">
  <meta name="color-scheme" content="dark">
  ${index ? `<link rel="canonical" href="${SITE_URL}${path}">` : '<meta name="robots" content="noindex">'}
  <meta property="og:site_name" content="Јаснота">
  <meta property="og:locale" content="mk_MK">
  <meta property="og:locale:alternate" content="en_GB">
  <meta property="og:url" content="${SITE_URL}${path}">
  <meta property="og:image" content="${SITE_URL}assets/brand/lockup-stacked.svg">
  <style>html{background:#0a0a0b;color:#ece8e1}</style>
  <link rel="icon" href="${r}assets/brand/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${gsap ? '  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>\n' : ''}  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300&amp;family=Onest:wght@300;400&amp;family=JetBrains+Mono:wght@300&amp;display=swap">
  <link rel="stylesheet" href="${r}assets/brand/tokens.css">
  <link rel="stylesheet" href="${r}css/shell.css">
  ${jsonld(ORG)}
  <script>${BOOT}</script>
  `;
}

const cur = (id, page) => (id === page ? ' aria-current="page"' : '');

export function top(r, page) {
  const pillarLinks = (cls) => PILLARS.map((p) =>
    `<a class="${cls}" href="${r}${p.slug}/"${cur(p.slug, page)}><span class="mono">${p.roman}</span><span data-i18n="${p.key}">${p.mk}</span></a>`).join('\n          ');
  const links = NAV.map(([id, href, key, label]) => (href
    ? `<a href="${r}${href}" data-magnetic${cur(id, page)}><span data-i18n="${key}">${label}</span></a>`
    : `<div class="drop">
        <button type="button" class="drop__btn" aria-expanded="false" aria-controls="drop-pillars" data-magnetic${PILLARS.some((p) => p.slug === page) ? ' data-current' : ''}><span data-i18n="${key}">${label}</span></button>
        <div class="drop__panel" id="drop-pillars" hidden>
          ${pillarLinks('drop__a')}
        </div>
      </div>`)).join('\n      ');
  const menuMain = [['home', '', 'nav_home', 'Почетна'], ...NAV].map(([id, href, key, label]) => (href !== null
    ? `<li><a href="${(r + href) || './'}"${cur(id, page)}><span><span data-i18n="${key}">${label}</span></span></a></li>`
    : `<li class="menu__pillars">${PILLARS.map((p) => `<a href="${r}${p.slug}/"${cur(p.slug, page)}><span><span class="mono">${p.roman}</span><span data-i18n="${p.key}">${p.mk}</span></span></a>`).join('')}</li>`)).join('\n        ');
  const menuMore = MORE.map(([id, href, key, label]) => `<a href="${r}${href}"${cur(id, page)} data-i18n="${key}">${label}</a>`).join('\n        ');
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
  <a class="skip" href="#main" data-i18n="skip">Прескокни до содржината</a>
  <header class="hdr">
    <a class="hdr__brand" href="${r || './'}" data-magnetic data-i18n-attr="aria-label:brand_home" aria-label="Јаснота, почетна">
      ${MARK}
      <span class="hdr__word" aria-hidden="true" data-en="jasnota">јаснота</span>
    </a>
    <nav class="hdr__nav" data-i18n-attr="aria-label:nav_label" aria-label="Главна навигација">
      ${links}
    </nav>
    <div class="lang" role="group" data-i18n-attr="aria-label:lang_label" aria-label="Јазик">
      <button type="button" data-lang="mk" aria-pressed="true" lang="mk" data-magnetic><span>мк</span></button>
      <button type="button" data-lang="en" aria-pressed="false" lang="en" data-magnetic><span>en</span></button>
    </div>
    <button type="button" class="hdr__menu" aria-expanded="false" aria-controls="menu" data-magnetic><span data-i18n="menu_open">мени</span></button>
  </header>
  <div class="menu" id="menu" hidden>
    <ul class="menu__links" role="list">
        ${menuMain}
    </ul>
    <p class="menu__more">
        ${menuMore}
    </p>
    <div class="menu__foot">
      <a href="mailto:zdravo@jasnota.mk">zdravo@jasnota.mk</a>
      <div class="lang" role="group" data-i18n-attr="aria-label:lang_label" aria-label="Јазик">
        <button type="button" data-lang="mk" aria-pressed="true" lang="mk"><span>мк</span></button>
        <button type="button" data-lang="en" aria-pressed="false" lang="en"><span>en</span></button>
      </div>
    </div>
  </div>
  `;
}

export function foot(r, { gsap = false, letter = true } = {}) {
  const libs = gsap ? `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>` : '';
  const li = (href, key, label, extra = '') => `<li><a href="${href}" data-magnetic${extra}><span data-i18n="${key}">${label}</span></a></li>`;
  return `
  <footer class="ftr">
    <div class="ftr__grid${letter ? '' : ' ftr__grid--noletter'}">
      <div class="ftr__col ftr__col--about">
        <p class="ftr__desc" data-i18n="descriptor">Психологијата зад музиката</p>
        <p class="ftr__def" data-i18n="ft_def">Информативна и едукативна платформа за поврзаноста меѓу музиката, психолошкото искуство и однесувањето. Научно засновано, со извори.</p>
      </div>
      <div class="ftr__col">
        <h2 data-i18n="nav_pillars">Столбови</h2>
        <ul class="ftr__list" role="list">
          ${PILLARS.map((p) => `<li><a href="${r}${p.slug}/" data-magnetic><span><span class="mono ftr__rn">${p.roman}</span> <span data-i18n="${p.key}">${p.mk}</span></span></a></li>`).join('\n          ')}
        </ul>
      </div>
      <div class="ftr__col">
        <h2 data-i18n="ft_platform">Платформа</h2>
        <ul class="ftr__list" role="list">
          ${li(`${r}articles/`, 'nav_articles', 'Текстови')}
          ${li(`${r}concepts/`, 'nav_concepts', 'Поимник')}
          ${li(`${r}myths/`, 'nav_myths', 'Митови и наука')}
          ${li(`${r}sources/`, 'nav_sources', 'Извори')}
          ${li(`${r}map/`, 'ft_map', 'Мапа на полето')}
          ${li(`${r}method/`, 'nav_method', 'Како работиме')}
          ${li(`${r}about/`, 'nav_about', 'За Јаснота')}
        </ul>
      </div>
      <div class="ftr__col">
        <h2 data-i18n="nav_contact">Соработка</h2>
        <ul class="ftr__list" role="list">
          ${li(`${r}contact/`, 'ft_collab', 'Предложи тема или соработка')}
          <li><a href="mailto:zdravo@jasnota.mk" data-magnetic data-cursor="write"><span>zdravo@jasnota.mk</span></a></li>
          <li><a href="https://www.instagram.com/jasnota" rel="noopener" target="_blank" data-magnetic><span>Instagram @jasnota</span></a></li>
        </ul>
      </div>
${letter ? `      <form class="letter ftr__letter" novalidate>
        <p class="ftr__lede" data-i18n="ft_lede">Едно писмо месечно. <em>Без шум.</em></p>
        <label class="letter__label" for="ftr-email" data-i18n="ft_label">Новите текстови и еден поим, ништо друго.</label>
        <div class="letter__row">
          <input id="ftr-email" name="email" type="email" autocomplete="email" required data-i18n-attr="placeholder:ft_ph" placeholder="твојата е-пошта">
          <button type="submit" data-magnetic><span><span data-i18n="ft_btn">Пријави се</span><span class="arr" aria-hidden="true">→</span></span></button>
        </div>
        <p class="letter__msg" role="status" aria-live="polite"></p>
      </form>` : ''}
    </div>
    <p class="ftr__word" aria-hidden="true" data-word>јаснота</p>
    <div class="ftr__base mono">
      <span data-i18n="ft_copy">© 2026 Јаснота · Јасна Димитровска, Битола, Македонија</span>
      <span><span data-i18n="ft_tz">Битола</span> · <span class="tc" data-clock></span></span>
      <span>7/8 <span class="dot">·</span> 2+2+3 <span class="dot">·</span> <span data-i18n="ft_end">07:08, крај</span></span>
    </div>
  </footer>

  <div class="preview" aria-hidden="true">
    <div class="preview__frame"><svg class="preview__svg" viewBox="0 0 280 150" preserveAspectRatio="none"><path d=""/></svg><span class="preview__no mono"></span></div>
    <p class="preview__x"></p>
  </div>
  <div class="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"><span class="cursor__label"></span></span></div>
  <div class="grain" aria-hidden="true"></div>
  ${libs}
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
