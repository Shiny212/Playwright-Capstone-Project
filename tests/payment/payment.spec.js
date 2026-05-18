const { test, expect } = require('@playwright/test');

test.describe('Payment Functional Tests', () => {

  test.fixme('@payment payment flow requires checkout session', async ({ page }) => {
    await page.goto('/checkout');
  });

  test('@negative payment page should not be accessible directly', async ({ page }) => {
    await page.goto('/checkout');

    await expect(page).not.toHaveURL(/payment/);
  });

});