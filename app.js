const storageKey = "retroGraphicNovelReviewBoard:v1";
const reviewEndpoint =
  window.RETRO_REVIEW_API ||
  "https://retro-graphic-novel-review-api.andrewhiew.workers.dev";
const maxNotesLength = 5000;
const maxReferenceFileSize = 20 * 1024 * 1024;
const maxReferenceEncodedLength = 6 * 1024 * 1024;
const referenceUploadTimeout = 20000;
const cloudSaveDelay = 500;
const cloudSyncInterval = 15000;

const groupDirections = {
  "Reference Redos": "Compare the core character silhouette, face, outfit language, and cover-read appeal.",
  "Bold Style Explorations": "Use this as a style-range check for linework, color, texture, and world tone.",
  "Character Style Anchors": "Judge whether this balances charm, confidence, softness, and memorable lead-character appeal.",
  "Story-World Scene Variations": "Review how the character and companion read in a story moment with clear setting and mood.",
  "Exploring Risograph Punk Comic Style": "Explore this risograph-punk lane for character variety, palette range, attitude, hairstyles, outfits, and story-world potential.",
  "World-Building Characters": "Review how each supporting character expands the setting, role variety, and story-world texture."
};

const fallbackManifest = withDirections([
  {"file":"assets/images/01-gpt_image2_roxy_vega_ref1_inspired.png","title":"Ref1 Inspired","group":"Reference Redos","rating":0,"notes":""},
  {"file":"assets/images/02-gpt_image2_roxy_vega_ref2_inspired.png","title":"Ref2 Inspired","group":"Reference Redos","rating":0,"notes":""},
  {"file":"assets/images/03-gpt_image2_roxy_vega_ref3_inspired.png","title":"Ref3 Inspired","group":"Reference Redos","rating":0,"notes":""},
  {"file":"assets/images/04-gpt_image2_roxy_vega_ref4_inspired.png","title":"Ref4 Inspired","group":"Reference Redos","rating":0,"notes":""},
  {"file":"assets/images/05-roxy_vega_01_cosmic_art_nouveau.png","title":"Cosmic Art Nouveau","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/06-roxy_vega_02_moebius_desert_sci_fi.png","title":"Moebius Desert SCI FI","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/07-roxy_vega_03_heavy_metal_magazine.png","title":"Heavy Metal Magazine","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/08-roxy_vega_04_japanese_gekiga_noir.png","title":"Japanese Gekiga Noir","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/09-roxy_vega_05_luxury_fashion_comic.png","title":"Luxury Fashion Comic","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/10-roxy_vega_06_biopunk_alien_jungle.png","title":"Biopunk Alien Jungle","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/11-roxy_vega_07_atomic_pop_surreal.png","title":"Atomic Pop Surreal","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/12-roxy_vega_08_blacklight_velvet_pulp.png","title":"Blacklight Velvet Pulp","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/13-roxy_vega_09_risograph_punk_comic.png","title":"Risograph Punk Comic","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/14-roxy_vega_10_mythic_space_western.png","title":"Mythic Space Western","group":"Bold Style Explorations","rating":0,"notes":""},
  {"file":"assets/images/15-roxy_vega_01_cute_retro_pulp_romance.png","title":"Retro Pulp Cover Study","group":"Character Style Anchors","rating":0,"notes":""},
  {"file":"assets/images/16-roxy_vega_02_kawaii_space_noir.png","title":"Neon Starport Mystery","group":"Character Style Anchors","rating":0,"notes":""},
  {"file":"assets/images/17-roxy_vega_03_dreamy_anime_gouache.png","title":"Painterly Character Warmth","group":"Character Style Anchors","rating":0,"notes":""},
  {"file":"assets/images/18-roxy_vega_01_space_diner.png","title":"Space Diner","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/19-roxy_vega_02_raygun_scooter.png","title":"Raygun Scooter","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/20-roxy_vega_03_starship_cockpit.png","title":"Starship Cockpit","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/21-roxy_vega_04_alien_beach.png","title":"Alien Beach","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/22-roxy_vega_05_moon_lounge.png","title":"Moon Lounge","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/23-roxy_vega_06_galaxy_map_room.png","title":"Galaxy Map Room","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/24-roxy_vega_07_space_mechanic.png","title":"Space Mechanic","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/25-roxy_vega_08_alien_garden.png","title":"Alien Garden","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/26-roxy_vega_09_bounty_poster_chase.png","title":"Bounty Poster Chase","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/27-roxy_vega_10_first_issue_hero.png","title":"First Issue Hero","group":"Story-World Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/28-risograph_punk_01_starport_mechanic.png","title":"Starport Mechanic","group":"Exploring Risograph Punk Comic Style","rating":0,"notes":""},
  {"file":"assets/images/29-risograph_punk_02_moon_lounge_singer.png","title":"Moon Lounge Singer","group":"Exploring Risograph Punk Comic Style","rating":0,"notes":""},
  {"file":"assets/images/30-risograph_punk_03_neon_bounty_hunter.png","title":"Neon Bounty Hunter","group":"Exploring Risograph Punk Comic Style","rating":0,"notes":""},
  {"file":"assets/images/31-risograph_punk_04_astrologer_pilot.png","title":"Astrologer Pilot","group":"Exploring Risograph Punk Comic Style","rating":0,"notes":""},
  {"file":"assets/images/32-risograph_punk_05_alien_drag_racer.png","title":"Alien Drag Racer","group":"Exploring Risograph Punk Comic Style","rating":0,"notes":""},
  {"file":"assets/images/33-risograph_punk_06_space_witch_dj.png","title":"Space Witch DJ","group":"Exploring Risograph Punk Comic Style","rating":0,"notes":""},
  {"file":"assets/images/34-risograph_punk_07_galactic_surfer.png","title":"Galactic Surfer","group":"Exploring Risograph Punk Comic Style","rating":0,"notes":""},
  {"file":"assets/images/35-risograph_punk_08_rocket_courier.png","title":"Rocket Courier","group":"Exploring Risograph Punk Comic Style","rating":0,"notes":""},
  {"file":"assets/images/36-world_building_01_comet_cafe_owner.png","title":"Comet Café Owner","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/37-world_building_02_starport_weather_girl.png","title":"Starport Weather Girl","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/38-world_building_03_orbital_flower_vendor.png","title":"Orbital Flower Vendor","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/39-world_building_04_nebula_train_conductor.png","title":"Nebula Train Conductor","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/40-world_building_05_cosmic_radio_host.png","title":"Cosmic Radio Host","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/41-world_building_06_moon_hotel_bellhop.png","title":"Moon Hotel Bellhop","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/42-world_building_07_alien_botanist.png","title":"Alien Botanist","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/43-world_building_08_starlight_tailor.png","title":"Starlight Tailor","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/44-world_building_09_asteroid_skate_courier.png","title":"Asteroid Skate Courier","group":"World-Building Characters","rating":0,"notes":""},
  {"file":"assets/images/45-world_building_10_galaxy_librarian.png","title":"Galaxy Librarian","group":"World-Building Characters","rating":0,"notes":""}
]);

