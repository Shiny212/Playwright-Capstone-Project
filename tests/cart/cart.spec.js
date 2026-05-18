const { test, expect } = require('@playwright/test');

test.describe('Cart Functional Tests', () => {

  test('@smoke add product to cart', async ({ page }) => {
    await page.goto('/books');

    await page.locator('.product-item').first().getByRole('button', { name: /Add to cart/ }).click();

    await expect(page.locator('.bar-notification')).toContainText('The product has been added');
  });

  test('@regression open shopping cart', async ({ page }) => {
    await page.goto('/cart');

    await expect(page.locator('.cart')).toBeVisible();
  });

});