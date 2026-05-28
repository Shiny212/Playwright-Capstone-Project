const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({

  testDir: './tests',

  timeout: 90000,

  expect: {
    timeout: 10000
  },

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: 1,

  workers: 1,

  reporter: [

    ['html', { outputFolder: 'playwright-report' }],

    ['allure-playwright']

  ],

  use: {

    baseURL:
      'https://opensource-demo.orangehrmlive.com/web/index.php',

    headless: true,

    actionTimeout: 30000,

    navigationTimeout: 60000,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    ignoreHTTPSErrors: true

  },

  projects: [

    {
      name: 'chromium',

      use: {

        ...devices['Desktop Chrome'],

        viewport: {
          width: 1536,
          height: 864
        }

      }

    },

    {
      name: 'firefox',

      use: {

        ...devices['Desktop Firefox'],

        viewport: {
          width: 1536,
          height: 864
        },

        launchOptions: {
          slowMo: 300
        }

      }

    },

    {
      name: 'webkit',

      use: {

        ...devices['Desktop Safari'],

        viewport: {
          width: 1536,
          height: 864
        }

      }

    }

  ]

});