const board = document.querySelector("#gallery-board");
const statusEl = document.querySelector("#gallery-status");
const cloudStatusEl = document.querySelector("#cloud-status");
const summaryEl = document.querySelector("#summary-strip");
const sortSelect = document.querySelector("#sort-select");
const filterButtons = [...document.querySelectorAll("[data-filter-value]")];
const masterNoteButton = document.querySelector("#add-master-note");
const masterNoteForm = document.querySelector("#master-note-form");
const masterNoteFrom = document.querySelector("#master-note-from");
const masterNoteText = document.querySelector("#master-note-text");
const cancelMasterNoteButton = document.querySelector("#cancel-master-note");
const masterNotesList = document.querySelector("#master-notes-list");
const referenceForm = document.querySelector("#reference-form");
const referenceFile = document.querySelector("#reference-file");
const referenceCaption = document.querySelector("#reference-caption");
const referenceSave = document.querySelector("#reference-save");
const referencePreview = document.querySelector("#reference-preview");
const referenceStatus = document.querySelector("#reference-status");
const referenceError = document.querySelector("#reference-error");
const referenceList = document.querySelector("#reference-list");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const ratingFilterValues = new Set(["1", "2", "3", "4", "5"]);

let manifest = [];
let manifestFiles = new Set();
let boardState = loadBoardState();
const activeFilters = {
  ratings: new Set(),
  notes: false,
  unrated: false
};
let activeSort = "original";
let cloudTimer = 0;
let pendingCloudFiles = new Set();
let pendingFullCloudSave = false;
let selectedReferencePreviewUrl = "";
let isUploadingReference = false;
let isSyncingCloud = false;

init();

async function init() {
  manifest = await loadManifest();
  manifestFiles = new Set(manifest.map((item) => item.file));
  boardState.reviews = filterReviewState(boardState.reviews);
  saveBoardState();
  render();
  bindControls();
  await syncReviewsFromCloud({ showStatus: true });
  window.setInterval(syncReviewsFromCloud, cloudSyncInterval);
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

function withDirections(items) {
  return items.map((item) => ({
    ...item,
    direction: item.direction || groupDirections[item.group] || "Review composition, character appeal, tone, and usefulness for the final art direction."
  }));
}

function normalizeManifest(data) {
  return withDirections(data).map((item, index) => ({
    file: String(item.file || ""),
    title: String(item.title || `Image ${index + 1}`),
    group: String(item.group || "Ungrouped"),
    rating: normalizeRating(item.rating),
    notes: String(item.notes || "").slice(0, maxNotesLength),
    direction: String(item.direction || "").trim(),
    index
  })).filter((item) => item.file);
}

function bindControls() {
  filterButtons.forEach((button) => {
    const value = button.dataset.filterValue || "";
    const isPressed = isFilterButtonPressed(value);
    button.classList.toggle("active", isPressed);
    button.setAttribute("aria-pressed", String(isPressed));
    button.addEventListener("click", () => {
      toggleFilterValue(value);
      updateFilterButtons();
      render();
    });
  });

  sortSelect.addEventListener("change", () => {
    activeSort = sortSelect.value;
    render();
  });

  setupFromPicker(masterNoteForm);
  masterNoteButton.addEventListener("click", () => showMasterNoteForm(true));
  cancelMasterNoteButton.addEventListener("click", () => showMasterNoteForm(false));
  masterNoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    appendMasterNote(masterNoteFrom.value, masterNoteText.value);
  });

  referenceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    uploadReference();
  });
  referenceFile.addEventListener("change", updateReferencePreview);

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

function isFilterButtonPressed(value) {
  if (ratingFilterValues.has(value)) return activeFilters.ratings.has(Number(value));
  if (value === "notes") return activeFilters.notes;
  if (value === "unrated") return activeFilters.unrated;
  return false;
}

