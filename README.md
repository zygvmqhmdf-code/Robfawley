# rob fawley — portfolio

A single-page, monospace, net-art portfolio. A persistent index runs down the
left; clicking a project or text opens it in the right-hand panel with a
datamosh transition. No build step, no dependencies to install — just static
files.

## Files

- `index.html` — the entire site (HTML, CSS, and JS in one file).
- `favicon.svg` — tab icon.
- `.nojekyll` — tells GitHub Pages to serve the files as-is.
- `README.md` — this file.

## Deploy to GitHub Pages

1. Create a repository and add these files to the root (keep `index.html` at the
   top level, not inside a folder).
2. Commit and push.
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   choose your branch (usually `main`) and the `/ (root)` folder, then **Save**.
5. Wait a minute, then visit `https://<your-username>.github.io/<repo-name>/`.

Tip: if you name the repo `<your-username>.github.io`, it will be served at
`https://<your-username>.github.io/` with no sub-path.

### Custom domain (optional)

Add a file named `CNAME` containing only your domain (e.g. `robfawley.com`),
then point your DNS at GitHub Pages per GitHub's docs.

## Editing the content

Everything you'll change lives in `index.html` and is marked with `EDIT`
comments.

- **Your name / bio** — the wordmark in the `<header>`, and the `data-view="about"`
  article near the bottom (the "store").
- **Availability** — the `<p class="status">` line at the top of the left rail.
- **Email + social links** — the `data-view="contact"` article.
- **The index lists** — the `#works` and `#texts` blocks. Each row is an
  `<a>` with a `data-target` that must match a `data-view` in the store below.
- **Project / text pages** — the `<article class="view ...">` blocks inside
  `<div id="store">`. Edit the metadata line, heading, description, and link.

### Adding a real image to a project

In a project's `<article>`, replace the placeholder visual

```html
<div class="detail-visual s1"><span class="fmt">gif</span></div>
```

with an image — it automatically inherits the glitch/chromatic treatment:

```html
<img class="detail-visual" src="images/your-image.jpg" alt="description" />
```

(Put image files in an `images/` folder and commit them alongside `index.html`.)

### Adding or reordering projects

1. Add an `<a>` row in `#works` with a unique `data-target` (and a `data-swatch`
   / `data-fmt` for the hover preview).
2. Add a matching `<article class="view view--work" data-view="...">` in the
   store.
3. The prev/next order on each project follows the order of rows in `#works`, so
   reordering the list reorders the navigation.

The placeholder swatches `s1`–`s6` are defined in the CSS; swap them or add your
own.

## How it works

- It's one page. Clicking an item swaps the right panel and (when hosted) updates
  the URL hash (e.g. `#year-of-the-horse`), so individual projects are
  shareable/deep-linkable and the browser back button works.
- The datamosh is an SVG displacement + smear filter plus a "carry-over ghost"
  of the outgoing image. It respects `prefers-reduced-motion`.
- The only external resource is the Space Mono webfont from Google Fonts.

## Replace the placeholder links

The "view live ↗", "read ↗", and social links currently point at `#`. Swap them
for real URLs before sharing the site.
