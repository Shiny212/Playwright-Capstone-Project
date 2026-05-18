const { test, expect } = require('@playwright/test');
const ProductPage = require('../../pages/product.page');

test.describe('Product Functional Tests', () => {

  test('@regression user should open books category', async ({ page }) => {
    const productPage = new ProductPage(page);

    await page.goto('/');
    await productPage.openBooksCategory();

    await expect(page).toHaveURL(/books/);
  });

  test('@regression user should search product', async ({ page }) => {
    const productPage = new ProductPage(page);

    await page.goto('/');
    await productPage.searchProduct('computer');

    await expect(page.locator('.product-grid')).toBeVisible();
  });

});