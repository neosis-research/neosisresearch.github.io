# Neosis Research

A multipage static website for a multidisciplinary research and consulting firm. The design connects AI & Computational Research, Research, Evaluation & Evidence, and Sponsored Research Partnerships without inventing clients, credentials, or prior work.

## Technology

Astro 7, TypeScript, plain CSS, and Markdown content collections. Astro generates real HTML pages with shared layouts and minimal client-side JavaScript (navigation and the inquiry worksheet). No React, database, application server, tracking, or paid APIs. Self-hosted Fontsource fonts keep typography independent of third-party requests. The lockfile pins dependencies.

## Local development

Use Node 22.12+ (Node 22 is configured for CI; this cloud build was validated with Node 24).

```sh
npm ci
npm run dev
```

Open the path printed by Astro, including `/neosisresearch.github.io/`. The default repository is a **project site**, because `neosisresearch.github.io` does not match the organization name `neosis-research`. In Codex cloud, use the existing checkout at `/workspace/neosisresearch.github.io`; tasks are already isolated, so do not create a Git worktree unless requested.

In a restricted environment where the home directory is read-only, prefix Astro commands with `ASTRO_TELEMETRY_DISABLED=1`. Example:

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run dev -- --port 4321
```

Production validation:

```sh
npm run check
npm run build
npm test
npm run preview -- --port 4322
```

`npm test` checks the built pages, internal links/fragments, local assets, heading hierarchy, metadata, sitemap, robots, and deployment base. It requires a preceding build.

Browser checks (in a second terminal, with the preview server running):

```sh
npm run test:browser
```

The cloud test runner uses `/usr/bin/chromium`. On another machine, set `CHROMIUM_PATH` to a Chromium executable (install one if needed). The runner uses Playwright and axe, visits all nine pages at 1440, 1024, 768, 390, and 320px, saves screenshots/results under `/tmp/neosis-qa`, and exercises navigation, orientation, the worksheet, clipboard, downloads, reduced motion, and no-JavaScript navigation. Override `QA_ORIGIN`, `QA_BASE`, and `QA_OUTPUT` as needed.

```sh
npm run test:content
```

This separately tests a temporary article, draft/future exclusion, and a root-path custom-domain build in a temporary output directory. It deletes its test content; it never adds a real article or changes the production output. Do not run it concurrently with a production build or a content edit. `npm run format` formats source, and `npm run assets` regenerates the brand PNGs.

## Project structure

```text
site.config.ts                Company, contact, and deployment configuration
astro.config.mjs              Static output and base-path setup
src/pages/                    Main pages, article route, sitemap, robots, 404
src/components/               Header, footer, wordmark, diagrams, CTA, hero
src/layouts/Base.astro         Metadata, fonts, page landmarks
src/styles/global.css         Design tokens, components, responsive rules
src/content.config.ts         Insights schema and loader
src/content/insights/          Real Markdown articles go here
src/lib/                      Shared URL and publishing helpers
public/                       Static icons, social assets, font licenses
scripts/                      Build checks, browser QA, publishing QA, assets
.github/workflows/deploy.yml   GitHub Pages build and deployment
```

## Site configuration

Edit **`site.config.ts`** to change the company name, short name, tagline, description, future domain, contact email, LinkedIn URL, or GitHub Pages destination. Page-specific titles and descriptions are in each page’s `Base` component call. Main copy remains intentionally editorial; if rebranding beyond metadata, also review page copy and the generated brand assets.

`domain`, `contactEmail`, and `linkedIn` are intentionally `null`. No domain, mailbox, or social profile has been invented. A real `contactEmail` enables direct links and the contact page’s email-draft action. Addresses ending in `.example` cannot activate the contact actions.

Until an email is configured, the contact page clearly states that inquiries are not sent. Its worksheet creates an editable outline with working copy/download controls. Entries remain in the current browser page and disappear on reload; no data is stored or transmitted. The form explains this behavior, and provides a no-JavaScript fallback. Do not add a fake submit endpoint.

## Design system

See [`docs/DESIGN.md`](docs/DESIGN.md) for the explored directions, chosen typography/palette, spacing, components, accessibility decisions, and honest design-tool usage report. Colors and spacing live in `src/styles/global.css`; shared visual patterns live in `src/components/`. The site uses DM Sans with Crimson Pro accents, a dark mineral/glacier palette, translucent glass surfaces, a custom folded-N identity, and original dimensional optical artwork.

## Editing pages

Each main route maps to an Astro file under `src/pages/`: `index.astro`, `computational-research.astro`, `research-evaluation.astro`, `sponsored-research.astro`, `capabilities.astro`, `about.astro`, `insights/index.astro`, and `contact.astro`. Related service content is held in readable arrays in each page’s frontmatter. The pages share a visual system but have distinct compositions.

Use the `url()` helper from `src/lib/urls.ts` for internal links and public assets. It adds the deployment base; hardcoding `/contact/` would break project-site deployment. Keep content factual and capability-focused. Do not add unsupported client, staff, award, or impact claims.

## Publishing Insights

The launch collection is intentionally empty. Astro may log an empty-collection warning; this is expected, and the page displays the forthcoming state. To publish a real article, create `src/content/insights/your-article-slug.md`:

```md
---
title: 'Your actual article title'
description: 'An accurate, unique summary for search and social sharing.'
publishedAt: 2026-01-01
category: Methods
draft: true
# author: "Actual author's name"
# updatedAt: 2026-01-02
---

