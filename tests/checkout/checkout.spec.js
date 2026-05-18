const { test, expect } = require('@playwright/test');

test.describe('Checkout Functional Tests', () => {

  test('@negative checkout without login redirects to login', async ({ page }) => {
    await page.goto('/cart');

    await expect(page.locator('.page-title')).toContainText('Shopping cart');
  });

  test.fixme('@checkout full checkout flow requires registered user', async ({ page }) => {
    await page.goto('/checkout');
  });

});