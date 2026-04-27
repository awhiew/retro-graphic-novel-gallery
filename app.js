const storageKey = "retroGraphicNovelReviewBoard:v1";
const reviewEndpoint =
  window.RETRO_REVIEW_API ||
  "https://retro-graphic-novel-review-api.andrewhiew.workers.dev";
const maxNotesLength = 5000;
const maxReferenceEncodedLength = 3 * 1024 * 1024;
const cloudSaveDelay = 500;

const groupDirections = {
  "Reference Redos": "Compare the core character silhouette, face, outfit language, and cover-read appeal.",
  "Bold Style Explorations": "Use this as a style-range check for linework, color, texture, and world tone.",
  "Cute-Sexy Style Anchors": "Judge whether this balances charm, confidence, softness, and memorable lead-character appeal.",
  "Cute-Sexy Scene Variations": "Review how the character and companion read in a story moment with clear setting and mood.",
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
  {"file":"assets/images/15-roxy_vega_01_cute_retro_pulp_romance.png","title":"Cute Retro Pulp Romance","group":"Cute-Sexy Style Anchors","rating":0,"notes":""},
  {"file":"assets/images/16-roxy_vega_02_kawaii_space_noir.png","title":"Kawaii Space Noir","group":"Cute-Sexy Style Anchors","rating":0,"notes":""},
  {"file":"assets/images/17-roxy_vega_03_dreamy_anime_gouache.png","title":"Dreamy Anime Gouache","group":"Cute-Sexy Style Anchors","rating":0,"notes":""},
  {"file":"assets/images/18-roxy_vega_01_space_diner.png","title":"Space Diner","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/19-roxy_vega_02_raygun_scooter.png","title":"Raygun Scooter","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/20-roxy_vega_03_starship_cockpit.png","title":"Starship Cockpit","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/21-roxy_vega_04_alien_beach.png","title":"Alien Beach","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/22-roxy_vega_05_moon_lounge.png","title":"Moon Lounge","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/23-roxy_vega_06_galaxy_map_room.png","title":"Galaxy Map Room","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/24-roxy_vega_07_space_mechanic.png","title":"Space Mechanic","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/25-roxy_vega_08_alien_garden.png","title":"Alien Garden","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/26-roxy_vega_09_bounty_poster_chase.png","title":"Bounty Poster Chase","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
  {"file":"assets/images/27-roxy_vega_10_first_issue_hero.png","title":"First Issue Hero","group":"Cute-Sexy Scene Variations","rating":0,"notes":""},
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
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const masterNoteButton = document.querySelector("#add-master-note");
const masterNoteForm = document.querySelector("#master-note-form");
const masterNoteFrom = document.querySelector("#master-note-from");
const masterNoteText = document.querySelector("#master-note-text");
const cancelMasterNoteButton = document.querySelector("#cancel-master-note");
const masterNotesList = document.querySelector("#master-notes-list");
const referenceForm = document.querySelector("#reference-form");
const referenceFile = document.querySelector("#reference-file");
const referenceCaption = document.querySelector("#reference-caption");
const referenceError = document.querySelector("#reference-error");
const referenceList = document.querySelector("#reference-list");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

let manifest = [];
let manifestFiles = new Set();
let boardState = loadBoardState();
let activeFilter = "all";
let activeSort = "original";
let cloudTimer = 0;
let pendingCloudFiles = new Set();
let pendingFullCloudSave = false;

const filters = {
  all: () => true,
  five: (item) => getReview(item).rating === 5,
  fourPlus: (item) => getReview(item).rating >= 4,
  notes: (item) => hasReviewNotes(getReview(item)),
  unrated: (item) => getReview(item).rating === 0
};

init();

async function init() {
  manifest = await loadManifest();
  manifestFiles = new Set(manifest.map((item) => item.file));
  boardState.reviews = filterReviewState(boardState.reviews);
  saveBoardState();
  render();
  bindControls();
  syncReviewsFromCloud();
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

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

function setupFromPicker(scope) {
  const picker = scope.querySelector("[data-from-picker]");
  if (!picker) return;
  const input = picker.querySelector("input");
  const choices = [...picker.querySelectorAll("[data-from]")];
  const updateActive = () => {
    const value = String(input.value || "").trim();
    choices.forEach((button) => button.classList.toggle("active", button.dataset.from === value));
  };
  choices.forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.from || "";
      updateActive();
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });
  input.addEventListener("input", updateActive);
  updateActive();
}

function render() {
  const filtered = getSortedItems().filter(filters[activeFilter] || filters.all);
  renderMasterPanel();
  renderSummary(filtered);
  renderGroups(filtered);
}

function renderMasterPanel() {
  renderNoteThread(masterNotesList, boardState.masterNotes, "No master notes saved yet.", {
    onDelete: deleteMasterNote
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
    const caption = reference.caption || reference.name;
    item.innerHTML = `
      <img src="${escapeAttribute(reference.dataUrl)}" alt="${escapeAttribute(caption)}" loading="lazy">
      <div>
        <strong>${escapeHtml(caption)}</strong>
        <time datetime="${escapeAttribute(reference.createdAt)}">${escapeHtml(formatDate(reference.createdAt))}</time>
        <span>${escapeHtml(reference.name)}</span>
      </div>
    `;
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
      <button class="from-choice" type="button" data-from="Andrew">Andrew</button>
      <button class="from-choice" type="button" data-from="Hannah">Hannah</button>
      <input id="note-from-${escapeAttribute(slugId(item.file))}" type="text" maxlength="80" placeholder="Other name" autocomplete="name" required>
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
    fromInput.focus();
  });
  cancelButton.addEventListener("click", () => {
    fromInput.value = "";
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
    masterNoteFrom.focus();
  } else {
    masterNoteFrom.value = "";
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

function deleteMasterNote(noteId) {
  boardState.masterNotes = boardState.masterNotes.filter((note) => note.id !== noteId);
  saveBoardState();
  render();
  saveFullBoardToCloud();
}

function deleteImageNote(file, noteId) {
  const item = manifest.find((entry) => entry.file === file);
  if (!item) return;
  const id = String(noteId || "");
  const current = getReview(item);
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
  saveFullBoardToCloud();
}

function updateRating(file, rating) {
  const item = manifest.find((entry) => entry.file === file);
  if (!item) return;
  const current = getReview(item);
  boardState.reviews[file] = cleanReview({
    ...current,
    rating: normalizeRating(rating),
    updatedAt: new Date().toISOString()
  });
  saveBoardState();
  queueCloudSave(file);
  render();
}

async function uploadReference() {
  referenceError.textContent = "";
  const file = referenceFile.files && referenceFile.files[0];
  if (!file) {
    referenceError.textContent = "Choose an image before saving.";
    return;
  }
  if (!file.type || !file.type.startsWith("image/")) {
    referenceError.textContent = "Reference uploads must be image files.";
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    referenceError.textContent = "That image is too large. Please upload one under 2 MB.";
    return;
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    if (!isValidReferenceDataUrl(dataUrl)) {
      referenceError.textContent = "That image is too large or not a supported image data URL.";
      return;
    }
    const now = new Date().toISOString();
    const reference = {
      id: createId("ref"),
      name: file.name || "reference image",
      type: file.type,
      dataUrl,
      createdAt: now,
      caption: referenceCaption.value.trim().slice(0, 180)
    };
    boardState.references = mergeById(boardState.references, [reference]);
    referenceFile.value = "";
    referenceCaption.value = "";
    saveBoardState();
    render();
    saveFullBoardToCloud();
  } catch (error) {
    referenceError.textContent = "The image could not be read. Try a different file.";
  }
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

function getReview(item) {
  const saved = boardState.reviews[item.file] || {};
  return cleanReview({
    rating: saved.rating ?? item.rating,
    notes: saved.notes ?? item.notes,
    noteThread: saved.noteThread,
    updatedAt: saved.updatedAt
  });
}

async function syncReviewsFromCloud() {
  setCloudStatus("Syncing");
  try {
    const response = await fetch(reviewEndpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`Reviews returned ${response.status}`);
    const data = await response.json();
    const cloudBoard = normalizeBoardState(data);
    const localUpdates = mergeCloudBoard(cloudBoard);
    saveBoardState();
    render();
    setCloudStatus("Cloud synced");
    if (Object.keys(localUpdates).length || pendingFullCloudSave) saveFullBoardToCloud();
  } catch (error) {
    setCloudStatus("Cloud unavailable");
  }
}

function mergeCloudBoard(cloudBoard) {
  const localUpdates = {};
  boardState.masterNotes = mergeById(boardState.masterNotes, cloudBoard.masterNotes);
  boardState.references = mergeById(boardState.references, cloudBoard.references);

  Object.entries(cloudBoard.reviews).forEach(([file, cloudReview]) => {
    const localReview = boardState.reviews[file];
    const mergedThread = mergeById(localReview?.noteThread || [], cloudReview.noteThread || []);
    if (!localReview || isNewer(cloudReview.updatedAt, localReview.updatedAt)) {
      boardState.reviews[file] = cleanReview({ ...cloudReview, noteThread: mergedThread });
      return;
    }
    if (isNewer(localReview.updatedAt, cloudReview.updatedAt)) {
      localUpdates[file] = cleanReview({ ...localReview, noteThread: mergedThread });
      boardState.reviews[file] = localUpdates[file];
      return;
    }
    boardState.reviews[file] = cleanReview({ ...localReview, noteThread: mergedThread });
  });

  Object.entries(boardState.reviews).forEach(([file, review]) => {
    if (!cloudBoard.reviews[file] && isIsoDate(review.updatedAt)) localUpdates[file] = review;
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

function saveBoardState() {
  boardState.updatedAt = new Date().toISOString();
  localStorage.setItem(storageKey, JSON.stringify(boardState));
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
