import { expect, test, type Page } from '@playwright/test';

async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 300) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(30);
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const spoken: string[] = [];
    const played: string[] = [];
    Object.assign(window, { __spoken: spoken, __played: played });
    HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement) {
      played.push(this.src);
      return Promise.resolve();
    };
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
        spoken.push(utterance.text);
      };
    }
  });
  await page.goto('/');
});

test('the first screen says what Volcancito is and offers one action', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Leer y contar, jugando');
  await expect(page.getByText('app gratis para niñas y niños de 3 a 8 años')).toBeVisible();
  const action = page.getByRole('link', { name: 'Pruébalo aquí' });
  await expect(action).toBeVisible();
  await action.click();
  await expect(page).toHaveURL(/#vocales$/);
  await expect(page.getByRole('heading', { name: /Toca una/ })).toBeInViewport();
});

test('every vowel key shows its word, drawing and colour, and speaks', async ({ page }) => {
  const field = page.locator('[data-vowel-field]');
  const word = page.locator('[data-vowel-word]');
  const expected: Record<string, string> = {
    E: 'Elefante',
    I: 'Iguana',
    O: 'Oso',
    U: 'Uva',
    A: 'Abeja',
  };
  const colours = new Set<string>();
  for (const [upper, first] of Object.entries(expected)) {
    const key = page.getByRole('button', { name: new RegExp(`^${upper}${upper.toLowerCase()}$`) });
    await key.click();
    await expect(key).toHaveAttribute('aria-pressed', 'true');
    await expect(word).toHaveText(first);
    await expect(page.locator('[data-vowel-heading]')).toHaveText(upper.toLowerCase());
    await expect(page.locator(`[data-vowel-art="${upper.toLowerCase()}-0"]`)).toBeVisible();
    colours.add(await field.evaluate((el) => getComputedStyle(el).backgroundColor));
  }
  expect(colours.size).toBe(5);

  await page.getByRole('button', { name: /^Aa$/ }).click();
  await expect(word).not.toHaveText('Abeja');
  await page.getByRole('button', { name: 'Escuchar la palabra' }).click();
  const played = await page.evaluate(() => (window as unknown as { __played: string[] }).__played);
  expect(played).toHaveLength(7);
  expect(played.slice(0, 5).map((src) => new URL(src).pathname)).toEqual([
    '/audio/vowels/e-0.mp3',
    '/audio/vowels/i-0.mp3',
    '/audio/vowels/o-0.mp3',
    '/audio/vowels/u-0.mp3',
    '/audio/vowels/a-0.mp3',
  ]);
  expect(new URL(played.at(-1) ?? '').pathname).toBe('/audio/vowels/a-1.mp3');
});

test('the game steps switch the phone screen', async ({ page }) => {
  const steps = page.locator('[data-stage-name]');
  await expect(steps).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await steps.nth(i).click();
    await expect(steps.nth(i)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`[data-stage-screen="${i}"]`)).not.toHaveClass(/opacity-0/);
    await expect(page.locator(`[data-stage-screen="${i}"]`)).toHaveAttribute(
      'aria-hidden',
      'false',
    );
  }
});

test('the navigation reaches each section', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1024, 'section links show from desktop width');
  for (const [label, id] of [
    ['Cómo se juega', 'como'],
    ['Nicaragua', 'palabras'],
    ['Preguntas', 'preguntas'],
  ]) {
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: label })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id} h2`).first()).toBeInViewport();
  }
});

test('every section appears and every picture loads', async ({ page }) => {
  await scrollThrough(page);
  await page.waitForTimeout(800);
  const hidden = await page
    .locator('[data-reveal]:not(.is-visible)')
    .evaluateAll(
      (nodes) => nodes.filter((node) => getComputedStyle(node).display !== 'none').length,
    );
  expect(hidden).toBe(0);

  const broken = await page
    .locator('img')
    .evaluateAll((images) =>
      (images as HTMLImageElement[])
        .filter((img) => img.offsetParent !== null && !(img.complete && img.naturalWidth > 0))
        .map((img) => img.currentSrc || img.src),
    );
  expect(broken).toEqual([]);

  for (const name of ['Sin internet', 'Sin anuncios', 'Tú pones el tiempo']) {
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
  await expect(page.locator('#palabras li')).not.toHaveCount(0);
  await expect(page.locator('#preguntas h3')).toHaveCount(6);
});

test('every vowel clip is served as audio', async ({ request }) => {
  for (const letter of ['a', 'e', 'i', 'o', 'u']) {
    for (const i of [0, 1, 2]) {
      const response = await request.get(`/audio/vowels/${letter}-${i}.mp3`);
      expect(response.status()).toBe(200);
      expect((await response.body()).byteLength).toBeGreaterThan(10_000);
    }
  }
});

test('the footer links work and credit the photos', async ({ page, request }) => {
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Borrar cuenta' })).toHaveCount(0);
  await expect(footer.getByText('CC BY-SA', { exact: false }).first()).toBeAttached();
  await expect(footer.getByText('ElevenLabs', { exact: false })).toBeAttached();
  const hrefs = await footer
    .locator('a[href^="/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
  for (const href of new Set(hrefs.map((href) => href.split('#')[0] || '/'))) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test('the screens page shows every phone screen uncropped', async ({ page }) => {
  await page.goto('/pantallas/');
  await scrollThrough(page);
  const images = page.locator('main figure img');
  await expect(images).toHaveCount(7);
  const ratios = await images.evaluateAll((nodes) =>
    (nodes as HTMLImageElement[]).map((img) => ({
      rendered: img.clientHeight / img.clientWidth,
      natural: img.naturalHeight / img.naturalWidth,
    })),
  );
  for (const { rendered, natural } of ratios) expect(rendered).toBeCloseTo(natural, 1);
});
