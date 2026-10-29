# Jasnota website — information architecture, content contract, build

Read with `/STRATEGY.md` (wins over everything) and `/BRAND.md`. Jasnota is an **educational platform on the psychology
behind music**, not a personal artist site: text-first, science-based, every claim sourced, no therapy or sessions.

## Languages
- **Macedonian is the default.** Every page ships Macedonian in the HTML (works without JS); `<html lang="mk">`.
- English is swapped in by `js/shell.js`:
  - interface strings: `data-i18n="key"` / `data-i18n-attr="attr:key"` → `JASNOTA_I18N.en[key]` in `js/i18n.js`;
  - page copy: inline `data-en="…"` (and `data-en-content`, `data-en-label`, `data-en-placeholder` for attributes);
  - whole blocks: `data-lang-block="mk|en"`. A piece without an English version keeps its Macedonian block visible
    (`data-lang-fallback`) and shows "This piece is available in Macedonian only for now."
- First visit is always Macedonian (no auto-switch). The choice is stored in `localStorage['jasnota-lang']` (`mk` | `en`).
- Wordmark: `јаснота` in MK, `jasnota` in EN. Descriptor: „Психологијата зад музиката“ / *The psychology behind music*.
- Macedonian typography: „…“ quotes, decimal comma, unspaced range dash. Italic Cyrillic uses the Serbian locl forms.

## Site map (all under `website/`; English slugs, Macedonian labels)
| URL | Source | Contents |
|---|---|---|
| `/` **Почетна** | `index.html` (+ generated blocks) | The film: point of light → string → mark → `јаснота` + descriptor · the mission (word-by-word) · the three pillars (pinned horizontal score) · 7/8 · latest pieces · „Мит или наука?“ · one concept · map teaser · the author · newsletter · coda |
| `/articles/` **Текстови** | generated | All pieces + upcoming calendar items („наскоро“, planned date, not links); filters by pillar and format |
| `/articles/<slug>/` | generated | Title, metadata line *below* it (pillar · format · date · reading time), dek, contents in the margin, body (h2, p, quote, list), evidence callouts, „Што знаеме / Што сè уште не знаеме“, ethics note, numbered APA 7 sources with DOI, founder disclosure when her study is cited, links to method/corrections, prev/next, reading progress |
| `/psychology-of-music/` · `/musicians/` · `/what-science-says/` | generated | Pillar I · II · III: purpose, intro, subtopics (STRATEGY §5), its pieces and upcoming items, related concepts, related myths |
| `/concepts/` **Поимник** | generated | 44 concepts, Macedonian collation (re-sorted A–Z in English), letter index, anchor per concept, pillar filter, search, evidence label, sources |
| `/myths/` **Митови и наука** | generated | 12 myths: verdict (мит / делумно точно / точно / непознато), evidence label, explanation, sources, link to the piece that treats it |
| `/sources/` **Извори** | generated | The bibliography by pillar, APA 7, type of study, key finding, DOI, "cited in" back-links; search + filters |
| `/map/` **Мапа на полето** | generated | Why we map, the five gap findings (sourced), the public directory (region/type filters, search, confidence, last seen, source links), "Пропушивме нешто?" |
| `/about/` **За Јаснота** | `about/index.html` | What it is / isn't, the name, mission, vision, six principles, success measures, the author (+ the 2024 study, generated) |
| `/method/` **Како работиме** | `method/index.html` | Six steps, source hierarchy, evidence labels (`#evidence`), uncertainty, APA 7, ethics checklist, corrections policy |
| `/contact/` **Соработка** | `contact/index.html` | Suggest a topic, report a correction, collaborate/partner, letters; zdravo@jasnota.mk, Instagram @jasnota. No counselling or booking |
| `/404.html` | `404.html` | „Пауза таму каде што требаше да има нота.“ |

Navigation: Текстови · Столбови (disclosure with the three pillars) · Поимник · Мапа · За Јаснота · Соработка · мк/en.
The phone menu lists the same, plus Митови и наука · Извори · Како работиме. The footer carries the descriptor, the
pillars, the platform pages, contact and © 2026 Јаснота · Јасна Димитровска, Битола, Македонија.

**Retired** (contained invented personal stories or sat outside the pillars): the old `/journal/` entries and `/listen/`.
Their URLs are tiny `noindex` redirect stubs written by the build: `journal/stage-fright/` → the MPA article,
`journal/why-sad-songs-make-us-calmer/` → `articles/why-music-moves-us/`, other journal URLs → `articles/`, `listen/` → `about/`.

## Content (`website/content/`, the only data the site reads)
`research/` is private and never published. Refresh the copies with `node website/tools/import-content.mjs`
(copies the content bank; merges article files so website-only fields such as `en.known` survive; derives `map.json`).

| File | Schema (abridged) |
|---|---|
| `articles/NN-*.json` | `slug, pillar (1-3), format (text·study·concept·myth·list), lang, date (YYYY-MM-DD), title, dek, reading_min, body[{h2?, blocks[{p}|{quote}|{list:[…]}|{evidence:{level, text}}]}], known[], unknown[], note, references[source ids], tags[], en?{title, dek, body, known, unknown, note}` — HTML allowed: `<em> <strong> <sup>` |
| `sources.json` | `[{id, apa, doi, url, type, pillar[], topics[], key_finding_mk, key_finding_en, evidence_note, verified_via}]` |
| `concepts.json` | `[{slug, term_mk, term_en, definition_mk, definition_en, pillar, evidence, source_ids[]}]` |
| `myths.json` | `[{id, claim_mk, claim_en, verdict, evidence, what_science_says_mk, source_ids[]}]` |
| `calendar.json` | `[{week, date, pillar, format, title_mk, title_en, research_question, source_ids[], article?}]` — items without a built article show as „наскоро“ |
| `map.json` | `{checked, entries:[{id, name_mk, name_en, type, region (mk·region·int), country_mk/en, city, fields[], work?{authors, year, title, venue, url}, inst_mk/en, summary_mk/en, url, sources[], confidence (verified·likely), last_seen}]}` |

