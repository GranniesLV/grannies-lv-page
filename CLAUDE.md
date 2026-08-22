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
- Git commit ziņojumi: vienmēr **angliski** (kods/saturs paliek latviski, tikai commit teksts angliski)
- Claude **nekad pats neizpilda `git commit`** (arī ne push) - vienmēr tikai sagatavo commit ziņojuma tekstu un atstāj commitošanu lietotājam, ja vien lietotājs skaidri nelūdz to izdarīt pašu

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

### Stils: Jaunumi vs Notikumi
Šīm divām sadaļām **apzināti atšķirīgs** raksta stils - lai vizuāli nošķirtos:

| | Jaunumi | Notikumi |
|---|---|---|
| Raksturs | īss, FB-tipa paziņojums | strukturēta "kas notika" atskaite |
| Veidne | `<section class="container my-5"><article class="card border-0 shadow-sm rounded-4">` ar badge+`h1`+lead | `<h5 id="...">` virsraksts + `<div class="row g-4">` divkolonnu: kreisā - teksta `card`, labā - "Pasākuma mirkļi" foto `card` |
| Papildu bloks | - | bieži "Praktiska informācija" (vieta/organizators/nākamā reize) - **piespiesta pie kreisās teksta kartītes apakšas** ar `card-body d-flex flex-column` + `<div class="mt-auto">` ap `<hr>`+infobloku (vienmēr pie apakšas, arī ja labā kolonna garāka), NEVIS atsevišķa kartīte zem abām kolonnām (jūtas nesaistīta) un NEVIS `row`/`col-md-8` (atstāj tukšumu labajā pusē) |
| Piemērs | `articles/topicality/news/2026-05-23_viesite_15-dzimsanas-diena.html` | `articles/topicality/events/2026-08-12_riga_datorprasmju-nodarbiba.html` (arī "Praktiska informācija" kartītes paraugs) |

Notikumu raksti nav ietverti `<section>`/`container` - tie paļaujas uz vecāka `#topicality-events-container` konteksu (skat. piemērus) un beidzas ar `<hr>`.

### Notikumu pogas (5 jaunākās + meklēšana)
Kopš 18+ notikumiem pogu josla kļuva nepārskatāma, ieviesta:
- Rāda tikai **5 jaunākās** pogas (`visibleBtnCount` sadaļā `topicality.js`) - pārējās paslēptas Bootstrap `collapse` blokā (`#topicality-events-btns-more-container`), atveras ar pogu "Rādīt visus notikumus (+N)"
- Katrai pogai automātiski pievienots **datums** (no faila nosaukuma prefiksa `GGGG-MM-DD`), formātā `DD.MM.`
- Meklēšanas lauks (`#events-search-input`) filtrē pogas pēc teksta/datuma "on input"; ja atbilstība atrodas paslēptajā blokā, tas automātiski atveras
- Meklēšana ir **diakritikas-nejūtīga** (`normalizeSearchText()` funkcija `topicality.js` -noņem garumzīmes/mīkstinājuma zīmes ar Unicode NFD normalizāciju, lai varētu meklēt arī bez tām)
- Zem lauka rādās arī **"as-you-type" ieteikumi** (`#events-search-suggestions`) ar pilnu raksta virsrakstu (nolasīts tieši no ielādētā raksta HTML, nevis no pogas `label`) - tāpēc atrodami arī notikumi, kam **nav pogas** (`label: null`). Uzklikšķinot uz ieteikuma, lapa automātiski atver paslēpto pogu bloku (ja vajag) un aizritina pie attiecīgā raksta
- Jauna notikuma pievienošana šo sistēmu neietekmē - viss strādā automātiski no `topicalityEvents` masīva kārtības un raksta HTML satura (virsraksta meklēšanai der jebkurš `h1`-`h6` elements ar/iekš ieraksta `id`)

---

## Globālā meklēšana (visa vietne)
Fails: **`assets/js/search.js`**, izsaukts no `main.js` (`initGlobalSearch()`) uzreiz pēc galvenes ielādes - pieejama **katrā lapā**, jo galvene (`components/header.html`) ielādējas visur.

