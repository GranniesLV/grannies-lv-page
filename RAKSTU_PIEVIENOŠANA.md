# Kā pievienot jaunu rakstu Aktualitātēm

## Struktūra

Visi raksti glabājas mapē `articles/topicality/` trijās apakšmapēs:

| Mape                              | Sadaļa lapā                  | Konteiners                         |
| --------------------------------- | ---------------------------- | ---------------------------------- |
| `articles/topicality/news/`       | Jaunumi                      | `#topicality-news-container`       |
| `articles/topicality/events/`     | Notikumi                     | `#topicality-events-container`     |
| `articles/topicality/university/` | Trešās paaudzes universitāte | `#topicality-university-container` |

Failu saraksti atrodas `assets/js/main.js` -masīvi `topicalityNews`, `topicalityEvents`, `topicalityUniversity`.

---

## Soļi: jauna raksta pievienošana

### 1. Izveido HTML failu

Faila nosaukuma formāts: `GGGG-MM-DD_pilseta_isissapraksts.html`

Piemērs: `2026-04-15_riga_jauna-lekcija.html`

**Faila saturs** -tikai raksta HTML fragments (bez `<html>`, `<head>`, `<body>`):

```html
<div class="container my-5" id="unikalsId">
  <h2 class="fw-bold text-center">Raksta virsraksts</h2>

  <p>Teksts...</p>

  <hr />
</div>
```

> **Svarīgi:** `id` atribūts `div` elementam ir vajadzīgs tikai tad, ja no citurienes ir saite uz šo rakstu (piem. no notikumu navigācijas pogām).

---

### 2. Pievieno faila nosaukumu `main.js`

Atver `assets/js/main.js` un atrodi atbilstošo masīvu (ap rindu ~432):

```javascript
const topicalityNews = [
  // ← JAUNU RAKSTU PIEVIENO ŠEIT (augšā)
  "2026-04-15_riga_jauna-lekcija.html",   // ← pievieno augšā
  "2026-03-30_riga_kristiga-fakultate.html",
  ...
];
```

**Kārtība:** Jaunākais raksts -**pirmais** masīvā (augšā). Vecākais -**pēdējais** (apakšā).

---

### 3. Notikumu navigācijas poga (tikai Events sadaļai)

Ja raksts ir sadaļā **Notikumi** un tam ir `id`, pievieno pogu `pages/topicality.html` notikumu pogu blokā (ap rindu ~70):

```html
<a href="#unikalsId" class="btn btn-info rounded-pill px-3 m-2" role="button">
  Notikuma nosaukums</a
>
```

---

## Piemērs: Pilns process (Jaunumi sadaļai)

**1.** Izveido failu `articles/topicality/news/2026-04-15_riga_jauna-lekcija.html`:

```html
<div class="container my-5">
  <h2 class="fw-bold text-center">Jaunā lekcija</h2>
  <p>Apraksts...</p>
  <hr />
</div>
```

**2.** `assets/js/main.js` masīvā `topicalityNews` pievieno augšā:

```javascript
const topicalityNews = [
  // ← JAUNU RAKSTU PIEVIENO ŠEIT (augšā)
  "2026-04-15_riga_jauna-lekcija.html",
  "2026-03-30_riga_kristiga-fakultate.html",
  ...
```

**3.** Gatavs.

---

## Kā darbojas tehniski

`main.js` funkcija `loadTopicality()` nolasa masīvus un ar `fetch()` ielādē katru HTML failu lapā.  
Raksti tiek ielādēti **tādā secībā, kādā tie ir masīvā** -tāpēc jaunākais jāliek augšā.
