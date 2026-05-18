const { test, expect } = require('@playwright/test');
const ProductPage = require('../../pages/product.page');

test.describe('Search Functional Tests', () => {

  test('@smoke search should return results', async ({ page }) => {
    const productPage = new ProductPage(page);

    await page.goto('/');
    await productPage.searchProduct('book');

    await expect(page.locator('.product-item').first()).toBeVisible();
  });

  test('@negative search invalid product should show no result', async ({ page }) => {
    const productPage = new ProductPage(page);

    await page.goto('/');
    await productPage.searchProduct('xyznotavailable');

    await expect(page.locator('.search-results')).toContainText('No products were found');
  });

});