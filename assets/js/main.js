import {initFormValidation} from "./formValidation.js";
import {scrollToTop, toggleScrollButton} from "./additionalFunc.js";

// ============================================================
//  ZIŅU SARAKSTS -šeit pievieno jaunas ziņas
//  Jaunākā ziņa -AUGŠĀ. Vecākā -APAKŠĀ.
// ============================================================

const popup_news = [
  // ← JAUNU ZIŅU PIEVIENO ŠEIT (augšā)

  "2026-03-18_riga_lka-lekcijas-senioriem.html",
  "2025-10-01_riga_erasmus-balva.html",
  "apskati-jaunakos-notikumus.html",
  "2026-01-21_riga_vieslekija-lka.html",
  "2025-10-01_riga_tpu-atklasana.html",
  "2025-10-01_riga_lka-muzizglitiba-senioriem.html",
  "sekojiet-jaunumiem-fb-lapa.html",
  "2025-09-17_kuldiga_fb-senioru-festivals.html",
  "2025-06-05_portugal_fb-mobility-friends.html",
  "2025-03-25_rijeka_fb-hvala-rijeka.html",
  "kalendars.html",
];

// ============================================================
//  ZIŅU IELĀDĒTĀJS
// ============================================================

async function loadNews() {
  const container = document.getElementById("news-container");
  if (!container) return;

  // Notīra "Ielādē ziņas..." tekstu
  container.innerHTML = "";

  for (const fails of popup_news) {
    try {
      const response = await fetch(`/modal_popup/${fails}`);
      if (!response.ok) throw new Error(`Neizdevās ielādēt: ${fails}`);
      const html = await response.text();
      container.insertAdjacentHTML("beforeend", html);
    } catch (error) {
      console.error("Ziņu ielādes kļūda:", error);
    }
  }
}

// ============================================================
//  KOMPONENTU IELĀDE
// ============================================================

async function loadComponent(id, file) {
  try {
    const response = await fetch(`/components/${file}`);
    if (!response.ok) throw new Error(`Neizdevās ielādēt: ${file}`);
    document.getElementById(id).innerHTML = await response.text();

    if (id === "footer") {
      handleSvgIcons();
    }

    if (id === "contact-pop-up") {
      setupContactPopUp();
    }
  } catch (error) {
    console.error(error);
  }
}

// ============================================================
//  DROPDOWN LOĢIKA (hover uz desktop)
// ============================================================

function initializeDropdowns() {
  if (window.innerWidth >= 992) {
    let dropdowns = document.querySelectorAll(".dropdown");

    function closeAllDropdowns() {
      dropdowns.forEach(function (d) {
        d.querySelector(".dropdown-menu").classList.remove("show");
        d.querySelector(".dropdown-toggle").setAttribute(
          "aria-expanded",
          "false",
        );
      });
    }

    dropdowns.forEach(function (dropdown) {
      let menu = dropdown.querySelector(".dropdown-menu");
      let toggle = dropdown.querySelector(".dropdown-toggle");

      dropdown.addEventListener("mouseenter", function () {
        closeAllDropdowns();
        menu.classList.add("show");
        toggle.setAttribute("aria-expanded", "true");
      });

      dropdown.addEventListener("mouseleave", function () {
        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      });

      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        const link = toggle.getAttribute("href");
        if (link) {
          if (link.startsWith("#")) {
            const target = document.querySelector(link);
            if (target) {
              setTimeout(
                () => target.scrollIntoView({behavior: "smooth"}),
                500,
              );
            }
          } else {
            window.location.href = link;
          }
        } else {
          const isOpen = menu.classList.contains("show");
          closeAllDropdowns();
          if (!isOpen) {
            menu.classList.add("show");
            toggle.setAttribute("aria-expanded", "true");
          }
        }
      });

      dropdown.querySelectorAll(".dropdown-item").forEach(function (item) {
        item.addEventListener("click", function () {
          dropdown
            .querySelectorAll(".dropdown-item")
            .forEach((i) => i.classList.remove("active"));
          item.classList.add("active");
        });
      });
    });
  }
}

// ============================================================
//  AKTĪVĀ NAVIGĀCIJAS SAITE
// ============================================================

