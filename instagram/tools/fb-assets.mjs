#!/usr/bin/env node
/* Jasnota — Facebook page images, rendered with headless Google Chrome (same renderer and fonts as the OG cards).

     node instagram/tools/fb-assets.mjs     → instagram/facebook/cover.png    1640 × 624 (cover photo)
                                             instagram/facebook/profile.png  1080 × 1080 (profile picture: the mark)

   The cover keeps everything inside the centre 1100 px (phones crop the sides) and above the bottom 150 px
   (the profile picture and the page name overlap there). Rerun after changing the text below. */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { shoot, fontsCSS, hasChrome, CHROME } from '../../website/tools/og.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '..', 'facebook');
const TMP = resolve(HERE, '..', '..', 'website', 'tools', '.cache', 'fb');
const MARK = (sw) => `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="${sw}" aria-hidden="true"><path d="M28 14 V44 A22 22 0 0 0 72 44 V14"/><path d="M50 6 V52"/><path d="M50 64 V94"/></svg>`;

const base = (fonts, w, h, css, body) => `<!doctype html><html lang="mk"><head><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:#0a0a0b;color:#ece8e1;-webkit-font-smoothing:antialiased}
:lang(mk) em{font-language-override:"SRB"}
${css}</style></head><body>${body}</body></html>`;

const COVER = {
  css: `
body{position:relative}
.str{position:absolute;left:0;right:0;top:372px;height:1px;background:#2a2a2d}
.pt{position:absolute;left:1118px;top:368px;width:9px;height:9px;border-radius:50%;background:#ece8e1;box-shadow:0 0 18px 4px rgba(236,232,225,.22)}
.ghost{position:absolute;left:1010px;top:84px;width:420px;height:420px;color:#1b1b1e}
h1{position:absolute;left:300px;top:122px;font:300 104px/1 Cormorant,serif;letter-spacing:-.015em}
h1 em{font-style:italic;font-weight:300}
.m{position:absolute;left:304px;top:400px;font:300 17px/1.7 "JetBrains Mono",monospace;color:#8c8a85;letter-spacing:.05em}
.m b{font-weight:300;color:#ece8e1}
.meter{position:absolute;left:304px;top:472px;display:flex;gap:9px;align-items:center}
.meter i{width:8px;height:8px;border-radius:50%;border:1px solid #8c8a85}.meter i.a{background:#ece8e1;border-color:#ece8e1}.meter s{width:10px}
.dot{position:absolute;left:418px;top:478px;width:6px;height:6px;border-radius:50%;background:#b4452c;display:none}`,
  body: `<div class="ghost">${MARK(1.6)}</div><div class="str"></div><span class="pt"></span><span class="dot"></span>
<h1 lang="mk">Психологијата<br>зад <em>музиката</em></h1>
<p class="m" lang="mk"><b>научно, со извори</b> · на македонски<br>нов текст секој понеделник</p>
<div class="meter"><i class="a"></i><i></i><s></s><i class="a"></i><i></i><s></s><i class="a"></i><i></i><i></i></div>`,
};
const PROFILE = {
  css: `body{display:grid;place-items:center}svg{width:520px;height:520px;color:#ece8e1;transform:translateY(-6px)}`,
  body: MARK(4.6),
};

if (!hasChrome()) { console.error(`Chrome not found at ${CHROME} (set CHROME=…)`); process.exit(1); }
mkdirSync(TMP, { recursive: true });
mkdirSync(OUT, { recursive: true });
const fonts = await fontsCSS();
const jobs = [['cover', 1640, 624, COVER], ['profile', 1080, 1080, PROFILE]];
console.log('jasnota facebook images');
await Promise.all(jobs.map(async ([name, w, h, t], i) => {
  const html = join(TMP, `${name}.html`);
  writeFileSync(html, base(fonts, w, h, t.css, t.body));
  await shoot(html, join(OUT, `${name}.png`), w, h, 10 + i);
  console.log(`   instagram/facebook/${name}.png  ${w} × ${h}`);
}));
