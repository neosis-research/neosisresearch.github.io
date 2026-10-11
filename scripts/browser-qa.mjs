import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4322';
const base = process.env.QA_BASE || '/neosisresearch.github.io/';
const output = process.env.QA_OUTPUT || '/tmp/neosis-qa';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox'],
});
const errors = [];
const results = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  const routes = [
    '',
    'computational-research/',
    'research-evaluation/',
    'sponsored-research/',
    'capabilities/',
    'about/',
    'insights/',
    'contact/',
    '404.html',
  ];
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
    for (const route of routes) {
      await page.goto(origin + base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert(!overflow, `Horizontal overflow: ${route} at ${width}`);
      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      const violations = scan.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      }));
      results.push({ route: route || 'home', width, violations });
      await page.screenshot({
        path: `${output}/${route.replace(/\W/g, '') || 'home'}-${width}.png`,
        fullPage: true,
      });
    }
  }
  // Keyboard and disclosure behavior on narrow screens.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + base);
  await page.keyboard.press('Tab');
  assert.equal((await page.locator(':focus').textContent()).trim(), 'Skip to content');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  const menu = page.locator('.menu-toggle');
  await menu.focus();
  await page.keyboard.press('Enter');
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Tab');
  assert.equal((await page.locator(':focus').textContent()).trim(), 'Research');
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator(':focus').getAttribute('aria-controls'), 'primary-navigation');
  await menu.click();
  await page
    .getByRole('navigation', { name: 'Main navigation', exact: true })
    .getByRole('link', { name: 'Evaluation', exact: true })
    .click();
  assert(page.url().endsWith('/research-evaluation/'));
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  await menu.click();
  await page.setViewportSize({ width: 1200, height: 800 });
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  await page.setViewportSize({ width: 844, height: 390 });
  assert(await menu.isVisible());
  await menu.click();
  assert(await page.getByRole('navigation', { name: 'Main navigation', exact: true }).isVisible());
  await page.keyboard.press('Escape');
  // Worksheet validates required inputs and makes a real downloadable local artifact.
  await page.goto(origin + base + 'contact/');
  await page.getByRole('button', { name: 'Prepare Inquiry', exact: true }).click();
  assert(await page.locator('#inquiry-output').isHidden());
  await page.getByLabel('Your name').fill('QA Example');
  await page.getByLabel('Organization').fill('Test organization');
  await page.getByLabel('Area of interest').selectOption('Research, Evaluation & Evidence');
  await page
    .getByLabel('What are you working on?')
    .fill('How should we evaluate a proposed program?');
  await page.getByLabel('Timing or proposal deadline').fill('Exploratory');
  let submitted = false;
  page.on('request', (r) => {
    if (r.method() === 'POST') submitted = true;
  });
  await page.getByRole('button', { name: 'Prepare Inquiry', exact: true }).click();
  assert(await page.locator('#inquiry-output').isVisible());
  assert((await page.locator('#prepared-text').inputValue()).includes('How should we evaluate'));
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy Outline' }).click();
  assert((await page.evaluate(() => navigator.clipboard.readText())).includes('QA Example'));
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download .txt' }).click();
  const download = await downloadEvent;
  const downloaded = await fs.readFile(await download.path(), 'utf8');
  assert(downloaded.includes('How should we evaluate'));
  assert.equal(submitted, false);
  assert.equal(
    await page.locator('a[href^="mailto:"]').count(),
    0,
    'Unset email must not create fake links',
  );
  // Reduced motion and no-JS navigation are meaningful supported states.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    'auto',
  );
  const nojs = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 700 },
  });
  await nojs.goto(origin + base);
  assert(await nojs.getByRole('navigation', { name: 'Main navigation', exact: true }).isVisible());
  assert(!(await nojs.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
  await nojs
    .getByRole('navigation', { name: 'Main navigation', exact: true })
    .getByRole('link', { name: 'About', exact: true })
    .click();
  assert(nojs.url().endsWith('/about/'));
  await fs.writeFile(
    `${output}/results.json`,
    JSON.stringify({ results, errors, interactionChecks: 'passed' }, null, 2),
  );
  const failing = results.filter((r) => r.violations.length);
  console.log(
    JSON.stringify(
      {
        responsivePages: results.length,
        axeFailures: failing,
        consoleOrNetworkErrors: errors,
        interactionChecks: 'passed',
      },
      null,
      2,
    ),
  );
  assert.equal(failing.length, 0, 'Accessibility failures (see QA results)');
  assert.equal(errors.length, 0, 'Browser errors');
} finally {
  await browser.close();
}
