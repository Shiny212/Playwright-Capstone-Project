const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/login.page');

test.describe('Authentication Tests', () => {

  test('@smoke valid login page should open', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.openLogin();

    await expect(page.locator('#Email')).toBeVisible();
    await expect(page.locator('#Password')).toBeVisible();
  });

  test('@negative invalid login should show error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.openLogin();
    await loginPage.login('wrong@gmail.com', 'wrongpassword');

    await expect(page.locator('.validation-summary-errors')).toContainText('Login was unsuccessful');
  });

});