function toggleFilterValue(value) {
  if (ratingFilterValues.has(value)) {
    const rating = Number(value);
    if (activeFilters.ratings.has(rating)) {
      activeFilters.ratings.delete(rating);
    } else {
      activeFilters.ratings.add(rating);
    }
    return;
  }
  if (value === "notes") {
    activeFilters.notes = !activeFilters.notes;
    return;
  }
  if (value === "unrated") activeFilters.unrated = !activeFilters.unrated;
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const value = button.dataset.filterValue || "";
    const isPressed = isFilterButtonPressed(value);
    button.classList.toggle("active", isPressed);
    button.setAttribute("aria-pressed", String(isPressed));
  });
}

function matchesActiveFilters(item) {
  const review = getReview(item);
  const hasSelectedFilters =
    activeFilters.ratings.size > 0 || activeFilters.notes || activeFilters.unrated;
  if (!hasSelectedFilters) return true;

  if (activeFilters.ratings.has(review.rating)) return true;
  if (activeFilters.notes && hasReviewNotes(review)) return true;
  if (activeFilters.unrated && review.rating === 0) return true;
  return false;
}

function setupFromPicker(scope) {
  const picker = scope.querySelector("[data-from-picker]");
  if (!picker) return;
  const input = picker.querySelector("input");
  const choices = [...picker.querySelectorAll("[data-from]")];
  if (input && !input.value) input.value = "Hannah";
  choices.forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.from || "";
      updateFromPickerActive(picker);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });
  input.addEventListener("input", () => updateFromPickerActive(picker));
  updateFromPickerActive(picker);
}

function setFromPickerValue(scope, value) {
  const picker = scope.querySelector("[data-from-picker]");
  if (!picker) return;
  const input = picker.querySelector("input");
  if (input) input.value = value;
  updateFromPickerActive(picker);
}

function updateFromPickerActive(picker) {
  const input = picker.querySelector("input");
  const choices = [...picker.querySelectorAll("[data-from]")];
  const value = String(input?.value || "").trim();
  choices.forEach((button) => button.classList.toggle("active", button.dataset.from === value));
}

function render() {
  const filtered = getSortedItems().filter(matchesActiveFilters);
  renderMasterPanel();
  renderSummary(filtered);
  renderGroups(filtered);
}

function hasOpenDraftForm() {
  if ([...document.querySelectorAll(".note-form")].some((form) => !form.hidden)) return true;

  const activeElement = document.activeElement;
  if (
    activeElement?.matches("textarea, input") &&
    activeElement.closest(".note-form, .reference-form")
  ) {
    return true;
  }

  const selectedFile = referenceFile?.files && referenceFile.files.length > 0;
  const draftCaption = Boolean(referenceCaption?.value.trim());
  return Boolean(selectedFile || draftCaption);
}

function renderMasterPanel() {
  renderNoteThread(masterNotesList, boardState.masterNotes, "No master notes saved yet.", {
    onDelete: (note) => deleteMasterNote(note.id)
  });
  referenceList.innerHTML = "";
  if (!boardState.references.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No reference uploads yet.";
    referenceList.append(empty);
    return;
  }

  getSortedByCreatedAt(boardState.references).forEach((reference) => {
    const item = document.createElement("article");
    item.className = "reference-item";
    const caption = getReferenceCaption(reference);
    const previewButton = document.createElement("button");
    previewButton.className = "reference-preview-button";
    previewButton.type = "button";
    previewButton.setAttribute("aria-label", `Open reference preview: ${caption}`);
    previewButton.innerHTML = `<img src="${escapeAttribute(reference.dataUrl)}" alt="${escapeAttribute(caption)}" loading="lazy">`;
    previewButton.addEventListener("click", () => {
      openLightboxSource({
        src: reference.dataUrl,
        alt: caption,
        caption: `${caption} · Uploaded reference`
      });
    });

    const details = document.createElement("div");
    details.className = "reference-meta";
    details.innerHTML = `
      <strong>${escapeHtml(caption)}</strong>
      <time datetime="${escapeAttribute(reference.createdAt)}">${escapeHtml(formatDate(reference.createdAt))}</time>
      <span>${escapeHtml(reference.name)}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "reference-actions";
    const downloadLink = document.createElement("a");
    downloadLink.className = "download-link reference-download-link";
    downloadLink.href = reference.dataUrl;
    downloadLink.download = getReferenceDownloadFilename(reference);
    downloadLink.textContent = "Download";
    downloadLink.setAttribute("aria-label", `Download reference: ${caption}`);
    downloadLink.addEventListener("click", (event) => event.stopPropagation());
    actions.append(downloadLink);
    details.append(actions);

    const deleteButton = document.createElement("button");
    deleteButton.className = "reference-delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Delete reference: ${caption}`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteReference(reference.id);
    });
    item.append(previewButton, details, deleteButton);
    referenceList.append(item);
  });
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
  const noted = all.filter(hasReviewNotes).length;
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
  const displayTitle = getDisplayTitle(item);
  const card = document.createElement("article");
  card.className = "image-card";

  const imageButton = document.createElement("button");
  imageButton.className = "image-button";
  imageButton.type = "button";
  imageButton.setAttribute("aria-label", `Open ${displayTitle} preview`);
  imageButton.innerHTML = `<img src="${escapeAttribute(item.file)}" alt="${escapeAttribute(displayTitle)}" loading="lazy">`;
  imageButton.addEventListener("click", () => openLightbox(item));

  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `
    <div class="card-title-row">
      <span class="card-meta">${escapeHtml(item.group)}</span>
      <h4><span class="card-number">#${item.index + 1}</span> ${escapeHtml(item.title)}</h4>
    </div>
  `;

  if (item.direction) {
    const direction = document.createElement("p");
    direction.className = "card-direction";
    direction.textContent = item.direction;
    body.append(direction);
  }

  const downloadLink = document.createElement("a");
  downloadLink.className = "download-link";
  downloadLink.href = item.file;
  downloadLink.download = getDownloadFilename(item);
  downloadLink.textContent = "Download image";
  downloadLink.setAttribute("aria-label", `Download image: ${item.title}`);
  downloadLink.addEventListener("click", (event) => event.stopPropagation());

  const ratingRow = document.createElement("div");
  ratingRow.className = `rating-row${review.rating ? "" : " unrated"}`;
  ratingRow.setAttribute("aria-label", `Rating for ${item.title}`);

  for (let rating = 1; rating <= 5; rating += 1) {
    const button = document.createElement("button");
    button.className = `star-button${rating <= review.rating ? " active" : ""}`;
    button.type = "button";
    button.textContent = "★";
    button.title = `${rating} star`;
    button.setAttribute("aria-label", `Rate ${item.title} ${rating} star`);
    button.addEventListener("click", () => updateRating(item.file, rating));
    ratingRow.append(button);
  }

  const clearButton = document.createElement("button");
  clearButton.className = "clear-rating";
  clearButton.type = "button";
  clearButton.textContent = "Unrate";
  clearButton.addEventListener("click", () => updateRating(item.file, 0));

  const unratedLabel = document.createElement("span");
  unratedLabel.className = "unrated-label";
  unratedLabel.textContent = "Unrated";
  ratingRow.append(clearButton, unratedLabel);

  const thread = createImageNoteThread(item, review);
  body.append(downloadLink, ratingRow, thread);
  card.append(imageButton, body);
  return card;
}

