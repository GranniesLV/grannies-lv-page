# Vecmāmiņas.lv - Claude instrukcijas

## Projekts
Biedrības "Vecmāmiņas.lv" mājas lapa. Valoda: **latviešu**. Framework: **Bootstrap 5.3**.
Statiska HTML/CSS/JS lapa (bez build soļa, bez npm). Deployota ar GitHub Pages, domēns `vecmaminas.lv` (skat. `CNAME`).

---

## Stila noteikumi
- Domuzīme: vienmēr **`-`**, nekad `—`
- Komentāri kodā: tikai ja nepieciešami, īsi
- Attēli bez `object-fit: cover` un `max-height` ierobežojumiem - izmantot `class="img-fluid rounded shadow-sm"`
- Attēliem, ko var uzklikšķināt, aplīt ar `<a href="..." target="_blank" rel="noopener noreferrer">`

---

## Kā lapa tehniski darbojas
- `header.html`, `footer.html`, `contact-pop-up.html`, `scroll-to-top.html` (mapē `components/`) tiek ielādēti dinamiski ar `fetch()` no `assets/js/main.js` - tie NAV iekopēti katrā lapā.
- Aktualitāšu raksti, popup ziņas un projekti arī NAV hardkodēti HTML - tie tiek ielādēti dinamiski no failu sarakstiem (masīviem) vai JSON. Tāpēc jauns saturs vienmēr jāreģistrē attiecīgajā sarakstā (skat. zemāk) - pats HTML fails vien nepietiek.
- Failu ceļi komponentēs/skriptos sākas ar `/` (absolūtais ceļš no saknes) - tas der gan `index.html`, gan `pages/*.html`.

---

## Jauna raksta pievienošana (Aktualitātes)

Raksti glabājas `articles/topicality/` trīs apakšmapēs, un tiek reģistrēti **`assets/js/topicality.js`**:

| Mape | Sadaļa lapā (`pages/topicality.html`) | Masīvs `topicality.js` | Konteiners |
|---|---|---|---|
| `articles/topicality/news/` | Jaunumi | `topicalityNews` - **string saraksts** | `#topicality-news-container` |
| `articles/topicality/events/` | Notikumi | `topicalityEvents` - **objektu saraksts** `{file, id, label}` | `#topicality-events-container` |
| `articles/topicality/university/` | Trešās paaudzes universitāte | `topicalityUniversity` - **string saraksts** | `#topicality-university-container` |

### Soļi
1. **Izveidot HTML failu** mapē `articles/topicality/<news|events|university>/`
   - Nosaukums: `GGGG-MM-DD_vieta_apraksts.html`
   - `id` elementam jābūt unikālam camelCase formātā (piem. `id="biedribas15DzimsanasDiena"`) - vajadzīgs, ja uz rakstu ved poga/popup/cita saite
   - Veidne: `articles/topicality/news/2026-05-23_viesite_15-dzimsanas-diena.html`
2. **Pievienot `assets/js/topicality.js`** atbilstošajā masīvā, **augšā** (jaunākais pirmais):
   - `topicalityNews` / `topicalityUniversity` - vienkārši pievieno faila nosaukumu kā string
   - `topicalityEvents` - pievieno objektu ar visiem trim laukiem:
     ```js
     { file: "GGGG-MM-DD_vieta_apraksts.html", id: "unikalsId", label: "Pogas teksts" }
     ```
     `label: null`, ja rakstam nav vajadzīga sava poga notikumu navigācijā (poga tiek ģenerēta automātiski no šī saraksta - **nav** jāpieskata `pages/topicality.html` manuāli)
3. Ielāde notiek tikai lapā `pages/topicality.html` (funkcija `loadTopicality()` pārbauda `window.location.pathname.includes("topicality")`)

---

## Popup logs sākumlapā (`index.html`)

Sākumlapā pēc ielādes atveras modālais logs (`#newsPopUpModal`) ar īsu ziņu sarakstu. Šis ir **atsevišķs** no Aktualitāšu sistēmas:

