# Vecmāmiņas.lv - failu struktūra

Biedrības "Vecmāmiņas.lv" mājas lapas kods. Statiska HTML/CSS/JS lapa (bez build soļa),
deployota ar GitHub Pages (skat. `CNAME`). **Pilnas darba instrukcijas: [`CLAUDE.md`](./CLAUDE.md)**
(stila noteikumi, kā pievienot rakstu/projektu/attēlu u.tml.) - šis fails tikai parāda, **kas kur
atrodas**.

```
.
├── index.html                    Sākumlapa (popup ziņas, kalendārs, jaunumu lente)
├── CNAME                         GitHub Pages domēns (vecmaminas.lv)
├── CLAUDE.md                     Galvenās darba instrukcijas (stils, konvencijas, TODO)
├── KALENDARS.md                  Kalendāra sistēmas apraksts (periodi, gadu pārslēgšanās, testēšana)
├── RAKSTU_PIEVIENOŠANA.md        Novecojis - redirekts uz CLAUDE.md
│
├── components/                   Fragmenti, ko main.js ielādē ar fetch() KATRĀ lapā
│   ├── header.html                 Navigācija (t.sk. globālās meklēšanas poga)
│   ├── footer.html                 Kājene
│   ├── contact-pop-up.html         "Sazinies ar mums" uznirstošais logs
│   └── scroll-to-top.html          "Uz augšu" poga
│
├── pages/                         Visas apakšlapas (`/pages/<nosaukums>.html`)
│   ├── about-us.html                Par mums (biedri, statūti, akreditācija, atbalstītāji)
│   ├── topicality.html              Aktualitātes (Jaunumi / Notikumi / TPU)
│   ├── projects.html                Projekti (accordion, dati no assets/JSON/projects.json)
│   ├── involved.html                "Vēlos iesaistīties"
│   ├── recommend.html               "Iesakām" (t.sk. kalendāra widgets)
│   ├── memories.html                Foto galerija
│   ├── privacyPolicy.html           Privātuma politika
│   ├── form1.html / form2.html      Pieteikuma formas
│   └── templateForNewPages.html     Tukša veidne jaunai lapai - kopēt no šī
│
├── articles/                      Pilna satura raksti (NAV navigācijā hardkodēti - skat. zemāk)
│   ├── topicality/
│   │   ├── news/                    Aktualitāšu "Jaunumi" raksti (reģistrē topicality.js)
│   │   ├── events/                  Aktualitāšu "Notikumi" raksti (reģistrē topicality.js)
│   │   └── university/              "Trešās paaudzes universitāte" raksti (reģistrē topicality.js)
│   └── projects/                    Pilnie projektu apraksti (saistīti no projects.json)
│
├── modal_popup/                   Sākumlapas popup loga ziņu fragmenti (reģistrē main.js → popup_news)
│   ├── kalendars.html               Kalendāra widgets popup logā (skat. KALENDARS.md)
│   ├── apskati-jaunakos-notikumus.html / sekojiet-jaunumiem-fb-lapa.html   Pastāvīgie "filler" ieraksti
│   └── GGGG-MM-DD_vieta_apraksts.html   Katras ziņas fragments
│
├── assets/
│   ├── css/
│   │   ├── bootstrap.css            Bootstrap 5.3 + Bootswatch "Minty" tēma (VIENĪGAIS Bootstrap CSS)
│   │   └── styles.css               Projekta pašrocīgie stili
│   │
│   ├── js/
│   │   ├── main.js                  Galvenā inicializācija, komponentu ielāde, popup_news saraksts
│   │   ├── topicality.js            Aktualitāšu saraksti (news/events/university) un ielādētājs
│   │   ├── projects.js              Nolasa projects.json, būvē accordion, karuseļu paraksti
│   │   ├── calendarData.js          Kalendāra loģika un dati (skat. KALENDARS.md)
│   │   ├── search.js                Globālā meklēšana (visa vietne, modālais logs galvenē)
│   │   ├── additionalFunc.js        scrollToTop, scrollToHash, scroll-to-top pogas rādīšana
│   │   └── formValidation.js        Bootstrap formu validācija
│   │
│   ├── JSON/
│   │   ├── projects.json            VIENĪGAIS avota fails projektiem (current/realized)
│   │   └── calendar.json            Neizmantots/novecojis (dati tagad calendarData.js)
│   │
│   ├── documents/                 PDF/dokumenti (statūti, atskaites, politikas, kalendāri)
│   │   ├── kalendars26_27.pdf        Aktīvais/jaunākais kalendārs (2026/2027)
│   │   ├── kalendars25_26.pdf        Iepriekšējais kalendārs (2025/2026)
│   │   └── kalendars.pdf             Vecāks vēsturisks kalendārs
│   │
│   └── images/
│       ├── _jaunas/                 Iemešanas mape jauniem, vēl neapstrādātiem attēliem
│       ├── calendar/                Kalendāra mēnešu attēli (skat. KALENDARS.md)
│       ├── topicality/news|events|university/   Aktualitāšu rakstu attēli (pa apakšmapēm)
│       ├── projects/                 Projektu galeriju attēli
│       ├── articles/                 Papildu attēli konkrētiem rakstiem
│       ├── about-us/                 "Par mums" attēli (biedri, akreditācija)
│       ├── memories/                 "Atmiņas" lapas attēli
│       ├── logos/                    Sadarbības partneru/fondu logo
│       ├── icons/                    Ikonas (soc. tīkli, favicon)
│       ├── titles/ / recommend/ / fb_module/   Dažādu lapu baneru/palīgattēli
│
├── .claude/                       Claude Code lokālie iestatījumi (nav satura daļa)
└── .gitignore
```

## Kā dinamiskā ielāde strādā (kopsavilkums)

Lielākā daļa satura **nav hardkodēta HTML** - tas tiek ielādēts ar `fetch()` no sarakstiem
(masīviem) vai JSON pēc lapas ielādes. Ja pievieno jaunu failu, tas vienmēr jāreģistrē arī
attiecīgajā JS sarakstā/JSON, citādi tas nekur neparādīsies:

| Saturs | Faili jāizveido | Jāreģistrē |
|---|---|---|
| Aktualitāšu raksts | `articles/topicality/<news\|events\|university>/*.html` | `assets/js/topicality.js` |
| Sākumlapas popup ziņa | `modal_popup/*.html` | `assets/js/main.js` → `popup_news` |
| Projekts | (apraksts tieši JSON laukā) + `articles/projects/*.html` (ja pilns raksts) | `assets/JSON/projects.json` |
| Jauns kalendāra gads | `assets/images/calendar/*.jpg` + `assets/documents/*.pdf` | `assets/js/calendarData.js` (skat. `KALENDARS.md`) |
| Jauna galvenā lapa/sekcija | `pages/*.html` | `assets/js/search.js` → `STATIC_PAGES` (lai atrastu meklējot) |

Pilns process katram no šiem - `CLAUDE.md`.
