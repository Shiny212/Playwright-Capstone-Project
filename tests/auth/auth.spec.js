const { test, expect } = require("@playwright/test");

test.setTimeout(180000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function openLogin(page) {
  await page.goto(`${baseURL}/auth/login`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });

  await page.locator('input[name="username"]').waitFor({
    state: "visible",
    timeout: 120000
  });
}

async function login(page) {
  await openLogin(page);

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/, {
    timeout: 120000
  });
}

async function logout(page) {
  const userMenu = page.locator(".oxd-userdropdown-tab");
  await userMenu.waitFor({ state: "visible", timeout: 60000 });
  await userMenu.click();

  const logoutLink = page.locator("a").filter({ hasText: "Logout" }).first();
  await logoutLink.waitFor({ state: "visible", timeout: 60000 });
  await logoutLink.click();

  await expect(page).toHaveURL(/auth\/login/, {
    timeout: 120000
  });
}

test.describe("Authentication Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await openLogin(page);
  });

  test("1 Valid login using click", async ({ page }) => {
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
  });

  test("2 Valid login using keyboard Enter", async ({ page }) => {
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
  });

  test("3 Invalid username and password validation", async ({ page }) => {
    await page.locator('input[name="username"]').fill("wronguser");
    await page.locator('input[name="password"]').fill("wrongpass");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible({ timeout: 60000 });
  });

  test("4 Empty login form validation", async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Required")).toHaveCount(2, { timeout: 60000 });
  });

  test("5 Valid username and empty password validation", async ({ page }) => {
    await page.locator('input[name="username"]').fill("Admin");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("6 Empty username and valid password validation", async ({ page }) => {
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("7 Password masking validation", async ({ page }) => {
    await expect(page.locator('input[name="password"]')).toHaveAttribute("type", "password");
  });

  test("8 Clear wrong credentials and login again", async ({ page }) => {
    await page.locator('input[name="username"]').fill("wronguser");
    await page.locator('input[name="password"]').fill("wrongpass");

    await page.locator('input[name="username"]').clear();
    await page.locator('input[name="password"]').clear();

    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
  });

  test("9 Multiple invalid login attempts", async ({ page }) => {
    await page.locator('input[name="username"]').fill("test1");
    await page.locator('input[name="password"]').fill("test1");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible({ timeout: 60000 });

    await page.locator('input[name="username"]').clear();
    await page.locator('input[name="password"]').clear();

    await page.locator('input[name="username"]').fill("test2");
    await page.locator('input[name="password"]').fill("test2");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible({ timeout: 60000 });
  });

  test("10 Direct dashboard access without login", async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/index`, {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });

    await expect(page).toHaveURL(/auth\/login/, { timeout: 120000 });
  });

  test("11 Logout should destroy user session", async ({ page }) => {
    await login(page);
    await logout(page);
  });

  test("12 Browser back after logout should not restore dashboard", async ({ page }) => {
    await login(page);
    await logout(page);

    await page.goBack();
    await page.waitForTimeout(3000);

    await expect(page).not.toHaveURL(/dashboard/);
  });

  test("13 Reload login page and login again", async ({ page }) => {
    await page.reload();

    await page.locator('input[name="username"]').waitFor({
      state: "visible",
      timeout: 120000
    });

    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
  });

  test("14 Login with only spaces should not allow dashboard", async ({ page }) => {
    await page.locator('input[name="username"]').fill("   ");
    await page.locator('input[name="password"]').fill("   ");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).not.toHaveURL(/dashboard/);
  });

  test("15 Failed login followed by successful login", async ({ page }) => {
    await page.locator('input[name="username"]').fill("wronguser");
    await page.locator('input[name="password"]').fill("wrongpass");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible({ timeout: 60000 });

    await page.locator('input[name="username"]').clear();
    await page.locator('input[name="password"]').clear();

    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
  });
});