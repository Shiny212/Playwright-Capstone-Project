// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({

    testDir: './tests',

    timeout: 60000,

    fullyParallel: false,

    workers: 1,

    retries: 0,

    reporter: [
        ['html'],
        ['allure-playwright' , { resultsDir: 'allure-results' }]
    ],

    use: {
        baseURL: 'https://opensource-demo.orangehrmlive.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },

    projects: [
        {
            name: 'setup',
            testMatch: /setup\/auth\.setup\.js/
        },

        {
            name: 'chromium',
            testIgnore: /setup\/auth\.setup\.js/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'storageState.json'
            },
            dependencies: ['setup']
        },

        {
            name: 'firefox',
            testIgnore: /setup\/auth\.setup\.js/,
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'storageState.json'
            },
            dependencies: ['setup']
        }
    ]

});