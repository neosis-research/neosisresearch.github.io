# Neosis Research design system

## Direction: Observatory

A dark, contemporary research identity with translucent glass, optical depth and disciplined typography. Mineral green grounds the organization; glacier accents make the interface luminous. The layered optical study represents complementary methods converging around a shared question. It is decorative artwork, not a visualization of research results.

The homepage pairs an oversized, direct headline with a dimensional CSS/SVG sculpture. The floating glass navigation, refractive primary action, two illustrated practice panels and spacious capability index establish the visual language. Interior pages carry the same palette, typography, glass subnavigation and framed scientific illustrations.

## Identity

**Convergent Fields** is a sculptural emblem of three curved, interwoven forms surrounding an open center. The three forms suggest complementary disciplines; the opening represents the question that connects them. Deliberate negative-space seams reveal the overlap in a single color. A compact variant increases the seams for favicon use. The emblem replaces the earlier folded-N letterform.

UI UX Pro Max was consulted again for premium identity, contemporary typography and SVG clarity. An image-generated concept explored the interwoven direction; the production mark is a custom Bézier construction in `src/lib/brand.mjs`, shared by the site and generated exports. It has transparent cutouts rather than simulated background-colored strokes, and each inline instance has a unique mask ID. Its modern sans-serif wordmark pairs with the more intricate symbol. `public/brand/` contains reusable SVG symbol and wordmark exports.

## Typography and palette

- DM Sans 400/500: display, body and interface. Geometric letterforms, restrained weight and tight display spacing.
- Crimson Pro 400/italic: occasional editorial counterpoint and emphasis.
- All fonts are self-hosted, Latin subset. No visitor font request goes to Google.
- Background `#091719`; surfaces `#102326` and `#18383a`; text `#eff7f4`; secondary text `#afc3c1`; glacier accent `#b6f2df`; structural lines `#304b4c`.
- Maximum content width 1280px, fluid gutters, 80–132px section rhythm. Glass panels have 18–25px corners; primary actions are pill-shaped.
- Tokens and shared layout live in `src/styles/global.css`. Its final `optical` layer defines the site's glass identity over the shared structural components.

## UI UX Pro Max consultation

The installed `.codex/skills/ui-ux-pro-max/SKILL.md` was read and its search scripts used for premium research consultancy, liquid glass / glassmorphism, contemporary typography, contrast, motion and performance. Its guidance informed translucent borders, restrained blur, clear foreground/background separation and a DM Sans-led typography system. Broad automated palette/layout suggestions were evaluated against the research brief rather than copied wholesale.

## 21st consultation

The public 21st library and the following actual component pages were consulted:

- [Liquid Glass Button — Ali Imam](https://21st.dev/@designali-in/components/liquid-glass-button): rim highlights, translucent surfaces, compact rounded actions.
- [PrismaHero — Rahil Vahora](https://21st.dev/@rahil1202/components/prisma-hero): cinematic composition, floating navigation and decisive headline hierarchy.
- [Topo Field — Meng To](https://21st.dev/@mengto/components/topo-field): subtle scientific line texture and atmospheric depth.

These are pattern references. Their implementation source was not copied. Original Astro/CSS/SVG components avoid unnecessary React, video, WebGL and motion dependencies. Public plugin exploration/build/review guidance was also read, and the local CLI review is supplementary. Authenticated CLI catalog search remains unavailable; public reference-page consultation succeeded. No authenticated MCP or hosted generation is claimed.

## Accessibility and behavior

Glass is used around content with readable backgrounds. Blur is limited to navigation and small decorative labels; a reduced-transparency preference uses opaque alternatives. The optical sculpture uses CSS transforms and original SVG, requires no JavaScript and has no continuous animation. Reduced-motion preferences disable transitions and smooth scrolling. Decorative art is hidden from assistive technology.

Native controls, focus rings, skip link, current navigation, one H1 per page and logical headings remain in place. The mobile disclosure works with keyboard, Escape and focus restoration, and the navigation remains available without JavaScript. The contact worksheet generates a local outline with copy/download actions; it sends no request or stored entries. A configured real mailbox enables a mailto draft. Insights remain honestly forthcoming until actual articles are authored.
