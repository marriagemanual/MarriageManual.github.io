# The Marriage Operating Manual — website

A two-page static marketing site for *The Marriage Operating Manual*, a secular
marriage-prep workbook for engaged couples.

- **`index.html`** — "The 10 Conversations" free-guide / email-capture page
  (with a live MailerLite embed).
- **`book.html`** — the full workbook / product page.
- **`styles.css`** — shared design system (palette, type, components).
- **`script.js`** — vanilla-JS interactions: scroll reveals, sticky nav, FAQ
  accordion, testimonial carousel, and basic form spam protection.
- **`assets/`** — cover, hero mockup, brand marks.

No build step and no dependencies — it deploys as-is.

## Deploying with GitHub Pages

1. Push this folder to a GitHub repository (these files must sit at the **root**
   of the repo, so `index.html` is the repo's home page).
2. In the repo: **Settings → Pages → Build and deployment → Source: “Deploy from
   a branch” → Branch: `main` / `/ (root)` → Save.**
3. Wait ~1 minute; your site goes live at
   `https://<your-username>.github.io/<repo-name>/`.

To use a custom domain later, add it under **Settings → Pages → Custom domain**
(this creates a `CNAME` file in the repo).

## Editing

Open any `.html` file in a browser to preview locally, or run any static file
server from this folder. Edit the HTML/CSS/JS directly — there is nothing to
compile.
