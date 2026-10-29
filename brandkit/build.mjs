#!/usr/bin/env node
/* Јаснота / Jasnota — brand kit build.
 *
 *   node brandkit/build.mjs            everything: logos.js, logo pack + zip, PDF
 *   node brandkit/build.mjs logos      assets/logos.js + logo-pack/ (logos, evidence labels, templates) + Jasnota-Logo-Pack.zip
 *   node brandkit/build.mjs pdf        Jasnota-Brand-Guidelines.pdf from book/index.html
 *   node brandkit/build.mjs shot <url> <out.png> <w> <h> [scale]   screenshot helper for QA
 *
 * No npm dependencies. Needs: Google Chrome (headless, driven over the DevTools protocol with
 * Node's built-in WebSocket), rsvg-convert (PNG + PDF from SVG) and zip.
 * Source of truth for the artwork: /brand/logo/*.svg — this script reads the paths from there.
 */
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const KIT = dirname(fileURLToPath(import.meta.url));
const ROOT = join(KIT, '..');
const LOGO = join(ROOT, 'brand', 'logo');
const PACK = join(KIT, 'logo-pack');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RSVG = ['/Volumes/dev/Homebrew/bin/rsvg-convert', '/opt/homebrew/bin/rsvg-convert', '/usr/local/bin/rsvg-convert']
  .find((p) => existsSync(p)) || 'rsvg-convert';

/* ------------------------------------------------------------------ colours */
const C = { ink: '#0A0A0B', night: '#131315', graphite: '#2A2A2D', ash: '#8C8A85', bone: '#ECE8E1', paper: '#F6F4EF', cinnabar: '#B4452C', white: '#FFFFFF', black: '#000000' };

