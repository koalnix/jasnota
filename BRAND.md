# Јаснота / Jasnota — brand foundation

Single source of truth for every Jasnota deliverable (logo, Instagram, website).
Read this fully before designing anything.

## The name

- **Јасна** (Jasna) — the founder's name. In Macedonian *јасна* also means *clear, bright, lucid*.
- **нота** (nota) — a musical note.
- **Јасна нота** = "a clear note". **Јаснота** also echoes *јасност* — clarity.
- It also splits as **јас + нота** — "I (the self) + note". The self and the sound in one word.
- Lockup spelling: Latin **jasnota** is primary (international audience); Cyrillic **јаснота** is the
  signature/origin form, used on Macedonian content and as a deliberate detail. Always lowercase in the wordmark.
  Always lowercase in the wordmark. In running text: "Јаснота" / "Jasnota".

## What it is

A personal brand by Jasna that lives at the intersection of three things:
**psychology** (психологија) · **music** (музика) · **human experience** (човечко искуство).

Not therapy-as-a-service, not a music channel, not motivational content.
It is a calm, intelligent voice that *listens* — explaining feelings through sound,
and sound through feelings. Think: a liner note for the inner life.

## Audience — everyone, with Macedonian roots

Jasnota speaks to an **international** audience. **English is the default language** of the website and
the main language of public content; **Macedonian is fully supported** (site toggle, MK captions/first
comment). The Macedonian origin is part of the story — the name, the 7/8 rhythm, Ohrid, Bitola — told so
anyone can feel it, never as a local-only message.

Positioning line: **To hear yourself.** — MK: *Да се слушнеш себеси.*
Alternates: "Психологија што се слуша." / "Чувствата имаат ритам."

## Core ideas we design from (use these, not generic "calm wellness" tropes)

1. **Attunement / камертон (tuning fork).** In psychology, *attunement* is when one person
   tunes in to another's inner state. A tuning fork is literally an instrument of attunement —
   and its silhouette is almost the Greek **Ψ** (psi), the symbol of psychology.
2. **Asymmetric rhythm — 7/8.** Macedonian folk music lives in uneven meters
   (7/8 = 2+2+3, also 9/8, 11/16). Human experience is uneven too. The 2·2·3 grouping
   is a recurring structural motif (grids, spacing, animation timing, logo variant).
3. **Silence / пауза.** The rest between notes. Negative space is a feature, not emptiness.
4. **Clarity / јасност.** One clear note in the dark. A single point of light on black.
5. **Ohrid roots (subtle, never folkloric kitsch).** Ohrid literary school (St. Clement,
   early Slavic script), Byzantine fresco pigments, lake-at-night darkness. Referenced through
   geometry and pigment, never through clip-art ornament or flags.

## Palette — black first

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0A0A0B` | Primary background. The brand is black. |
| `--night` | `#131315` | Raised surfaces on black |
| `--graphite` | `#2A2A2D` | Hairlines, dividers on black |
| `--ash` | `#8C8A85` | Secondary text on black |
| `--bone` | `#ECE8E1` | Primary text on black; light-mode background |
| `--paper` | `#F6F4EF` | Rare light surfaces (print, light stories) |
| `--cinnabar` | `#B4452C` | Fresco-red accent. **< 2% of any composition.** One dot, one word, one line. |

No gradients as decoration. No purple/blue "AI glow". Film grain (subtle noise) is allowed.

## Typography (all support Macedonian Cyrillic: Ѓ Ќ Ѕ Џ Љ Њ Ј)

- **Display:** *Cormorant* (Google Fonts) — Light 300 / Regular 400, plus *Italic* for the one
  emotive word in a line. Huge sizes, tight leading (0.9–1.0), slight negative tracking.
- **Text / UI:** *Onest* (Google Fonts) — Cyrillic-first grotesk. 300–500 weights.
- **Notation / meta:** *JetBrains Mono* — tiny sizes only, for "notation" details:
  timestamps, tempo marks (♩ = 60), meters (7/8), numbering (01 — 07). Used like footnotes, sparingly.
- Always set `lang="mk"` on Macedonian content so Cyrillic localized forms render correctly.

## Hard rules — what makes it premium and NOT "AI slop"

- **No eyebrow labels** ("brow titles"): no tiny uppercase tag/kicker above headlines
  (e.g. "OUR MISSION" above "We help you…"). A headline stands alone.
- No emoji, no sparkles ✨, no gradient blobs, no glassmorphism cards, no "3 feature cards in a row"
  with icons, no stock "woman meditating on beach", no generic SaaS hero with two buttons.
- No clichéd copy ("unlock your potential", "journey", "transform your life", "empower").
  Write like a thoughtful person, short, specific, slightly poetic. English first, Macedonian equal in quality
  (never machine-literal: each language should read as if written in it).
- Typography does the heavy lifting. Asymmetric layouts. Generous black space.
- Motion is slow and intentional (ease-out, 0.8–1.6s), tied to scroll, like a film cut —
  never bouncy, never everything-fades-up-on-scroll by default.
- Respect `prefers-reduced-motion`.

## Voice

Calm, precise, warm, a bit literary. Speaks *with* the reader, not *at* them.
Direct "you" in English; second person singular (ти) in Macedonian.

## Founder facts (confirmed by Jasna, 2026-10-28)

- **Jasna Dimitrovska** — psychologist, **Gestalt counsellor**, **vocal artist**. Based in Bitola, North Macedonia.
- Sings as a vocalist with **Orchestra DIVA** (Оркестар DIVA, Bitola; Instagram @chamber_orchestra_diva) —
  e.g. the orchestra's MTV 80s & 90s hits concerts, Stars Symphony, "Vienna in Bitola".
- Co-author of published research: *Self-esteem as a mediator between perfectionism and impostor syndrome
  among gifted students* (2024, International Slavic University). Do not state its findings until Jasna supplies them.
- Personal Instagram today: **@jasna.dzasna** (private, ~1.4k followers; bio "Psychologist · Gestalt Counsellor · Vocal Artist").
- **Jasnota does not offer counselling sessions (yet).** Credentials may be stated; content explains, never diagnoses,
  and never invites people to book therapy. Journal/posts keep a "this is not therapy" line.
- Photos: none supplied yet. Real photos go in `/photos/` (see `/photos/README.md`); until then art-directed placeholders.
Short sentences. One idea per post.

## Shared assets

- `brand/tokens.css` — CSS variables (colors, fonts, spacing on a 2·2·3 rhythm).
- `brand/logo/mark.svg` — **approved primary mark: 01 Камертон / Ψ** (tuning fork that reads as psi;
  the inner stroke breaks before the bowl — the pause). Chosen by Jasna, 2026-10-28.
- `brand/logo/01–06-*.svg` — the six directions; 02–06 stay as secondary signs
  (02 progress/players, 03 end-of-text dot, 04 listening episodes, 05 end-of-post, 06 Ohrid series).
- `brand/logo/wordmark-*.svg`, `lockup-*.svg`, `favicon.svg` — outlined Cormorant Light wordmarks and lockups.
