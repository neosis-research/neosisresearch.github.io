# Asset provenance

- `public/favicon.svg`, `public/brand/social-preview.svg`, and `src/components/ResearchFigure.astro`: original geometric/typographic artwork created for this site. No stock imagery, client logos, third-party illustrations, or synthetic research results.
- `public/brand/social-preview.png` and `apple-touch-icon.png`: generated from original SVG with `npm run assets`; source is `scripts/generate-brand-assets.mjs`. Social graphic is 1200 × 630px. Its system serif/sans fallback rendering is intentionally independent of web-font downloads.
- Crimson Pro: Jacques Le Bailly and project contributors, SIL Open Font License 1.1; distributed through `@fontsource/crimson-pro`.
- Atkinson Hyperlegible: Braille Institute / Applied Design Works and project contributors, SIL Open Font License 1.1; distributed through `@fontsource/atkinson-hyperlegible`.
- Font license texts are copied to `public/brand/licenses/`. Only Latin subsets of four font faces are requested. Fonts are served locally; no visitor requests go to Google Fonts.
- Arrow and simple practice marks: original inline SVG paths.

No paid asset licenses or external image services are required. Keep these license files when redistributing the fonts.
