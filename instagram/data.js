/* Јаснота — month one on Instagram (2 Nov – 1 Dec 2026).
   Single source of truth for the plan, calendar, prototype and moodboard grid.
   Requires render.js (J.h helpers). Captions: English, the 7/8 divider, Macedonian, hashtags. */
(function () {
  'use strict';
  var J = window.J, h = J.h;

  J.HANDLE = 'jasnota';
  J.NAME = 'Jasna Dimitrovska · Jasnota';
  J.BIO = ['Psychologist · Gestalt counsellor', 'Vocal artist, @chamber_orchestra_diva', 'To hear yourself. Да се слушнеш себеси.', 'Bitola · EN / МК'];
  J.LINK = 'jasnota.mk';
  J.STATS = { posts: 15, followers: '1.562', following: 212 };

  J.PILLARS = {
    about:  { en: 'Introductions', mk: 'Запознавање', note: 'Launch only: who is talking and why.' },
    sound:  { en: 'The sound of feelings', mk: 'Звукот на чувствата', note: 'Psychology heard through musical ideas.' },
    psycho: { en: 'Psycho-note', mk: 'Психо-нота', note: 'Numbered explainers, one term each.' },
    songs:  { en: 'Songs that remember us', mk: 'Песни што нè паметат', note: 'Music, memory, the weekly song.' },
    rest:   { en: 'Rest', mk: 'Пауза', note: 'Silence, breath, Bitola. Asks for nothing.' }
  };
  J.FORMATS = { single: 'Single', carousel: 'Carousel', reel: 'Reel', story: 'Story' };

  /* ---------- photos to shoot / supply (→ /photos/<slot>.jpg) ---------- */
  J.SHOTS = {
    profile:   { title: 'Profile picture', shot: 'Head and shoulders, three-quarter profile. One window or lamp from the side, half the face in shadow, plain dark background. Square; keep the face inside the central 60% so the circle crop holds.', use: 'Profile picture (until then: the Ψ mark on ink)' },
    portrait:  { title: 'Portrait, rim light', shot: 'Jasna in profile, looking off-frame, dark room, a single source behind or beside her drawing the edge of the face and hair. 4:5, lots of black above the head.', use: 'Intro carousel slide 2, Jasna highlight' },
    stage:     { title: 'On stage with Orchestra DIVA', shot: 'Mid-phrase on stage with the orchestra, from the side or from behind, stage light as the only source; the orchestra soft in the background. Ask the orchestra or its photographer for permission and credit them.', use: 'Intro carousel slide 4' },
    hands:     { title: 'Hands and microphone', shot: 'Close-up of her hands around a microphone (or resting on sheet music), raking side light, everything else falling to true black. No jewellery that catches light.', use: 'Post 12 (journal 01), story 26 Nov' },
    bitola:    { title: 'Bitola at night', shot: 'Širok Sokak after the shops close, a weeknight between 21:00 and 22:00. Long lens down the street, lamps as points of light, few or no people. Alternative: the Clock Tower from below, lit, sky almost black.', use: 'Post 6, story 9 Nov, Rest highlight' },
    'extra-01': { title: 'Backstage, a door of light', shot: 'Backstage before a DIVA concert: a corridor, the stage door ajar with a line of light, Jasna as a silhouette or only her hands. Also the cover frame of reel 5.', use: 'Post 5 cover' },
    'extra-02': { title: 'Vinyl, label hidden', shot: 'A record on a turntable, cropped off-centre so it bleeds out of frame, needle down, one lamp. Label and sleeve not legible (no artwork or brands).', use: 'Post 7 cover' },
    'extra-03': { title: 'Cassette or old earbuds', shot: 'A cassette, or an old phone with wired earbuds, on a dark wooden table. Side light, shallow focus, a lot of black.', use: 'Post 13 cover' },
    'extra-04': { title: 'Singing, one lamp', shot: 'Jasna singing “Zajdi, zajdi”, profile, eyes closed, one practical lamp in a quiet room. A frame grab from the reel works.', use: 'Post 14 cover, story 28 Nov' },
    'extra-05': { title: 'The orchestra tuning', shot: 'Orchestra DIVA tuning before a concert, wide from the back of the stage or hall: music stands, stand lights, bows raised. Filmed and shot with the orchestra’s permission.', use: 'Post 8 frames, story 13 Nov' },
    'extra-06': { title: 'Sheet music, pencil marks', shot: 'Sheet music on a stand with pencil breath marks, her hand and a pencil entering frame. Rehearsal light.', use: 'Stories 5 Nov, Stage highlight' }
  };

  var NT = 'This explains; it isn’t therapy.';
  var NTmk = 'Ова објаснува; не е терапија.';

  /* =================================================================
     FEED — 15 posts. n = posting order (1 = oldest). Bars of 7: 2+2+3.
     ================================================================= */
  J.POSTS = [

  /* ---------------- 1 ---------------- */
  {
    id: 'p01', n: 1, date: '2026-11-02', time: '20:20', fmt: 'single', pillar: 'about', light: true, bar: 'I', b: 1, g: 'a',
    title: { en: 'A clear note', mk: 'Јасна нота' },
    goal: ['follows', 'profile clarity'],
    why: 'Downbeat of bar I, on paper. The name explained in one line. Lives bottom-right of the grid for good.',
    slides: [{
      light: true,
      alt: 'Off-white square. A small black tuning-fork mark that reads as the Greek letter psi. Large serif text: A clear note. Below it, in Macedonian: Јасна нота.',
      html: '<div class="pc">' + h.mark(13) + '<div class="push">' + h.q('A clear <em>note.</em>', 'l') + h.mk('Јасна нота.', 'margin-top:3cqi') + '</div>' +
        h.row(h.meta('jasna + nota'), h.meta('01 · Bitola'), 'margin-top:7cqi') + '</div>'
    }],
    caption: {
      en: `My name is Jasna. In Macedonian, jasna means clear, and nota is a note. Together: a clear note. Split differently: jas + nota, I + a note.

Jasnota is where I write about feelings through sound, and about sound through feelings. Psychology you can hear, one idea per post.

Monday, Wednesday and Friday at 20:30. English first, Macedonian always.`,
      mk: `Се викам Јасна. Јасна нота е чист, бистар тон. А поделено поинаку: јас + нота.

Јаснота е место каде што пишувам за чувствата преку звукот, и за звукот преку чувствата. Психологија што се слуша, по една мисла во објава.

Понеделник, среда и петок во 20:30. Прво на англиски, секогаш и на македонски.`
    },
    tags: ['jasnota', 'јаснота', 'musicpsychology', 'psychologyofmusic', 'bitola'],
    audio: '—',
    notes: 'Publish first, at 20:20. The three launch posts go up five minutes apart so the first row is complete by 20:30.'
  },

  /* ---------------- 2 ---------------- */
  {
    id: 'p02', n: 2, date: '2026-11-02', time: '20:25', fmt: 'carousel', pillar: 'about', bar: 'I', b: 2, g: 'a',
    title: { en: 'I’m Jasna', mk: 'Јас сум Јасна' },
    goal: ['follows', 'trust', 'profile visits'],
    why: 'The introduction carousel. Type-led cover (group of two = words); the face appears once, on slide 2.',
    usertags: ['chamber_orchestra_diva (slide 4)'],
    photos: ['portrait', 'stage'],
    slides: [
      { alt: 'Black slide. Large serif text: I’m Jasna. Below, three small lines: psychologist, Gestalt counsellor, vocal artist with Orchestra DIVA.',
        html: '<div class="pc">' + h.row(h.mark(7), h.meta('1/7')) + '<div class="push">' + h.q('I’m <em>Jasna.</em>', 'l') +
          '<ul class="roles"><li>psychologist</li><li>Gestalt counsellor</li><li>vocal artist, Orchestra DIVA</li></ul></div></div>' },
      { alt: 'Photo: Jasna in profile, lit only from behind so the edge of her face glows against a black room. Text: Jasna Dimitrovska. Bitola, Macedonia.',
        html: h.ph('rim', 'portrait') + '<div class="pc on-photo"><p class="meta" style="text-align:right">02/07</p><div class="push">' + h.q('Jasna <em>Dimitrovska</em>', 's') + h.meta('Bitola, Macedonia', 'margin-top:3cqi') + '</div></div>' },
      { alt: 'Black slide. Text: I’m a psychologist, and a Gestalt counsellor. Gestalt work pays attention to what is happening now: in the body, in the voice, between two people.',
        html: '<div class="pc"><p class="meta" style="text-align:right">03/07</p>' + h.q('I’m a <em>psychologist</em>', 's', 'margin-top:12cqi') +
          h.body('and a Gestalt counsellor. Gestalt work pays attention to what is happening now: in the body, in the voice, between two people.', 'margin-top:5cqi') + h.meta('psychology', 'margin-top:auto') + '</div>' },
      { alt: 'Photo: Jasna singing on stage with Orchestra DIVA, from the side, in stage light. Text: And I sing. Vocalist with Orchestra DIVA, Bitola.',
        html: h.ph('stage', 'stage') + '<div class="pc on-photo"><p class="meta" style="text-align:right">04/07</p><div class="push">' + h.q('And I <em>sing.</em>', 's') + h.body('Vocalist with Orchestra DIVA, Bitola.', 'margin-top:3cqi') + h.meta('@chamber_orchestra_diva', 'margin-top:4cqi') + '</div></div>' },
      { alt: 'Black slide. Text: I also do research. In 2024 I co-authored a study on perfectionism, self-esteem and impostor feelings among gifted students.',
        html: '<div class="pc"><p class="meta" style="text-align:right">05/07</p>' + h.q('I also do <em>research.</em>', 's', 'margin-top:12cqi') +
          h.body('In 2024 I co-authored a study on perfectionism, self-esteem and impostor feelings among gifted students.', 'margin-top:5cqi') + h.meta('International Slavic University · 2024', 'margin-top:auto') + '</div>' },
      { alt: 'Black slide. Text: Jasnota is psychology you can hear. Feelings through sound, sound through feelings, one idea per post. Below: It isn’t therapy. I don’t diagnose here, and I don’t offer sessions.',
        html: '<div class="pc"><p class="meta" style="text-align:right">06/07</p>' + h.q('Jasnota is psychology you can <em>hear.</em>', 's', 'margin-top:12cqi') +
          h.body('Feelings through sound. Sound through feelings. One idea per post.', 'margin-top:5cqi') +
          '<p class="body" style="margin-top:auto;max-width:34ch">It isn’t therapy. I don’t diagnose here, and I don’t offer sessions.</p></div>' },
      { alt: 'Black slide. Large serif text: To hear yourself. Below, in Macedonian: Да се слушнеш себеси. Footer: Monday, Wednesday, Friday at 20:30, and the mark.',
        html: '<div class="pc"><p class="meta" style="text-align:right">07/07</p><div class="push">' + h.q('To hear <em>yourself.</em>', 'l') + h.mk('Да се слушнеш себеси.', 'margin-top:3cqi') + '</div>' +
          h.row(h.meta('Mon · Wed · Fri, 20:30'), h.mark(6), 'margin-top:7cqi') + '</div>' }
    ],
    caption: {
      en: `I’m Jasna Dimitrovska. I’m a psychologist and a Gestalt counsellor, and I sing with Orchestra DIVA in Bitola (@chamber_orchestra_diva).

For years these were three separate rooms in my life. Jasnota is the door between them: what psychology knows about feelings, heard through music, and what music knows about us.

What you’ll find here: short explainers I call Psycho-notes, a song each week, journal entries on jasnota.mk, and posts that ask for nothing but a minute of quiet.

What you won’t find: diagnoses, quick fixes or therapy. I explain; I don’t treat.`,
      mk: `Јас сум Јасна Димитровска. Психолог сум и гешталт советник, и пеам со Оркестарот DIVA од Битола.

Со години ова беа три одделни соби во мојот живот. Јаснота е вратата меѓу нив: она што психологијата го знае за чувствата, слушнато преку музиката, и она што музиката го знае за нас.

Тука ќе најдеш кратки објаснувања што ги викам Психо-ноти, по една песна секоја недела, текстови на jasnota.mk и објави што не бараат ништо освен една минута тишина.

Тука нема да најдеш дијагнози, брзи решенија ни терапија. Објаснувам, не лекувам.`
    },
    tags: ['jasnota', 'psychologist', 'gestalt', 'vocalartist', 'bitola', 'психолог', 'битола'],
    audio: '—',
    notes: 'Tag @chamber_orchestra_diva on slide 4. Pin from week 2.'
  },

  /* ---------------- 3 ---------------- */
  {
    id: 'p03', n: 3, date: '2026-11-02', time: '20:30', fmt: 'reel', pillar: 'rest', bar: 'I', b: 3, g: 'b',
    title: { en: 'Breathing in 7/8', mk: 'Дишење во 7/8' },
    goal: ['shares', 'saves', 'site visits'],
    why: 'Something to do, not just read. The meter itself is the graphic; one cinnabar dot marks the long beat.',
    link: { path: 'website/journal/breathing-in-7-8/', label: 'jasnota.mk/journal/breathing-in-7-8' },
    photos: ['hands'],
    cover: {
      alt: 'Reel cover, black. Large serif text: Breathing in 7/8, with the Macedonian title below. Seven dots grouped two, two, three, labelled in for two, hold for two, out for three; the long beat is marked with one red dot.',
      html: '<div class="pc">' + h.q('Breathing<br>in <em>7/8</em>', 'l', 'padding-right:8cqi') + h.mk('Дишење во 7/8', 'margin-top:3cqi') +
        '<div class="push">' + h.b78(['in · 2', 'hold · 2', 'out · 3']) + '</div></div>'
    },
    reel: {
      length: '35 s', split: '10 + 10 + 15',
      audio: 'Jasna’s own voice counting, taken from the 07:08 recording (journal 04), and a soft click on each beat. No music.',
      shots: [
        { t: '00–03', shot: 'Title card on black.', sound: 'Room tone.', os: { en: 'Breathing in 7/8', mk: 'Дишење во 7/8' }, art: '<div class="ph dotbreath" aria-hidden="true"><span></span></div>' },
        { t: '03–10', shot: 'A single bone-white dot in the centre grows on “in” (2 beats), holds (2), shrinks over 3.', sound: 'Her voice: “in, two — hold, two — out, two, three.”', os: { en: 'In for two. Hold for two. Out for three.', mk: 'Вдиши на два. Задржи на два. Издиши на три.' }, art: '<div class="ph dotbreath big" aria-hidden="true"><span></span></div>' },
        { t: '10–20', shot: 'Her hands resting on her knees, low-key side light, a slow rise and fall. Locked off.', sound: 'Voice counts bars two and three, quieter.', os: { en: 'The long out-breath tells the body it can slow down.', mk: 'Долгиот издишок му кажува на телото дека може да забави.' }, ph: 'mic', slot: 'hands' },
        { t: '20–35', shot: 'Back to the dot. Two bars with clicks only, no voice. Fade to black at 33 s.', sound: 'Clicks, then 2 s of silence.', os: { en: 'The full seven minutes: jasnota.mk', mk: 'Целата снимка: jasnota.mk' }, art: '<div class="ph dotbreath" aria-hidden="true"><span></span></div>' }
      ]
    },
    caption: {
      en: `In for two. Hold for two. Out for three.

That’s 7/8, the uneven meter of a lot of Macedonian music, and the exercise I do before every performance. The out-breath is the longest part of the bar, which leans the whole rhythm towards rest.

Try three bars now. If counting makes you dizzy or more anxious, stop and breathe normally.

The full recording, seven minutes and eight seconds of just my voice, is on jasnota.mk (link in bio).`,
      mk: `Вдиши на два. Задржи на два. Издиши на три.

Тоа е 7/8, нерамниот такт на многу македонски песни, и вежбата што ја правам пред секој настап. Издишувањето е најдолгиот дел од тактот, па целиот ритам се навалува кон одмор.

Пробај три такта сега. Ако броењето ти предизвика вртоглавица или вознемиреност, престани и диши нормално.

Целата снимка, седум минути и осум секунди само со мојот глас, е на jasnota.mk (линкот е во био).`
    },
    tags: ['jasnota', 'breathing', 'macedonianmusic', 'performanceanxiety', 'дишење'],
    notes: 'Last of the three launch posts, 20:30. Pin from week 3.'
  },

  /* ---------------- 4 ---------------- */
  {
    id: 'p04', n: 4, date: '2026-11-04', time: '20:30', fmt: 'carousel', pillar: 'psycho', bar: 'I', b: 4, g: 'b',
    title: { en: 'Psycho-note №01 — Attunement', mk: 'Психо-нота №01 — Усогласување' },
    goal: ['saves', 'site visits'],
    why: 'Opens the Psycho-note series with the idea behind the mark itself. Same frame every time: mark, term, italic analogy.',
    link: { path: 'website/journal/tuning-fork-on-attunement/', label: 'jasnota.mk/journal/tuning-fork-on-attunement' },
    slides: [
      { alt: 'Black slide. The tuning-fork mark top left. Large serif word: Attunement. In italic below: one tuning fork answering another. Footnote: Psycho-note number 01.',
        html: '<div class="pc">' + h.row(h.mark(7), h.meta('1/7')) + '<div class="push">' + h.q('Attunement', '', 'font-size:13cqi') +
          h.q('<em>one tuning fork answering another</em>', 'xs', 'margin-top:2cqi;color:var(--ash)') + h.meta('Psycho-note №01', 'margin-top:6cqi') + '</div></div>' },
      { alt: 'Line drawing of two tuning forks with dotted arcs between them. Text: Strike one fork, then silence it. A second fork of the same pitch, nearby, keeps singing. Nobody touched it.',
        html: '<div class="pc"><p class="meta" style="text-align:right">02/07</p><div style="margin-top:6cqi;color:var(--bone)">' + h.forks() + '</div>' +
          h.q('Strike one fork, then <em>silence</em> it.', 's', 'margin-top:auto') +
          h.body('A second fork of the same pitch, standing nearby, keeps singing. Nobody touched it. This is called sympathetic resonance.', 'margin-top:4cqi') + '</div>' },
      { alt: 'Text: In people, it’s called attunement. The psychiatrist Daniel Stern described it in 1985: a parent answers a baby’s excited banging with the voice, in the same tempo. Different channel, same shape.',
        html: '<div class="pc"><p class="meta" style="text-align:right">03/07</p>' + h.q('In people, it’s called <em>attunement.</em>', 's', 'margin-top:12cqi') +
          h.body('The psychiatrist Daniel Stern described it in 1985. A baby bangs a toy in a quick, uneven rhythm; the parent answers with the voice, <em>ye-es, ye-es</em>, in the same tempo. Different channel, same shape.', 'margin-top:5cqi') +
          h.meta('Stern, The Interpersonal World of the Infant, 1985', 'margin-top:auto') + '</div>' },
      { alt: 'Two lines of serif text. Imitation says: I saw what you did. Attunement says: I feel how it is for you.',
        html: '<div class="pc"><p class="meta" style="text-align:right">04/07</p><div class="push">' +
          h.q('Imitation says: <em>I saw what you did.</em>', 's', 'color:var(--ash)') + h.q('Attunement says: <em>I feel how it is for you.</em>', 's', 'margin-top:6cqi') + '</div></div>' },
      { alt: 'Text: Falling out of tune is normal. Watching ordinary families, researcher Edward Tronick saw parents and babies lose sync all the time. What mattered was finding each other again: rupture and repair.',
        html: '<div class="pc"><p class="meta" style="text-align:right">05/07</p>' + h.q('Falling out of tune is <em>normal.</em>', 's', 'margin-top:12cqi') +
          h.body('Watching ordinary families, the researcher Edward Tronick saw parents and babies lose sync all the time. What mattered was finding each other again. Psychology calls it rupture and repair.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Text: Try it tonight. When someone tells you something that matters to them, listen for their tempo before you answer. Then answer in it.',
        html: '<div class="pc"><p class="meta" style="text-align:right">06/07</p>' + h.q('Try it <em>tonight.</em>', 's', 'margin-top:12cqi') +
          h.body('When someone tells you something that matters to them, listen for their tempo before you answer. Then answer in it: slower if they are slow, quiet if they are quiet.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Closing slide. Large mark. Text: Being attuned doesn’t mean never falling out of tune. It means finding each other again. Footnotes: essay on jasnota.mk; this explains, it isn’t therapy.',
        html: '<div class="pc">' + h.mark(12) + h.q('Being attuned doesn’t mean never falling out of tune. It means finding each other <em>again.</em>', 's', 'margin-top:auto') +
          h.row(h.meta('Essay · jasnota.mk/journal'), h.meta('Explains. Not therapy.'), 'margin-top:7cqi') + '</div>' }
    ],
    caption: {
      en: `Psycho-note №01 — Attunement.

The mark of Jasnota is a tuning fork, drawn so it reads as Ψ. This is why.

Strike one tuning fork, silence it with your hand, and a second fork of the same pitch nearby keeps singing. In people, the psychiatrist Daniel Stern called this affect attunement: answering someone’s feeling in its own tempo and intensity, rather than copying it.

The full essay, Tuning fork: on attunement, is on jasnota.mk. Save this for the next time someone needs you to listen.

${NT}`,
      mk: `Психо-нота №01 — Усогласување.

Знакот на Јаснота е камертон, нацртан така што се чита како Ψ. Еве зошто.

Удри еден камертон, стишај го со дланка, и вториот камертон со ист тон до него продолжува да ѕвони. Кај луѓето, психијатарот Даниел Стерн ова го нарече афективно усогласување: да одговориш на нечие чувство во неговото темпо и јачина, наместо да го копираш.

Целиот текст, Камертон: за усогласувањето, е на jasnota.mk. Зачувај ја објавава за следниот пат кога некому ќе му треба да го слушнеш.

${NTmk}`
    },
    tags: ['jasnota', 'psychonote', 'attunement', 'developmentalpsychology', 'musicandpsychology', 'психологија'],
    audio: '—'
  },

  /* ---------------- 5 ---------------- */
  {
    id: 'p05', n: 5, date: '2026-11-06', time: '20:30', fmt: 'reel', pillar: 'sound', bar: 'I', b: 5, g: 'c',
    title: { en: 'Ten minutes before', mk: 'Десет минути пред' },
    goal: ['reach', 'follows'],
    why: 'First image of the long group. Backstage with Orchestra DIVA: a door of light, nothing staged.',
    link: { path: 'website/journal/stage-fright/', label: 'jasnota.mk/journal/stage-fright' },
    usertags: ['chamber_orchestra_diva'],
    photos: ['extra-01'],
    cover: {
      alt: 'Reel cover: a dark backstage corridor, a stage door ajar with a thin vertical line of light. Text low in the frame: Ten minutes before. Footnote: Orchestra DIVA, backstage.',
      html: h.ph('slit', 'extra-01') + '<div class="pc on-photo"><div class="push">' + h.q('Ten minutes <em>before.</em>', 's') + '</div>' +
        h.row(h.meta('Orchestra DIVA · backstage'), h.meta('00:28'), 'margin-top:5cqi') + '</div>'
    },
    reel: {
      length: '28 s', split: '8 + 8 + 12',
      audio: 'Original sound recorded backstage: the orchestra tuning behind the door, footsteps, her breath. No added music. Film with the orchestra’s permission.',
      shots: [
        { t: '00–08', shot: 'Backstage corridor, stage door ajar, a line of light. Her hands, cold, rubbed together in close-up.', sound: 'Orchestra tuning, muffled through the door.', os: { en: 'Ten minutes before I sing, my hands go cold.', mk: 'Десет минути пред да запеам, рацете ми се ладат.' }, ph: 'slit', slot: 'extra-01' },
        { t: '08–16', shot: 'Close on her collarbone and breath riding high; her hand comes to rest on her sternum.', sound: 'Breath, the tuning A held long.', os: { en: 'Fear and excitement share one heartbeat.', mk: 'Стравот и возбудата делат исто чукање на срцето.' }, ph: 'rim' },
        { t: '16–28', shot: 'She walks to the stage door; the camera stays in the corridor as she goes through into the light, back to camera. The door closes. Hold 2 s.', sound: 'Applause swells, door shuts, near-silence.', os: { en: 'I don’t tell myself to calm down. I say: I’m excited.', mk: 'Не си велам да се смирам. Си велам: возбудена сум.' }, ph: 'slit', slot: 'extra-01' }
      ]
    },
    caption: {
      en: `Ten minutes before a concert with Orchestra DIVA. Cold hands, dry mouth, a heart that has started the song a few bars early.

I have stage fright before every performance. Studying psychology didn’t take it away, but it changed what I think it is: the same racing heart can be read as fear, or as excitement. In 2014 the researcher Alison Wood Brooks found that people who told themselves “I’m excited” before singing karaoke sang more accurately than those who tried to calm down.

So that’s what I say in the corridor. Some nights it feels like a lie. I say it anyway.

The essay, Stage fright: when your body sings before you do, is on jasnota.mk. Filmed backstage with @chamber_orchestra_diva.`,
      mk: `Десет минути пред концерт со Оркестарот DIVA. Ладни раце, сува уста, срце што ја почнало песната неколку такта порано.

Имам трема пред секој настап. Психологијата не ми ја одзеде, но го смени она што мислам дека е: истото забрзано срце може да се прочита како страв или како возбуда. Во 2014 година истражувачката Алисон Вуд Брукс покажала дека луѓето што пред караоке си рекле „возбуден/а сум“ пееле попрецизно од оние што се обидувале да се смират.

Тоа го велам и јас во ходникот. Некои вечери звучи како лага. Сепак го велам.

Текстот Трема: кога телото запее пред тебе е на jasnota.mk.`
    },
    tags: ['jasnota', 'stagefright', 'performanceanxiety', 'orchestradiva', 'трема', 'битола']
  },

  /* ---------------- 6 ---------------- */
  {
    id: 'p06', n: 6, date: '2026-11-09', time: '20:30', fmt: 'single', pillar: 'rest', bar: 'I', b: 6, g: 'c',
    title: { en: 'Bitola, 21:40', mk: 'Битола, 21:40' },
    goal: ['comments', 'follows'],
    why: 'Image only, location as a footnote. Roots, quietly: where she lives and sings.',
    location: 'Bitola, Macedonia',
    photos: ['bitola'],
    slides: [{
      alt: 'Photo: Širok Sokak in Bitola at night after the shops have closed, street lamps receding as points of light, almost nobody on the street. Small text: Bitola, Širok Sokak, 21:40.',
      html: h.ph('street', 'bitola', '<span class="lamps"></span><span class="tower"></span>') + '<div class="pc"><p class="meta push">Bitola · Širok Sokak · 21:40</p></div>'
    }],
    caption: {
      en: `Bitola on a weeknight, after the shops on Širok Sokak have closed.

This is where I live and sing. I like the street best at this hour, when you can hear your own steps, and sometimes someone practising behind a window.

Where do you go when you need to hear yourself think?`,
      mk: `Битола, обична вечер, откако ќе се затворат дуќаните на Широк сокак.

Тука живеам и пеам. Улицата најмногу ја сакам во овој час, кога ги слушаш сопствените чекори, а понекогаш и некого што вежба зад некој прозорец.

Каде одиш кога ти треба да си ги слушнеш мислите?`
    },
    tags: ['jasnota', 'bitola', 'битола', 'northmacedonia', 'широксокак'],
    audio: '—'
  },

  /* ---------------- 7 ---------------- */
  {
    id: 'p07', n: 7, date: '2026-11-11', time: '20:30', fmt: 'carousel', pillar: 'songs', bar: 'I', b: 7, g: 'c',
    title: { en: 'Why sad songs make us calmer', mk: 'Зошто тажните песни нè смируваат' },
    goal: ['saves', 'comments', 'site visits'],
    why: 'Journal 02, retold in eight slides. Vinyl bleeds off the cover; the cinnabar label dot is the only colour in bar I.',
    link: { path: 'website/journal/why-sad-songs-make-us-calmer/', label: 'jasnota.mk/journal/why-sad-songs-make-us-calmer' },
    photos: ['extra-02'],
    slides: [
      { alt: 'Photo: a record on a turntable, cropped so it bleeds off the top right, one small red label dot. Text: Why sad songs make us calmer.',
        html: h.ph('vinyl', 'extra-02', '<div class="disc"></div>') + '<div class="pc on-photo"><div class="push">' + h.q('Why sad songs make us <em>calmer</em>', 's') + '</div>' + h.row(h.meta('Journal 02'), h.meta('1/8'), 'margin-top:4cqi') + '</div>' },
      { alt: 'Text: Not happier. Calmer. When I’m sad, I don’t reach for cheerful music. I reach for the saddest song I know.',
        html: '<div class="pc"><p class="meta" style="text-align:right">02/08</p>' + h.q('Not happier. <em>Calmer.</em>', 's', 'margin-top:12cqi') +
          h.body('When I’m sad, I don’t reach for cheerful music. I reach for the saddest song I know. For years I thought that said something bad about me.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Text: A sad song speaks in a sad voice. Slower tempo, lower pitch, softer touch, falling phrases. Music and speech use much the same code for emotion. Source: Juslin and Laukka, 2003.',
        html: '<div class="pc"><p class="meta" style="text-align:right">03/08</p>' + h.q('A sad song speaks in a sad <em>voice.</em>', 's', 'margin-top:12cqi') +
          h.body('Slower tempo, lower pitch, softer touch, phrases that fall. Reviewing over a hundred studies, Patrik Juslin and Petri Laukka found that music and speech use much the same code for emotion.', 'margin-top:5cqi') + h.meta('Juslin & Laukka, 2003', 'margin-top:auto') + '</div>' },
      { alt: 'Text: In music, sadness is safe. Listeners heard sad music as sad but felt it as less sad, often as tender. Source: Kawakami and colleagues, 2013.',
        html: '<div class="pc"><p class="meta" style="text-align:right">04/08</p>' + h.q('In music, sadness is <em>safe.</em>', 's', 'margin-top:12cqi') +
          h.body('In a study by Ai Kawakami and colleagues, listeners heard sad music as sad, but felt it as less sad, and often as tender. The feeling arrives without a real loss.', 'margin-top:5cqi') + h.meta('Kawakami et al., 2013', 'margin-top:auto') + '</div>' },
      { alt: 'A single large line of serif text: Sadness in a song is sadness with an ending.',
        html: '<div class="pc"><p class="meta" style="text-align:right">05/08</p><div class="push">' + h.q('Sadness in a song is sadness with an <em>ending.</em>', '', 'font-size:11cqi') + '</div>' + h.meta('a song has a last chord', 'margin-top:7cqi') + '</div>' },
      { alt: 'Text: It is rarely only sad. People often named nostalgia, peacefulness and tenderness. Source: Taruffi and Koelsch, 2014.',
        html: '<div class="pc"><p class="meta" style="text-align:right">06/08</p>' + h.q('It is rarely <em>only</em> sad.', 's', 'margin-top:12cqi') +
          h.body('Asked what sad music made them feel, people in a large survey by Liila Taruffi and Stefan Koelsch often named nostalgia, peacefulness and tenderness.', 'margin-top:5cqi') + h.meta('Taruffi & Koelsch, 2014', 'margin-top:auto') + '</div>' },
      { alt: 'Text: Sometimes it isn’t helping. For people who tend to ruminate, sad music can become a loop rather than a release. Ask: is this song holding my sadness, or keeping it?',
        html: '<div class="pc"><p class="meta" style="text-align:right">07/08</p>' + h.q('Sometimes it isn’t <em>helping.</em>', 's', 'margin-top:12cqi') +
          h.body('For people who tend to ruminate, sad music can become a loop rather than a release. A quiet question: is this song holding my sadness, or keeping it?', 'margin-top:5cqi') + h.meta('Garrido & Schubert', 'margin-top:auto') + '</div>' },
      { alt: 'Closing slide. Text: Which song do you play when you need to be sad properly? Tell me in the comments. Footnote: Journal 02, five minutes, and the mark.',
        html: '<div class="pc"><p class="meta" style="text-align:right">08/08</p><div class="push">' + h.q('Which song do you play when you need to be sad <em>properly?</em>', 's') +
          h.body('Tell me in the comments. The full essay is on jasnota.mk.', 'margin-top:4cqi') + '</div>' + h.row(h.meta('Journal 02 · 5 min'), h.mark(6), 'margin-top:7cqi') + '</div>' }
    ],
    caption: {
      en: `Why do we choose sad songs when we’re already sad?

Part of it is the sound: a sad song speaks in something very close to a sad human voice. Part of it is safety: in music, sadness arrives without a real loss, and it has a last chord. And part of it is company.

But not always. If a song keeps you circling the same thought, it may be keeping your sadness rather than holding it. Worth noticing.

Eight slides, four studies, one question at the end. The full essay is on jasnota.mk.

Tell me the song you play when you need to be sad properly. I’ll read every one.`,
      mk: `Зошто избираме тажни песни кога веќе сме тажни?

Дел од одговорот е во звукот: тажната песна зборува со нешто многу блиску до тажен човечки глас. Дел е во безбедноста: во музиката тагата доаѓа без вистинска загуба, и има последен акорд. А дел е во друштвото.

Но не секогаш. Ако една песна те врти во круг околу истата мисла, можеби не ја држи твојата тага, туку ја задржува. Вреди да се забележи.

Осум слајда, четири истражувања, едно прашање на крајот. Целиот текст е на jasnota.mk.

Кажи ми која песна ја пушташ кога ти треба да бидеш тажен или тажна како што треба. Ќе ги прочитам сите.`
    },
    tags: ['jasnota', 'musicpsychology', 'sadsongs', 'musicandemotion', 'психологија', 'музика'],
    audio: '—'
  },

  /* ---------------- 8 ---------------- */
  {
    id: 'p08', n: 8, date: '2026-11-13', time: '20:30', fmt: 'reel', pillar: 'sound', light: true, bar: 'II', b: 1, g: 'a',
    title: { en: 'One note — with Orchestra DIVA', mk: 'Една нота — со Оркестарот DIVA' },
    goal: ['reach', 'follows', 'collab audience'],
    collab: 'chamber_orchestra_diva',
    why: 'Downbeat of bar II, on paper, one column to the right. A Collab post: it appears on both profiles and shares one set of likes and comments.',
    link: { path: 'website/journal/tuning-fork-on-attunement/', label: 'jasnota.mk/journal/tuning-fork-on-attunement' },
    photos: ['extra-05'],
    cover: {
      light: true,
      alt: 'Reel cover on off-white. A very large italic serif letter A. Below: Before every concert, everyone listens for one note. Footnote: 440 Hz, Jasnota with Orchestra DIVA.',
      html: '<div class="pc">' + h.row(h.meta('with Orchestra DIVA'), h.meta('00:35')) +
        '<p class="q" style="font-size:54cqi;line-height:.78;margin-top:auto;letter-spacing:-.04em"><em>A</em></p>' +
        h.q('Before every concert, everyone listens for one <em>note.</em>', 'xs', 'margin-top:4cqi') + h.meta('440 Hz · Jasnota × DIVA', 'margin-top:5cqi') + '</div>'
    },
    reel: {
      length: '35 s', split: '10 + 10 + 15',
      audio: 'Original sound: the orchestra tuning, recorded live at a DIVA rehearsal or before a concert, with permission. No repertoire, so no composition rights are involved.',
      shots: [
        { t: '00–10', shot: 'Wide from the back of the stage: musicians seated, chatter. The oboe (or the concertmaster) gives the A; the room quiets.', sound: 'Chatter fades into a single A.', os: { en: 'Before every concert, everyone listens for one note.', mk: 'Пред секој концерт, сите слушаат една нота.' }, ph: 'stands', slot: 'extra-05' },
        { t: '10–20', shot: 'Close-ups, one beat each: a violinist’s ear tilted to the strings, fingers on a peg, a cello bow, Jasna humming the A under her breath.', sound: 'The A spreads through the sections.', os: { en: 'Nobody plays the same instrument. Everyone finds the same pitch.', mk: 'Никој не свири на ист инструмент. Сите го наоѓаат истиот тон.' }, ph: 'strings' },
        { t: '20–35', shot: 'Wide again: the tuning settles into one sustained sound. The conductor lifts both hands. Two seconds of silence. Cut to black, end card.', sound: 'Settled A, then silence.', os: { en: 'That’s attunement. Not sounding the same — finding each other.', mk: 'Тоа е усогласување. Не да звучиме исто, туку да се најдеме.' }, ph: 'stands', slot: 'extra-05' }
      ]
    },
    caption: {
      en: `Before every concert, the orchestra stops and listens for one note: A, usually tuned to around 440 vibrations a second. The oboe gives it, or the concertmaster, and then every instrument in the room finds it in its own voice.

I’ve stood inside that sound for years with Orchestra DIVA and only lately noticed what it is. It’s attunement, the thing psychology describes when one person tunes in to another. Nobody has to sound the same. They just have to find each other.

A collaboration with @chamber_orchestra_diva. Their next concerts are on their profile.`,
      mk: `Пред секој концерт оркестарот застанува и слуша една нота: А, обично наштимано на околу 440 треперења во секунда. Ја дава обоата или концертмајсторот, а потоа секој инструмент во салата ја наоѓа со својот глас.

Со години стојам во тој звук со Оркестарот DIVA и дури неодамна сфатив што е тоа. Усогласување, она што психологијата го опишува кога еден човек се наштимува на друг. Никој не мора да звучи исто. Само треба да се најдат.

Соработка со @chamber_orchestra_diva. Нивните следни концерти се на нивниот профил.`
    },
    tags: ['jasnota', 'orchestradiva', 'chamberorchestra', 'attunement', 'bitola', 'оркестар'],
    notes: 'Send the Collab invite to @chamber_orchestra_diva when publishing; agree the caption and the cut with them by Wed 11 Nov.'
  },

  /* ---------------- 9 ---------------- */
  {
    id: 'p09', n: 9, date: '2026-11-16', time: '20:30', fmt: 'single', pillar: 'sound', bar: 'II', b: 2, g: 'a',
    title: { en: 'A wrong note is not a wrong person', mk: 'Погрешна нота не е погрешен човек' },
    goal: ['shares', 'saves'],
    why: 'One line, one staff. The displaced note is the only cinnabar in bar II.',
    link: { path: 'website/journal/the-voice-i-used-to-hide/', label: 'jasnota.mk/journal/the-voice-i-used-to-hide' },
    slides: [{
      alt: 'Black square. Serif text: A wrong note is not a wrong person. Below, a thin five-line staff with five notes climbing; the fifth note sits too low and is the only red mark.',
      html: '<div class="pc">' + h.q('A wrong note is not a wrong <em>person.</em>', '', 'font-size:11cqi;padding-right:6cqi') +
        '<div class="push"><svg class="g" viewBox="0 0 200 60" aria-hidden="true"><g class="stroke" stroke-width=".7" style="color:#3a3a3f"><path d="M0 10H200M0 18H200M0 26H200M0 34H200M0 42H200"/></g>' +
        '<g fill="currentColor"><ellipse cx="26" cy="46" rx="5" ry="3.6" transform="rotate(-20 26 46)"/><ellipse cx="62" cy="38" rx="5" ry="3.6" transform="rotate(-20 62 38)"/><ellipse cx="98" cy="30" rx="5" ry="3.6" transform="rotate(-20 98 30)"/><ellipse cx="134" cy="22" rx="5" ry="3.6" transform="rotate(-20 134 22)"/></g>' +
        '<g class="stroke" stroke-width="1"><path d="M30.6 45V20M66.6 37V12M102.6 29V4M138.6 21V-4"/></g>' +
        '<ellipse cx="170" cy="34" rx="5" ry="3.6" transform="rotate(-20 170 34)" fill="#b4452c"/><path d="M174.6 33V8" stroke="#b4452c" stroke-width="1"/></svg>' +
        h.row(h.meta('♩ = 60'), h.meta('jasnota'), 'margin-top:6cqi') + '</div></div>'
    }],
    caption: {
      en: `Guilt says: I did something wrong. Shame says: I am wrong.

Musicians know the difference in their bodies. A missed note lasts a fraction of a second; the shame after it can last the whole concert. It takes hold of the person, not just the mistake.

If you played a wrong note somewhere this week, at work, in a conversation, on an actual stage: it was a note. It wasn’t you.

More on shame and the voice in my first journal entry, The voice I used to hide, on jasnota.mk.`,
      mk: `Вината вели: направив нешто погрешно. Срамот вели: јас сум погрешен.

Музичарите ја чувствуваат разликата во телото. Промашената нота трае дел од секунда; срамот потоа може да трае цел концерт. Го зафаќа целиот човек, не само грешката.

Ако оваа недела отсвири погрешна нота некаде, на работа, во разговор, на вистинска сцена: тоа беше нота. Не беше ти.

Повеќе за срамот и гласот во мојот прв текст, Гласот што го криев, на jasnota.mk.`
    },
    tags: ['jasnota', 'shame', 'perfectionism', 'musicians', 'срам'],
    audio: '—'
  },

  /* ---------------- 10 ---------------- */
  {
    id: 'p10', n: 10, date: '2026-11-18', time: '20:30', fmt: 'carousel', pillar: 'psycho', bar: 'II', b: 3, g: 'b',
    title: { en: 'Psycho-note №02 — The impostor feeling', mk: 'Психо-нота №02 — Чувството на измамник' },
    goal: ['saves', 'shares'],
    why: 'The research-linked post. General, well-established psychology only; the 2024 study is credited, its findings are not stated.',
    slides: [
      { alt: 'Black slide, mark top left. Large serif text: The impostor feeling. Italic below: playing the part, waiting to be found out. Footnote: Psycho-note number 02.',
        html: '<div class="pc">' + h.row(h.mark(7), h.meta('1/8')) + '<div class="push">' + h.q('The impostor <em>feeling</em>', '', 'font-size:12.5cqi') +
          h.q('<em>playing the part, waiting to be found out</em>', 'xs', 'margin-top:2cqi;color:var(--ash)') + h.meta('Psycho-note №02', 'margin-top:6cqi') + '</div></div>' },
      { alt: 'Text in quotation marks: Soon they’ll realise I don’t really know what I’m doing. Below: If you’ve had this thought after a success, not before a failure, you’re in large company.',
        html: '<div class="pc"><p class="meta" style="text-align:right">02/08</p>' + h.q('“Soon they’ll realise I don’t really <em>know</em> what I’m doing.”', 's', 'margin-top:12cqi') +
          h.body('If you’ve had this thought after a success, not before a failure, you’re in large company.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Text: It has a name. In 1978 Pauline Clance and Suzanne Imes described the impostor phenomenon: a lasting sense of being a fraud despite clear evidence of competence.',
        html: '<div class="pc"><p class="meta" style="text-align:right">03/08</p>' + h.q('It has a <em>name.</em>', 's', 'margin-top:12cqi') +
          h.body('In 1978 the psychologists Pauline Clance and Suzanne Imes described the impostor phenomenon: a lasting sense of being a fraud, despite clear evidence of competence.', 'margin-top:5cqi') + h.meta('Clance & Imes, 1978', 'margin-top:auto') + '</div>' },
      { alt: 'Text: It isn’t a diagnosis. You won’t find it in diagnostic manuals. It is a pattern of thinking and feeling, common among high achievers and people starting something new.',
        html: '<div class="pc"><p class="meta" style="text-align:right">04/08</p>' + h.q('It isn’t a <em>diagnosis.</em>', 's', 'margin-top:12cqi') +
          h.body('You won’t find it in diagnostic manuals. It is a pattern of thinking and feeling, common among high achievers and people starting something new.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Diagram: a circle with four points. A new task. Over-prepare, or put it off. It goes well. It was luck. Then back to a new task. Text: The impostor cycle. Success doesn’t count, so the next task feels just as risky.',
        html: '<div class="pc"><p class="meta" style="text-align:right">05/08</p>' + h.q('The impostor <em>cycle</em>', 's', 'margin-top:4cqi') +
          '<svg class="g" viewBox="0 0 200 150" aria-hidden="true" style="margin-top:3cqi"><circle cx="100" cy="75" r="48" class="stroke" stroke-width=".9" stroke-dasharray="3 4" style="color:#8c8a85"/>' +
          '<g fill="currentColor"><circle cx="100" cy="27" r="2.4"/><circle cx="148" cy="75" r="2.4"/><circle cx="100" cy="123" r="2.4"/><circle cx="52" cy="75" r="2.4"/></g>' +
          '<g font-family="Onest, sans-serif" font-size="7.6" fill="currentColor" font-weight="300"><text x="100" y="17" text-anchor="middle">a new task</text><text x="156" y="72">over-prepare,</text><text x="156" y="81">or put it off</text><text x="100" y="138" text-anchor="middle">it goes well</text><text x="44" y="78" text-anchor="end"><tspan font-style="italic">“it was luck”</tspan></text></g></svg>' +
          h.body('Success doesn’t count, so the next task feels just as risky.', 'margin-top:auto') + '</div>' },
      { alt: 'Text: Its close relative: perfectionism. Researchers often separate two sides: high standards themselves, and the worry about mistakes and other people’s judgement. It is mostly the second side that hurts.',
        html: '<div class="pc"><p class="meta" style="text-align:right">06/08</p>' + h.q('Its close relative: <em>perfectionism.</em>', 's', 'margin-top:12cqi') +
          h.body('Researchers often separate two sides: high standards themselves, and the worry about mistakes and other people’s judgement. It is mostly the second side that hurts.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Text: Why this matters to me. In 2024 I co-authored a study on perfectionism, self-esteem and impostor feelings among gifted students. I’ll write about the study itself separately. This post is the general psychology.',
        html: '<div class="pc"><p class="meta" style="text-align:right">07/08</p>' + h.q('Why this matters to <em>me</em>', 's', 'margin-top:12cqi') +
          h.body('In 2024 I co-authored a study on perfectionism, self-esteem and impostor feelings among gifted students. I’ll write about the study itself separately. This post is the general psychology.', 'margin-top:5cqi') +
          h.meta('International Slavic University · 2024', 'margin-top:auto') + '</div>' },
      { alt: 'Closing slide. Text: Write down one thing you did well this week, and don’t add but. Footnotes: this is not therapy; the mark.',
        html: '<div class="pc"><p class="meta" style="text-align:right">08/08</p><div class="push">' + h.q('Write down one thing you did well this week. Don’t add <em>“but”.</em>', 's') + '</div>' +
          h.row(h.meta('Explains. Not therapy.'), h.mark(6), 'margin-top:7cqi') + '</div>' }
    ],
    caption: {
      en: `Psycho-note №02 — The impostor feeling.

The sense that you’re playing a part, and that sooner or later someone will notice. Pauline Clance and Suzanne Imes named it the impostor phenomenon in 1978. It isn’t a diagnosis; it’s a pattern, and it tends to visit people who are doing well.

It often travels with perfectionism: less the high standards themselves than the fear of mistakes and of being judged.

The topic is close to me. In 2024 I co-authored a study on perfectionism, self-esteem and impostor feelings among gifted students (International Slavic University). I’ll write about that study on its own; here, only the well-established basics.

If these feelings are making everyday life hard, a psychologist or psychotherapist can help. ${NT}`,
      mk: `Психо-нота №02 — Чувството на измамник.

Чувството дека играш улога и дека порано или подоцна некој ќе забележи. Полин Кланс и Сузан Ајмс во 1978 година го нарекоа феномен на измамник (познат и како синдром на измамник). Не е дијагноза; тоа е образец, и често ги посетува луѓето на кои добро им оди.

Често оди заедно со перфекционизмот: не толку со високите стандарди, колку со стравот од грешка и од туѓиот суд.

Темата ми е блиска. Во 2024 година бев коавторка на истражување за перфекционизмот, самопочитта и синдромот на измамник кај надарените ученици (Меѓународен славјански универзитет). За тоа истражување ќе пишувам посебно; тука се само добро познатите основи.

Ако овие чувства ти го отежнуваат секојдневието, психолог или психотерапевт може да помогне. ${NTmk}`
    },
    tags: ['jasnota', 'psychonote', 'impostorsyndrome', 'perfectionism', 'giftedstudents', 'синдромнаизмамник'],
    audio: '—'
  },

  /* ---------------- 11 ---------------- */
  {
    id: 'p11', n: 11, date: '2026-11-20', time: '20:30', fmt: 'reel', pillar: 'psycho', bar: 'II', b: 4, g: 'b',
    title: { en: 'Psycho-note №03 — Co-regulation', mk: 'Психо-нота №03 — Ко-регулација' },
    goal: ['shares', 'reach'],
    why: 'The physics demo as an explainer. Line-art cover keeps it in the word group.',
    link: { path: 'website/journal/tuning-fork-on-attunement/', label: 'jasnota.mk/journal/tuning-fork-on-attunement' },
    cover: {
      alt: 'Reel cover, black. Text: Two metronomes on one table. A line drawing of two metronomes on a shared base, their arms at different angles. Footnote: Psycho-note number 03, 28 seconds.',
      html: '<div class="pc">' + h.q('Two metronomes on one <em>table</em>', 'xs', 'padding-right:8cqi;font-size:8.6cqi') + '<div class="push">' + h.metronomes() +
        h.row(h.meta('Psycho-note №03'), h.meta('00:28'), 'margin-top:5cqi') + '</div></div>'
    },
    reel: {
      length: '28 s', split: '8 + 8 + 12',
      audio: 'Original sound only: two mechanical metronomes and room tone. No music, no voice-over.',
      shots: [
        { t: '00–08', shot: 'Top-down wide: a light wooden board resting on two empty tins, two metronomes started out of phase. One overhead lamp, black surroundings.', sound: 'Two clicking tempos, uneven.', os: { en: 'Two nervous systems.', mk: 'Два нервни системи.' }, art: '<div class="ph metro" aria-hidden="true">' + h.metronomes('position:absolute;left:12%;right:12%;width:76%;top:40%') + '</div>' },
        { t: '08–16', shot: 'Alternating close-ups of the two arms; the board sways slightly under them.', sound: 'Clicks begin to converge.', os: { en: 'When we’re close, we start to fall into step.', mk: 'Кога сме блиску, почнуваме да одиме во чекор.' }, ph: 'keys' },
        { t: '16–28', shot: 'Back to wide: perfect sync. At 24 s a hand stops both arms. Hold on stillness.', sound: 'One shared click, then silence.', os: { en: 'Co-regulation. A calm person beside you is a metronome.', mk: 'Ко-регулација. Мирниот човек до тебе е метроном.' }, art: '<div class="ph metro" aria-hidden="true">' + h.metronomes('position:absolute;left:12%;right:12%;width:76%;top:40%') + '</div>' }
      ]
    },
    caption: {
      en: `Psycho-note №03 — Co-regulation.

Put two metronomes on a board that can move, start them out of step, and wait. Soon they tick together: the board carries each one’s motion to the other.

Nervous systems do something similar. A baby can’t calm itself alone; it borrows calm from a slower heartbeat, a voice that drops, a breath that lengthens. Psychologists call this co-regulation. Adults never fully stop doing it.

Who is your steady metronome? Send this to them.

${NT}`,
      mk: `Психо-нота №03 — Ко-регулација.

Стави два метронома на даска што може да се движи, пушти ги во различен такт и почекај. Наскоро чукаат заедно: даската го пренесува движењето од едниот на другиот.

Нервните системи прават нешто слично. Бебето не може само да се смири; позајмува мир од побавно срце, од глас што се спушта, од здив што се издолжува. Психолозите тоа го викаат ко-регулација. Возрасните никогаш целосно не престануваат.

Кој е твојот мирен метроном? Испрати му го ова.

${NTmk}`
    },
    tags: ['jasnota', 'psychonote', 'coregulation', 'nervoussystem', 'metronome', 'психологија']
  },

  /* ---------------- 12 ---------------- */
  {
    id: 'p12', n: 12, date: '2026-11-23', time: '20:30', fmt: 'single', pillar: 'sound', bar: 'II', b: 5, g: 'c',
    title: { en: 'The voice I used to hide', mk: 'Гласот што го криев' },
    goal: ['site visits', 'link taps'],
    why: 'Journal 01 promotion. Long group = image: hands and a microphone in raking light.',
    link: { path: 'website/journal/the-voice-i-used-to-hide/', label: 'jasnota.mk/journal/the-voice-i-used-to-hide' },
    photos: ['hands'],
    slides: [{
      alt: 'Photo: close-up of two hands around a microphone in raking side light, the rest of the frame black. Text: The voice I used to hide. Footnote: Journal 01, four-minute read, jasnota.mk.',
      html: h.ph('mic', 'hands') + '<div class="pc on-photo"><div class="push">' + h.q('The voice I used to <em>hide</em>', 's') + '</div>' +
        h.row(h.meta('Journal 01 · 4 min read'), h.meta('jasnota.mk'), 'margin-top:5cqi') + '</div>'
    }],
    caption: {
      en: `As a child I sang everywhere: in the kitchen, in the stairwell, on the bus with my forehead against the glass. Then, somewhere around thirteen, I started singing more quietly. Then only at home. Then only in my head.

It took me years, and a psychology degree, to find the word for it. Not guilt. Shame.

The first entry in the Jasnota journal is about the voice, the spotlight no one else could see, and the day an older colleague at rehearsal told me: “Just sing. We’ll decide whether it’s good.”

Four minutes on jasnota.mk, link in bio. In English and Macedonian.`,
      mk: `Како дете пеев насекаде: во кујната, по скалите, во автобусот со челото на стаклото. А потоа, некаде околу тринаесеттата, почнав да пеам потивко. Потоа само дома. Потоа само во мојата глава.

Ми требаа години, и студии по психологија, за да го најдам зборот за тоа. Не вина. Срам.

Првиот текст во дневникот на Јаснота е за гласот, за рефлекторот што никој друг не го гледаше, и за денот кога една постара колешка на проба ми рече: „Само пеј. Ние ќе одлучиме дали е добро.“

Четири минути на jasnota.mk, линкот е во био. На англиски и на македонски.`
    },
    tags: ['jasnota', 'voice', 'shame', 'singing', 'глас', 'пеење'],
    audio: '—'
  },

  /* ---------------- 13 ---------------- */
  {
    id: 'p13', n: 13, date: '2026-11-25', time: '20:30', fmt: 'carousel', pillar: 'psycho', bar: 'II', b: 6, g: 'c',
    title: { en: 'Psycho-note №04 — The reminiscence bump', mk: 'Психо-нота №04 — Врвот на сеќавањата' },
    goal: ['comments', 'saves', 'site visits'],
    why: 'A Psycho-note that lands in the image group, so the cover is a photograph with the series frame laid over it. Slide 5 is built from story answers.',
    link: { path: 'website/journal/what-were-you-listening-to-at-seventeen/', label: 'jasnota.mk/journal/what-were-you-listening-to-at-seventeen' },
    photos: ['extra-03'],
    slides: [
      { alt: 'Photo: a cassette on a dark wooden table in side light. Text: Reminiscence bump. Italic: why seventeen keeps playing. Footnote: Psycho-note number 04.',
        html: h.ph('cassette', 'extra-03', '<span class="tape"></span>') + '<div class="pc on-photo"><p class="meta" style="text-align:right">1/7</p><div class="push">' + h.q('Reminiscence <em>bump</em>', '', 'font-size:12cqi') +
          h.q('<em>why seventeen keeps playing</em>', 'xs', 'margin-top:2cqi;color:var(--ash)') + '</div>' + h.row(h.meta('Psycho-note №04'), h.mark(6), 'margin-top:6cqi') + '</div>' },
      { alt: 'Text: Ask for your most vivid memories, and they tend to cluster in the teens and twenties. Psychologists call this the reminiscence bump.',
        html: '<div class="pc"><p class="meta" style="text-align:right">02/07</p>' + h.q('Ask for your most vivid <em>memories</em> —', 's', 'margin-top:12cqi') +
          h.body('and they tend to cluster in the same stretch of life: the teens and twenties. Psychologists have studied this since the 1980s and call it the reminiscence bump.', 'margin-top:5cqi') + h.meta('Rubin, Wetzler & Nebes, 1986', 'margin-top:auto') + '</div>' },
      { alt: 'Text: Music keeps the same calendar. Songs from our teens tend to stay more familiar and more emotional than most of what we hear later.',
        html: '<div class="pc"><p class="meta" style="text-align:right">03/07</p>' + h.q('Music keeps the same <em>calendar.</em>', 's', 'margin-top:12cqi') +
          h.body('Studies of musical memory find a similar bump: songs from our teens tend to stay more familiar, and more emotional, than most of what we hear later.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Text: Why then? Those are the years we work out who we are. Memories from that time get woven into the story we tell about ourselves.',
        html: '<div class="pc"><p class="meta" style="text-align:right">04/07</p>' + h.q('Why <em>then?</em>', 's', 'margin-top:12cqi') +
          h.body('A common explanation: those are the years we work out who we are. Memories from that time get woven into the story we tell about ourselves.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Slide of reader answers, shown as a list of placeholder lines: song and year, from the story question on 19 November, anonymous.',
        html: '<div class="pc"><p class="meta" style="text-align:right">05/07</p>' + h.q('From your <em>answers</em>', 's', 'margin-top:8cqi') +
          '<ul class="answers"><li><span>[ song ]</span><span>[ year ]</span></li><li><span>[ song ]</span><span>[ year ]</span></li><li><span>[ song ]</span><span>[ year ]</span></li><li><span>[ song ]</span><span>[ year ]</span></li><li><span>[ song ]</span><span>[ year ]</span></li></ul>' +
          h.meta('from the 19 Nov question sticker · anonymous, with permission', 'margin-top:auto') + '</div>' },
      { alt: 'Text: It isn’t only nostalgia. One of those songs can bring back a room, a smell, a person. That isn’t living in the past. It’s the past still being part of you.',
        html: '<div class="pc"><p class="meta" style="text-align:right">06/07</p>' + h.q('It isn’t <em>only</em> nostalgia.', 's', 'margin-top:12cqi') +
          h.body('One of those songs can bring back a room, a smell, a person. That isn’t living in the past. It’s the past still being part of you.', 'margin-top:5cqi') + '</div>' },
      { alt: 'Closing slide. Text: What were you listening to at seventeen? A slow conversation about it, 38 minutes, notes on jasnota.mk. Footnote: Journal 06 and the mark.',
        html: '<div class="pc"><p class="meta" style="text-align:right">07/07</p><div class="push">' + h.q('What were you listening to at <em>seventeen?</em>', 's') +
          h.body('A slow conversation about it, 38 minutes. Notes on jasnota.mk.', 'margin-top:4cqi') + '</div>' + h.row(h.meta('Journal 06'), h.mark(6), 'margin-top:7cqi') + '</div>' }
    ],
    caption: {
      en: `Psycho-note №04 — The reminiscence bump.

Ask people for the memories they hold most vividly and they cluster around the same stretch of life: the teens and twenties. The songs from those years tend to stay with us the same way, more familiar and more charged than almost anything we hear later.

One likely reason: those are the years we work out who we are, and the music gets woven into that story.

Slide 5 is your answers from last week’s story. Thank you. The conversation, What were you listening to at seventeen?, is on jasnota.mk.

So: what were you listening to at seventeen?`,
      mk: `Психо-нота №04 — Врвот на сеќавањата (reminiscence bump).

Кога луѓето ќе ги прашаш за најживите сеќавања, тие се собираат околу истиот период од животот: тинејџерските и дваесеттите години. Песните од тие години остануваат со нас на ист начин, поблиски и поемотивни од речиси сè што слушаме подоцна.

Една веројатна причина: тоа се годините кога откриваме кои сме, и музиката се вткајува во таа приказна.

Петтиот слајд се твоите одговори од сторито минатата недела. Благодарам. Разговорот Што слушаше кога имаше седумнаесет? е на jasnota.mk.

Значи: што слушаше ти кога имаше седумнаесет?`
    },
    tags: ['jasnota', 'psychonote', 'reminiscencebump', 'musicandmemory', 'nostalgia', 'музика'],
    audio: '—'
  },

  /* ---------------- 14 ---------------- */
  {
    id: 'p14', n: 14, date: '2026-11-27', time: '20:30', fmt: 'reel', pillar: 'songs', bar: 'II', b: 7, g: 'c',
    title: { en: 'Song of the week №04 — Zajdi, zajdi, jasno sonce', mk: 'Песна на неделата №04 — Зајди, зајди, јасно сонце' },
    goal: ['shares', 'follows', 'site visits'],
    why: 'The month’s feed edition of Song of the week, and the first time her voice is the whole post. Closes bar II.',
    link: { path: 'website/journal/zajdi-zajdi-jasno-sonce/', label: 'jasnota.mk/journal/zajdi-zajdi-jasno-sonce' },
    photos: ['extra-04'],
    cover: {
      alt: 'Reel cover: Jasna in profile, eyes closed, singing, lit by one lamp in a dark room. Text: Zajdi, zajdi, jasno sonce, with the Cyrillic title below. Footnote: Song of the week number 04, voice: Jasna.',
      html: h.ph('rim', 'extra-04') + '<div class="pc on-photo"><div class="push">' + h.q('Zajdi, zajdi, <em>jasno</em> sonce', 's') + h.mk('Зајди, зајди, јасно сонце', 'margin-top:2cqi') + '</div>' +
        h.row(h.meta('Song of the week №04'), h.meta('voice: Jasna'), 'margin-top:5cqi') + '</div>'
    },
    reel: {
      length: '42 s', split: '12 + 12 + 18',
      audio: 'Jasna’s own unaccompanied recording of the traditional song (public-domain melody and words). Record by Wed 25 Nov in a quiet room; the same take becomes the audio for journal 07.',
      shots: [
        { t: '00–12', shot: 'Black. The first phrase begins, voice only. Slow fade up on her profile, rim light from one practical lamp.', sound: 'First phrase, unaccompanied.', os: { en: 'Zajdi, zajdi, jasno sonce — a traditional Macedonian song', mk: 'Зајди, зајди, јасно сонце — македонска народна песна' }, ph: 'rim', slot: 'extra-04' },
        { t: '12–24', shot: 'Close: her hand resting on a wooden table; the breath before the second phrase is visible in the shoulders.', sound: 'Second phrase; the pause before it left long.', os: { en: 'Listen for the pauses between the lines.', mk: 'Слушај ги паузите меѓу стиховите.' }, ph: 'mic' },
        { t: '24–42', shot: 'Wider: the room, the single lamp. She finishes the phrase and holds the silence for three seconds. Lamp off.', sound: 'Last note decays, 3 s of room tone.', os: { en: 'The whole song: jasnota.mk', mk: 'Целата песна: jasnota.mk' }, ph: 'bokeh' }
      ]
    },
    caption: {
      en: `Song of the week №04 — Zajdi, zajdi, jasno sonce. A traditional Macedonian song, sung with nothing but a voice and the silence around it.

The title is spoken to the sun: set, set, clear sun. I don’t remember learning it; it seems to have always been there. And jasno, clear, shares its root with my name. I didn’t choose the song for that, but once I noticed, I couldn’t stop noticing.

Listen to the pauses between the lines. I leave them long on purpose.

The full recording, and why this song, are on jasnota.mk (link in bio).`,
      mk: `Песна на неделата №04 — Зајди, зајди, јасно сонце. Македонска народна песна, отпеана само со глас и со тишината околу него.

Насловот е обраќање кон сонцето: некој го моли јасното сонце да зајде. Не се сеќавам кога ја научив; како секогаш да била тука. А јасно има ист корен како моето име. Не ја избрав песната поради тоа, но штом го забележав, не можев да престанам да го забележувам.

Слушај ги паузите меѓу стиховите. Ги оставам долги намерно.

Целата снимка, и зошто токму оваа песна, се на jasnota.mk (линкот е во био).`
    },
    tags: ['jasnota', 'macedonianfolk', 'traditionalsong', 'voice', 'македонскинародни', 'зајдизајди']
  },

  /* ---------------- 15 ---------------- */
  {
    id: 'p15', n: 15, date: '2026-11-30', time: '20:30', fmt: 'single', pillar: 'rest', light: true, bar: 'III', b: 1, g: 'a',
    title: { en: 'Silence is not empty', mk: 'Тишината не е празнина' },
    goal: ['saves', 'comments'],
    why: 'Downbeat of bar III, on paper, top-left of the month-one grid. The three light tiles now form a clean diagonal.',
    slides: [{
      light: true,
      alt: 'Off-white square. A small whole-rest symbol in grey at the top. Large serif text: Silence is not empty. Macedonian below: Тишината не е празнина. Footnote: a rest is written down, like a note.',
      html: '<div class="pc">' + h.rest(14, 'color:#8c8a85') + '<div class="push">' + h.q('Silence is not <em>empty.</em>', 'l') + h.mk('Тишината не е празнина.', 'margin-top:3cqi') + '</div>' +
        h.row(h.meta('a rest is written down, like a note'), h.meta('30 · 11'), 'margin-top:7cqi') + '</div>'
    }],
    caption: {
      en: `In music, a rest is written down just like a note. It has its own length, its own place, its own meaning. Nobody calls it empty.

This was the first month of Jasnota. Thank you for listening with me. Before December starts, a rest: one evening this week with no input. No podcast on the walk, no song in the kitchen. Just the room.

Then tell me what you heard.`,
      mk: `Во музиката паузата се запишува исто како нота. Има своја должина, свое место, свое значење. Никој не ја нарекува празна.

Ова беше првиот месец на Јаснота. Ти благодарам што слушаше со мене. Пред да почне декември, една пауза: една вечер оваа недела без ништо однадвор. Без подкаст на прошетка, без песна во кујната. Само собата.

Потоа кажи ми што слушна.`
    },
    tags: ['jasnota', 'silence', 'rest', 'musicpsychology', 'тишина'],
    audio: '—'
  }
  ];

  /* =================================================================
     STORY FRAMES (designed). Safe zones: top and bottom 13% stay clear.
     ================================================================= */
  function st(inner, pad) { return '<div class="pc storypc"' + (pad ? ' style="' + pad + '"' : '') + '>' + inner + '</div>'; }
  function mkb(t, s) { return '<p class="body mkbody" lang="mk"' + (s ? ' style="' + s + '"' : '') + '>' + t + '</p>'; }
  function poll(q, qmk, a, b, pa) {
    return '<div class="sticker"><p class="sq">' + q + '</p>' + (qmk ? '<p class="sqmk" lang="mk">' + qmk + '</p>' : '') + '<div class="opts">' +
      '<div class="opt"><span class="bar" style="width:' + pa + '%"></span><span>' + a + '</span><span class="pct">' + pa + '%</span></div>' +
      '<div class="opt"><span class="bar" style="width:' + (100 - pa) + '%"></span><span>' + b + '</span><span class="pct">' + (100 - pa) + '%</span></div></div></div>';
  }
  function quiz(q, qmk, opts, right) {
    return '<div class="sticker quiz"><p class="sq">' + q + '</p>' + (qmk ? '<p class="sqmk" lang="mk">' + qmk + '</p>' : '') + '<div class="opts">' +
      opts.map(function (o, i) { return '<div class="opt' + (i === right ? ' right' : '') + '"><span class="l">' + 'ABC'[i] + '</span><span>' + o + '</span></div>'; }).join('') + '</div></div>';
  }
  function question(q, qmk, ph) {
    return '<div class="sticker"><p class="sq">' + q + '</p>' + (qmk ? '<p class="sqmk" lang="mk">' + qmk + '</p>' : '') + '<div class="field">' + ph + '</div></div>';
  }
  function slider(q, qmk, v) {
    return '<div class="sticker slider"><p class="sq">' + q + '</p>' + (qmk ? '<p class="sqmk" lang="mk">' + qmk + '</p>' : '') +
      '<div class="track"><i style="width:' + v + '%"></i><b style="left:' + v + '%"></b></div><div class="ends"><span>quiet</span><span>loud</span></div></div>';
  }
  function linkSt(t) { return '<span class="lnk">' + J.icon('link') + t + '</span>'; }
  function music(title, who, note) {
    return '<div class="music"><span class="cov" aria-hidden="true">' + J.icon('music') + '</span><span class="tx"><b>' + title + '</b><span>' + who + '</span></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></div>' + (note ? '<p class="meta" style="margin-top:2.4cqi;text-align:center">' + note + '</p>' : '');
  }

  J.FRAMES = {
    S01: { sticker: 'countdown', alt: 'Story: mark at top. Text: Tonight at 20:30 this account becomes Jasnota. A countdown sticker reads Jasnota, 20:30.',
      html: st(h.mark(10) + '<div class="push">' + h.q('Tonight at 20:30 this account becomes <em>Jasnota.</em>', 's') + mkb('Вечерва во 20:30 овој профил станува Јаснота.', 'margin-top:3cqi') +
        '<div class="sticker count" style="margin-top:7cqi"><p class="sq">Jasnota · 20:30</p><div class="digits"><span>10</span><i>:</i><span>30</span><i>:</i><span>00</span></div><p class="meta">hours · minutes · seconds</p></div></div>') },
    S02: { sticker: 'link', alt: 'Story: Jasnota explains. It doesn’t treat. I’m a psychologist, but this account is not therapy and I don’t offer sessions. If you are struggling, talk to a psychologist, psychotherapist or your doctor. In danger right now: your local emergency number, 112 in most of Europe. Link sticker to the about page.',
      html: st(h.q('Jasnota explains. It doesn’t <em>treat.</em>', 's') +
        h.body('I’m a psychologist, but this account is not therapy, and I don’t offer sessions. If you’re struggling, please talk to a psychologist, a psychotherapist or your doctor.', 'margin-top:5cqi') +
        mkb('Јаснота објаснува, не лекува. Ако ти е тешко, разговарај со психолог, психотерапевт или со твојот лекар.', 'margin-top:4cqi') +
        '<div class="push">' + h.body('In danger right now: your local emergency number (112 in most of Europe).', 'margin-bottom:5cqi', 'b') + linkSt('jasnota.mk/about') + '</div>') },
    S03: { sticker: 'poll', alt: 'Story poll: When you’re anxious, does music help or get in the way? Options: it helps, it gets in the way.',
      html: st('<div style="margin-top:auto;margin-bottom:auto">' + poll('When you’re anxious, does music <em>help</em>?', 'Кога си вознемирен/а, дали музиката помага?', 'it helps', 'it gets in the way', 64) + '</div>' + h.meta('poll · results shown as an example', 'text-align:center')) },
    S04: { sticker: 'quiz', alt: 'Story quiz: An orchestra usually tunes to which note? A: A. B: C. C: E. The answer A is marked.',
      html: st(h.mark(9, 'color:var(--ash)') + '<div class="push">' + quiz('An orchestra usually tunes to which <em>note?</em>', 'На која нота најчесто се штима оркестарот?', ['A', 'C', 'E'], 0) + '</div>') },
    S05: { sticker: 'slider', alt: 'Story slider: How loud is your stage fright today? Any stage counts. The slider thumb sits at about two-thirds.',
      html: st(h.q('Any stage counts: a meeting, an exam, a <em>phone call.</em>', 'xs', 'color:var(--ash)') + '<div class="push">' + slider('How loud is your stage fright <em>today?</em>', 'Колку е гласна твојата трема денес?', 68) + '</div>') },
    S06: { sticker: 'music', alt: 'Story: Song of the week number 01. Gymnopédie No. 1, Erik Satie, 1888, with a music sticker. Listen for the left hand. It never hurries.',
      html: st(h.meta('Song of the week №01') + '<div class="push">' + h.q('Listen for the left hand. It never <em>hurries.</em>', 's') + mkb('Слушај ја левата рака. Никогаш не брза.', 'margin-top:3cqi') +
        '<div style="margin-top:7cqi">' + music('Gymnopédie No. 1', 'Erik Satie · 1888', 'in-app music sticker') + '</div></div>') },
    S07: { sticker: 'location', alt: 'Story: photo of Bitola at night, Širok Sokak with street lamps. Location sticker: Bitola. Text: The street at 21:40.',
      html: h.ph('street', 'bitola', '<span class="lamps"></span><span class="tower"></span>') + st('<div class="push">' + h.q('The street at <em>21:40.</em>', 's') + '<span class="loc" style="margin-top:5cqi">' + J.icon('pinloc') + 'Bitola</span></div>') },
    S08: { sticker: 'question', alt: 'Story question sticker: Which song do you play when you need to be sad properly? Answer field: a song, an artist.',
      html: st(h.mark(9) + '<div class="push">' + question('Which song do you play when you need to be sad <em>properly?</em>', 'Која песна ја пушташ кога ти треба да бидеш тажен/тажна како што треба?', 'a song, an artist…') + '</div>') },
    S09: { sticker: 'link', alt: 'Story: Why sad songs make us calmer. Five minutes, four studies, one song I played too many times at sixteen. Link sticker to the journal.',
      html: st(h.meta('Journal 02 · 5 min') + '<div class="push">' + h.q('Why sad songs make us <em>calmer</em>', '') + h.body('Five minutes. Four studies. One song I played too many times at sixteen.', 'margin-top:4cqi') +
        mkb('Зошто тажните песни нè смируваат.', 'margin-top:3cqi') + '<div style="margin-top:7cqi">' + linkSt('Read the essay') + '</div></div>') },
    S10: { sticker: 'reply', alt: 'Story: Tuesday’s question shown small, with three placeholder answer cards: an answer from Tuesday, anonymous.',
      html: st(h.q('You <em>answered.</em>', 's') + mkb('Ваши одговори, анонимно.', 'margin-top:2cqi') +
        '<div class="push replies"><p class="rq">Which song do you play when you need to be sad properly?</p><p class="ra">“[ an answer from Tuesday ]”</p><p class="ra">“[ an answer from Tuesday ]”</p><p class="ra">“[ an answer from Tuesday ]”</p></div>') },
    S11: { sticker: 'mention', alt: 'Story: photo of the orchestra’s music stands under stand lights. Text: Tonight, 20:30: one note, a whole orchestra. Mention sticker: chamber_orchestra_diva.',
      html: h.ph('stands', 'extra-05') + st('<div class="push">' + h.q('Tonight, 20:30: one note, a whole <em>orchestra.</em>', 's') + mkb('Вечерва, 20:30: една нота, цел оркестар.', 'margin-top:3cqi') + '<span class="mention" style="margin-top:5cqi">@chamber_orchestra_diva</span></div>', 'background:linear-gradient(to bottom,transparent 40%,rgba(10,10,11,.85))') },
    S12: { sticker: 'poll', alt: 'Story poll: After a mistake, which voice is louder? Options: I did something wrong, I am wrong.',
      html: st('<div style="margin-block:auto">' + poll('After a mistake, which voice is <em>louder?</em>', 'По грешка, кој глас е погласен?', '“I did something wrong”', '“I am wrong”', 41) + '</div>' + h.meta('Monday’s post, continued', 'text-align:center')) },
    S13: { sticker: 'quiz', alt: 'Story quiz: The impostor phenomenon was first described in… A: 1978. B: 1998. C: 2008. The answer 1978 is marked.',
      html: st(h.mark(9, 'color:var(--ash)') + '<div class="push">' + quiz('The impostor phenomenon was first described <em>in…</em>', 'Феноменот на измамник првпат е опишан во…', ['1978', '1998', '2008'], 0) + h.meta('tomorrow: Psycho-note №02', 'margin-top:4cqi;text-align:center') + '</div>') },
    S14: { sticker: 'question', alt: 'Story question sticker: What were you listening to at seventeen? Answer field: song and year. Note: answers may appear anonymously in Wednesday’s post.',
      html: st(h.q('<em>17</em>', '', 'font-size:44cqi;line-height:.8;color:var(--ash)') + '<div class="push">' + question('What were you listening to at <em>seventeen?</em>', 'Што слушаше кога имаше седумнаесет?', 'song + year…') +
        h.meta('answers may appear, anonymously, in Wednesday’s post', 'margin-top:4cqi;text-align:center') + '</div>') },
    S15: { sticker: 'music', alt: 'Story: Song of the week number 03. Spiegel im Spiegel, Arvo Pärt, 1978, with an in-app music sticker. Listen for the silence between the piano notes.',
      html: st(h.meta('Song of the week №03') + '<div class="push">' + h.q('Listen for the silence between the piano <em>notes.</em>', 's') + mkb('Слушај ја тишината меѓу тоновите на пијаното.', 'margin-top:3cqi') +
        '<div style="margin-top:7cqi">' + music('Spiegel im Spiegel', 'Arvo Pärt · 1978', 'in-app music sticker only') + '</div></div>') },
    S16: { sticker: 'none', alt: 'Story: close-up of hands and a microphone in low light. Text: Recording tomorrow’s song. One take, one lamp.',
      html: h.ph('mic', 'hands') + st('<div class="push">' + h.q('Recording tomorrow’s song. One take, one <em>lamp.</em>', 's') + mkb('Ја снимам утрешната песна. Една снимка, една ламба.', 'margin-top:3cqi') + '</div>', 'background:linear-gradient(to bottom,transparent 45%,rgba(10,10,11,.85))') },
    S17: { sticker: 'poll', alt: 'Story poll: What should Psycho-note number 05 be? Options: window of tolerance, rumination.',
      html: st(h.mark(9) + '<div class="push">' + poll('What should Psycho-note №05 <em>be?</em>', 'Која да биде Психо-нота №05?', 'window of tolerance', 'rumination', 55) + '</div>') },
    S18: { sticker: 'question', alt: 'Story question sticker: What did you hear in your evening of silence?',
      html: st(h.rest(16, 'color:var(--ash)') + '<div class="push">' + question('What did you hear in your evening of <em>silence?</em>', 'Што слушна во твојата тивка вечер?', 'I heard…') + '</div>') },
    S19: { sticker: 'music', alt: 'Story: Song of the week number 02. Jovano, Jovanke, traditional Macedonian, with a music sticker. A song that is one long question.',
      html: st(h.meta('Song of the week №02') + '<div class="push">' + h.q('A song that is one long <em>question.</em>', 's') + mkb('Песна што е едно долго прашање.', 'margin-top:3cqi') +
        '<div style="margin-top:7cqi">' + music('Jovano, Jovanke', 'traditional · Macedonia', 'in-app music sticker, any licensed recording') + '</div></div>') },
    S20: { sticker: 'link', alt: 'Story: photo of Jasna singing in lamplight. Text: Song of the week number 04 is my own. Link sticker: Listen.',
      html: h.ph('rim', 'extra-04') + st(h.meta('Song of the week №04') + '<div class="push">' + h.q('This week’s song is my <em>own.</em>', 's') + mkb('Песната оваа недела е моја.', 'margin-top:3cqi') + '<div style="margin-top:6cqi">' + linkSt('jasnota.mk/listen') + '</div></div>', 'background:linear-gradient(to bottom,transparent 40%,rgba(10,10,11,.85))') },
    S21: { sticker: 'link', alt: 'Story: The voice I used to hide. Guilt says I did something wrong; shame says I am wrong. Link sticker: read the essay.',
      html: st(h.meta('Journal 01 · 4 min') + '<div class="push">' + h.q('The voice I used to <em>hide</em>', '') + h.body('Guilt says: I did something wrong. Shame says: I am wrong.', 'margin-top:4cqi') +
        mkb('Гласот што го криев.', 'margin-top:3cqi') + '<div style="margin-top:7cqi">' + linkSt('Read the essay') + '</div></div>') },
    S22: { sticker: 'poll', alt: 'Story poll: Do you like hearing your own voice on a recording? Options: yes, not at all. Footnote: almost nobody does, and there is a physical reason.',
      html: st('<div style="margin-block:auto">' + poll('Do you like hearing your own voice on a <em>recording?</em>', 'Дали го сакаш својот глас на снимка?', 'yes', 'not at all', 23) + '</div>' +
        h.meta('tomorrow: why almost nobody does', 'text-align:center')) },
    S24: { sticker: 'none', alt: 'Story: photo of sheet music on a stand with pencil breath marks. Text: Rehearsal with DIVA tonight. The pencil marks are where I breathe.',
      html: h.ph('sheet', 'extra-06') + st('<div class="push">' + h.q('Rehearsal with DIVA tonight. The pencil marks are where I <em>breathe.</em>', 's') + mkb('Проба со DIVA вечерва. Ознаките со молив се местата каде што дишам.', 'margin-top:3cqi') + '</div>', 'background:linear-gradient(to bottom,transparent 40%,rgba(10,10,11,.88))') },
    H01: { sticker: 'none', alt: 'Highlight frame: portrait of Jasna in rim light. Text: Jasna Dimitrovska. Psychologist, Gestalt counsellor, vocal artist with Orchestra DIVA. Bitola.',
      html: h.ph('rim', 'portrait') + st('<div class="push">' + h.q('Jasna <em>Dimitrovska</em>', 's') + '<ul class="roles"><li>psychologist</li><li>Gestalt counsellor</li><li>vocal artist, Orchestra DIVA</li><li>Bitola</li></ul></div>', 'background:linear-gradient(to bottom,transparent 40%,rgba(10,10,11,.88))') },
    H02: { sticker: 'link', alt: 'Highlight frame: list of the seven journal entries, with a link sticker to the journal.',
      html: st(h.q('The <em>journal</em>', 's') + '<ol class="jlist"><li>The voice I used to hide</li><li>Why sad songs make us calmer</li><li>Tuning fork: on attunement</li><li>Breathing in 7/8</li><li>Stage fright</li><li>What were you listening to at seventeen?</li><li>Zajdi, zajdi, jasno sonce</li></ol><div class="push">' + linkSt('jasnota.mk/journal') + '</div>') }
  };

  /* =================================================================
     STORIES — day by day. Sundays are a written rest.
     ================================================================= */
  function S(time, f, note) { return { time: time, f: f, note: note }; }
  function SH(time, id, en, mk, sticker) { return { time: time, share: id, note: { en: en, mk: mk }, sticker: sticker }; }
  J.DAYS = [
    { date: '2026-11-02', theme: 'Launch', items: [S('10:00', 'S01'), SH('20:35', 'p02', 'Who’s talking.', 'Кој зборува.'), S('21:00', 'S02')] },
    { date: '2026-11-03', theme: 'Think: a question', items: [S('12:00', 'S03'), SH('20:30', 'p03', 'Three bars before sleep.', 'Три такта пред спиење.')] },
    { date: '2026-11-04', theme: 'Explain', items: [SH('20:35', 'p04', 'Psycho-note №01 is up.', 'Психо-нота №01.'), S('21:00', 'S04')] },
    { date: '2026-11-05', theme: 'Answers + rehearsal', items: [S('18:30', 'S24')] },
    { date: '2026-11-06', theme: 'Listen', items: [S('18:00', 'S05'), SH('20:35', 'p05', 'Ten minutes before.', 'Десет минути пред.')] },
    { date: '2026-11-07', theme: 'Song of the week №01', items: [S('10:00', 'S06')] },
    { date: '2026-11-08', theme: 'Rest', rest: true, items: [] },
    { date: '2026-11-09', theme: 'Think', items: [SH('20:35', 'p06', 'Where I live.', 'Каде живеам.'), S('21:30', 'S07')] },
    { date: '2026-11-10', theme: 'Think: a question', items: [S('12:00', 'S08')] },
    { date: '2026-11-11', theme: 'Explain → journal', items: [SH('20:35', 'p07', 'Eight slides, four studies.', 'Осум слајда, четири истражувања.'), S('21:00', 'S09')] },
    { date: '2026-11-12', theme: 'Your answers', items: [S('12:00', 'S10')] },
    { date: '2026-11-13', theme: 'Listen · collab', items: [S('19:00', 'S11'), SH('20:35', 'p08', 'With Orchestra DIVA.', 'Со Оркестарот DIVA.', '<span class="mention" style="align-self:center">@chamber_orchestra_diva</span>')] },
    { date: '2026-11-14', theme: 'Song of the week №02', items: [S('10:00', 'S19')] },
    { date: '2026-11-15', theme: 'Rest', rest: true, items: [] },
    { date: '2026-11-16', theme: 'Think', items: [SH('20:35', 'p09', 'A note. Not you.', 'Нота. Не ти.'), S('21:00', 'S12')] },
    { date: '2026-11-17', theme: 'Think: a quiz', items: [S('12:00', 'S13')] },
    { date: '2026-11-18', theme: 'Explain', items: [SH('20:35', 'p10', 'Psycho-note №02.', 'Психо-нота №02.')] },
    { date: '2026-11-19', theme: 'Question for Wednesday’s post', items: [S('12:00', 'S14')] },
    { date: '2026-11-20', theme: 'Listen', items: [SH('20:35', 'p11', 'Send this to your steady metronome.', 'Испрати го ова на твојот мирен метроном.')] },
    { date: '2026-11-21', theme: 'Song of the week №03', items: [S('10:00', 'S15')] },
    { date: '2026-11-22', theme: 'Rest', rest: true, items: [] },
    { date: '2026-11-23', theme: 'Think → journal', items: [SH('20:35', 'p12', 'The first entry.', 'Првиот текст.'), S('21:00', 'S21')] },
    { date: '2026-11-24', theme: 'Think: a poll', items: [S('12:00', 'S22')] },
    { date: '2026-11-25', theme: 'Explain', items: [SH('20:35', 'p13', 'Slide 5 is you.', 'Петтиот слајд си ти.')] },
    { date: '2026-11-26', theme: 'Behind the scenes', items: [S('19:00', 'S16')] },
    { date: '2026-11-27', theme: 'Listen', items: [SH('20:35', 'p14', 'Voice only.', 'Само глас.', '<span class="lnk" style="align-self:center">' + J.icon('link') + 'jasnota.mk/listen</span>')] },
    { date: '2026-11-28', theme: 'Song of the week №04', items: [S('10:00', 'S20')] },
    { date: '2026-11-29', theme: 'Rest', rest: true, items: [] },
    { date: '2026-11-30', theme: 'Think · month one closes', items: [SH('20:35', 'p15', 'A rest before December.', 'Пауза пред декември.'), S('21:00', 'S17')] },
    { date: '2026-12-01', theme: 'Question', items: [S('12:00', 'S18')] }
  ];

  /* =================================================================
     HIGHLIGHTS — cover sign + frames (frame ids or shares)
     ================================================================= */
  J.HIGHLIGHTS = [
    { id: 'jasna', label: 'Jasna', mk: 'Јасна', sign: 'note', items: [{ f: 'H01' }, { f: 'S02' }, { share: 'p02', note: { en: 'Start here.', mk: 'Почни тука.' } }] },
    { id: 'psycho', label: 'Psycho-note', mk: 'Психо-нота', sign: 'mark', items: [{ share: 'p04', note: { en: '№01', mk: '' } }, { share: 'p10', note: { en: '№02', mk: '' } }, { share: 'p11', note: { en: '№03', mk: '' } }, { share: 'p13', note: { en: '№04', mk: '' } }, { f: 'S17' }] },
    { id: 'songs', label: 'Songs', mk: 'Песни', sign: 'meter', items: [{ f: 'S06' }, { f: 'S19' }, { f: 'S15' }, { f: 'S20' }] },
    { id: 'stage', label: 'Stage', mk: 'Сцена', sign: 'resonance', items: [{ f: 'S24' }, { share: 'p05', note: { en: 'Backstage.', mk: 'Зад сцена.' } }, { f: 'S11' }, { f: 'S16' }] },
    { id: 'journal', label: 'Journal', mk: 'Дневник', sign: 'pilcrow', items: [{ f: 'H02' }, { f: 'S09' }, { f: 'S21' }] },
    { id: 'rest', label: 'Rest', mk: 'Пауза', sign: 'fermata', items: [{ share: 'p03', note: { en: 'Three bars.', mk: 'Три такта.' } }, { f: 'S07' }, { share: 'p15', note: { en: 'A rest.', mk: 'Пауза.' } }, { f: 'S18' }] }
  ];

  /* resolve a story item (frame id or share) into a frame object */
  J.frameOf = function (it) {
    if (it.share) return { share: it.share, note: it.note, sticker: it.sticker };
    return J.FRAMES[it.f];
  };
})();
