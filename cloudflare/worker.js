const boardKey = "shared-board";
const maxNotesLength = 5000;
const maxReferenceEncodedLength = 6 * 1024 * 1024;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
};

const jsonHeaders = {
  ...corsHeaders,
  "Content-Type": "application/json"
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      if (!env.REVIEW_KV) throw new Error("REVIEW_KV binding is not configured");

      if (request.method === "GET") {
        const board = await readBoard(env);
        return jsonResponse(200, serializeBoard(board));
      }

      if (request.method === "POST") {
        const body = await parseBody(request);
        const board = await readBoard(env);
        const now = new Date().toISOString();
        const replacesBoard = body.action === "replaceBoard";

        applyPostBody(board, body, now);
        if (!replacesBoard || !board.updatedAt) board.updatedAt = now;
        applyTombstones(board);
        board.reviews = pruneReviews(board.reviews);
        await writeBoard(env, board);
        return jsonResponse(200, serializeBoard(board));
      }

      return jsonResponse(405, { ok: false, error: "Method not allowed" });
    } catch (error) {
      return jsonResponse(400, { ok: false, error: error.message || "Invalid request" });
    }
  }
};

function applyPostBody(board, body, now) {
  if (body.action) {
    applyAction(board, body, now);
    return;
  }

  if (body.reviews && typeof body.reviews === "object" && !Array.isArray(body.reviews)) {
    mergeReviews(board.reviews, normalizeStoredReviews(body.reviews), now, board);
  }

  if (Array.isArray(body.masterNotes)) {
    board.masterNotes = mergeById(board.masterNotes, normalizeNotes(body.masterNotes));
  }

  if (Array.isArray(body.references)) {
    board.references = mergeById(board.references, normalizeReferences(body.references));
  }

  if (body.file) {
    mergeReviews(board.reviews, normalizeStoredReviews({
      [body.file]: {
        rating: body.rating,
        notes: body.notes,
        updatedAt: body.updatedAt
      }
    }), now, board);
  }

  if (!body.reviews && !Array.isArray(body.masterNotes) && !Array.isArray(body.references) && !body.file) {
    throw new Error("Expected a review object, board fields, or action");
  }
}

function applyAction(board, body, now) {
  if (body.action === "replaceBoard") {
    const replacement = normalizeBoard({
      reviews: body.reviews || {},
      masterNotes: body.masterNotes || [],
      references: body.references || [],
      deletedNoteIds: body.deletedNoteIds || {},
      clearedRatings: body.clearedRatings || {},
      updatedAt: isIsoDate(body.updatedAt) ? body.updatedAt : now
    });
    board.reviews = replacement.reviews;
    board.masterNotes = replacement.masterNotes;
    board.references = replacement.references;
    board.deletedNoteIds = {
      ...board.deletedNoteIds,
      ...replacement.deletedNoteIds
    };
    board.clearedRatings = {
      ...board.clearedRatings,
      ...replacement.clearedRatings
    };
    board.updatedAt = replacement.updatedAt;
    return;
  }

  if (body.action === "appendMasterNote") {
    const note = normalizeNote(body.note || {
      id: body.id,
      from: body.from,
      text: body.text,
      createdAt: body.createdAt || now
    });
    if (!note) throw new Error("Invalid master note");
    board.masterNotes = mergeById(board.masterNotes, [note]);
    return;
  }

  if (body.action === "appendImageNote") {
    const file = String(body.file || "");
    if (!isSafeImagePath(file)) throw new Error("Invalid image file path");
    const note = normalizeNote(body.note || {
      id: body.id,
      from: body.from,
      text: body.text,
      createdAt: body.createdAt || now
    });
    if (!note) throw new Error("Invalid image note");
    const current = board.reviews[file] || emptyReview();
    board.reviews[file] = {
      ...current,
      noteThread: mergeById(current.noteThread, [note]),
      updatedAt: note.createdAt
    };
    return;
  }

  if (body.action === "deleteMasterNote") {
    const id = String(body.id || "").slice(0, 120);
    if (!id) throw new Error("Invalid master note id");
    board.masterNotes = board.masterNotes.filter((note) => note.id !== id);
    return;
  }

  if (body.action === "deleteImageNote") {
    const file = String(body.file || "");
    const id = String(body.id || "").slice(0, 120);
    if (!isSafeImagePath(file)) throw new Error("Invalid image file path");
    if (!id) throw new Error("Invalid image note id");
    const current = board.reviews[file] || emptyReview();
    board.deletedNoteIds[id] = now;
    removeDeletedNoteId(board.reviews, id);
    board.reviews[file] = {
      ...current,
      notes: id.startsWith("legacy-") ? "" : current.notes,
      noteThread: current.noteThread.filter((note) => note.id !== id),
      updatedAt: now
    };
    return;
  }

  if (body.action === "deleteReference") {
    const id = String(body.id || "").slice(0, 120);
    if (!id) throw new Error("Invalid reference id");
    board.references = board.references.filter((reference) => reference.id !== id);
    return;
  }

  if (body.action === "updateRating") {
    const file = String(body.file || "");
    if (!isSafeImagePath(file)) throw new Error("Invalid image file path");
    const current = board.reviews[file] || emptyReview();
    const rating = normalizeRating(body.rating);
    const updatedAt = isIsoDate(body.updatedAt) ? body.updatedAt : now;
    if (rating === 0) {
      board.clearedRatings[file] = updatedAt;
    } else if (!isIsoDate(board.clearedRatings[file]) || isNewer(updatedAt, board.clearedRatings[file])) {
      delete board.clearedRatings[file];
    }
    board.reviews[file] = {
      ...current,
      rating,
      updatedAt
    };
    return;
  }

  if (body.action === "uploadReference") {
    const reference = normalizeReference(body.reference || body);
    if (!reference) throw new Error("Invalid reference upload");
    board.references = mergeById(board.references, [reference]);
    return;
  }

  throw new Error("Unknown action");
}

