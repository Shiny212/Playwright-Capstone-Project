const { test, expect } = require('@playwright/test');

test.describe('Support Functional Tests', () => {

  test('@regression contact us page should open', async ({ page }) => {
    await page.goto('/contactus');

    await expect(page.locator('.page-title')).toContainText('Contact Us');
  });

  test('@negative contact form should validate empty input', async ({ page }) => {
    await page.goto('/contactus');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('.field-validation-error').first()).toBeVisible();
  });

});