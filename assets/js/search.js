import {
  topicalityNews,
  topicalityEvents,
  topicalityUniversity,
} from "./topicality.js";
import {normalizeSearchText} from "./additionalFunc.js";

// ============================================================
//  GLOBĀLĀ MEKLĒŠANA -aptver Aktualitātes, Projektus un galvenās lapas.
//  Pieejama no jebkuras lapas (poga galvenē), meklēšanas indekss
//  tiek uzbūvēts vienreiz (pirmajā atvēršanas reizē) un tālāk kešots.
// ============================================================

// Statiskās lapas -mainās reti, tāpēc saraksts uzturēts šeit ar roku
const STATIC_PAGES = [
  {title: "Sākumlapa", url: "/"},
  {title: "Par mums", url: "/pages/about-us.html"},
  {title: "Mēs -biedrības valde", url: "/pages/about-us.html#members"},
  {title: "Statūti", url: "/pages/about-us.html#statute"},
  {title: "Akreditācija", url: "/pages/about-us.html#accreditation"},
  {
    title: "Atbalstītāji un sadarbības partneri",
    url: "/pages/about-us.html#supporters",
  },
  {title: "Kontakti", url: "/pages/about-us.html#contacts"},
  {title: "Aktualitātes", url: "/pages/topicality.html"},
  {title: "Projekti", url: "/pages/projects.html"},
  {title: "Vēlos iesaistīties", url: "/pages/involved.html"},
  {title: "Iesakām", url: "/pages/recommend.html"},
  {title: "Atmiņas", url: "/pages/memories.html"},
  {title: "Privātuma politika", url: "/pages/privacyPolicy.html"},
];

let cachedIndex = null;

async function fetchTopicalityEntry(folder, entry) {
  const file = typeof entry === "string" ? entry : entry.file;
  const fallbackId = typeof entry === "object" ? entry.id : null;

  try {
    const response = await fetch(`/articles/topicality/${folder}/${file}`);
    if (!response.ok) return null;
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const rootWithId = doc.querySelector("[id]");
    const id = rootWithId ? rootWithId.id : fallbackId;
    if (!id) return null;

    const heading = doc.querySelector("h1, h2, h3, h4, h5, h6");
    const title = heading ? heading.textContent.trim() : id;

    const firstP = doc.querySelector("p");
    const snippet = firstP ? firstP.textContent.trim().slice(0, 130) : "";

    return {title, id, snippet};
  } catch (error) {
    console.error("Meklēšanas indeksa kļūda:", file, error);
    return null;
  }
}

async function buildIndex() {
  const items = [];

  STATIC_PAGES.forEach((page) => {
    items.push({
      type: "Lapa",
      title: page.title,
      snippet: "",
      url: page.url,
      normalized: normalizeSearchText(page.title),
    });
  });

  const topicalitySections = [
    {list: topicalityNews, folder: "news"},
    {list: topicalityEvents, folder: "events"},
    {list: topicalityUniversity, folder: "university"},
  ];

  const topicalityPromises = topicalitySections.flatMap((section) =>
    section.list.map((entry) =>
      fetchTopicalityEntry(section.folder, entry).then((result) => {
        if (!result) return;
        items.push({
          type: "Aktualitātes",
          title: result.title,
          snippet: result.snippet,
          url: `/pages/topicality.html#${result.id}`,
          normalized: normalizeSearchText(`${result.title} ${result.snippet}`),
        });
      }),
    ),
  );

  const projectsPromise = fetch("/assets/JSON/projects.json")
    .then((response) => response.json())
    .then((data) => {
      [...data.current, ...data.realized].forEach((project) => {
        const title = project.title.replace(/<[^>]+>/g, "").trim();
        const subtitle = (project.subtitle || "").replace(/<[^>]+>/g, "");
        items.push({
          type: "Projekti",
          title,
          snippet: subtitle,
          url: `/pages/projects.html#collapse${project.id}`,
          normalized: normalizeSearchText(`${title} ${subtitle}`),
        });
      });
    })
    .catch((error) =>
      console.error("Projektu ielādes kļūda meklēšanai:", error),
    );

  await Promise.all([...topicalityPromises, projectsPromise]);
  return items;
}

export function initGlobalSearch() {
  const input = document.getElementById("global-search-input");
  const resultsBox = document.getElementById("global-search-results");
  const modalEl = document.getElementById("globalSearchModal");
  if (!input || !resultsBox || !modalEl) return;

  let loading = false;

  function renderResults(query) {
    const normalized = normalizeSearchText(query.trim());
    if (!normalized) {
      resultsBox.innerHTML = "";
      return;
    }
    if (!cachedIndex) return; // vēl ielādējas

    const matches = cachedIndex
      .filter((item) => item.normalized.includes(normalized))
      .slice(0, 30);

    if (matches.length === 0) {
      resultsBox.innerHTML =
        '<p class="text-muted text-center mt-3">Nekas netika atrasts.</p>';
      return;
    }

    const groups = {};
    matches.forEach((item) => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });

    resultsBox.innerHTML = Object.entries(groups)
      .map(
        ([type, groupItems]) => `
        <h6 class="text-muted text-uppercase small fw-bold mt-3 mb-2">${type}</h6>
        <div class="list-group mb-2">
          ${groupItems
            .map(
              (item) => `
              <a href="${item.url}" class="list-group-item list-group-item-action">
                <div class="fw-semibold">${item.title}</div>
                ${item.snippet ? `<div class="text-muted small">${item.snippet}…</div>` : ""}
              </a>`,
            )
            .join("")}
        </div>`,
      )
      .join("");
  }

  modalEl.addEventListener("shown.bs.modal", async () => {
    input.focus();
    if (!cachedIndex && !loading) {
      loading = true;
      resultsBox.innerHTML =
        '<p class="text-muted text-center mt-3">Ielādē meklēšanas datus...</p>';
      cachedIndex = await buildIndex();
      loading = false;
      renderResults(input.value);
    }
  });

  modalEl.addEventListener("hidden.bs.modal", () => {
    input.value = "";
    resultsBox.innerHTML = "";
  });

  input.addEventListener("input", () => renderResults(input.value));
}
