#!/usr/bin/env node
/* Jasnota — link-preview images (Open Graph / Twitter), 1200 × 630 PNG, rendered with headless Google Chrome.

     node website/tools/og.mjs            # render what changed (also run by build.mjs)
     node website/tools/og.mjs --force    # render everything again

   One image per article (assets/og/articles/<slug>.png) and one per main page (assets/og/<page>.png).
   Each card is an HTML page (template below) screenshotted by Chrome. Cards are cached by a hash of their content +
   the template version + the fonts, kept in assets/og/og.json: an unchanged card is never rendered twice.
   Fonts (Cormorant, Onest, JetBrains Mono, Cyrillic + Latin) are downloaded once from Google Fonts into
   tools/.cache/fonts/ so Chrome renders offline and never screenshots a fallback face.
   Without Chrome (CHROME=/path/to/chrome to override) the existing PNGs are kept and the build goes on.
   Also exports shoot() and fontsCSS() for other renderers (instagram/tools/fb-assets.mjs). */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PILLARS } from './shell.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, '..');
const CONTENT = join(SITE, 'content');
const OUT = join(SITE, 'assets', 'og');
const CACHE = join(HERE, '.cache');
const FONTS = join(CACHE, 'fonts');
const TEMPLATE_VERSION = 'og-5';
export const OG_W = 1200;
export const OG_H = 630;
export const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const log = (...a) => console.log('  ', ...a);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const sha = (s) => createHash('sha1').update(s).digest('hex').slice(0, 16);

/* ------------------------------------------------------------------ fonts (cached locally) */
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300&family=Onest:wght@300;400&family=JetBrains+Mono:wght@300;400&display=block';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const SUBSETS = ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'];
let fontsMemo = null;
/* returns the @font-face CSS with file:// URLs (or a network @import if the download is impossible) */
export async function fontsCSS() {
  if (fontsMemo) return fontsMemo;
  const local = join(FONTS, 'fonts.css');
  if (!existsSync(local)) {
    try {
      mkdirSync(FONTS, { recursive: true });
      const css = await (await fetch(FONT_CSS, { headers: { 'user-agent': UA } })).text();
      const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*{[^}]*})/g)].filter((m) => SUBSETS.includes(m[1]));
      if (!blocks.length) throw new Error('no @font-face in the Google Fonts response');
      let out = '';
      for (const [, subset, block] of blocks) {
        const url = block.match(/url\((https:[^)]+)\)/)[1];
        const fam = block.match(/font-family:\s*'([^']+)'/)[1].replace(/\s+/g, '');
        const style = block.match(/font-style:\s*(\w+)/)[1];
        const weight = block.match(/font-weight:\s*(\d+)/)[1];
        const file = `${fam}-${weight}${style === 'italic' ? 'i' : ''}-${subset}.woff2`;
        if (!existsSync(join(FONTS, file))) writeFileSync(join(FONTS, file), Buffer.from(await (await fetch(url, { headers: { 'user-agent': UA } })).arrayBuffer()));
        out += `/* ${subset} */\n` + block.replace(url, file) + '\n';
      }
      writeFileSync(local, out);
      log(`fonts → ${relative(SITE, FONTS)}/ (${blocks.length} faces)`);
    } catch (e) {
      log('fonts: could not download (' + e.message + '); cards will load Google Fonts over the network');
      return (fontsMemo = `@import url("${FONT_CSS}");`);
    }
  }
  const base = pathToFileURL(FONTS + '/').href;
  return (fontsMemo = readFileSync(local, 'utf8').replace(/url\(([\w.-]+\.woff2)\)/g, (_, f) => `url(${base}${f})`));
}