- **Poga**: 🔍 ikona galvenes stūrī (`#mainLOGO`), atver modālo logu `#globalSearchModal` (arī definēts `header.html`)
- **Meklēšanas indekss** tiek uzbūvēts **lēni** (tikai pirmajā modāļa atvēršanas reizē) un pēc tam kešots atmiņā visai lapas apskates sesijai:
  - **Aktualitātes** - atkārtoti izmanto tos pašus `topicalityNews`/`topicalityEvents`/`topicalityUniversity` masīvus no `topicality.js` (eksportēti no turienes, NAV dublēti) - katram failam tiek nofetčots HTML un no tā izvilkts virsraksts (`h1-h6`) un pirmā rindkopa kā fragments
  - **Projekti** - `assets/JSON/projects.json`, saite uz `/pages/projects.html#collapse<id>`
  - **Lapas** - neliels statisks saraksts `search.js` (`STATIC_PAGES`) - jāpapildina ar roku, ja parādās jauna galvenā lapa/sekcija
- Meklēšana ir diakritikas-nejūtīga (tā pati `normalizeSearchText()` no `additionalFunc.js`)
- Uzklikšķinot uz **projekta** rezultāta, `pages/projects.html` (`projects.js`) pēc ielādes pārbauda URL hash (`#collapse<id>`) un automātiski atver + aizrit līdz tam projektam akordeonā

**Ja pievieno jaunu galveno lapu/sekciju** - jāpapildina `STATIC_PAGES` saraksts `search.js`, citādi tā nebūs atrodama meklējot.

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
| Aktualitāšu rakstu attēli | `assets/images/topicality/news/`, `.../events/`, `.../university/` |
| Projektu attēli (galerijas) | `assets/images/projects/` |
| "Atmiņas" lapas attēli | `assets/images/memories/` |
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

Veidne `pages/templateForNewPages.html` satur šo struktūru ar placeholder komentāru - jauna lapa jākopē no tās un jāaizpilda. Tā jau satur arī GoatCounter apmeklējumu statistikas skriptu (skat. zemāk) - kopējot no veidnes, tas automātiski būs klāt.

### Apmeklējumu statistika (GoatCounter)
Katrai **pilnai HTML lapai** (`index.html`, `pages/*.html`, `articles/projects/*.html`) tieši pirms `</body>` ir GoatCounter skripts:
```html
<script data-goatcounter="https://vecmaminas.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
```
Panelis: `https://vecmaminas.goatcounter.com`. **Nedrīkst** likt šo skriptu `components/header.html` vai citos fragmentos, kas tiek ielādēti ar `fetch()`+`innerHTML` (`loadComponent()` `main.js`) - pārlūks neizpilda `<script>` tagus, kas ievietoti caur `innerHTML`, tāpēc tas nekad nenostrādātu. Tāpat nav jāliek `articles/topicality/*.html` vai `modal_popup/*.html` fragmentos - tie nav atsevišķi apmeklējamas lapas.

**Statistikas lapa** (`pages/statistika.html`) - tikai viena poga uz GoatCounter paneli, bez virsraksta/apraksta. Apzināti **NAV** navigācijā (`header.html`/`footer.html`) un **NAV** reģistrēta `search.js` → `STATIC_PAGES` (lai neparādītos arī globālajā meklēšanā) - atrodama tikai zinot tiešo URL. Ir `<meta name="robots" content="noindex, nofollow">`, lai to neindeksē meklētājprogrammas. Šī nav īsta piekļuves kontrole (jebkurš, kas uzmin URL, to atradīs) - tikai apslēpta no nejaušas navigācijas/meklēšanas. Pati poga gan neko neatklāj svešiniekam - tā ved tikai uz GoatCounter pieteikšanās logu, dati bez konta datiem nav redzami.

---

## Jaunu attēlu pievienošana
- Iemest oriģinālos failus mapē `assets/images/_jaunas/` (nosaukums/formāts nav svarīgi) un sarunā pateikt, kam katrs paredzēts
- Tālāk process: pārsaukt pēc mērķa mapes konvencijas → saspiest/pielāgot izmēru → pārvietot pareizajā `assets/images/...` apakšmapē → atjaunināt atsauces (HTML/JS/JSON) → iztīrīt `_jaunas/`

