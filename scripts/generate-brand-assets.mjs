import fs from 'node:fs/promises';
import sharp from 'sharp';
const curves = Array.from(
  { length: 19 },
  (_, i) =>
    `<ellipse cx="941" cy="326" rx="${45 + i * 6}" ry="${163 - i * 3}" transform="rotate(${i * 5 - 45} 941 326)" fill="none" stroke="#173e35" stroke-width="1" opacity="${0.22 + i * 0.025}"/>`,
).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f6f5ee"/><path d="M65 125h1070M65 545h1070" stroke="#cdd2c8"/><text x="65" y="66" fill="#173e35" font-family="sans-serif" font-size="28" letter-spacing="5">NEOSIS</text><text x="66" y="90" fill="#173e35" font-family="sans-serif" font-size="10" letter-spacing="5">RESEARCH</text><text x="65" y="180" fill="#58655e" font-family="sans-serif" font-size="12" letter-spacing="2">INDEPENDENT INQUIRY. CONNECTED EXPERTISE.</text><g fill="#173e35" font-family="serif" font-size="83"><text x="60" y="291">Research for</text><text x="60" y="389" font-style="italic">complex questions.</text></g><text x="65" y="478" fill="#58655e" font-family="sans-serif" font-size="19">Research. Evidence. Understanding.</text>${curves}<circle cx="941" cy="326" r="6" fill="#173e35"/><text x="65" y="581" fill="#58655e" font-family="sans-serif" font-size="12" letter-spacing="2">MULTIDISCIPLINARY RESEARCH &amp; CONSULTING</text><text x="1055" y="581" fill="#58655e" font-family="sans-serif" font-size="12">NR—001</text></svg>`;
await fs.writeFile('public/brand/social-preview.svg', svg);
await sharp(Buffer.from(svg)).png().toFile('public/brand/social-preview.png');
await sharp('public/favicon.svg')
  .resize(180, 180)
  .png()
  .toFile('public/brand/apple-touch-icon.png');
console.log('Generated original social preview and touch icon.');
