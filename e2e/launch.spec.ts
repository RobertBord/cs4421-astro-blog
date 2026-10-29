import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const paths = ['/', '/blog/', '/about/', '/blog/f2-drivers-rumoured-to-join-f1/', '/blog/can-madrid-deliver-on-its-f1-promise/', '/blog/category/race-analysis/'];

for (const path of paths) {
	test(`accessible responsive page ${path}`, async ({ page }, testInfo) => {
		const errors: string[] = [];
		page.on('pageerror', error => errors.push(error.message));
		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page.locator('h1')).toHaveCount(1);
		await expect(page).toHaveTitle(/F1 bits/);
		await page.evaluate(() => document.fonts.ready);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		for (const image of await page.locator('img').all()) {
			await image.scrollIntoViewIfNeeded();
			await expect(image).toBeVisible();
			await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
		}
		const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
		expect(results.violations).toEqual([]);
		expect(errors).toEqual([]);
		await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
	});
}

test('category navigation, empty state, and reset work without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('http://127.0.0.1:4497/blog/');
	await page.getByRole('link', { name: 'Circuits', exact: true }).click();
	await expect(page.locator('h1')).toHaveText('Circuits');
	await expect(page.locator('.topics [aria-current="page"]')).toHaveText('Circuits');
	await expect(page.locator('.stories article')).toHaveCount(1);
	await page.getByRole('link', { name: 'Race Analysis', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'No stories here yet.' })).toBeVisible();
	await page.getByRole('link', { name: 'Browse all articles' }).click();
	await expect(page.locator('.stories article')).toHaveCount(2);
	await context.close();
});

test('keyboard skip link and article navigation work', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Tab');
	await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator('#main')).toBeFocused();
	await page.getByRole('link', { name: 'F2 drivers rumoured to join F1', exact: true }).click();
	await expect(page.locator('.rumour')).toContainText('not a confirmed signing');
	await expect(page.locator('nav[aria-label="Main navigation"] [aria-current="page"]')).toHaveText('Articles');
	await expect(page.locator('.related article')).toHaveCount(1);
});

test('feed and article metadata are valid under SSR', async ({ request, page }) => {
	const feed = await request.get('/rss.xml');
	expect(feed.ok()).toBe(true);
	const xml = await feed.text();
	expect(xml).toContain('<title>F1 bits</title>');
	expect(xml.match(/<item>/g)).toHaveLength(2);
	expect(xml).not.toContain('first-post');
	await page.goto('/blog/can-madrid-deliver-on-its-f1-promise/');
	await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Can Madrid deliver on its F1 promise? | F1 bits');
	const image = await page.locator('meta[property="og:image"]').getAttribute('content');
	expect((await request.get(new URL(image!).pathname)).ok()).toBe(true);
});

test('Markdown and MDX article bodies render on direct requests', async ({ page }) => {
	await page.goto('/blog/f2-drivers-rumoured-to-join-f1/');
	await expect(page.locator('.prose')).toContainText('Andrea Kimi Antonelli');
	await expect(page.locator('.rumour')).toContainText('not a confirmed signing');
	await page.goto('/blog/can-madrid-deliver-on-its-f1-promise/');
	await expect(page.locator('.prose')).toContainText('FIA homologation');
	await expect(page.getByRole('table')).toBeVisible();
});

test('unknown articles and categories return HTTP 404', async ({ request }) => {
	for (const path of ['/blog/does-not-exist/', '/blog/category/does-not-exist/', '/blog/first-post/']) {
		expect((await request.get(path)).status()).toBe(404);
	}
});

test('draft articles are unavailable and absent from discovery', async ({ request }) => {
	expect((await request.get('/blog/draft-preview-check/')).status()).toBe(404);
	for (const path of ['/', '/blog/', '/blog/category/race-analysis/', '/rss.xml', '/blog/f2-drivers-rumoured-to-join-f1/']) {
		const response = await request.get(path);
		expect(response.ok()).toBe(true);
		expect(await response.text()).not.toContain('Draft publication regression fixture');
		expect(await response.text()).not.toContain('/blog/draft-preview-check/');
	}
});

test('compact and wide layouts keep headlines and navigation within the viewport', async ({ page }) => {
	for (const width of [320, 768, 1920]) {
		await page.setViewportSize({ width, height: 900 });
		for (const path of ['/', '/blog/', '/blog/f2-drivers-rumoured-to-join-f1/']) {
			await page.goto(path);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
			await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
		}
	}
});