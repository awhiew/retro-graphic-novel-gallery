const storageKey = "roxyVegaReviewGallery:v1";
const maxNotesLength = 5000;

const fallbackManifest = [
  {"file":"assets/images/01-gpt_image2_roxy_vega_ref1_inspired.png","title":"Ref1 Inspired","group":"Reference Redos","rating":4,"notes":"Early GPT-Imagine 2 translation from the selected reference images; useful for core character direction and retro-pulp baseline."},
  {"file":"assets/images/02-gpt_image2_roxy_vega_ref2_inspired.png","title":"Ref2 Inspired","group":"Reference Redos","rating":4,"notes":"Early GPT-Imagine 2 translation from the selected reference images; useful for core character direction and retro-pulp baseline."},
  {"file":"assets/images/03-gpt_image2_roxy_vega_ref3_inspired.png","title":"Ref3 Inspired","group":"Reference Redos","rating":4,"notes":"Early GPT-Imagine 2 translation from the selected reference images; useful for core character direction and retro-pulp baseline."},
  {"file":"assets/images/04-gpt_image2_roxy_vega_ref4_inspired.png","title":"Ref4 Inspired","group":"Reference Redos","rating":4,"notes":"Early GPT-Imagine 2 translation from the selected reference images; useful for core character direction and retro-pulp baseline."},
  {"file":"assets/images/05-roxy_vega_01_cosmic_art_nouveau.png","title":"Cosmic Art Nouveau","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/06-roxy_vega_02_moebius_desert_sci_fi.png","title":"Moebius Desert SCI FI","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/07-roxy_vega_03_heavy_metal_magazine.png","title":"Heavy Metal Magazine","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/08-roxy_vega_04_japanese_gekiga_noir.png","title":"Japanese Gekiga Noir","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/09-roxy_vega_05_luxury_fashion_comic.png","title":"Luxury Fashion Comic","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/10-roxy_vega_06_biopunk_alien_jungle.png","title":"Biopunk Alien Jungle","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/11-roxy_vega_07_atomic_pop_surreal.png","title":"Atomic Pop Surreal","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/12-roxy_vega_08_blacklight_velvet_pulp.png","title":"Blacklight Velvet Pulp","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/13-roxy_vega_09_risograph_punk_comic.png","title":"Risograph Punk Comic","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/14-roxy_vega_10_mythic_space_western.png","title":"Mythic Space Western","group":"Bold Style Explorations","rating":3,"notes":"Broader graphic-novel style range; useful for deciding how stylised or premium the world should feel."},
  {"file":"assets/images/15-roxy_vega_01_cute_retro_pulp_romance.png","title":"Cute Retro Pulp Romance","group":"Cute-Sexy Style Anchors","rating":5,"notes":"Top lane candidate: cute retro pulp romance, pretty face, commercial and charming."},
  {"file":"assets/images/16-roxy_vega_02_kawaii_space_noir.png","title":"Kawaii Space Noir","group":"Cute-Sexy Style Anchors","rating":5,"notes":"Strong blend of cute and attitude; probably one of the most ownable directions."},
  {"file":"assets/images/17-roxy_vega_03_dreamy_anime_gouache.png","title":"Dreamy Anime Gouache","group":"Cute-Sexy Style Anchors","rating":5,"notes":"Softest and most lovable version while still feeling graphic-novel ready."},
  {"file":"assets/images/18-roxy_vega_01_space_diner.png","title":"Space Diner","group":"Cute-Sexy Scene Variations","rating":5,"notes":"Great world-building scene: playful, cute, and instantly communicates tone."},
  {"file":"assets/images/19-roxy_vega_02_raygun_scooter.png","title":"Raygun Scooter","group":"Cute-Sexy Scene Variations","rating":5,"notes":"Best adventure/action energy; strong for the character as a recurring lead."},
  {"file":"assets/images/20-roxy_vega_03_starship_cockpit.png","title":"Starship Cockpit","group":"Cute-Sexy Scene Variations","rating":4,"notes":"Narrative/splash-page tests showing how the character behaves across the world with her helmet cat."},
  {"file":"assets/images/21-roxy_vega_04_alien_beach.png","title":"Alien Beach","group":"Cute-Sexy Scene Variations","rating":4,"notes":"Narrative/splash-page tests showing how the character behaves across the world with her helmet cat."},
  {"file":"assets/images/22-roxy_vega_05_moon_lounge.png","title":"Moon Lounge","group":"Cute-Sexy Scene Variations","rating":4,"notes":"Useful glamorous/nightlife-coded world angle; strong mood reference."},
  {"file":"assets/images/23-roxy_vega_06_galaxy_map_room.png","title":"Galaxy Map Room","group":"Cute-Sexy Scene Variations","rating":4,"notes":"Narrative/splash-page tests showing how the character behaves across the world with her helmet cat."},
  {"file":"assets/images/24-roxy_vega_07_space_mechanic.png","title":"Space Mechanic","group":"Cute-Sexy Scene Variations","rating":4,"notes":"Good tomboy/badass layer without losing charm."},
  {"file":"assets/images/25-roxy_vega_08_alien_garden.png","title":"Alien Garden","group":"Cute-Sexy Scene Variations","rating":4,"notes":"Narrative/splash-page tests showing how the character behaves across the world with her helmet cat."},
  {"file":"assets/images/26-roxy_vega_09_bounty_poster_chase.png","title":"Bounty Poster Chase","group":"Cute-Sexy Scene Variations","rating":4,"notes":"Narrative/splash-page tests showing how the character behaves across the world with her helmet cat."},
  {"file":"assets/images/27-roxy_vega_10_first_issue_hero.png","title":"First Issue Hero","group":"Cute-Sexy Scene Variations","rating":4,"notes":"Narrative/splash-page tests showing how the character behaves across the world with her helmet cat."}
];

