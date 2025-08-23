const oldCalendarData = {
  8: {
    name: "Augusts",
    page: 13,
    image: "august25.png",
    description: "Vasaras noslēgums",
  },
};

const newCalendarData = {
  9: {
    name: "Septembris",
    page: 2,
    image: "september25.png",
    description: "Rudens ražas svētki",
  },
  10: {
    name: "Oktobris",
    page: 3,
    image: "october25.png",
    description: "Rudens krāsas un daba",
  },
  11: {
    name: "Novembris",
    page: 4,
    image: "november25.png",
    description: "Pateicības laiks",
  },
  12: {
    name: "Decembris",
    page: 5,
    image: "december25.png",
    description: "Ziemassvētku laiks",
  },
  1: {
    name: "Janvāris",
    page: 6,
    image: "january26.png",
    description: "Jaunā gada sākums",
  },
  2: {
    name: "Februāris",
    page: 7,
    image: "february26.png",
    description: "Mīlestības mēnesis",
  },
  3: {
    name: "Marts",
    page: 8,
    image: "march26.png",
    description: "Pavasara atmoda",
  },
  4: {
    name: "Aprīlis",
    page: 9,
    image: "april26.png",
    description: "Lieldienu svinības",
  },
  5: {
    name: "Maijs",
    page: 10,
    image: "may26.png",
    description: "Pavasara ziedēšana",
  },
  6: {
    name: "Jūnijs",
    page: 11,
    image: "june26.png",
    description: "Vasaras sākums",
  },
  7: {
    name: "Jūlijs",
    page: 12,
    image: "july26.png",
    description: "Vasaras prieki",
  },
  8: {
    name: "Augusts",
    page: 13,
    image: "august26.png",
    description: "Vasaras noslēgums",
  },
};

// Atrodi elementus
const descriptionEl = document.getElementById("calendar-description");
const imageEl = document.getElementById("calendar-image");
const linkEl = document.getElementById("calendar-link");
const buttonEl = document.getElementById("calendar-button");

// PDF failu ceļi
const oldCalendarFile = "/assets/documents/kalendars.pdf";
const newCalendarFile = "/assets/documents/kalendars25_26.pdf";

// Pašreizējais datums
const today = new Date();
//const today = new Date(2026, 0, 6);
const currentMonth = today.getMonth() + 1; // 1–12
const currentYear = today.getFullYear();
console.log(currentMonth, currentYear);

// Atlasām kurš datu avots jāņem
let calendarData, calendarFile;

// Līdz 2025. augustam → old
if (currentYear === 2025 && currentMonth === 8) {
  calendarData = oldCalendarData;
  calendarFile = oldCalendarFile;
  console.log("Using old calendar data");
} else {
  calendarData = newCalendarData;
  calendarFile = newCalendarFile;
  console.log("Using new calendar data");
}

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
