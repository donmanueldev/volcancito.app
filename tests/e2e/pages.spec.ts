import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', heading: 'Leer y contar, jugando' },
  { path: '/pantallas/', heading: 'Pantallas' },
  { path: '/ayuda/', heading: 'Ayuda' },
  { path: '/privacidad/', heading: 'Privacidad' },
  { path: '/terminos/', heading: 'Términos de uso' },
  { path: '/borrar-cuenta/', heading: 'Borrar cuenta' },
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

test('unknown paths serve the 404 page', async ({ page }) => {
  const response = await page.goto('/no-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página se quedó dormida');
});

test('the removed illustrations page is gone', async ({ page }) => {
  const response = await page.goto('/ilustraciones/');
  expect(response?.status()).toBe(404);
});