- Fragmenti: mape `modal_popup/`
- Saraksts: **`assets/js/main.js`** → masīvs `popup_news` (NEVIS `topicality.js`!)
- Jaunāko pievieno **augšā**
- Kārtība ir pilnībā manuāla - saraksts netiek automātiski kārtots pēc datuma
- Sarakstā ir arī pastāvīgi/nedatēti ieraksti (piem. `kalendars.html`, `sekojiet-jaunumiem-fb-lapa.html`, `apskati-jaunakos-notikumus.html`), kas paliek sarakstā ilgtermiņā kā "filler" saturs - tos parasti nevajag dzēst, tikai jaunas ziņas liek tiem priekšā
- Veidne: `modal_popup/2026-04-25_riga_miera-kvartala-ideju-darbnica.html`
- Popup fragmentā parasti ir attēls + īss teksts + poga "Lasīt vairāk", kas ved uz `pages/topicality.html#raksta-id` (raksta `id` no atbilstošā `articles/topicality/...` faila)

**Tipisks process, pievienojot jaunu aktuālu notikumu, kas jāredz arī sākumlapā:**
1. Raksts `articles/topicality/news/` vai `events/` (ar `id`)
2. Reģistrē `topicality.js` (skat. augstāk)
3. Izveido `modal_popup/` fragmentu ar saiti uz raksta `id`, reģistrē `main.js` → `popup_news`

---

## Jauna projekta pievienošana

- Vienīgais **avota fails**: `assets/JSON/projects.json` (`assets/js/projects.js` to nolasa ar `fetch()` un uzbūvē accordion HTML lapā `pages/projects.html`)
- Blokā `"current"` - aktuālie projekti, pievieno **augšā**
- Blokā `"realized"` - realizētie projekti
- `"id"` - unikāls skaitlis; pašlaik lielākais ir `15`, nākamais **`16`**
- `"date"` formāts: `GGGG-MM-DD` (izmanto kārtošanai `pages/projects.html` "Kārtot pēc" funkcijā)
- `"gallery"`: attēlu ceļi mapē `assets/images/` (piem. `"projects/bilde1.jpeg"`), tukšs masīvs `[]`, ja galerijas nav

### ⚠️ Karuseļa parakstu īpatnība (gallery + carousel)
Ja projektam ir `gallery` ar vairākiem attēliem un `carouselId`/`carouselTextId`, **slaidu paraksti** (teksts zem katra attēla) **NAV** datu-vadīti no `projects.json` - tie ir hardkodēti atsevišķos masīvos `projects.js` failā (`captionsForTETE`, `captionsForFlexibli`, `captionsForInovation`) un pieslēgti ar manuāliem `changeCarouselText(...)` izsaukumiem koda beigās. Ja pievieno jaunu projektu ar galeriju un vēlies mainīgus parakstus katram slaidam:
1. Pievieno jaunu `captionsForXxx` masīvu `projects.js`
2. Pievieno `changeCarouselText("galleryCarouselXxx", captionsForXxx);` izsaukumu tur, kur tiek renderēti "realized" projekti

Bez šī soļa karuselis strādās (attēli mainīsies), bet paraksts zem tā - nē (paliks `defaultCarouselText`).

---

## Attēlu un dokumentu mapes

| Saturs | Mape |
|---|---|
| Aktualitāšu rakstu attēli | `assets/images/topicality/news/` un `.../events/` |
| Projektu attēli (galerijas) | `assets/images/projects/` |
| Kalendāra mēnešu attēli | `assets/images/calendar/` |
| "Par mums" attēli (biedri, akreditācija) | `assets/images/about-us/` |
| Logo (sadarbības partneri, fondi) | `assets/images/logos/` |
| Ikonas (soc. tīkli, favicon) | `assets/images/icons/` |
| Dokumenti (statūti, atskaites, politikas, kalendārs PDF) | `assets/documents/` |

---

