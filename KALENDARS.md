# Kalendāra sistēma

Apraksta, kā darbojas ikmēneša kalendāra widgets (sākumlapas popup un `pages/recommend.html`)
un galvenes navigācijas "Kalendārs" saite (`components/header.html`).

## Kur kas atrodas

| Kas | Kur |
|---|---|
| Loģika un dati | `assets/js/calendarData.js` |
| Kalendāra mēnešu attēli | `assets/images/calendar/` |
| Kalendāra PDF faili | `assets/documents/kalendars<GG>_<GG>.pdf` |
| Widgets sākumlapā | `modal_popup/kalendars.html` (ielādēts caur `popup_news` sarakstu `main.js`) |
| Widgets "Iesakām" lapā | `pages/recommend.html` (`calendarData.js` ielādēts tieši ar `<script type="module">`) |
| Galvenes "Kalendārs" saite | `components/header.html` → `<a id="nav-calendar-link">` |

## Kā tas strādā

`assets/js/calendarData.js` satur masīvu `calendarPeriods` - katrs objekts ir **viens kalendāra
gads** (piem. Sept 2026 - Aug 2027), ar:

- `id` - brīvi izvēlēts identifikators (tikai lasāmībai)
- `from` / `to` - `"GGGG-MM"` formātā, **ietverošs** diapazons (periods ir spēkā no `from` 1.
  datuma līdz `to` mēneša pēdējai dienai)
- `file` - ceļš uz PDF failu
- `defaultImage` - attēls, ko rādīt, ja šodienas mēnesim datu nav (parasti nenotiek, jo katram
  periodam ir definēti visi 12 mēneši)
- `months` - objekts ar atslēgu `1`-`12` (mēneša numurs), vērtība `{name, page, image,
  description}`

Funkcija `findActivePeriod(date)` salīdzina doto datumu ar katra perioda `from`/`to` un atgriež
pirmo atbilstošo. **Nekur nav hardkodēts konkrēts gads** ("if šis gads un šis mēnesis") - tāpēc
sistēma pati pareizi pārslēdzas nākamajā periodā, tiklīdz pienāk `from` datums, bez koda izmaiņām.

Ja šodienas datums neietilpst **nevienā** definētajā periodā (piem. aizmirsts laikus pievienot
jaunu gadu, un vecais periods jau beidzies; vai sena pagātne pirms pirmā perioda) - kalendāra
widgets (`initCalendar()`) rāda skaidru ziņu **"Kalendārs nav pieejams šim mēnesim."** ar jaunākā
zināmā perioda noklusēto attēlu un deaktivizētu pogu, **nevis** izliekas, ka tas ir kāds cits,
nepareizs mēnesis. Galvenes "Kalendārs" saite (`updateCalendarNavLink()`) šajā gadījumā tomēr
vienmēr ved uz jaunāko zināmo PDF (`calendarPeriods[0]`) - tā ir vispārīga saite, nevis konkrēta
mēneša saite, tāpēc tai nav jēgas rādīt "nav pieejams".

`initCalendar()` atjauno kalendāra widgetu (`#calendar-description`, `#calendar-image`,
`#calendar-link`, `#calendar-button`) - izsaukta sākumlapā (`main.js`, tikai pēc `loadNews()`, jo
elementi ir `modal_popup/kalendars.html` fragmentā) un tieši `pages/recommend.html`.

`updateCalendarNavLink()` atjauno tikai galvenes "Kalendārs" saiti (`#nav-calendar-link`) - izsaukta
**katrā lapā** uzreiz pēc galvenes ielādes (`main.js`, `DOMContentLoaded`), jo galvene ielādējas
visur, ne tikai tur, kur rāda pašu kalendāra widgetu.

## Kā pievienot jaunu kalendāra gadu (piem. 2027/2028)

1. Iemet jaunā gada bildes/PDF `assets/images/_jaunas/` un apstrādā pēc `CLAUDE.md` → "Jaunu
   attēlu pievienošana" instrukcijas (pārsaukšana, saspiešana, pārvietošana uz
   `assets/images/calendar/` un `assets/documents/`)
   - Attēlu nosaukumi: `<menesis-en><GG>.jpg` (piem. `september27.jpg`), pirmās PDF lapas attēls
     (vāks) → `defaultCalendar<GG>_<GG>.jpg`
   - PDF: `kalendars<GG>_<GG>.pdf`
2. Pievieno jaunu objektu `calendarPeriods` masīva **augšā** (`assets/js/calendarData.js`) ar
   pareiziem `from`/`to`, `file`, `defaultImage` un visiem 12 `months` ierakstiem (`page` -
   attiecīgā PDF lapas numurs)
3. Vecais periods paliek masīvā (kā vēsture/rezerve) - nav obligāti jādzēš

Pēc tam **nekas cits nav jāmaina** - navigācijas saite un abi widgeti pārslēgsies automātiski,
tiklīdz pienāks jaunā perioda `from` datums.

## Kā notestēt, ka nākotnes pārslēgšanās strādās pareizi

Lapas adresei var pievienot parametru `?debugDate=GGGG-MM-DD`, lai liktu kalendāram domāt, ka ir
cits datums, bez sistēmas datuma maiņas. Strādā jebkurā lapā, kur ielādējas `calendarData.js`.

Piemēri (lokāli vai `vecmaminas.lv`):

```
/index.html?debugDate=2026-09-01
/pages/recommend.html?debugDate=2026-09-01
/pages/recommend.html?debugDate=2027-08-31
/pages/recommend.html?debugDate=2027-09-05   ← pārbauda "periods nesakrīt" (nav definēts 2027/2028) - jāredz "Kalendārs nav pieejams šim mēnesim."
```

Pēc atvēršanas jāredz atbilstošā mēneša attēls/apraksts un saite uz pareizo PDF (var pārbaudīt arī
pele virs pogas "Aplūkot kalendāru" vai galvenes "Galerija → Kalendārs" saites, redzot URL).

`debugDate` neko neietekmē lietotājiem, kas to nenorāda - `getEffectiveDate()` bez šī parametra
vienkārši atgriež reālo šodienas datumu.
