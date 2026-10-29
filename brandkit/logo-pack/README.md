# Јаснота / Jasnota — logo pack (v2 · 2026)

Jasnota is an educational platform on the psychology of music: **„Психологијата зад музиката“ / The psychology behind music.**
Primary mark: **01 Камертон / Ψ**, a tuning fork that reads as psi; the inner stroke stops before the bowl: the pause.
**Primary wordmark: Cyrillic `јаснота`** (Macedonian is the base language). Latin `jasnota` is for English and international
pieces, and for addresses (jasnota.mk, @jasnota). Full rules: `Jasnota-Brand-Guidelines.pdf` (chapters 02 “Editorial system”,
04 “The logo”, 08 “Templates”, 10 “Files”).

## Folders

| Folder | What | Use it for |
|---|---|---|
| `01-mark/` | The tuning-fork mark alone | Avatars, small spaces, embossing, sign-offs |
| `02-wordmark/` | `јаснота` (Cyrillic, primary) and `jasnota` (Latin) | Headers, credits, slide and carousel footers |
| `03-lockup-horizontal/` | Mark + wordmark side by side | **Default logo: `…-cyrillic-…`.** Website, newsletter, slides, partnership sheet, email |
| `04-lockup-stacked/` | Mark above the wordmark | Square and tall formats, covers, notebook |
| `05-app-icon-favicon/` | App icon, favicons, `favicon.ico` | Browser tab, home screen |
| `06-social/` | Instagram profile picture (the mark, 1080 × 1080), share image (1200 × 630), newsletter header (1200 × 400) | @jasnota profile picture, og:image, email header |
| `07-secondary-signs/` | Signs 02–06 | Only in their editorial jobs (below). Never as a logo |
| `08-evidence-labels/` | The evidence meter (SVG) and the four labels in Macedonian and English (PNG @2x, transparent) | Articles, carousels, slides, citation cards |
| `09-templates/` | SVG frames with a guides layer and live text; PNG examples | Instagram carousel (1080 × 1350), story (1080 × 1920), highlight covers, citation card, newsletter |

Logo folders have `svg/` (master vectors), `pdf/` (print and Office) and `png/` (long edge 512 / 1024 / 2048 px).

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

`09-templates/svg/` frames are built on the brand grid: 8% margins on slides, 9% on stories, Instagram’s 3:4 profile crop and
the story safe area (top and bottom 14%) drawn in the `guides` layer — hide or delete it before export. Text is live, set in
Cormorant, Onest and JetBrains Mono (free on Google Fonts; install them first). The PNGs in `09-templates/png/` are finished
examples from the first weeks of the calendar, rendered from the brand kit.

## File names

`jasnota-<asset>-<colourway>[@size].<ext>`

| Colourway | Looks like | When |
|---|---|---|
| `bone-on-ink` | Bone `#ECE8E1` on an ink `#0A0A0B` field, clear space included | **Default.** The brand is black |
| `ink-on-bone` | Ink on a bone field, clear space included | Light contexts, print on light stock |
| `bone` | Bone, transparent background | On ink, night or dark images |
| `ink` | Ink, transparent background | On bone, paper, light stock |
| `white` / `black` | Pure `#FFFFFF` / `#000000`, transparent | Third-party systems, one-colour print, foil, engraving |
| `…-cinnabar-dot` | The dot of the ј / j in cinnabar `#B4452C` | Wordmarks and lockups only, at most once per composition |

## Minimum sizes

| | Screen | Print |
|---|---|---|
| Mark | 24 px | 8 mm |
| Mark, small cut (`favicon.svg`) | 16 px | — |
| Horizontal lockup | 120 px wide | 30 mm wide |
| Stacked lockup | 80 px wide | 20 mm wide |
| Wordmark alone | 80 px wide | 18 mm wide |

## Favicon snippet

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
```

## Don't

Don't stretch, rotate, outline, add shadows/glow/gradients, retype the word in another font or in capitals, close the pause in
the mark, colour the whole mark cinnabar, or stack the Cyrillic and Latin words as one logo.

Colours: `ink #0A0A0B · night #131315 · graphite #2A2A2D · ash #8C8A85 · ash-light #66645F · bone #ECE8E1 · paper #F6F4EF · cinnabar #B4452C`.
CMYK values in the guidelines are approximate; proof with the printer.

Generated by `brandkit/build.mjs` from `/brand/logo/*.svg` and `brandkit/assets/`. Re-run `node brandkit/build.mjs logos` after any change.