/* ------------------------------------------------------------------ Chrome */
let chromeOK = null;
export function hasChrome() {
  if (chromeOK === null) { try { chromeOK = statSync(CHROME).isFile(); } catch { chromeOK = false; } }
  return chromeOK;
}
/* screenshot one local HTML file into a PNG of exactly w × h */
export function shoot(htmlFile, png, w = OG_W, h = OG_H, slot = 0) {
  const profile = join(CACHE, `chrome-${slot}`);
  mkdirSync(profile, { recursive: true });
  mkdirSync(dirname(png), { recursive: true });
  const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--mute-audio', '--force-device-scale-factor=1', '--force-color-profile=srgb', '--allow-file-access-from-files',
    `--user-data-dir=${profile}`, '--virtual-time-budget=6000', '--run-all-compositor-stages-before-draw',
    `--window-size=${w},${h}`, `--screenshot=${png}`, pathToFileURL(htmlFile).href];
  return new Promise((ok, fail) => execFile(CHROME, args, { timeout: 60000 }, (err) => (err && !existsSync(png) ? fail(err) : ok(png))));
}
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async (_, slot) => { while (i < items.length) { const k = i++; await fn(items[k], slot); } }));
}

/* ------------------------------------------------------------------ the card template */
const MARK_SVG = (cls, sw = 5) => `<svg class="${cls}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="${sw}" aria-hidden="true"><path d="M28 14 V44 A22 22 0 0 0 72 44 V14"/><path d="M50 6 V52"/><path d="M50 64 V94"/></svg>`;
/* title: everything before the first colon in bone, the rest in ash (one hierarchy, no extra line) */
function titleHTML(t) {
  const s = esc(strip(t));
  const i = s.indexOf(':');
  return i > 0 && i < s.length - 2 ? `${s.slice(0, i + 1)} <span class="rest">${s.slice(i + 1).trim()}</span>` : s;
}
export function cardHTML(c, fonts) {
  const ghost = c.ghost === 'mark' ? MARK_SVG('ghost ghost--mark', 2.2) : `<span class="ghost ghost--t">${esc(c.ghost)}</span>`;
  return `<!doctype html>
<html lang="mk"><head><meta charset="utf-8"><title>${esc(strip(c.title))}</title>
<style>
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${OG_W}px;height:${OG_H}px;overflow:hidden;background:#0a0a0b;color:#ece8e1;-webkit-font-smoothing:antialiased}
body{position:relative;font:300 20px/1.4 Onest,system-ui,sans-serif}
:lang(mk) em{font-language-override:"SRB"}
.ghost{position:absolute;color:#1a1a1d;pointer-events:none}
.ghost--t{right:56px;top:96px;font:300 430px/.86 Cormorant,serif;letter-spacing:-.03em}
.ghost--mark{right:-40px;top:40px;width:560px;height:560px;color:#202024}
.top{position:absolute;left:72px;right:72px;top:62px;display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:16px;font:300 38px/1 Cormorant,serif;letter-spacing:.005em}
.brand svg{width:40px;height:40px;color:#ece8e1}
.lab{font:300 15px/1 "JetBrains Mono",monospace;letter-spacing:.06em;color:#8c8a85;text-align:right}
.lab b{font-weight:400;color:#ece8e1;margin-right:12px}
.box{position:absolute;left:72px;top:150px;width:${c.wide ? 1000 : c.kind === 'article' ? 800 : 860}px;height:${c.sub ? 300 : 340}px;display:flex;flex-direction:column;justify-content:flex-end}
h1{font:300 92px/1.02 Cormorant,serif;letter-spacing:-.012em;text-wrap:balance}
h1 em{font-style:italic;font-weight:300}
h1 .rest{color:#8c8a85}
.sub{margin-top:22px;font:300 23px/1.42 Onest,sans-serif;color:#8c8a85;max-width:44ch;text-wrap:balance}
.base{position:absolute;left:72px;right:72px;bottom:58px;display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid #2a2a2d;font:300 15px/1 "JetBrains Mono",monospace;color:#8c8a85;letter-spacing:.04em}
.meter{display:inline-flex;gap:7px;align-items:center;margin-right:18px;vertical-align:middle}
.meter i{width:7px;height:7px;border-radius:50%;border:1px solid #8c8a85}
.meter i.a{background:#ece8e1;border-color:#ece8e1}
.meter s{width:8px}
.desc{display:flex;align-items:center;gap:12px;color:#ece8e1;font:300 16px/1 Onest,sans-serif;letter-spacing:.01em}
.desc i{width:7px;height:7px;border-radius:50%;background:#b4452c}
</style></head>
<body>
${ghost}
<div class="top"><span class="brand">${MARK_SVG('m')}јаснота</span><span class="lab">${c.label || ''}</span></div>
<div class="box"><h1 id="t">${c.titleHTML}</h1>${c.sub ? `<p class="sub">${esc(c.sub)}</p>` : ''}</div>
<div class="base"><span><span class="meter"><i class="a"></i><i></i><s></s><i class="a"></i><i></i><s></s><i class="a"></i><i></i><i></i></span>${esc(c.foot || '')}</span><span class="desc"><i></i>Психологијата зад музиката</span></div>
<script>
/* shrink the title until it fits its box (whole words only, at most four lines) */
(function(){var t=document.getElementById('t'),b=t.parentNode;function fit(){var s=${c.max || 92};t.style.fontSize=s+'px';
var sub=b.querySelector('.sub'),room=b.clientHeight-(sub?sub.offsetHeight+22:0);
while(s>40&&(t.offsetHeight>room||t.scrollWidth>t.clientWidth+1||t.offsetHeight/(s*1.02)>4.2)){s-=2;t.style.fontSize=s+'px';}}
fit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);})();
</script>
</body></html>`;
}