function createImageNoteThread(item, review) {
  const wrap = document.createElement("div");
  wrap.className = "image-note-area";

  const list = document.createElement("div");
  list.className = "note-thread";
  renderNoteThread(list, getDisplayNotes(review), "No notes saved for this image.", {
    onDelete: (note) => deleteImageNote(item.file, note.id)
  });

  const addButton = document.createElement("button");
  addButton.className = "secondary-action";
  addButton.type = "button";
  addButton.textContent = "Add note";

  const form = document.createElement("form");
  form.className = "note-form";
  form.hidden = true;
  form.innerHTML = `
    <label for="note-from-${escapeAttribute(slugId(item.file))}">From</label>
    <div class="from-picker" data-from-picker>
      <button class="from-choice" type="button" data-from="Hannah">Hannah</button>
      <button class="from-choice" type="button" data-from="Andrew">Andrew</button>
      <input id="note-from-${escapeAttribute(slugId(item.file))}" type="hidden" value="Hannah">
    </div>
    <label for="note-${escapeAttribute(slugId(item.file))}">New note</label>
    <textarea id="note-${escapeAttribute(slugId(item.file))}" maxlength="${maxNotesLength}" placeholder="Save a note for Andrew and Hannah" required></textarea>
    <div class="form-actions">
      <button class="primary-action" type="submit">Save</button>
      <button class="secondary-action" type="button">Cancel</button>
    </div>
  `;

  const textarea = form.querySelector("textarea");
  const fromInput = form.querySelector("input");
  const cancelButton = form.querySelector(".form-actions button[type='button']");
  setupFromPicker(form);
  addButton.addEventListener("click", () => {
    addButton.hidden = true;
    form.hidden = false;
    textarea.focus();
  });
  cancelButton.addEventListener("click", () => {
    setFromPickerValue(form, "Hannah");
    textarea.value = "";
    form.hidden = true;
    addButton.hidden = false;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    appendImageNote(item.file, fromInput.value, textarea.value);
  });

  wrap.append(list, addButton, form);
  return wrap;
}

function renderNoteThread(container, notes, emptyText, options = {}) {
  container.innerHTML = "";
  const visibleNotes = getSortedByCreatedAt(notes).filter((note) => note.text.trim());
  if (!visibleNotes.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }

  visibleNotes.forEach((note) => {
    const entry = document.createElement("article");
    entry.className = "note-entry";
    const header = document.createElement("div");
    header.className = "note-entry-header";
    header.innerHTML = `
      <div class="note-meta">
        <span>${escapeHtml(getNoteAuthor(note))}</span>
        <time datetime="${escapeAttribute(note.createdAt)}">${escapeHtml(formatDate(note.createdAt))}</time>
      </div>
    `;
    if (typeof options.onDelete === "function") {
      const deleteButton = document.createElement("button");
      deleteButton.className = "note-delete-button";
      deleteButton.type = "button";
      deleteButton.textContent = "X";
      deleteButton.title = "Delete note";
      deleteButton.setAttribute("aria-label", `Delete note from ${getNoteAuthor(note)}`);
      deleteButton.addEventListener("click", () => options.onDelete(note));
      header.append(deleteButton);
    }
    const text = document.createElement("p");
    text.textContent = note.text;
    entry.append(header, text);
    container.append(entry);
  });
}

function showMasterNoteForm(show) {
  masterNoteForm.hidden = !show;
  masterNoteButton.hidden = show;
  if (show) {
    masterNoteText.focus();
  } else {
    setFromPickerValue(masterNoteForm, "Hannah");
    masterNoteText.value = "";
  }
}

function appendMasterNote(from, text) {
  const note = makeNote(from, text);
  if (!note) return;
  boardState.masterNotes = mergeById(boardState.masterNotes, [note]);
  saveBoardState();
  showMasterNoteForm(false);
  render();
  saveFullBoardToCloud();
}

