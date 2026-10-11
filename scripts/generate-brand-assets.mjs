import fs from 'node:fs/promises';
import sharp from 'sharp';
import { brandMarkup } from '../src/lib/brand.mjs';
const mark = brandMarkup('neosis-field');
const symbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" color="#b6f2df">${mark}</svg>`;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#091719"/><g transform="translate(5 5) scale(.54)" color="#b6f2df">${brandMarkup('neosis-icon', true)}</g></svg>`;
await fs.writeFile('public/favicon.svg', favicon);
await fs.writeFile('public/brand/neosis-symbol.svg', symbol);
// The exported wordmark uses portable font fallbacks; the website uses self-hosted DM Sans.
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="90" viewBox="0 0 340 90"><g transform="translate(0 4) scale(.82)" color="#b6f2df">${mark}</g><g fill="#eff7f4" font-family="Arial,sans-serif"><text x="97" y="43" font-size="34" letter-spacing="4">NEOSIS</text><text x="99" y="68" font-size="10" letter-spacing="5">RESEARCH</text></g></svg>`;
await fs.writeFile('public/brand/neosis-wordmark.svg', wordmark);
const curves = Array.from(
  { length: 18 },
  (_, i) =>
    `<ellipse cx="950" cy="330" rx="${60 + i * 6}" ry="${180 - i * 5}" transform="rotate(${i * 8} 950 330)" fill="none" stroke="#b6f2df" opacity="${0.15 + i * 0.025}"/>`,
).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><radialGradient id="glow"><stop stop-color="#285554"/><stop offset="1" stop-color="#091719"/></radialGradient></defs><rect width="1200" height="630" fill="#091719"/><circle cx="920" cy="315" r="360" fill="url(#glow)"/><g transform="translate(59 35) scale(.54)" color="#b6f2df">${mark}</g><text x="125" y="65" fill="#eff7f4" font-family="sans-serif" font-size="25" letter-spacing="4">NEOSIS</text><text x="126" y="86" fill="#afc3c1" font-family="sans-serif" font-size="9" letter-spacing="4">RESEARCH</text><path d="M65 125h1070M65 545h1070" stroke="#304b4c"/><text x="65" y="182" fill="#afc3c1" font-family="sans-serif" font-size="11" letter-spacing="2">INDEPENDENT INQUIRY. CONNECTED EXPERTISE.</text><g fill="#eff7f4" font-family="sans-serif" font-size="76" letter-spacing="-3"><text x="60" y="285">Complex</text><text x="60" y="368">questions.</text></g><text x="65" y="451" fill="#b6f2df" font-family="serif" font-style="italic" font-size="49">Clearer understanding.</text>${curves}<circle cx="950" cy="330" r="5" fill="#b6f2df"/><text x="65" y="581" fill="#afc3c1" font-family="sans-serif" font-size="11" letter-spacing="2">MULTIDISCIPLINARY RESEARCH &amp; CONSULTING</text></svg>`;
await fs.writeFile('public/brand/social-preview.svg', svg);
await sharp(Buffer.from(svg)).png().toFile('public/brand/social-preview.png');
await sharp(Buffer.from(favicon))
  .resize(180, 180)
  .png()
  .toFile('public/brand/apple-touch-icon.png');
console.log('Generated Convergent Fields symbol, wordmark, favicon and social graphic.');