/* ------------------------------------------------------------------ artwork, read from /brand/logo */
const read = (f) => readFileSync(join(LOGO, f), 'utf8');
const firstPathD = (svg) => svg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const MARK_PATHS = [...read('mark.svg').matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
const FAV_PATHS = [...read('favicon.svg').matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
const WL = firstPathD(read('wordmark-latin.svg'));
const WC = firstPathD(read('wordmark-cyrillic.svg'));
const DOT = { cx: 126, cy: -554, r: 44 };            // the dot of the j / ј — a true circle
const SIGNS = {
  '02-sedum-osmini': read('02-sedum-osmini.svg'), '03-jasna-nota': read('03-jasna-nota.svg'),
  '04-rezonansa': read('04-rezonansa.svg'), '05-pauza': read('05-pauza.svg'), '06-ohrid': read('06-ohrid.svg'),
};

const markG = (c, sw = 5, paths = MARK_PATHS) =>
  `<g fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="butt">${paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
const wordG = (d, c, dot = c) => `<path fill="${c}" d="${d}"/><circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${dot}"/>`;

/* Each asset: tight viewBox (transparent files) + padded viewBox (files with a background, clear space included).
   Clear space: around the mark = r (bowl radius, 22 units); around word/lockups = x (x-height, ~400 units). */
const X = 400;
const pad = ([x, y, w, h], p) => [x - p, y - p, w + 2 * p, h + 2 * p];
const ASSETS = {
  'mark': {
    dir: '01-mark', tight: [0, 0, 100, 100], padded: [-23.33, -23.33, 146.67, 146.67],
    body: (c) => markG(c.fg),
  },
  'wordmark-latin': {
    dir: '02-wordmark', tight: [22.1, -598, 2862.5, 880.2], dot: true,
    body: (c) => wordG(WL, c.fg, c.dot),
  },
  'wordmark-cyrillic': {
    dir: '02-wordmark', tight: [22.1, -598, 2993.5, 880.2], dot: true,
    body: (c) => wordG(WC, c.fg, c.dot),
  },
  'lockup-horizontal-latin': {
    dir: '03-lockup-horizontal', tight: [0, -598, 3682.5, 880.2], dot: true,
    body: (c) => `<g transform="translate(-255 -658) scale(10.0017)">${markG(c.fg)}</g><g transform="translate(798 0)">${wordG(WL, c.fg, c.dot)}</g>`,
  },
  'lockup-horizontal-cyrillic': {
    dir: '03-lockup-horizontal', tight: [0, -598, 3813.5, 880.2], dot: true,
    body: (c) => `<g transform="translate(-255 -658) scale(10.0017)">${markG(c.fg)}</g><g transform="translate(798 0)">${wordG(WC, c.fg, c.dot)}</g>`,
  },
  'lockup-stacked-latin': {
    dir: '04-lockup-stacked', tight: [22.1, -2374.3, 2862.5, 2656.4], dot: true,
    body: (c) => `<g transform="translate(603.2 -2476.3) scale(17.0030)">${markG(c.fg)}</g>${wordG(WL, c.fg, c.dot)}`,
  },
  'lockup-stacked-cyrillic': {
    dir: '04-lockup-stacked', tight: [22.1, -2374.3, 2993.5, 2656.4], dot: true,
    body: (c) => `<g transform="translate(668.7 -2476.3) scale(17.0030)">${markG(c.fg)}</g>${wordG(WC, c.fg, c.dot)}`,
  },
};
for (const a of Object.values(ASSETS)) if (!a.padded) a.padded = pad(a.tight, X);

const WAYS = {
  'bone-on-ink': { fg: C.bone, bg: C.ink },
  'ink-on-bone': { fg: C.ink, bg: C.bone },
  'bone': { fg: C.bone },
  'ink': { fg: C.ink },
  'white': { fg: C.white },
  'black': { fg: C.black },
  'bone-on-ink-cinnabar-dot': { fg: C.bone, bg: C.ink, dot: C.cinnabar, dotOnly: true },
  'ink-on-bone-cinnabar-dot': { fg: C.ink, bg: C.bone, dot: C.cinnabar, dotOnly: true },
};

const f = (n) => +n.toFixed(2);
function svgDoc(vb, inner, title = 'Jasnota', bg) {
  const [x, y, w, h] = vb.map(f);
  const rect = bg ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${f(w)}" height="${f(h)}">\n  <title>${title}</title>\n  ${rect}${inner}\n</svg>\n`;
}

/* app icon: primary mark on an ink square, 56% of the height. Favicon cut (heavier stroke, wider pause) for 16–48 px. */
const appIcon = () => {
  const s = 1024 * 0.56 / 88;             // mark spans y 6..94
  const tx = 512 - 50 * s, ty = 512 - 50 * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">\n  <title>Jasnota</title>\n  <rect width="1024" height="1024" fill="${C.ink}"/><g transform="translate(${f(tx)} ${f(ty)}) scale(${f(s)})">${markG(C.bone)}</g>\n</svg>\n`;
};
const faviconSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">\n  <title>Jasnota</title>\n  <rect width="100" height="100" fill="${C.ink}"/>${markG(C.bone, 8, FAV_PATHS)}\n</svg>\n`;
const profileSvg = () => {
  const s = 1080 * 0.42 / 88;
  const t = 540 - 50 * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">\n  <title>Jasnota — profile picture</title>\n  <rect width="1080" height="1080" fill="${C.ink}"/><g transform="translate(${f(t)} ${f(t)}) scale(${f(s)})">${markG(C.bone)}</g>\n</svg>\n`;
};

/* ------------------------------------------------------------------ evidence meter (geometry only) */
/* three bars at 46 / 73 / 100% of 0.8 em; bar 0.26 em, gap 0.2 em (em = 100 units). n filled; 0 = outlined (open question) */
const meterSvg = (n, col) => {
  const bars = [[0, 36.8], [46, 58.4], [92, 80]].map(([x, h], i) => n === 0
    ? `<rect x="${x + 3.75}" y="${f(80 - h + 3.75)}" width="18.5" height="${f(h - 7.5)}" fill="none" stroke="${col}" stroke-width="7.5"/>`
    : `<rect x="${x}" y="${f(80 - h)}" width="26" height="${h}" fill="${col}"${i < n ? '' : ' fill-opacity=".24"'}/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 80" width="118" height="80">\n  <title>Jasnota evidence meter ${n}/3</title>\n  ${bars}\n</svg>\n`;
};

/* ------------------------------------------------------------------ template frames: SVG with a guides layer and live text */
const FONT = { d: "Cormorant, 'Times New Roman', serif", t: 'Onest, system-ui, sans-serif', m: "'JetBrains Mono', ui-monospace, monospace" };
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const tx = (x, y, t, { ff = 't', s = 42, w = 300, c = C.bone, a = 'start', i = false } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" font-family="${FONT[ff]}" font-size="${s}" font-weight="${w}"${i ? ' font-style="italic"' : ''} fill="${c}" text-anchor="${a}">${t.includes('<tspan') ? t : esc(t)}</text>`;
const mkAt = (x, y, size, c) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(size / 100)})">${markG(c)}</g>`;
const wcAt = (x, bottom, width, c) => { const k = width / 2993.5; return `<g transform="translate(${f(x - 22.1 * k)} ${f(bottom - 282.2 * k)}) scale(${k.toFixed(5)})">${wordG(WC, c)}</g>`; };
const hcAt = (x, top, width, c) => { const k = width / 3813.5; return `<g transform="translate(${f(x)} ${f(top + 598 * k)}) scale(${k.toFixed(5)})"><g transform="translate(-255 -658) scale(10.0017)">${markG(c)}</g><g transform="translate(798 0)">${wordG(WC, c)}</g></g>`; };
const it = (t) => `<tspan font-style="italic">${esc(t)}</tspan>`;
function frameDoc(w, h, bg, title, inner, guides) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n  <title>${title}</title>\n  <rect id="background" width="${w}" height="${h}" fill="${bg}"/>\n  <g id="content">${inner}</g>\n  <g id="guides" fill="none" stroke="${C.cinnabar}" stroke-width="2" stroke-dasharray="12 10" opacity=".7">${guides}</g>\n</svg>\n`;
}
function frames() {
  const W = 1080, H = 1350, m = 86;
  const g45 = `<rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}"/><path d="M33.75 0 V${H} M1046.25 0 V${H}"/>`;
  const slide = (bg, fg, dim, meta, n, of, inner) => {
    let ticks = ''; for (let i = 0; i < of; i++) ticks += `<rect x="${f(994 - 66 - (of - i) * 35)}" y="1263" width="26" height="4" fill="${fg}"${i === n - 1 ? '' : ' fill-opacity=".3"'}/>`;
    return mkAt(m, 82, 67, fg) + tx(994, 118, meta, { ff: 'm', s: 27, c: dim, a: 'end' }) + inner + wcAt(m, 1272, 151, fg) + ticks + tx(994, 1272, `${n}/${of}`, { ff: 'm', s: 27, c: dim, a: 'end' });
  };
  const ink = (meta, n, of, inner, bg = C.ink) => slide(bg, C.bone, C.ash, meta, n, of, inner);
  const paper = (meta, n, of, inner) => slide(C.paper, C.ink, '#66645F', meta, n, of, inner);
  const out = {};
  out['jasnota-carousel-frame-1-cover-1080x1350'] = frameDoc(W, H, C.ink, 'Jasnota carousel · cover', ink('II · текст', 1, 6,
    tx(m, 430, 'Наслов во форма', { ff: 'd', s: 121 }) + tx(m, 544, `на ${it('прашање?')}`, { ff: 'd', s: 121 }) +
    tx(m, 820, 'Поднаслов во една или две реченици:', { s: 42, c: '#CFCBC4' }) + tx(m, 879, 'што покажуваат истражувањата.', { s: 42, c: '#CFCBC4' })), g45);
  out['jasnota-carousel-frame-2-content-1080x1350'] = frameDoc(W, H, C.ink, 'Jasnota carousel · content', ink('II · текст', 2, 6,
    tx(m, 290, 'I.', { ff: 'd', s: 56, c: C.ash }) + tx(m, 400, `Еден ${it('поднаслов')}`, { ff: 'd', s: 86 }) +
    tx(m, 560, 'Една идеја по слајд. Два кратки пасуса,', { s: 42, c: '#D9D5CE' }) + tx(m, 621, 'најмногу пет реда секој, со цитат', { s: 42, c: '#D9D5CE' }) +
    tx(m, 682, 'во текстот', { s: 42, c: '#D9D5CE' }) + tx(m + 205, 682, '(Автор, година).', { ff: 'm', s: 31, c: C.ash })), g45);
  const meter = (x, y, k, n, col) => `<g transform="translate(${x} ${y}) scale(${k})">${meterSvg(n, col).replace(/^[\s\S]*?<\/title>\s*/, '').replace(/<\/svg>\s*$/, '')}</g>`;
  out['jasnota-carousel-frame-3-evidence-1080x1350'] = frameDoc(W, H, C.night, 'Jasnota carousel · evidence', ink('II · текст', 3, 6,
    meter(m, 262, .39, 2, C.bone) + tx(m + 70, 292, 'умерени докази', { ff: 'm', s: 39 }) +
    tx(m, 430, 'Тврдењето, во', { ff: 'd', s: 86 }) + tx(m, 515, `една ${it('реченица.')}`, { ff: 'd', s: 86 }) +
    tx(m, 700, 'Зошто оваа ознака: колку студии, каков', { s: 42, c: '#D9D5CE' }) + tx(m, 761, 'дизајн, кои ограничувања.', { s: 42, c: '#D9D5CE' }) +
    `<path d="M${m} 1060 H${W - m}" stroke="${C.graphite}" stroke-width="2"/>` +
    [[3, 'силни докази', m, 1110], [2, 'умерени докази', 540, 1110], [1, 'рани/ограничени докази', m, 1160], [0, 'отворено прашање', 540, 1160]].map(([n, t, x, y]) =>
      meter(x, y - 22, .29, n, n === 2 ? C.bone : '#5D5B57') + tx(x + 52, y, t, { ff: 'm', s: 23, c: n === 2 ? C.bone : '#5D5B57' })).join(''), C.night), g45);
  const block = (y, sign, head, lines) => `<g transform="translate(${m} ${y}) scale(.65)" fill="none" stroke="${C.ink}" stroke-width="5">${SIGNS[sign].replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/currentColor/g, C.ink)}</g>` +
    tx(m + 92, y + 52, head, { ff: 'd', s: 69, c: C.ink }) + `<path d="M${m} ${y + 82} H${W - m}" stroke="${C.ink}" stroke-width="2"/>` +
    lines.map((l, i) => tx(m, y + 140 + i * 92, l, { s: 38, c: '#2B2A28' }) + `<path d="M${m} ${y + 170 + i * 92} H${W - m}" stroke="#D6D2CB" stroke-width="1.5"/>`).join('');
  out['jasnota-carousel-frame-4-known-unknown-1080x1350'] = frameDoc(W, H, C.paper, 'Jasnota carousel · known and unknown', paper('II · текст', 5, 6,
    block(232, '03-jasna-nota', 'Што знаеме', ['Првиот наод, во еден ред.', 'Вториот наод, во еден ред.', 'Третиот наод, во еден ред.']) +
    block(712, '05-pauza', 'Што сè уште не знаеме', ['Првото отворено прашање.', 'Второто отворено прашање.', 'Третото отворено прашање.'])), g45);
  out['jasnota-carousel-frame-5-sources-1080x1350'] = frameDoc(W, H, C.paper, 'Jasnota carousel · sources', paper('II · текст', 6, 6,
    tx(m, 300, 'Извори', { ff: 'd', s: 86, c: C.ink }) +
    [0, 1, 2].map((i) => tx(m, 400 + i * 190, 'Презиме, И. (година). Наслов на трудот.', { s: 31, c: '#2B2A28' }) + tx(m + 45, 444 + i * 190, `${it('Списание, том')}(број), страници.`, { s: 31, c: '#2B2A28' }) + tx(m + 45, 488 + i * 190, 'doi.org/10.xxxx/xxxxx', { ff: 'm', s: 25, c: '#66645F' })).join('') +
    `<path d="M${m} 1000 H${W - 238}" stroke="#D6D2CB" stroke-width="1.5"/>` +
    tx(m, 1050, 'Ова не е дијагноза ниту терапија. Белешката', { s: 29, c: '#4A4945' }) + tx(m, 1092, 'и упатувањето, приспособени на темата.', { s: 29, c: '#4A4945' })), g45);

  /* story 1080 × 1920: keep text out of the top and bottom 14% (Instagram's own interface) */
  const SH = 1920, sm = 97;
  const gSt = `<rect x="${sm}" y="0" width="${W - 2 * sm}" height="${SH}"/><path d="M0 269 H${W} M0 1651 H${W}"/>`;
  out['jasnota-story-frame-1080x1920'] = frameDoc(W, SH, C.ink, 'Jasnota story', mkAt(sm, 324, 76, C.bone) +
    tx(sm, 485, 'Прашање · анкета · извор на неделата', { ff: 'm', s: 30, c: C.ash }) +
    tx(sm, 640, 'Едно прашање,', { ff: 'd', s: 119 }) + tx(sm, 753, `во ${it('три реда.')}`, { ff: 'd', s: 119 }) +
    `<rect x="130" y="1037" width="820" height="300" rx="48" fill="${C.paper}" fill-opacity=".14" stroke="${C.ash}" stroke-width="2" stroke-dasharray="10 8"/>` +
    tx(540, 1200, 'место за стикер: прашање, анкета', { ff: 'm', s: 30, c: C.ash, a: 'middle' }) +
    wcAt(sm, SH - 302, 173, C.bone) + tx(W - sm, SH - 302, '@jasnota', { ff: 'm', s: 30, c: C.ash, a: 'end' }), gSt);

  /* newsletter header 1200 × 400 */
  const NW = 1200, NH = 400;
  out['jasnota-newsletter-header-1200x400'] = frameDoc(NW, NH, C.ink, 'Jasnota newsletter header', hcAt(66, 65, 180, C.bone) +
    tx(NW - 66, 86, 'Билтен · бр. 01', { ff: 'm', s: 16, c: C.ash, a: 'end' }) + tx(NW - 66, 110, 'ноември 2026', { ff: 'm', s: 16, c: C.ash, a: 'end' }) +
    [0, 1, 2, 3, 4].map((i) => `<path d="M0 ${f(174 + i * 19.2)} H${NW}" stroke="${C.graphite}" stroke-width="1.2"/>`).join('') +
    `<circle cx="855.6" cy="212.4" r="8.4" fill="${C.bone}"/>` +
    tx(66, 335, `Психологијата зад ${it('музиката')}`, { ff: 'd', s: 55 }) + tx(NW - 66, 333, 'jasnota.mk · @jasnota', { ff: 'm', s: 16, c: C.ash, a: 'end' }),
    `<rect x="66" y="65" width="${NW - 132}" height="${NH - 130}"/>`);
  return out;
}

