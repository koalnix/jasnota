#!/usr/bin/env node
/* Јаснота / Jasnota — brand kit build.
 *
 *   node brandkit/build.mjs            everything: logos.js, logo pack + zip, PDF
 *   node brandkit/build.mjs logos      assets/logos.js + logo-pack/ + Jasnota-Logo-Pack.zip
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

  writeFileSync(join(PACK, 'README.md'), readme());
  console.log('logo pack:', count);

  const zip = join(KIT, 'Jasnota-Logo-Pack.zip');
  rmSync(zip, { force: true });
  execFileSync('zip', ['-r', '-q', '-X', zip, 'logo-pack', '-x', '*.DS_Store'], { cwd: KIT });
  console.log('Jasnota-Logo-Pack.zip', kb(zip));
}

function readme() {
  return `# Jasnota — logo pack (v1 · 2026)

Primary mark: **01 Камертон / Ψ** — a tuning fork that reads as psi. The inner stroke stops before the bowl: the pause.
Primary wordmark: Latin **jasnota** (international). Cyrillic **јаснота** is the signature/origin form for Macedonian content.
Full rules: \`Jasnota-Brand-Guidelines.pdf\` (pages “The mark” to “Logo files”).

## Folders

| Folder | What | Use it for |
|---|---|---|
| \`01-mark/\` | The tuning-fork mark alone | Avatars, small spaces, embossing, sign-offs, anywhere the name is already present |
| \`02-wordmark/\` | \`jasnota\` (Latin) and \`јаснота\` (Cyrillic) | Headers, credits, end cards — when the mark appears elsewhere |
| \`03-lockup-horizontal/\` | Mark + wordmark side by side | **Default logo.** Website header, letterhead, email, slides, posters |
| \`04-lockup-stacked/\` | Mark above the wordmark | Square and tall formats: covers, tote, merch, title cards |
| \`05-app-icon-favicon/\` | App icon, favicons, \`favicon.ico\` | Browser tab, home screen, app stores |
| \`06-social/\` | Instagram profile picture (1080 × 1080), share image (1200 × 630) | Profile picture until a real portrait exists; link previews (og:image) |
| \`07-secondary-signs/\` | Signs 02–06 (7/8, Јасна нота, Резонанса, Пауза, Охрид) | Only in their jobs — see the guidelines. Never as a logo |

Each logo folder has \`svg/\` (master vectors), \`pdf/\` (vectors for print and Office), \`png/\` (raster, long edge 512 / 1024 / 2048 px).

## File names

\`jasnota-<asset>-<colourway>[@size].<ext>\`

| Colourway | Looks like | When |
|---|---|---|
| \`bone-on-ink\` | Bone \`#ECE8E1\` on an ink \`#0A0A0B\` field, clear space included | **Default.** The brand is black |
| \`ink-on-bone\` | Ink on a bone field, clear space included | Light contexts, print on light stock |
| \`bone\` | Bone, transparent background | On ink, night or dark low-key photography |
| \`ink\` | Ink, transparent background | On bone, paper, light stock |
| \`white\` / \`black\` | Pure \`#FFFFFF\` / \`#000000\`, transparent | Third-party systems that need pure values, one-colour print, foil, laser engraving |
| \`…-cinnabar-dot\` | The dot of the j / ј in cinnabar \`#B4452C\` | Wordmarks and lockups only, at most once per composition. Never the whole mark |

Transparent files are cropped tight to the artwork. Files with a background already include the minimum clear space
(around the mark: the bowl radius r; around words and lockups: the x-height x). Keep at least that much space around any version.

## Minimum sizes

| | Screen | Print |
|---|---|---|
| Mark | 24 px | 8 mm |
| Mark, small cut (\`favicon.svg\`) | 16 px | — |
| Horizontal lockup | 120 px wide | 30 mm wide |
| Stacked lockup | 80 px wide | 20 mm wide |
| Wordmark alone | 80 px wide | 18 mm wide |

Below 32 px use the small cut in \`05-app-icon-favicon/\` (heavier stroke, wider pause, on its own ink square).

## Favicon snippet

\`\`\`html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
\`\`\`

## Don't

Don't stretch, rotate, outline, add shadows/glow/gradients, re-type the word in another font or in capitals,
close the pause in the mark, colour the whole mark cinnabar, or place it on a busy background.

Colours: \`ink #0A0A0B · night #131315 · graphite #2A2A2D · ash #8C8A85 · bone #ECE8E1 · paper #F6F4EF · cinnabar #B4452C\`.
CMYK values in the guidelines are approximate; proof with the printer.

Generated by \`brandkit/build.mjs\` from \`/brand/logo/*.svg\`. Re-run \`node brandkit/build.mjs logos\` after any change to the masters.
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

async function shot(url, out, w, h, scale = 1, chrome) {
  const run = async ({ open }) => {
    const full = !h;
    const p = await open(url, { w, h: h || 900, scale, mobile: w < 600 });
    const H = full ? await p.ev('document.documentElement.scrollHeight') : h;
    const { data } = await p.s('Page.captureScreenshot', { format: full ? 'jpeg' : 'png', quality: 70, clip: { x: 0, y: 0, width: w, height: H, scale: 1 }, captureBeyondViewport: full });
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
