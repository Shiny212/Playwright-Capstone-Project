const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  timeout: 240000,
  expect: {
    timeout: 60000,
  },
  retries: 2,
  workers: 1,
  reporter: [
    ["html"],
    ["allure-playwright"]
  ],
  use: {
    headless: true,
    actionTimeout: 90000,
    navigationTimeout: 180000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});