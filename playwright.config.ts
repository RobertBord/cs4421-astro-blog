import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	use: { baseURL: 'http://127.0.0.1:4497', trace: 'retain-on-failure' },
	webServer: {
		command: 'npm run build && node dist/server/entry.mjs',
		env: { HOST: '127.0.0.1', PORT: '4497' },
		url: 'http://127.0.0.1:4497',
		reuseExistingServer: false,
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
	],
});