function appendImageNote(file, from, text) {
  const item = manifest.find((entry) => entry.file === file);
  if (!item) return;
  const note = makeNote(from, text);
  if (!note) return;
  const current = getReview(item);
  boardState.reviews[file] = {
    ...current,
    noteThread: mergeById(current.noteThread, [note]),
    updatedAt: note.createdAt
  };
  saveBoardState();
  render();
  saveFullBoardToCloud();
}

async function deleteMasterNote(noteId) {
  const previousMasterNotes = boardState.masterNotes;
  boardState.masterNotes = boardState.masterNotes.filter((note) => note.id !== noteId);
  saveBoardState();
  render();
  try {
    await saveDeleteActionToCloud({ action: "deleteMasterNote", id: noteId });
  } catch (error) {
    boardState.masterNotes = previousMasterNotes;
    saveBoardState();
    render();
    setCloudStatus("Saving failed");
  }
}

async function deleteImageNote(file, noteId) {
  const item = manifest.find((entry) => entry.file === file);
  if (!item) return;
  const id = String(noteId || "");
  const current = getReview(item);
  const previousReview = boardState.reviews[file] ? { ...boardState.reviews[file] } : null;
  const nextThread = current.noteThread.filter((note) => note.id !== id);
  const nextNotes = id.startsWith("legacy-") ? "" : current.notes;
  boardState.reviews[file] = cleanReview({
    ...current,
    notes: nextNotes,
    noteThread: nextThread,
    updatedAt: new Date().toISOString()
  });
  boardState.reviews = filterReviewState(boardState.reviews);
  saveBoardState();
  render();
  try {
    await saveDeleteActionToCloud({ action: "deleteImageNote", file, id });
  } catch (error) {
    if (previousReview) {
      boardState.reviews[file] = previousReview;
    } else {
      delete boardState.reviews[file];
    }
    saveBoardState();
    render();
    setCloudStatus("Saving failed");
  }
}

async function deleteReference(referenceId) {
  const id = String(referenceId || "");
  if (!id) return;
  const previousReferences = boardState.references;
  boardState.references = boardState.references.filter((reference) => reference.id !== id);
  saveBoardState();
  render();
  try {
    await saveDeleteActionToCloud({ action: "deleteReference", id });
  } catch (error) {
    boardState.references = previousReferences;
    saveBoardState();
    render();
    setCloudStatus("Saving failed");
  }
}

async function updateRating(file, rating) {
  const item = manifest.find((entry) => entry.file === file);
  if (!item) return;
  const current = getReview(item);
  const previousReview = boardState.reviews[file] ? cleanReview(boardState.reviews[file]) : null;
  const nextRating = normalizeRating(rating);
  const updatedAt = new Date().toISOString();
  boardState.reviews[file] = cleanReview({
    ...current,
    rating: nextRating,
    updatedAt
  });
  boardState.reviews = filterReviewState(boardState.reviews);
  saveBoardState();
  render();
  try {
    await saveRatingActionToCloud(file, nextRating, updatedAt);
  } catch (error) {
    if (previousReview) {
      boardState.reviews[file] = previousReview;
    } else {
      delete boardState.reviews[file];
    }
    saveBoardState();
    render();
    setCloudStatus("Saving failed");
  }
}

async function uploadReference() {
  if (isUploadingReference) return;
  referenceError.textContent = "";
  setReferenceUploadStatus("");
  const file = referenceFile.files && referenceFile.files[0];
  if (!file) {
    referenceError.textContent = "Choose an image before saving.";
    setReferenceUploadState(false);
    return;
  }
  if (!file.type || !file.type.startsWith("image/")) {
    referenceError.textContent = "Reference uploads must be image files.";
    setReferenceUploadState(false);
    return;
  }
  if (file.size > maxReferenceFileSize) {
    referenceError.textContent = "That image is too large. Please upload one under 20 MB.";
    setReferenceUploadState(false);
    return;
  }

  setReferenceUploadState(true, "Reading image...");
  try {
    const dataUrl = await createUploadDataUrl(file);
    if (!isValidReferenceDataUrl(dataUrl)) {
      referenceError.textContent = "That image could not be optimised for upload. Try a smaller file.";
      return;
    }
    setReferenceUploadStatus("Saving upload...");
    const now = new Date().toISOString();
    const reference = {
      id: createId("ref"),
      name: file.name || "reference image",
      type: file.type,
      dataUrl,
      createdAt: now,
      caption: referenceCaption.value.trim().slice(0, 180)
    };
    await saveReferenceToCloud(reference);
    boardState.references = mergeById(boardState.references, [reference]);
    saveBoardState();
    referenceFile.value = "";
    referenceCaption.value = "";
    clearReferencePreview();
    setReferenceUploadStatus("");
    render();
  } catch (error) {
    setCloudStatus("Cloud unavailable");
    referenceError.textContent = "The image could not be uploaded. Try again or choose a smaller file.";
  } finally {
    setReferenceUploadState(false);
  }
}

function updateReferencePreview() {
  referenceError.textContent = "";
  setReferenceUploadStatus("");
  clearReferencePreview();
  const file = referenceFile.files && referenceFile.files[0];
  if (!file) return;
  if (!file.type || !file.type.startsWith("image/")) {
    referenceError.textContent = "Reference uploads must be image files.";
    return;
  }
  if (file.size > maxReferenceFileSize) {
    referenceError.textContent = "That image is too large. Please upload one under 20 MB.";
    return;
  }
  selectedReferencePreviewUrl = URL.createObjectURL(file);
  referencePreview.innerHTML = `
    <img src="${escapeAttribute(selectedReferencePreviewUrl)}" alt="">
    <div>
      <strong>${escapeHtml(file.name || "Selected image")}</strong>
      <span>${escapeHtml(formatFileSize(file.size))}</span>
    </div>
  `;
  referencePreview.hidden = false;
}