Evidence labels (exact strings): `силни докази` · `умерени докази` · `рани/ограничени докази` · `отворено прашање`
(English bodies may use `strong/moderate/early/limited evidence`, `open question`). They render as a three-step meter
and link to `method/#evidence`. In-text citations stay as (Author, Year); the build links each to its numbered reference
when the first author and year match a source in `references`.

**Map privacy rule** (enforced in `tools/import-content.mjs`): only institutions, associations, journals, networks, events,
education programmes and published research (author + institution + title + link). Never `partnership_potential`,
`relevance_to_jasnota`, `notes`, the partner ranking, or anything about individuals beyond their published work;
`unverified` entries are dropped; the Gestalt Institute Skopje site is not linked. Person entries are rewritten in `PUBLIC`.

**Adding a piece:** write `content/articles/NN-slug.json` (or add it to the content bank and import), point the calendar
item's `article` at it, rebuild. Upcoming items disappear from „наскоро“ automatically once their article exists.

## Build
```
node website/tools/import-content.mjs   # only when the content bank or mapping changed
node website/tools/build.mjs            # always after any JSON, page, shell or photo change
SITE_URL=https://example.org/ node website/tools/build.mjs   # canonical origin (default https://jasnota.mk/)
PUBLIC_URL=https://… node website/tools/build.mjs            # host for og:url / og:image / share links
node instagram/tools/sync-social.mjs    # after a calendar or article change: social data → instagram/social.js
```
Two origins (`tools/urls.mjs`): **`SITE_URL`** is the canonical origin (`<link rel="canonical">`, sitemap, robots, JSON-LD;
default `https://jasnota.mk/`). **`PUBLIC_URL`** is the host that resolves today: `og:url`, `og:image`, `twitter:image` and
every share link use it, because Facebook follows `og:url` and downloads `og:image`. Default: `SITE_URL` when `SITE_URL`
is set explicitly, otherwise the live host `https://koalnix.github.io/jasnota/website/`. When the domain is live:
`SITE_URL=https://jasnota.mk/ node website/tools/build.mjs` (both follow).

**Link-preview images** (`tools/og.mjs`, run by the build or alone: `node website/tools/og.mjs [--force]`): one
1200 × 630 PNG per article (`assets/og/articles/<slug>.png`) and per main page (`assets/og/<page>.png`), rendered from
an HTML card by headless Google Chrome (`CHROME=…` to override the path). Black, the mark + `јаснота`, the title in
Cormorant (shrinks to fit, at most four lines), the pillar numeral as a ghost, format · reading time, the descriptor.
Cached by content hash in `assets/og/og.json`, so a rebuild only renders what changed. Fonts are downloaded once into
`tools/.cache/` (git-ignored). Without Chrome the build keeps the existing PNGs. Every page head carries `og:image`
(+ type, width, height, alt), `twitter:card=summary_large_image`, and articles `article:published_time`.

**Share links** (`shareUrl()` in `tools/urls.mjs`; the same helper in `instagram/flow.js`):
`…/articles/<slug>/?utm_source=instagram|facebook&utm_medium=social&utm_campaign=<slug>`. Pages are static, so query
strings change nothing (the canonical stays clean). There is no analytics yet: the tags wait for a cookie-free counter.

`tools/build-journal.mjs` is a shim that runs `build.mjs`. The build: syncs `/brand` assets; copies `/photos/portrait.*`
into the About and home portrait frames (placeholder otherwise) and writes `/photos/manifest.json` for Instagram;
generates the data pages; fills the `<!-- name -->…<!-- /name -->` blocks in the hand-written pages (`home:latest`,
`home:myth`, `home:concept`, `home:map`, `photo:*`, `about:study`, `about:ld`); injects the shell (`tools/shell.mjs`:
head + JSON-LD Organization, header/menu/veil, footer); writes the redirect stubs, `sitemap.xml` and `robots.txt`.
Generated files carry "generated by tools/build.mjs": edit the JSON or the build, not the HTML.

SEO: Macedonian titles/descriptions (English in `data-en*`), canonical from `SITE_URL`, og:url + og:image from `PUBLIC_URL`, JSON-LD `Organization`
(every page), `Person` + `ScholarlyArticle` (About), `Article` with `citation[]` (articles), `DefinedTermSet` (glossary).

## Front-end
- `js/shell.js` — language, Lenis, veil transitions + first-visit preloader, cursor, magnetic, pillars disclosure, menu,
  scrubbers, reveals, marquee, row previews, reading progress, newsletter (no provider yet: thank-you state only).
- `js/home.js` — the film (GSAP 3.12.5 + ScrollTrigger). Phones: scenes stay lit, pillar panels hold/glide, 7/8 phone layout.
- `js/library.js` — filters, search, per-language sorting; state in the URL (`?pillar=2&format=myth&q=…`).
- CSS: `shell.css` (shared, evidence/verdict/confidence tags, rows), `home.css`, `pages.css`, `article.css`.
- `prefers-reduced-motion` and `?static` give a calm, fully readable site. No audio anywhere.
