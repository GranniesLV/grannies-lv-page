// ============================================================
//  KALENDĀRA DATI - maini šo sadaļu, lai atjaunotu informāciju
//
//  Pilns apraksts, kā šī sistēma strādā un kā pievienot jaunu
//  kalendāra gadu, atrodams failā KALENDARS.md (projekta saknē).
//
//  Īsumā: katrs kalendāra gads (piem. 2026/2027) ir viens objekts
//  masīvā `calendarPeriods`. Sistēma pati izvēlas pareizo periodu
//  pēc šodienas datuma - NAV jāraksta gadu skaitļi "if" nosacījumos.
// ============================================================

const calendarPeriods = [
  // ← JAUNU GADU PIEVIENO ŠEIT (AUGŠĀ, jaunākais pirmais)
  {
    id: "2026-2027",
    from: "2026-09", // ietverošs - periods sākas šī mēneša 1. datumā
    to: "2027-08", // ietverošs - periods beidzas šī mēneša beigās
    file: "/assets/documents/kalendars26_27.pdf",
    defaultImage: "defaultCalendar26_27.jpg",
    months: {
      9: { name: "Septembris", page: 2, image: "september26.jpg", description: "Sveicieni un iepazīšanās" },
      10: { name: "Oktobris", page: 3, image: "october26.jpg", description: "Nedēļas dienas un laiks" },
      11: { name: "Novembris", page: 4, image: "november26.jpg", description: "Ģimene un radinieki" },
      12: { name: "Decembris", page: 5, image: "december26.jpg", description: "Svētki un Ziemassvētki" },
      1: { name: "Janvāris", page: 6, image: "january27.jpg", description: "Ēdiens un maltītes" },
      2: { name: "Februāris", page: 7, image: "february27.jpg", description: "Laikapstākļi un gadalaiki" },
      3: { name: "Marts", page: 8, image: "march27.jpg", description: "Ikdienas rutīna" },
      4: { name: "Aprīlis", page: 9, image: "april27.jpg", description: "Veselība un ķermenis" },
      5: { name: "Maijs", page: 10, image: "may27.jpg", description: "Iepirkšanās un nauda" },
      6: { name: "Jūnijs", page: 11, image: "june27.jpg", description: "Transports un ceļošana" },
      7: { name: "Jūlijs", page: 12, image: "july27.jpg", description: "Pulkstenis un laiks" },
      8: { name: "Augusts", page: 13, image: "august27.jpg", description: "Hobiji un brīvais laiks" },
    },
  },
  {
    id: "2025-2026",
    from: "2025-09",
    to: "2026-08",
    file: "/assets/documents/kalendars25_26.pdf",
    defaultImage: "defaultCalendar25_26.jpg",
    months: {
      9: { name: "Septembris", page: 2, image: "september25.jpg", description: "Rudens ražas svētki" },
      10: { name: "Oktobris", page: 3, image: "october25.jpg", description: "Rudens krāsas un daba" },
      11: { name: "Novembris", page: 4, image: "november25.jpg", description: "Pateicības laiks" },
      12: { name: "Decembris", page: 5, image: "december25.jpg", description: "Ziemassvētku laiks" },
      1: { name: "Janvāris", page: 6, image: "january26.jpg", description: "Jaunā gada sākums" },
      2: { name: "Februāris", page: 7, image: "february26.jpg", description: "Mīlestības mēnesis" },
      3: { name: "Marts", page: 8, image: "march26.jpg", description: "Pavasara atmoda" },
      4: { name: "Aprīlis", page: 9, image: "april26.jpg", description: "Lieldienu svinības" },
      5: { name: "Maijs", page: 10, image: "may26.jpg", description: "Pavasara ziedēšana" },
      6: { name: "Jūnijs", page: 11, image: "june26.jpg", description: "Vasaras sākums" },
      7: { name: "Jūlijs", page: 12, image: "july26.jpg", description: "Vasaras prieki" },
      8: { name: "Augusts", page: 13, image: "august26.jpg", description: "Vasaras noslēgums" },
    },
  },
];

// ============================================================

// Pārvērš gadu+mēnesi vienā salīdzināmā skaitlī (piem. 2026-09 -> 24321)
function toComparable(year, month) {
  return year * 12 + month;
}

// Atrod aktīvo periodu pēc dotā datuma. Ja datums neietilpst nevienā zināmajā
// periodā (piem. aizmirsts laikus pievienot jaunu gadu, vai ļoti sena/nākotnes
// pārbaude ar ?debugDate=) - atgriež null, lai to varētu skaidri parādīt lietotājam,
// nevis izlikties, ka tas ir cits, nepareizs mēnesis.
function findActivePeriod(date) {
  const current = toComparable(date.getFullYear(), date.getMonth() + 1);

  for (const period of calendarPeriods) {
    const [fromYear, fromMonth] = period.from.split("-").map(Number);
    const [toYear, toMonth] = period.to.split("-").map(Number);
    if (current >= toComparable(fromYear, fromMonth) && current <= toComparable(toYear, toMonth)) {
      return period;
    }
  }

  return null;
}

// Ļauj notestēt nākotnes/pagātnes datumus bez sistēmas datuma maiņas -
// pievieno lapas adresei "?debugDate=2026-09-05" (skat. KALENDARS.md).
function getEffectiveDate() {
  const params = new URLSearchParams(window.location.search);
  const debugDate = params.get("debugDate");
  if (debugDate) {
    const parsed = new Date(debugDate);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

// Galvenes navigācijas "Kalendārs" saite (components/header.html) - jāsauc
// KATRĀ lapā uzreiz pēc galvenes ielādes, nevis tikai tur, kur rāda kalendāra widgetu.
// Šī saite VIENMĒR ved uz kādu PDF (nevis konkrētu mēnesi) - tāpēc, ja šodienas datums
// neietilpst nevienā periodā, izmantojam jaunāko zināmo periodu (calendarPeriods[0]),
// nevis rādām salauztu saiti.
export function updateCalendarNavLink() {
  const navLinkEl = document.getElementById("nav-calendar-link");
  if (!navLinkEl) return;
  const period = findActivePeriod(getEffectiveDate()) || calendarPeriods[0];
  navLinkEl.href = period.file;
}

export function initCalendar() {
  const descriptionEl = document.getElementById("calendar-description");
  const imageEl = document.getElementById("calendar-image");
  const linkEl = document.getElementById("calendar-link");
  const buttonEl = document.getElementById("calendar-button");

  if (!descriptionEl || !imageEl || !linkEl || !buttonEl) return;

  const today = getEffectiveDate();
  const period = findActivePeriod(today);
  const data = period && period.months[today.getMonth() + 1];

  if (period && data) {
    descriptionEl.innerHTML = `<b>${data.name}</b>: ${data.description}`;
    imageEl.src = `/assets/images/calendar/${data.image}`;
    linkEl.href = `${period.file}#page=${data.page}`;
    buttonEl.href = `${period.file}#page=${data.page}`;
  } else {
    // Datums neietilpst nevienā zināmajā periodā (vai retajā gadījumā, kad periodam
    // trūkst datu konkrētam mēnesim) - rādām noklusēto attēlu no jaunākā zināmā perioda
    descriptionEl.innerHTML = "Kalendārs nav pieejams šim mēnesim.";
    imageEl.src = `/assets/images/calendar/${calendarPeriods[0].defaultImage}`;
    linkEl.href = "#";
    buttonEl.href = "#";
    buttonEl.classList.add("disabled");
  }
}

// Automātiski izsauc recommend.html lapai (tur calendarData.js ir ielādēts tieši)
initCalendar();
