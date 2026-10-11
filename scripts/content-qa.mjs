import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
// Keep build output on the checkout filesystem: Astro moves generated assets with rename().
await fs.mkdir('test-results', { recursive: true });
const temporary = await fs.mkdtemp(path.resolve('test-results/content-'));
const fixtureFolder = 'src/content/insights/qa-fixtures';
const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' };
const astroPackage = JSON.parse(await fs.readFile('node_modules/astro/package.json', 'utf8'));
const astroCLI = path.resolve('node_modules/astro', astroPackage.bin.astro);
const build = (destination, extraEnv = {}) =>
  execFileSync(process.execPath, [astroCLI, 'build', '--outDir', destination], {
    env: { ...env, ...extraEnv },
    stdio: 'pipe',
  });
let createdFixtureFolder = false;
try {
  await fs.mkdir(fixtureFolder); // Refuse to overwrite an existing directory.
  createdFixtureFolder = true;
  const article = (draft, date) =>
    `---\ntitle: "QA fixture — not a publication"\ndescription: "Temporary publishing architecture test."\npublishedAt: ${date}\ncategory: Methods\ndraft: ${draft}\n---\n## A test of the article route\n\nThis temporary test content must never be deployed.\n`;
  await fs.writeFile(`${fixtureFolder}/published.md`, article(false, '2020-01-01'));
  await fs.writeFile(`${fixtureFolder}/draft.md`, article(true, '2020-01-01'));
  await fs.writeFile(`${fixtureFolder}/future.md`, article(false, '2999-01-01'));
  const articleDist = path.join(temporary, 'articles');
  build(articleDist);
  assert(
    (
      await fs.readFile(path.join(articleDist, 'insights/qa-fixtures/published/index.html'), 'utf8')
    ).includes('A test of the article route'),
  );
  assert(
    (await fs.readFile(path.join(articleDist, 'insights/index.html'), 'utf8')).includes(
      'qa-fixtures/published/',
    ),
  );
  const sitemap = await fs.readFile(path.join(articleDist, 'sitemap.xml'), 'utf8');
  assert(sitemap.includes('qa-fixtures/published/'));
  for (const hidden of ['draft', 'future']) {
    assert(!sitemap.includes(`qa-fixtures/${hidden}/`));
    await assert.rejects(
      fs.access(path.join(articleDist, `insights/qa-fixtures/${hidden}/index.html`)),
    );
  }
  console.log(
    'PASS: real article route renders; listing and sitemap update; drafts and future entries are excluded.',
  );
} finally {
  if (createdFixtureFolder) await fs.rm(fixtureFolder, { recursive: true, force: true });
}
const customDist = path.join(temporary, 'custom-domain');
build(customDist, { SITE_URL: 'https://example.org', BASE_PATH: '/' });
execFileSync('node', ['scripts/check-build.mjs'], {
  env: { ...env, BUILD_DIR: customDist },
  stdio: 'inherit',
});
console.log('PASS: root-path custom-domain deployment and clean empty Insights state.');
await fs.rm(temporary, { recursive: true, force: true });