function clearReferencePreview() {
  if (selectedReferencePreviewUrl) URL.revokeObjectURL(selectedReferencePreviewUrl);
  selectedReferencePreviewUrl = "";
  referencePreview.innerHTML = "";
  referencePreview.hidden = true;
}

function setReferenceUploadState(isSaving, message = "") {
  isUploadingReference = isSaving;
  referenceForm.classList.toggle("is-saving", isSaving);
  referenceSave.disabled = isSaving;
  referenceFile.disabled = isSaving;
  referenceCaption.disabled = isSaving;
  referenceSave.textContent = isSaving ? "Saving..." : "Save";
  setReferenceUploadStatus(message);
}

function setReferenceUploadStatus(message) {
  if (referenceStatus) referenceStatus.textContent = message;
}

async function saveReferenceToCloud(reference) {
  setCloudStatus("Saving");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), referenceUploadTimeout);
  let response;
  try {
    response = await fetch(reviewEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "uploadReference", reference }),
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timeout);
  }
  if (!response.ok) throw new Error(`Reference upload returned ${response.status}`);
  const data = await response.json();
  mergeCloudBoard(normalizeBoardState(data));
  setCloudStatus("Cloud saved");
}

async function createUploadDataUrl(file) {
  const originalDataUrl = await readFileAsDataUrl(file);
  if (originalDataUrl.length <= maxReferenceEncodedLength) return originalDataUrl;
  setReferenceUploadStatus("Optimising image...");
  if (!window.createImageBitmap) return originalDataUrl;

  const bitmap = await createImageBitmap(file);
  const maxSides = [1800, 1400, 1100, 900];
  const qualities = [0.86, 0.78, 0.7, 0.62];
  try {
    for (const maxSide of maxSides) {
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) continue;
      context.drawImage(bitmap, 0, 0, width, height);
      for (const quality of qualities) {
        const compressed = canvas.toDataURL("image/jpeg", quality);
        if (compressed.length <= maxReferenceEncodedLength) return compressed;
      }
    }
  } finally {
    if (typeof bitmap.close === "function") bitmap.close();
  }
  return originalDataUrl;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function getDownloadFilename(item) {
  const extensionMatch = item.file.match(/(\.[a-z0-9]+)(?:[?#].*)?$/i);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "";
  const indexMatch = item.file.match(/(?:^|\/)(\d{2,})[-_]/);
  const prefix = indexMatch ? `${indexMatch[1]}-` : "";
  const slug = item.title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${prefix}${slug || "image"}${extension || ".png"}`;
}

function getReferenceDownloadFilename(reference) {
  const extension = getReferenceFileExtension(reference);
  return createSafeDownloadFilename(reference.caption || reference.name, extension, "reference-image");
}

function getReferenceFileExtension(reference) {
  const name = String(reference?.name || "");
  const extensionMatch = name.match(/\.([a-z0-9]{2,8})$/i);
  if (extensionMatch) return `.${extensionMatch[1].toLowerCase()}`;

  const mimeMatch = String(reference?.dataUrl || "").match(/^data:image\/([a-z0-9.+-]+);base64,/i);
  const mimeSubtype = (mimeMatch && mimeMatch[1] ? mimeMatch[1].toLowerCase() : "").split(";")[0];
  const mimeMap = {
    jpeg: ".jpg",
    jpg: ".jpg",
    pjpeg: ".jpg",
    png: ".png",
    gif: ".gif",
    webp: ".webp",
    avif: ".avif",
    bmp: ".bmp",
    "svg+xml": ".svg",
    "x-icon": ".ico",
    "vnd.microsoft.icon": ".ico",
    tiff: ".tiff"
  };
  return mimeMap[mimeSubtype] || ".png";
}

function createSafeDownloadFilename(value, extension, fallbackName) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const fallbackSlug = String(fallbackName || "image")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "image";
  const safeExtension = /^\.[a-z0-9]{2,8}$/i.test(String(extension || ""))
    ? String(extension).toLowerCase()
    : ".png";
  return `${slug || fallbackSlug}${safeExtension}`;
}

function getReview(item) {
  const saved = boardState.reviews[item.file] || {};
  return cleanReview({
    rating: saved.rating ?? 0,
    notes: saved.notes ?? item.notes,
    noteThread: saved.noteThread,
    updatedAt: saved.updatedAt
  });
}

async function syncReviewsFromCloud(options = {}) {
  if (isSyncingCloud) return;
  isSyncingCloud = true;
  const showStatus = Boolean(options.showStatus);
  if (showStatus) setCloudStatus("Syncing");
  try {
    const response = await fetch(reviewEndpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`Reviews returned ${response.status}`);
    const data = await response.json();
    const cloudBoard = normalizeBoardState(data);
    const localUpdates = mergeCloudBoard(cloudBoard);
    saveBoardState();
    if (!hasOpenDraftForm()) render();
    if (showStatus || cloudStatusEl?.textContent === "Cloud unavailable") setCloudStatus("Cloud synced");
    if (Object.keys(localUpdates).length || pendingFullCloudSave) saveFullBoardToCloud();
  } catch (error) {
    setCloudStatus("Cloud unavailable");
  } finally {
    isSyncingCloud = false;
  }
}

function mergeCloudBoard(cloudBoard) {
  const localUpdates = {};
  boardState.masterNotes = cloudBoard.masterNotes;
  boardState.references = cloudBoard.references;

  Object.entries(cloudBoard.reviews).forEach(([file, cloudReview]) => {
    const localReview = boardState.reviews[file];
    if (!localReview || isNewer(cloudReview.updatedAt, localReview.updatedAt)) {
      boardState.reviews[file] = cleanReview(cloudReview);
      return;
    }
    if (isNewer(localReview.updatedAt, cloudReview.updatedAt)) {
      localUpdates[file] = cleanReview(localReview);
      boardState.reviews[file] = localUpdates[file];
      return;
    }
    boardState.reviews[file] = cleanReview(cloudReview);
  });

  Object.keys(boardState.reviews).forEach((file) => {
    // Missing cloud reviews are authoritative deletes/clears. Do not reupload them,
    // because stale tabs or localStorage can otherwise resurrect deleted notes or unrated images.
    if (!cloudBoard.reviews[file]) delete boardState.reviews[file];
  });
  boardState.reviews = filterReviewState(boardState.reviews);
  return localUpdates;
}

function queueCloudSave(files) {
  const fileList = typeof files === "string" ? [files] : Object.keys(files || {});
  fileList.forEach((file) => {
    if (manifestFiles.has(file)) pendingCloudFiles.add(file);
  });
  if (!pendingCloudFiles.size) return;
  setCloudStatus("Saving");
  window.clearTimeout(cloudTimer);
  cloudTimer = window.setTimeout(savePendingReviewsToCloud, cloudSaveDelay);
}

async function savePendingReviewsToCloud() {
  const reviews = {};
  pendingCloudFiles.forEach((file) => {
    if (boardState.reviews[file]) reviews[file] = boardState.reviews[file];
  });
  pendingCloudFiles.clear();
  if (!Object.keys(reviews).length) return;

  try {
    const response = await fetch(reviewEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews })
    });
    if (!response.ok) throw new Error(`Save returned ${response.status}`);
    const data = await response.json();
    mergeCloudBoard(normalizeBoardState(data));
    saveBoardState();
    render();
    setCloudStatus("Cloud saved");
  } catch (error) {
    Object.keys(reviews).forEach((file) => pendingCloudFiles.add(file));
    setCloudStatus("Cloud unavailable");
  }
}

async function saveFullBoardToCloud() {
  pendingFullCloudSave = true;
  setCloudStatus("Saving");
  try {
    const response = await fetch(reviewEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toCloudBoard(boardState))
    });
    if (!response.ok) throw new Error(`Save returned ${response.status}`);
    const data = await response.json();
    pendingFullCloudSave = false;
    mergeCloudBoard(normalizeBoardState(data));
    saveBoardState();
    render();
    setCloudStatus("Cloud saved");
  } catch (error) {
    setCloudStatus("Cloud unavailable");
  }
}

async function saveDeleteActionToCloud(payload) {
  setCloudStatus("Saving");
  const response = await fetch(reviewEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Delete returned ${response.status}`);
  const data = await response.json();
  mergeCloudBoard(normalizeBoardState(data));
  saveBoardState();
  render();
  setCloudStatus("Cloud saved");
}

async function saveRatingActionToCloud(file, rating, updatedAt) {
  setCloudStatus("Saving");
  const response = await fetch(reviewEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateRating",
      file,
      rating,
      updatedAt
    })
  });
  if (!response.ok) throw new Error(`Rating save returned ${response.status}`);
  const data = await response.json();
  mergeCloudBoard(normalizeBoardState(data));
  saveBoardState();
  render();
  setCloudStatus("Cloud saved");
}