const board = document.querySelector("#gallery-board");
const statusEl = document.querySelector("#gallery-status");
const summaryEl = document.querySelector("#summary-strip");
const sortSelect = document.querySelector("#sort-select");
const exportButton = document.querySelector("#export-json");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

let manifest = [];
let reviewState = loadReviewState();
let activeFilter = "all";
let activeSort = "original";

const filters = {
  all: () => true,
  five: (item) => getReview(item).rating === 5,
  fourPlus: (item) => getReview(item).rating >= 4,
  notes: (item) => getReview(item).notes.trim().length > 0,
  unrated: (item) => getReview(item).rating === 0
};

init();

async function init() {
  manifest = await loadManifest();
  render();
  bindControls();
}

async function loadManifest() {
  try {
    const response = await fetch("image-manifest.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Manifest returned ${response.status}`);
    const data = await response.json();
    statusEl.textContent = `Loaded ${data.length} images from image-manifest.json`;
    return normalizeManifest(data);
  } catch (error) {
    statusEl.textContent = "Loaded fallback manifest for local file preview";
    return normalizeManifest(fallbackManifest);
  }
}

function normalizeManifest(data) {
  return data.map((item, index) => ({
    file: String(item.file || ""),
    title: String(item.title || `Image ${index + 1}`),
    group: String(item.group || "Ungrouped"),
    rating: normalizeRating(item.rating),
    notes: String(item.notes || "").slice(0, maxNotesLength),
    index
  })).filter((item) => item.file);
}

function bindControls() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });

  sortSelect.addEventListener("change", () => {
    activeSort = sortSelect.value;
    render();
  });

  exportButton.addEventListener("click", exportJson);
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

function render() {
  const filtered = getSortedItems().filter(filters[activeFilter] || filters.all);
  renderSummary(filtered);
  renderGroups(filtered);
}

function getSortedItems() {
  return [...manifest].sort((a, b) => {
    const reviewA = getReview(a);
    const reviewB = getReview(b);
    if (activeSort === "ratingDesc") return reviewB.rating - reviewA.rating || a.index - b.index;
    if (activeSort === "ratingAsc") return reviewA.rating - reviewB.rating || a.index - b.index;
    if (activeSort === "titleAsc") return a.title.localeCompare(b.title) || a.index - b.index;
    if (activeSort === "groupAsc") return a.group.localeCompare(b.group) || a.index - b.index;
    return a.index - b.index;
  });
}

function renderSummary(items) {
  const all = manifest.map(getReview);
  const total = manifest.length;
  const visible = items.length;
  const five = all.filter((item) => item.rating === 5).length;
  const noted = all.filter((item) => item.notes.trim()).length;
  const average = all.length
    ? (all.reduce((sum, item) => sum + item.rating, 0) / all.length).toFixed(1)
    : "0.0";

  summaryEl.innerHTML = "";
  [
    [`${visible}/${total}`, "Images visible"],
    [average, "Average rating"],
    [five, "Five-star picks"],
    [noted, "With notes"]
  ].forEach(([value, label]) => {
    const pill = document.createElement("div");
    pill.className = "summary-pill";
    pill.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
    summaryEl.append(pill);
  });
}