function setActiveNavLink() {
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  )
    return;

  const currentPath = window.location.pathname + window.location.hash;
  const navLinks = document.querySelectorAll(
    ".nav-link, .dropdown-item, footer a",
  );

  navLinks.forEach((link) => {
    try {
      if (!link.href || link.href === "#") return;

      const linkPath =
        new URL(link.href, window.location.origin).pathname +
        new URL(link.href, window.location.origin).hash;

      if (linkPath === currentPath) {
        link.classList.add("active");
        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          parentDropdown
            .querySelector(".dropdown-toggle")
            ?.classList.add("active");
        }
        document
          .querySelectorAll(`a[href='${link.href}']`)
          .forEach((el) => el.classList.add("active"));
      } else {
        link.classList.remove("active");
      }
    } catch (error) {
      console.error("Kļūda apstrādājot linku:", link, error);
    }
  });
}

// ============================================================
//  KONTAKTU POP-UP
// ============================================================

function setupContactPopUp() {
  const contactPopUp = document.getElementById("contact-pop-up");
  const chatHeartIcon = document.getElementById("chat-heart-fill");
  const closeBtn = document.getElementById("close-btn");

  if (!contactPopUp || !chatHeartIcon || !closeBtn) return;

  const closePopUp = () => {
    contactPopUp.classList.remove("active");
    contactPopUp.classList.add("hidden");
    sessionStorage.setItem("contactClosed", "true");
  };

  const openPopUp = () => {
    contactPopUp.classList.remove("hidden");
    contactPopUp.classList.add("active");
    sessionStorage.setItem("contactClosed", "false");
  };

  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";
  const contactClosed = sessionStorage.getItem("contactClosed") === "true";

  if (isHomePage || !contactClosed) openPopUp();

  chatHeartIcon.addEventListener("click", (event) => {
    contactPopUp.classList.contains("active") ? closePopUp() : openPopUp();
    event.stopPropagation();
  });

  closeBtn.addEventListener("click", (event) => {
    closePopUp();
    event.stopPropagation();
  });

  contactPopUp.addEventListener("click", (event) => {
    contactPopUp.classList.contains("active") ? closePopUp() : openPopUp();
    event.stopPropagation();
  });
}

// ============================================================
//  SVG IKONU APSTRĀDE
// ============================================================

function handleSvgIcons() {
  document.querySelectorAll(".icon svg").forEach((svg) => {
    svg.addEventListener("click", () =>
      console.log("Klikšķis uz:", svg.classList),
    );
  });
}

// ============================================================
//  FORMU VALIDĀCIJA UN IESNIEGŠANA
// ============================================================

function setupFormSubmit() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {Accept: "application/json"},
      })
        .then((response) => {
          if (response.ok) {
            alert("Paldies! Jūsu anketa ir iesniegta.");
            form.reset();
            form.classList.remove("was-validated");
            window.location.href = "https://vecmaminas.lv/pages/involved.html";
          } else {
            alert("Radās kļūda. Lūdzu, mēģiniet vēlreiz.");
          }
        })
        .catch(() => alert("Savienojuma kļūda. Mēģiniet vēlreiz."));

      form.classList.add("was-validated");
    },
    false,
  );
}

// ============================================================
//  "LASĪT VAIRĀK" POGAS
// ============================================================

function setupReadMore() {
  document.querySelectorAll(".readMoreText").forEach((button) => {
    button.addEventListener("click", function () {
      const moreSection = this.closest(".clearfix")?.querySelector(".more");
      if (!moreSection) return;
      const isVisible = moreSection.style.display === "block";
      moreSection.style.display = isVisible ? "none" : "block";
      this.textContent = isVisible ? "Lasīt tālāk..." : "Rādīt mazāk";
    });
  });
}

// ============================================================
//  KALENDĀRS -izsauc pēc modal_popup ielādes
// ============================================================

