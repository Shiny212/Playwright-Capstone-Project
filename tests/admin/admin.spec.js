import { test, expect } from "@playwright/test";

test.setTimeout(90000);

async function login(page) {
  await page.goto(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    {
      waitUntil: "domcontentloaded",
      timeout: 60000
    }
  );

  await page.locator('input[name="username"]').waitFor({
    state: "visible",
    timeout: 60000
  });

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/, {
    timeout: 60000
  });
}

async function openAdmin(page) {
  await page.getByRole("link", { name: /^Admin$/ }).click();

  await expect(page).toHaveURL(/admin/, {
    timeout: 60000
  });
}

async function openAddUser(page) {
  await page.getByRole("button", { name: /Add|Añadir/ }).click();

  await page.waitForURL(/saveSystemUser/, {
    timeout: 60000
  });
}

test.describe("Admin User Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openAdmin(page);
  });

  test("1 Open Admin module", async ({ page }) => {
    await expect(page).toHaveURL(/admin/);
  });

  test("2 Search existing admin user", async ({ page }) => {
    await page.locator(".oxd-input").nth(1).fill("Admin");
    await page.getByRole("button", { name: /Search|Buscar/ }).click();

    await expect(page.locator(".oxd-table")).toBeVisible({
      timeout: 30000
    });
  });

  test("3 Reset search filters", async ({ page }) => {
    await page.locator(".oxd-input").nth(1).fill("Admin");
    await page.getByRole("button", { name: /Reset|Restablecer/ }).click();

    await expect(page.locator(".oxd-input").nth(1)).toHaveValue("");
  });

  test("4 Open Add User form", async ({ page }) => {
    await openAddUser(page);

    await expect(page).toHaveURL(/saveSystemUser/);
  });

  test("5 Required validation on empty Add User form", async ({ page }) => {
    await openAddUser(page);

    await page.getByRole("button", { name: /Save|Guardar/ }).click();

    await expect(
      page.locator(".oxd-input-field-error-message").first()
    ).toBeVisible({
      timeout: 30000
    });
  });

  test("6 User role dropdown should open", async ({ page }) => {
    await openAddUser(page);

    await page.locator(".oxd-select-text").first().click();

    await expect(page.locator(".oxd-select-dropdown")).toBeVisible({
      timeout: 30000
    });
  });

  test("7 Employee name field should be available", async ({ page }) => {
    await openAddUser(page);

    await expect(page.locator('input[placeholder]').first()).toBeVisible({
      timeout: 30000
    });
  });

  test("8 Username field should be available", async ({ page }) => {
    await openAddUser(page);

    await expect(page.locator(".oxd-input").nth(1)).toBeVisible({
      timeout: 30000
    });
  });

  test("9 Password field should be available", async ({ page }) => {
    await openAddUser(page);

    await expect(page.locator('input[type="password"]').first()).toBeVisible({
      timeout: 30000
    });
  });

  test("10 Confirm password field should be available", async ({ page }) => {
    await openAddUser(page);

    await expect(page.locator('input[type="password"]').nth(1)).toBeVisible({
      timeout: 30000
    });
  });

  test("11 Search button should be visible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Search|Buscar/ })
    ).toBeVisible({
      timeout: 30000
    });
  });

  test("12 User table should be visible", async ({ page }) => {
    await expect(page.locator(".oxd-table")).toBeVisible({
      timeout: 30000
    });
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

  test("14 Soft assertion on Admin page", async ({ page }) => {
    await expect.soft(page).toHaveURL(/admin/);
    await expect.soft(page.locator(".oxd-table")).toBeVisible();
  });

  test("15 Logout from Admin module", async ({ page }) => {
    await page.locator(".oxd-userdropdown-name").click();
    await page.getByText(/Logout|Cerrar sesión/).click();

    await expect(page).toHaveURL(/login/, {
      timeout: 60000
    });
  });
});