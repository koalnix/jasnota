#!/usr/bin/env node
/* Jasnota — site build (Node, no dependencies).

     node website/tools/build-journal.mjs [--src <dir with NN.json>]

   1. Syncs brand assets: /brand/logo/*.svg + /brand/tokens.css → website/assets/brand/
   2. Reads website/content/journal/*.json (contract: website/SITE.md)
   3. Writes one page per entry: website/journal/<slug>/index.html (EN + MK embedded)
   4. Fills generated blocks (between marker comments) in the static pages:
        journal/index.html   <!-- journal:filter -->, <!-- journal:index -->
        index.html           <!-- journal:teaser -->, <!-- journal:song -->
        listen/index.html    <!-- journal:song -->, <!-- journal:audio -->
   5. Photo slots: /photos/<slot>.jpg|jpeg|png (slots: portrait, stage, hands, bitola) are copied to
      website/assets/photos/ and fill the <!-- photo:… --> blocks; a missing photo keeps the
      art-directed placeholder (decided here, so the browser never asks for a file that isn't there).
        about/index.html     <!-- photo:about-portrait -->, <!-- photo:map --> (word peeks: stage, hands, bitola)
        index.html           <!-- photo:home-portrait -->
        listen/index.html    <!-- photo:listen-stage -->
   6. Injects the shared shell (<!-- shell:head|top|foot -->) into every page.
   Rerun whenever a JSON file, a photo or tools/shell.mjs changes. */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, copyFileSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as shell from './shell.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, '..');
const BRAND = resolve(SITE, '..', 'brand');
const PHOTOS = resolve(SITE, '..', 'photos');
const argSrc = process.argv.indexOf('--src');
const SRC = argSrc > -1 ? resolve(process.argv[argSrc + 1]) : join(SITE, 'content', 'journal');
const SONG_OF_THE_WEEK = '07';

const KINDS = {
  essay: { en: 'essay', mk: 'есеј', cursor: 'read' },
  conversation: { en: 'conversation', mk: 'разговор', cursor: 'listen' },
  recording: { en: 'recording', mk: 'снимка', cursor: 'listen' },
  song: { en: 'song', mk: 'песна', cursor: 'listen' },
};
const FILTERS = [
  ['all', 'All', 'Сите'],
  ['essay', 'Essays', 'Есеи'],
  ['conversation', 'Conversations', 'Разговори'],
  ['recording', 'Recordings', 'Снимки'],
  ['song', 'Songs', 'Песни'],
];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const isAudio = (e) => e.kind !== 'essay';
const log = (...a) => console.log('  ', ...a);

/* ------------------------------------------------------------------ 1. brand assets */
function syncBrand() {
  const out = join(SITE, 'assets', 'brand');
  mkdirSync(out, { recursive: true });
  for (const f of readdirSync(join(BRAND, 'logo')).filter((f) => f.endsWith('.svg'))) copyFileSync(join(BRAND, 'logo', f), join(out, f));
  const tokens = readFileSync(join(BRAND, 'tokens.css'), 'utf8').replace(/@import\s+url\([^)]*\)[^;\n]*;\s*/g, '/* fonts are linked in each page <head> */\n');
  writeFileSync(join(out, 'tokens.css'), tokens);
  log('brand assets → assets/brand/');
}

/* ------------------------------------------------------------------ 2. content */
function load() {
  if (!existsSync(SRC)) { console.error('No journal content at', SRC); process.exit(1); }
  const files = readdirSync(SRC).filter((f) => /^\d\d\.json$/.test(f)).sort();
  const entries = files.map((f) => {
    const e = JSON.parse(readFileSync(join(SRC, f), 'utf8'));
    for (const k of ['no', 'slug', 'kind', 'length', 'en', 'mk']) if (!e[k]) throw new Error(`${f}: missing "${k}"`);
    if (!KINDS[e.kind]) throw new Error(`${f}: unknown kind "${e.kind}"`);
    for (const l of ['en', 'mk']) for (const k of ['title', 'excerpt', 'body']) if (!e[l][k]) throw new Error(`${f}: missing ${l}.${k}`);
    return e;
  });
  log(`${entries.length} entries from ${relative(process.cwd(), SRC) || SRC}`);
  return entries;
}