/* ------------------------------------------------------------------ the cards */
const FORMAT_MK = { text: 'текст', study: 'приказ на студија', concept: 'поим', myth: 'мит vs наука', list: 'листа за читање' };
const pillarOf = (n) => PILLARS.find((p) => p.n === Number(n)) || PILLARS[0];
const plural = (n, one, many) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? one : many}`;

export function collectCards() {
  const articles = readdirSync(join(CONTENT, 'articles')).filter((f) => f.endsWith('.json')).map((f) => read(join(CONTENT, 'articles', f)));
  const count = (f) => { try { const d = read(join(CONTENT, f)); return Array.isArray(d) ? d.length : d.entries.length; } catch { return 0; } };
  const nC = count('concepts.json'), nM = count('myths.json'), nS = count('sources.json'), nMap = count('map.json');
  const cards = [];
  for (const a of articles) {
    const p = pillarOf(a.pillar);
    cards.push({
      id: `articles/${a.slug}`, path: `articles/${a.slug}/`, kind: 'article',
      title: strip(a.title), titleHTML: titleHTML(a.title), ghost: p.roman,
      label: `<b>${p.roman}</b>${esc(strip(p.mk))}`,
      foot: `${FORMAT_MK[a.format] || 'текст'}${a.reading_min ? ` · ${a.reading_min} мин читање` : ''}`,
      alt: `Јаснота: ${strip(a.title)}. Столб ${p.roman}, ${strip(p.mk)}.`,
    });
  }
  const page = (id, path, title, o) => cards.push({ id, path, kind: 'page', title: strip(title), titleHTML: title, ghost: 'mark', ...o,
    alt: o.alt || `Јаснота: ${strip(title)}. Психологијата зад музиката.` });
  page('home', '', 'Психологијата зад <em>музиката</em>', { max: 118, wide: false, label: '', foot: 'научно, со извори · нов текст секој понеделник',
    sub: 'Информативна и едукативна платформа за музиката, психолошкото искуство и однесувањето.',
    alt: 'Јаснота: Психологијата зад музиката. Знакот Ψ (камертон) на црна позадина.' });
  for (const p of PILLARS) {
    page(p.slug, `${p.slug}/`, esc(strip(p.mk)), { ghost: p.roman, label: `<b>${p.roman}</b>столб`, foot: `столб ${p.roman} од III`,
      sub: { 1: 'Како музиката се поврзува со емоциите, меморијата, вниманието и добросостојбата.', 2: 'Трема, перфекционизам, подготовка за настап: психолошката страна на музичкиот живот.', 3: 'Една студија, еден поим, еден мит: кратко, проверливо, со извори.' }[p.n],
      alt: `Јаснота, столб ${p.roman}: ${strip(p.mk)}.` });
  }
  page('articles', 'articles/', 'Текстови', { ghost: '¶', label: 'текстови', foot: plural(articles.length, 'текст', 'текстови') + ' · еден секоја недела', sub: 'Секој текст со извори, ознаки за доказите и тоа што сè уште не знаеме.' });
  page('concepts', 'concepts/', 'Поимник', { ghost: 'Аа', label: 'поимник', foot: `${nC} поими · со извори`, sub: 'Психолошките поими поврзани со музиката, на разбирлив јазик.' });
  page('myths', 'myths/', 'Митови и <em>наука</em>', { ghost: '„“', label: 'митови', foot: `${nM} митови · пресуда и докази`, sub: 'Популарни тврдења за музиката и умот, проверени во истражувањата.' });
  page('sources', 'sources/', 'Извори', { ghost: '§', label: 'библиографија', foot: `${nS} извори · APA 7 · DOI`, sub: 'Сите студии и прегледи на кои се потпира Јаснота.' });
  page('map', 'map/', 'Мапа на <em>полето</em>', { label: 'мапа', foot: `${nMap} записи · Македонија, регионот, светот`, sub: 'Кој работи на психологијата на музиката и музикотерапијата, и што недостасува.' });
  page('about', 'about/', 'За <em>Јаснота</em>', { label: 'за нас', foot: 'уредува Јасна Димитровска, психолог', sub: 'Мисија, принципи и авторката.' });
  page('method', 'method/', 'Како <em>работиме</em>', { ghost: '7/8', label: 'метод', foot: 'извори · ознаки за доказите · исправки', sub: 'Од прашање до објава: хиерархија на изворите, етика и исправки.' });
  page('contact', 'contact/', 'Соработка', { label: 'соработка', foot: 'zdravo@jasnota.mk', sub: 'Предложи тема, пријави грешка, соработувај.' });
  for (const c of cards) c.alt = c.alt.replace(/([?!.…“])\./g, '$1');
  return cards;
}

/* ------------------------------------------------------------------ render (cached) */
const fileOf = (c) => join(OUT, `${c.id}.png`);
/* → Map(path → { url (relative to the site root), alt, w, h }) for every card whose PNG exists */
export async function generate({ force = false, quiet = false } = {}) {
  const cards = collectCards();
  const indexFile = join(OUT, 'og.json');
  const index = existsSync(indexFile) ? read(indexFile) : {};
  const fonts = await fontsCSS();
  const fontKey = sha(fonts.replace(/file:\/\/[^)]*\//g, ''));
  const todo = [];
  for (const c of cards) {
    c.hash = sha(JSON.stringify([TEMPLATE_VERSION, fontKey, c.titleHTML, c.sub, c.label, c.foot, c.ghost, c.max, c.wide]));
    if (force || index[c.id] !== c.hash || !existsSync(fileOf(c))) todo.push(c);
  }
  if (todo.length && !hasChrome()) log(`og: Chrome not found at ${CHROME}; kept ${cards.length - todo.length} cached images, ${todo.length} not rendered`);
  else if (todo.length) {
    const tmp = join(CACHE, 'cards');
    mkdirSync(tmp, { recursive: true });
    const t0 = Date.now();
    await pool(todo, 4, async (c, slot) => {
      const html = join(tmp, c.id.replace(/\//g, '__') + '.html');
      writeFileSync(html, cardHTML(c, fonts));
      try { await shoot(html, fileOf(c), OG_W, OG_H, slot); index[c.id] = c.hash; } catch (e) { log('og: failed', c.id, e.message); }
    });
    log(`og: rendered ${todo.length} image${todo.length === 1 ? '' : 's'} in ${((Date.now() - t0) / 1000).toFixed(1)} s → assets/og/`);
  } else if (!quiet) log(`og: ${cards.length} images up to date`);
  // forget cards that no longer exist (the PNG stays until removed by hand; harmless)
  for (const k of Object.keys(index)) if (!cards.some((c) => c.id === k)) delete index[k];
  mkdirSync(OUT, { recursive: true });
  writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
  const map = new Map();
  for (const c of cards) if (existsSync(fileOf(c))) map.set(c.path, { url: `assets/og/${c.id}.png`, alt: c.alt, w: OG_W, h: OG_H });
  return map;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log('jasnota og images');
  const m = await generate({ force: process.argv.includes('--force') });
  log(`${m.size} cards available`);
}