function toCloudBoard(state) {
  return {
    action: "replaceBoard",
    reviews: state.reviews,
    masterNotes: state.masterNotes,
    references: state.references,
    updatedAt: new Date().toISOString()
  };
}

function normalizeBoardState(data) {
  return {
    reviews: normalizeReviewMap(data.reviews || data),
    masterNotes: normalizeNotes(data.masterNotes || []),
    references: normalizeReferences(data.references || []),
    updatedAt: isIsoDate(data.updatedAt) ? data.updatedAt : ""
  };
}

function normalizeReviewMap(reviews) {
  const normalized = {};
  Object.entries(reviews || {}).forEach(([file, review]) => {
    if (!manifestFiles.has(file) || !review || typeof review !== "object") return;
    normalized[file] = cleanReview(review);
  });
  return normalized;
}

function filterReviewState(state) {
  const filtered = {};
  Object.entries(state || {}).forEach(([file, review]) => {
    if (!manifestFiles.has(file) || !review || typeof review !== "object") return;
    const cleaned = cleanReview(review);
    if (cleaned.rating || hasReviewNotes(cleaned)) filtered[file] = cleaned;
  });
  return filtered;
}

function cleanReview(review) {
  return {
    rating: normalizeRating(review.rating),
    notes: String(review.notes || "").slice(0, maxNotesLength),
    noteThread: normalizeNotes(review.noteThread || []),
    updatedAt: isIsoDate(review.updatedAt) ? review.updatedAt : ""
  };
}

function normalizeNotes(notes) {
  if (!Array.isArray(notes)) return [];
  return notes.map((note) => ({
    id: String(note?.id || ""),
    from: String(note?.from || "").trim().slice(0, 80),
    text: String(note?.text || "").slice(0, maxNotesLength),
    createdAt: isIsoDate(note?.createdAt) ? note.createdAt : ""
  })).filter((note) => note.id && note.text.trim() && note.createdAt);
}

