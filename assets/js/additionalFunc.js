export function scrollToTop() {
  // Ja poga ir redzama, tad varam veikt skrolēšanu uz augšu
  const scrollButton = document.getElementById("scroll-to-top");

  if (scrollButton && scrollButton.style.display !== "none") {
    window.scrollTo({
      top: 0, // Lapas sākums
      behavior: "smooth", // Pārejas efekts
    });
  }
}

// Funkcija, kas pārbauda skrolla pozīciju un attiecīgi rāda vai slēpj pogu
export function toggleScrollButton() {
  const scrollButton = document.getElementById("scroll-to-top");

  // Pārbaudām, vai elements eksistē
  if (scrollButton) {
    if (window.scrollY > 200) {
      // Ja esam vairāk nekā 200px no augšas
      scrollButton.style.display = "flex";
    } else {
      scrollButton.style.display = "none";
    }
  }
}

// Pievienojam event listeneri, lai palaistu funkciju katru reizi, kad notiek skrollēšana
window.addEventListener("scroll", toggleScrollButton);
