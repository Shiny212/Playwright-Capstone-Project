const { test, expect } = require("@playwright/test");


// Login function for OrangeHRM
async function login(page) {

  await page.goto(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    {
      waitUntil: "domcontentloaded",
      timeout: 60000
    }
  );

  const username = page.locator('input[name="username"]');
  const password = page.locator('input[name="password"]');

  await username.waitFor({
    state: "visible",
    timeout: 60000
  });

  await username.fill("Admin");

  await password.fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/, {
    timeout: 60000
  });

}


// Open Admin module
async function openAdmin(page) {

  await page.locator(".oxd-sidepanel-body").waitFor({
    state: "visible",
    timeout: 60000
  });

  const adminMenu = page.getByRole("link", {
    name: /^Admin$/
  });

  await adminMenu.waitFor({
    state: "visible",
    timeout: 60000
  });

  await adminMenu.click();

  await expect(page).toHaveURL(/admin/, {
    timeout: 60000
  });

}


// Admin module tests
test.describe("Admin User Management", () => {

  test.beforeEach(async ({ page }) => {

    await login(page);

    await openAdmin(page);

  });


  test("1 Admin page should open", async ({ page }) => {

    await expect(page).toHaveURL(/admin/);

  });


  test("2 System Users heading should be visible", async ({ page }) => {

    await expect(
      page.getByText("System Users")
    ).toBeVisible();

  });


  test("3 Username search field should accept input", async ({ page }) => {

    const usernameField = page.locator(".oxd-input").nth(1);

    await usernameField.fill("Admin");

    await expect(usernameField).toHaveValue("Admin");

  });


  test("4 Search valid username", async ({ page }) => {

    const usernameField = page.locator(".oxd-input").nth(1);

    await usernameField.fill("Admin");

    await page.getByRole("button", { name: "Search" }).click();

    await expect(
      page.getByRole("button", { name: "Search" })
    ).toBeVisible();

  });


  test("5 Search invalid username", async ({ page }) => {

    const usernameField = page.locator(".oxd-input").nth(1);

    await usernameField.fill("wronguser12345");

    await page.getByRole("button", { name: "Search" }).click();

    await expect(
      page.getByRole("button", { name: "Search" })
    ).toBeVisible();

  });


  test("6 Reset button should clear username field", async ({ page }) => {

    const usernameField = page.locator(".oxd-input").nth(1);

    await usernameField.fill("Admin");

    await page.getByRole("button", { name: "Reset" }).click();

    await expect(usernameField).toHaveValue("");

  });


  test("7 Add user page should open", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(page).toHaveURL(/saveSystemUser/);

  });


  test("8 Username field should be available", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(
      page.locator(".oxd-input").nth(1)
    ).toBeVisible();

  });


  test("9 Password field should be available", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(
      page.locator('input[type="password"]').first()
    ).toBeVisible();

  });


  test("10 Confirm password field should be available", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(
      page.locator('input[type="password"]').nth(1)
    ).toBeVisible();

  });


  test("11 Search button should be visible", async ({ page }) => {

    await expect(
      page.getByRole("button", { name: "Search" })
    ).toBeVisible();

  });


  test("12 User table should be visible", async ({ page }) => {

    await expect(
      page.locator(".oxd-table-body")
    ).toBeVisible();

  });


  test("13 Admin page should refresh successfully", async ({ page }) => {

    await page.reload({
      waitUntil: "domcontentloaded"
    });

    await expect(page).toHaveURL(/admin/);

  });


  test("14 Admin action buttons should be available", async ({ page }) => {

    await expect(
      page.locator(".oxd-table-cell-actions button").first()
    ).toBeVisible();

  });


  test("15 Logout from Admin module", async ({ page }) => {

    await page.locator(".oxd-userdropdown-tab").click();

    await page.getByRole("menuitem", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/, {
      timeout: 60000
    });

  });

});