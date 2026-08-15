import {scrollToHash, normalizeSearchText} from "./additionalFunc.js";

// ============================================================
//  AKTUALITĀTES -saraksti
//  Jaunākais -AUGŠĀ. Vecākais -APAKŠĀ.
// ============================================================

export const topicalityNews = [
  // ← JAUNU RAKSTU PIEVIENO ŠEIT (augšā)
  "2026-08-15_riga_jaunais-macibu-gads.html",
  "2026-05-23_viesite_15-dzimsanas-diena.html",
  "2026-05-27_riga_lka-filmsanas-meistarklase.html",
  "2026-04-25_riga_miera-kvartala-ideju-darbnica.html",
  /* "2026-03-30_riga_kristiga-fakultate.html", */
  "2026-03-26_riga_kulturas-rondo.html",
  "2026-03-20_riga_2025-gada-parskata-sapulce.html",
  "2026-03-13_riga_valsts-prezidents.html",
  "2026-03-18_riga_lka-kulturas-lekciju-cikls.html",
  /* "2026-02-25_riga_kulturas-studijas.html", */
  "2026-01-21_riga_mes-un-kino.html",
  "2026-01-14_riga_kino-lekcija-aicinajums.html",
  "2026-01-22_riga_uzzini-ko-nezini.html",
];

