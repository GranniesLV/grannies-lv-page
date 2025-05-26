import {initFormValidation} from "./formValidation.js";
import {scrollToTop, toggleScrollButton} from "./additionalFunc.js";

// Funkcija komponentu ielādei
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

// Funkcija dropdown loģikas inicializācijai
function initializeDropdowns() {
  if (window.innerWidth >= 992) {
    let dropdowns = document.querySelectorAll(".dropdown");
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
        let link = toggle.getAttribute("href");
        if (link) {
          if (link.startsWith("#")) {
            const target = document.querySelector(link);
            if (target) {
              setTimeout(() => {
                target.scrollIntoView({behavior: "smooth"});
              }, 500);
            }
          } else {
            window.location.href = link;
          }
        } else {
          let isOpen = menu.classList.contains("show");
          closeAllDropdowns();
          if (!isOpen) {
            menu.classList.add("show");
            toggle.setAttribute("aria-expanded", "true");
          }
        }
      });

      let dropdownItems = dropdown.querySelectorAll(".dropdown-item");
      dropdownItems.forEach(function (item) {
        item.addEventListener("click", function () {
          dropdownItems.forEach(function (i) {
            i.classList.remove("active");
          });
          item.classList.add("active");
        });
      });
    });

    function closeAllDropdowns() {
      dropdowns.forEach(function (d) {
        let m = d.querySelector(".dropdown-menu");
        let t = d.querySelector(".dropdown-toggle");
        m.classList.remove("show");
        t.setAttribute("aria-expanded", "false");
      });
    }
  }
}

// Funkcija aktīvās navigācijas saites noteikšanai
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(
    ".nav-link, .dropdown-item, footer a"
  );
  const currentPath = window.location.pathname + window.location.hash;

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "index.html"
  ) {
    return;
  }

  navLinks.forEach((link) => {
    try {
      if (!link.href || link.href === "#") {
        return;
      }

      const linkURL = new URL(link.href, window.location.origin);
      const linkPath = linkURL.pathname + linkURL.hash;

      if (linkPath === currentPath) {
        link.classList.add("active");

        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          const dropdownToggle =
            parentDropdown.querySelector(".dropdown-toggle");
          if (dropdownToggle) {
            dropdownToggle.classList.add("active");
          }
        }

        document
          .querySelectorAll(`a[href='${link.href}']`)
          .forEach((matchingLink) => {
            matchingLink.classList.add("active");
          });
      } else {
        link.classList.remove("active");
      }
    } catch (error) {
      console.error("Kļūda apstrādājot linku:", link, error);
    }
  });
}

// Dokumenta ielādes funkcionalitāte
document.addEventListener("DOMContentLoaded", async function () {
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");
  await loadComponent("contact-pop-up", "contact-pop-up.html");
  await loadComponent("scroll-to-top", "scroll-to-top.html");

  const banner = document.getElementById("scroll-to-top");
  if (banner) {
    banner.addEventListener("click", scrollToTop);
  }

  setActiveNavLink();
  initializeDropdowns();
  initFormValidation();

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }
  }
});

window.onload = function () {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }
  }
};

window.addEventListener("scroll", toggleScrollButton);

// Funkcija kontaktu pop-up loga inicializācijai
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

  const contactClosed = sessionStorage.getItem("contactClosed") === "true";

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    openPopUp();
  } else if (!contactClosed) {
    openPopUp();
  }

  chatHeartIcon.addEventListener("click", (event) => {
    if (!contactPopUp.classList.contains("active")) {
      openPopUp();
    } else {
      closePopUp();
    }
    event.stopPropagation();
  });

  closeBtn.addEventListener("click", (event) => {
    closePopUp();
    event.stopPropagation();
  });

  contactPopUp.addEventListener("click", (event) => {
    if (!contactPopUp.classList.contains("active")) {
      openPopUp();
    } else {
      closePopUp();
    }
    event.stopPropagation();
  });
}

// Funkcija SVG ikonu apstrādei pēc ielādes
function handleSvgIcons() {
  const svgs = document.querySelectorAll(".icon svg");
  const a = document.querySelectorAll(".additional-icons a");

  svgs.forEach((svg) => {
    svg.addEventListener("click", () => {
      console.log("Klikšķis uz:", svg.classList);
    });
  });
}

// Funkcija validācijas apstrādei un formu iesniegšanai
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();

          const formData = new FormData(form);
          fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {Accept: "application/json"},
          })
            .then((response) => {
              if (response.ok) {
                alert("Paldies! Jūsu anketa ir iesniegta.");
                form.reset();
                form.classList.remove("was-validated");

                window.location.href =
                  "https://vecmaminas.lv/pages/involved.html";
              } else {
                alert("Radās kļūda. Lūdzu, mēģiniet vēlreiz.");
              }
            })
            .catch((error) => {
              alert("Savienojuma kļūda. Mēģiniet vēlreiz.");
            });
        }

        form.classList.add("was-validated");
      },
      false
    );
  }
});

// Lasīt vairāk... pogas loģika ar klasi
document.addEventListener("DOMContentLoaded", function () {
  const readMoreButtons = document.querySelectorAll(".readMoreText");

  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const moreSection = this.closest(".clearfix").querySelector(".more");
      if (moreSection) {
        const isVisible = moreSection.style.display === "block";
        moreSection.style.display = isVisible ? "none" : "block";
        this.textContent = isVisible ? "Lasīt tālāk..." : "Rādīt mazāk";
      }
    });
  });
});


// Modālā loga atvēršana pēc lapas ielādes
window.onload = function () {
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    let myModal = new bootstrap.Modal(
      document.getElementById("newsPopUpModal")
    );
    myModal.show();
  }
};

// Kalendārs jaunumu sadaļā
// Definē mēnešus un datus
const calendarData = {
  4: {
    name: "Aprīlis",
    page: 9,
    image: "april.png",
    description: "Jaunais Vārdu Krājums",
  },
  5: {
    name: "Maijs",
    page: 10,
    image: "may.png",
    description: "Jaunais Vārdu Krājums",
  },
  6: {
    name: "Jūnijs",
    page: 11,
    image: "june.png",
    description: "Jaunais Vārdu Krājums",
  },
  7: {
    name: "Jūlijs",
    page: 12,
    image: "july.png",
    description: "Jaunais Vārdu Krājums",
  },
  8: {
    name: "Augusts",
    page: 13,
    image: "august.png",
    description: "Jaunais Vārdu Krājums",
  },
};

// Atrodi elementus
const descriptionEl = document.getElementById('calendar-description');
const imageEl = document.getElementById('calendar-image');
const linkEl = document.getElementById('calendar-link');
const buttonEl = document.getElementById('calendar-button');

// Iegūsti šī brīža mēnesi
const currentMonth = new Date().getMonth() + 1; // getMonth() dod 0-11, tāpēc +1

if (calendarData[currentMonth]) {
  const data = calendarData[currentMonth];
  descriptionEl.innerHTML = `<b>${data.name}</b>: ${data.description}`;
  imageEl.src = `./assets/images/calendar/${data.image}`;
  linkEl.href = `./assets/documents/kalendars.pdf#page=${data.page}`;
  buttonEl.href = `./assets/documents/kalendars.pdf#page=${data.page}`;
} else {
  // Ja ārpus definētajiem mēnešiem, piemēram, rudenī vai ziemā
  descriptionEl.innerHTML = 'Kalendārs nav pieejams šim mēnesim.';
  imageEl.src = './assets/images/calendar/defaultCalendar.png';
  linkEl.href = '#';
  buttonEl.href = '#';
  buttonEl.classList.add('disabled');
}

