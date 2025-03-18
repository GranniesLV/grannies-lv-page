export function scrollToTop() {
  window.scrollTo({
    top: 0, // Lapas sākums
    behavior: "smooth", // Pārejas efekts
  });
}

// Funkcija, kas pārbauda skrolla pozīciju un attiecīgi rāda vai slēpj pogu
export function toggleScrollButton() {
  const scrollButton = document.getElementById("scroll-to-top");
  
  if (window.scrollY > 200) { // Ja esam vairāk nekā 200px no augšas
    scrollButton.style.display = "flex";
  } else {
    scrollButton.style.display = "none";
  }
}

// Pievienojam event listeneri, lai palaistu funkciju katru reizi, kad notiek skrollēšana
window.addEventListener("scroll", toggleScrollButton);