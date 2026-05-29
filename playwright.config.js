const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  timeout: 120000,

  expect: {
    timeout: 15000
  },

  fullyParallel: false,

  workers: 1,

  retries: 2,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright']
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php',

    headless: true,

    actionTimeout: 60000,

    navigationTimeout: 120000,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    ignoreHTTPSErrors: true,

    viewport: {
      width: 1536,
      height: 864
    }
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          slowMo: 300
        }
      }
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          slowMo: 300
        }
      }
    }
  ]
});