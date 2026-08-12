import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'https://conduit.bondaracademy.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false,
      },
    ],
  ],

  use: {
    baseURL,
    // Run headless in CI, otherwise show UI for local debugging
    headless: !!process.env.CI,
    // Enable trace collection on first retry for flaky test analysis
    trace: 'on-first-retry',
    // Capture screenshots only on failure to keep reports clean
    screenshot: 'only-on-failure',
    // Keep videos of failed runs for debugging
    video: 'retain-on-failure',
    // Extend timeouts for actions and navigation to accommodate slower environments
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    // Enable video recording for all browsers
    recordVideo: { dir: 'videos/', size: { width: 1280, height: 720 } },
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 14'],
        // Reuse authenticated state
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
