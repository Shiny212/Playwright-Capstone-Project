const { test, expect } = require("@playwright/test");

test.setTimeout(180000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
      return;
    } catch (error) {
      if (i === 2) throw error;
      await page.waitForTimeout(3000);
    }
  }
}

async function login(page) {
  await safeGoto(page, `${baseURL}/auth/login`);

  await page.locator('input[name="username"]').waitFor({
    state: "visible",
    timeout: 60000
  });

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");

  await Promise.all([
    page.waitForURL(/dashboard/, { timeout: 60000 }),
    page.getByRole("button", { name: "Login" }).click()
  ]);
}

async function openAdmin(page) {
  await safeGoto(page, `${baseURL}/admin/viewSystemUsers`);
  await expect(page).toHaveURL(/viewSystemUsers/, { timeout: 60000 });
}

async function openAddUser(page) {
  await safeGoto(page, `${baseURL}/admin/saveSystemUser`);
  await expect(page).toHaveURL(/saveSystemUser/, { timeout: 60000 });
}

test.describe("Admin Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 Username search workflow", async ({ page }) => {
    await openAdmin(page);
    await page.locator(".oxd-input").nth(1).fill("Admin");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewSystemUsers/);
  });

  test("2 Invalid username search workflow", async ({ page }) => {
    await openAdmin(page);
    await page.locator(".oxd-input").nth(1).fill("wronguser123");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewSystemUsers/);
  });

  test("3 Username clear and rewrite workflow", async ({ page }) => {
    await openAdmin(page);
    const username = page.locator(".oxd-input").nth(1);
    await username.fill("WrongUser");
    await username.clear();
    await username.fill("Admin");
    await expect(username).toHaveValue("Admin");
  });

  test("4 User role dropdown filter workflow", async ({ page }) => {
    await openAdmin(page);
    await page.locator(".oxd-select-text").first().click();
    await page.getByRole("option", { name: "Admin" }).click();
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewSystemUsers/);
  });

  test("5 Status dropdown filter workflow", async ({ page }) => {
    await openAdmin(page);
    await page.locator(".oxd-select-text").nth(1).click();
    await page.getByRole("option", { name: "Enabled" }).click();
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewSystemUsers/);
  });

  test("6 Employee autocomplete workflow", async ({ page }) => {
    await openAdmin(page);
    await page.getByPlaceholder("Type for hints...").fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/viewSystemUsers/);
  });

  test("7 Combined user role and status workflow", async ({ page }) => {
    await openAdmin(page);

    await page.locator(".oxd-select-text").first().click();
    await page.getByRole("option", { name: "Admin" }).click();

    await page.locator(".oxd-select-text").nth(1).click();
    await page.getByRole("option", { name: "Enabled" }).click();

    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewSystemUsers/);
  });

  test("8 Add user required validation workflow", async ({ page }) => {
    await openAddUser(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("9 Add user cancel workflow", async ({ page }) => {
    await openAddUser(page);
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewSystemUsers/);
  });

  test("10 Add user role dropdown workflow", async ({ page }) => {
    await openAddUser(page);
    await page.locator(".oxd-select-text").first().click();
    await page.getByRole("option", { name: "Admin" }).click();
    await expect(page).toHaveURL(/saveSystemUser/);
  });

  test("11 Add user status dropdown workflow", async ({ page }) => {
    await openAddUser(page);
    await page.locator(".oxd-select-text").nth(1).click();
    await page.getByRole("option", { name: "Enabled" }).click();
    await expect(page).toHaveURL(/saveSystemUser/);
  });

  test("12 Password mismatch validation workflow", async ({ page }) => {
    await openAddUser(page);
    await page.locator('input[type="password"]').first().fill("Admin123");
    await page.locator('input[type="password"]').nth(1).fill("Wrong123");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Passwords do not match").first()).toBeVisible();
  });

  test("13 Password clear and rewrite workflow", async ({ page }) => {
    await openAddUser(page);

    const password = page.locator('input[type="password"]').first();

    await password.fill("Wrong123");
    await password.clear();
    await password.fill("Admin123");

    await expect(password).toHaveValue("Admin123");
  });

  test("14 Add user employee autocomplete workflow", async ({ page }) => {
    await openAddUser(page);
    await page.getByPlaceholder("Type for hints...").fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/saveSystemUser/);
  });

  test("15 Add user form combined input workflow", async ({ page }) => {
    await openAddUser(page);

    await page.locator(".oxd-select-text").first().click();
    await page.getByRole("option", { name: "Admin" }).click();

    await page.locator(".oxd-select-text").nth(1).click();
    await page.getByRole("option", { name: "Enabled" }).click();

    await page.locator('input[type="password"]').first().fill("Admin123");
    await page.locator('input[type="password"]').nth(1).fill("Admin123");

    await expect(page).toHaveURL(/saveSystemUser/);
  });
});