/* ------------------------------------------------------------------ shared fragments */
export function player({ seed, duration, title, titleMk, big }) {
  return `<div class="player${big ? ' player--big' : ''}" data-player data-seed="${esc(seed)}" data-duration="${esc(duration)}" data-title="${esc(title)}" data-title-mk="${esc(titleMk)}">
          <button type="button" class="player__btn" data-magnetic="0.22" data-cursor="play" aria-label="Play: ${esc(title)}"><span class="player__icon" aria-hidden="true"></span></button>
          <div class="player__wave" data-cursor="drag"><canvas aria-hidden="true"></canvas></div>
          <span class="player__time mono"><span class="now">00:00</span> / ${esc(duration)}</span>
          <p class="player__note mono" data-i18n="pl_note">Recording coming soon. Until then, a placeholder tone in 7/8.</p>
        </div>`;
}

function row(e, href) {
  const k = KINDS[e.kind];
  return `
        <li class="row" data-kind="${e.kind}"><a class="row__a" href="${href}" data-cursor="${k.cursor}">
          <span class="row__no mono">${e.no}</span>
          <span class="row__t" data-mk="${esc(e.mk.title)}">${e.en.title}</span>
          <span class="row__kind" data-mk="${k.mk}">${k.en}</span>
          <span class="row__dur mono" data-mk="${esc(e.length.mk)}">${e.length.en}</span>
          <span class="row__x" data-mk="${esc(strip(e.mk.excerpt))}">${strip(e.en.excerpt)}</span>
        </a></li>`;
}

function titleLines(html, withDot) {
  const parts = String(html).split(/<br\s*\/?>/i);
  const end = /[.?!…:]$/.test(strip(parts[parts.length - 1]));
  return parts.map((p, i) => `<span class="ln"><span>${p.trim()}${withDot && !end && i === parts.length - 1 ? '<span class="accent">.</span>' : ''}</span></span>`).join('');
}

