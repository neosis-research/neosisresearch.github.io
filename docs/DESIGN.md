# Neosis Research design system

## Direction: The research notebook

An editorial identity with the clarity of a research publication and the accessibility of a professional services firm. Wide margins, quiet rules, serif display type, and generous reading space establish seriousness without inventing institutional prestige. The homepage introduces the organization; substantial interior pages explain how the work can be scoped.

Three directions were assessed using UI UX Pro Max:

1. **Editorial research:** serif/sans typography, flat surfaces, a clear hierarchy, and diagrams. Selected for its balance of warmth, technical precision, and accessibility.
2. **Minimal technical consultancy:** sans-serif type, compact content, and a direct conversion path. Rejected as too close to generic technology consulting; generic credibility badges would be inappropriate.
3. **Traditional institution:** archival serif typography and warm neutrals. Its intellectual character was useful, but an all-serif interface felt overly historical and reduced the distinction between navigation and content.

## Typography

- **Crimson Pro 400, upright and italic:** display headings, editorial statements, and section titles. Recommended by UI UX Pro Max's Academic/Research pairing.
- **Atkinson Hyperlegible 400 and 700:** body copy, navigation, and labels. The same pairing emphasizes legibility and clear letterforms.
- Fonts are self-hosted through Fontsource. No Google Fonts request is made by the visitor's browser.
- Body copy is capped at 68 characters where possible; narrow screens have deliberate type sizes and layout changes.
- Wordmark: NEOSIS in widely spaced capitals with RESEARCH below. No medical or AI iconography.

## Palette and tokens

The source of truth is `src/styles/global.css` under `:root`.

| Token           | Purpose                       | Color     |
| --------------- | ----------------------------- | --------- |
| `--paper`       | Main background               | `#f6f5ee` |
| `--white`       | Form surface                  | `#fdfdf9` |
| `--ink`         | Main text                     | `#202f2b` |
| `--green`       | Brand, buttons, dark sections | `#173e35` |
| `--muted`       | Secondary text                | `#58655e` |
| `--green-light` | CTA bands, illustrations      | `#dce5d9` |
| `--line`        | Quiet dividers                | `#cdd2c8` |
| `--accent`      | Index numbers, focus rings    | `#8c6036` |

Additional surface, hover, field, and reversed-text colors are also tokens. UI UX Pro Max's broad palette suggestions were assessed; its generic blue/orange and pink recommendations were not a fit for the brief. The selected green/ivory system follows the brief and was checked in the actual rendered interface.

## Composition

- Maximum content width: 1280px; fluid gutters from 24px to 72px.
- Section rhythm: 64–112px, with shorter deliberate transitions.
- Square buttons, one-pixel rules, no shadows or decorative card rounding.
- Home: split hero, paired practices, a dark partnership band, capability index, process, sectors, and an honest Insights launch state.
- Computational research: collaboration model, line-field illustration, numbered expertise rows, research questions.
- Evaluation: evidence diagram, editorial capability rows, six-stage lifecycle, statement on independent judgment.
- Sponsored research: dark introduction, four substantial engagement scenarios, scoping guidance.
- Capabilities: desktop side index and detailed directory; index moves into normal flow on smaller screens.
- About: organizational purpose, principles, and a typographic statement.
- Insights: an intentional empty state and a separate Markdown article layout.
- Contact: contextual guidance alongside a local inquiry worksheet.

## Visual assets

All diagrams and brand assets are original SVG compositions. They represent inquiry and synthesis, not measured data or project results. Labels and numbers identify illustrations, not claims of research output. Decorative diagrams are hidden from assistive technology. See `ASSETS.md` for font and asset licensing.

## Interaction and accessibility

Native links, buttons, and form elements; visible focus rings; a skip link; one H1 per page; logical heading levels; generous touch targets; current navigation indicators. The mobile navigation is an inline disclosure, not a modal: it retains normal tab order, closes on Escape, outside click, loss of focus, navigation, and desktop resize. Navigation remains available without JavaScript. No scroll locking, parallax, entrance animation, or hidden-until-animated content. Reduced-motion users receive instant transitions and normal scrolling.

The inquiry worksheet validates required fields, displays a reviewable outline, and offers working clipboard/download actions. No request is submitted and no entries are stored. A real configured email enables an explicit mailto draft action. There is no fabricated mailbox.

## Tool use and limitations

**UI UX Pro Max:** installed locally with `uipro-cli`, initialized for Codex in the ignored `.codex/skills/ui-ux-pro-max/` folder, and read directly. Three `--design-system` searches and typography, palette, semantic HTML, keyboard, motion, contrast, line-length, and touch-target searches informed the design. Recommendations were evaluated rather than applied wholesale.

**21st:** the official plugin installation command failed because `/run/codex-environment/codex-home/.tmp/marketplaces` is read-only. The public plugin repository was retrieved outside this project and its exploration, build, review, and CLI skills were consulted. The standalone `@21st-dev/cli` was installed outside the project and its deterministic `21st review src --json` was run. It found no errors or warnings and suggested consolidating literal colors; secondary colors were moved into tokens. A final scan reports 14 informational color suggestions, all pointing to the intentional token definitions themselves. This scanner covers supported source formats and is not a full Astro or browser accessibility audit.

Catalog search was attempted and returned “Not signed in.” No catalog component was retrieved, no hosted generation was used, and no MCP availability is claimed. The site uses original Astro components; browser testing with axe and Playwright provides the runtime review. Live 21st component discovery would require an authenticated connection in a host that supports the plugin.