async function readBoard(env) {
  const saved = await env.REVIEW_KV.get(boardKey, { type: "json" });
  return normalizeBoard(saved || {});
}

async function writeBoard(env, board) {
  await env.REVIEW_KV.put(boardKey, JSON.stringify(board));
}

async function parseBody(request) {
  const text = await request.text();
  if (!text) return {};
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Request body must be an object");
  }
  return parsed;
}

function normalizeBoard(saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
    return emptyBoard();
  }
  return {
    reviews: pruneReviews(normalizeStoredReviews(saved.reviews || {})),
    masterNotes: normalizeNotes(saved.masterNotes || []),
    references: normalizeReferences(saved.references || []),
    deletedNoteIds: normalizeTimestampsByKey(saved.deletedNoteIds || {}),
    clearedRatings: normalizeTimestampsByImagePath(saved.clearedRatings || {}),
    updatedAt: isIsoDate(saved.updatedAt) ? saved.updatedAt : ""
  };
}

function emptyBoard() {
  return {
    reviews: {},
    masterNotes: [],
    references: [],
    deletedNoteIds: {},
    clearedRatings: {},
    updatedAt: ""
  };
}

function serializeBoard(board) {
  return {
    ok: true,
    reviews: board.reviews,
    masterNotes: board.masterNotes,
    references: board.references,
    deletedNoteIds: board.deletedNoteIds,
    clearedRatings: board.clearedRatings,
    updatedAt: board.updatedAt
  };
}

function normalizeStoredReviews(reviews) {
  const normalized = {};
  Object.entries(reviews || {}).forEach(([file, review]) => {
    const safeFile = String(file || "");
    if (!isSafeImagePath(safeFile) || !review || typeof review !== "object") return;
    normalized[safeFile] = {
      rating: normalizeRating(review.rating),
      notes: String(review.notes || "").slice(0, maxNotesLength),
      noteThread: normalizeNotes(review.noteThread || []),
      updatedAt: isIsoDate(review.updatedAt) ? review.updatedAt : ""
    };
  });
  return normalized;
}

function mergeReviews(target, incoming, now, board) {
  applyTombstonesToReviews(incoming, board);
  Object.entries(incoming).forEach(([file, review]) => {
    const current = target[file];
    const updatedAt = isIsoDate(review.updatedAt) ? review.updatedAt : now;
    const mergedThread = mergeById(current?.noteThread || [], review.noteThread || []);
    if (!current || isNewer(updatedAt, current.updatedAt)) {
      target[file] = {
        rating: normalizeRating(review.rating),
        notes: String(review.notes || "").slice(0, maxNotesLength),
        noteThread: mergedThread,
        updatedAt
      };
      return;
    }
    target[file] = {
      ...current,
      noteThread: mergedThread
    };
  });
}

function applyTombstones(board) {
  board.deletedNoteIds = normalizeTimestampsByKey(board.deletedNoteIds || {});
  board.clearedRatings = normalizeTimestampsByImagePath(board.clearedRatings || {});
  applyTombstonesToReviews(board.reviews, board);
}

function applyTombstonesToReviews(reviews, board) {
  if (!reviews || typeof reviews !== "object") return;
  const deletedNoteIds = board?.deletedNoteIds || {};
  const clearedRatings = board?.clearedRatings || {};
  Object.entries(reviews).forEach(([file, review]) => {
    if (!review || typeof review !== "object") return;
    review.noteThread = normalizeNotes(review.noteThread || [])
      .filter((note) => !deletedNoteIds[note.id]);

    const clearedAt = clearedRatings[file];
    if (!isIsoDate(clearedAt)) return;

    const updatedAt = isIsoDate(review.updatedAt) ? review.updatedAt : "";
    if (normalizeRating(review.rating) > 0 && isNewer(updatedAt, clearedAt)) {
      delete clearedRatings[file];
      return;
    }

    if (!updatedAt || !isNewer(updatedAt, clearedAt)) {
      review.rating = 0;
      review.updatedAt = clearedAt;
    }
  });
}

