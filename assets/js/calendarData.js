// ============================================================
//  KALENDĀRA DATI - maini šo sadaļu, lai atjaunotu informāciju
// ============================================================

const oldCalendarData = {
  8: { name: "Augusts",    page: 13, image: "august25.png",    description: "Vasaras noslēgums" },
};

const newCalendarData = {
  9:  { name: "Septembris", page: 2,  image: "september25.png", description: "Rudens ražas svētki" },
  10: { name: "Oktobris",   page: 3,  image: "october25.png",   description: "Rudens krāsas un daba" },
  11: { name: "Novembris",  page: 4,  image: "november25.png",  description: "Pateicības laiks" },
  12: { name: "Decembris",  page: 5,  image: "december25.png",  description: "Ziemassvētku laiks" },
  1:  { name: "Janvāris",   page: 6,  image: "january26.png",   description: "Jaunā gada sākums" },
  2:  { name: "Februāris",  page: 7,  image: "february26.png",  description: "Mīlestības mēnesis" },
  3:  { name: "Marts",      page: 8,  image: "march26.png",     description: "Pavasara atmoda" },
  4:  { name: "Aprīlis",    page: 9,  image: "april26.png",     description: "Lieldienu svinības" },
  5:  { name: "Maijs",      page: 10, image: "may26.png",       description: "Pavasara ziedēšana" },
  6:  { name: "Jūnijs",     page: 11, image: "june26.png",      description: "Vasaras sākums" },
  7:  { name: "Jūlijs",     page: 12, image: "july26.png",      description: "Vasaras prieki" },
  8:  { name: "Augusts",    page: 13, image: "august26.png",    description: "Vasaras noslēgums" },
};

const oldCalendarFile = "/assets/documents/kalendars.pdf";
const newCalendarFile = "/assets/documents/kalendars25_26.pdf";

// ============================================================

export function initCalendar() {
  const descriptionEl = document.getElementById("calendar-description");
  const imageEl = document.getElementById("calendar-image");
  const linkEl = document.getElementById("calendar-link");
  const buttonEl = document.getElementById("calendar-button");

  if (!descriptionEl || !imageEl || !linkEl || !buttonEl) return;

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const isOld = currentYear === 2025 && currentMonth === 8;
  const calendarData = isOld ? oldCalendarData : newCalendarData;
  const calendarFile = isOld ? oldCalendarFile : newCalendarFile;

  const data = calendarData[currentMonth];
  if (data) {
    descriptionEl.innerHTML = `<b>${data.name}</b>: ${data.description}`;
    imageEl.src = `/assets/images/calendar/${data.image}`;
    linkEl.href = `${calendarFile}#page=${data.page}`;
    buttonEl.href = `${calendarFile}#page=${data.page}`;
  } else {
    descriptionEl.innerHTML = "Kalendārs nav pieejams šim mēnesim.";
    imageEl.src = `/assets/images/calendar/defaultCalendar25_26.png`;
    linkEl.href = "#";
    buttonEl.href = "#";
    buttonEl.classList.add("disabled");
  }
}

// Automātiski izsauc recommend.html lapai (tur calendarData.js ir ielādēts tieši)
initCalendar();