function renderGroups(items) {
  board.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No images match this filter.";
    board.append(empty);
    return;
  }

  const groups = new Map();
  items.forEach((item) => {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group).push(item);
  });

  groups.forEach((groupItems, groupName) => {
    const section = document.createElement("section");
    section.className = "group-section";
    section.innerHTML = `
      <div class="group-heading">
        <h3>${escapeHtml(groupName)}</h3>
        <span class="group-count">${groupItems.length} images</span>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "card-grid";
    groupItems.forEach((item) => grid.append(createCard(item)));
    section.append(grid);
    board.append(section);
  });
}

function createCard(item) {
  const review = getReview(item);
  const card = document.createElement("article");
  card.className = "image-card";

  const imageButton = document.createElement("button");
  imageButton.className = "image-button";
  imageButton.type = "button";
  imageButton.setAttribute("aria-label", `Open ${item.title} preview`);
  imageButton.innerHTML = `<img src="${escapeAttribute(item.file)}" alt="${escapeAttribute(item.title)}" loading="lazy">`;
  imageButton.addEventListener("click", () => openLightbox(item));

  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `
    <div class="card-title-row">
      <span class="card-meta">${escapeHtml(item.group)}</span>
      <h4>${escapeHtml(item.title)}</h4>
    </div>
  `;

  const ratingRow = document.createElement("div");
  ratingRow.className = "rating-row";
  ratingRow.setAttribute("aria-label", `Rating for ${item.title}`);

  for (let rating = 1; rating <= 5; rating += 1) {
    const button = document.createElement("button");
    button.className = `star-button${rating <= review.rating ? " active" : ""}`;
    button.type = "button";
    button.textContent = "★";
    button.title = `${rating} star`;
    button.setAttribute("aria-label", `Rate ${item.title} ${rating} star`);
    button.addEventListener("click", () => updateReview(item.file, { rating }));
    ratingRow.append(button);
  }

  const clearButton = document.createElement("button");
  clearButton.className = "clear-rating";
  clearButton.type = "button";
  clearButton.textContent = "Unrate";
  clearButton.addEventListener("click", () => updateReview(item.file, { rating: 0 }));
  ratingRow.append(clearButton);

  const textarea = document.createElement("textarea");
  textarea.className = "notes-field";
  textarea.maxLength = maxNotesLength;
  textarea.value = review.notes;
  textarea.placeholder = "Add review notes, art direction, prompt changes, or shortlist rationale.";
  textarea.setAttribute("aria-label", `Notes for ${item.title}`);
  textarea.addEventListener("input", () => updateReview(item.file, { notes: textarea.value }, false));
  textarea.addEventListener("change", () => saveReviewState());

  body.append(ratingRow, textarea);
  card.append(imageButton, body);
  return card;
}

function getReview(item) {
  const saved = reviewState[item.file] || {};
  return {
    rating: normalizeRating(saved.rating ?? item.rating),
    notes: String(saved.notes ?? item.notes ?? "").slice(0, maxNotesLength)
  };
}

function updateReview(file, patch, shouldRender = true) {
  const item = manifest.find((entry) => entry.file === file);
  if (!item) return;
  const current = getReview(item);
  reviewState[file] = {
    rating: normalizeRating(patch.rating ?? current.rating),
    notes: String(patch.notes ?? current.notes).slice(0, maxNotesLength),
    updatedAt: new Date().toISOString()
  };
  saveReviewState();
  if (shouldRender) render();
  if (!shouldRender) renderSummary(getSortedItems().filter(filters[activeFilter] || filters.all));
}

function normalizeRating(value) {
  const rating = Number(value);
  return Math.max(0, Math.min(5, Number.isFinite(rating) ? Math.round(rating) : 0));
}

function loadReviewState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

function saveReviewState() {
  localStorage.setItem(storageKey, JSON.stringify(reviewState));
}

function exportJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    project: "Roxy Vega — Retro Graphic Novel Art Board",
    items: manifest.map((item) => {
      const review = getReview(item);
      return {
        file: item.file,
        title: item.title,
        group: item.group,
        rating: review.rating,
        notes: review.notes
      };
    })
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "roxy-vega-review-export.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function openLightbox(item) {
  lightboxImage.src = item.file;
  lightboxImage.alt = item.title;
  lightboxCaption.textContent = `${item.title} · ${item.group}`;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
