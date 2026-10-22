import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	use: { baseURL: 'http://127.0.0.1:4497', trace: 'retain-on-failure' },
	webServer: {
		command: 'npm run build && npx vite preview --host 127.0.0.1 --port 4497 --strictPort',
		url: 'http://127.0.0.1:4497',
		reuseExistingServer: false,
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
	],
});