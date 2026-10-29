#!/usr/bin/env node
/* Jasnota — import the content bank into the published site (dev-time only).

     node website/tools/import-content.mjs

   `research/` is private and never published. This copies what the site needs into `website/content/`:
     research/content-bank/{sources,concepts,myths,calendar}.json  → content/*.json   (verbatim)
     research/content-bank/articles/*.json                          → content/articles/*.json
         (merge: fields that exist only on the website copy, e.g. en.known / en.unknown / en.note, are kept)
     research/mapping/mapping.json                                  → content/map.json  (PUBLIC-SAFE subset)

   Map privacy rule (see SITE.md): only institutions, associations, journals, networks, events, education
   programmes and published research (author + institution + title + link). Never partnership_potential,
   relevance_to_jasnota, notes, rankings, or anything about individuals beyond their published professional work.
   Entries marked `unverified` are dropped. The Gestalt Institute Skopje site is not linked (possibly compromised).
   Every entry about a person is rewritten below (PUBLIC) as a piece of published work. */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, '..');
const BANK = resolve(SITE, '..', 'research', 'content-bank');
const MAPPING = resolve(SITE, '..', 'research', 'mapping', 'mapping.json');
const OUT = join(SITE, 'content');
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const write = (f, d) => { writeFileSync(f, JSON.stringify(d, null, 2) + '\n'); console.log('   wrote', f.replace(SITE + '/', '')); };

if (!existsSync(BANK)) { console.error('No content bank at', BANK, '(research/ is not part of the published site).'); process.exit(1); }
mkdirSync(join(OUT, 'articles'), { recursive: true });

/* ------------------------------------------------------------------ bank */
for (const f of ['sources.json', 'concepts.json', 'myths.json', 'calendar.json']) write(join(OUT, f), read(join(BANK, f)));

const merge = (site, bank) => {
  if (Array.isArray(bank) || typeof bank !== 'object' || bank === null) return bank;
  const out = { ...(site && typeof site === 'object' && !Array.isArray(site) ? site : {}) };
  for (const [k, v] of Object.entries(bank)) out[k] = merge(out[k], v);
  return out;
};
for (const f of readdirSync(join(BANK, 'articles')).filter((n) => n.endsWith('.json'))) {
  const bank = read(join(BANK, 'articles', f));
  const dest = join(OUT, 'articles', f);
  write(dest, existsSync(dest) ? merge(read(dest), bank) : bank);
}

/* ------------------------------------------------------------------ public map */
const REGION = (c) => (/^Macedonia$/.test(c) ? 'mk' : /^(International|United Kingdom|USA)/.test(c) ? 'int' : 'region');
const COUNTRY = {
  Macedonia: ['Македонија', 'Macedonia'], Serbia: ['Србија', 'Serbia'], Croatia: ['Хрватска', 'Croatia'],
  Slovenia: ['Словенија', 'Slovenia'], Bulgaria: ['Бугарија', 'Bulgaria'], Greece: ['Грција', 'Greece'],
  'Bosnia and Herzegovina': ['Босна и Херцеговина', 'Bosnia and Herzegovina'], Montenegro: ['Црна Гора', 'Montenegro'],
  'Regional (Western Balkans)': ['Западен Балкан', 'Western Balkans'], 'Regional (Serbia, Croatia, Slovenia)': ['Србија · Хрватска · Словенија', 'Serbia · Croatia · Slovenia'],
  Regional: ['регион', 'regional'], 'International (Europe)': ['Европа', 'Europe'], International: ['меѓународно', 'international'],
  'United Kingdom (international)': ['Велика Британија', 'United Kingdom'], 'United Kingdom': ['Велика Британија', 'United Kingdom'],
  'USA (international)': ['САД', 'USA'], USA: ['САД', 'USA'], 'International (Greek-founded)': ['меѓународно (Грција)', 'international (Greece)'],
};