/* ------------------------------------------------------------------ helpers */
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
const png = (svgFile, out, { w, h } = {}) => sh(RSVG, [...(w ? ['-w', String(w)] : []), ...(h ? ['-h', String(h)] : []), '-o', out, svgFile]);
const pdf = (svgFile, out) => sh(RSVG, ['-f', 'pdf', '-o', out, svgFile]);
const ensure = (d) => { mkdirSync(d, { recursive: true }); return d; };
const kb = (p) => (statSync(p).size / 1024).toFixed(0) + ' KB';

/* ICO with embedded PNGs (Vista+ format) */
function ico(pngFiles, out) {
  const bufs = pngFiles.map(([size, p]) => [size, readFileSync(p)]);
  const head = Buffer.alloc(6 + 16 * bufs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(bufs.length, 4);
  let off = head.length;
  bufs.forEach(([size, b], i) => {
    const o = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, o); head.writeUInt8(size >= 256 ? 0 : size, o + 1);
    head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3);
    head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
    head.writeUInt32LE(b.length, o + 8); head.writeUInt32LE(off, o + 12);
    off += b.length;
  });
  writeFileSync(out, Buffer.concat([head, ...bufs.map((x) => x[1])]));
}

/* ------------------------------------------------------------------ assets/logos.js — shared defs for the book and the showcase */
function buildLogosJs() {
  const signs = Object.entries(SIGNS).map(([k, svg]) => {
    const n = k.slice(0, 2);
    const attrs = svg.match(/<svg([^>]*)>/)[1];
    const sj = /stroke-linejoin="miter"/.test(attrs) ? ' stroke-linejoin="miter"' : ' stroke-linecap="butt"';
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/, '').replace(/<!--[\s\S]*?-->/g, '').trim();
    return `<g id="k-s${n}" fill="none" stroke="currentColor" stroke-width="5"${sj}>${inner.replace(/\s*\n\s*/g, '')}</g>`;
  }).join('');
  const defs =
    `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><defs>` +
    `<g id="k-m" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="butt">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<g id="k-mf" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="butt">${FAV_PATHS.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    signs +
    `<g id="k-wl"><path fill="currentColor" d="${WL}"/><circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" style="fill:var(--dot,currentColor)"/></g>` +
    `<g id="k-wc"><path fill="currentColor" d="${WC}"/><circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" style="fill:var(--dot,currentColor)"/></g>` +
    `<g id="k-hl"><g transform="translate(-255 -658) scale(10.0017)"><use href="#k-m"/></g><g transform="translate(798 0)"><use href="#k-wl"/></g></g>` +
    `<g id="k-hc"><g transform="translate(-255 -658) scale(10.0017)"><use href="#k-m"/></g><g transform="translate(798 0)"><use href="#k-wc"/></g></g>` +
    `<g id="k-vl"><g transform="translate(603.2 -2476.3) scale(17.0030)"><use href="#k-m"/></g><use href="#k-wl"/></g>` +
    `<g id="k-vc"><g transform="translate(668.7 -2476.3) scale(17.0030)"><use href="#k-m"/></g><use href="#k-wc"/></g>` +
    `</defs></svg>`;
  const vb = {
    m: '0 0 100 100', mf: '0 0 100 100', s02: '0 0 100 100', s03: '0 0 100 100', s04: '0 0 100 100', s05: '0 0 100 100', s06: '0 0 100 100',
    wl: ASSETS['wordmark-latin'].tight.join(' '), wc: ASSETS['wordmark-cyrillic'].tight.join(' '),
    hl: ASSETS['lockup-horizontal-latin'].tight.join(' '), hc: ASSETS['lockup-horizontal-cyrillic'].tight.join(' '),
    vl: ASSETS['lockup-stacked-latin'].tight.join(' '), vc: ASSETS['lockup-stacked-cyrillic'].tight.join(' '),
  };
  const js = `/* GENERATED by brandkit/build.mjs from /brand/logo/*.svg — do not edit by hand. */\nwindow.JASNOTA_LOGOS = ${JSON.stringify({ defs, vb })};\n`;
  writeFileSync(join(KIT, 'assets', 'logos.js'), js);
  console.log('assets/logos.js', kb(join(KIT, 'assets', 'logos.js')));
}