export const topicalityEvents = [
  // ← JAUNU NOTIKUMU PIEVIENO ŠEIT (augšā)
  // Katram ierakstam: file = faila nosaukums, id = HTML elementa id, label = pogas teksts (null = bez pogas)
  {
    file: "2026-08-12_riga_datorprasmju-nodarbiba.html",
    id: "soliPaSolimDatorprasmesNodarbiba",
    label: "Pirmā nodarbība: datorprasmes",
  },
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

export const topicalityUniversity = [
  // ← JAUNU TPU RAKSTU PIEVIENO ŠEIT (augšā)
  "kas-ir-tpu.html",
  "2026-08-15_riga_makslas-akademijas-jumts.html",
  "2026-06-10_riga_tpu-izlaidums.html",
  "2026-02-04_riga_kino-muzejs-ekskursija.html",
  "2025-12-19_riga_santa-raksts.html",
];

// ============================================================
//  AKTUALITĀTES -ielādētājs
// ============================================================

export async function loadTopicality() {
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
      moreBtnsId: "topicality-events-btns-more-container",
      toggleBtnId: "topicality-events-toggle-btn",
      searchInputId: "events-search-input",
      suggestionsId: "events-search-suggestions",
      visibleBtnCount: 5,
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

    let btnsContainer = null;
    let moreContainer = null;

    if (section.btnsId) {
      btnsContainer = document.getElementById(section.btnsId);
      moreContainer = section.moreBtnsId
        ? document.getElementById(section.moreBtnsId)
        : null;
      const toggleBtn = section.toggleBtnId
        ? document.getElementById(section.toggleBtnId)
        : null;

      if (btnsContainer) {
        const labeled = section.list.filter(
          (entry) => typeof entry === "object" && entry.label,
        );
        const visibleCount = section.visibleBtnCount || labeled.length;
        const hiddenCount = Math.max(0, labeled.length - visibleCount);

        labeled.forEach((entry, i) => {
          const target =
            moreContainer && i >= visibleCount ? moreContainer : btnsContainer;

          // Datums no faila nosaukuma (GGGG-MM-DD_...) -tiek rādīts uz pogas
          const dateMatch = entry.file.match(/^(\d{4})-(\d{2})-(\d{2})/);
          const dateLabel = dateMatch ? `${dateMatch[3]}.${dateMatch[2]}.` : "";

          const a = document.createElement("a");
          a.href = `#${entry.id}`;
          a.className = "btn btn-info rounded-pill px-3 m-2";
          a.setAttribute("role", "button");
          a.innerHTML = dateLabel
            ? `${entry.label} <small class="opacity-75">· ${dateLabel}</small>`
            : entry.label;
          a.dataset.searchText = normalizeSearchText(
            `${entry.label} ${dateLabel}`,
          );
          target.appendChild(a);
        });

        // "Rādīt visus notikumus" poga -tikai, ja tiešām ir kas paslēpts
        if (toggleBtn) {
          if (hiddenCount > 0 && moreContainer) {
            const defaultText = `Rādīt visus notikumus (+${hiddenCount})`;
            toggleBtn.textContent = defaultText;
            moreContainer.addEventListener("show.bs.collapse", () => {
              toggleBtn.textContent = "Rādīt mazāk";
            });
            moreContainer.addEventListener("hide.bs.collapse", () => {
              toggleBtn.textContent = defaultText;
            });
          } else {
            toggleBtn.style.display = "none";
          }
        }

        // Meklēšana pogu tekstā -paslēpj neatbilstošās, atver "vairāk" bloku, ja atbilstība tur
        if (section.searchInputId) {
          const searchInput = document.getElementById(section.searchInputId);
          if (searchInput) {
            searchInput.addEventListener("input", () => {
              const query = normalizeSearchText(searchInput.value.trim());
              const allBtns = [
                ...btnsContainer.querySelectorAll("a"),
                ...(moreContainer ? moreContainer.querySelectorAll("a") : []),
              ];
              let matchInMore = false;

              allBtns.forEach((btn) => {
                const isMatch = !query || btn.dataset.searchText.includes(query);
                btn.style.display = isMatch ? "" : "none";
                if (isMatch && moreContainer && moreContainer.contains(btn)) {
                  matchInMore = true;
                }
              });

              if (query && matchInMore && moreContainer && window.bootstrap) {
                bootstrap.Collapse.getOrCreateInstance(moreContainer, {
                  toggle: false,
                }).show();
              }
            });
          }
        }
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

    // Pēc raksta ielādes -meklēšanas ieteikumi ar pilniem nosaukumiem
    // (iekļauj arī notikumus, kam nav pogas)
    if (section.suggestionsId && section.searchInputId) {
      setupSearchSuggestions(section, btnsContainer, moreContainer);
    }
  }

  scrollToHash();
}

// ============================================================
//  Meklēšanas ieteikumi -pilnu nosaukumu (raksta virsraksta) meklēšana,
//  ieskaitot ierakstus bez pogas. Rāda "as-you-type" ieteikumus zem lauka.
// ============================================================
function setupSearchSuggestions(section, btnsContainer, moreContainer) {
  const searchInput = document.getElementById(section.searchInputId);
  const suggestionsBox = document.getElementById(section.suggestionsId);
  if (!searchInput || !suggestionsBox) return;

  // Indekss ar visiem ierakstiem (arī bez pogas) -virsraksts nolasīts no DOM
  const index = section.list
    .filter((entry) => typeof entry === "object" && entry.id)
    .map((entry) => {
      const el = document.getElementById(entry.id);
      const heading = el
        ? el.matches("h1, h2, h3, h4, h5, h6")
          ? el
          : el.querySelector("h1, h2, h3, h4, h5, h6")
        : null;
      const title = heading ? heading.textContent.trim() : entry.label || entry.id;

      const dateMatch = entry.file.match(/^(\d{4})-(\d{2})-(\d{2})/);
      const dateLabel = dateMatch ? `${dateMatch[3]}.${dateMatch[2]}.${dateMatch[1]}` : "";

      return {
        id: entry.id,
        title,
        dateLabel,
        hasBtn: Boolean(entry.label),
        normalized: normalizeSearchText(`${title} ${dateLabel}`),
      };
    });

  function hideSuggestions() {
    suggestionsBox.style.display = "none";
    suggestionsBox.innerHTML = "";
  }

  function goToEntry(item) {
    hideSuggestions();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));

    const target = document.getElementById(item.id);
    if (!target) return;

    // Ja atbilstošā poga ir paslēptajā blokā, vispirms to atver
    if (item.hasBtn && moreContainer && window.bootstrap) {
      const btnInMore = [...moreContainer.querySelectorAll("a")].find(
        (a) => a.getAttribute("href") === `#${item.id}`,
      );
      if (btnInMore) {
        bootstrap.Collapse.getOrCreateInstance(moreContainer, {
          toggle: false,
        }).show();
      }
    }

    target.scrollIntoView({behavior: "smooth", block: "start"});
  }

  searchInput.addEventListener("input", () => {
    const query = normalizeSearchText(searchInput.value.trim());
    if (!query) {
      hideSuggestions();
      return;
    }

    const matches = index.filter((item) => item.normalized.includes(query)).slice(0, 8);
    if (matches.length === 0) {
      hideSuggestions();
      return;
    }

    suggestionsBox.innerHTML = matches
      .map(
        (item, i) => `
        <button type="button" class="list-group-item list-group-item-action" data-index="${i}">
          ${item.title}
          ${item.dateLabel ? `<small class="text-muted d-block">${item.dateLabel}</small>` : ""}
        </button>`,
      )
      .join("");
    suggestionsBox.style.display = "block";

    suggestionsBox.querySelectorAll("button").forEach((btn, i) => {
      btn.addEventListener("click", () => goToEntry(matches[i]));
    });
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const first = suggestionsBox.querySelector("button");
      if (first) first.click();
    } else if (event.key === "Escape") {
      hideSuggestions();
    }
  });

  document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
      hideSuggestions();
    }
  });
}
