import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', heading: 'Leer y contar, jugando' },
  { path: '/pantallas', heading: 'Pantallas' },
  { path: '/ayuda', heading: 'Ayuda' },
  { path: '/privacidad', heading: 'Privacidad' },
  { path: '/terminos', heading: 'Términos de uso' },
  { path: '/borrar-cuenta', heading: 'Borrar cuenta' },
];

for (const route of routes) {
  test(`${route.path} renders without console errors`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, 'page scrolls horizontally').toBeLessThanOrEqual(0);
    await page.screenshot({
      path: testInfo.outputPath(`${route.path.replace(/\//g, '_') || 'home'}.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}

test('the vowel keys swap the word, the drawing and the field colour', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-vowel-field]');
  const before = await field.evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: /^E\s*e$/ }).click();
  await expect(page.locator('[data-vowel-word]')).toHaveText('Elefante');
  await expect(page.locator('[data-vowel-art="e-0"]')).toBeVisible();
  await expect(page.locator('[data-vowel-art="a-0"]')).toBeHidden();
  expect(await field.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(before);
  await page.getByRole('button', { name: /^E\s*e$/ }).click();
  await expect(page.locator('[data-vowel-word]')).toHaveText('Estrella');
});

test('the stage slider swaps the clause', async ({ page }) => {
  await page.goto('/');
  const range = page.getByLabel('Mueve para ver una partida');
  await range.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-stage-clause]')).toHaveText('Luego, responde la ronda');
});

test('unknown paths serve the 404 page', async ({ page }) => {
  const response = await page.goto('/no-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página se quedó dormida');
});
