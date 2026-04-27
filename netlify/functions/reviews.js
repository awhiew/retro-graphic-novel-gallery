const blobStoreName = "retro-graphic-novel-reviews";
const blobKey = "shared-board";
const maxNotesLength = 5000;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return response(204, "");
  }

  try {
    if (event.httpMethod === "GET") {
      const board = await readBoard();
      return response(200, { ok: true, reviews: board.reviews, updatedAt: board.updatedAt });
    }

    if (event.httpMethod === "POST") {
      const body = parseBody(event.body);
      const incoming = normalizeIncomingReviews(body);
      const board = await readBoard();
      const now = new Date().toISOString();

      Object.entries(incoming).forEach(([file, review]) => {
        const current = board.reviews[file];
        const updatedAt = isIsoDate(review.updatedAt) ? review.updatedAt : now;
        if (!current || isNewer(updatedAt, current.updatedAt)) {
          const normalized = {
            rating: normalizeRating(review.rating),
            notes: String(review.notes || "").slice(0, maxNotesLength),
            updatedAt
          };
          if (normalized.rating === 0 && !normalized.notes.trim()) {
            delete board.reviews[file];
          } else {
            board.reviews[file] = normalized;
          }
        }
      });

      board.updatedAt = now;
      await writeBoard(board);
      return response(200, { ok: true, reviews: board.reviews, updatedAt: board.updatedAt });
    }

    return response(405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    return response(400, { ok: false, error: error.message || "Invalid request" });
  }
};

function blobApiUrl(siteID) {
  return `https://api.netlify.com/api/v1/blobs/${siteID}/site:${blobStoreName}/${blobKey}`;
}

async function getBlobStore() {
  if (process.env.REVIEW_BLOBS_SITE_ID && process.env.REVIEW_BLOBS_TOKEN) {
    return {
      mode: "api",
      siteID: process.env.REVIEW_BLOBS_SITE_ID,
      token: process.env.REVIEW_BLOBS_TOKEN
    };
  }

  const { getStore } = await import("@netlify/blobs");
  return getStore(blobStoreName);
}

async function readBoard() {
  const store = await getBlobStore();
  let saved = null;

  if (store.mode === "api") {
    const response = await fetch(blobApiUrl(store.siteID), {
      headers: { Authorization: `Bearer ${store.token}` },
      cache: "no-store"
    });
    if (response.status !== 404) {
      if (!response.ok) throw new Error(`Netlify Blobs read failed: ${response.status}`);
      saved = await response.json();
    }
  } else {
    saved = await store.get(blobKey, { type: "json" });
  }

  if (!saved || typeof saved !== "object") {
    return { reviews: {}, updatedAt: "" };
  }
  return {
    reviews: normalizeStoredReviews(saved.reviews || {}),
    updatedAt: isIsoDate(saved.updatedAt) ? saved.updatedAt : ""
  };
}

async function writeBoard(board) {
  const store = await getBlobStore();

  if (store.mode === "api") {
    const response = await fetch(blobApiUrl(store.siteID), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${store.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(board)
    });
    if (!response.ok) throw new Error(`Netlify Blobs write failed: ${response.status}`);
    return;
  }

  await store.setJSON(blobKey, board);
}

function parseBody(body) {
  if (!body) return {};
  const parsed = JSON.parse(body);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Request body must be an object");
  }
  return parsed;
}

function normalizeIncomingReviews(body) {
  if (body.reviews && typeof body.reviews === "object" && !Array.isArray(body.reviews)) {
    return normalizeStoredReviews(body.reviews);
  }

  if (body.file) {
    return normalizeStoredReviews({
      [body.file]: {
        rating: body.rating,
        notes: body.notes,
        updatedAt: body.updatedAt
      }
    });
  }

  throw new Error("Expected a review object or file review");
}

function normalizeStoredReviews(reviews) {
  const normalized = {};
  Object.entries(reviews || {}).forEach(([file, review]) => {
    const safeFile = String(file || "");
    if (!isSafeImagePath(safeFile) || !review || typeof review !== "object") return;
    normalized[safeFile] = {
      rating: normalizeRating(review.rating),
      notes: String(review.notes || "").slice(0, maxNotesLength),
      updatedAt: isIsoDate(review.updatedAt) ? review.updatedAt : ""
    };
  });
  return normalized;
}

function isSafeImagePath(file) {
  return /^assets\/images\/[a-z0-9][a-z0-9_.-]*\.png$/i.test(file) && !file.includes("..");
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

function response(statusCode, payload) {
  return {
    statusCode,
    headers,
    body: typeof payload === "string" ? payload : JSON.stringify(payload)
  };
}