/* Rewrites. `work` = a published piece: authors, year, title, venue (journal / thesis / institution), url.
   For people, only their published work and the institution it came from appear. */
const PUBLIC = {
  'mk-tanevski': {
    type: 'research', name_mk: 'Музико- и танцова терапија кај деца со посебни потреби', name_en: 'Music and dance therapy for children with special needs',
    work: { authors: 'Tanevski, T.', year: '2023', title: 'Music and dance therapy for children with special needs', venue: 'Vospitanie – Journal of Educational Sciences, Theory and Practice, 18(1), 10–21', url: 'https://doi.org/10.46763/JESPT2318110t' },
    inst_mk: 'Факултет за образовни науки, УГД Штип', inst_en: 'Faculty of Educational Sciences, Goce Delčev University, Štip',
    summary_mk: 'Студија за комбинирана музико- и танцова терапија кај деца со посебни потреби, спроведена во центарот „Џунџуле“. Истиот автор има објавено и македонски прирачници за методика на музикотерапијата (2011, 2019).',
    summary_en: 'A study of combined music and dance therapy for children with special needs, carried out at the Džundžule centre. The same author has published Macedonian handbooks on music-therapy methodology (2011, 2019).',
    url: 'https://doi.org/10.46763/JESPT2318110t',
    sources: ['https://js.ugd.edu.mk/index.php/vospitanie/article/view/5532', 'https://www.researchgate.net/publication/356086015_2011_METHODOLOGY_OF_MUSIC_THERAPY'],
  },
  'mk-dzundzule': {
    summary_mk: 'Отворен во 2006 во Детскиот културен центар „Карпош“ како прв центар за музикотерапија и уметничко изразување за деца со посебни потреби во Македонија. Издавач на македонски книги за музикотерапија.',
    summary_en: 'Opened in 2006 at the Karpoš children\'s cultural centre, Skopje, as the first centre for music therapy and artistic expression for children with special needs in Macedonia. Publisher of Macedonian books on music therapy.',
    sources: ['https://time.mk/cw/268b1964fc/nov-centar-za-decata-so-posebni-potrebi.html', 'https://okno.mk/node/1042', 'https://books.google.com/books/about/Muzikoterapija_kaj_deca_so_autizam.html?id=sYgOJQAACAAJ'],
  },
  'mk-zelenkovska-islam': {
    name_mk: 'Музичкото образование и децата со посебни потреби', name_en: 'Music education and children with special needs',
    work: { authors: 'Zelenkovska Leshkova, S., & Islam, A.', year: '2014', title: 'The music education subject in modern educational trends in the Republic of Macedonia', venue: 'Journal of Teaching and Education, 3(1), 555–560', url: 'https://eprints.ugd.edu.mk/9471/' },
    inst_mk: 'УГД Штип', inst_en: 'Goce Delčev University, Štip',
    summary_mk: 'Труд за местото на музичкото образование во установите за деца со посебни потреби во Скопје.',
    summary_en: 'A paper on music education in Skopje institutions for children with special needs.',
    sources: ['https://eprints.ugd.edu.mk/9471/'],
  },
  'mk-atanasovska-ivanovska': {
    name_mk: 'Биофидбек и сценска трема кај студенти по пијано', name_en: 'Biofeedback and stage fright in piano students',
    work: { authors: 'Атанасовска-Ивановска, Е.', year: '2018', title: 'Застапеноста на Биофидбек-методата како начин и средство за подобрување на музичките перформанси кај студентите по пијано во Република Македонија (докторски труд)', venue: 'Факултет за музичка уметност, УКИМ Скопје', url: 'http://hdl.handle.net/20.500.12188/11675' },
    inst_mk: 'Факултет за музичка уметност, УКИМ Скопје', inst_en: 'Faculty of Music, Ss. Cyril and Methodius University, Skopje',
    summary_mk: 'Докторски труд за биофидбек како начин за справување со сценската трема кај студенти по пијано. Единствениот македонски докторат за сценска трема што го најдовме.',
    summary_en: 'Doctoral thesis on biofeedback as a way of coping with stage fright among piano students. The only Macedonian doctorate on stage fright we found.',
    sources: ['http://hdl.handle.net/20.500.12188/11675'],
  },
  'mk-mihajlovski': {
    name_mk: 'Личноста на музичарите', name_en: 'Musicians\' personality',
    work: { authors: 'Mihajlovski, Z.', year: '2010–2017', title: 'Особините на личноста кај поединци професионално определени за музичка уметност (докторска дисертација, 2010); трудови во Croatian Journal of Education (2013, 2016, 2017)', venue: 'Филозофски факултет, УКИМ; Croatian Journal of Education', url: 'http://hdl.handle.net/20.500.12188/6531' },
    inst_mk: 'Педагошки факултет „Св. Климент Охридски“, УКИМ Скопје', inst_en: 'Faculty of Pedagogy, Ss. Cyril and Methodius University, Skopje',
    summary_mk: 'Докторат и три трудови за личноста, интелигенцијата и изборот на инструмент кај музичарите. Регионалната монографија од 2024 ги наведува како пример за (спорадичните) истражувања во психологијата на музиката во Македонија.',
    summary_en: 'A doctorate and three papers on personality, intelligence and instrument choice in musicians. The 2024 regional overview cites them as the example of (sporadic) music-psychology research in Macedonia.',
    sources: ['http://hdl.handle.net/20.500.12188/6531', 'https://doi.org/10.15516/cje.v15i0.606', 'https://doi.org/10.15516/cje.v18i0.2113', 'https://doi.org/10.15516/cje.v19i0.2708'],
  },
  'mk-ukim-institute-psychology': {
    summary_mk: 'Матичната институција за студии по психологија. Под нејзино менторство се одбранети ретките македонски тези поврзани со музика (докторат 2010, магистерска 2022).',
    summary_en: 'Macedonia\'s main psychology department; the rare music-related theses (a 2010 doctorate, a 2022 master\'s) were supervised here.',
  },
  'mk-sofronijoska-thesis': {
    name_mk: 'Личност и креативност кај студенти по музика', name_en: 'Personality and creativity in music students',
    work: { authors: 'Софронијоска, М.', year: '2022', title: 'Отвореност кон искуство, екстравертност, интелигенција и креативност кај студенти на музичка уметност (магистерски труд)', venue: 'Филозофски факултет, УКИМ Скопје', url: 'http://hdl.handle.net/20.500.12188/19041' },
    inst_mk: 'Филозофски факултет, УКИМ Скопје', inst_en: 'Faculty of Philosophy, Ss. Cyril and Methodius University, Skopje',
  },
  'mk-sulejmanov': {
    name_mk: 'Хумор, барање сензации и „софистицирана“ музика', name_en: 'Humour, sensation seeking and "sophisticated" music',
    work: { authors: 'Sulejmanov, F.', year: '2018', title: 'The relation of humor structure appreciation with sensation seeking and judgments of complex-abstract art and sophisticated music', venue: 'Psihologija, 51(2), 229–241', url: 'https://doi.org/10.2298/PSI170131010S' },
    inst_mk: 'Филозофски факултет, УКИМ Скопје', inst_en: 'Faculty of Philosophy, Ss. Cyril and Methodius University, Skopje',
  },
  'mk-serafimovska-markovikj': {
    name_mk: 'Емоции, народни песни и филмска музика', name_en: 'Emotion, folk songs and film music',
    work: { authors: 'Markovikj, M., Serafimovska, E., Cvetanova, G., & Stojkova Serafimovska, V.', year: '2019', title: 'The role of Macedonian folk songs featured in Macedonian films in amplifying the emotions', venue: 'Musicologist, 3(1), 103–125', url: 'https://doi.org/10.33906/musicologist.527269' },
    inst_mk: 'Институт за социолошки и политичко-правни истражувања, УКИМ', inst_en: 'Institute for Sociological, Political and Juridical Research, UKIM',
    summary_mk: 'Психолошки истражувања (2016–2019) за личното доживување на македонските епски народни песни и за улогата на народната и филмската музика во засилувањето на емоциите.',
    summary_en: 'Psychological studies (2016–2019) on how Macedonian epic folk songs are experienced and how folk and film music amplify emotion.',
    sources: ['https://doi.org/10.33906/musicologist.527269', 'http://hdl.handle.net/20.500.12188/6987'],
  },
  'mk-uacs-musicians-mental-health': {
    name_mk: 'Ментално здравје и отпорност кај класичните музичари', name_en: 'Mental health and resilience in classical musicians',
    work: { authors: 'Jordanova Peshevska, D., Tomovska-Misoska, A., Trajkova, K., & Mitanovska, T.', year: '2023', title: 'Mental health and resilience in classical musicians during COVID-19 pandemic in the Republic of North Macedonia', venue: 'Proceedings of PAM-IE Belgrade 2022, FMU Belgrade, 155–167', url: 'https://www.fmu.bg.ac.rs/wp-content/uploads/2023/08/17-jordanova-peshevska.pdf' },
    inst_mk: 'Универзитет Американ колеџ Скопје', inst_en: 'University American College Skopje',
    sources: ['https://www.fmu.bg.ac.rs/wp-content/uploads/2023/08/17-jordanova-peshevska.pdf', 'https://www.fmu.bg.ac.rs/wp-content/uploads/2023/07/zbornik-pam-ie-22.pdf'],
  },
  'mk-rashikj-canevska': {
    name_mk: 'Музикотерапија кај деца со посебни образовни потреби (преглед)', name_en: 'Music therapy for children with special educational needs (review)',
    work: { authors: 'Rashikj Canevska, O., & Ramo Akgün, N.', year: '2021', title: 'Music therapy for children with special education needs', venue: 'Research & Reviews in Educational Sciences – I, 63–78', url: 'http://hdl.handle.net/20.500.12188/24522' },
    inst_mk: 'Институт за дефектологија, Филозофски факултет, УКИМ', inst_en: 'Institute of Special Education and Rehabilitation, Faculty of Philosophy, UKIM',
    summary_mk: 'Прегледни поглавја (2021–2022) за музикотерапија, арт-, драма- и танцова терапија кај деца со посебни образовни потреби.',
    summary_en: 'Review chapters (2021–2022) on music, art, drama and dance therapy for children with special educational needs.',
    sources: ['http://hdl.handle.net/20.500.12188/24522', 'http://hdl.handle.net/20.500.12188/25522'],
  },
  'mk-karri-thesis': {
    name_mk: 'Компетенции на наставниците за музички талент', name_en: 'Teachers\' competences for musical talent',
    work: { authors: 'Кари, Е.', year: '2023', title: 'Компетенции на наставниците за идентификација и развој на музичкиот талент на учениците во основно и средно образование (докторски труд)', venue: 'Универзитет „Св. Климент Охридски“ – Битола', url: 'https://eprints.uklo.edu.mk/9074/1/Elizabete%20Karri.pdf' },
    inst_mk: 'УКЛО Битола', inst_en: 'St. Kliment Ohridski University, Bitola',
  },
  'mk-arsovski': {
    name_mk: 'Музикотерапија по мозочен удар (систематски преглед)', name_en: 'Music therapy after stroke (systematic review)',
    work: { authors: 'Arsovski, D.', year: '2024', title: 'The benefits of music therapy in stroke rehabilitation: A systematic literature review', venue: 'MPER, 6(7), 113–123', url: 'https://doi.org/10.59519/mper6112' },
    inst_mk: 'УКЛО Битола', inst_en: 'St. Kliment Ohridski University, Bitola',
    url: 'https://doi.org/10.59519/mper6112',
  },
  'mk-gestalt-institute': {
    name_mk: 'Гешталт институт – Скопје', name_en: 'Gestalt Institute Skopje',
    summary_mk: 'Институт за обука по гешталт психотерапија, на листата на акредитирани институти на Европската асоцијација за психотерапија. Во Скопје постои и втор EAGT-акредитиран институт. Ниту еден нема музички или уметнички правец.',
    summary_en: 'A Gestalt psychotherapy training institute listed among the European Association for Psychotherapy\'s accredited institutes; a second EAGT-accredited institute also exists in Skopje. Neither has a music or arts strand.',
    url: null, // the institute's own site is not linked: at the time of mapping it showed unrelated adverts
    sources: ['https://europsyche.org/training/eapti-eap-accredited-training-institutes'],
  },
  'mk-kiril-makedonski': {
    name_mk: 'Кирил Македонски: текстови за музикотерапија', name_en: 'Kiril Makedonski: writings on music therapy',
    work: { authors: 'Македонски, К.', year: '1977–1982', title: 'Над 30 текстови за музикотерапија', venue: 'историски извор', url: 'https://sokom.mk/mk/%D0%BA%D0%B8%D1%80%D0%B8%D0%BB-%D0%BC%D0%B0%D0%BA%D0%B5%D0%B4%D0%BE%D0%BD%D1%81%D0%BA%D0%B8/' },
    summary_mk: 'Композиторот (автор на првата македонска опера) во 1977–1982 интензивно се занимавал со музикотерапија и напишал над 30 текстови на таа тема. Најраната трага од областа кај нас.',
    summary_en: 'The composer (author of the first Macedonian opera) worked intensively on music therapy in 1977–1982 and wrote more than 30 texts on it: the earliest trace of the field here.',
  },
  'rs-fmu-bogunovic': {
    type: 'education', name_mk: 'Факултет за музичка уметност, Белград', name_en: 'Faculty of Music, University of Arts in Belgrade',
    summary_mk: 'Регионален центар на психологијата на музиката: оттука доаѓаат уредниците на зборниците на PAM-IE и на регионалната монографија (Bogunović, Timmers & Nikolić, 2024).',
    summary_en: 'The regional hub of music psychology: the editors of the PAM-IE proceedings and of the 2024 regional volume (Bogunović, Timmers & Nikolić) work here.',
    sources: ['https://www.fmu.bg.ac.rs/', 'https://doi.org/10.11647/OBP.0389'],
  },
  'hr-butkovic': {
    type: 'education', name_mk: 'Филозофски факултет, Загреб: тези за музичари', name_en: 'Faculty of Humanities and Social Sciences, Zagreb: theses on musicians',
    summary_mk: 'Одделот за психологија во Загреб е активен во регионалната мрежа RNPaM и беше домаќин на PAM-IE 2024; во неговиот дигитален архив се дипломски трудови за трема кај оркестарски музичари и за музиката во регулација на расположението.',
    summary_en: 'Zagreb\'s psychology department is active in the regional RNPaM network and hosted PAM-IE 2024; its digital archive holds theses on performance anxiety in orchestral musicians and on music in mood regulation.',
    url: 'https://darhiv.ffzg.unizg.hr/view/supervisors/Butkovi==0107=3AAna=3A=3A.html',
    sources: ['https://darhiv.ffzg.unizg.hr/view/supervisors/Butkovi==0107=3AAna=3A=3A.html', 'https://eprints.whiterose.ac.uk/219297/1/obp.0389.01.pdf'],
  },
  'si-habe': {
    name_mk: 'Музичка анксиозност при изведба: тематски број', name_en: 'Music performance anxiety: a research topic',
    work: { authors: 'Habe, K., et al.', year: '2023', title: 'Editorial: Highlights in performance science: Music performance anxiety', venue: 'Frontiers in Psychology', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10716699/' },
    inst_mk: 'Музичка академија, Универзитет во Љубљана', inst_en: 'Academy of Music, University of Ljubljana',
    summary_mk: 'Уводник на тематскиот број за музичка анксиозност при изведба. Музичката академија во Љубљана е домаќин на PAM-IE 2026 и пример за психолог што работи во самата академија.',
    summary_en: 'Editorial to a research topic on music performance anxiety. The Ljubljana Academy of Music hosts PAM-IE 2026 and is an example of a psychologist working inside a music academy.',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10716699/',
    sources: ['https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10716699/', 'https://www.pam-ie2026.com/'],
  },
  'rs-music-therapy': {
    summary_mk: 'Српската професионална мрежа за музикотерапија е единствената српска членка на EMTC; Удружението на музикотерапевти (основано 2001) е постарата организација. Нема акредитирана програма; постои приватна четиригодишна обука.',
    summary_en: 'The Serbian Professional Network is Serbia\'s only EMTC member; the Association of Music Therapists (founded 2001) is the older body. No accredited programme; a private four-year training exists.',
  },
  'int-escom': {
    summary_mk: 'Европско научно друштво за когнитивни науки за музиката (списание Musicae Scientiae); триеналните конференции, секоја втора заедно со ICMPC. Следна: ICMPC–ESCOM, Хелсинки, август 2027.',
    summary_en: 'European learned society for the cognitive sciences of music (journal Musicae Scientiae); triennial conferences, every second one joint with ICMPC. Next: ICMPC–ESCOM, Helsinki, August 2027.',
  },
  'bm-bulletproof-musician': {
    summary_mk: 'Блог, неделен подкаст и билтен за психологија на изведбата, на англиски, од виолинист со докторат по психологија.',
    summary_en: 'Blog, weekly podcast and newsletter on performance psychology, in English, by a violinist with a PhD in psychology.',
  },
  'ev-pam-ie': {
    summary_mk: 'Регионална меѓународна конференција „Психологија и музика – интердисциплинарни средби“: Белград 2019 и 2022, Загреб 2024, Љубљана 2026. Зборниците се отворено достапни. Единствениот македонски труд што го најдовме е од 2022.',
    summary_en: 'Regional international conference "Psychology and Music – Interdisciplinary Encounters": Belgrade 2019 and 2022, Zagreb 2024, Ljubljana 2026. Open-access proceedings. The only Macedonian paper we found is from 2022.',
  },
};

const BLOCKED_SOURCE = /linkedin\.com|telma\.com\.mk|gestaltinstitut\.edu\.mk/i;

if (existsSync(MAPPING)) {
  const map = read(MAPPING)
    .filter((e) => e.confidence === 'verified' || e.confidence === 'likely')
    .map((e) => {
      const o = PUBLIC[e.id] || {};
      const type = o.type || (e.type === 'practitioner' ? 'research' : e.type);
      const [country_mk, country_en] = COUNTRY[e.country] || [e.country, e.country];
      const url = 'url' in o ? o.url : e.url;
      return {
        id: e.id,
        name_mk: o.name_mk || e.name_local || e.name,
        name_en: o.name_en || e.name,
        type,
        region: REGION(e.country),
        country_mk, country_en,
        city: e.city || '',
        fields: e.fields || [],
        work: o.work || null,
        inst_mk: o.inst_mk || '', inst_en: o.inst_en || '',
        summary_mk: o.summary_mk || e.summary_mk,
        summary_en: o.summary_en || e.summary_en,
        url: url && !BLOCKED_SOURCE.test(url) ? url : null,
        sources: (o.sources || e.sources || []).filter((s) => !BLOCKED_SOURCE.test(s)),
        confidence: e.confidence,
        last_seen: e.last_seen || '',
      };
    });
  write(join(OUT, 'map.json'), { checked: '2026-10', note: 'Public-safe subset of research/mapping/mapping.json, generated by tools/import-content.mjs. Do not edit by hand; edit PUBLIC in the tool.', entries: map });
} else console.log('   (no research/mapping/mapping.json: content/map.json left as is)');
console.log('done. Now run: node website/tools/build.mjs');