Your actual article text.

## A section heading

Continue the article here.
```

Use a true publication date and set `draft: false` only when the piece is ready. Allowed categories are `Research commentary`, `Methods`, `Evaluation`, `Computational research`, and `Research notes`. Drafts and future-dated articles are excluded from routes, the listing, and the sitemap. Future dates require a new deployment when due; there is no scheduler. Filenames determine URLs. The template supplies H1, metadata, date, and optional author; begin content headings with H2. Static public assets can go under `public/`; ensure article links account for the base path. Prefer relative links between article pages and avoid root-relative assets without the base.

## Assets

See [`docs/ASSETS.md`](docs/ASSETS.md) for sources and licenses. Original diagrams, the SVG favicon, PNG touch icon, and social preview are supplied. No photography is necessary. The social preview is generated from `scripts/generate-brand-assets.mjs`; update that artwork deliberately if the brand changes. No analytics or external font requests are included.

## GitHub Pages deployment

The workflow deploys on pushes to `main` or manual dispatch. It installs from the lockfile, runs Astro checks, builds the site, verifies links/metadata, uploads `dist`, and deploys with the official GitHub Pages actions.

1. Commit and push the completed site to `neosis-research/neosisresearch.github.io` on `main`.
2. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Run the workflow or push to `main`. The workflow supplies the deployed URL.

The default target is `https://neosis-research.github.io/neosisresearch.github.io/`. Deployment configuration is prepared; no push or public deployment was performed during implementation. The generated `404.html`, `.nojekyll`, `robots.txt`, and `sitemap.xml` are included. The robots file at a project subpath does not control the host root: crawlers use the organization host’s root robots policy. Submit the project sitemap directly if needed; with a custom domain the generated robots file is served at its root.

## Future custom domain

After purchasing and configuring a domain:

1. Set `site.domain` in `site.config.ts` to its HTTPS origin, with no path (for example, your actual `https://research-domain.org`). The base automatically becomes `/`.
2. Add `public/CNAME` containing only the purchased hostname. **No CNAME is included now.**
3. Configure DNS and the custom domain in GitHub Pages settings following GitHub’s current instructions, verify ownership, and enable HTTPS once available.
4. Rebuild and deploy. Canonical URLs, sitemap, robots, social metadata, links, and assets follow the new origin/base.

Build-only overrides `SITE_URL` (origin) and `BASE_PATH` are also supported. When `SITE_URL` is provided, the base defaults to `/`; provide `BASE_PATH` explicitly for another subdirectory. These are configuration values, never credentials. Do not set a domain you do not own for production.

## Troubleshooting

- **Blank or unstyled page:** retain the project base when opening the local server or deployed site; check `site.config.ts` and use `url()` for internal assets.
- **Read-only home error from Astro:** use `ASTRO_TELEMETRY_DISABLED=1` as above. Cloud dependency cache can be directed to `/workspace/.npm-cache` with npm’s `--cache` flag.
- **Insights missing:** confirm frontmatter schema, `draft: false`, a publication date that has arrived, and a new build. No placeholder articles are shipped.
- **No direct email button:** configure a real monitored `contactEmail`. The local worksheet is available independently.
- **Clipboard denied:** the worksheet selects the outline for manual copying; downloading also works.
- **Email app does not open:** copy the outline into your own email app; mailto depends on local configuration. Long inquiries are best copied manually.
- **Pages deployment fails:** check repository Pages settings, the Actions log, the `main` branch, environment protection rules, and permissions. Site content and local build do not require GitHub API credentials.
- **Changed domain still appears:** rebuild after configuration changes; generated files are not runtime-configurable.

## Remaining content inputs

A purchased domain and monitored email are needed to activate the final branded contact channel. A real LinkedIn URL, founder/team biographies, projects, publications, and verified partnerships can be added later. None is required for the initial site to build or for its existing pages to work.
