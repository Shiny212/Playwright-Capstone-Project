const { test, expect } = require('@playwright/test');

test.describe('Wishlist Functional Tests', () => {

  test('@regression wishlist page should open', async ({ page }) => {
    await page.goto('/wishlist');

    await expect(page.locator('.wishlist-content')).toBeVisible();
  });

  test('@negative empty wishlist should show message', async ({ page }) => {
    await page.goto('/wishlist');

    await expect(page.locator('.wishlist-content')).toContainText('The wishlist is empty');
  });

});