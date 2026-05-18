const { test, expect } = require('@playwright/test');

test.describe('Profile Functional Tests', () => {

  test('@negative account page redirects for guest user', async ({ page }) => {
    await page.goto('/customer/info');

    await expect(page).toHaveURL(/login/);
  });

  test.fixme('@profile update profile requires login', async ({ page }) => {
    await page.goto('/customer/info');
  });

});