/* ------------------------------------------------------------------ logo pack */
async function buildPack() {
  rmSync(PACK, { recursive: true, force: true });
  ensure(PACK);
  let count = { svg: 0, png: 0, pdf: 0 };

  for (const [name, a] of Object.entries(ASSETS)) {
    const isMark = name === 'mark';
    for (const [way, c] of Object.entries(WAYS)) {
      if (c.dotOnly && !a.dot) continue;
      const vb = c.bg ? a.padded : a.tight;
      const file = `jasnota-${name}-${way}`;
      const col = { fg: c.fg, dot: c.dot || c.fg };
      const svg = svgDoc(vb, a.body(col), 'Jasnota', c.bg);
      const sDir = ensure(join(PACK, a.dir, 'svg')), pDir = ensure(join(PACK, a.dir, 'png')), fDir = ensure(join(PACK, a.dir, 'pdf'));
      const sp = join(sDir, file + '.svg');
      writeFileSync(sp, svg); count.svg++;
      pdf(sp, join(fDir, file + '.pdf')); count.pdf++;
      const sizes = [512, 1024, 2048];
      for (const s of sizes) {
        const landscape = vb[2] >= vb[3];
        png(sp, join(pDir, `${file}@${s}.png`), landscape ? { w: s } : { h: s }); count.png++;
      }
    }
  }

  /* secondary signs: bone + ink, transparent */
  const sgDir = ensure(join(PACK, '07-secondary-signs', 'svg'));
  for (const [k, svg] of Object.entries(SIGNS)) {
    for (const [way, col] of [['bone', C.bone], ['ink', C.ink]]) {
      const out = svg.replace(/currentColor/g, col).replace(/<!--[\s\S]*?-->\s*/g, '').replace('<svg ', '<svg width="100" height="100" ');
      writeFileSync(join(sgDir, `jasnota-sign-${k}-${way}.svg`), out); count.svg++;
    }
  }

  /* app icon + favicons */
  const ai = ensure(join(PACK, '05-app-icon-favicon'));
  writeFileSync(join(ai, 'jasnota-app-icon.svg'), appIcon());
  writeFileSync(join(ai, 'favicon.svg'), faviconSvg());
  count.svg += 2;
  for (const s of [1024, 512, 192, 180]) { png(join(ai, 'jasnota-app-icon.svg'), join(ai, s === 180 ? 'apple-touch-icon-180.png' : `jasnota-app-icon-${s}.png`), { w: s }); count.png++; }
  for (const s of [48, 32, 16]) { png(join(ai, 'favicon.svg'), join(ai, `favicon-${s}.png`), { w: s }); count.png++; }
  ico([[16, join(ai, 'favicon-16.png')], [32, join(ai, 'favicon-32.png')], [48, join(ai, 'favicon-48.png')]], join(ai, 'favicon.ico'));

  /* social */
  const so = ensure(join(PACK, '06-social'));
  writeFileSync(join(so, 'jasnota-instagram-profile-1080.svg'), profileSvg()); count.svg++;
  png(join(so, 'jasnota-instagram-profile-1080.svg'), join(so, 'jasnota-instagram-profile-1080.png'), { w: 1080 }); count.png++;
  await shot(pathToFileURL(join(KIT, 'assets', 'share.html')).href, join(so, 'jasnota-share-1200x630.png'), 1200, 630, 1);
  await shot(pathToFileURL(join(KIT, 'assets', 'share.html')).href, join(so, 'jasnota-share-1200x630@2x.png'), 1200, 630, 2);
  count.png += 2;

  /* evidence labels: meters as SVG (geometry only), labels as PNG (rendered with JetBrains Mono, transparent) */
  const evDir = ensure(join(PACK, '08-evidence-labels')); const evSvg = ensure(join(evDir, 'svg')); const evPng = ensure(join(evDir, 'png'));
  const EVN = { 3: 'strong', 2: 'moderate', 1: 'early-limited', 0: 'open-question' };
  for (const n of [3, 2, 1, 0]) for (const [way, col] of [['bone', C.bone], ['ink', C.ink]]) {
    writeFileSync(join(evSvg, `jasnota-evidence-meter-${n}-${EVN[n]}-${way}.svg`), meterSvg(n, col)); count.svg++;
  }

  /* template frames (SVG, guides + live text) */
  const tDir = ensure(join(PACK, '09-templates')); const tSvg = ensure(join(tDir, 'svg')); const tPng = ensure(join(tDir, 'png'));
  for (const [name, svg] of Object.entries(frames())) { writeFileSync(join(tSvg, name + '.svg'), svg); count.svg++; }

  /* rendered examples and labels, one Chrome session */
  const FR = pathToFileURL(join(KIT, 'assets', 'frame.html')).href;
  await withChrome(async (chrome) => {
    for (const n of [3, 2, 1, 0]) for (const lang of ['mk', 'en']) for (const way of ['bone', 'ink']) {
      await shot(`${FR}#ev:${n}:${lang}:${way}`, join(evPng, `jasnota-evidence-${n}-${EVN[n]}-${lang}-${way}@2x.png`), 1200, 200, 2, chrome, { transparent: true, el: true }); count.png++;
    }
    const T = [
      ['ig-cover', 'carousel-1-cover'], ['ig-content', 'carousel-2-content'], ['ig-evidence', 'carousel-3-evidence'], ['ig-known', 'carousel-4-known-unknown'], ['ig-sources', 'carousel-5-sources'],
      ['ig-f-text', 'cover-format-text'], ['ig-f-study', 'cover-format-study'], ['ig-f-concept', 'cover-format-concept'], ['ig-f-myth', 'cover-format-myth'], ['ig-f-list', 'cover-format-reading-list'],
    ];
    for (const [k, f] of T) { await shot(`${FR}#${k}`, join(tPng, `jasnota-${f}-1080x1350.png`), 1080, 1350, 1, chrome); count.png++; }
    for (const [k, f] of [['st-question', 'story-question-box'], ['st-poll', 'story-poll'], ['st-source', 'story-source-of-the-week']]) { await shot(`${FR}#${k}`, join(tPng, `jasnota-${f}-1080x1920.png`), 1080, 1920, 1, chrome); count.png++; }
    await shot(`${FR}#citation-card`, join(tPng, 'jasnota-citation-card-1080x1080.png'), 1080, 1080, 1, chrome); count.png++;
    for (const [k, f] of [['m', 'about'], ['I', 'pillar-1'], ['II', 'pillar-2'], ['III', 'pillar-3'], ['s04', 'questions'], ['s03', 'concepts']]) {
      await shot(`${FR}#hl:${k}`, join(tPng, `jasnota-highlight-${f}-1080x1920.png`), 1080, 1920, 1, chrome); count.png++;
    }
    await shot(`${FR}#newsletter`, join(so, 'jasnota-newsletter-header-1200x400.png'), 1200, 400, 1, chrome);
    await shot(`${FR}#newsletter`, join(so, 'jasnota-newsletter-header-1200x400@2x.png'), 1200, 400, 2, chrome); count.png += 2;
  });

  writeFileSync(join(PACK, 'README.md'), readme());
  console.log('logo pack:', count);

  const zip = join(KIT, 'Jasnota-Logo-Pack.zip');
  rmSync(zip, { force: true });
  execFileSync('zip', ['-r', '-q', '-X', zip, 'logo-pack', '-x', '*.DS_Store'], { cwd: KIT });
  console.log('Jasnota-Logo-Pack.zip', kb(zip));
}