/* ------------------------------------------------------------------ 3. article pages */
function article(e, prev, next) {
  const r = '../../';
  const k = KINDS[e.kind];
  const L = (l) => e[l];
  const head = (l) => `
      <header class="essay__head" data-lang-block="${l}" lang="${l}"${l === 'mk' ? ' hidden' : ''}>
        <p class="essay__meta mono"><span>${e.no}</span><span>${k[l]}</span><span>${esc(e.length[l])}</span><span>${l === 'mk' ? 'Јасна · Битола' : 'Jasna · Bitola'}</span>${L(l).note ? `<span>${L(l).note}</span>` : ''}</p>
        <h1 class="essay__t" data-reveal="lines">${titleLines(L(l).titleHtml || L(l).title, true)}</h1>
        ${L(l).lede ? `<p class="essay__lede" data-reveal="fade">${L(l).lede}</p>` : ''}
      </header>`;
  const body = (l) => `
      <div class="essay__body" data-lang-block="${l}" lang="${l}"${l === 'mk' ? ' hidden' : ''}>
${L(l).body.map((m) => `        <section class="mv"${m.n ? ` aria-label="${esc(m.n.replace(/\.$/, ''))}"` : ''}>
          ${m.n ? `<span class="mv__n" aria-hidden="true">${m.n}</span>` : ''}
${m.blocks.map((b) => (b.quote != null
    ? `          <blockquote class="pull" data-reveal="lines"><p><span class="ln"><span>${b.quote}</span></span></p></blockquote>`
    : `          <p>${b.p}</p>`)).join('\n')}
        </section>`).join('\n')}
        ${L(l).sign ? `<p class="sign">${L(l).sign}</p>` : ''}
        <span class="fermata" aria-hidden="true"></span>
        ${L(l).foot ? `<p class="essay__foot">${L(l).foot}</p>` : ''}
      </div>`;
  const pn = (x, dir) => x
    ? `<a class="pn__a pn__a--${dir}" href="${r}journal/${x.slug}/" data-cursor="${KINDS[x.kind].cursor}">
          <span class="mono"><span data-i18n="pn_${dir}">${dir === 'prev' ? 'previous' : 'next'}</span> · ${x.no}</span>
          <span class="pn__t" data-mk="${esc(x.mk.title)}">${x.en.title}</span>
        </a>`
    : `<a class="pn__a pn__a--${dir} pn__a--all" href="${r}journal/">
          <span class="mono" data-i18n="pn_all_k">journal</span>
          <span class="pn__t" data-i18n="pn_all">All seven entries</span>
        </a>`;
  const total = e.audio ? e.audio.duration : e.length.en;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title data-mk="${esc(strip(e.mk.title))} — Јаснота">${esc(strip(e.en.title))} — Jasnota</title>
  <meta name="description" content="${esc(strip(e.en.excerpt))}" data-mk-content="${esc(strip(e.mk.excerpt))}">
  <meta property="og:title" content="${esc(strip(e.en.title))} — Jasnota">
  <meta property="og:description" content="${esc(strip(e.en.excerpt))}">
  <!-- shell:head --><!-- /shell:head -->
  <link rel="stylesheet" href="${r}css/article.css">
</head>
<body data-page="journal" class="page-article">
  <!-- shell:top --><!-- /shell:top -->
  <!-- generated by tools/build-journal.mjs from content/journal/${e.no}.json — edit the JSON, not this file -->
  <main id="main" class="art art--${e.kind}">
    <article class="essay" aria-labelledby="t-${e.no}">
      <a class="essay__back mono" href="${r}journal/"><span aria-hidden="true">←</span> <span data-i18n="back_journal">journal</span></a>
${head('en').replace('<h1 class="essay__t"', `<h1 class="essay__t" id="t-${e.no}"`)}
${head('mk')}
${e.audio ? `      <div class="essay__player">
        ${player({ seed: +e.no, duration: e.audio.duration, title: strip(e.en.title), titleMk: strip(e.mk.title), big: true })}
      </div>` : ''}
${body('en')}
${body('mk')}
    </article>
    <nav class="pn" data-i18n-attr="aria-label:pn_label" aria-label="More entries">
      ${pn(prev, 'prev')}
      ${pn(next, 'next')}
    </nav>
  </main>
  <div class="progress" data-total="${esc(total)}" data-for=".essay" aria-hidden="true"><span class="progress__t mono">00:00</span><span class="progress__line"><i></i></span><span class="mono progress__end">${esc(total.includes(':') ? total : total.replace(/\D+/g, '').padStart(2, '0') + ':00')}</span></div>
  <!-- shell:foot --><!-- /shell:foot -->
</body>
</html>
`;
}

/* ------------------------------------------------------------------ 4. generated blocks */
function songBlock(e, r, big) {
  return `
        <div class="song">
          <h3 class="song__t"><a href="${r}journal/${e.slug}/" data-cursor="listen" data-mk="${esc(e.mk.titleHtml || e.mk.title)}">${e.en.titleHtml || e.en.title}</a></h3>
          <p class="song__meta mono"><span>${e.no}</span> · <span data-mk="${KINDS[e.kind].mk}">${KINDS[e.kind].en}</span> · <span>${e.audio ? e.audio.duration : e.length.en}</span></p>
          <p class="song__x" data-mk="${esc(e.mk.excerpt)}">${e.en.excerpt}</p>
          ${player({ seed: +e.no, duration: e.audio ? e.audio.duration : '04:00', title: strip(e.en.title), titleMk: strip(e.mk.title), big })}
        </div>
        `;
}

function audioList(entries, r) {
  return '\n' + entries.filter(isAudio).map((e) => `
        <li class="rec" data-kind="${e.kind}">
          <div class="rec__head">
            <h3 class="rec__t"><a href="${r}journal/${e.slug}/" data-cursor="read" data-mk="${esc(e.mk.title)}">${e.en.title}</a></h3>
            <p class="rec__meta mono"><span>${e.no}</span> · <span data-mk="${KINDS[e.kind].mk}">${KINDS[e.kind].en}</span> · <span>${e.audio ? e.audio.duration : e.length.en}</span></p>
            <p class="rec__x" data-mk="${esc(strip(e.mk.excerpt))}">${strip(e.en.excerpt)}</p>
          </div>
          ${player({ seed: +e.no, duration: e.audio ? e.audio.duration : e.length.en, title: strip(e.en.title), titleMk: strip(e.mk.title) })}
        </li>`).join('') + '\n        ';
}

function filterBlock(entries) {
  return '\n' + FILTERS.map(([k, en, mk]) => {
    const n = k === 'all' ? entries.length : entries.filter((e) => e.kind === k).length;
    if (!n) return '';
    return `        <button type="button" data-kind="${k}" aria-pressed="${k === 'all'}" data-magnetic="0.25"><span><span data-mk="${mk}">${en}</span><sup class="mono">${n}</sup></span></button>`;
  }).filter(Boolean).join('\n') + '\n        ';
}

/* ------------------------------------------------------------------ 5. photo slots */
// alt / caption for each slot, [en, mk]; the keys are also in js/i18n.js (mk)
const SLOTS = {
  portrait: { alt: ['Portrait of Jasna Dimitrovska', 'Портрет на Јасна Димитровска'], cap: ['Jasna Dimitrovska · portrait', 'Јасна Димитровска · портрет'] },
  stage: { alt: ['Jasna Dimitrovska singing with Orchestra DIVA', 'Јасна Димитровска пее со Оркестар DIVA'], cap: ['on stage · Orchestra DIVA', 'на сцена · Оркестар DIVA'] },
  hands: { alt: ['Hands, a microphone, sheet music', 'Раце, микрофон, ноти'], cap: ['hands, a microphone', 'раце, микрофон'] },
  bitola: { alt: ['Bitola', 'Битола'], cap: ['Bitola', 'Битола'] },
};
const PHOTO_MAX = 2000; // px, longest side, when the photo is large and macOS `sips` is available

function syncPhotos() {
  const out = join(SITE, 'assets', 'photos');
  const found = {};
  const src = existsSync(PHOTOS) ? readdirSync(PHOTOS) : [];
  // /photos/manifest.json lists every photo by slot, so the Instagram pages never probe for files that aren't there
  if (existsSync(PHOTOS)) {
    const all = {};
    for (const n of src) { const m = n.match(/^([a-z0-9-]+)\.(jpe?g|png)$/i); if (m) all[m[1].toLowerCase()] = n; }
    writeFileSync(join(PHOTOS, 'manifest.json'), JSON.stringify(all, null, 2) + '\n');
  }
  for (const slot of Object.keys(SLOTS)) {
    const f = src.find((n) => new RegExp(`^${slot}\\.(jpe?g|png)$`, 'i').test(n));
    if (!f) continue;
    const ext = f.split('.').pop().toLowerCase().replace('jpeg', 'jpg');
    mkdirSync(out, { recursive: true });
    const from = join(PHOTOS, f), to = join(out, `${slot}.${ext}`);
    let resized = false;
    if (statSync(from).size > 900 * 1024) {
      try { execFileSync('sips', ['-Z', String(PHOTO_MAX), ...(ext === 'jpg' ? ['-s', 'formatOptions', '82'] : []), from, '--out', to], { stdio: 'ignore' }); resized = true; } catch { /* no sips: copy as is */ }
    }
    if (!resized) copyFileSync(from, to);
    found[slot] = `${slot}.${ext}`;
  }
  // drop copies whose source photo is gone (so a removed photo falls back to its placeholder)
  if (existsSync(out)) {
    for (const f of readdirSync(out)) if (!Object.values(found).includes(f)) rmSync(join(out, f));
    if (!readdirSync(out).length) rmSync(out, { recursive: true });
  }
  log(Object.keys(found).length ? `photos → assets/photos/: ${Object.keys(found).join(', ')}` : 'photos: none yet, placeholders stay');
  return found;
}

const CROPS = '<span class="crop crop--tl"></span><span class="crop crop--tr"></span><span class="crop crop--bl"></span><span class="crop crop--br"></span>';

/* A placeholder frame, or the real photo in the same frame.
   o: { cls, img, no, cap, reveal, parallax, ph: [i18n key, aria-label], phCap: [i18n key, caption], key } */
function photoFrame(photos, slot, r, o, ind) {
  const reveal = o.reveal ? ' data-reveal="clip"' : '';
  const par = o.parallax ? ` data-parallax="${o.parallax}"` : '';
  const no = `<span class="${o.no[0]} mono" aria-hidden="true">${o.no[1]}</span>`;
  if (!photos[slot]) {
    return `
${ind}<div class="${o.cls}" role="img"${reveal} data-i18n-attr="aria-label:${o.ph[0]}" aria-label="${esc(o.ph[1])}">
${ind}  <div class="${o.img}"${par}></div>
${ind}  ${CROPS}
${ind}  ${no}
${ind}</div>
${ind}<figcaption class="${o.cap}" data-i18n="${o.phCap[0]}">${o.phCap[1]}</figcaption>
${ind.slice(2)}`;
  }
  const s = SLOTS[slot];
  return `
${ind}<div class="${o.cls} ${o.cls}--photo"${reveal}>
${ind}  <img class="${o.img}" src="${r}assets/photos/${photos[slot]}" alt="${esc(s.alt[0])}" data-i18n-attr="alt:ph_${slot}"${par} decoding="async">
${ind}  <span class="frame__grade" aria-hidden="true"></span>
${ind}  ${CROPS}
${ind}  ${no}
${ind}</div>
${ind}<figcaption class="${o.cap}" data-i18n="ph_${slot}_cap">${s.cap[0]}</figcaption>
${ind.slice(2)}`;
}

const PORTRAIT_PH = { ph: ['ab_img', 'Placeholder for a portrait of Jasna (photograph to come)'], phCap: ['ab_cap', 'portrait · 4:5 · photograph to come'] };

function photoBlocks(f, photos) {
  const b = {};
  if (f === 'about/index.html') {
    b['photo:about-portrait'] = photoFrame(photos, 'portrait', '../', { cls: 'frame', img: 'frame__img', no: ['frame__no', '01'], cap: 'frame__cap mono', reveal: true, parallax: '0.08', ...PORTRAIT_PH }, '        ');
    // word peeks read this map; only photos that exist are listed, so nothing is requested in vain
    const map = {};
    for (const slot of ['stage', 'hands', 'bitola']) if (photos[slot]) map[slot] = { src: `../assets/photos/${photos[slot]}`, en: SLOTS[slot].cap[0], mk: SLOTS[slot].cap[1] };
    b['photo:map'] = Object.keys(map).length ? `\n  <script type="application/json" id="jasnota-photos">${JSON.stringify(map).replace(/</g, '\\u003c')}</script>\n  ` : '';
  }
  if (f === 'index.html') {
    b['photo:home-portrait'] = photoFrame(photos, 'portrait', '', { cls: 'portrait__frame', img: 'portrait__img', no: ['portrait__frame-no', '05'], cap: 'portrait__cap mono', ...PORTRAIT_PH }, '        ');
  }
  if (f === 'listen/index.html') {
    b['photo:listen-stage'] = photoFrame(photos, 'stage', '../', { cls: 'frame', img: 'frame__img', no: ['frame__no', '02'], cap: 'frame__cap mono', reveal: true, parallax: '0.06',
      ph: ['ph_stage_ph', 'Placeholder for a photograph on stage with Orchestra DIVA (photograph to come)'], phCap: ['ph_stage_ph_cap', 'on stage · Orchestra DIVA · photograph to come'] }, '        ');
  }
  return b;
}

/* ------------------------------------------------------------------ 6. shell injection */
const PAGES = ['index.html', 'about/index.html', 'journal/index.html', 'listen/index.html', 'contact/index.html', '404.html'];

function finish(file, html) {
  const depth = relative(SITE, dirname(file)).split(/[\\/]/).filter(Boolean).length;
  const r = '../'.repeat(depth);
  const page = (html.match(/<body[^>]*data-page="([^"]+)"/) || [])[1] || '';
  for (const [name, content] of [['shell:head', shell.head(r, page === 'home')], ['shell:top', shell.top(r, page)], ['shell:foot', shell.foot(r, page === 'home')]]) {
    const next = shell.inject(html, name, content);
    if (next === null) throw new Error(`${relative(SITE, file)}: missing <!-- ${name} --> marker`);
    html = next;
  }
  return html;
}

function fill(file, blocks) {
  let html = readFileSync(file, 'utf8');
  for (const [name, content] of Object.entries(blocks)) {
    const next = shell.inject(html, name, content);
    if (next === null) throw new Error(`${relative(SITE, file)}: missing <!-- ${name} --> marker`);
    html = next;
  }
  writeFileSync(file, finish(file, html));
  log('updated', relative(SITE, file));
}

/* ------------------------------------------------------------------ run */
console.log('jasnota build');
syncBrand();
const photos = syncPhotos();
const entries = load();
const bySlug = new Set();
for (const e of entries) { if (bySlug.has(e.slug)) throw new Error('duplicate slug ' + e.slug); bySlug.add(e.slug); }

// remove generated entry folders that no longer have a JSON
const JDIR = join(SITE, 'journal');
mkdirSync(JDIR, { recursive: true });
for (const d of readdirSync(JDIR, { withFileTypes: true })) {
  if (d.isDirectory() && !bySlug.has(d.name) && existsSync(join(JDIR, d.name, 'index.html'))
      && readFileSync(join(JDIR, d.name, 'index.html'), 'utf8').includes('generated by tools/build-journal.mjs')) {
    rmSync(join(JDIR, d.name), { recursive: true });
    log('removed stale', 'journal/' + d.name);
  }
}

entries.forEach((e, i) => {
  const file = join(JDIR, e.slug, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, finish(file, article(e, entries[i - 1], entries[i + 1])));
  log('wrote', relative(SITE, file));
});

const song = entries.find((e) => e.no === SONG_OF_THE_WEEK) || entries.filter(isAudio).pop();
const has = (f) => existsSync(join(SITE, f));
for (const f of PAGES.filter(has)) {
  const blocks = photoBlocks(f, photos);
  if (f === 'journal/index.html') {
    blocks['journal:filter'] = filterBlock(entries);
    blocks['journal:index'] = entries.map((e) => row(e, `${e.slug}/`)).join('') + '\n      ';
  }
  if (f === 'index.html') {
    blocks['journal:teaser'] = entries.map((e) => row(e, `journal/${e.slug}/`)).join('') + '\n      ';
    if (song) blocks['journal:song'] = songBlock(song, '', false);
  }
  if (f === 'listen/index.html') {
    if (song) blocks['journal:song'] = songBlock(song, '../', true);
    blocks['journal:audio'] = audioList(entries, '../');
  }
  fill(join(SITE, f), blocks);
}
console.log('done.');
