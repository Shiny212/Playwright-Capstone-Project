import { test, expect } from "@playwright/test";

test.setTimeout(90000);

async function login(page) {
  await page.goto(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    { waitUntil: "domcontentloaded", timeout: 60000 }
  );

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });
}

async function openPIM(page) {
  await page.getByRole("link", { name: /^PIM$/ }).click();

  await expect(page).toHaveURL(/pim/, { timeout: 60000 });
}

async function openAddEmployee(page) {
  await page.getByRole("link", { name: /Add Employee/ }).click();

  await expect(page).toHaveURL(/addEmployee/, { timeout: 60000 });
}

test.describe("PIM Employee Management", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await openPIM(page);
  });

  test("1 Open PIM module", async ({ page }) => {
    await expect(page).toHaveURL(/pim/);
  });

  test("2 Employee list table should be visible", async ({ page }) => {
    await expect(page.locator(".oxd-table")).toBeVisible({ timeout: 30000 });
  });

  test("3 Search employee by name", async ({ page }) => {
    await page.locator(".oxd-input").nth(1).fill("Linda");
    await page.getByRole("button", { name: /Search|Buscar/ }).click();

    await expect(page.locator(".oxd-table")).toBeVisible({ timeout: 30000 });
  });

  test("4 Reset employee filters", async ({ page }) => {
    await page.locator(".oxd-input").nth(1).fill("Linda");
    await page.getByRole("button", { name: /Reset|Restablecer/ }).click();

    await expect(page.locator(".oxd-input").nth(1)).toHaveValue("");
  });

  test("5 Open Add Employee form", async ({ page }) => {
    await openAddEmployee(page);

    await expect(page.locator('input[name="firstName"]')).toBeVisible();
  });

  test("6 Required validation on empty employee form", async ({ page }) => {
    await openAddEmployee(page);

    await page.getByRole("button", { name: /Save|Guardar/ }).click();

    await expect(
      page.locator(".oxd-input-field-error-message").first()
    ).toBeVisible({ timeout: 30000 });
  });

  test("7 First name field should accept input", async ({ page }) => {
    await openAddEmployee(page);

    await page.locator('input[name="firstName"]').fill("Test");
    await expect(page.locator('input[name="firstName"]')).toHaveValue("Test");
  });

  test("8 Middle name field should accept input", async ({ page }) => {
    await openAddEmployee(page);

    await page.locator('input[name="middleName"]').fill("Automation");
    await expect(page.locator('input[name="middleName"]')).toHaveValue("Automation");
  });

  test("9 Last name field should accept input", async ({ page }) => {
    await openAddEmployee(page);

    await page.locator('input[name="lastName"]').fill("User");
    await expect(page.locator('input[name="lastName"]')).toHaveValue("User");
  });

  test("10 Employee ID field should be available", async ({ page }) => {
    await openAddEmployee(page);

    await expect(page.locator(".oxd-input").last()).toBeVisible({
      timeout: 30000
    });
  });

  test("11 Create Login Details toggle should work", async ({ page }) => {
    await openAddEmployee(page);

    await page.locator(".oxd-switch-input").click();

    await expect(page.locator('input[type="password"]').first()).toBeVisible({
      timeout: 30000
    });
  });

  test("12 Employee image upload control should exist", async ({ page }) => {
    await openAddEmployee(page);

    const uploadInput = page.locator('input[type="file"]');

    await expect(uploadInput).toBeAttached();
  });

  test("13 Pagination validation if available", async ({ page }) => {
    const pagination = page.locator(".oxd-pagination");

    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();
    } else {
      console.log("Pagination not available because records fit on one page");
      expect(true).toBeTruthy();
    }
  });

  test("14 Soft assertion on PIM page", async ({ page }) => {
    await expect.soft(page).toHaveURL(/pim/);
    await expect.soft(page.locator(".oxd-table")).toBeVisible();
  });

  test("15 Logout from PIM module", async ({ page }) => {
    await page.locator(".oxd-userdropdown-name").click();
    await page.getByText(/Logout|Cerrar sesión/).click();

    await expect(page).toHaveURL(/login/, { timeout: 60000 });
  });

});