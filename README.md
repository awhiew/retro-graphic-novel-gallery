# Roxy Vega Retro Graphic Novel Review Gallery

A static GitHub Pages-ready review board for Andrew's retro graphic novel character exploration. The gallery loads `image-manifest.json`, renders all generated Roxy Vega images, and provides local rating and notes controls for narrowing the strongest creative lane.

## Project Direction

The strongest route is cute-sexy retro pulp romance + kawaii space noir + dreamy anime-gouache.

Roxy Vega should read as a pink-haired alien rebel pilot with a cute astronaut helmet cat, mixing glossy pulp cover appeal, soft painterly anime warmth, and neon space-noir trouble.

## Files

- `index.html` - static page shell
- `styles.css` - responsive mobile-first gallery styling
- `app.js` - manifest loading, filters, ratings, notes persistence, lightbox, and export
- `image-manifest.json` - source image records
- `assets/images/` - generated image assets

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

## GitHub Pages Publish

1. Commit the project files.
2. Push the repository to GitHub.
3. In GitHub, open Settings -> Pages.
4. Set Source to "Deploy from a branch".
5. Choose the branch and root folder.
6. Save, then wait for Pages to publish the site URL.

No build step, backend, paid service, or cloud sync is required.