function readme() {
  return `# Јаснота / Jasnota — logo pack (v2 · 2026)

Jasnota is an educational platform on the psychology of music: **„Психологијата зад музиката“ / The psychology behind music.**
Primary mark: **01 Камертон / Ψ**, a tuning fork that reads as psi; the inner stroke stops before the bowl: the pause.
**Primary wordmark: Cyrillic \`јаснота\`** (Macedonian is the base language). Latin \`jasnota\` is for English and international
pieces, and for addresses (jasnota.mk, @jasnota). Full rules: \`Jasnota-Brand-Guidelines.pdf\` (chapters 02 “Editorial system”,
04 “The logo”, 08 “Templates”, 10 “Files”).

## Folders

| Folder | What | Use it for |
|---|---|---|
| \`01-mark/\` | The tuning-fork mark alone | Avatars, small spaces, embossing, sign-offs |
| \`02-wordmark/\` | \`јаснота\` (Cyrillic, primary) and \`jasnota\` (Latin) | Headers, credits, slide and carousel footers |
| \`03-lockup-horizontal/\` | Mark + wordmark side by side | **Default logo: \`…-cyrillic-…\`.** Website, newsletter, slides, partnership sheet, email |
| \`04-lockup-stacked/\` | Mark above the wordmark | Square and tall formats, covers, notebook |
| \`05-app-icon-favicon/\` | App icon, favicons, \`favicon.ico\` | Browser tab, home screen |
| \`06-social/\` | Instagram profile picture (the mark, 1080 × 1080), share image (1200 × 630), newsletter header (1200 × 400) | @jasnota profile picture, og:image, email header |
| \`07-secondary-signs/\` | Signs 02–06 | Only in their editorial jobs (below). Never as a logo |
| \`08-evidence-labels/\` | The evidence meter (SVG) and the four labels in Macedonian and English (PNG @2x, transparent) | Articles, carousels, slides, citation cards |
| \`09-templates/\` | SVG frames with a guides layer and live text; PNG examples | Instagram carousel (1080 × 1350), story (1080 × 1920), highlight covers, citation card, newsletter |

Logo folders have \`svg/\` (master vectors), \`pdf/\` (print and Office) and \`png/\` (long edge 512 / 1024 / 2048 px).

## Secondary signs: editorial jobs

| Sign | Job |
|---|---|
| 02 Седум осмини (7/8) | Series and progress: carousel ticks, “part 2 of 3”, the weekly calendar |
| 03 Јасна нота | „Што знаеме“ (what we know), the end-of-text dot, the key finding |
| 04 Резонанса | Connections: the mapping, partnerships, guest pieces, readers’ questions |
| 05 Пауза (fermata) | „Што сè уште не знаеме“ (what we don’t know yet); the end mark after the sources |
| 06 Охрид | Roots and local: Macedonian research and data, the musical tradition |

## Evidence labels

| Meter | Macedonian | English |
|---|---|---|
| 3 bars | силни докази | strong evidence |
| 2 bars | умерени докази | moderate evidence |
| 1 bar | рани/ограничени докази | early/limited evidence |
| outlined | отворено прашање | open question |

Always JetBrains Mono, lowercase, in the text colour (bone or ink). Never cinnabar, never traffic-light colours.
A label belongs to one claim, not to a topic; in doubt, the more cautious one.

## Template frames

\`09-templates/svg/\` frames are built on the brand grid: 8% margins on slides, 9% on stories, Instagram’s 3:4 profile crop and
the story safe area (top and bottom 14%) drawn in the \`guides\` layer — hide or delete it before export. Text is live, set in
Cormorant, Onest and JetBrains Mono (free on Google Fonts; install them first). The PNGs in \`09-templates/png/\` are finished
examples from the first weeks of the calendar, rendered from the brand kit.

## File names

\`jasnota-<asset>-<colourway>[@size].<ext>\`

| Colourway | Looks like | When |
|---|---|---|
| \`bone-on-ink\` | Bone \`#ECE8E1\` on an ink \`#0A0A0B\` field, clear space included | **Default.** The brand is black |
| \`ink-on-bone\` | Ink on a bone field, clear space included | Light contexts, print on light stock |
| \`bone\` | Bone, transparent background | On ink, night or dark images |
| \`ink\` | Ink, transparent background | On bone, paper, light stock |
| \`white\` / \`black\` | Pure \`#FFFFFF\` / \`#000000\`, transparent | Third-party systems, one-colour print, foil, engraving |
| \`…-cinnabar-dot\` | The dot of the ј / j in cinnabar \`#B4452C\` | Wordmarks and lockups only, at most once per composition |

## Minimum sizes

| | Screen | Print |
|---|---|---|
| Mark | 24 px | 8 mm |
| Mark, small cut (\`favicon.svg\`) | 16 px | — |
| Horizontal lockup | 120 px wide | 30 mm wide |
| Stacked lockup | 80 px wide | 20 mm wide |
| Wordmark alone | 80 px wide | 18 mm wide |

## Favicon snippet

\`\`\`html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
\`\`\`

## Don't

Don't stretch, rotate, outline, add shadows/glow/gradients, retype the word in another font or in capitals, close the pause in
the mark, colour the whole mark cinnabar, or stack the Cyrillic and Latin words as one logo.

Colours: \`ink #0A0A0B · night #131315 · graphite #2A2A2D · ash #8C8A85 · ash-light #66645F · bone #ECE8E1 · paper #F6F4EF · cinnabar #B4452C\`.
CMYK values in the guidelines are approximate; proof with the printer.

Generated by \`brandkit/build.mjs\` from \`/brand/logo/*.svg\` and \`brandkit/assets/\`. Re-run \`node brandkit/build.mjs logos\` after any change.
`;
}

