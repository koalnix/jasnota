#!/usr/bin/env node
/* Jasnota — sync the content calendar's social data into the published social hub (instagram/).

     node instagram/tools/sync-social.mjs        # safe to rerun; writes instagram/social.js

   `research/` is private and never published, so the hub cannot read it. This copies only what the hub needs:
     research/content-bank/calendar.json  (fallback: website/content/calendar.json)
       → per week: week, date, pillar, format, titles, the article slug (resolved from the article file), whether the
         article page is built on the website, its link-preview image, the share links (UTM), and the `social` object
         ({ fb: { text_mk, photo_note, link_label_mk, needs_article }, ig: { caption_mk, slides, alt_mk, hashtags,
         summary_en } | { see } }) verbatim. No research questions, notes or anything else.
     research/content-bank/sources.json   → references missing from instagram/refs.js, in the same shape, so new
         carousels (week 1) can cite them on the Извори slide.
   Items without `social` are fine: the hub shows placeholders until the data lands.
   Run after: the content agent edits calendar.json, `node website/tools/import-content.mjs` + `build.mjs`
   (so `on_site` and the OG images are current). PUBLIC_URL / SITE_URL: see website/tools/urls.mjs. */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_URL, SITE_URL, shareUrl, articleUrl } from '../../website/tools/urls.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const IG = resolve(HERE, '..');
const BANK = join(ROOT, 'research', 'content-bank');
const WEB = join(ROOT, 'website');
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const pick = (...files) => files.find((f) => existsSync(f));
const rel = (f) => relative(ROOT, f).split('\\').join('/');

const calFile = pick(join(BANK, 'calendar.json'), join(WEB, 'content', 'calendar.json'));
if (!calFile) { console.error('No calendar.json in research/content-bank/ or website/content/.'); process.exit(1); }
const calendar = read(calFile);
const items = Array.isArray(calendar) ? calendar : (calendar.items || calendar.weeks || []);

const FMT = (f) => (/приказ на студија|study/.test(f) ? 'study' : /мит|myth/.test(f) ? 'myth' : /^поим|concept/.test(f) ? 'concept' : /листа|list/.test(f) ? 'list' : 'text');

/* the article's slug: from the article file named in the calendar (bank first, then the website copy) */
function slugOf(c) {
  if (c.slug) return c.slug;
  if (!c.article) return null;
  const f = pick(join(BANK, c.article), join(WEB, 'content', c.article));
  if (!f) return null;
  try { return read(f).slug || null; } catch { return null; }
}

const weeks = items.map((c) => {
  const slug = slugOf(c);
  const onSite = !!slug && existsSync(join(WEB, 'articles', slug, 'index.html'));
  const og = slug && existsSync(join(WEB, 'assets', 'og', 'articles', `${slug}.png`)) ? `website/assets/og/articles/${slug}.png` : null;
  return {
    week: c.week, date: c.date, pillar: c.pillar, format: c.format, fmt: FMT(c.format || ''),
    title_mk: c.title_mk, title_en: c.title_en || '',
    slug, on_site: onSite, og,
    url: slug ? articleUrl(slug) : null,
    share: slug ? { instagram: shareUrl(slug, 'instagram'), facebook: shareUrl(slug, 'facebook') } : null,
    source_ids: c.source_ids || [],
    social: c.social || null,
  };
}).sort((a, b) => a.date.localeCompare(b.date) || a.week - b.week);

/* ------------------------------------------------------------------ references missing from refs.js */
const refsFile = join(IG, 'refs.js');
let have = {};
try { const t = readFileSync(refsFile, 'utf8'); have = JSON.parse(t.slice(t.indexOf('{', t.indexOf('window.J.REFS'))).trim().replace(/;\s*$/, '')); } catch { have = {}; }
const srcFile = pick(join(BANK, 'sources.json'), join(WEB, 'content', 'sources.json'));
const sources = srcFile ? read(srcFile) : [];
function refShape(s) {
  const apa = s.apa.trim();
  const m = apa.match(/^(.*?)\s\((\d{4})[a-z]?(?:,[^)]*)?\)\.\s*(.*)$/);
  if (!m) return { apa, doi: s.doi || '', cite: s.id, short: apa, slide: apa, type: s.type || '', finding: s.key_finding_mk || '' };
  const [, authors, year, rest0] = m;
  const names = [...authors.matchAll(/(?:^|,\s*(?:&\s*)?|&\s*|…\s*)([^,&…]+?),\s*(?:[A-ZÀ-ŽА-Я][a-zа-я]?\.(?:\s?-?\s?[A-ZÀ-ŽА-Я][a-zа-я]?\.)*)/g)].map((x) => x[1].trim());
  const who = names.length > 2 ? `${names[0]} et al.` : names.length ? names.join(' & ') : authors.replace(/,.*$/, '');
  const rest = rest0.replace(/\s*https?:\/\/\S+\s*$/, '').trim();
  const j = rest.match(/(?:^|[.?!]\s)([^.?!]+?),\s*(\d+)(\(\d+[^)]*\))?(?:,\s*(?:Article\s+)?[\w–-]+)?\.?$/);
  const noPages = rest.replace(/,\s*[\w]*\d+[–-]\d+\.?$/, '.').replace(/\.\.$/, '.');
  return {
    apa, doi: s.doi || '', cite: `${who}, ${year}`,
    short: `${authors} (${year}). ${noPages}`.replace(/\s+/g, ' '),
    slide: j ? `${authors} (${year}). ${j[1].trim()}, ${j[2]}${j[3] || ''}.` : `${authors} (${year}). ${rest.split(/(?<=[.?!])\s/)[0]}`,
    type: s.type || '', finding: s.key_finding_mk || '',
  };
}
const refs = {};
for (const s of sources) if (!have[s.id] && s.apa) refs[s.id] = refShape(s);

/* ------------------------------------------------------------------ write */
const data = {
  synced: new Date().toISOString().slice(0, 16).replace('T', ' '),
  from: rel(calFile),
  public_url: PUBLIC_URL, site_url: SITE_URL,
  weeks, refs,
};
const out = join(IG, 'social.js');
writeFileSync(out, `/* Јаснота — social data for the hub (Instagram + Facebook). GENERATED by instagram/tools/sync-social.mjs
   from ${data.from}: do not edit by hand, edit the calendar and rerun the sync. */
window.J = window.J || {};
window.J.SOCIAL = ${JSON.stringify(data, null, 1)};
`);
const withSocial = weeks.filter((w) => w.social);
const withFb = weeks.filter((w) => w.social && w.social.fb && w.social.fb.text_mk);
const withSlides = weeks.filter((w) => w.social && w.social.ig && Array.isArray(w.social.ig.slides) && w.social.ig.slides.length);
console.log('jasnota social sync');
console.log(`   ${rel(calFile)} → instagram/social.js`);
console.log(`   ${weeks.length} weeks (${weeks[0] ? weeks[0].date : '–'} – ${weeks.length ? weeks[weeks.length - 1].date : '–'}) · ${withSocial.length} with social · ${withFb.length} FB texts · ${withSlides.length} IG carousels in the calendar`);
console.log(`   articles on the site: ${weeks.filter((w) => w.on_site).map((w) => 'w' + w.week).join(' ') || 'none'} · OG images: ${weeks.filter((w) => w.og).length}`);
console.log(`   ${Object.keys(refs).length} references added for the hub (not in refs.js) · share links on ${PUBLIC_URL}`);
