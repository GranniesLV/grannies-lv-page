// Pamats projects.json
/* 
{
      "id": "",
      "title": "<i></i>",
      "subtitle": "",
      "date": "",
      "projectNumber": "",
      "timeframe": "",
      "projectTarget": "",
      "description": "",
      "carouselId": "",
      "carouselTextId": "",
      "defaultCarouselText": "",
      "gallery": []
    }
*/

document.addEventListener("DOMContentLoaded", function () {
  fetch("../assets/JSON/projects.json") // Ielādē JSON failu
    .then((response) => response.json()) // Parsē datus
    .then((data) => {
      const currentAccordion = document.getElementById(
        "currentProjectAccordion"
      );
      const realizedAccordion = document.getElementById("projectAccordion");

      // Parāda aktuālos projektus
      data.current.forEach((project) => {
        // Pārbaude, vai ir galerija
        const galleryHtml =
          project.gallery && project.gallery.length > 0
            ? project.gallery
                .map(
                  (image, index) => `
          <div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="../assets/images/${image}" class="d-block w-100" alt="project image">
          </div>`
                )
                .join("")
            : "";

        // Dokumenti, ja ir
        const documentHtml = project.documentUrl
          ? `<p>Iepazīties ar dokumentu var <a href="${project.documentUrl}" target="_blank">šeit</a>.</p>`
          : "";

        const documentHtml2 = project.documentUrl2
          ? `<p>Kalendārs atrodas <a href="${project.documentUrl2}" target="_blank">šeit</a>.</p>`
          : "";

        const projectHtml = `
    <div class="accordion-item" data-name="${project.title}" data-date="${
          project.date
        }">
      <h2 class="accordion-header" id="heading${project.id}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
          data-bs-target="#collapse${
            project.id
          }" aria-expanded="false" aria-controls="collapse${project.id}">
          <h4>${project.title}</h4>
        </button>
      </h2>

      <div id="collapse${
        project.id
      }" class="accordion-collapse collapse" aria-labelledby="heading${
          project.id
        }"
        data-bs-parent="#currentProjectAccordion">

        <div class="accordion-body">
          <p><strong>${project.subtitle || ""}</strong></p>
          <p><strong>Projekta Nr.:</strong> ${
            project.projectNumber || "N/A"
          }</p>
          <p><strong>Laiks:</strong> ${project.timeframe || "N/A"}</p>
          ${
            project.projectTarget
              ? `<p><strong>Projekta mērķis:</strong> ${project.projectTarget}</p>`
              : ""
          }
          <p>${project.description || ""}</p>
          ${documentHtml}
          ${documentHtml2}
          ${
            galleryHtml
              ? `
            <div class="container">
              <div id="${
                project.carouselId
              }" class="carousel slide mx-auto" data-bs-ride="carousel" style="width: 400px;">
                <div class="carousel-inner d-flex align-items-center" style="height: 400px;">
                  ${galleryHtml}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${
                  project.carouselId
                }" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${
                  project.carouselId
                }" data-bs-slide="next">
                  <span class="carousel-control-next-icon"></span>
                </button>
              </div>
              <div class="text-center mt-3">
                <h5 id="${project.carouselTextId}">
                  ${project.defaultCarouselText || ""}
                </h5>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

        currentAccordion.innerHTML += projectHtml;

        // pieslēdz caption maiņu, JA definēta
        if (project.carouselId && project.carouselTextId && project.captions) {
          changeCarouselText(project.carouselId, project.captions);
        }
      });

      // Parāda realizētos projektus
      data.realized.forEach((project) => {
        // Pārbaude, vai ir galerija, un tikai tad pievienot karuseļa sadaļu
        const galleryHtml =
          project.gallery && project.gallery.length > 0
            ? project.gallery
                .map(
                  (image, index) => `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                  <img src="../assets/images/${image}" class="d-block w-100" alt="meeting">
                </div>`
                )
                .join("")
            : "";

        const documentHtml = project.documentUrl
          ? `<p>Iepazīties ar dokumentu var <a href="${project.documentUrl}" target="_blank">šeit</a>.</p>`
          : "";

        const documentHtml2 = project.documentUrl2
          ? `<p>Kalendārs atrodas <a href="${project.documentUrl2}" target="_blank">šeit</a>.</p>`
          : "";

        const projectHtml = `
          <div class="accordion-item" data-name="${project.title}" data-date="${
          project.date
        }">
            <h2 class="accordion-header" id="heading${project.id}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse${
                  project.id
                }" aria-expanded="false" aria-controls="collapse${project.id}">
                <h4>${project.title}</h4>
              </button>
            </h2>
            <div id="collapse${
              project.id
            }" class="accordion-collapse collapse" aria-labelledby="heading${
          project.id
        }"
              data-bs-parent="#projectAccordion">
              <div class="accordion-body">
                <p><strong>${project.subtitle || ""}</strong></p>
                <p><strong>Projekta Nr.:</strong> ${
                  project.projectNumber || "N/A"
                }</p>
                <p><strong>Laiks:</strong> ${project.timeframe || "N/A"}</p>
                ${
                  project.projectTarget
                    ? `<p><strong>Projekta mērķis:</strong> ${project.projectTarget}</p>`
                    : ""
                }
                <p>${project.description || ""}</p>
                ${documentHtml}
                ${documentHtml2}
                ${
                  galleryHtml
                    ? `
                  <div class="container">
                    <div id="${project.carouselId}" class="carousel slide mx-auto" data-bs-ride="carousel" style="width: 400px;">
                      <div class="carousel-inner d-flex align-items-center" style="height: 400px;">
                        ${galleryHtml}
                      </div>
                      <button class="carousel-control-prev" type="button" data-bs-target="#${project.carouselId}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon"></span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#${project.carouselId}" data-bs-slide="next">
                        <span class="carousel-control-next-icon"></span>
                      </button>
                    </div>
                    <div class="text-center mt-3">
                      <h5 id="${project.carouselTextId}">
                      ${project.defaultCarouselText}
                      </h5>
                    </div>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        `;
        realizedAccordion.innerHTML += projectHtml;

        changeCarouselText("galleryCarouselTETE", captionsForTETE);
        changeCarouselText("galleryCarouselFlexibli", captionsForFlexibli);
        changeCarouselText("galleryCarouselInovation", captionsForInovation);
      });
    })
    .catch((error) => console.error("Kļūda ielādējot projektus:", error));
});

// Attēlu karuselis ar aprakstiem
const captionsForTETE = [
  "<i>Teaching English to Elderly</i> (TETE) nodarbība",
  "<i>Teaching English to Elderly</i> (TETE) Rīgas grupa saņēmusi APLIECĪBAS  - projekts noslēdzies, bet mācīšanās turpināsies!",
  "Every word learned opens a new door!",
  "Pēc projekta darba grupas apspriedes ar Lietuvas partneriem skaistajā ēkā <i>Ola Fondation</i>",
  "Biedrības <i>Vecmāmiņas.lv</i> Erasmus+ TETE noslēguma konferences dalībnieki 2024.gada vasarā.",
];

const captionsForFlexibli = [
  "Draudzības vakars Islandē bija iespaidīgs – kursu dalībnieki no 9 valstīm",
  "Draudzības vakars Islandē bija iespaidīgs – kursu dalībnieki no 9 valstīm",
  "Kursi beigušies sertifikāti un dāvanas saņemtas – grupa no Latvijas",
  "Nodarbība pie vienas no pasniedzējām - radoša, atraktīva! <br>Apguvām ļoti noderīgas metodes (gan bērnu, gan pieaugušo izglītošanas procesam).",
];

const captionsForInovation = [
  "Ziedojums Ukrainai",
  "Vēstures diena. Nodarbība un lekcija Valmieras muzejā - De Woldemer",
  "Aptaujā piedalījās 48 respondenti.",
  "Brīvprātīgo diena",
  "Valodas diena",
];

// Vispārīga funkcija, kas maina tekstu atkarībā no attēla
function changeCarouselText(carouselId, captionsArray) {
  $(`#${carouselId}`).on("slid.bs.carousel", function (event) {
    const index = event.to;
    document.getElementById(
      carouselId.replace("galleryCarousel", "carouselText")
    ).innerHTML = captionsArray[index];
  });
}

// funkcija, kas kārto pēc lietotāja nosacījuma
function sortProjects(sortBy) {
  const container = document.getElementById("projectsContainer");
  const projects = Array.from(
    container.getElementsByClassName("accordion-item")
  );

  // Funkcija, kas noņem visus HTML tagus no teksta
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  projects.sort((a, b) => {
    const nameA = stripHtml(a.dataset.name).toLowerCase();
    const nameB = stripHtml(b.dataset.name).toLowerCase();

    switch (sortBy) {
      case "name-asc":
        return nameA.localeCompare(nameB, "lv");
      case "name-desc":
        return nameB.localeCompare(nameA, "lv");
      case "date-desc":
      case "date-asc":
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return sortBy === "date-desc" ? dateB - dateA : dateA - dateB;
    }
  });

  // Ievieto sakārtotos projektus atpakaļ konteinerā
  const accordion = document.getElementById("projectAccordion");
  console.log("Sorting by:", sortBy);
  projects.forEach((project) => accordion.appendChild(project));
}

// funkcija, kas ļauj lietotājam sakārtot projektus pēc vajadzības
document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("sortOptions");

  // Uzliek noklusējuma vērtību "Jaunākie projekti"
  sortSelect.value = "date-desc";

  // Automātiski kārto pēc jaunākajiem projektiem, kad lapa ielādējas

  setTimeout(() => {
    sortProjects("date-desc");
  }, 1000);

  // Klausās izmaiņas, ja lietotājs maina kārtošanas veidu
  sortSelect.addEventListener("change", function () {
    sortProjects(this.value);
  });
});
