# Validation record

The website was built and exercised in the cloud checkout. These checks establish local/static readiness, not a public GitHub Pages deployment.

## Automated checks

- Astro/TypeScript: `npm run check`, zero errors, warnings, or hints in the source diagnostics.
- Production dependency audit: Astro 7.3.8, `npm audit --omit=dev`, zero reported vulnerabilities.
- Production build: nine HTML pages, including custom 404. The empty Insights collection logs expected messages; there are no fabricated articles.
- `npm test`: all nine pages; 254 internal link/asset references; fragment destinations, one H1, heading order, unique titles/descriptions, canonical/social metadata, local image assets, sitemap and robots, project deployment base.
- `npm run test:content`: a temporary real article route, listing and sitemap inclusion, exclusion of drafts and future articles, and a separate root-path custom-domain build. Fixtures removed after testing.
- 21st local review: zero errors/warnings. The glass redesign returns 60 informational literal-color suggestions, including intended tokens and decorative translucent gradients; there are zero errors or warnings. This scanner covers six supported files, not the entire rendered Astro site.

## Browser review

Final result: **45 page/viewport combinations passed**, with **zero axe violations** and **zero browser console or network errors**. All interaction checks passed.

`npm run test:browser` uses Chromium, Playwright, and axe. It visits all nine pages at 1440, 1024, 768, 390, and 320px, checks horizontal overflow, and scans WCAG A/AA rules. It also exercises the skip link, keyboard navigation, Escape/focus restoration, mobile link selection, desktop resize and landscape orientation, native form validation, generated outline, clipboard, actual text-file download, reduced motion, and navigation without JavaScript. It verifies that the unset contact email produces no mailto links and that the worksheet sends no POST request.

Screenshots and machine-readable results are generated in `/tmp/neosis-glass-qa` (not shipped). Desktop and mobile compositions were visually reviewed. The glass redesign was reviewed at desktop and mobile sizes. A footer type override at 320px and an old background treatment on the sponsored-research page were corrected, then all 45 combinations and interaction checks were rerun successfully.

## Portable preview

`npm run preview:package` builds a ZIP with relative asset/navigation paths and captures current desktop/mobile/homepage/logo images. The extracted copy was served locally for browser verification: internal navigation, generated inquiry and actual text download passed with no browser errors. Local `file://` navigation cannot be tested in the managed Chromium policy; a Python local-server fallback is included in the ZIP.

## Limits

- No public deployment, DNS configuration, or GitHub Pages environment approval has been performed.
- No final mailbox exists; external email delivery cannot be tested. Copy/download works independently, and adding a real address enables mailto drafts.
- Automated accessibility checks complement, but do not replace, manual assistive-technology testing. Chromium is tested; Safari/Firefox and physical devices have not been independently tested.
- No real Insights article has been published. Publishing mechanics are tested with temporary content only.
- Authenticated 21st CLI catalog access/MCP was unavailable. Actual public Liquid Glass Button, PrismaHero and Topo Field reference pages were consulted, alongside local CLI review and public skill guidance. UI UX Pro Max was actively searched and its relevant recommendations applied.
