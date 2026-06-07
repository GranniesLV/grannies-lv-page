# Vecmāmiņas.lv - Claude instrukcijas

## Projekts
Biedrības "Vecmāmiņas.lv" mājas lapa. Valoda: **latviešu**. Framework: **Bootstrap 5.3**.

---

## Stila noteikumi
- Domuzīme: vienmēr **`-`**, nekad `—`
- Komentāri kodā: tikai ja nepieciešami, īsi
- Attēli bez `object-fit: cover` un `max-height` ierobežojumiem — izmantot `class="img-fluid rounded shadow-sm"`
- Attēliem, ko var uzklikšķināt, aplīt ar `<a href="..." target="_blank" rel="noopener noreferrer">`

---

## Jauna raksta pievienošana (Aktualitātes)

### 1. Izveidot raksta failu
- Mape: `articles/topicality/news/`
- Nosaukums: `GGGG-MM-DD_vieta_apraksts.html`
- `id` elementam jābūt unikālam camelCase formātā, piem. `id="biedribas15DzimsanasDiena"`
- Veidne: skatīt `articles/topicality/news/2026-05-23_viesite_15-dzimsanas-diena.html`

### 2. Pievienot sarakstam
- Fails: `assets/js/topicality.js`
- Masīvs: `topicalityNews` — pievieno augšā (jaunākais pirmais)

### 3. Popup (pēc izvēles)
- Mape: `modal_popup/`
- Veidne: skatīt `modal_popup/2026-04-25_riga_miera-kvartala-darbnca.html`
- Reģistrēt: `assets/js/main.js` → masīvs `popup_news` — pievieno augšā

---

## Jauna projekta pievienošana

- Fails: `assets/JSON/projects.json`
- Aktuālie projekti: `"current"` bloks — pievieno augšā
- Realizētie projekti: `"realized"` bloks
- `"id"` — unikāls skaitlis, pašlaik lielākais ir `15`, nākamais `16`
- `"date"` formāts: `GGGG-MM-DD` (vajadzīgs kārtošanai)
- Skatīt esošos ierakstus kā veidni

---

## Attēlu mapes
| Saturs | Mape |
|---|---|
| Aktualitāšu rakstu attēli | `assets/images/topicality/news/` |
| Notikumu attēli | `assets/images/topicality/events/` |
| Projektu attēli | `assets/images/projects/` |

---

## Galvenie faili
| Fails | Nozīme |
|---|---|
| `assets/js/topicality.js` | Aktualitāšu rakstu saraksti |
| `assets/js/main.js` | Popup jaunumu saraksts |
| `assets/JSON/projects.json` | Visi projekti |
| `pages/topicality.html` | Aktualitāšu lapa |
| `pages/projects.html` | Projektu lapa |
| `pages/about-us.html` | Par mums (tur atrodas Statūti `#statute`) |

---

## Esošie projekti (aktuālie)
| Nosaukums | Laiks | id |
|---|---|---|
| Soli pa solim darbībā | 20/05/2026 - 12/11/2026 | 15 |
| Kultūrizglītība Brasas apkaimes senioriem | 18/03/2026 - 10/06/2026 | 14 |
| KA1 projekts Pakāpieni | 01/06/2025 - 31/08/2026 | 13 |
