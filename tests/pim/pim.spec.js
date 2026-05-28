const { test, expect } = require("@playwright/test");


// Login function
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

  await page.getByRole("button", {
    name: "Login"
  }).click();

  await expect(page).toHaveURL(/dashboard/, {
    timeout: 60000
  });

}


// Open PIM module
async function openPIM(page) {

  await page.locator(".oxd-sidepanel-body").waitFor({
    state: "visible",
    timeout: 60000
  });

  const pimMenu = page.getByRole("link", {
    name: /^PIM$/
  });

  await pimMenu.waitFor({
    state: "visible",
    timeout: 60000
  });

  await pimMenu.click();

  await expect(page).toHaveURL(/pim/, {
    timeout: 60000
  });

}


// PIM Tests
test.describe("PIM Employee Management", () => {

  test.beforeEach(async ({ page }) => {

    await login(page);

    await openPIM(page);

  });


  test("1 PIM page should open", async ({ page }) => {

    await expect(page).toHaveURL(/pim/);

  });


  test("2 Employee Information heading should be visible", async ({ page }) => {

    await expect(
      page.getByText("Employee Information")
    ).toBeVisible();

  });


  test("3 Employee name field should accept input", async ({ page }) => {

    const employeeField = page.locator(
      ".oxd-autocomplete-text-input input"
    ).first();

    await employeeField.fill("Linda");

    await expect(employeeField).toHaveValue("Linda");

  });


  test("4 Employee ID field should accept input", async ({ page }) => {

    const employeeId = page.locator(".oxd-input").nth(1);

    await employeeId.fill("1234");

    await expect(employeeId).toHaveValue("1234");

  });


  test("5 Search button should be visible", async ({ page }) => {

    await expect(
      page.getByRole("button", { name: "Search" })
    ).toBeVisible();

  });


  test("6 Reset button should be visible", async ({ page }) => {

    await expect(
      page.getByRole("button", { name: "Reset" })
    ).toBeVisible();

  });


  test("7 Add Employee page should open", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(page).toHaveURL(/addEmployee/);

  });


  test("8 First Name field should be visible", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(
      page.locator('input[name="firstName"]')
    ).toBeVisible();

  });


  test("9 Middle Name field should be visible", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(
      page.locator('input[name="middleName"]')
    ).toBeVisible();

  });


  test("10 Last Name field should be visible", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(
      page.locator('input[name="lastName"]')
    ).toBeVisible();

  });


  test("11 Save button should be visible", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(
      page.getByRole("button", { name: "Save" })
    ).toBeVisible();

  });


  test("12 Cancel button should be visible", async ({ page }) => {

    await page.getByRole("button", { name: "Add" }).click();

    await expect(
      page.getByRole("button", { name: "Cancel" })
    ).toBeVisible();

  });


  test("13 Employee table should be visible", async ({ page }) => {

    await expect(
      page.locator(".oxd-table-body")
    ).toBeVisible();

  });


  test("14 PIM page should refresh successfully", async ({ page }) => {

    await page.reload({
      waitUntil: "domcontentloaded"
    });

    await expect(page).toHaveURL(/pim/);

  });


  test("15 Logout from PIM module", async ({ page }) => {

    await page.locator(".oxd-userdropdown-tab").click();

    await page.getByRole("menuitem", {
      name: "Logout"
    }).click();

    await expect(page).toHaveURL(/login/, {
      timeout: 60000
    });

  });

});