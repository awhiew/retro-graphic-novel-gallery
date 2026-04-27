# Retro Graphic Novel Art Board

A static review board for Andrew's retro graphic novel character exploration. The gallery loads `image-manifest.json`, renders the image set, and provides ratings and review notes that can sync through a Netlify function endpoint.

## Project Direction

The strongest route is cute-sexy retro pulp romance + kawaii space noir + dreamy anime-gouache.

The character should read as a pink-haired alien rebel pilot with a cute astronaut helmet cat, mixing glossy pulp cover appeal, soft painterly anime warmth, and neon space-noir trouble.

## Files

- `index.html` - static page shell
- `styles.css` - responsive mobile-first gallery styling
- `app.js` - manifest loading, filters, ratings, notes persistence, lightbox, and cloud sync
- `image-manifest.json` - source image records and read-only art direction
- `assets/images/` - gallery image assets
- `netlify/functions/reviews.js` - shared review sync API

## Local Preview

From the project root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

The page can also be opened directly as `index.html`; `app.js` includes a fallback manifest for file previews, while HTTP preview loads `image-manifest.json`.

## Shared Review Sync

The frontend uses `window.RETRO_REVIEW_API` when present, otherwise it calls:

```text
https://retro-graphic-novel-review-api.netlify.app/.netlify/functions/reviews
```

Cloud sync requires that Netlify function endpoint to be deployed with `@netlify/blobs` available. If the endpoint is unavailable, ratings and notes still persist in localStorage for that browser.

## GitHub Pages Publish

1. Commit the project files.
2. Push the repository to GitHub.
3. In GitHub, open Settings -> Pages.
4. Set Source to "Deploy from a branch".
5. Choose the branch and root folder.
6. Save, then wait for Pages to publish the site URL.