function initCalendar() {
  const descriptionEl = document.getElementById("calendar-description");
  const imageEl = document.getElementById("calendar-image");
  const linkEl = document.getElementById("calendar-link");
  const buttonEl = document.getElementById("calendar-button");

  // Ja elementi neeksistē -izejam
  if (!descriptionEl || !imageEl || !linkEl || !buttonEl) return;

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

  const oldCalendarFile = "/assets/documents/kalendars.pdf";
  const newCalendarFile = "/assets/documents/kalendars25_26.pdf";

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  let calendarData, calendarFile;
  if (currentYear === 2025 && currentMonth === 8) {
    calendarData = oldCalendarData;
    calendarFile = oldCalendarFile;
  } else {
    calendarData = newCalendarData;
    calendarFile = newCalendarFile;
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
}

// ============================================================
//  AKTUALITĀTES -saraksti
//  Jaunākais -AUGŠĀ. Vecākais -APAKŠĀ.
// ============================================================

const topicalityNews = [
  // ← JAUNU RAKSTU PIEVIENO ŠEIT (augšā)
  "2026-04-25_riga_miera-kvartala-darbnca.html",
  /* "2026-03-30_riga_kristiga-fakultate.html", */
  "2026-03-26_riga_kulturas-rondo.html",
  "2026-03-13_riga_valsts-prezidents.html",
  "2026-03-18_riga_lka-kulturas-lekciju-cikls.html",
  /* "2026-02-25_riga_kulturas-studijas.html", */
  "2026-01-21_riga_mes-un-kino.html",
  "2026-01-14_riga_kino-lekcija-aicinajums.html",
  "2026-01-22_riga_uzzini-ko-nezini.html",
];

const topicalityEvents = [
  // ← JAUNU NOTIKUMU PIEVIENO ŠEIT (augšā)
  // Katram ierakstam: file = faila nosaukums, id = HTML elementa id, label = pogas teksts (null = bez pogas)
  {
    file: "2026-03-30_riga_kristiga-fakultate.html",
    id: "kristigaFakultateLekcija",
    label: "Lieldienas un Klusā nedēļa",
  },
  {
    file: "2026-03-25_riga_rsu-veselibas-lekcija.html",
    id: "rsuLekcijaSenioriem",
    label: "Veselības fakultātes atklāšana",
  },
  {
    file: "2026-02-27_riga_kristiga-fakultate-afisa.html",
    id: "vieslekcijaAfisa",
    label: "Uzsāktas mācības Lutera Akadēmijas Kristīgajā fakultātē",
  },
  {
    file: "2026-02-27_riga_kristiga-fakultate.html",
    id: "kristigaFakultateNodarbiba",
    label: null,
  },
  {
    file: "2026-02-25_riga_grafiti-ielu-maksla.html",
    id: "kulturasFakultateGrafiti",
    label: "Nodarbība par grafiti un ielu mākslu",
  },
  {
    file: "2025-09-15_riga_eiropas-inovativas-balva.html",
    id: "eiropasInovativasMacisanasBalva",
    label: "Eiropas Inovatīvas mācīšanas balva",
  },
  {
    file: "2025-09-15_riga_eiropas-balva-video.html",
    id: "eiropasInovativasMacisanasBalvaVideo",
    label: null,
  },
  {
    file: "2026-02-04_riga_atkal-uz-kino.html",
    id: "atkalUzKino",
    label: "Un atkal uz kino",
  },
  {
    file: "2025-10-22_riga_otra-tiksanas.html",
    id: "otraTiksanas",
    label: "Otrā senioru tikšanās",
  },
  {
    file: "2025-10-01_riga_lka-tpu-atklasana.html",
    id: "tresasPaaudzesKulturasUniversitate",
    label: "Mūžizglītības piedāvājums senioriem",
  },
  {
    file: "2025-06-27_riga_sadarbibas-ligums.html",
    id: "sadarbibasLigumsArVidusdaugavasNVO",
    label: "Sadarbība ar Vidusdaugavas NVO centru",
  },
  {
    file: "2025-12-11_riga_erasmus-noslegums-viaa.html",
    id: "erasmusNoslegumsVIAA",
    label: "ErasmusPlus projektu noslēguma pasākums 2025",
  },
  {
    file: "2025-12-10_brisele_erasmus-balva.html",
    id: "erasmusBalvaBrisele",
    label: "Eiropas Inovatīvas mācīšanas balva Briselē",
  },
  {
    file: "2025-12-10_riga_tpu-semestra-noslegums.html",
    id: "tpuSemestraNoslegums",
    label: "Trešās paaudzes universitātes semestra noslēgums",
  },
  {
    file: "2025-09-17_kuldiga_senioru-festivals.html",
    id: "senioruFestivalsKuldiga",
    label: "Senioru festivāls Kuldīgā",
  },
  {
    file: "2025-06-11_riga_udens-gleznu-darbnicas.html",
    id: "udensGleznuDarbnica",
    label: "Ūdens gleznu un skaņu darbnīcas",
  },
  /* { file: "2025-03-15_riga_gada-parskats-2024.html",    id: "annualMeeting2024",                    label: "2024. gada pārskata sapulce" }, */
  {
    file: "2024_riga_macamies-anglu-valodu.html",
    id: "weAreLearningEnglish",
    label: "Mācāmies angļu valodu",
  },
  /* { file: "2024_riga_pilnveidojam-majas-lapu.html",     id: "improvingTheNewWebsite",               label: "Pilnveidojam jauno mājas lapu" }, */
];

const topicalityUniversity = [
  // ← JAUNU TPU RAKSTU PIEVIENO ŠEIT (augšā)
  "kas-ir-tpu.html",
  "2026-02-04_riga_kino-muzejs-ekskursija.html",
  "2025-12-19_riga_santa-raksts.html",
];

// ============================================================
//  AKTUALITĀTES -ielādētājs
// ============================================================

async function loadTopicality() {
  const isTopicality = window.location.pathname.includes("topicality");
  if (!isTopicality) return;

  const sections = [
    {
      list: topicalityNews,
      containerId: "topicality-news-container",
      folder: "news",
    },
    {
      list: topicalityEvents,
      containerId: "topicality-events-container",
      folder: "events",
      btnsId: "topicality-events-btns-container",
    },
    {
      list: topicalityUniversity,
      containerId: "topicality-university-container",
      folder: "university",
    },
  ];

  for (const section of sections) {
    const container = document.getElementById(section.containerId);
    if (!container || section.list.length === 0) continue;

    if (section.btnsId) {
      const btnsContainer = document.getElementById(section.btnsId);
      if (btnsContainer) {
        section.list.forEach((entry) => {
          if (typeof entry === "object" && entry.label) {
            const a = document.createElement("a");
            a.href = `#${entry.id}`;
            a.className = "btn btn-info rounded-pill px-3 m-2";
            a.setAttribute("role", "button");
            a.textContent = entry.label;
            btnsContainer.appendChild(a);
          }
        });
      }
    }

    for (const entry of section.list) {
      const file = typeof entry === "string" ? entry : entry.file;
      try {
        const response = await fetch(
          `/articles/topicality/${section.folder}/${file}`,
        );
        if (!response.ok) throw new Error(`Neizdevās ielādēt: ${file}`);
        const html = await response.text();
        container.insertAdjacentHTML("beforeend", html);
      } catch (error) {
        console.error("Aktualitāšu ielādes kļūda:", error);
      }
    }
  }

  // Pēc ielādes -scroll uz hash ja ir
  scrollToHash();
}

// ============================================================
//  HASH SCROLL PALĪGS
// ============================================================

function scrollToHash() {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) target.scrollIntoView({behavior: "smooth"});
  }
}

// ============================================================
//  GALVENĀ INICIALIZĀCIJA
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {
  // Ielādē komponentus
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");
  await loadComponent("contact-pop-up", "contact-pop-up.html");
  await loadComponent("scroll-to-top", "scroll-to-top.html");

  // Scroll to top poga
  const scrollBtn = document.getElementById("scroll-to-top");
  if (scrollBtn) scrollBtn.addEventListener("click", scrollToTop);

  // Navigācija
  setActiveNavLink();
  initializeDropdowns();

  // Formas
  initFormValidation();
  setupFormSubmit();

  // Hash scroll
  scrollToHash();

  // Ziņu ielāde (tikai sākumlapā)
  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";

  if (isHomePage) {
    await loadNews();
    initCalendar();

    // Atvērt modālo logu pēc ziņu ielādes
    const modalEl = document.getElementById("newsPopUpModal");
    if (modalEl) {
      const myModal = new bootstrap.Modal(modalEl);
      myModal.show();
    }
  }

  // Aktualitāšu lapa
  await loadTopicality();

  // Lasīt vairāk (pēc dinamiskā satura ielādes)
  setupReadMore();
});

window.addEventListener("scroll", toggleScrollButton);
window.addEventListener("load", scrollToHash);