### Attēlu saspiešana (mērķis: katrs attēls ≤ ~300KB)
Uz šī macOS pieejams tikai **`sips`** (iebūvēts rīks) - nav `imagemagick`/`pngquant`/`cwebp`.
- **Foto un grafikas bez reālas caurspīdības** (arī PNG bez jēgpilna alfa kanāla) → konvertēt uz **JPEG**, kvalitāte parasti 78-85 (pazemināt pakāpeniski, ja vēl par lielu)
- **Logo/ikonas ar reālu caurspīdību** → paturēt PNG, samazināt tikai izmēru
- Maks. mala: ~1600px pilnizmēra/baneru attēliem, ~1400px kalendāra/sīktēlu attēliem - **vispirms pārbaudīt esošo `pixelWidth`/`pixelHeight`** (`sips -g pixelWidth -g pixelHeight fails`), jo `sips -Z` **augšupmērogo** mazākus attēlus, ja vērtība netiek pārbaudīta pirms tam
- Ja formāts mainās (`.png` → `.jpg`), **obligāti** jāatjaunina visas atsauces (`grep -rl "vecaisNosaukums.png"` pa `*.html`/`*.js`/`*.json`) - citādi bilde pazūd
- ⚠️ **Drošības solis pirms `rm` uz oriģinālu**: ja mērķa mape (`--out ceļš/uz/mapi/fails.jpg`) vēl neeksistē, `sips` to **klusi neveido** un uzraksta failu nepareizā vietā (bez kļūdas!) - vienmēr vispirms `mkdir -p` mērķa mapei, un pēc `sips` izsaukuma **pārbaudīt, ka izejas fails tiešām eksistē pareizajā ceļā un ir >0 baiti**, tikai tad dzēst oriģinālu. Citādi risks pazaudēt lietotāja iesūtīto oriģinālo bildi neatgriezeniski.

---

## Kalendāra sistēma

Pilns apraksts (t.sk. kā strādā automātiskā gadu pārslēgšanās, kā pievienot jaunu kalendāra gadu
un kā notestēt nākotnes pārslēgšanos ar `?debugDate=`) - **[`KALENDARS.md`](./KALENDARS.md)**.

Īsumā: `assets/js/calendarData.js` satur masīvu `calendarPeriods` (katrs objekts - viens kalendāra
gads ar `from`/`to` diapazonu, PDF failu un 12 mēnešu datiem). Sistēma pati izvēlas pareizo periodu
pēc šodienas datuma - gadu skaitļi kodā NAV hardkodēti nekur citur. Rāda mēneša attēlu un saiti uz
PDF lapu sākumlapas popup ziņā/`recommend.html` (`initCalendar()`) un atjauno galvenes "Kalendārs"
saiti katrā lapā (`updateCalendarNavLink()`, izsaukts no `main.js`).

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

Pārējie (Kultūrizglītība Brasas apkaimes senioriem - id 14, KA1 projekts Pakāpieni - id 13) pārcelti uz "Realizētie", nākamais brīvais id joprojām **16**.

---

## Citi projekta faili
- `RAKSTU_PIEVIENOŠANA.md` - īsa norāde, kas atsūta uz šo failu (lai process būtu aprakstīts tikai vienā vietā)
- `KALENDARS.md` - pilns kalendāra sistēmas apraksts (skat. "Kalendāra sistēma" augstāk)
- `FAILU_STRUKTURA.md` - projekta failu struktūras pārskats (kas kur atrodas, ar īsiem komentāriem)
- `README.md` - tukšs/neizmantots, arī `.gitignore`-ots (skat. `FAILU_STRUKTURA.md` failu struktūrai)

---

## Uzlabojumu saraksts (TODO)
Apkopots no koda/UX pārskata (2026-08). ✅ = izdarīts, atzīmēt un pārcelt uz "izdarīts", kad kāds punkts pabeigts.

