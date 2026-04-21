import {initFormValidation} from "./formValidation.js";
import {scrollToTop, toggleScrollButton, scrollToHash} from "./additionalFunc.js";
import {loadTopicality} from "./topicality.js";
import {initCalendar} from "./calendarData.js";

// ============================================================
//  ZIŅU SARAKSTS -šeit pievieno jaunas ziņas
//  Jaunākā ziņa -AUGŠĀ. Vecākā -APAKŠĀ.
// ============================================================

const popup_news = [
  // ← JAUNU ZIŅU PIEVIENO ŠEIT (augšā)

  "2026-04-25_riga_miera-kvartala-darbnca.html",
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