function removeDeletedNoteId(reviews, id) {
  Object.values(reviews || {}).forEach((review) => {
    if (!review || typeof review !== "object" || !Array.isArray(review.noteThread)) return;
    review.noteThread = review.noteThread.filter((note) => note.id !== id);
  });
}

function pruneReviews(reviews) {
  const pruned = {};
  Object.entries(reviews || {}).forEach(([file, review]) => {
    if (!review || typeof review !== "object") return;
    const hasLegacyNotes = String(review.notes || "").trim().length > 0;
    const hasThread = Array.isArray(review.noteThread) && review.noteThread.some((note) => String(note.text || "").trim());
    if (normalizeRating(review.rating) === 0 && !hasLegacyNotes && !hasThread) return;
    pruned[file] = {
      rating: normalizeRating(review.rating),
      notes: String(review.notes || "").slice(0, maxNotesLength),
      noteThread: normalizeNotes(review.noteThread || []),
      updatedAt: isIsoDate(review.updatedAt) ? review.updatedAt : ""
    };
  });
  return pruned;
}

function normalizeNotes(notes) {
  if (!Array.isArray(notes)) return [];
  return notes.map(normalizeNote).filter(Boolean);
}

function normalizeNote(note) {
  if (!note || typeof note !== "object") return null;
  const id = String(note.id || "").slice(0, 120);
  const from = String(note.from || "").trim().slice(0, 80);
  const text = String(note.text || "").trim().slice(0, maxNotesLength);
  const createdAt = isIsoDate(note.createdAt) ? note.createdAt : "";
  if (!id || !text || !createdAt) return null;
  return { id, from, text, createdAt };
}

function normalizeReferences(references) {
  if (!Array.isArray(references)) return [];
  return references.map(normalizeReference).filter(Boolean);
}

function normalizeTimestampsByKey(values) {
  const normalized = {};
  if (!values || typeof values !== "object" || Array.isArray(values)) return normalized;
  Object.entries(values).forEach(([key, timestamp]) => {
    const safeKey = String(key || "").slice(0, 120);
    if (!safeKey || !isIsoDate(timestamp)) return;
    normalized[safeKey] = timestamp;
  });
  return normalized;
}

function normalizeTimestampsByImagePath(values) {
  const normalized = {};
  if (!values || typeof values !== "object" || Array.isArray(values)) return normalized;
  Object.entries(values).forEach(([file, timestamp]) => {
    const safeFile = String(file || "");
    if (!isSafeImagePath(safeFile) || !isIsoDate(timestamp)) return;
    normalized[safeFile] = timestamp;
  });
  return normalized;
}

function normalizeReference(reference) {
  if (!reference || typeof reference !== "object") return null;
  const id = String(reference.id || "").slice(0, 120);
  const name = String(reference.name || "reference image").slice(0, 180);
  const type = String(reference.type || "").slice(0, 80);
  const dataUrl = String(reference.dataUrl || "");
  const createdAt = isIsoDate(reference.createdAt) ? reference.createdAt : "";
  const caption = String(reference.caption || "").slice(0, 180);
  if (!id || !createdAt) return null;
  if (!type.startsWith("image/")) return null;
  if (!isValidReferenceDataUrl(dataUrl)) return null;
  return { id, name, type, dataUrl, createdAt, caption };
}

function mergeById(existingItems, incomingItems) {
  const merged = new Map();
  [...(Array.isArray(existingItems) ? existingItems : []), ...(Array.isArray(incomingItems) ? incomingItems : [])]
    .forEach((item) => {
      if (!item || !item.id) return;
      const existing = merged.get(item.id);
      if (!existing || isNewer(item.createdAt, existing.createdAt)) merged.set(item.id, item);
    });
  return [...merged.values()].sort((a, b) => {
    const aTime = Date.parse(a.createdAt || "") || 0;
    const bTime = Date.parse(b.createdAt || "") || 0;
    return aTime - bTime;
  });
}

function emptyReview() {
  return {
    rating: 0,
    notes: "",
    noteThread: [],
    updatedAt: ""
  };
}

function isSafeImagePath(file) {
  return /^assets\/images\/[a-z0-9][a-z0-9_.-]*\.png$/i.test(file) && !file.includes("..");
}

function isValidReferenceDataUrl(dataUrl) {
  return /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(dataUrl) &&
    dataUrl.length <= maxReferenceEncodedLength;
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

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: jsonHeaders
  });
}
