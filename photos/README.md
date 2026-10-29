# Photos for Jasnota

Drop your own photos here (JPG or PNG, as large as you have). Name them by slot so the site and feed pick them up:

| File | Used for |
|---|---|
| `portrait.jpg` | About page portrait + home About teaser (dark, low-key, ideally 4:5) |
| `stage.jpg` | Singing with Orchestra DIVA (Listen page, Instagram) |
| `hands.jpg` | Close-up: hands, microphone, sheet music |
| `bitola.jpg` | Bitola — Širok Sokak, Pelister, the city at night |
| `profile.jpg` | Instagram profile picture (square, face or the mark) |
| `extra-01.jpg` … | Anything else for the feed |

Then run `node website/tools/build-journal.mjs`: it copies photos into the site and updates `manifest.json`,
which the Instagram pages read to know which photos exist. PNG works too.
Only use photos you own or have permission to use (concert photos usually belong to the photographer).
