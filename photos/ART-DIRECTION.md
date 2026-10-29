# Jasnota photography — real first, AI only where it can't lie

## Rules

1. **Jasna's face, voice, stage and city are always real photos.** Slots `profile`, `portrait`, `stage`, `bitola`,
   and anything captioned as her or as Orchestra DIVA must be real (and credited to the photographer).
   No reliable public photo of Jasna was found online (concert reports name her, but no caption identifies her in a
   photo), and the Instagram is private — so there are **no AI images of her face**. An AI face would be a stranger
   presented as Jasna.
2. **AI is allowed for object and atmosphere frames** that don't claim a person, a place or an event:
   sheet music, a vinyl record, a cassette, a corridor, light through a door, texture. Keep a list of them
   (below) so they can be swapped for real shots over time.
3. Everything goes through the same grade on the site (grayscale/low-key + grain), so real and AI frames sit together.

## Recipe that worked (Higgsfield Soul 2.0)

- **Model:** `soul_2` (Higgsfield Soul 2.0), quality 2k, 3:4. Styles: **BW film** (`3ece570b-…`) for black-and-white,
  **Muted cool film** (`a15510bf-…`) for colour. GPT Image 2.5 is the fallback (not tested yet: daily limit).
- **Describe the capture, not the beauty:** camera type + lens + film stock + a single motivated light source.
  e.g. "Shot on 35mm Kodak Tri-X 400 pushed to 1600, rangefinder, 35mm lens wide open, available light only."
- **Ask for real-camera failure:** "underexposed by a stop", "deep blacks crushing to pure black", "visible grain",
  "soft halation around the lamp", "slight motion softness", "handheld, slight tilt", "imperfect framing".
- **Physical specifics beat adjectives:** "pencil commas above the staff", "dust specks", "a folded music stand".
- **Never write:** beautiful, stunning, cinematic masterpiece, 8k, ultra-detailed, hyperrealistic, perfect lighting.
- **Avoid readable text** (it comes out as gibberish): "label out of focus and unreadable", "no text".
- **Review like a photo editor:** check hands, objects that melt into each other, fake text, and whether anything
  claims to be a real place or person. Reject before publishing.

## Results — 29 Oct 2026

| File | Prompt idea | Verdict | Used as |
|---|---|---|---|
| `extra-06.jpg` (`generated/ai-sheet-music.jpg`) | Sheet music under a desk lamp, pencil, a hand at the edge — Muted cool film | ✔ Reads as a real 35mm frame. Notation is pseudo-notation up close; no pencil breath marks. | Slot `extra-06` (stand-in) |
| `extra-01.jpg` (`generated/ai-backstage-door.jpg`) | Theatre corridor, door ajar, a line of light — BW film | ✔ Strong. The folded music stand is a slightly melted object. | Slot `extra-01`, reel 5 cover (stand-in until the reel is filmed) |
| `generated/ref-bitola-street-night.jpg` | Neoclassical pedestrian street after rain, CineStill 800T | ◐ Very convincing, but it is **not Bitola** — reference only, never post it as Bitola. Use it to brief the real Širok Sokak shot. | Reference |
| *(rejected, not saved)* | Backlit profile, face in shadow | ✖ The model lit the whole face and invented a recognisable woman. | — |

## Next prompts (not yet run — the plan's daily generation limit was reached)

**Hands + microphone (anonymous, BW film):**
> Close-up of a woman's hands wrapped around a worn black dynamic microphone, held near her chest just before
> singing. One hard light from the left, like a stage spot leaking through a curtain gap; everything else falls into
> black. Knuckles slightly tense, one thin silver ring, natural skin texture, short unpolished nails. Cable falls out of
> frame. Shot on 35mm Kodak Tri-X 400 pushed one stop, rangefinder, 35mm lens wide open, available light only. Visible
> grain, underexposed, blacks crushing to pure black, slight motion softness, imperfect framing. Unretouched. No text.

**Vinyl (Muted cool film):** record cropped off-centre, tonearm in the groove, label out of focus and unreadable, one
lamp drawing a thin highlight arc across the grooves, dust specks, Portra 800 muted, underexposed.

**Cassette + wired earbuds (Muted cool film):** handwritten label too blurred to read, tangled white earbuds, dark
scratched table, lit only by a phone screen just out of frame.

**Silhouette, fixed (BW film)** — only as a lighting reference for the real portrait shoot, never as Jasna:
> Pure silhouette: a woman's head in strict profile, completely black against a softly lit grey wall behind her;
> no light falls on the front of her face at all; only a thin rim of light on the hairline. Tri-X, grain, underexposed.

## Real shots still needed (see README.md)

`profile`, `portrait`, `stage` (with DIVA — get the photographer's permission and credit), `hands`, `bitola`,
`extra-02` vinyl, `extra-03` cassette, `extra-04` singing "Zajdi", `extra-05` DIVA tuning. Real photos replace AI
stand-ins: just save over `extra-01.jpg` / `extra-06.jpg` and run `node website/tools/build-journal.mjs`.
