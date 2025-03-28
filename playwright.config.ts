import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'dot',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },

    // Save GHA runner time quota by not testing against webkit devices
    ...(isCI
      ? []
      : [
          {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
          },
        ]),
  ],

  webServer: {
    command: 'pnpm next build && pnpm next start -p 3001',
    url: 'http://127.0.0.1:3001',
    reuseExistingServer: false,
  },
});
