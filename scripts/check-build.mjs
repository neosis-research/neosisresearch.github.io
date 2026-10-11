import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';

const dist = path.resolve(process.env.BUILD_DIR || 'dist');
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
const pages = walk(dist).filter((f) => f.endsWith('.html'));
const home = load(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'));
const root = new URL(home('link[rel=canonical]').attr('href'));
const base = root.pathname;
const titles = new Set(),
  descriptions = new Set();
let references = 0;
for (const file of pages) {
  const $ = load(fs.readFileSync(file, 'utf8'));
  const rel = path.relative(dist, file);
  const localPath = rel === 'index.html' ? '' : rel.replace(/index\.html$/, '');
  const current = new URL(base + localPath, root.origin);
  assert.equal($('h1').length, 1, `${rel}: must contain one h1`);
  assert.equal($('main').length, 1, `${rel}: must contain one main`);
  assert.equal($('html').attr('lang'), 'en');
  for (const [value, set, label] of [
    [$('title').text(), titles, 'title'],
    [$('meta[name=description]').attr('content'), descriptions, 'description'],
  ]) {
    assert(value && !set.has(value), `${rel}: missing or repeated ${label}`);
    set.add(value);
  }
  assert.equal(new URL($('link[rel=canonical]').attr('href')).origin, root.origin);
  assert($('meta[property="og:image"]').attr('content'), `${rel}: social preview`);
  assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image');
  assert.equal($('a[href="#main"]').length, 1, `${rel}: skip link`);
  assert(!$('body').text().includes('.example'), `${rel}: placeholder email is visible`);
  assert(
    !/lorem ipsum|trusted by leading/i.test($('body').text()),
    `${rel}: placeholder or fabricated copy`,
  );
  const ids = $('*[id]')
    .map((_, el) => $(el).attr('id'))
    .get();
  assert.equal(ids.length, new Set(ids).size, `${rel}: duplicate IDs`);
  // Header/footer headings are independently scoped; check the main content hierarchy.
  const mainOutline = $('main h1,main h2,main h3,main h4')
    .map((_, el) => Number(el.tagName.slice(1)))
    .get();
  for (let i = 1; i < mainOutline.length; i++)
    assert(mainOutline[i] <= mainOutline[i - 1] + 1, `${rel}: skipped heading level`);
  for (const el of $('a[href],script[src],link[href],img[src]').toArray()) {
    const raw = $(el).attr('href') || $(el).attr('src');
    if (!raw || /^(mailto:|tel:|data:)/.test(raw)) continue;
    const target = new URL(raw, current);
    if (target.origin !== root.origin) continue;
    assert(target.pathname.startsWith(base), `${rel}: link escapes deployment base: ${raw}`);
    const relative = decodeURIComponent(target.pathname.slice(base.length));
    let targetFile = path.join(dist, relative);
    if (target.pathname.endsWith('/')) targetFile = path.join(targetFile, 'index.html');
    assert(fs.existsSync(targetFile), `${rel}: missing target ${raw}`);
    if (target.hash && targetFile.endsWith('.html')) {
      const target$ = load(fs.readFileSync(targetFile, 'utf8'));
      const id = decodeURIComponent(target.hash.slice(1));
      assert(
        target$('[id]')
          .toArray()
          .some((e) => target$(e).attr('id') === id),
        `${rel}: missing fragment ${raw}`,
      );
    }
    references++;
  }
  const social = new URL($('meta[property="og:image"]').attr('content'));
  assert(
    fs.existsSync(path.join(dist, social.pathname.slice(base.length))),
    `${rel}: social image missing`,
  );
}
const sitemap = load(fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8'), { xml: true });
assert.equal(sitemap('loc').length, pages.length - 1, 'Sitemap must include all pages except 404');
for (const el of sitemap('loc').toArray()) {
  const href = sitemap(el).text();
  assert(href.startsWith(root.href), `Sitemap outside deployment base: ${href}`);
  assert(!href.endsWith('/404/'));
}
assert(
  fs
    .readFileSync(path.join(dist, 'robots.txt'), 'utf8')
    .includes(new URL(base + 'sitemap.xml', root.origin).href),
);
assert(fs.existsSync(path.join(dist, '.nojekyll')));
console.log(
  `PASS: ${pages.length} pages; ${references} internal links/assets; unique metadata, heading hierarchy, sitemap, robots, social images, and deployment base ${base}`,
);
