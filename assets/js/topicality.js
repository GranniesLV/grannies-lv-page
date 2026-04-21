import {scrollToHash} from "./additionalFunc.js";

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

  scrollToHash();
}