### ✅ Izdarīts
- `lang="lv"` visās lapās (bija `en`), unikāls `<title>`/`meta description` katrai lapai, Open Graph tagi
- Noņemts dubultais CDN Bootstrap CSS (paturēts tikai lokālais `bootstrap.css`)
- Izdzēsts neizmantotais `assets/js/projectsInfo.js`
- Visas attēlu bildes, kas bija virs ~300KB, saspiestas/konvertētas (skat. "Jaunu attēlu pievienošana")
- Izveidota `assets/images/_jaunas/` darbplūsma jaunu attēlu apstrādei
- Notikumu pogas: 5 jaunākās + "Rādīt visus" + meklēšana ar ieteikumiem (skat. "Notikumu pogas")
- Globālā meklēšana pa visu vietni (skat. "Globālā meklēšana")
- ⚠️ **Kritisks labojums**: `components/header.html` navigācijai trūka `.navbar-toggler` pogas - zem `lg` ekrāna platuma (<992px, t.i. **visi telefoni**) visa navigācija (arī Galerija, Privātuma politika) bija pilnībā nepieejama, jo nebija veida, kā atvērt `.navbar-collapse`. Tagad pievienota poga + `.collapse` klase.
- `pages/memories.html` attēli bija hotlinkoti no `picflow.media` (pagaidu/priekšskatījuma rīks) - lejupielādēti un pārvietoti uz `assets/images/memories/`, pievienota arī 15. dzimšanas dienas sadaļa
- Kalendāra sistēma pārtaisīta uz `calendarPeriods` masīvu ar `from`/`to` diapazoniem (nekur vairs nav hardkodēts konkrēts gads) - pievienots 2026/2027 kalendāra gads, izlabota `calendarApril2025.png` salauztā atsauce `recommend.html`, galvenes "Kalendārs" saite tagad atjaunojas automātiski katrā lapā (`updateCalendarNavLink()`), pievienota `?debugDate=` testēšanas iespēja. Pilns apraksts - `KALENDARS.md`
- Izveidots `FAILU_STRUKTURA.md` ar projekta failu struktūras pārskatu (`README.md` ir `.gitignore`-ots, tāpēc struktūras pārskatam izmantots cits fails)

### 🔲 Vēl nav izdarīts

**Ātri labojami:**
- `robots.txt` un `sitemap.xml` trūkst - apgrūtina meklētājprogrammu indeksāciju
- 3 jau iepriekš eksistējošas salauztas attēlu atsauces:
  - `assets/images/icons.ico/apple-icon-180x180.png` (`pages/form1.html`) - mape/fails neeksistē
  - `assets/images/logos/Riga-ENG-Logo-black.png` un `.../topicality/events/Riga-ENG-Logo-black.png` - reālais fails ir `Riga-ENG-Logo-black.png.webp` (dubultais paplašinājums)
- Citur vietnē (`index.html`, `pages/topicality.html`, `pages/about-us.html`, `pages/involved.html` u.c.) joprojām ir hotlinkoti baneru attēli no pexels.com/picflow.media - tas pats risks, kas piepildījās `memories.html` - vērts pārskatīt un lokalizēt arī tos

**UX puse:**
- Sākumlapas modālais popup atveras katru reizi, kad atver `index.html` - apsvērt rādīt tikai reizi sesijā/dienā (līdzīgi kā kontaktu popup ar `sessionStorage`)
- `popup_news` saraksts (`main.js`) aug bezgalīgi, vecās "pastāvīgās" ziņas nekad neizzūd - apsvērt ierobežot rādāmo skaitu

**Koda puse:**
- `loadTopicality()`/`loadNews()` (`topicality.js`/`main.js`) ielādē rakstus **secīgi** (`await` cilpā), nevis paralēli (`Promise.all`) - ar 30+ rakstiem tas ir lēnāk, nekā vajadzētu
- Nav `loading="lazy"` nevienam attēlam
- jQuery ielādēts katrā lapā, bet reāli izmantots tikai vienā vietā (`projects.js` karuseļa paraksti) - varētu aizstāt ar vanilla JS un izmest atkarību
- Karuseļa slaidu paraksti (`captionsForTETE` u.c.) hardkodēti `projects.js`, nevis `projects.json` - viegli aizmirstams, pievienojot jaunu projektu ar galeriju
- HTML/CSS klases (piem. `btn btn-info`) iekļautas tieši `projects.json` teksta laukos - sasaista datus ar konkrētu Bootstrap versiju
- Nav automatizētas pārbaudes, vai `topicality.js`/`main.js`/`projects.json` minētie faili tiešām eksistē mapēs (palīdzētu pret "aizmirsu pievienot failu" kļūdām)