/* ------------------------------------------------------------------ Chrome over the DevTools protocol */
async function withChrome(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'jasnota-chrome-'));
  const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run',
    '--no-default-browser-check', '--hide-scrollbars', '--font-render-hinting=none', '--allow-file-access-from-files', 'about:blank'],
    { stdio: ['ignore', 'ignore', 'pipe'] });
  const wsUrl = await new Promise((res, rej) => {
    let buf = '';
    const t = setTimeout(() => rej(new Error('Chrome did not start')), 60000);
    proc.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } });
  });
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0; const pending = new Map(); const waiters = [];
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); }
    else if (msg.method) waiters.slice().forEach((w) => w(msg));
  });
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
  const once = (method, sessionId) => new Promise((res) => { const w = (m) => { if (m.method === method && m.sessionId === sessionId) { waiters.splice(waiters.indexOf(w), 1); res(m.params); } }; waiters.push(w); });
  async function open(url, { w = 1280, h = 800, scale = 1, media, mobile = false } = {}) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const s = (m, p) => send(m, p, sessionId);
    await s('Page.enable'); await s('Runtime.enable');
    await s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: scale, mobile });
    if (media) await s('Emulation.setEmulatedMedia', { media });
    const loaded = once('Page.loadEventFired', sessionId);
    await s('Page.navigate', { url });
    await loaded;
    const ev = async (expr) => (await s('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;
    await ev(`(async()=>{await document.fonts.ready; for(let i=0;i<100&&document.documentElement.dataset.kit!=='ready'&&document.querySelector('script[src*="kit.js"]');i++) await new Promise(r=>setTimeout(r,50)); await document.fonts.ready; await new Promise(r=>setTimeout(r,400)); return true})()`);
    return { s, ev, close: () => send('Target.closeTarget', { targetId }) };
  }
  try { return await fn({ send, open }); }
  finally {
    const exited = new Promise((r) => proc.once('exit', r));
    try { await Promise.race([send('Browser.close'), new Promise((r) => setTimeout(r, 3000))]); } catch {}
    await Promise.race([exited, new Promise((r) => setTimeout(r, 5000))]);
    try { ws.close(); } catch {}
    if (proc.exitCode === null) proc.kill('SIGKILL');
    rmSync(dir, { recursive: true, force: true });
  }
}

