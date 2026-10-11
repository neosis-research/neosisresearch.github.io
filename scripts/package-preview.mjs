import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'cheerio';
import { chromium } from '@playwright/test';
const root = path.resolve('test-results/portable-preview');
const name = 'neosis-research-private-preview';
const output = path.join(root, name);
const base = '/neosisresearch.github.io/';
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4323';
await fs.rm(root, { recursive: true, force: true });
await fs.mkdir(root, { recursive: true });
await fs.cp('dist', output, { recursive: true });
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name))),
    )
  ).flat();
}
for (const file of await walk(output)) {
  if (file.endsWith('.css')) {
    const css = await fs.readFile(file, 'utf8');
    const portable = css.replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (match, quote, value) => {
      if (!value.startsWith(base)) return match;
      const relative = path
        .relative(path.dirname(file), path.join(output, value.slice(base.length)))
        .split(path.sep)
        .join('/');
      return `url("${relative}")`;
    });
    await fs.writeFile(file, portable);
    continue;
  }
  if (!file.endsWith('.html')) continue;
  const $ = load(await fs.readFile(file, 'utf8'));
  for (const [selector, attribute] of [
    ['a[href]', 'href'],
    ['link[href]', 'href'],
    ['script[src]', 'src'],
    ['img[src]', 'src'],
  ]) {
    $(selector).each((_, el) => {
      const value = $(el).attr(attribute);
      if (!value.startsWith(base)) return;
      const parsed = new URL(value, 'https://preview.invalid');
      let local = parsed.pathname.slice(base.length);
      if (!local || local.endsWith('/')) local += 'index.html';
      const relative = path
        .relative(path.dirname(file), path.join(output, local))
        .split(path.sep)
        .join('/');
      $(el).attr(attribute, relative + parsed.search + parsed.hash);
    });
  }
  await fs.writeFile(file, $.html());
}
await fs.writeFile(
  path.join(output, 'START-HERE.txt'),
  'NEOSIS RESEARCH — PRIVATE LOCAL PREVIEW\n\nExtract the entire ZIP, then open index.html. Keep all folders together. No Node installation is required.\n\nIf your browser restricts local files, run: python3 -m http.server 8080\nfrom this extracted folder and visit http://localhost:8080.\n\nThe inquiry worksheet prepares an outline locally. It does not send anything. Clipboard availability depends on browser permissions.\n',
);
execFileSync('python3', [
  '-c',
  'import shutil,sys; shutil.make_archive(sys.argv[1], "zip", sys.argv[2], sys.argv[3])',
  path.resolve('preview', name),
  root,
  name,
]);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(origin + base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'preview/homepage.png', fullPage: true });
  await page.screenshot({ path: 'preview/homepage-desktop.png' });
  await page.setViewportSize({ width: 390, height: 1150 });
  await page.screenshot({ path: 'preview/homepage-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const logo = document.querySelector('.brand-lockup').outerHTML;
    const symbol = document.querySelector('.brand-symbol').outerHTML;
    document.body.innerHTML = `<div class="identity-sheet"><div class="sheet-top"><span>NEOSIS RESEARCH</span><span>VISUAL IDENTITY / 01</span></div><div class="logo-showcase">${logo}</div><div class="identity-bottom"><div class="symbol-showcase">${symbol}</div><div class="identity-description"><p class="eyebrow">THE FOLDED N</p><h1>Different perspectives.<br>Connected understanding.</h1><p>An original geometric monogram, shaped by the optical language of the website.</p></div><div class="palette"><span></span><span></span><span></span></div></div></div>`;
    const css = document.createElement('style');
    css.textContent = `.identity-sheet{padding:50px 64px}.sheet-top{display:flex;justify-content:space-between;font-size:10px;letter-spacing:2px;color:#afc3c1}.logo-showcase{height:455px;display:grid;place-items:center;border-bottom:1px solid #304b4c;background:radial-gradient(ellipse,#21433d66,transparent 65%)}.logo-showcase .brand-lockup{transform:scale(3);transform-origin:center}.identity-bottom{display:flex;align-items:center;gap:70px;padding-top:65px}.symbol-showcase{width:140px;height:140px;background:#b6f2df;border-radius:25px;display:grid;place-items:center;flex-shrink:0}.symbol-showcase .brand-symbol{color:#091719;width:95px;height:95px}.identity-description h1{font:34px/1.2 'DM Sans';letter-spacing:-1px;margin:12px 0}.identity-description>p:last-child{font-size:13px;color:#afc3c1;max-width:450px}.palette{display:flex;margin-left:auto}.palette span{height:70px;width:60px;border-radius:50%;background:#18383a;border:1px solid #607f76;margin-left:-15px}.palette span:nth-child(2){background:#b6f2df}.palette span:last-child{background:#eff7f4}`;
    document.head.appendChild(css);
  });
  await page.screenshot({ path: 'preview/neosis-logo.png' });
} finally {
  await browser.close();
}
console.log(
  'Packaged relative-path website ZIP and desktop, mobile, full homepage and logo screenshots.',
);
