// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  timeout: 90000,

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: 1,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    ["allure-playwright", { resultsDir: "allure-results" }]
  ],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]

});