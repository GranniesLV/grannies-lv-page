import {scrollToTop, toggleScrollButton} from "./additionalFunc.js";

// Funkcija, lai ielādētu komponentus (header un footer) un organizētu chat-pop-up ..
async function loadComponent(id, file) {
  try {
    const response = await fetch(`/components/${file}`);
    if (!response.ok) throw new Error(`Neizdevās ielādēt: ${file}`);
    document.getElementById(id).innerHTML = await response.text();

    // Ja ielādētais fails ir footer.html, tad izsauc SVG apstrādi
    if (id === "footer") {
      console.log("Footer ielādēts!");
      handleSvgIcons();

      // Pop-up funkcionalitāte
      const chatPopUp = document.getElementById("chat-pop-up");
      const icon1 = document.getElementById("icon1");

      // Funkcija, lai aizvērtu pop-up
      const closePopUp = () => {
        chatPopUp.classList.remove("active");
        chatPopUp.classList.add("hidden");
      };

      // Funkcija, lai atvērtu pop-up
      const openPopUp = () => {
        chatPopUp.classList.remove("hidden");
        chatPopUp.classList.add("active");
      };

      // Pievienojam klikšķa notikumu ikonas klikšķim (ja tiek nospiesta #icon1)
      icon1.addEventListener("click", (event) => {
        if (!chatPopUp.classList.contains("active")) {
          openPopUp();
        } else {
          closePopUp();
        }
        event.stopPropagation(); // Novēršam klikšķa pārnešanu uz dokumentu
      });

      chatPopUp.addEventListener("click", (event) => {
        if (!chatPopUp.classList.contains("active")) {
          openPopUp();
        } else {
          closePopUp();
        }
        event.stopPropagation(); // Novēršam klikšķa pārnešanu uz dokumentu
      });

      // Pievienojam klikšķa notikumu ārpus pop-up, lai aizvērtu to, ja klikšķis ir ārpus tā
      document.addEventListener("click", (event) => {
        if (!chatPopUp.contains(event.target)) {
          closePopUp();
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}



// Funkcija, kas apstrādā SVG pēc ielādes
function handleSvgIcons() {
  const svgs = document.querySelectorAll(".icon svg");
  const a = document.querySelectorAll(".additional-icons a");
  console.log("Atrasto SVG skaits:", svgs.length);
  console.log("Atrasto A tag skaits:", a.length);
  

  svgs.forEach((svg) => {
    svg.addEventListener("click", () => {
      console.log("Klikšķis uz:", svg.classList);
    });
  });
}

// Funkcija dropdown loģikas inicializācijai
function initializeDropdowns() {
  if (window.innerWidth >= 992) {
    let dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(function (dropdown) {
      let menu = dropdown.querySelector(".dropdown-menu");
      let toggle = dropdown.querySelector(".dropdown-toggle");

      // Hover uz dropdown pogas, lai atvērtu izvēlni
      dropdown.addEventListener("mouseenter", function () {
        closeAllDropdowns();
        menu.classList.add("show");
        toggle.setAttribute("aria-expanded", "true");
      });

      // Hover no dropdown pogas, lai aizvērtu izvēlni
      dropdown.addEventListener("mouseleave", function () {
        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      });

      // Klikšķis uz dropdown nosaukuma, lai pārietu uz attiecīgo saiti
      toggle.addEventListener("click", function (event) {
        event.preventDefault();

        let link = toggle.getAttribute("href");
        if (link) {
          if (link.startsWith("#")) {
            // Ja saite ir ID (iekšējā navigācija), ritinām līdz sadaļai
            const target = document.querySelector(link);
            if (target) {
              setTimeout(() => {
                target.scrollIntoView({behavior: "smooth"});
              }, 500);
            }
          } else {
            // Ja ir ārējā saite, pārejam uz to
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

      // Pārbaude, vai ir pieejami dropdown-item elementi
      let dropdownItems = dropdown.querySelectorAll(".dropdown-item");

      dropdownItems.forEach(function (item) {
        item.addEventListener("click", function () {
          // Noņem 'active' klasi no visiem citiem itemiem
          dropdownItems.forEach(function (i) {
            i.classList.remove("active");
          });

          // Pievieno 'active' klasi noklikšķinātajam item
          item.classList.add("active");
        });
      });
    });

    // Aizvērt visas dropdown izvēlnes
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

// Funkcija, lai pārvaldītu aktīvo navigācijas saiti (iekļaujot footer sadaļu)
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(
    ".nav-link, .dropdown-item, footer a"
  );
  const currentPath = window.location.pathname + window.location.hash;

  // Ja atrodamies sākumlapā tad active klase netiek pievienota nekam
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

      // Pārbaudām, vai saites ceļš sakrīt ar pašreizējo ceļu
      if (linkPath === currentPath) {
        link.classList.add("active");

        // Ja aktīvais links ir dropdown-item, pievieno 'active' arī dropdown-toggle
        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          const dropdownToggle =
            parentDropdown.querySelector(".dropdown-toggle");
          if (dropdownToggle) {
            dropdownToggle.classList.add("active");
          }
        }

        // Papildus - Atrodam visus linkus ar šo pašu href un pievienojam tiem 'active' klasi
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


// Izsaucam sākotnēji, kad lapa ielādējas
document.addEventListener("DOMContentLoaded", async function () {
  // Ielādējam header, footer komponentes
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");

  // Pievienojam scroll-to-top funkcionalitāti banerim
  const banner = document.getElementById("scroll-to-top");
  if (banner) {
    banner.addEventListener("click", scrollToTop);
  }

  setActiveNavLink();
  initializeDropdowns();
  initFormValidation();

  // Pēc lapas ielādes, ja URL ir #id, ritinām līdz attiecīgajai sadaļai
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
