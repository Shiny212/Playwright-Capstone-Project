const { test, expect } = require('@playwright/test');

test.describe('Orders Functional Tests', () => {

  test('@negative order page redirects guest user to login', async ({ page }) => {
    await page.goto('/customer/orders');

    await expect(page).toHaveURL(/login/);
  });

});