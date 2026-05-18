const { test, expect } = require('@playwright/test');

test.describe('API Testing', () => {

  test('@api home page API should return 200', async ({ request }) => {
    const response = await request.get('http://demowebshop.tricentis.com/');

    expect(response.status()).toBe(200);
  });

  test('@api login page should return 200', async ({ request }) => {
    const response = await request.get('http://demowebshop.tricentis.com/login');

    expect(response.status()).toBe(200);
  });

});