function normalizeReferences(references) {
  if (!Array.isArray(references)) return [];
  return references.map((reference) => ({
    id: String(reference?.id || ""),
    name: String(reference?.name || "reference image").slice(0, 180),
    type: String(reference?.type || "").slice(0, 80),
    dataUrl: String(reference?.dataUrl || ""),
    createdAt: isIsoDate(reference?.createdAt) ? reference.createdAt : "",
    caption: String(reference?.caption || "").slice(0, 180)
  })).filter((reference) => (
    reference.id &&
    reference.createdAt &&
    isValidReferenceDataUrl(reference.dataUrl)
  ));
}

function mergeById(localItems, cloudItems) {
  const merged = new Map();
  [...normalizeArray(localItems), ...normalizeArray(cloudItems)].forEach((item) => {
    if (!item || !item.id) return;
    const existing = merged.get(item.id);
    if (!existing || isNewer(item.createdAt, existing.createdAt)) merged.set(item.id, item);
  });
  return getSortedByCreatedAt([...merged.values()]);
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getDisplayNotes(review) {
  const notes = [...review.noteThread];
  if (review.notes.trim()) {
    notes.unshift({
      id: `legacy-${hashText(review.notes)}`,
      from: "",
      text: review.notes,
      createdAt: review.updatedAt || new Date(0).toISOString()
    });
  }
  return notes;
}

function hasReviewNotes(review) {
  return Boolean(review.notes.trim() || review.noteThread.some((note) => note.text.trim()));
}

function makeNote(from, text) {
  const trimmed = String(text || "").trim().slice(0, maxNotesLength);
  if (!trimmed) return null;
  return {
    id: createId("note"),
    from: normalizeNoteAuthor(from) || "Anonymous",
    text: trimmed,
    createdAt: new Date().toISOString()
  };
}

function normalizeNoteAuthor(from) {
  return String(from || "").trim().slice(0, 80);
}

function getNoteAuthor(note) {
  return normalizeNoteAuthor(note?.from) || "Unknown";
}

function createId(prefix) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function getSortedByCreatedAt(items) {
  return [...normalizeArray(items)].sort((a, b) => {
    const aTime = Date.parse(a.createdAt || "") || 0;
    const bTime = Date.parse(b.createdAt || "") || 0;
    return aTime - bTime;
  });
}

function isValidReferenceDataUrl(dataUrl) {
  return /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(dataUrl) &&
    dataUrl.length <= maxReferenceEncodedLength;
}

function formatFileSize(bytes) {
  const size = Number(bytes) || 0;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} bytes`;
}

function setCloudStatus(message) {
  if (cloudStatusEl) cloudStatusEl.textContent = message;
}

function normalizeRating(value) {
  const rating = Number(value);
  return Math.max(0, Math.min(5, Number.isFinite(rating) ? Math.round(rating) : 0));
}

function isNewer(candidate, reference) {
  if (!isIsoDate(candidate)) return false;
  if (!isIsoDate(reference)) return true;
  return new Date(candidate).getTime() > new Date(reference).getTime();
}

function isIsoDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function loadBoardState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return makeEmptyBoard();
    if (stored.reviews || stored.masterNotes || stored.references) {
      return {
        reviews: stored.reviews && typeof stored.reviews === "object" ? stored.reviews : {},
        masterNotes: normalizeNotes(stored.masterNotes || []),
        references: normalizeReferences(stored.references || []),
        updatedAt: isIsoDate(stored.updatedAt) ? stored.updatedAt : ""
      };
    }
    return {
      reviews: stored,
      masterNotes: [],
      references: [],
      updatedAt: ""
    };
  } catch {
    return makeEmptyBoard();
  }
}

function makeEmptyBoard() {
  return {
    reviews: {},
    masterNotes: [],
    references: [],
    updatedAt: ""
  };
}

function toLocalBoardState(state) {
  return {
    reviews: state.reviews,
    masterNotes: [],
    references: [],
    updatedAt: state.updatedAt
  };
}

function saveBoardState() {
  boardState.updatedAt = new Date().toISOString();
  try {
    const localState = toLocalBoardState(boardState);
    localStorage.removeItem(storageKey);
    localStorage.setItem(storageKey, JSON.stringify(localState));
  } catch {
    // Local persistence is best-effort; cloud saves and UI flows should continue.
  }
}

function getDisplayTitle(item) {
  return `#${item.index + 1} ${item.title}`;
}

function openLightbox(item) {
  const displayTitle = getDisplayTitle(item);
  openLightboxSource({
    src: item.file,
    alt: displayTitle,
    caption: `${displayTitle} · ${item.group}`
  });
}

function openLightboxSource({ src, alt, caption }) {
  const imageSrc = String(src || "").trim();
  if (!imageSrc) return;
  lightboxImage.src = imageSrc;
  lightboxImage.alt = String(alt || "");
  lightboxCaption.textContent = String(caption || "");
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  document.body.style.overflow = "";
}

function getReferenceCaption(reference) {
  return String(reference?.caption || reference?.name || "Reference image").trim().slice(0, 180) || "Reference image";
}

function formatDate(value) {
  if (!isIsoDate(value)) return "Unknown time";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function slugId(value) {
  return String(value).replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "image";
}

function hashText(value) {
  let hash = 0;
  String(value).split("").forEach((char) => {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  });
  return Math.abs(hash).toString(36);
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