## SEO / meta konvencija (katrai lapai)
Katrai `pages/*.html` un `articles/projects/*.html` lapai jābūt:
- `<html lang="lv">` (nekad `en` - viss saturs ir latviski)
- unikālam `<title>Sadaļa | Vecmāmiņas.lv</title>` un `<meta name="description">`
- Open Graph tagiem (`og:type`, `og:locale`, `og:url`, `og:title`, `og:description`, `og:image`) - `og:image` pēc noklusējuma `https://vecmaminas.lv/assets/images/logos/granniesLogo.png`, ja nav labākas specifiskas bildes
- **tikai vienam** Bootstrap CSS failam (`../assets/css/bootstrap.css` - tas jau satur pilnu Bootstrap+Bootswatch "Minty" tēmu; CDN `bootstrap.min.css` NAV jāliek klāt, citādi ielādējas divreiz)

Veidne `pages/templateForNewPages.html` satur šo struktūru ar placeholder komentāru - jauna lapa jākopē no tās un jāaizpilda.

---

## Kalendāra sistēma

- Fails: `assets/js/calendarData.js`
- Rāda mēneša attēlu un saiti uz PDF lapu sākumlapā/`recommend.html` (`initCalendar()`, izsaukts no `main.js` tikai sākumlapā)
- Katru gadu jāatjaunina masīvi `oldCalendarData`/`newCalendarData` (mēnesis → attēls mapē `assets/images/calendar/` + PDF lappuse) un jāpievieno jauns PDF `assets/documents/`

---

## Lapu (`pages/`) pārskats un sekciju `id`

| Lapa | Nozīme | Galvenie `id` |
|---|---|---|
| `about-us.html` | Par mums | `#members`, `#statute` (Statūti), `#accreditation`, `#supporters`, `#contacts` |
| `topicality.html` | Aktualitātes | `#news`, `#events`, `#university` |
| `projects.html` | Projekti | `#current`, `#realized` |
| `involved.html` | Vēlos iesaistīties | `#howToApply`, `#university`, `#donate` (pašlaik paslēpts) |
| `recommend.html` | Iesakām | `#check` |
| `privacyPolicy.html` | Privātuma politika | `#pr` |
| `memories.html` | Atmiņas (galerija) | - |
| `form1.html` / `form2.html` | Pieteikuma formas | - |
| `templateForNewPages.html` | Tukša veidne jaunai lapai (header+footer+main) | - |

Jaunas navigācijas saites/pogas uz šīm sekcijām jāsakrīt ar `components/header.html` un `components/footer.html` izvēlnēm - ja pievieno jaunu sekciju, apsver, vai tā jāparāda arī tur.

---

## Galvenie JS moduļi (`assets/js/`)

| Fails | Nozīme |
|---|---|
| `main.js` | Galvenā inicializācija: komponentu ielāde, popup ziņu saraksts (`popup_news`), navigācija, kontaktu popup, formu iesniegšana |
| `topicality.js` | Aktualitāšu (Jaunumi/Notikumi/TPU) saraksti un ielādētājs `loadTopicality()` |
| `projects.js` | Nolasa `projects.json`, uzbūvē projektu accordion, karuseļu paraksti, kārtošana |
| `calendarData.js` | Kalendāra mēneša attēls/saite |
| `additionalFunc.js` | `scrollToTop`, `scrollToHash`, scroll-to-top pogas rādīšana |
| `formValidation.js` | Bootstrap formu validācija |

---

## Esošie projekti (aktuālie)
| Nosaukums | Laiks | id |
|---|---|---|
| Soli pa solim darbībā | 20/05/2026 - 12/11/2026 | 15 |
| Kultūrizglītība Brasas apkaimes senioriem | 18/03/2026 - 10/06/2026 | 14 |
| KA1 projekts Pakāpieni | 01/06/2025 - 31/08/2026 | 13 |

---

## Citi projekta faili
- `RAKSTU_PIEVIENOŠANA.md` - īsa norāde, kas atsūta uz šo failu (lai process būtu aprakstīts tikai vienā vietā)
- `README.md` - tukšs/neizmantots