async function shot(url, out, w, h, scale = 1, chrome, { transparent = false, el = false } = {}) {
  const run = async ({ open }) => {
    const full = !h;
    const p = await open(url, { w, h: h || 900, scale, mobile: w < 600 });
    if (transparent) await p.s('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    const H = full ? await p.ev('document.documentElement.scrollHeight') : h;
    let clip = { x: 0, y: 0, width: w, height: H, scale: 1 };
    if (el) {
      const r = await p.ev(`(()=>{const r=document.querySelector('#f').firstElementChild.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()`);
      clip = { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height), scale: 1 };
    }
    const { data } = await p.s('Page.captureScreenshot', { format: full ? 'jpeg' : 'png', quality: 70, clip, captureBeyondViewport: full });
    writeFileSync(out, Buffer.from(data, 'base64'));
    await p.close();
  };
  return chrome ? run(chrome) : withChrome(run);
}

async function buildPdf() {
  const out = join(KIT, 'Jasnota-Brand-Guidelines.pdf');
  const url = pathToFileURL(join(KIT, 'book', 'index.html')).href;
  await withChrome(async ({ open }) => {
    const p = await open(url, { w: 1123, h: 794, media: 'print' });
    const fonts = await p.ev(`(async()=>{await document.fonts.ready; return ['300 20px Cormorant','italic 300 20px Cormorant','300 20px Onest','400 20px Onest','300 12px "JetBrains Mono"'].map(f=>f+': '+document.fonts.check(f)).join(' | ')})()`);
    console.log('fonts', fonts);
    const pages = await p.ev(`document.querySelectorAll('.page').length`);
    console.log('pages in HTML', pages);
    const { data } = await p.s('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
    writeFileSync(out, Buffer.from(data, 'base64'));
    await p.close();
  });
  console.log('Jasnota-Brand-Guidelines.pdf', kb(out));
}

/* ------------------------------------------------------------------ main */
const [cmd = 'all', ...rest] = process.argv.slice(2);
if (cmd === 'logos' || cmd === 'all') { buildLogosJs(); await buildPack(); }
if (cmd === 'pdf' || cmd === 'all') await buildPdf();
if (cmd === 'shot') { const [url, out, w, h, sc] = rest; await shot(url, out, +w, +h, +(sc || 1)); console.log('shot', out); }
